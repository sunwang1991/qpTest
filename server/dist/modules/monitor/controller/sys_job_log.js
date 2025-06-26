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
exports.SysJobLogController = void 0;
const core_1 = require("@midwayjs/core");
const validate_1 = require("@midwayjs/validate");
const parse_1 = require("../../../framework/utils/parse/parse");
const operate_log_1 = require("../../../framework/middleware/operate_log");
const authorize_user_1 = require("../../../framework/middleware/authorize_user");
const api_1 = require("../../../framework/resp/api");
const sys_job_log_1 = require("../service/sys_job_log");
const sys_job_1 = require("../service/sys_job");
/**调度任务日志信息 控制层处理 */
let SysJobLogController = exports.SysJobLogController = class SysJobLogController {
    /**上下文 */
    c;
    /**调度任务服务 */
    sysJobService;
    /**调度任务日志服务 */
    sysJobLogService;
    /**调度任务日志列表 */
    async list(query) {
        const jobId = (0, parse_1.parseNumber)(query.jobId);
        if (jobId > 0) {
            const job = await this.sysJobService.findById(jobId);
            query.jobName = job.jobName;
            query.jobGroup = job.jobGroup;
        }
        const [rows, total] = await this.sysJobLogService.findByPage(query);
        return api_1.Resp.okData({ rows, total });
    }
    /**调度任务日志信息 */
    async info(logId) {
        if (logId <= 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: logId is empty');
        }
        const data = await this.sysJobLogService.findById(logId);
        if (data.logId === logId) {
            return api_1.Resp.okData(data);
        }
        return api_1.Resp.err();
    }
    /**调度任务日志删除 */
    async remove(logId) {
        if (logId === '') {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: logId is empty');
        }
        // 处理字符转id数组后去重
        const uniqueIDs = (0, parse_1.parseRemoveDuplicatesToArray)(logId, ',');
        // 转换成number数组类型
        const ids = uniqueIDs.map(id => (0, parse_1.parseNumber)(id));
        const rows = await this.sysJobLogService.deleteByIds(ids);
        if (rows > 0) {
            return api_1.Resp.okMsg(`删除成功: ${rows}`);
        }
        return api_1.Resp.err();
    }
    /**调度任务日志清空 */
    async clean() {
        const rows = await this.sysJobLogService.clean();
        return api_1.Resp.okData(rows);
    }
    /**导出调度任务日志信息 */
    async export(query) {
        // 查询结果，根据查询条件结果，单页最大值限制
        const jobId = (0, parse_1.parseNumber)(query.jobId);
        if (jobId > 0) {
            const job = await this.sysJobLogService.findById(jobId);
            query.jobName = job.jobName;
            query.jobGroup = job.jobGroup;
        }
        const [rows, total] = await this.sysJobLogService.findByPage(query);
        if (total === 0) {
            return api_1.Resp.errMsg('export data record as empty');
        }
        // 导出数据表格
        const fileName = `job_log_export_${rows.length}_${Date.now()}.xlsx`;
        this.c.set('content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        this.c.set('content-disposition', `attachment;filename=${encodeURIComponent(fileName)}`);
        return await this.sysJobLogService.exportData(rows, fileName);
    }
};
__decorate([
    (0, core_1.Inject)('ctx'),
    __metadata("design:type", Object)
], SysJobLogController.prototype, "c", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_job_1.SysJobService)
], SysJobLogController.prototype, "sysJobService", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_job_log_1.SysJobLogService)
], SysJobLogController.prototype, "sysJobLogService", void 0);
__decorate([
    (0, core_1.Get)('/list', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['monitor:job:list'] }),
        ],
    }),
    __param(0, (0, core_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SysJobLogController.prototype, "list", null);
__decorate([
    (0, core_1.Get)('/:logId', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['monitor:job:query'] }),
        ],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.number())),
    __param(0, (0, core_1.Param)('logId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SysJobLogController.prototype, "info", null);
__decorate([
    (0, core_1.Del)('/:logId', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['monitor:job:remove'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '调度任务信息',
                businessType: operate_log_1.BUSINESS_TYPE.DELETE,
            }),
        ],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.string().allow(''))),
    __param(0, (0, core_1.Param)('logId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SysJobLogController.prototype, "remove", null);
__decorate([
    (0, core_1.Del)('/clean', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['monitor:job:remove'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '调度任务日志信息',
                businessType: operate_log_1.BUSINESS_TYPE.CLEAN,
            }),
        ],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SysJobLogController.prototype, "clean", null);
__decorate([
    (0, core_1.Get)('/export', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['monitor:job:export'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '调度任务日志信息',
                businessType: operate_log_1.BUSINESS_TYPE.EXPORT,
            }),
        ],
    }),
    __param(0, (0, core_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SysJobLogController.prototype, "export", null);
exports.SysJobLogController = SysJobLogController = __decorate([
    (0, core_1.Controller)('/monitor/job/log')
], SysJobLogController);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX2pvYl9sb2cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9tb25pdG9yL2NvbnRyb2xsZXIvc3lzX2pvYl9sb2cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUNBQTRFO0FBQzVFLGlEQUFxRDtBQUdyRCxnRUFHOEM7QUFDOUMsMkVBR21EO0FBQ25ELGlGQUF1RjtBQUN2RixxREFBbUQ7QUFDbkQsd0RBQTBEO0FBQzFELGdEQUFtRDtBQUVuRCxvQkFBb0I7QUFFYixJQUFNLG1CQUFtQixpQ0FBekIsTUFBTSxtQkFBbUI7SUFDOUIsU0FBUztJQUVELENBQUMsQ0FBVTtJQUVuQixZQUFZO0lBRUosYUFBYSxDQUFnQjtJQUVyQyxjQUFjO0lBRU4sZ0JBQWdCLENBQW1CO0lBRTNDLGNBQWM7SUFNRCxBQUFOLEtBQUssQ0FBQyxJQUFJLENBQVUsS0FBNkI7UUFDdEQsTUFBTSxLQUFLLEdBQUcsSUFBQSxtQkFBVyxFQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2QyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7WUFDYixNQUFNLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3JELEtBQUssQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQztZQUM1QixLQUFLLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUM7U0FDL0I7UUFDRCxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwRSxPQUFPLFVBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsY0FBYztJQU1ELEFBQU4sS0FBSyxD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