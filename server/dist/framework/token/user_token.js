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
exports.UserTokenService = void 0;
const core_1 = require("@midwayjs/core");
const jsonwebtoken_1 = require("jsonwebtoken");
const token_1 = require("../constants/token");
const cache_key_1 = require("../constants/cache_key");
const redis_1 = require("../datasource/redis/redis");
const config_1 = require("../config/config");
const parse_1 = require("../utils/parse/parse");
const user_info_1 = require("./user_info");
/**系统用户令牌工具验证处理 */
let UserTokenService = exports.UserTokenService = class UserTokenService {
    /**缓存服务 */
    redis;
    /**配置信息 */
    config;
    /**
     * 生成令牌
     * @param userId 用户ID
     * @param deviceFingerprint 设备指纹 SHA256
     * @param tokenType 令牌类型 access:访问令牌 refresh:刷新令牌
     * @returns [令牌, 过期时间]
     */
    async userTokenCreate(userId, deviceFingerprint, tokenType) {
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
            secret = 'User_Access:' + secret;
        }
        if (tokenType === 'refresh') {
            const refreshIn = (0, parse_1.parseNumber)(this.config.get('jwt.refreshIn'));
            exp = now + refreshIn * 60;
            secret = 'User_Refresh:' + secret;
        }
        // 生成令牌负荷绑定uuid标识
        const jwtToken = {
            [token_1.JWT_DEVICE_ID]: deviceFingerprint,
            [token_1.JWT_USER_ID]: userId,
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
     * @param token 身份令牌
     * @param tokenType 令牌类型 access:访问令牌 refresh:刷新令牌
     * @returns [令牌负荷, 错误信息]
     */
    async userTokenVerify(token, tokenType) {
        try {
            // 判断加密算法是预期的加密算法
            let secret = this.config.get('jwt.secret');
            if (tokenType === 'access') {
                secret = 'User_Access:' + secret;
            }
            if (tokenType === 'refresh') {
                secret = 'User_Refresh:' + secret;
            }
            const jwtToken = (0, jsonwebtoken_1.verify)(token, secret);
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
     * 清除访问用户信息缓存
     * @param token 身份令牌
     * @returns [用户名, 错误信息]
     */
    async userInfoRemove(token) {
        const [claims, err] = await this.userTokenVerify(token, 'access');
        if (err != '') {
            return ['', err];
        }
        const info = await this.userInfoGet(claims);
        if (info.user.userName != '') {
            // 清除缓存KEY
            const deviceId = claims[token_1.JWT_DEVICE_ID];
            const tokenKey = cache_key_1.CACHE_TOKEN_DEVICE + ':' + deviceId;
            const rows = await this.redis.del('', tokenKey);
            if (rows > 0) {
                return [info.user.userName, ''];
            }
        }
        return ['', 'token invalid'];
    }
    /**
     * 生成访问用户信息缓存
     * @param info 登录用户信息对象
     * @param deviceFingerprint 设备指纹 SHA256
     * @param ilobArr 登录客户端信息 [IP, 地点, 系统, 浏览器]
     * @returns 登录用户信息对象
     */
    async userInfoCreate(info, deviceFingerprint, ilobArr) {
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
        // 设置新登录IP和登录时间
        info.user.loginIp = info.loginIp;
        info.user.loginTime = info.loginTime;
        info.user.password = '';
        // 登录信息标识缓存
        const tokenKey = cache_key_1.CACHE_TOKEN_DEVICE + ':' + info.deviceId;
        await this.redis.set('', tokenKey, JSON.stringify(info), Math.round(expiresIn * 60));
        return info;
    }
    /**
     * 更新访问用户信息缓存
     * @param info 登录用户信息对象
     */
    async UserInfoUpdate(info) {
        info.user.password = '';
        // 登录信息标识缓存
        const tokenKey = cache_key_1.CACHE_TOKEN_DEVICE + ':' + info.deviceId;
        const expiration = await this.redis.getExpire('', tokenKey);
        await this.redis.set('', tokenKey, JSON.stringify(info), expiration);
    }
    /**
     * 缓存的访问用户信息
     * @param claims 令牌信息
     * @returns 身份信息
     */
    async userInfoGet(claims) {
        const info = new user_info_1.UserInfo();
        info.userId = 0;
        const deviceId = claims[token_1.JWT_DEVICE_ID];
        const tokenKey = cache_key_1.CACHE_TOKEN_DEVICE + ':' + deviceId;
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
], UserTokenService.prototype, "redis", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", config_1.GlobalConfig)
], UserTokenService.prototype, "config", void 0);
exports.UserTokenService = UserTokenService = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], UserTokenService);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcl90b2tlbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mcmFtZXdvcmsvdG9rZW4vdXNlcl90b2tlbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBNEQ7QUFDNUQsK0NBQXVEO0FBRXZELDhDQUFnRTtBQUNoRSxzREFBNEQ7QUFDNUQscURBQXVEO0FBQ3ZELDZDQUFnRDtBQUNoRCxnREFBbUQ7QUFDbkQsMkNBQXVDO0FBRXZDLGtCQUFrQjtBQUdYLElBQU0sZ0JBQWdCLDhCQUF0QixNQUFNLGdCQUFnQjtJQUMzQixVQUFVO0lBRUYsS0FBSyxDQUFhO0lBRTFCLFVBQVU7SUFFRixNQUFNLENBQWU7SUFFN0I7Ozs7OztPQU1HO0lBQ0ksS0FBSyxDQUFDLGVBQWUsQ0FDMUIsTUFBYyxFQUNkLGlCQUF5QixFQUN6QixTQUErQjtRQUUvQix5QkFBeUI7UUFDekIsTUFBTSxTQUFTLEdBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDM0QsSUFBSSxNQUFNLEdBQWMsU0FBUyxDQUFDO1FBQ2xDLFFBQVEsU0FBUyxFQUFFO1lBQ2pCLEtBQUssT0FBTztnQkFDVixNQUFNLEdBQUcsT0FBTyxDQUFDO2dCQUNqQixNQUFNO1lBQ1IsS0FBSyxPQUFPO2dCQUNWLE1BQU0sR0FBRyxPQUFPLENBQUM7Z0JBQ2pCLE1BQU07WUFDUixLQUFLLE9BQU8sQ0FBQztZQUNiO2dCQUNFLE1BQU0sR0FBRyxPQUFPLENBQUM7U0FDcEI7UUFDRCxXQUFXO1FBQ1gsSUFBSSxNQUFNLEdBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDbkQsV0FBVztRQUNYLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQzFDLElBQUksR0FBRyxHQUFH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