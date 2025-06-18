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
exports.AccountController = void 0;
const core_1 = require("@midwayjs/core");
const token_1 = require("../../../framework/constants/token");
const param_1 = require("../../../framework/reqctx/param");
const rate_limit_1 = require("../../../framework/middleware/rate_limit");
const authorize_user_1 = require("../../../framework/middleware/authorize_user");
const auth_1 = require("../../../framework/reqctx/auth");
const common_1 = require("../../../framework/constants/common");
const context_1 = require("../../../framework/reqctx/context");
const config_1 = require("../../../framework/config/config");
const user_token_1 = require("../../../framework/token/user_token");
const parse_1 = require("../../../framework/utils/parse/parse");
const api_1 = require("../../../framework/resp/api");
const sys_log_login_1 = require("../../system/service/sys_log_login");
const account_1 = require("../service/account");
const login_body_1 = require("../model/login_body");
/**账号身份操作 控制层处理 */
let AccountController = exports.AccountController = class AccountController {
    /**上下文 */
    c;
    /**系统用户令牌工具 */
    token;
    /**配置信息 */
    config;
    /**账号身份操作服务 */
    accountService;
    /**系统登录访问 */
    sysLogLoginService;
    /**系统登录 */
    async login(body) {
        // 当前请求信息
        const [ipaddr, location] = await (0, param_1.ipaddrLocation)(this.c);
        const [os, browser] = await (0, param_1.uaOsBrowser)(this.c);
        // 校验验证码 根据错误信息，创建系统访问记录
        const errMsg = await this.accountService.validateCaptcha(body.code, body.uuid);
        if (errMsg) {
            const msg = `${errMsg} code ${body.code}`;
            await this.sysLogLoginService.insert(body.username, common_1.STATUS_NO, msg, [
                ipaddr,
                location,
                os,
                browser,
            ]);
            return api_1.Resp.errMsg(errMsg);
        }
        // 登录用户信息
        let [info, err] = await this.accountService.byUsername(body.username, body.password);
        if (err) {
            await this.sysLogLoginService.insert(body.username, common_1.STATUS_NO, err, [
                ipaddr,
                location,
                os,
                browser,
            ]);
            return api_1.Resp.errMsg(err);
        }
        const deviceFingerprintStr = await (0, param_1.deviceFingerprint)(this.c, info.userId);
        // 生成访问令牌
        const [accessToken, expiresIn] = await this.token.userTokenCreate(info.userId, deviceFingerprintStr, 'access');
        if (accessToken == '' || expiresIn == 0) {
            return api_1.Resp.errMsg('token generation failed');
        }
        // 生成刷新令牌
        const [refreshToken, refreshExpiresIn] = await this.token.userTokenCreate(info.userId, deviceFingerprintStr, 'refresh');
        // 记录令牌，创建系统访问记录
        info = await this.token.userInfoCreate(info, deviceFingerprintStr, [
            ipaddr,
            location,
            os,
            browser,
        ]);
        await this.accountService.updateLoginDateAndIP(info);
        await this.sysLogLoginService.insert(body.username, common_1.STATUS_YES, '登录成功', [ipaddr, location, os, browser]);
        return api_1.Resp.okData({
            tokenType: token_1.HEADER_PREFIX,
            accessToken: accessToken,
            expiresIn: expiresIn,
            refreshToken: refreshToken,
            refreshExpiresIn: refreshExpiresIn,
            userId: info.userId,
        });
    }
    /**系统登出 */
    async logout() {
        const tokenStr = (0, context_1.authorization)(this.c);
        if (tokenStr) {
            // 存在token时记录退出信息
            const [userName, err] = await this.token.userInfoRemove(tokenStr);
            if (err !== '') {
                // 当前请求信息
                const [ipaddr, location] = await (0, param_1.ipaddrLocation)(this.c);
                const [os, browser] = await (0, param_1.uaOsBrowser)(this.c);
                // 创建系统访问记录
                this.sysLogLoginService.insert(userName, common_1.STATUS_YES, '主动注销登录信息', [ipaddr, location, os, browser]);
            }
        }
        return api_1.Resp.okMsg('logout successful');
    }
    /**刷新Token */
    async refreshToken(body) {
        if (body.refreshToken === '') {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: refreshToken is empty');
        }
        // 验证刷新令牌是否有效
        const [claims, err] = await this.token.userTokenVerify(body.refreshToken, 'refresh');
        if (err != '') {
            this.c.status = 401;
            return api_1.Resp.codeMsg(401001, err);
        }
        const userId = (0, parse_1.parseNumber)(claims[token_1.JWT_USER_ID]);
        // 登录用户信息
        let [info, errMsg] = await this.accountService.byUserId(userId);
        if (errMsg != '') {
            return api_1.Resp.errMsg(errMsg);
        }
        // 设备指纹信息是否一致
        const deviceId = claims[token_1.JWT_DEVICE_ID];
        const deviceFingerprintStr = await (0, param_1.deviceFingerprint)(this.c, userId);
        if (deviceId != deviceFingerprintStr) {
            return api_1.Resp.errMsg('device fingerprint mismatch');
        }
        // 生成访问令牌
        const [accessToken, expiresIn] = await this.token.userTokenCreate(userId, deviceFingerprintStr, 'access');
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
            [refreshToken, refreshExpiresIn] = await this.token.userTokenCreate(userId, deviceFingerprintStr, 'refresh');
        }
        // 当前请求信息
        const [ipaddr, location] = await (0, param_1.ipaddrLocation)(this.c);
        const [os, browser] = await (0, param_1.uaOsBrowser)(this.c);
        // 记录令牌，创建系统访问记录
        info = await this.token.userInfoCreate(info, deviceFingerprintStr, [
            ipaddr,
            location,
            os,
            browser,
        ]);
        await this.accountService.updateLoginDateAndIP(info);
        await this.sysLogLoginService.insert(info.user.userName, common_1.STATUS_YES, '刷新访问令牌成功', [ipaddr, location, os, browser]);
        return api_1.Resp.okData({
            tokenType: token_1.HEADER_PREFIX,
            accessToken: accessToken,
            expiresIn: expiresIn,
            refreshToken: refreshToken,
            refreshExpiresIn: refreshExpiresIn,
            userId: userId,
        });
    }
    /**登录用户信息 */
    async me() {
        const [info, err] = (0, auth_1.loginUser)(this.c);
        if (err) {
            this.c.status = 401;
            return api_1.Resp.codeMsg(401002, err);
        }
        // 角色权限集合，系统管理员拥有所有权限
        const isSystemUser = this.config.isSystemUser(info.userId);
        const [roles, perms] = await this.accountService.roleAndMenuPerms(info.userId, isSystemUser);
        return api_1.Resp.okData({
            user: info.user,
            roles: roles,
            permissions: perms,
        });
    }
    /**登录用户路由信息 */
    async router() {
        const loginUserId = (0, auth_1.loginUserToUserID)(this.c);
        // 前端路由，系统管理员拥有所有
        const isSystemUser = this.config.isSystemUser(loginUserId);
        const buildMenus = await this.accountService.routeMenus(loginUserId, isSystemUser);
        return api_1.Resp.okData(buildMenus);
    }
};
__decorate([
    (0, core_1.Inject)('ctx'),
    __metadata("design:type", Object)
], AccountController.prototype, "c", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", user_token_1.UserTokenService)
], AccountController.prototype, "token", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", config_1.GlobalConfig)
], AccountController.prototype, "config", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", account_1.AccountService)
], AccountController.prototype, "accountService", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_log_login_1.SysLogLoginService)
], AccountController.prototype, "sysLogLoginService", void 0);
__decorate([
    (0, core_1.Post)('/auth/login', {
        middleware: [(0, rate_limit_1.RateLimitMiddleware)({ time: 180, count: 15, type: rate_limit_1.LIMIT_IP })],
    }),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_body_1.LoginBody]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "login", null);
