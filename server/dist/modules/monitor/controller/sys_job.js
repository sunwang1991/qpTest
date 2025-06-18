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
exports.SysJobController = void 0;
const core_1 = require("@midwayjs/core");
const validate_1 = require("@midwayjs/validate");
const parse_1 = require("../../../framework/utils/parse/parse");
const operate_log_1 = require("../../../framework/middleware/operate_log");
const repeat_submit_1 = require("../../../framework/middleware/repeat_submit");
const authorize_user_1 = require("../../../framework/middleware/authorize_user");
const auth_1 = require("../../../framework/reqctx/auth");
const api_1 = require("../../../framework/resp/api");
const sys_job_1 = require("../service/sys_job");
const sys_job_2 = require("../model/sys_job");
/**调度任务信息 控制层处理*/
let SysJobController = exports.SysJobController = class SysJobController {
    /**上下文 */
    c;
    /**调度任务服务 */
    sysJobService;
    /**调度任务列表 */
    async list(query) {
        const [rows, total] = await this.sysJobService.findByPage(query);
        return api_1.Resp.okData({ rows, total });
    }
    /**调度任务信息 */
    async info(jobId) {
        if (jobId <= 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: jobId not is empty');
        }
        const jobInfo = await this.sysJobService.findById(jobId);
        if (jobInfo.jobId === jobId) {
            return api_1.Resp.okData(jobInfo);
        }
        return api_1.Resp.err();
    }
    /**调度任务新增 */
    async add(body) {
        if (body.jobId > 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: jobId not is empty');
        }
        // 检查cron表达式格式
        if ((0, parse_1.parseCronExpression)(body.cronExpression) === 0) {
            return api_1.Resp.errMsg(`调度任务新增【${body.jobName}】失败，Cron表达式不正确`);
        }
        // 检查任务调用传入参数是否json格式
        if (body.targetParams !== '') {
            const msg = `调度任务新增【${body.jobName}】失败，任务传入参数json字符串不正确`;
            if (body.targetParams.length < 7) {
                return api_1.Resp.errMsg(msg);
            }
            const params = (0, parse_1.parseStringToObject)(body.targetParams);
            if (!params) {
                return api_1.Resp.errMsg(msg);
            }
        }
        // 检查属性唯一
        const uniqueJob = await this.sysJobService.checkUniqueJobName(body.jobName, body.jobGroup, 0);
        if (!uniqueJob) {
            return api_1.Resp.errMsg(`调度任务新增【${body.jobName}】失败，同任务组内有相同任务名称`);
        }
        body.createBy = (0, auth_1.loginUserToUserName)(this.c);
        const insertId = await this.sysJobService.insert(body);
        if (insertId > 0) {
            return api_1.Resp.okData(insertId);
        }
        return api_1.Resp.err();
    }
    /**调度任务修改 */
    async edit(body) {
        if (body.jobId <= 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: jobId is empty');
        }
        // 检查cron表达式格式
        if ((0, parse_1.parseCronExpression)(body.cronExpression) === 0) {
            return api_1.Resp.errMsg(`调度任务修改【${body.jobName}】失败，Cron表达式不正确`);
        }
        // 检查任务调用传入参数是否json格式
        if (body.targetParams) {
            const msg = `调度任务修改【${body.jobName}】失败，任务传入参数json字符串不正确`;
            if (body.targetParams.length < 7) {
                return api_1.Resp.errMsg(msg);
            }
            const params = (0, parse_1.parseStringToObject)(body.targetParams);
            if (!params) {
                return api_1.Resp.errMsg(msg);
            }
        }
        // 检查属性唯一
        const uniqueJob = await this.sysJobService.checkUniqueJobName(body.jobName, body.jobGroup, body.jobId);
        if (!uniqueJob) {
            return api_1.Resp.errMsg(`调度任务修改【${body.jobName}】失败，同任务组内有相同任务名称`);
        }
        // 检查是否存在
        const jobInfo = await this.sysJobService.findById(body.jobId);
        if (jobInfo.jobId !== body.jobId) {
            return api_1.Resp.errMsg('没有权限访问调度任务数据！');
        }
        jobInfo.jobName = body.jobName;
        jobInfo.jobGroup = body.jobGroup;
        jobInfo.invokeTarget = body.invokeTarget;
        jobInfo.targetParams = body.targetParams;
        jobInfo.cronExpression = body.cronExpression;
        jobInfo.misfirePolicy = body.misfirePolicy;
        jobInfo.concurrent = body.concurrent;
        jobInfo.statusFlag = body.statusFlag;
        jobInfo.saveLog = body.saveLog;
        jobInfo.remark = body.remark;
        jobInfo.updateBy = (0, auth_1.loginUserToUserName)(this.c);
        const rows = await this.sysJobService.update(jobInfo);
        if (rows > 0) {
            return api_1.Resp.ok();
        }
        return api_1.Resp.err();
    }
    /**调度任务删除 */
    async remove(jobId) {
        if (jobId === '') {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: jobId is empty');
        }
        // 处理字符转id数组后去重
        const uniqueIDs = (0, parse_1.parseRemoveDuplicatesToArray)(jobId, ',');
        // 转换成number数组类型
        const ids = uniqueIDs.map(id => (0, parse_1.parseNumber)(id));
        const [rows, err] = await this.sysJobService.deleteByIds(ids);
        if (err) {
            return api_1.Resp.errMsg(err);
        }
        return api_1.Resp.okMsg(`删除成功: ${rows}`);
    }
    /**调度任务修改状态 */
    async status(jobId, statusFlag) {
        // 检查是否存在
        const jobInfo = await this.sysJobService.findById(jobId);
        if (jobInfo.jobId !== jobId) {
            return api_1.Resp.errMsg('没有权限访问调度任务数据！');
        }
        // 与旧值相等不变更
        if (jobInfo.statusFlag === statusFlag) {
            return api_1.Resp.errMsg('变更状态与旧值相等！');
        }
        jobInfo.statusFlag = statusFlag;
        jobInfo.updateBy = (0, auth_1.loginUserToUserName)(this.c);
        const rows = await this.sysJobService.update(jobInfo);
        if (rows > 0) {
            return api_1.Resp.ok();
        }
        return api_1.Resp.err();
    }
    /**调度任务立即执行一次 */
    async run(jobId) {
        if (jobId <= 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: jobId is empty');
        }
        // 检查是否存在
        const jobInfo = await this.sysJobService.findById(jobId);
        if (jobInfo.jobId !== jobId) {
            return api_1.Resp.errMsg('没有权限访问调度任务数据！');
        }
        // 执行一次调度任务
        const ok = await this.sysJobService.run(jobInfo);
        if (ok) {
            return api_1.Resp.ok();
        }
        return api_1.Resp.err();
    }
    /**调度任务重置刷新队列 */
    async reset() {
        await this.sysJobService.reset();
        return api_1.Resp.ok();
    }
    /**
     * 导出调度任务信息
     */
    async export(query) {
        // 查询结果，根据查询条件结果，单页最大值限制
        const [rows, total] = await this.sysJobService.findByPage(query);
        if (total === 0) {
            return api_1.Resp.errMsg('export data record as empty');
        }
        // 导出文件名称
        const fileName = `job_export_${rows.length}_${Date.now()}.xlsx`;
        this.c.set('content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        this.c.set('content-disposition', `attachment;filename=${encodeURIComponent(fileName)}`);
        return await this.sysJobService.exportData(rows, fileName);
    }
};
__decorate([
    (0, core_1.Inject)('ctx'),
    __metadata("design:type", Object)
], SysJobController.prototype, "c", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_job_1.SysJobService)
], SysJobController.prototype, "sysJobService", void 0);
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
], SysJobController.prototype, "list", null);
__decorate([
    (0, core_1.Get)('/:jobId', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['monitor:job:query'] }),
        ],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.number())),
    __param(0, (0, core_1.Param)('jobId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SysJobController.prototype, "info", null);
__decorate([
    (0, core_1.Post)('', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['monitor:job:add'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '调度任务信息',
                businessType: operate_log_1.BUSINESS_TYPE.INSERT,
            }),
        ],
    }),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sys_job_2.SysJob]),
    __metadata("design:returntype", Promise)
], SysJobController.prototype, "add", null);
__decorate([
    (0, core_1.Put)('', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['monitor:job:edit'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '调度任务信息',
                businessType: operate_log_1.BUSINESS_TYPE.UPDATE,
            }),
        ],
    }),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sys_job_2.SysJob]),
    __metadata("design:returntype", Promise)
], SysJobController.prototype, "edit", null);
__decorate([
    (0, core_1.Del)('/:jobId', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['monitor:job:remove'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '调度任务信息',
                businessType: operate_log_1.BUSINESS_TYPE.DELETE,
            }),
        ],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.string().allow(''))),
    __param(0, (0, core_1.Param)('jobId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SysJobController.prototype, "remove", null);
__decorate([
    (0, core_1.Put)('/status', {
        middleware: [
            (0, repeat_submit_1.RepeatSubmitMiddleware)(5),
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['monitor:job:status'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '调度任务信息',
                businessType: operate_log_1.BUSINESS_TYPE.UPDATE,
            }),
        ],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.number().required())),
    __param(0, (0, core_1.Body)('jobId')),
    __param(1, (0, validate_1.Valid)(validate_1.RuleType.string()
        .required()
        .pattern(/^[01]$/))),
    __param(1, (0, core_1.Body)('statusFlag')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], SysJobController.prototype, "status", null);
__decorate([
    (0, core_1.Put)('/run/:jobId', {
        middleware: [
            (0, repeat_submit_1.RepeatSubmitMiddleware)(10),
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['monitor:job:status'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '调度任务信息',
                businessType: operate_log_1.BUSINESS_TYPE.UPDATE,
            }),
        ],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.number())),
    __param(0, (0, core_1.Param)('jobId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SysJobController.prototype, "run", null);
__decorate([
    (0, core_1.Put)('/reset', {
        middleware: [
            (0, repeat_submit_1.RepeatSubmitMiddleware)(5),
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['monitor:job:status'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '调度任务信息',
                businessType: operate_log_1.BUSINESS_TYPE.CLEAN,
            }),
        ],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SysJobController.prototype, "reset", null);
__decorate([
    (0, core_1.Get)('/export', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['monitor:job:export'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '调度任务信息',
                businessType: operate_log_1.BUSINESS_TYPE.EXPORT,
            }),
        ],
    }),
    __param(0, (0, core_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SysJobController.prototype, "export", null);
exports.SysJobController = SysJobController = __decorate([
    (0, core_1.Controller)('/monitor/job')
], SysJobController);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX2pvYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL21vbml0b3IvY29udHJvbGxlci9zeXNfam9iLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlDQVV3QjtBQUN4QixpREFBcUQ7QUFHckQsZ0VBSzhDO0FBQzlDLDJFQUdtRDtBQUNuRCwrRUFBcUY7QUFDckYsaUZBQXVGO0FBQ3ZGLHlEQUFxRTtBQUNyRSxxREFBbUQ7QUFDbkQsZ0RBQW1EO0FBQ25ELDhDQUEwQztBQUUxQyxpQkFBaUI7QUFFVixJQUFNLGdCQUFnQiw4QkFBdEIsTUFBTSxnQkFBZ0I7SUFDM0IsU0FBUztJQUVELENBQUMsQ0FBVTtJQUVuQixZQUFZO0lBRUosYUFBYSxDQUFnQjtJQUVyQyxZQUFZO0lBTUMsQUFBTixLQUFLLENBQUMsSUFBSSxDQUFVLEtBQTZCO1FBQ3RELE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqRSxPQUFPLFVBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsWUFBWTtJQU1DLEFBQU4sS0FBSyxDQUFDLElBQUksQ0FDMkIsS0FBYTtRQUV2RCxJQUFJLEtBQUssSUFBSSxDQUFDLEVBQUU7WUFDZCxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7WUFDcEIsT0FBTyxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO1NBQzdEO1FBQ0QsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6RCxJQUFJLE9BQU8sQ0FBQyxLQUFLLEtBQUssS0FBSyxFQUFFO1lBQzNCLE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM3QjtRQUNELE9BQU8sVUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxZQUFZO0lBVUMsQUFBTixLQUFLLENBQUMsR0FBRyxDQUFTLElBQVk7UUFDbkMsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRTtZQUNsQixJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7WUFDcEIsT0FBTyxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO1NBQzdEO1FBRUQsY0FBYztRQUNkLElBQUksSUFBQSwyQkFBbUIsRUFBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2xELE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FDaEIsVUFBVSxJQUFJLENBQUMsT0FBTyxnQkFBZ0IsQ0FDdkMsQ0FBQztTQUNIO1FBRUQscUJBQXFCO1FBQ3JCLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxFQUFFLEVBQUU7WUFDNUIsTUFBTSxHQUFHLEdBQUcsVUFBVSxJQUFJLENBQUMsT0FBTyxzQkFBc0IsQ0FBQztZQUN6RCxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDaEMsT0FBTyxVQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3pCO1lBQ0QsTUFBTSxNQUFNLEdBQUcsSUFBQSwyQkFBbUIsRUFBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDdEQsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDWCxPQUFPLFVBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDekI7U0FDRjtRQUVELFNBQVM7UUFDVCxNQUFNLFNBQVMsR0FBRyxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQzNELElBQUksQ0FBQyxPQUFPLEVBQ1osSUFBSSxDQUFDLFFBQVEsRUFDYixDQUFDLENBQ0YsQ0FBQztRQUNGLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDZCxPQUFPLFVBQUksQ0FBQyxNQUFNLENBQ2hCLFVBQVUsSUFBSSxDQUFDLE9BQU8sa0JBQWtCLENBQ3pDLENBQUM7U0FDSDtRQUVELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBQSwwQkFBbUIsRUFBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUMsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2RCxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUU7WUFDaEIsT0FBTyxVQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQzlCO1FBQ0QsT0FBTyxVQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVELFlBQVk7SUFVQyxBQUFOLEtBQUssQ0FBQyxJQUFJLENBQVMsSUFBWTtRQUNwQyxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxFQUFFO1lBQ25CLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztZQUNwQixPQUFPLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLDBCQUEwQixDQUFDLENBQUM7U0FDekQ7UUFFRCxjQUFjO1FBQ2QsSUFBSSxJQUFBLDJCQUFtQixFQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDbEQsT0FBTyxVQUFJLENBQUMsTUFBTSxDQUNoQixVQUFVLElBQUksQ0FBQyxPQUFPLGdCQUFnQixDQUN2QyxDQUFDO1NBQ0g7UUFFRCxxQkFBcUI7UUFDckIsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3JCLE1BQU0sR0FBRyxHQUFHLFVBQVUsSUFBSSxDQUFDLE9BQU8sc0JBQXNCLENBQUM7WUFDekQsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ2hDLE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUN6QjtZQUNELE1BQU0sTUFBTSxHQUFHLElBQUEsMkJBQW1CLEVBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3RELElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ1gsT0FBTyxVQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3pCO1NBQ0Y7UUFFRCxTQUFTO1FBQ1QsTUFBTSxTQUFTLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUMzRCxJQUFJLENBQUMsT0FBTyxFQUNaLElBQUksQ0FBQyxRQUFRLEVBQ2IsSUFBSSxDQUFDLEtBQUssQ0FDWCxDQUFDO1FBQ0YsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNkLE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FDaEIsVUFBVSxJQUFJLENBQUMsT0FBTyxrQkFBa0IsQ0FDekMsQ0FBQztTQUNIO1FBRUQsU0FBUztRQUNULE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlELElBQUksT0FBTyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2hDLE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUNyQztRQUVELE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUMvQixPQUFPLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDakMsT0FBTyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQ3pDLE9BQU8sQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUN6QyxPQUFPLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7UUFDN0MsT0FBTyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO1FBQzNDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUNyQyxPQUFPLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDckMsT0FBTyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQy9CLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUM3QixPQUFPLENBQUMsUUFBUSxHQUFHLElBQUEsMEJBQW1CLEVBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEQsSUFBSSxJQUFJLEdBQUcsQ0FBQyxFQUFFO1lBQ1osT0FBTyxVQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7U0FDbEI7UUFDRCxPQUFPLFVBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRUQsWUFBWTtJQVVDLEFBQU4sS0FBSyxDQUFDLE1BQU0sQ0FDbUMsS0FBYTtRQUVqRSxJQUFJLEtBQUssS0FBSyxFQUFFLEVBQUU7WUFDaEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1lBQ3BCLE9BQU8sVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztTQUN6RDtRQUVELGVBQWU7UUFDZixNQUFNLFNBQVMsR0FBRyxJQUFBLG9DQUE0QixFQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztRQUMzRCxnQkFBZ0I7UUFDaEIsTUFBTSxHQUFHLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUEsbUJBQVcsRUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRWpELE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5RCxJQUFJLEdBQUcsRUFBRTtZQUNQLE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN6QjtRQUNELE9BQU8sVUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELGNBQWM7SUFXRCxBQUFOLEtBQUssQ0FBQyxNQUFNLENBQ21DLEtBQWEsRUFPakUsVUFBa0I7UUFFbEIsU0FBUztRQUNULE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekQsSUFBSSxPQUFPLENBQUMsS0FBSyxLQUFLLEtBQUssRUFBRTtZQUMzQixPQUFPLFVBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7U0FDckM7UUFDRCxXQUFXO1FBQ1gsSUFBSSxPQUFPLENBQUMsVUFBVSxLQUFLLFVBQVUsRUFBRTtZQUNyQyxPQUFPLFVBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDbEM7UUFDRCxPQUFPLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUNoQyxPQUFPLENBQUMsUUFBUSxHQUFHLElBQUEsMEJBQW1CLEVBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEQsSUFBSSxJQUFJLEdBQUcsQ0FBQyxFQUFFO1lBQ1osT0FBTyxVQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7U0FDbEI7UUFDRCxPQUFPLFVBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRUQsZ0JBQWdCO0lBV0gsQUFBTixLQUFLLENBQUMsR0FBRyxDQUM0QixLQUFhO1FBRXZELElBQUksS0FBSyxJQUFJLENBQUMsRUFBRTtZQUNkLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztZQUNwQixPQUFPLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLDBCQUEwQixDQUFDLENBQUM7U0FDekQ7UUFFRCxTQUFTO1FBQ1QsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6RCxJQUFJLE9BQU8sQ0FBQyxLQUFLLEtBQUssS0FBSyxFQUFFO1lBQzNCLE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUNyQztRQUNELFdBQVc7UUFDWCxNQUFNLEVBQUUsR0FBRyxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pELElBQUksRUFBRSxFQUFFO1lBQ04sT0FBTyxVQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7U0FDbEI7UUFDRCxPQUFPLFVBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRUQsZ0JBQWdCO0lBV0gsQUFBTixLQUFLLENBQUMsS0FBSztRQUNoQixNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDakMsT0FBTyxVQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVEOztPQUVHO0lBVVUsQUFBTixLQUFLLENBQUMsTUFBTSxDQUFVLEtBQTZCO1FBQ3hELHdCQUF3QjtRQUN4QixNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakUsSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFO1lBQ2YsT0FBTyxVQUFJLENBQUMsTUFBTSxDQUFDLDZCQUE2QixDQUFDLENBQUM7U0FDbkQ7UUFFRCxTQUFTO1FBQ1QsTUFBTSxRQUFRLEdBQUcsY0FBYyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUNSLGNBQWMsRUFDZCxtRUFBbUUsQ0FDcEUsQ0FBQztRQUNGLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUNSLHFCQUFxQixFQUNyQix1QkFBdUIsa0JBQWtCLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FDdEQsQ0FBQztRQUNGLE9BQU8sTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDN0QsQ0FBQztDQUNGLENBQUE7QUF2VFM7SUFEUCxJQUFBLGFBQU0sRUFBQyxLQUFLLENBQUM7OzJDQUNLO0FBSVg7SUFEUCxJQUFBLGFBQU0sR0FBRTs4QkFDYyx1QkFBYTt1REFBQztBQVF4QjtJQUxaLElBQUEsVUFBRyxFQUFDLE9BQU8sRUFBRTtRQUNaLFVBQVUsRUFBRTtZQUNWLElBQUEsd0NBQXVCLEVBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQUM7U0FDNUQ7S0FDRixDQUFDO0lBQ2lCLFdBQUEsSUFBQSxZQUFLLEdBQUUsQ0FBQTs7Ozs0Q0FHekI7QUFRWTtJQUxaLElBQUEsVUFBRyxFQUFDLFNBQVMsRUFBRTtRQUNkLFVBQVUsRUFBRTtZQUNWLElBQUEsd0NBQXVCLEVBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLENBQUM7U0FDN0Q7S0FDRixDQUFDO0lBRUMsV0FBQSxJQUFBLGdCQUFLLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFBO0lBQUUsV0FBQSxJQUFBLFlBQUssRUFBQyxPQUFPLENBQUMsQ0FBQTs7Ozs0Q0FXMUM7QUFZWTtJQVRaLElBQUEsV0FBSSxFQUFDLEVBQUUsRUFBRTtRQUNSLFVBQVUsRUFBRTtZQUNWLElBQUEsd0NBQXVCLEVBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUM7WUFDMUQsSUFBQSxrQ0FBb0IsRUFBQztnQkFDbkIsS0FBSyxFQUFFLFFBQVE7Z0JBQ2YsWUFBWSxFQUFFLDJCQUFhLENBQUMsTUFBTTthQUNuQyxDQUFDO1NBQ0g7S0FDRixDQUFDO0lBQ2dCLFdBQUEsSUFBQSxXQUFJLEdBQUUsQ0FBQTs7cUNBQU8sZ0JBQU07OzJDQTJDcEM7QUFZWTtJQVRaLElBQUEsVUFBRyxFQUFDLEVBQUUsRUFBRTtRQUNQLFVBQVUsRUFBRTtZQUNWLElBQUEsd0NBQXVCLEVBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQUM7WUFDM0QsSUFBQSxrQ0FBb0IsRUFBQztnQkFDbkIsS0FBSyxFQUFFLFFBQVE7Z0JBQ2YsWUFBWSxFQUFFLDJCQUFhLENBQUMsTUFBTTthQUNuQyxDQUFDO1NBQ0g7S0FDRixDQUFDO0lBQ2lCLFdBQUEsSUFBQSxXQUFJLEdBQUUsQ0FBQTs7cUNBQU8sZ0JBQU07OzRDQTJEckM7QUFZWTtJQVRaLElBQUEsVUFBRyxFQUFDLFNBQVMsRUFBRTtRQUNkLFVBQVUsRUFBRTtZQUNWLElBQUEsd0NBQXVCLEVBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLENBQUM7WUFDN0QsSUFBQSxrQ0FBb0IsRUFBQztnQkFDbkIsS0FBSyxFQUFFLFFBQVE7Z0JBQ2YsWUFBWSxFQUFFLDJCQUFhLENBQUMsTUFBTTthQUNuQyxDQUFDO1NBQ0g7S0FDRixDQUFDO0lBRUMsV0FBQSxJQUFBLGdCQUFLLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUFFLFdBQUEsSUFBQSxZQUFLLEVBQUMsT0FBTyxDQUFDLENBQUE7Ozs7OENBaUJwRDtBQWFZO0lBVlosSUFBQSxVQUFHLEVBQUMsU0FBUyxFQUFFO1FBQ2QsVUFBVSxFQUFFO1lBQ1YsSUFBQSxzQ0FBc0IsRUFBQyxDQUFDLENBQUM7WUFDekIsSUFBQSx3Q0FBdUIsRUFBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQztZQUM3RCxJQUFBLGtDQUFvQixFQUFDO2dCQUNuQixLQUFLLEVBQUUsUUFBUTtnQkFDZixZQUFZLEVBQUUsMkJBQWEsQ0FBQyxNQUFNO2FBQ25DLENBQUM7U0FDSDtLQUNGLENBQUM7SUFFQyxXQUFBLElBQUEsZ0JBQUssRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7SUFBRSxXQUFBLElBQUEsV0FBSSxFQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ2xELFdBQUEsSUFBQSxnQkFBSyxFQUNKLG1CQUFRLENBQUMsTUFBTSxFQUFFO1NBQ2QsUUFBUSxFQUFFO1NBQ1YsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUNyQixDQUFBO0lBQ0EsV0FBQSxJQUFBLFdBQUksRUFBQyxZQUFZLENBQUMsQ0FBQTs7Ozs4Q0FtQnBCO0FBYVk7SUFWWixJQUFBLFVBQUcsRUFBQyxhQUFhLEVBQUU7UUFDbEIsVUFBVSxFQUFFO1lBQ1YsSUFBQSxzQ0FBc0IsRUFBQyxFQUFFLENBQUM7WUFDMUIsSUFBQSx3Q0FBdUIsRUFBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQztZQUM3RCxJQUFBLGtDQUFvQixFQUFDO2dCQUNuQixLQUFLLEVBQUUsUUFBUTtnQkFDZixZQUFZLEVBQUUsMkJBQWEsQ0FBQyxNQUFNO2FBQ25DLENBQUM7U0FDSDtLQUNGLENBQUM7SUFFQyxXQUFBLElBQUEsZ0JBQUssRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUE7SUFBRSxXQUFBLElBQUEsWUFBSyxFQUFDLE9BQU8sQ0FBQyxDQUFBOzs7OzJDQWtCMUM7QUFhWTtJQVZaLElBQUEsVUFBRyxFQUFDLFFBQVEsRUFBRTtRQUNiLFVBQVUsRUFBRTtZQUNWLElBQUEsc0NBQXNCLEVBQUMsQ0FBQyxDQUFDO1lBQ3pCLElBQUEsd0NBQXVCLEVBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLENBQUM7WUFDN0QsSUFBQSxrQ0FBb0IsRUFBQztnQkFDbkIsS0FBSyxFQUFFLFFBQVE7Z0JBQ2YsWUFBWSxFQUFFLDJCQUFhLENBQUMsS0FBSzthQUNsQyxDQUFDO1NBQ0g7S0FDRixDQUFDOzs7OzZDQUlEO0FBY1k7SUFUWixJQUFBLFVBQUcsRUFBQyxTQUFTLEVBQUU7UUFDZCxVQUFVLEVBQUU7WUFDVixJQUFBLHdDQUF1QixFQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsb0JBQW9CLENBQUMsRUFBRSxDQUFDO1lBQzdELElBQUEsa0NBQW9CLEVBQUM7Z0JBQ25CLEtBQUssRUFBRSxRQUFRO2dCQUNmLFlBQVksRUFBRSwyQkFBYSxDQUFDLE1BQU07YUFDbkMsQ0FBQztTQUNIO0tBQ0YsQ0FBQztJQUNtQixXQUFBLElBQUEsWUFBSyxHQUFFLENBQUE7Ozs7OENBa0IzQjsyQkF6VFUsZ0JBQWdCO0lBRDVCLElBQUEsaUJBQVUsRUFBQyxjQUFjLENBQUM7R0FDZCxnQkFBZ0IsQ0EwVDVCIn0=