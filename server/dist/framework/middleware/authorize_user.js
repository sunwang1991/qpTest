"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizeUserMiddleware = exports.AuthorizeUser = void 0;
const core_1 = require("@midwayjs/core");
const system_1 = require("../constants/system");
const common_1 = require("../constants/common");
const context_1 = require("../reqctx/context");
const user_token_1 = require("../token/user_token");
const api_1 = require("../resp/api");
/**用户身份授权认证校验-中间件 */
let AuthorizeUser = exports.AuthorizeUser = class AuthorizeUser {
    resolve(_, options) {
        return async (c, next) => {
            const token = await c.requestContext.getAsync(user_token_1.UserTokenService);
            // 获取请求头标识信息
            const tokenStr = (0, context_1.authorization)(c);
            if (tokenStr === '') {
                c.status = 401;
                return api_1.Resp.codeMsg(401003, 'authorization token is empty');
            }
            // 验证令牌
            const [claims, err] = await token.userTokenVerify(tokenStr, 'access');
            if (err) {
                c.status = 401;
                return api_1.Resp.codeMsg(401001, err);
            }
            // 获取缓存的用户信息
            let info = await token.userInfoGet(claims);
            if (info.userId <= 0) {
                c.status = 401;
                return api_1.Resp.codeMsg(401002, 'invalid login user information');
            }
            c.setAttr(common_1.CTX_LOGIN_USER, info);
            // 登录用户角色权限校验
            if (options) {
                const roles = info.user.roles.map(item => item.roleKey);
                const perms = info.permissions;
                const verifyOk = verifyRolePermission(roles, perms, options);
                if (!verifyOk) {
                    c.status = 403;
                    return api_1.Resp.codeMsg(403001, `unauthorized access ${c.method} ${c.path}`);
                }
            }
            // 调用下一个处理程序
            return await next();
        };
    }
    static getName() {
        return 'AUTHORIZE_USER';
    }
};
exports.AuthorizeUser = AuthorizeUser = __decorate([
    (0, core_1.Middleware)()
], AuthorizeUser);
/**
 * 用户身份授权认证校验-中间件
 *
 * @param options 授权限制参数
 */
function AuthorizeUserMiddleware(options) {
    return (0, core_1.createMiddleware)(AuthorizeUser, options, AuthorizeUser.getName());
}
exports.AuthorizeUserMiddleware = AuthorizeUserMiddleware;
/**
 * 校验角色权限是否满足
 * @param roles 角色字符数组
 * @param permissions 权限字符数组
 * @param options 装饰器参数
 * @returns 返回结果
 */
function verifyRolePermission(roles, permissions, options) {
    // 直接放行 管理员角色或任意权限
    if (roles.includes(system_1.SYS_ROLE_SYSTEM_KEY) ||
        permissions.includes(system_1.SYS_PERMISSION_SYSTEM)) {
        return true;
    }
    // 只需含有其中角色
    let hasRole = false;
    if (options.hasRoles && options.hasRoles.length > 0) {
        hasRole = options.hasRoles.some(r => roles.some(ur => ur === r));
    }
    // 只需含有其中权限
    let hasPerms = false;
    if (options.hasPerms && options.hasPerms.length > 0) {
        hasPerms = options.hasPerms.some(p => permissions.some(up => up === p));
    }
    // 同时匹配其中角色
    let matchRoles = false;
    if (options.matchRoles && options.matchRoles.length > 0) {
        matchRoles = options.matchRoles.every(r => roles.some(ur => ur === r));
    }
    // 同时匹配其中权限
    let matchPerms = false;
    if (options.matchPerms && options.matchPerms.length > 0) {
        matchPerms = options.matchPerms.every(p => permissions.some(up => up === p));
    }
    // 同时判断 含有其中
    if (options.hasRoles && options.hasPerms) {
        return hasRole || hasPerms;
    }
    // 同时判断 匹配其中
    if (options.matchRoles && options.matchPerms) {
        return matchRoles && matchPerms;
    }
    // 同时判断 含有其中且匹配其中
    if (options.hasRoles && options.matchPerms) {
        return hasRole && matchPerms;
    }
    if (options.hasPerms && options.matchRoles) {
        return hasPerms && matchRoles;
    }
    return hasRole || hasPerms || matchRoles || matchPerms;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aG9yaXplX3VzZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZnJhbWV3b3JrL21pZGRsZXdhcmUvYXV0aG9yaXplX3VzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEseUNBQTJFO0FBRzNFLGdEQUc2QjtBQUM3QixnREFBcUQ7QUFDckQsK0NBQWtEO0FBQ2xELG9EQUF1RDtBQUN2RCxxQ0FBbUM7QUFjbkMsb0JBQW9CO0FBRWIsSUFBTSxhQUFhLDJCQUFuQixNQUFNLGFBQWE7SUFDeEIsT0FBTyxDQUFDLENBQU0sRUFBRSxPQUFnQjtRQUM5QixPQUFPLEtBQUssRUFBRSxDQUFVLEVBQUUsSUFBa0IsRUFBRSxFQUFFO1lBQzlDLE1BQU0sS0FBSyxHQUFxQixNQUFNLENBQUMsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUM3RCw2QkFBZ0IsQ0FDakIsQ0FBQztZQUVGLFlBQVk7WUFDWixNQUFNLFFBQVEsR0FBRyxJQUFBLHVCQUFhLEVBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEMsSUFBSSxRQUFRLEtBQUssRUFBRSxFQUFFO2dCQUNuQixDQUFDLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztnQkFDZixPQUFPLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLDhCQUE4QixDQUFDLENBQUM7YUFDN0Q7WUFFRCxPQUFPO1lBQ1AsTUFBTSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxNQUFNLEtBQUssQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3RFLElBQUksR0FBRyxFQUFFO2dCQUNQLENBQUMsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO2dCQUNmLE9BQU8sVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7YUFDbEM7WUFFRCxZQUFZO1lBQ1osSUFBSSxJQUFJLEdBQUcsTUFBTSxLQUFLLENBQUMsV0FBVyxDQUFDLE1B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