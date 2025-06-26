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
exports.SysLogLoginController = void 0;
const core_1 = require("@midwayjs/core");
const operate_log_1 = require("../../../framework/middleware/operate_log");
const authorize_user_1 = require("../../../framework/middleware/authorize_user");
const auth_1 = require("../../../framework/reqctx/auth");
const api_1 = require("../../../framework/resp/api");
const sys_log_login_1 = require("../service/sys_log_login");
/**系统登录日志信息 控制层处理 */
let SysLogLoginController = exports.SysLogLoginController = class SysLogLoginController {
    /**上下文 */
    c;
    /**系统登录日志服务 */
    sysLogLoginService;
    /**系统登录日志列表 */
    async list(query) {
        const dataScopeSQL = (0, auth_1.loginUserToDataScopeSQL)(this.c, 'sys_user', 'sys_user');
        const [rows, total] = await this.sysLogLoginService.findByPage(query, dataScopeSQL);
        return api_1.Resp.okData({ rows, total });
    }
    /**系统登录日志清空 */
    async clean() {
        const rows = await this.sysLogLoginService.clean();
        return api_1.Resp.okData(rows);
    }
    /**导出系统登录日志信息 */
    async export(query) {
        // 查询结果，根据查询条件结果，单页最大值限制
        const dataScopeSQL = (0, auth_1.loginUserToDataScopeSQL)(this.c, 'sys_user', 'sys_user');
        const [rows, total] = await this.sysLogLoginService.findByPage(query, dataScopeSQL);
        if (total === 0) {
            return api_1.Resp.errMsg('export data record as empty');
        }
        // 导出文件名称
        const fileName = `sys_log_login_export_${rows.length}_${Date.now()}.xlsx`;
        this.c.set('content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        this.c.set('content-disposition', `attachment;filename=${encodeURIComponent(fileName)}`);
        return await this.sysLogLoginService.exportData(rows, fileName);
    }
};
__decorate([
    (0, core_1.Inject)('ctx'),
    __metadata("design:type", Object)
], SysLogLoginController.prototype, "c", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_log_login_1.SysLogLoginService)
], SysLogLoginController.prototype, "sysLogLoginService", void 0);
__decorate([
    (0, core_1.Get)('/list', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:log:login:list'] }),
        ],
    }),
    __param(0, (0, core_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SysLogLoginController.prototype, "list", null);
__decorate([
    (0, core_1.Del)('/clean', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:log:login:remove'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '系统登录信息',
                businessType: operate_log_1.BUSINESS_TYPE.CLEAN,
            }),
        ],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SysLogLoginController.prototype, "clean", null);
