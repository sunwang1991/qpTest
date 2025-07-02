"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCatch = void 0;
const core_1 = require("@midwayjs/core");
const api_1 = require("../resp/api");
const auth_1 = require("../reqctx/auth");
/**
 * 默认全局错误统一捕获
 *
 * 所有的未分类错误会到这里
 */
let ErrorCatch = exports.ErrorCatch = class ErrorCatch {
    async catch(err, c) {
        const userId = (0, auth_1.loginUserToUserID)(c);
        c.logger.error('[Recovery][%d] panic recovered: %s => %s %s', userId, c.url, err.name, err.message);
        // 记录更多调试信息到日志
        c.logger.error('详细错误信息: %o', {
            stack: err.stack,
            headers: c.headers,
            query: c.query,
            body: c.request.body,
        });
        // 返回错误响应给客户端
        if (c.app.getEnv() === 'prod') {
            // 生产环境中使用通用错误消息
            // 但为特定错误类型提供更有用的信息
            let prodMsg = 'internal error';
            // 为特定错误提供更友好的消息
            if (err.name === 'CSRFError') {
                // 记录更详细的 CSRF 错误信息
                c.logger.error('CSRF Error 详情: %o', {
                    referer: c.header.referer,
                    origin: c.header.origin,
                    host: c.header.host,
                    url: c.url,
                });
                prodMsg = '请求来源无效，请刷新页面重试';
            }
            else if (err.name === 'PayloadTooLargeError') {
                prodMsg = '上传文件过大';
            }
            else if (err.name === 'ValidationError') {
                prodMsg = '输入数据格式有误';
            }
            c.body = api_1.Resp.codeMsg(500001, prodMsg);
            c.status = core_1.HttpStatus.INTERNAL_SERVER_ERROR;
            return;
        }
        let msg = err.message;
        // 过滤已经知道的错误
        const errMsgs = [
            { k: 'QueryFailedError', v: '访问数据权限错误' },
            { k: 'CSRFError', v: `无效 Referer ${c.header.referer || '未知'}` },
            { k: 'PayloadTooLargeError', v: '超出最大上传文件大小范围' },
            { k: 'MultipartInvalidFilenameError', v: '上传文件拓展格式不支持' },
        ];
        const msgItem = errMsgs.find(n => n.k === err.name);
        if (msgItem) {
            msg = msgItem.v;
        }
        // 返回500，提示错误信息
        c.body = api_1.Resp.codeMsg(500001, msg);
        c.status = core_1.HttpStatus.INTERNAL_SERVER_ERROR;
    }
};
exports.ErrorCatch = ErrorCatch = __decorate([
    (0, core_1.Catch)()
], ErrorCatch);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JfY2F0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZnJhbWV3b3JrL2NhdGNoL2Vycm9yX2NhdGNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLHlDQUFtRDtBQUduRCxxQ0FBbUM7QUFDbkMseUNBQW1EO0FBRW5EOzs7O0dBSUc7QUFFSSxJQUFNLFVBQVUsd0JBQWhCLE1BQU0sVUFBVTtJQUNyQixLQUFLLENBQUMsS0FBSyxDQUFDLEdBQVUsRUFBRSxDQUFVO1FBQ2hDLE1BQU0sTUFBTSxHQUFHLElBQUEsd0JBQWlCLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQ1osNkNBQTZDLEVBQzdDLE1BQU0sRUFDTixDQUFDLENBQUMsR0FBRyxFQUNMLEdBQUcsQ0FBQyxJQUFJLEVBQ1IsR0FBRyxDQUFDLE9BQU8sQ0FDWixDQUFDO1FBRUYsY0FBYztRQUNkLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRTtZQUMzQixLQUFLLEVBQUUsR0FBRyxDQUFDLEtBQUs7WUFDaEIsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPO1lBQ2xCLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSztZQUNkLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUk7U0FDckIsQ0FBQyxDQUFDO1FBRUgsYUFBYTtRQUNiLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxNQUFNLEVBQUU7WUFDN0IsZ0JBQWdCO1lBQ2hCLG1CQUFtQjtZQUNuQixJQUFJLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQztZQUUvQixnQkFBZ0I7WUFDaEIsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLFdBQVcsRUFBRTtnQkFDNUIsbUJBQW1CO2dCQUNuQixDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsRUFBRTtvQkFDbEMsT0FBTyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTztvQkFDekIsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTTtvQkFDdkIsSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSTtvQkFDbkIsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHO2lCQUNYLENBQUMsQ0FBQztnQkFDSCxPQUFPLEdBQUcsZ0JBQWdCLENBQUM7YUFDNUI7aUJBQU0sSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLHNCQUFzQixFQUFFO2dCQUM5QyxPQUFPLEdBQUcsUUFBUSxDQUFDO2FBQ3BCO2lCQUFNLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxpQkFBaUIsRUFBRTtnQkFDekMsT0FBTyxHQUFHLFVBQVUsQ0FBQzthQUN0QjtZQUVELENBQUMsQ0FBQyxJQUFJLEdBQUcsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDdkMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxpQkFBVSxDQUFDLHFCQUFxQixDQUFDO1lBQzVDLE9BQU87U0FDUjtRQUVELElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUM7UUFDdEIsWUFBWTtRQUNaLE1BQU0sT0FBTyxHQUFHO1lBQ2QsRUFBRSxDQUFDLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRTtZQUN4QyxFQUFFLENBQUMsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLElBQUksSUFBSSxFQUFFLEVBQUU7WUFDL0QsRUFBRSxDQUFDLEVBQUUsc0JBQXNCLEVBQUUsQ0FBQyxFQUFFLGNBQWMsRUFBRTtZQUNoRCxFQUFFLENBQUMsRUFBRSwrQkFBK0IsRUFBRSxDQUFDLEVBQUUsYUFBYSxFQUFFO1NBQ3pELENBQUM7UUFDRixNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEQsSUFBSSxPQUFPLEVBQUU7WUFDWCxHQUFHLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUNqQjtRQUVELGVBQWU7UUFDZixDQUFDLENBQUMsSUFBSSxHQUFHLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxNQUFNLEdBQUcsaUJBQVUsQ0FBQyxxQkFBcUIsQ0FBQztJQUM5QyxDQUFDO0NBQ0YsQ0FBQTtxQkEvRFksVUFBVTtJQUR0QixJQUFBLFlBQUssR0FBRTtHQUNLLFVBQVUsQ0ErRHRCIn0=