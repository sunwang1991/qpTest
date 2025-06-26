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
exports.SysLogOperateController = void 0;
const core_1 = require("@midwayjs/core");
const operate_log_1 = require("../../../framework/middleware/operate_log");
const authorize_user_1 = require("../../../framework/middleware/authorize_user");
const auth_1 = require("../../../framework/reqctx/auth");
const api_1 = require("../../../framework/resp/api");
const sys_log_operate_1 = require("../service/sys_log_operate");
/**操作日志记录信息 控制层处理 */
let SysLogOperateController = exports.SysLogOperateController = class SysLogOperateController {
    /**上下文 */
    c;
    /**操作日志服务 */
    sysLogOperateService;
    /**操作日志列表 */
    async list(query) {
        const dataScopeSQL = (0, auth_1.loginUserToDataScopeSQL)(this.c, 'sys_user', 'sys_user');
        const [rows, total] = await this.sysLogOperateService.findByPage(query, dataScopeSQL);
        return api_1.Resp.okData({ rows, total });
    }
    /**操作日志清空 */
    async clean() {
        const rows = await this.sysLogOperateService.clean();
        return api_1.Resp.okData(rows);
    }
    /**导出操作日志 */
    async export(query) {
        // 查询结果，根据查询条件结果，单页最大值限制
        const dataScopeSQL = (0, auth_1.loginUserToDataScopeSQL)(this.c, 'sys_user', 'sys_user');
        const [rows, total] = await this.sysLogOperateService.findByPage(query, dataScopeSQL);
        if (total === 0) {
            return api_1.Resp.errMsg('export data record as empty');
        }
        // 导出文件名称
        const fileName = `sys_log_operate_export_${rows.length}_${Date.now()}.xlsx`;
        this.c.set('content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        this.c.set('content-disposition', `attachment;filename=${encodeURIComponent(fileName)}`);
        return await this.sysLogOperateService.exportData(rows, fileName);
    }
};
__decorate([
    (0, core_1.Inject)('ctx'),
    __metadata("design:type", Object)
], SysLogOperateController.prototype, "c", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_log_operate_1.SysLogOperateService)
], SysLogOperateController.prototype, "sysLogOperateService", void 0);
__decorate([
    (0, core_1.Get)('/list', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:log:operate:list'] }),
        ],
    }),
    __param(0, (0, core_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SysLogOperateController.prototype, "list", null);
__decorate([
    (0, core_1.Del)('/clean', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:log:operate:remove'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '操作日志',
                businessType: operate_log_1.BUSINESS_TYPE.CLEAN,
            }),
        ],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SysLogOperateController.prototype, "clean", null);