__decorate([
    (0, core_1.Get)('/export', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:log:login:export'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '系统登录信息',
                businessType: operate_log_1.BUSINESS_TYPE.EXPORT,
            }),
        ],
    }),
    __param(0, (0, core_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SysLogLoginController.prototype, "export", null);
exports.SysLogLoginController = SysLogLoginController = __decorate([
    (0, core_1.Controller)('/system/log/login')
], SysLogLoginController);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX2xvZ19sb2dpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3N5c3RlbS9jb250cm9sbGVyL3N5c19sb2dfbG9naW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUNBTXdCO0FBR3hCLDJFQUdtRDtBQUNuRCxpRkFBdUY7QUFDdkYseURBQXlFO0FBQ3pFLHFEQUFtRDtBQUNuRCw0REFBOEQ7QUFFOUQsb0JBQW9CO0FBRWIsSUFBTSxxQkFBcUIsbUNBQTNCLE1BQU0scUJBQXFCO0lBQ2hDLFNBQVM7SUFFRCxDQUFDLENBQVU7SUFFbkIsY0FBYztJQUVOLGtCQUFrQixDQUFxQjtJQUUvQyxjQUFjO0lBTUQsQUFBTixLQUFLLENBQUMsSUFBSSxDQUFVLEtBQTZCO1FBQ3RELE1BQU0sWUFBWSxHQUFHLElBQUEsOEJBQXVCLEVBQzFDLElBQUksQ0FBQyxDQUFDLEVBQ04sVUFBVSxFQUNWLFVBQVUsQ0FDWCxDQUFDO1FBQ0YsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQzVELEtBQUssRUFDTCxZQUFZLENBQ2IsQ0FBQztRQUNGLE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRCxjQUFjO0lBVUQsQUFBTixLQUFLLENBQUMsS0FBSztRQUNoQixNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNuRCxPQUFPLFVBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVELGdCQUFnQjtJQVVILEFBQU4sS0FBSyxDQUFDLE1BQU0sQ0FBVSxLQUE2QjtRQUN4RCx3QkFBd0I7UUFDeEIsTUFBTSxZQUFZLEdBQUcsSUFBQSw4QkFBdUIsRUFDMUMsSUFBSSxDQUFDLENBQUMsRUFDTixVQUFVLEVBQ1YsVUFBVSxDQUNYLENBQUM7UUFDRixNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FDNUQsS0FBSyxFQUNMLFlBQVksQ0FDYixDQUFDO1FBQ0YsSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFO1lBQ2YsT0FBTyxVQUFJLENBQUMsTUFBTSxDQUFDLDZCQUE2QixDQUFDLENBQUM7U0FDbkQ7UUFFRCxTQUFTO1FBQ1QsTUFBTSxRQUFRLEdBQUcsd0JBQXdCLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUM7UUFDMUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQ1IsY0FBYyxFQUNkLG1FQUFtRSxDQUNwRSxDQUFDO1FBQ0YsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQ1IscUJBQXFCLEVBQ3JCLHVCQUF1QixrQkFBa0IsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUN0RCxDQUFDO1FBQ0YsT0FBTyxNQUFNLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7Q0FDRixDQUFBO0FBN0VTO0lBRFAsSUFBQSxhQUFNLEVBQUMsS0FBSyxDQUFDOztnREFDSztBQUlYO0lBRFAsSUFBQSxhQUFNLEdBQUU7OEJBQ21CLGtDQUFrQjtpRUFBQztBQVFsQztJQUxaLElBQUEsVUFBRyxFQUFDLE9BQU8sRUFBRTtRQUNaLFVBQVUsRUFBRTtZQUNWLElBQUEsd0NBQXVCLEVBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxFQUFFLENBQUM7U0FDakU7S0FDRixDQUFDO0lBQ2lCLFdBQUEsSUFBQSxZQUFLLEdBQUUsQ0FBQTs7OztpREFXekI7QUFZWTtJQVRaLElBQUEsVUFBRyxFQUFDLFFBQVEsRUFBRTtRQUNiLFVBQVUsRUFBRTtZQUNWLElBQUEsd0NBQXVCLEVBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQyxFQUFFLENBQUM7WUFDbEUsSUFBQSxrQ0FBb0IsRUFBQztnQkFDbkIsS0FBSyxFQUFFLFFBQVE7Z0JBQ2YsWUFBWSxFQUFFLDJCQUFhLENBQUMsS0FBSzthQUNsQyxDQUFDO1NBQ0g7S0FDRixDQUFDOzs7O2tEQUlEO0FBWVk7SUFUWixJQUFBLFVBQUcsRUFBQyxTQUFTLEVBQUU7UUFDZCxVQUFVLEVBQUU7WUFDVixJQUFBLHdDQUF1QixFQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMseUJBQXlCLENBQUMsRUFBRSxDQUFDO1lBQ2xFLElBQUEsa0NBQW9CLEVBQUM7Z0JBQ25CLEtBQUssRUFBRSxRQUFRO2dCQUNmLFlBQVksRUFBRSwyQkFBYSxDQUFDLE1BQU07YUFDbkMsQ0FBQztTQUNIO0tBQ0YsQ0FBQztJQUNtQixXQUFBLElBQUEsWUFBSyxHQUFFLENBQUE7Ozs7bURBMEIzQjtnQ0EvRVUscUJBQXFCO0lBRGpDLElBQUEsaUJBQVUsRUFBQyxtQkFBbUIsQ0FBQztHQUNuQixxQkFBcUIsQ0FnRmpDIn0=