"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitMiddleware = exports.RateLimit = exports.LIMIT_USER = exports.LIMIT_IP = exports.LIMIT_GLOBAL = void 0;
const core_1 = require("@midwayjs/core");
const cache_key_1 = require("../constants/cache_key");
const auth_1 = require("../reqctx/auth");
const redis_1 = require("../datasource/redis/redis");
const ip2region_1 = require("../ip2region/ip2region");
const api_1 = require("../resp/api");
const hash_1 = require("../utils/crypto/hash");
/**默认策略全局限流 */
exports.LIMIT_GLOBAL = 1;
/**根据请求者IP进行限流 */
exports.LIMIT_IP = 2;
/**根据用户ID进行限流 */
exports.LIMIT_USER = 3;
/**请求限流-中间件 */
let RateLimit = exports.RateLimit = class RateLimit {
    resolve(x, options) {
        return async (c, next) => {
            // 初始可选参数数据
            let time = options.time;
            if (time < 5) {
                time = 5;
            }
            let count = options.count;
            if (count < 10) {
                count = 10;
            }
            let type = options.type;
            if (type < 1 || type > 3) {
                type = exports.LIMIT_GLOBAL;
            }
            // 获取执行函数名称
            const routerService = await c.requestContext.getAsync(core_1.MidwayWebRouterService);
            const routerInfo = await routerService.getMatchedRouterInfo(c.path, c.method);
            const funcName = routerInfo.funcHandlerName;
            // 生成限流key
            let limitKey = `${cache_key_1.CACHE_RATE_LIMIT}:${(0, hash_1.md5)(funcName)}`;
            // 用户
            if (type === exports.LIMIT_USER) {
                const loginUserId = (0, auth_1.loginUserToUserID)(c);
                if (loginUserId < 0) {
                    c.status = 401;
                    return api_1.Resp.codeMsg(401002, 'invalid login user information');
                }
                const funcMd5 = (0, hash_1.md5)(`${loginUserId}:${funcName}`);
                limitKey = `${cache_key_1.CACHE_RATE_LIMIT}:${funcMd5}`;
            }
            // IP
            if (type === exports.LIMIT_IP) {
                const funcMd5 = (0, hash_1.md5)(`${(0, ip2region_1.clientIP)(c.ip)}:${funcName}`);
                limitKey = `${cache_key_1.CACHE_RATE_LIMIT}:${funcMd5}`;
            }
            // 在Redis查询并记录请求次数
            const redisCacheServer = await c.requestContext.getAsync(redis_1.RedisCache);
            const rateCount = await redisCacheServer.rateLimit('', limitKey, time, count);
            const rateTime = await redisCacheServer.getExpire('', limitKey);
            // 设置限流声明响应头
            c.set('X-Ratelimit-Limit', `${count}`); // 总请求数限制
            c.set('X-Ratelimit-Remaining', `${count - rateCount}`); // 剩余可用请求数
            c.set('X-Ratelimit-Reset', `${Date.now() + rateTime * 1000}`); // 重置时间戳
            if (rateCount >= count) {
                c.status = 200;
                return api_1.Resp.errMsg('访问过于频繁，请稍候再试');
            }
            // 调用下一个处理程序
            return await next();
        };
    }
    static getName() {
        return 'RATE_LIMIT';
    }
};
exports.RateLimit = RateLimit = __decorate([
    (0, core_1.Middleware)()
], RateLimit);
/**
 * 请求限流-中间件
 *
 * 示例参数：`{ time: 5, count: 10, type: LIMIT_IP }`
 *
 * 参数表示：5秒内，最多请求10次，类型记录IP
 *
 * 使用 `LIMIT_USER` 时，请在用户身份授权认证校验后使用
 * 以便获取登录用户信息，无用户信息时默认为 `LIMIT_GLOBAL`
 * @param options 限流参数
 */
function RateLimitMiddleware(options) {
    return (0, core_1.createMiddleware)(RateLimit, options, RateLimit.getName());
}
exports.RateLimitMiddleware = RateLimitMiddleware;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmF0ZV9saW1pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mcmFtZXdvcmsvbWlkZGxld2FyZS9yYXRlX2xpbWl0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLHlDQUt3QjtBQUd4QixzREFBMEQ7QUFDMUQseUNBQW1EO0FBQ25ELHFEQUF1RDtBQUN2RCxzREFBa0Q7QUFDbEQscUNBQW1DO0FBQ25DLCtDQUEyQztBQUUzQyxjQUFjO0FBQ0QsUUFBQSxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBRTlCLGlCQUFpQjtBQUNKLFFBQUEsUUFBUSxHQUFHLENBQUMsQ0FBQztBQUUxQixnQkFBZ0I7QUFDSCxRQUFBLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFZNUIsY0FBYztBQUVQLElBQU0sU0FBUyx1QkFBZixNQUFNLFNBQVM7SUFDcEIsT0FBTyxDQUFDLENBQU0sRUFBRSxPQUF5QjtRQUN2QyxPQUFPLEtBQUssRUFBRSxDQUFVLEVBQUUsSUFBa0IsRUFBRSxFQUFFO1lBQzlDLFdBQVc7WUFDWCxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQ3hCLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTtnQkFDWixJQUFJLEdBQUcsQ0FBQyxDQUFDO2FBQ1Y7WUFDRCxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO1lBQzFCLElBQUksS0FBSyxHQUFHLEVBQUUsRUFBRTtnQkFDZCxLQUFLLEdBQUcsRUFBRSxDQUFDO2FBQ1o7WUFDRCxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQ3hCLElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxFQUFFO2dCQUN4QixJQUFJLEdBQUcsb0JBQVksQ0FBQzthQUNyQjtZQUVELFdBQVc7WUFDWCxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUNuRCw2QkFBc0IsQ0FD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