__decorate([
    (0, core_1.Get)('/export', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:log:operate:export'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '操作日志',
                businessType: operate_log_1.BUSINESS_TYPE.EXPORT,
            }),
        ],
    }),
    __param(0, (0, core_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SysLogOperateController.prototype, "export", null);
exports.SysLogOperateController = SysLogOperateController = __decorate([
    (0, core_1.Controller)('/system/log/operate')
], SysLogOperateController);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX2xvZ19vcGVyYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvc3lzdGVtL2NvbnRyb2xsZXIvc3lzX2xvZ19vcGVyYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUFxRTtBQUdyRSwyRUFHbUQ7QUFDbkQsaUZBQXVGO0FBQ3ZGLHlEQUF5RTtBQUN6RSxxREFBbUQ7QUFDbkQsZ0VBQWtFO0FBRWxFLG9CQUFvQjtBQUViLElBQU0sdUJBQXVCLHFDQUE3QixNQUFNLHVCQUF1QjtJQUNsQyxTQUFTO0lBRUQsQ0FBQyxDQUFVO0lBRW5CLFlBQVk7SUFFSixvQkFBb0IsQ0FBdUI7SUFFbkQsWUFBWTtJQU1DLEFBQU4sS0FBSyxDQUFDLElBQUksQ0FBVSxLQUE2QjtRQUN0RCxNQUFNLFlBQVksR0FBRyxJQUFBLDhCQUF1QixFQUMxQyxJQUFJLENBQUMsQ0FBQyxFQUNOLFVBQVUsRUFDVixVQUFVLENBQ1gsQ0FBQztRQUNGLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUM5RCxLQUFLLEVBQ0wsWUFBWSxDQUNiLENBQUM7UUFDRixPQUFPLFVBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsWUFBWTtJQVVDLEFBQU4sS0FBSyxDQUFDLEtBQUs7UUFDaEIsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsb0JBQW9CLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDckQsT0FBTyxVQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFRCxZQUFZO0lBVUMsQUFBTixLQUFLLENBQUMsTUFBTSxDQUFVLEtBQTZCO1FBQ3hELHdCQUF3QjtRQUN4QixNQUFNLFlBQVksR0FBRyxJQUFBLDhCQUF1QixFQUMxQyxJQUFJLENBQUMsQ0FBQyxFQUNOLFVBQVUsRUFDVixVQUFVLENBQ1gsQ0FBQztRQUNGLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUM5RCxLQUFLLEVBQ0wsWUFBWSxDQUNiLENBQUM7UUFDRixJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7WUFDZixPQUFPLFVBQUksQ0FBQyxNQUFNLENBQUMsNkJBQTZCLENBQUMsQ0FBQztTQUNuRDtRQUVELFNBQVM7UUFDVCxNQUFNLFFBQVEsR0FBRywwQkFBMEIsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQztRQUM1RSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FDUixjQUFjLEVBQ2QsbUVBQW1FLENBQ3BFLENBQUM7UUFDRixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FDUixxQkFBcUIsRUFDckIsdUJBQXVCLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQ3RELENBQUM7UUFDRixPQUFPLE1BQU0sSUFBSSxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDcEUsQ0FBQztDQUNGLENBQUE7QUE3RVM7SUFEUCxJQUFBLGFBQU0sRUFBQyxLQUFLLENBQUM7O2tEQUNLO0FBSVg7SUFEUCxJQUFBLGFBQU0sR0FBRTs4QkFDcUIsc0NBQW9CO3FFQUFDO0FBUXRDO0lBTFosSUFBQSxVQUFHLEVBQUMsT0FBTyxFQUFFO1FBQ1osVUFBVSxFQUFFO1lBQ1YsSUFBQSx3Q0FBdUIsRUFBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLHlCQUF5QixDQUFDLEVBQUUsQ0FBQztTQUNuRTtLQUNGLENBQUM7SUFDaUIsV0FBQSxJQUFBLFlBQUssR0FBRSxDQUFBOzs7O21EQVd6QjtBQVlZO0lBVFosSUFBQSxVQUFHLEVBQUMsUUFBUSxFQUFFO1FBQ2IsVUFBVSxFQUFFO1lBQ1YsSUFBQSx3Q0FBdUIsRUFBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLDJCQUEyQixDQUFDLEVBQUUsQ0FBQztZQUNwRSxJQUFBLGtDQUFvQixFQUFDO2dCQUNuQixLQUFLLEVBQUUsTUFBTTtnQkFDYixZQUFZLEVBQUUsMkJBQWEsQ0FBQyxLQUFLO2FBQ2xDLENBQUM7U0FDSDtLQUNGLENBQUM7Ozs7b0RBSUQ7QUFZWTtJQVRaLElBQUEsVUFBRyxFQUFDLFNBQVMsRUFBRTtRQUNkLFVBQVUsRUFBRTtZQUNWLElBQUEsd0NBQXVCLEVBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQyxFQUFFLENBQUM7WUFDcEUsSUFBQSxrQ0FBb0IsRUFBQztnQkFDbkIsS0FBSyxFQUFFLE1BQU07Z0JBQ2IsWUFBWSxFQUFFLDJCQUFhLENBQUMsTUFBTTthQUNuQyxDQUFDO1NBQ0g7S0FDRixDQUFDO0lBQ21CLFdBQUEsSUFBQSxZQUFLLEdBQUUsQ0FBQTs7OztxREEwQjNCO2tDQS9FVSx1QkFBdUI7SUFEbkMsSUFBQSxpQkFBVSxFQUFDLHFCQUFxQixDQUFDO0dBQ3JCLHVCQUF1QixDQWdGbkMifQ==