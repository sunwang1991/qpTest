"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Oauth2TokenService = void 0;
const core_1 = require("@midwayjs/core");
const jsonwebtoken_1 = require("jsonwebtoken");
const token_1 = require("../constants/token");
const cache_key_1 = require("../constants/cache_key");
const redis_1 = require("../datasource/redis/redis");
const config_1 = require("../config/config");
const parse_1 = require("../utils/parse/parse");
const oauth2_info_1 = require("./oauth2_info");
/**第三方客户端令牌工具验证处理 */
let Oauth2TokenService = exports.Oauth2TokenService = class Oauth2TokenService {
    /**缓存服务 */
    redis;
    /**配置信息 */
    config;
    /**
     * 生成令牌
     * @param clientId 客户端ID
     * @param deviceFingerprint 设备指纹 SHA256
     * @param tokenType 令牌类型 access:访问令牌 refresh:刷新令牌
     * @returns [令牌, 过期时间]
     */
    async oauth2TokenCreate(clientId, deviceFingerprint, tokenType) {
        // 令牌算法 HS256 HS384 HS512
        const algorithm = this.config.get('jwt.algorithm');
        let method = undefined;
        switch (algorithm) {
            case 'HS512':
                method = 'HS512';
                break;
            case 'HS384':
                method = 'HS384';
                break;
            case 'HS256':
            default:
                method = 'HS256';
        }
        // 生成令牌设置密钥
        let secret = this.config.get('jwt.secret');
        // 设置令牌过期时间
        const now = Math.round(Date.now() / 1000);
        let exp = now;
        if (tokenType === 'access') {
            const expiresIn = (0, parse_1.parseNumber)(this.config.get('jwt.expiresIn'));
            exp = now + expiresIn * 60;
            secret = 'Oauth2_Access:' + secret;
        }
        if (tokenType === 'refresh') {
            const refreshIn = (0, parse_1.parseNumber)(this.config.get('jwt.refreshIn'));
            exp = now + refreshIn * 60;
            secret = 'Oauth2_Refresh:' + secret;
        }
        // 生成令牌负荷绑定uuid标识
        const jwtToken = {
            [token_1.JWT_DEVICE_ID]: deviceFingerprint,
            [token_1.JWT_CLIENT_ID]: clientId,
            exp: exp,
            iat: now,
            nbf: now - 10, // 生效时间
        };
        const tokenStr = (0, jsonwebtoken_1.sign)(jwtToken, secret, { algorithm: method });
        const expSeconds = Math.round(exp - now);
        return [tokenStr, expSeconds];
    }
    /**
     * 校验令牌是否有效
     * @param tokenStr 身份令牌
     * @param tokenType 令牌类型 access:访问令牌 refresh:刷新令牌
     * @returns [令牌负荷, 错误信息]
     */
    async oauth2TokenVerify(tokenStr, tokenType) {
        try {
            // 判断加密算法是预期的加密算法
            let secret = this.config.get('jwt.secret');
            if (tokenType === 'access') {
                secret = 'Oauth2_Access:' + secret;
            }
            if (tokenType === 'refresh') {
                secret = 'Oauth2_Refresh:' + secret;
            }
            const jwtToken = (0, jsonwebtoken_1.verify)(tokenStr, secret);
            if (jwtToken) {
                return [jwtToken, ''];
            }
        }
        catch (e) {
            console.error(e.name, '=>', e.message);
            return [null, 'token invalid'];
        }
        return [null, 'token valid error'];
    }
    /**
     * 清除登录第三方客户端信息
     * @param tokenStr 身份令牌
     * @returns [用户名, 错误信息]
     */
    async oauth2InfoRemove(tokenStr) {
        const [claims, err] = await this.oauth2TokenVerify(tokenStr, 'access');
        if (err != '') {
            return ['', err];
        }
        const deviceId = claims[token_1.JWT_DEVICE_ID];
        if (deviceId && deviceId != '') {
            // 清除缓存KEY
            const tokenKey = cache_key_1.CACHE_OAUTH2_DEVICE + ':' + deviceId;
            const rows = await this.redis.del('', tokenKey);
            if (rows > 0) {
                return [claims[token_1.JWT_CLIENT_ID], ''];
            }
        }
        return ['', 'token invalid'];
    }
    /**
     * 生成访问第三方客户端信息缓存
     * @param info 登录用户信息对象
     * @param deviceFingerprint 设备指纹 SHA256
     * @param ilobArr 登录客户端信息 [IP, 地点, 系统, 浏览器]
     * @returns 登录用户信息对象
     */
    async oauth2InfoCreate(info, deviceFingerprint, ilobArr) {
        info.deviceId = deviceFingerprint;
        // 设置请求用户登录客户端
        info.loginIp = ilobArr[0];
        info.loginLocation = ilobArr[1];
        info.os = ilobArr[2];
        info.browser = ilobArr[3];
        const expiresIn = (0, parse_1.parseNumber)(this.config.get('jwt.expiresIn'));
        const now = Date.now();
        const exp = now + expiresIn * 60 * 1000;
        info.loginTime = now;
        info.expireTime = exp;
        // 登录信息标识缓存
        const tokenKey = cache_key_1.CACHE_OAUTH2_DEVICE + ':' + info.deviceId;
        await this.redis.set('', tokenKey, JSON.stringify(info), Math.round(expiresIn * 60));
        return info;
    }
    /**
     * 更新访问第三方客户端信息缓存
     * @param info 登录用户信息对象
     */
    async oauth2InfoUpdate(info) {
        // 登录信息标识缓存
        const tokenKey = cache_key_1.CACHE_OAUTH2_DEVICE + ':' + info.deviceId;
        const expiration = await this.redis.getExpire('', tokenKey);
        await this.redis.set('', tokenKey, JSON.stringify(info), expiration);
    }
    /**
     * 缓存的登录第三方客户端信息
     * @param claims 令牌信息
     * @returns 身份信息
     */
    async oauth2InfoGet(claims) {
        const info = new oauth2_info_1.Oauth2Info();
        const deviceId = claims[token_1.JWT_DEVICE_ID];
        const tokenKey = cache_key_1.CACHE_OAUTH2_DEVICE + ':' + deviceId;
        const hasKey = await this.redis.has('', tokenKey);
        if (hasKey > 0) {
            const infoStr = await this.redis.get('', tokenKey);
            if (infoStr) {
                try {
                    return JSON.parse(infoStr);
                }
                catch (e) {
                    console.error(e.name, 'parse =>', e.message);
                }
            }
        }
        return info;
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", redis_1.RedisCache)
], Oauth2TokenService.prototype, "redis", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", config_1.GlobalConfig)
], Oauth2TokenService.prototype, "config", void 0);
exports.Oauth2TokenService = Oauth2TokenService = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], Oauth2TokenService);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2F1dGgyX3Rva2VuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2ZyYW1ld29yay90b2tlbi9vYXV0aDJfdG9rZW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEseUNBQTREO0FBQzVELCtDQUF1RDtBQUV2RCw4Q0FBa0U7QUFDbEUsc0RBQTZEO0FBQzdELHFEQUF1RDtBQUN2RCw2Q0FBZ0Q7QUFDaEQsZ0RBQW1EO0FBQ25ELCtDQUEyQztBQUUzQyxvQkFBb0I7QUFHYixJQUFNLGtCQUFrQixnQ0FBeEIsTUFBTSxrQkFBa0I7SUFDN0IsVUFBVTtJQUVGLEtBQUssQ0FBYTtJQUUxQixVQUFVO0lBRUYsTUFBTSxDQUFlO0lBRTdCOzs7Ozs7T0FNRztJQUNJLEtBQUssQ0FBQyxpQkFBaUIsQ0FDNUIsUUFBZ0IsRUFDaEIsaUJBQXlCLEVBQ3pCLFNBQStCO1FBRS9CLHlCQUF5QjtRQUN6QixNQUFNLFNBQVMsR0FBVyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUMzRCxJQUFJLE1BQU0sR0FBYyxTQUFTLENBQUM7UUFDbEMsUUFBUSxTQUFTLEVBQUU7WUFDakIsS0FBSyxPQUFPO2dCQUNWLE1BQU0sR0FBRyxPQUFPLENBQUM7Z0JBQ2pCLE1BQU07WUFDUixLQUFLLE9BQU87Z0JBQ1YsTUFBTSxHQUFHLE9BQU8sQ0FBQztnQkFDakIsTUFBTTtZQUNSLEtBQUssT0FBTyxDQUFDO1lBQ2I7Z0JBQ0UsTUFBTSxHQUFHLE9BQU8sQ0FBQztTQUNwQjtRQUNELFdBQVc7UUFDWCxJQUFJLE1BQU0sR0FBVyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNuRCxXQUFXO1FBQ1gsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDMUMsSUFBSSxH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