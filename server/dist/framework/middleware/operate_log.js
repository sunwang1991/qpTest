"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperateLogMiddleware = exports.OperateLog = exports.BUSINESS_TYPE = void 0;
const core_1 = require("@midwayjs/core");
const sys_log_operate_1 = require("../../modules/system/service/sys_log_operate");
const sys_log_operate_2 = require("../../modules/system/model/sys_log_operate");
const ip2region_1 = require("../ip2region/ip2region");
const common_1 = require("../constants/common");
const parse_1 = require("../utils/parse/parse");
const auth_1 = require("../reqctx/auth");
const api_1 = require("../resp/api");
/**操作日志-业务操作类型枚举 */
var BUSINESS_TYPE;
(function (BUSINESS_TYPE) {
    /**其它 */
    BUSINESS_TYPE["OTHER"] = "0";
    /**新增 */
    BUSINESS_TYPE["INSERT"] = "1";
    /**修改 */
    BUSINESS_TYPE["UPDATE"] = "2";
    /**删除 */
    BUSINESS_TYPE["DELETE"] = "3";
    /**授权 */
    BUSINESS_TYPE["GRANT"] = "4";
    /**导出 */
    BUSINESS_TYPE["EXPORT"] = "5";
    /**导入 */
    BUSINESS_TYPE["IMPORT"] = "6";
    /**强退 */
    BUSINESS_TYPE["FORCE"] = "7";
    /**清空数据 */
    BUSINESS_TYPE["CLEAN"] = "8";
})(BUSINESS_TYPE || (exports.BUSINESS_TYPE = BUSINESS_TYPE = {}));
/**敏感属性字段进行掩码 */
const MASK_PROPERTIES = [
    'password',
    'oldPassword',
    'newPassword',
    'confirmPassword',
];
/**访问操作日志记录-中间件 */
let OperateLog = exports.OperateLog = class OperateLog {
    resolve(_, options) {
        return async (c, next) => {
            // 初始可选参数数据
            if (typeof options.isSaveRequestData === 'undefined') {
                options.isSaveRequestData = true;
            }
            if (typeof options.isSaveResponseData === 'undefined') {
                options.isSaveResponseData = true;
            }
            // 获取执行函数名称
            const routerService = await c.requestContext.getAsync(core_1.MidwayWebRouterService);
            const routerInfo = await routerService.getMatchedRouterInfo(c.path, c.method);
            const funcName = `${routerInfo.controllerClz.name}.${routerInfo.method}`;
            // 解析ip地址
            const ipaddr = (0, ip2region_1.clientIP)(c.ip);
            const location = await (0, ip2region_1.realAddressByIp)(c.ip);
            // 获取登录用户信息
            const userName = (0, auth_1.loginUserToUserName)(c);
            if (userName === '') {
                c.status = 401;
                return api_1.Resp.codeMsg(401002, 'invalid login user information');
            }
            // 操作日志记录
            const operLog = new sys_log_operate_2.SysLogOperate();
            operLog.title = options.title;
            operLog.businessType = options.businessType;
            operLog.operaMethod = funcName;
            operLog.operaUrl = c.path;
            operLog.operaUrlMethod = c.method;
            operLog.operaIp = ipaddr;
            operLog.operaLocation = location;
            operLog.operaBy = userName;
            // 是否需要保存request，参数和值
            if (options.isSaveRequestData) {
                const params = Object.assign({}, c.request.body, c.request.query);
                // 敏感属性字段进行掩码
                for (const key in params) {
                    if (Object.prototype.hasOwnProperty.call(params, key)) {
                        if (MASK_PROPERTIES.includes(key)) {
                            params[key] = (0, parse_1.parseSafeContent)(params[key]);
                        }
                    }
                }
                operLog.operaParam = JSON.stringify(params).substring(0, 2000);
            }
            // 调用下一个处理程序
            const res = await next();
            // 响应状态
            const status = res.code;
            if (status === api_1.Resp.CODE_SUCCESS) {
                operLog.statusFlag = common_1.STATUS_YES;
            }
            else {
                operLog.statusFlag = common_1.STATUS_NO;
            }
            // 是否需要保存response，参数和值
            if (options.isSaveResponseData) {
                const contentDisposition = c.get('Content-Disposition');
                const contentType = c.get('Content-Type') || 'application/json; charset=utf-8';
                const content = contentType + contentDisposition;
                const msg = `{"status":"${status}","size":${JSON.stringify(res).length},"content-type":"${content}"}`;
                operLog.operaMsg = msg;
            }
            // 日志记录时间
            operLog.costTime = Date.now() - c.startTime;
            // 保存操作记录到数据库
            const sysLogOperateService = await c.requestContext.getAsync(sys_log_operate_1.SysLogOperateService);
            await sysLogOperateService.insert(operLog);
            // 返回执行结果
            return res;
        };
    }
    static getName() {
        return 'OPER_LOG';
    }
};
exports.OperateLog = OperateLog = __decorate([
    (0, core_1.Middleware)()
], OperateLog);
/**
 * 访问操作日志记录-中间件
 *
 * 请在用户身份授权认证校验后使用以便获取登录用户信息
 * @param options 操作日志参数
 */
