"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepeatSubmitMiddleware = exports.RepeatSubmit = void 0;
const core_1 = require("@midwayjs/core");
const cache_key_1 = require("../constants/cache_key");
const redis_1 = require("../datasource/redis/redis");
const ip2region_1 = require("../ip2region/ip2region");
const data_1 = require("../utils/date/data");
const hash_1 = require("../utils/crypto/hash");
const api_1 = require("../resp/api");
/**防止表单重复提交-中间件 */
let RepeatSubmit = exports.RepeatSubmit = class RepeatSubmit {
    resolve(_, interval) {
        return async (c, next) => {
            // 提交参数
            const params = Object.assign({}, c.request.body, c.request.query);
            // 获取执行函数名称
            const routerService = await c.requestContext.getAsync(core_1.MidwayWebRouterService);
            const routerInfo = await routerService.getMatchedRouterInfo(c.path, c.method);
            const funcName = routerInfo.funcHandlerName;
            // 唯一标识（指定key + 客户端IP + 请求地址）
            const funcMd5 = (0, hash_1.md5)(`${(0, ip2region_1.clientIP)(c.ip)}:${funcName}`);
            const cacheKey = `${cache_key_1.CACHE_REPEAT_SUBMIT}:${funcMd5}`;
            // 从Redis读取上一次保存的请求时间和参数
            const redisCacheServer = await c.requestContext.getAsync(redis_1.RedisCache);
            const rpStr = await redisCacheServer.get('', cacheKey);
            if (rpStr) {
                const rpObj = JSON.parse(rpStr);
                const compareTime = (0, data_1.diffSeconds)(Date.now(), rpObj.time);
                const compareParams = JSON.stringify(rpObj.params) === JSON.stringify(params);
                // 设置重复提交声明响应头（毫秒）
                c.set('X-RepeatSubmit-Rest', `${Date.now() + compareTime * 1000}`);
                // 小于间隔时间 且 参数内容一致
                if (compareTime < interval && compareParams) {
                    c.status = 200;
                    return api_1.Resp.errMsg('不允许重复提交，请稍候再试');
                }
            }
            // 保存请求时间和参数
            await redisCacheServer.set('', cacheKey, JSON.stringify({
                time: Date.now(),
                params: params,
            }), interval);
            // 调用下一个处理程序
            return await next();
        };
    }
    static getName() {
        return 'REPAT_SUBMIT';
    }
};
exports.RepeatSubmit = RepeatSubmit = __decorate([
    (0, core_1.Middleware)()
], RepeatSubmit);
/**
 * 防止表单重复提交-中间件
 *
 * 小于间隔时间视为重复提交
 * @param interval 间隔时间(单位秒) 默认:5
 */
function RepeatSubmitMiddleware(interval = 5) {
    return (0, core_1.createMiddleware)(RepeatSubmit, interval, RepeatSubmit.getName());
}
exports.RepeatSubmitMiddleware = RepeatSubmitMiddleware;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwZWF0X3N1Ym1pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mcmFtZXdvcmsvbWlkZGxld2FyZS9yZXBlYXRfc3VibWl0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLHlDQUFtRztBQUduRyxzREFBNkQ7QUFDN0QscURBQXVEO0FBQ3ZELHNEQUFrRDtBQUNsRCw2Q0FBaUQ7QUFDakQsK0NBQTJDO0FBQzNDLHFDQUFtQztBQVVuQyxrQkFBa0I7QUFFWCxJQUFNLFlBQVksMEJBQWxCLE1BQU0sWUFBWTtJQUN2QixPQUFPLENBQUMsQ0FBTSxFQUFFLFFBQWdCO1FBQzlCLE9BQU8sS0FBSyxFQUFFLENBQVUsRUFBRSxJQUFrQixFQUFFLEVBQUU7WUFDOUMsT0FBTztZQUNQLE1BQU0sTUFBTSxHQUF3QixNQUFNLENBQUMsTUFBTSxDQUMvQyxFQUFFLEVBQ0YsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQ2QsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQ2hCLENBQUM7WUFFRixXQUFXO1lBQ1gsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FDbkQsNkJBQXNCLENBQ3ZCLENBQUM7WUFDRixNQUFNLFVBQVUsR0FBRyxNQUFNLGFBQWEsQ0FBQyxvQkFBb0IsQ0FDekQsQ0FBQyxDQUFDLElBQUksRUFDTixDQUFDLENBQUMsTUFBTSxDQUNULENBQUM7WUFDRixNQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsZUFBZSxDQUFDO1lBQzVDLDZCQUE2QjtZQUM3QixNQUFNLE9BQU8sR0FBRyxJQUFBLFVBQUcsRUFBQyxHQUFHLElBQUEsb0JBQVEsRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksUUFBUSxFQUFFLENBQUMsQ0FBQztZQUNyRCxNQUFNLFFBQVEsR0FBRyxHQUFHLCtCQUFtQixJQUFJLE9BQU8sRUFBRSxDQUFDO1lBRXJELHdCQUF3QjtZQUN4QixNQUFNLGdCQUFnQixHQUFlLE1BQU0sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQ2xFLGtCQUFVLENBQ1gsQ0FBQztZQUNGLE1BQU0sS0FBSyxHQUFHLE1BQU0sZ0JBQWdCLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN2RCxJQUFJLEtBQUssRUFBRTtnQkFDVCxNQUFNLEtBQUssR0FBb0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDakQsTUFBTSxXQUFXLEdBQUcsSUFBQSxrQkFBVyxFQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3hELE1BQU0sYUFBYSxHQUNqQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUMxRCxrQkFBa0I7Z0JBQ2xCLENBQUMsQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsV0FBVyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUM7Z0JBQ25FLGtCQUFrQjtnQkFDbEIsSUFBSSxXQUFXLEdBQUcsUUFBUSxJQUFJLGFBQWEsRUFBRTtvQkFDM0MsQ0FBQyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7b0JBQ2YsT0FBTyxVQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2lCQUNyQzthQUNGO1lBRUQsWUFBWTtZQUNaLE1BQU0sZ0JBQWdCLENBQUMsR0FBRyxDQUN4QixFQUFFLEVBQ0YsUUFBUSxFQUNSLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQ2IsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBQ2hCLE1BQU0sRUFBRSxNQUFNO2FBQ2YsQ0FBQyxFQUNGLFFBQVEsQ0FDVCxDQUFDO1lBRUYsWUFBWTtZQUNaLE9BQU8sTUFBTSxJQUFJLEVBQUUsQ0FBQztRQUN0QixDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsTUFBTSxDQUFDLE9BQU87UUFDWixPQUFPLGNBQWMsQ0FBQztJQUN4QixDQUFDO0NBQ0YsQ0FBQTt1QkE3RFksWUFBWTtJQUR4QixJQUFBLGlCQUFVLEdBQUU7R0FDQSxZQUFZLENBNkR4QjtBQUVEOzs7OztHQUtHO0FBQ0gsU0FBZ0Isc0JBQXNCLENBQUMsV0FBbUIsQ0FBQztJQUN6RCxPQUFPLElBQUEsdUJBQWdCLEVBQUMsWUFBWSxFQUFFLFFBQVEsRUFBRSxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUMxRSxDQUFDO0FBRkQsd0RBRUMifQ==