__decorate([
    (0, core_1.Post)('/auth/logout', {
        middleware: [(0, rate_limit_1.RateLimitMiddleware)({ time: 120, count: 15, type: rate_limit_1.LIMIT_IP })],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "logout", null);
__decorate([
    (0, core_1.Post)('/auth/refresh-token', {
        middleware: [(0, rate_limit_1.RateLimitMiddleware)({ time: 60, count: 5, type: rate_limit_1.LIMIT_IP })],
    }),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "refreshToken", null);
__decorate([
    (0, core_1.Get)('/me', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)()],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "me", null);
__decorate([
    (0, core_1.Get)('/router', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)()],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "router", null);
exports.AccountController = AccountController = __decorate([
    (0, core_1.Controller)()
], AccountController);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2F1dGgvY29udHJvbGxlci9hY2NvdW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUFxRTtBQUdyRSw4REFJNEM7QUFDNUMsMkRBSXlDO0FBQ3pDLHlFQUdrRDtBQUNsRCxpRkFBdUY7QUFDdkYseURBQThFO0FBQzlFLGdFQUE0RTtBQUM1RSwrREFBa0U7QUFDbEUsNkRBQWdFO0FBQ2hFLG9FQUF1RTtBQUN2RSxnRUFBbUU7QUFDbkUscURBQW1EO0FBQ25ELHNFQUF3RTtBQUN4RSxnREFBb0Q7QUFDcEQsb0RBQWdEO0FBRWhELGtCQUFrQjtBQUVYLElBQU0saUJBQWlCLCtCQUF2QixNQUFNLGlCQUFpQjtJQUM1QixTQUFTO0lBRUQsQ0FBQyxDQUFVO0lBRW5CLGNBQWM7SUFFTixLQUFLLENBQW1CO0lBRWhDLFVBQVU7SUFFRixNQUFNLENBQWU7SUFFN0IsY0FBYztJQUVOLGNBQWMsQ0FBaUI7SUFFdkMsWUFBWTtJQUVKLGtCQUFrQixDQUFxQjtJQUUvQyxVQUFVO0lBSUcsQUFBTixLQUFLLENBQUMsS0FBSyxDQUFTLElBQWU7UUFDeEMsU0FBUztRQUNULE1BQU0sQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLEdBQUcsTUFBTSxJQUFBLHNCQUFjLEVBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hELE1BQU0sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLEdBQUcsTUFBTSxJQUFBLG1CQUFXLEVBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWhELHdCQUF3QjtRQUN4QixNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUN0RCxJQUFJLENBQUMsSUFBSSxFQUNULElBQUksQ0FBQyxJQUFJLENBQ1YsQ0FBQztRQUNGLElBQUksTUFBTSxFQUFFO1lBQ1Ys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