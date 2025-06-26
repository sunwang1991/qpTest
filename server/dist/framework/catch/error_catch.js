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
        // 返回错误响应给客户端
        if (c.app.getEnv() === 'prod') {
            c.body = api_1.Resp.codeMsg(500001, 'internal error');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JfY2F0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZnJhbWV3b3JrL2NhdGNoL2Vycm9yX2NhdGNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLHlDQUFtRDtBQUduRCxxQ0FBbUM7QUFDbkMseUNBQW1EO0FBRW5EOzs7O0dBSUc7QUFFSSxJQUFNLFVBQVUsd0JBQWhCLE1BQU0sVUFBVTtJQUNyQixLQUFLLENBQUMsS0FBSyxDQUFDLEdBQVUsRUFBRSxDQUFVO1FBQ2hDLE1BQU0sTUFBTSxHQUFHLElBQUEsd0JBQWlCLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQ1osNkNBQTZDLEVBQzdDLE1BQU0sRUFDTixDQUFDLENBQUMsR0FBRyxFQUNMLEdBQUcsQ0FBQyxJQUFJLEVBQ1IsR0FBRyxDQUFDLE9BQU8sQ0FDWixDQUFDO1FBRUYsYUFBYTtRQUNiLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxNQUFNLEVBQUU7WUFDN0IsQ0FBQyxDQUFDLElBQUksR0FBRyxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ2hELENBQUMsQ0FBQyxNQUFNLEdBQUcsaUJBQVUsQ0FBQyxxQkFBcUIsQ0FBQztZQUM1QyxPQUFPO1NBQ1I7UUFFRCxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDO1FBQ3RCLFlBQVk7UUFDWixNQUFNLE9BQU8sR0FBRztZQUNkLEVBQUUsQ0FBQyxFQUFFLGtCQUFrQixFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUU7WUFDeEMsRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLElBQUksRUFBRSxFQUFFO1lBQy9ELEVBQUUsQ0FBQyxFQUFFLHNCQUFzQixFQUFFLENBQUMsRUFBRSxjQUFjLEVBQUU7WUFDaEQsRUFBRSxDQUFDLEVBQUUsK0JBQStCLEVBQUUsQ0FBQyxFQUFFLGFBQWEsRUFBRTtTQUN6RCxDQUFDO1FBQ0YsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BELElBQUksT0FBTyxFQUFFO1lBQ1gsR0FBRyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FDakI7UUFFRCxlQUFlO1FBQ2YsQ0FBQyxDQUFDLElBQUksR0FBRyxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUMsTUFBTSxHQUFHLGlCQUFVLENBQUMscUJBQXFCLENBQUM7SUFDOUMsQ0FBQztDQUNGLENBQUE7cUJBbkNZLFVBQVU7SUFEdEIsSUFBQSxZQUFLLEdBQUU7R0FDSyxVQUFVLENBbUN0QiJ9