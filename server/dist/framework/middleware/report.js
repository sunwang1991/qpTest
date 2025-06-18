"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportMiddleware = void 0;
const core_1 = require("@midwayjs/core");
/**请求响应日志-中间件 */
let ReportMiddleware = exports.ReportMiddleware = class ReportMiddleware {
    resolve() {
        return async (c, next) => {
            // 执行下一个 Web 中间件，最后执行到控制器
            // 这里可以拿到下一个中间件或者控制器的返回值
            const res = await next();
            // 计算请求处理时间，并打印日志
            const duration = Date.now() - c.startTime;
            c.logger.info('\n访问接口: %s \n总耗时: %dms', c.path, duration);
            return res;
        };
    }
    static getName() {
        return 'REPORT';
    }
};
exports.ReportMiddleware = ReportMiddleware = __decorate([
    (0, core_1.Middleware)()
], ReportMiddleware);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2ZyYW1ld29yay9taWRkbGV3YXJlL3JlcG9ydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSx5Q0FBeUQ7QUFHekQsZ0JBQWdCO0FBRVQsSUFBTSxnQkFBZ0IsOEJBQXRCLE1BQU0sZ0JBQWdCO0lBQzNCLE9BQU87UUFDTCxPQUFPLEtBQUssRUFBRSxDQUFVLEVBQUUsSUFBa0IsRUFBRSxFQUFFO1lBQzlDLHlCQUF5QjtZQUN6Qix3QkFBd0I7WUFDeEIsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFJLEVBQUUsQ0FBQztZQUV6QixpQkFBaUI7WUFDakIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFDMUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztZQUUxRCxPQUFPLEdBQUcsQ0FBQztRQUNiLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCxNQUFNLENBQUMsT0FBTztRQUNaLE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7Q0FDRixDQUFBOzJCQWxCWSxnQkFBZ0I7SUFENUIsSUFBQSxpQkFBVSxHQUFFO0dBQ0EsZ0JBQWdCLENBa0I1QiJ9