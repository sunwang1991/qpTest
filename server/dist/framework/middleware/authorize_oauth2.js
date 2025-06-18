"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizeOauth2Middleware = exports.AuthorizeOauth2 = void 0;
const core_1 = require("@midwayjs/core");
const common_1 = require("../constants/common");
const context_1 = require("../reqctx/context");
const oauth2_token_1 = require("../token/oauth2_token");
const api_1 = require("../resp/api");
/**客户端授权认证校验-中间件 */
let AuthorizeOauth2 = exports.AuthorizeOauth2 = class AuthorizeOauth2 {
    resolve(_, scope) {
        return async (c, next) => {
            const token = await c.requestContext.getAsync(oauth2_token_1.Oauth2TokenService);
            // 获取请求头标识信息
            const tokenStr = (0, context_1.authorization)(c);
            if (tokenStr === '') {
                c.status = 401;
                return api_1.Resp.codeMsg(401003, 'authorization token is empty');
            }
            // 验证令牌
            const [claims, err] = await token.oauth2TokenVerify(tokenStr, 'access');
            if (err) {
                c.status = 401;
                return api_1.Resp.codeMsg(401001, err);
            }
            // 获取缓存的用户信息
            let info = await token.oauth2InfoGet(claims);
            if (info.clientId === '') {
                c.status = 401;
                return api_1.Resp.codeMsg(401002, 'invalid login user information');
            }
            c.setAttr(common_1.CTX_LOGIN_OAUTH2, info);
            // 客户端权限校验
            if (Array.isArray(scope) && scope.length > 0) {
                let hasScope = false;
                for (const item of info.scope) {
                    for (const v of scope) {
                        if (item === v) {
                            hasScope = true;
                            break;
                        }
                    }
                }
                if (!hasScope) {
                    c.status = 403;
                    return api_1.Resp.codeMsg(403001, `unauthorized access ${c.method} ${c.path}`);
                }
            }
            // 调用下一个处理程序
            return await next();
        };
    }
    static getName() {
        return 'AUTHORIZE_OAUTH2';
    }
};
exports.AuthorizeOauth2 = AuthorizeOauth2 = __decorate([
    (0, core_1.Middleware)()
], AuthorizeOauth2);
/**
 * 客户端授权认证校验-中间件
 *
 * @param scope 授权范围数组
 */
function AuthorizeOauth2Middleware(scope) {
    return (0, core_1.createMiddleware)(AuthorizeOauth2, scope, AuthorizeOauth2.getName());
}
exports.AuthorizeOauth2Middleware = AuthorizeOauth2Middleware;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aG9yaXplX29hdXRoMi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mcmFtZXdvcmsvbWlkZGxld2FyZS9hdXRob3JpemVfb2F1dGgyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLHlDQUEyRTtBQUczRSxnREFBdUQ7QUFDdkQsK0NBQWtEO0FBQ2xELHdEQUEyRDtBQUMzRCxxQ0FBbUM7QUFFbkMsbUJBQW1CO0FBRVosSUFBTSxlQUFlLDZCQUFyQixNQUFNLGVBQWU7SUFDMUIsT0FBTyxDQUFDLENBQU0sRUFBRSxLQUFlO1FBQzdCLE9BQU8sS0FBSyxFQUFFLENBQVUsRUFBRSxJQUFrQixFQUFFLEVBQUU7WUFDOUMsTUFBTSxLQUFLLEdBQXVCLE1BQU0sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQy9ELGlDQUFrQixDQUNuQixDQUFDO1lBRUYsWUFBWTtZQUNaLE1BQU0sUUFBUSxHQUFHLElBQUEsdUJBQWEsRUFBQyxDQUFDLENBQUMsQ0FBQztZQUNsQyxJQUFJLFFBQVEsS0FBSyxFQUFFLEVBQUU7Z0JBQ25CLENBQUMsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO2dCQUNmLE9BQU8sVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsOEJBQThCLENBQUMsQ0FBQzthQUM3RDtZQUVELE9BQU87WUFDUCxNQUFNLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLE1BQU0sS0FBSyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN4RSxJQUFJLEdBQUcsRUFBRTtnQkFDUCxDQUFDLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztnQkFDZixPQUFPLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQ2xDO1lBRUQsWUFBWTtZQUNaLElBQUksSUFBSSxHQUFHLE1BQU0sS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM3QyxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssRUFBRSxFQUFFO2dCQUN4QixDQUFDLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztnQkFDZixPQUFPLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLGdDQUFnQyxDQUFDLENBQUM7YUFDL0Q7WUFDRCxDQUFDLENBQUMsT0FBTyxDQUFDLHlCQUFnQixFQUFFLElBQUksQ0FBQyxDQUFDO1lBRWxDLFVBQVU7WUFDVixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQzVDLElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQztnQkFDckIsS0FBSyxNQUFNLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO29CQUM3QixLQUFLLE1BQU0sQ0FBQyxJQUFJLEtBQUssRUFBRTt3QkFDckIsSUFBSSxJQUFJLEtBQUssQ0FBQyxFQUFFOzRCQUNkLFFBQVEsR0FBRyxJQUFJLENBQUM7NEJBQ2hCLE1BQU07eUJBQ1A7cUJBQ0Y7aUJBQ0Y7Z0JBQ0QsSUFBSSxDQUFDLFFBQVEsRUFBRTtvQkFDYixDQUFDLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztvQkFDZixPQUFPLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLHVCQUF1QixDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO2lCQUMxRTthQUNGO1lBRUQsWUFBWTtZQUNaLE9BQU8sTUFBTSxJQUFJLEVBQUUsQ0FBQztRQUN0QixDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsTUFBTSxDQUFDLE9BQU87UUFDWixPQUFPLGtCQUFrQixDQUFDO0lBQzVCLENBQUM7Q0FDRixDQUFBOzBCQXREWSxlQUFlO0lBRDNCLElBQUEsaUJBQVUsR0FBRTtHQUNBLGVBQWUsQ0FzRDNCO0FBRUQ7Ozs7R0FJRztBQUNILFNBQWdCLHlCQUF5QixDQUFDLEtBQWU7SUFDdkQsT0FBTyxJQUFBLHVCQUFnQixFQUFDLGVBQWUsRUFBRSxLQUFLLEVBQUUsZUFBZSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFDN0UsQ0FBQztBQUZELDhEQUVDIn0=