function OperateLogMiddleware(options) {
    return (0, core_1.createMiddleware)(OperateLog, options, OperateLog.getName());
}
exports.OperateLogMiddleware = OperateLogMiddleware;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3BlcmF0ZV9sb2cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZnJhbWV3b3JrL21pZGRsZXdhcmUvb3BlcmF0ZV9sb2cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEseUNBS3dCO0FBR3hCLGtGQUFvRjtBQUNwRixnRkFBMkU7QUFDM0Usc0RBQW1FO0FBQ25FLGdEQUE0RDtBQUM1RCxnREFBd0Q7QUFDeEQseUNBQXFEO0FBQ3JELHFDQUFtQztBQUVuQyxtQkFBbUI7QUFDbkIsSUFBWSxhQW1CWDtBQW5CRCxXQUFZLGFBQWE7SUFDdkIsUUFBUTtJQUNSLDRCQUFXLENBQUE7SUFDWCxRQUFRO0lBQ1IsNkJBQVksQ0FBQTtJQUNaLFFBQVE7SUFDUiw2QkFBWSxDQUFBO0lBQ1osUUFBUTtJQUNSLDZCQUFZLENBQUE7SUFDWixRQUFRO0lBQ1IsNEJBQVcsQ0FBQTtJQUNYLFFBQVE7SUFDUiw2QkFBWSxDQUFBO0lBQ1osUUFBUTtJQUNSLDZCQUFZLENBQUE7SUFDWixRQUFRO0lBQ1IsNEJBQVcsQ0FBQTtJQUNYLFVBQVU7SUFDViw0QkFBVyxDQUFBO0FBQ2IsQ0FBQyxFQW5CVyxhQUFhLDZCQUFiLGFBQWEsUUFtQnhCO0FBY0QsZ0JBQWdCO0FBQ2hCLE1BQU0sZUFBZSxHQUFHO0lBQ3RCLFVBQVU7SUFDVixhQUFhO0lBQ2IsYUFBYTtJQUNiLGlCQUFpQjtDQUNsQixDQUFDO0FBRUYsa0JBQWtCO0FBRVgsSUFBTSxVQUFVLHdCQUFoQixNQUFNLFVBQVU7SUFDckIsT0FBTyxDQUFDLENBQU0sRUFBRSxPQUFnQjtRQUM5QixPQUFPLEtBQUssRUFBRSxDQUFVLEVBQUUsSUFBa0IsRUFBRSxFQUFFO1lBQzlDLFdBQVc7WUFDWCxJQUFJLE9BQU8sT0FBTyxDQUFDLGlCQUFpQixLQUFLLFdBQVcsRUFBRTtnQkFDcEQsT0FBTyxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQzthQUNsQztZQUNELElBQUksT0FBTyxP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