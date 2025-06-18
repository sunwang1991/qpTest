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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Oauth2Controller = void 0;
const core_1 = require("@midwayjs/core");
const token_1 = require("../../../framework/constants/token");
const param_1 = require("../../../framework/reqctx/param");
const rate_limit_1 = require("../../../framework/middleware/rate_limit");
const common_1 = require("../../../framework/constants/common");
const oauth2_token_1 = require("../../../framework/token/oauth2_token");
const parse_1 = require("../../../framework/utils/parse/parse");
const api_1 = require("../../../framework/resp/api");
const oauth2_log_login_1 = require("../service/oauth2_log_login");
const oauth2_client_1 = require("../service/oauth2_client");
const oauth2_1 = require("../service/oauth2");
const code_query_1 = require("../model/code_query");
const token_body_1 = require("../model/token_body");
/**用户授权第三方应用认证 控制层处理 */
let Oauth2Controller = exports.Oauth2Controller = class Oauth2Controller {
    /**上下文 */
    c;
    /**Token工具 */
    token;
    /**用户授权第三方信息服务 */
    oauth2Service;
    /**用户授权第三方应用信息服务 */
    oauth2ClientService;
    /**用户授权第三方应用登录日志 */
    oauth2LogLoginService;
    /**获取登录预授权码 */
    async authorize(query) {
        // 是否存在clientId
        const info = await this.oauth2ClientService.findByClientId(query.clientId);
        if (info.clientId == '' || info.clientId != query.clientId) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'clientId not exist');
        }
        // 判断IP白名单
        if (!info.ipWhite.includes(this.c.ip)) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'IP whitelist mismatch');
        }
        // 生成登录预授权码
        const code = await this.oauth2Service.createCode();
        const redirectURL = `${query.redirectUrl}?code=${code}&state=${query.state}`;
        this.c.status = 302;
        this.c.redirect(redirectURL);
    }
    /**通过授权码获取访问令牌 */
    async createToken(body) {
        if (body.grantType != 'authorization_code' || body.code == '') {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'grantType or code error');
        }
        // 当前请求信息
        const [ipaddr, location] = await (0, param_1.ipaddrLocation)(this.c);
        const [os, browser] = await (0, param_1.uaOsBrowser)(this.c);
        // 校验验证码 根据错误信息，创建系统访问记录
        const err = await this.oauth2Service.validateCode(body.code);
        if (err) {
            const msg = `${err} code ${body.code}`;
            await this.oauth2LogLoginService.insert(body.clientId, common_1.STATUS_NO, msg, [
                ipaddr,
                location,
                os,
                browser,
            ]);
            return api_1.Resp.errMsg(err);
        }
        // 登录客户端信息
        let [info, errMsg] = await this.oauth2Service.byClient(body.clientId, body.clientSecret);
        if (errMsg) {
            await this.oauth2LogLoginService.insert(body.clientId, common_1.STATUS_NO, errMsg, [ipaddr, location, os, browser]);
            return api_1.Resp.errMsg(errMsg);
        }
        const deviceFingerprintStr = await (0, param_1.deviceFingerprint)(this.c, info.clientId);
        // 生成访问令牌
        const [accessToken, expiresIn] = await this.token.oauth2TokenCreate(info.clientId, deviceFingerprintStr, 'access');
        if (accessToken == '' || expiresIn == 0) {
            return api_1.Resp.errMsg('token generation failed');
        }
        // 生成刷新令牌
        const [refreshToken, refreshExpiresIn] = await this.token.oauth2TokenCreate(info.clientId, deviceFingerprintStr, 'refresh');
        // 记录令牌，创建系统访问记录
        info = await this.token.oauth2InfoCreate(info, deviceFingerprintStr, [
            ipaddr,
            location,
            os,
            browser,
        ]);
        await this.oauth2Service.updateLoginDateAndIP(info);
        await this.oauth2LogLoginService.insert(body.clientId, common_1.STATUS_YES, '授权成功', [ipaddr, location, os, browser]);
        return api_1.Resp.okData({
            tokenType: token_1.HEADER_PREFIX,
            accessToken: accessToken,
            expiresIn: expiresIn,
            refreshToken: refreshToken,
            refreshExpiresIn: refreshExpiresIn,
        });
    }
    /**通过刷新令牌续期访问令牌 */
    async refreshToken(body) {
        if (body.grantType != 'refresh_token' || body.refreshToken == '') {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'grantType or refreshToken error');
        }
        // 验证刷新令牌是否有效
        const [claims, err] = await this.token.oauth2TokenVerify(body.refreshToken, 'refresh');
        if (err != '') {
            return api_1.Resp.errMsg(err);
        }
        const clientId = claims[token_1.JWT_CLIENT_ID];
        // 客户端信息
        let [info, errMsg] = await this.oauth2Service.byClient(body.clientId, body.clientSecret);
        if (errMsg != '') {
            return api_1.Resp.errMsg(errMsg);
        }
        // 客户端ID是否一致
        if (clientId != body.clientId) {
            return api_1.Resp.errMsg('clientId mismatch');
        }
        // 设备指纹信息是否一致
        const deviceId = claims[token_1.JWT_DEVICE_ID];
        const deviceFingerprintStr = await (0, param_1.deviceFingerprint)(this.c, clientId);
        if (deviceId != deviceFingerprintStr) {
            return api_1.Resp.errMsg('device fingerprint mismatch');
        }
        // 生成访问令牌
        const [accessToken, expiresIn] = await this.token.oauth2TokenCreate(clientId, deviceFingerprintStr, 'access');
        if (accessToken == '' || expiresIn == 0) {
            return api_1.Resp.errMsg('token generation failed');
        }
        // 生成刷新令牌
        const now = Math.round(Date.now() / 1000);
        const exp = (0, parse_1.parseNumber)(claims['exp']);
        const iat = (0, parse_1.parseNumber)(claims['iat']);
        let refreshExpiresIn = Math.round(exp - now);
        let refreshToken = body.refreshToken;
        // 如果当前时间大于过期时间的一半，则生成新令牌
        const halfExp = exp - Math.round(now - iat) / 2;
        if (now > halfExp) {
            [refreshToken, refreshExpiresIn] = await this.token.oauth2TokenCreate(clientId, deviceFingerprintStr, 'refresh');
        }
        // 当前请求信息
        const [ipaddr, location] = await (0, param_1.ipaddrLocation)(this.c);
        const [os, browser] = await (0, param_1.uaOsBrowser)(this.c);
        // 记录令牌，创建系统访问记录
        info = await this.token.oauth2InfoCreate(info, deviceFingerprintStr, [
            ipaddr,
            location,
            os,
            browser,
        ]);
        await this.oauth2Service.updateLoginDateAndIP(info);
        await this.oauth2LogLoginService.insert(info.clientId, common_1.STATUS_YES, '刷新访问令牌成功', [ipaddr, location, os, browser]);
        return api_1.Resp.okData({
            tokenType: token_1.HEADER_PREFIX,
            accessToken: accessToken,
            expiresIn: expiresIn,
            refreshToken: refreshToken,
            refreshExpiresIn: refreshExpiresIn,
        });
    }
};
__decorate([
    (0, core_1.Inject)('ctx'),
    __metadata("design:type", Object)
], Oauth2Controller.prototype, "c", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", oauth2_token_1.Oauth2TokenService)
], Oauth2Controller.prototype, "token", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", oauth2_1.Oauth2Service)
], Oauth2Controller.prototype, "oauth2Service", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", oauth2_client_1.Oauth2ClientService)
], Oauth2Controller.prototype, "oauth2ClientService", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", oauth2_log_login_1.Oauth2LogLoginService)
], Oauth2Controller.prototype, "oauth2LogLoginService", void 0);
__decorate([
    (0, core_1.Get)('/authorize', {
        middleware: [(0, rate_limit_1.RateLimitMiddleware)({ time: 60, count: 30, type: rate_limit_1.LIMIT_IP })],
    }),
    __param(0, (0, core_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [code_query_1.CodeQuery]),
    __metadata("design:returntype", Promise)
], Oauth2Controller.prototype, "authorize", null);
__decorate([
    (0, core_1.Post)('/token', {
        middleware: [(0, rate_limit_1.RateLimitMiddleware)({ time: 180, count: 15, type: rate_limit_1.LIMIT_IP })],
    }),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [token_body_1.TokenBody]),
    __metadata("design:returntype", Promise)
], Oauth2Controller.prototype, "createToken", null);
__decorate([
    (0, core_1.Post)('/refresh-token', {
        middleware: [(0, rate_limit_1.RateLimitMiddleware)({ time: 60, count: 5, type: rate_limit_1.LIMIT_IP })],
    }),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [token_body_1.TokenBody]),
    __metadata("design:returntype", Promise)
], Oauth2Controller.prototype, "refreshToken", null);
exports.Oauth2Controller = Oauth2Controller = __decorate([
    (0, core_1.Controller)('/oauth2')
], Oauth2Controller);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2F1dGgyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvb2F1dGgyL2NvbnRyb2xsZXIvb2F1dGgyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUE0RTtBQUc1RSw4REFJNEM7QUFDNUMsMkRBSXlDO0FBQ3pDLHlFQUdrRDtBQUNsRCxnRUFBNEU7QUFDNUUsd0VBQTJFO0FBQzNFLGdFQUFtRTtBQUNuRSxxREFBbUQ7QUFDbkQsa0VBQW9FO0FBQ3BFLDREQUErRDtBQUMvRCw4Q0FBa0Q7QUFDbEQsb0RBQWdEO0FBQ2hELG9EQUFnRDtBQUVoRCx1QkFBdUI7QUFFaEIsSUFBTSxnQkFBZ0IsOEJBQXRCLE1BQU0sZ0JBQWdCO0lBQzNCLFNBQVM7SUFFRCxDQUFDLENBQVU7SUFFbkIsYUFBYTtJQUVMLEtBQUssQ0FBcUI7SUFFbEMsaUJBQWlCO0lBRVQsYUFBYSxDQUFnQjtJQUVyQyxtQkFBbUI7SUFFWCxtQkFBbUIsQ0FBc0I7SUFFakQsbUJBQW1CO0lBRVgscUJBQXFCLENBQXdCO0lBRXJELGNBQWM7SUFJRCxBQUFOLEtBQUssQ0FBQyxTQUFTLENBQVUsS0FBZ0I7UUFDOUMsZUFBZTtRQUNmLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDM0UsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDMUQsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1lBQ3BCLE9BQU8sVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztTQUNuRDtRQUVELFVBQVU7UUFDVixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMs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