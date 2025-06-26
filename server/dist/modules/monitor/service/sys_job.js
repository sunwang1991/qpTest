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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SysJobService = void 0;
const bull_1 = require("@midwayjs/bull");
const core_1 = require("@midwayjs/core");
const sys_job_1 = require("../model/sys_job");
const sys_job_log_1 = require("../model/sys_job_log");
const sys_job_2 = require("../repository/sys_job");
const sys_job_log_2 = require("../repository/sys_job_log");
const common_1 = require("../../../framework/constants/common");
const file_1 = require("../../../framework/utils/file/file");
const sys_dict_data_1 = require("../../system/service/sys_dict_data");
/**调度任务 服务层处理 */
let SysJobService = exports.SysJobService = class SysJobService {
    /**调度任务数据信息 */
    sysJobRepository;
    /**调度任务日志数据信息 */
    sysJobLogRepository;
    /**字典类型服务 */
    sysDictTypeService;
    /**任务队列 */
    bullFramework;
    /**文件服务 */
    fileUtil;
    /**初始化 */
    async init() {
        // 启动时，初始化调度任务
        await this.reset();
    }
    /**
     * 分页查询
     * @param query 分页查询
     * @returns 结果
     */
    async findByPage(query) {
        return await this.sysJobRepository.selectByPage(query);
    }
    /**
     * 查询
     * @param query 分页查询
     * @returns 结果
     */
    async find(sysJob) {
        return await this.sysJobRepository.select(sysJob);
    }
    /**
     * 通过ID查询
     * @param jobId
     * @returns
     */
    async findById(jobId) {
        if (jobId <= 0) {
            return new sys_job_1.SysJob();
        }
        const jobs = await this.sysJobRepository.selectByIds([jobId]);
        if (jobs.length > 0) {
            return jobs[0];
        }
        return new sys_job_1.SysJob();
    }
    /**
     * 新增
     * @param sysJob 信息
     * @returns ID
     */
    async insert(sysJob) {
        const insertId = await this.sysJobRepository.insert(sysJob);
        if (insertId && sysJob.statusFlag === common_1.STATUS_YES) {
            sysJob.jobId = insertId;
            await this.insertQueueJob(sysJob, true);
        }
        return insertId;
    }
    /**
     * 修改
     * @param sysJob 信息
     * @returns 影响记录数
     */
    async update(sysJob) {
        const rows = await this.sysJobRepository.update(sysJob);
        if (rows > 0) {
            // 状态正常添加队列任务
            if (sysJob.statusFlag === common_1.STATUS_YES) {
                await this.insertQueueJob(sysJob, true);
            }
            // 状态禁用删除队列任务
            if (sysJob.statusFlag === common_1.STATUS_NO) {
                await this.deleteQueueJob(sysJob);
            }
        }
        return rows;
    }
    /**
     * 批量删除
     * @param jobIds ID数组
     * @returns [影响记录数, 错误信息]
     */
    async deleteByIds(jobIds) {
        // 检查是否存在
        const jobs = await this.sysJobRepository.selectByIds(jobIds);
        if (jobs.length <= 0) {
            return [0, '没有权限访问调度任务数据！'];
        }
        if (jobs.length === jobIds.length) {
            // 清除任务
            for (const job of jobs) {
                await this.deleteQueueJob(job);
            }
            const rows = await this.sysJobRepository.deleteByIds(jobIds);
            return [rows, ''];
        }
        return [0, '删除调度任务信息失败！'];
    }
    /**
     * 校验调度任务名称和组是否唯一
     * @param jobName 调度任务名称
     * @param jobGroup 调度任务组
     * @param jobId 调度任务ID
     * @returns true 唯一，false 不唯一
     */
    async checkUniqueJobName(jobName, jobGroup, jobId) {
        const sysJob = new sys_job_1.SysJob();
        sysJob.jobName = jobName;
        sysJob.jobGroup = jobGroup;
        const uniqueId = await this.sysJobRepository.checkUnique(sysJob);
        if (uniqueId === jobId) {
            return true;
        }
        return uniqueId === 0;
    }
    /**
     * 添加调度任务
     *
     * @param sysJob 调度任务信息
     * @param repeat 触发执行cron重复多次
     * @return 结果
     */
    async insertQueueJob(sysJob, repeat) {
        // 获取队列 Processor
        const queue = this.bullFramework.getQueue(sysJob.invokeTarget);
        if (!queue)
            return false;
        const jobId = sysJob.jobId;
        // 判断是否给队列添加完成和失败的监听事件
        const completedOnCount = queue.listenerCount('completed');
        if (completedOnCount === 0) {
            // 添加完成监听
            queue.addListener('completed', async (job, Result) => {
                // 读取任务信息进行保存日志
                const jobLog = {
                    timestamp: job.timestamp,
                    data: job.data,
                    Result: Result,
                };
                this.saveJobLog(jobLog, common_1.STATUS_YES);
                await job.remove();
            });
            // 添加失败监听
            queue.addListener('failed', async (job, error) => {
                // 读取任务信息进行保存日志
                const jobLog = {
                    timestamp: job.timestamp,
                    data: job.data,
                    Result: error,
                };
                this.saveJobLog(jobLog, common_1.STATUS_NO);
                await job.remove();
            });
        }
        // 给执行任务数据参数
        const options = {
            repeat: repeat,
            sysJob: sysJob,
        };
        // 不是重复任务的情况，立即执行一次
        if (!repeat) {
            // 判断是否已经有单次执行任务
            let job = await queue.getJob(jobId);
            if (job) {
                // 拒绝执行已经进行中的，其他状态的移除
                const isActive = await job.isActive();
                if (isActive) {
                    return false;
                }
                await job.remove();
            }
            // 执行单次任务
            job = await queue.addJobToQueue(options, { jobId: jobId });
            // 执行中或等待中的都返回正常
            const isActive = await job.isActive();
            const isWaiting = await job.isWaiting();
            return isActive || isWaiting;
        }
        // 移除重复任务，在执行中的无法移除
        const repeatableJobs = await queue.getRepeatableJobs();
        for (const repeatable of repeatableJobs) {
            if (`${jobId}` === `${repeatable.id}`) {
                await queue.removeRepeatableByKey(repeatable.key);
            }
        }
        // 清除任务记录
        await queue.clean(5000, 'active');
        await queue.clean(5000, 'wait');
        // 添加重复任务
        await queue.addJobToQueue(options, {
            jobId: jobId,
            repeat: {
                cron: sysJob.cronExpression,
            },
        });
        return true;
    }
    /**
     * 删除调度任务
     * @param sysJob 信息
     * @returns 结果
     */
    async deleteQueueJob(sysJob) {
        // 获取队列 Processor
        const queue = this.bullFramework.getQueue(sysJob.invokeTarget);
        if (!queue)
            return;
        const jobId = sysJob.jobId;
        // 移除重复任务，在执行中的无法移除
        const repeatableJobs = await queue.getRepeatableJobs();
        for (const repeatable of repeatableJobs) {
            if (`${jobId}` === `${repeatable.id}`) {
                await queue.removeRepeatableByKey(repeatable.key);
            }
        }
        // 清除任务记录
        await queue.clean(5000, 'active');
        await queue.clean(5000, 'wait');
    }
    /**
     * 日志记录保存
     * @param jld 日志记录数据
     * @param status 日志状态
     * @returns
     */
    async saveJobLog(jld, status) {
        // 读取任务信息
        const sysJob = jld.data.sysJob;
        // 任务日志不需要记录
        if (sysJob.saveLog === '' || sysJob.saveLog === common_1.STATUS_NO) {
            return;
        }
        // 结果信息key的Name
        let ResultNmae = 'failed';
        if (status === common_1.STATUS_YES) {
            ResultNmae = 'completed';
        }
        // 结果信息序列化字符串
        let jobMsg = JSON.stringify({
            cron: jld.data.repeat,
            name: ResultNmae,
            message: jld.Result,
        });
        if (jobMsg.length >= 500) {
            jobMsg = jobMsg.substring(0, 500);
        }
        // 创建日志对象
        const now = Date.now().valueOf();
        const sysJobLog = new sys_job_log_1.SysJobLog();
        sysJobLog.jobName = sysJob.jobName;
        sysJobLog.jobGroup = sysJob.jobGroup;
        sysJobLog.invokeTarget = sysJob.invokeTarget;
        sysJobLog.targetParams = sysJob.targetParams;
        sysJobLog.statusFlag = status;
        sysJobLog.jobMsg = jobMsg;
        sysJobLog.costTime = now - jld.timestamp;
        sysJobLog.createTime = now;
        // 插入数据
        await this.sysJobLogRepository.insert(sysJobLog);
    }
    /**
     * 重置初始调度任务
     */
    async reset() {
        // 获取bull上注册的队列列表
        const queueList = this.bullFramework.getQueueList();
        if (queueList && queueList.length === 0) {
            return;
        }
        // 查询系统中定义状态为正常启用的任务
        const sysJob = new sys_job_1.SysJob();
        sysJob.statusFlag = common_1.STATUS_YES;
        const sysJobs = await this.sysJobRepository.select(sysJob);
        for (const sysJob of sysJobs) {
            for (const queue of queueList) {
                if (queue.getQueueName() === sysJob.invokeTarget) {
                    await this.insertQueueJob(sysJob, true);
                }
            }
        }
    }
    /**
     * 立即运行一次调度任务
     * @param sysJob 信息
     * @returns 结果
     */
    async run(sysJob) {
        return await this.insertQueueJob(sysJob, false);
    }
    /**
     * 导出数据表格
     * @param rows 信息
     * @param fileName 文件名
     * @returns 结果
     */
    async exportData(rows, fileName) {
        // 读取任务组名字典数据
        const dictSysJobGroup = await this.sysDictTypeService.findByType('sys_job_group');
        // 导出数据组装
        const arr = [];
        for (const item of rows) {
            // 任务组名
            let sysJobGroup = '';
            for (const v of dictSysJobGroup) {
                if (item.jobGroup === v.dataValue) {
                    sysJobGroup = v.dataLabel;
                    break;
                }
            }
            let misfirePolicy = '放弃执行';
            if (item.misfirePolicy === '1') {
                misfirePolicy = '立即执行';
            }
            else if (item.misfirePolicy === '2') {
                misfirePolicy = '执行一次';
            }
            let concurrent = '禁止';
            if (item.concurrent === '1') {
                concurrent = '允许';
            }
            // 状态
            let statusValue = '失败';
            if (item.statusFlag === '1') {
                statusValue = '成功';
            }
            const data = {
                任务编号: item.jobId,
                任务名称: item.jobName,
                任务组名: sysJobGroup,
                调用目标: item.invokeTarget,
                传入参数: item.targetParams,
                执行表达式: item.cronExpression,
                出错策略: misfirePolicy,
                并发执行: concurrent,
                任务状态: statusValue,
                备注说明: item.remark,
            };
            arr.push(data);
        }
        return await this.fileUtil.excelWriteRecord(arr, fileName);
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_job_2.SysJobRepository)
], SysJobService.prototype, "sysJobRepository", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_job_log_2.SysJobLogRepository)
], SysJobService.prototype, "sysJobLogRepository", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_dict_data_1.SysDictDataService)
], SysJobService.prototype, "sysDictTypeService", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", bull_1.Framework)
], SysJobService.prototype, "bullFramework", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", file_1.FileUtil)
], SysJobService.prototype, "fileUtil", void 0);
__decorate([
    (0, core_1.Init)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SysJobService.prototype, "init", null);
exports.SysJobService = SysJobService = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], SysJobService);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX2pvYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL21vbml0b3Ivc2VydmljZS9zeXNfam9iLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHlDQUFnRDtBQUNoRCx5Q0FBa0U7QUFFbEUsOENBQTBDO0FBQzFDLHNEQUFpRDtBQUNqRCxtREFBeUQ7QUFDekQsMkRBQWdFO0FBQ2hFLGdFQUE0RTtBQUM1RSw2REFBOEQ7QUFDOUQsc0VBQXdFO0FBRXhFLGdCQUFnQjtBQUdULElBQU0sYUFBYSwyQkFBbkIsTUFBTSxhQUFhO0lBQ3hCLGNBQWM7SUFFTixnQkFBZ0IsQ0FBbUI7SUFFM0MsZ0JBQWdCO0lBRVIsbUJBQW1CLENBQXNCO0lBRWpELFlBQVk7SUFFSixrQkFBa0IsQ0FBcUI7SUFFL0MsVUFBVTtJQUVGLGFBQWEsQ0FBWTtJQUVqQyxVQUFVO0lBRUYsUUFBUSxDQUFXO0lBRTNCLFNBQVM7SUFFSSxBQUFOLEtBQUssQ0FBQyxJQUFJO1FBQ2YsY0FBYztRQUNkLE1BQU0sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksS0FBSyxDQUFDLFVBQVUsQ0FDckIsS0FBNkI7UUFFN0IsT0FBTyxNQUFNLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQWM7UUFDOUIsT0FBTyxNQUFNLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQWE7UUFDakMsSUFBSSxLQUFLLElBQUksQ0FBQyxFQUFFO1lBQ2QsT0FBTyxJQUFJLGdCQUFNLEVBQUUsQ0FBQztTQUNyQjtRQUNELE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDOUQsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNuQixPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNoQjtRQUNELE9BQU8sSUFBSSxnQkFBTSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQWM7UUFDaEMsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVELElBQUksUUFBUSxJQUFJLE1BQU0sQ0FBQyxVQUFVLEtBQUssbUJBQVUsRUFBRTtZQUNoRCxNQUFNLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQztZQUN4QixNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3pDO1FBQ0QsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQWM7UUFDaEMsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hELElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTtZQUNaLGFBQWE7WUFDYixJQUFJLE1BQU0sQ0FBQyxVQUFVLEtBQUssbUJBQVUsRUFBRTtnQkFDcEMsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQzthQUN6QztZQUNELGFBQWE7WUFDYixJQUFJLE1BQU0sQ0FBQyxVQUFVLEtBQUssa0JBQVMsRUFBRTtnQkFDbkMsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ25DO1NBQ0Y7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFnQjtRQUN2QyxTQUFTO1FBQ1QsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdELElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDcEIsT0FBTyxDQUFDLENBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQztTQUM3QjtRQUNELElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxNQUFNLENBQUMsTUFBTSxFQUFFO1lBQ2pDLE9BQU87WUFDUCxLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksRUFBRTtnQkFDdEIsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ2hDO1lBQ0QsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzdELE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDbkI7UUFDRCxPQUFPLENBQUMsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxLQUFLLENBQUMsa0JBQWtCLENBQzdCLE9BQWUsRUFDZixRQUFnQixFQUNoQixLQUFhO1FBRWIsTUFBTSxNQUFNLEdBQUcsSUFBSSxnQkFBTSxFQUFFLENBQUM7UUFDNUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDekIsTUFBTSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDM0IsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2pFLElBQUksUUFBUSxLQUFLLEtBQUssRUFBRTtZQUN0QixPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0QsT0FBTyxRQUFRLEtBQUssQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSyxLQUFLLENBQUMsY0FBYyxDQUMxQixNQUFjLEVBQ2QsTUFBZTtRQUVmLGlCQUFpQjtRQUNqQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDL0QsSUFBSSxDQUFDLEtBQUs7WUFBRSxPQUFPLEtBQUssQ0FBQztRQUV6QixNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBRTNCLHNCQUFzQjtRQUN0QixNQUFNLGdCQUFnQixHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDMUQsSUFBSSxnQkFBZ0IsS0FBSyxDQUFDLEVBQUU7WUFDMUIsU0FBUztZQUNULEtBQUssQ0FBQyxXQUFXLENBQ2YsV0FBVyxFQUNYLEtBQUssRUFBRSxHQUFRLEVBQUUsTUFBcUIsRUFBRSxFQUFFO2dCQUN4QyxlQUFlO2dCQUNmLE1BQU0sTUFBTSxHQUFHO29CQUNiLFNBQVMsRUFBRSxHQUFHLENBQUMsU0FBUztvQkFDeEIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJO29CQUNkLE1BQU0sRUFBRSxNQUFNO2lCQUNmLENBQUM7Z0JBQ0YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsbUJBQVUsQ0FBQyxDQUFDO2dCQUNwQyxNQUFNLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNyQixDQUFDLENBQ0YsQ0FBQztZQUNGLFNBQVM7WUFDVCxLQUFLLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsR0FBUSxFQUFFLEtBQVksRUFBRSxFQUFFO2dCQUMzRCxlQUFlO2dCQUNmLE1BQU0sTUFBTSxHQUFHO29CQUNiLFNBQVMsRUFBRSxHQUFHLENBQUMsU0FBUztvQkFDeEIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJO29CQUNkLE1BQU0sRUFBRSxLQUFLO2lCQUNkLENBQUM7Z0JBQ0YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsa0JBQVMsQ0FBQyxDQUFDO2dCQUNuQyxNQUFNLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNyQixDQUFDLENBQUMsQ0FBQztTQUNKO1FBRUQsWUFBWTtRQUNaLE1BQU0sT0FBTyxHQUFHO1lBQ2QsTUFBTSxFQUFFLE1BQU07WUFDZCxNQUFNLEVBQUUsTUFBTTtTQUNmLENBQUM7UUFFRixtQkFBbUI7UUFDbkIsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNYLGdCQUFnQjtZQUNoQixJQUFJLEdBQUcsR0FBRyxNQUFNLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEMsSUFBSSxHQUFHLEVBQUU7Z0JBQ1AscUJBQXFCO2dCQUNyQixNQUFNLFFBQVEsR0FBRyxNQUFNLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDdEMsSUFBSSxRQUFRLEVBQUU7b0JBQ1osT0FBTyxLQUFLLENBQUM7aUJBQ2Q7Z0JBQ0QsTUFBTSxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDcEI7WUFDRCxTQUFTO1lBQ1QsR0FBRyxHQUFHLE1BQU0sS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUMzRCxnQkFBZ0I7WUFDaEIsTUFBTSxRQUFRLEdBQUcsTUFBTSxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDdEMsTUFBTSxTQUFTLEdBQUcsTUFBTSxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDeEMsT0FBTyxRQUFRLElBQUksU0FBUyxDQUFDO1NBQzlCO1FBRUQsbUJBQW1CO1FBQ25CLE1BQU0sY0FBYyxHQUFHLE1BQU0sS0FBSyxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDdkQsS0FBSyxNQUFNLFVBQVUsSUFBSSxjQUFjLEVBQUU7WUFDdkMsSUFBSSxHQUFHLEtBQUssRUFBRSxLQUFLLEdBQUcsVUFBVSxDQUFDLEVBQUUsRUFBRSxFQUFFO2dCQUNyQyxNQUFNLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDbkQ7U0FDRjtRQUNELFNBQVM7UUFDVCxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFaEMsU0FBUztRQUNULE1BQU0sS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUU7WUFDakMsS0FBSyxFQUFFLEtBQUs7WUFDWixNQUFNLEVBQUU7Z0JBQ04sSUFBSSxFQUFFLE1BQU0sQ0FBQyxjQUFjO2FBQzVCO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNLLEtBQUssQ0FBQyxjQUFjLENBQUMsTUFBYztRQUN6QyxpQkFBaUI7UUFDakIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQy9ELElBQUksQ0FBQyxLQUFLO1lBQUUsT0FBTztRQUVuQixNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBRTNCLG1CQUFtQjtRQUNuQixNQUFNLGNBQWMsR0FBRyxNQUFNLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQ3ZELEtBQUssTUFBTSxVQUFVLElBQUksY0FBYyxFQUFFO1lBQ3ZDLElBQUksR0FBRyxLQUFLLEVBQUUsS0FBSyxHQUFHLFVBQVUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtnQkFDckMsTUFBTSxLQUFLLENBQUMscUJBQXFCLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ25EO1NBQ0Y7UUFDRCxTQUFTO1FBQ1QsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNsQyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNLLEtBQUssQ0FBQyxVQUFVLENBQ3RCLEdBSUMsRUFDRCxNQUFjO1FBRWQsU0FBUztRQUNULE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBRS9CLFlBQVk7UUFDWixJQUFJLE1BQU0sQ0FBQyxPQUFPLEtBQUssRUFBRSxJQUFJLE1BQU0sQ0FBQyxPQUFPLEtBQUssa0JBQVMsRUFBRTtZQUN6RCxPQUFPO1NBQ1I7UUFFRCxlQUFlO1FBQ2YsSUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDO1FBQzFCLElBQUksTUFBTSxLQUFLLG1CQUFVLEVBQUU7WUFDekIsVUFBVSxHQUFHLFdBQVcsQ0FBQztTQUMxQjtRQUVELGFBQWE7UUFDYixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQzFCLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU07WUFDckIsSUFBSSxFQUFFLFVBQVU7WUFDaEIsT0FBTyxFQUFFLEdBQUcsQ0FBQyxNQUFNO1NBQ3BCLENBQUMsQ0FBQztRQUNILElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUU7WUFDeEIsTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ25DO1FBRUQsU0FBUztRQUNULE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNqQyxNQUFNLFNBQVMsR0FBRyxJQUFJLHVCQUFTLEVBQUUsQ0FBQztRQUNsQyxTQUFTLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDbkMsU0FBUyxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ3JDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztRQUM3QyxTQUFTLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7UUFDN0MsU0FBUyxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUM7UUFDOUIsU0FBUyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDMUIsU0FBUyxDQUFDLFFBQVEsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQztRQUN6QyxTQUFTLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQztRQUMzQixPQUFPO1FBQ1AsTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRDs7T0FFRztJQUNJLEtBQUssQ0FBQyxLQUFLO1FBQ2hCLGlCQUFpQjtRQUNqQixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3BELElBQUksU0FBUyxJQUFJLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3ZDLE9BQU87U0FDUjtRQUNELG9CQUFvQjtRQUNwQixNQUFNLE1BQU0sR0FBRyxJQUFJLGdCQUFNLEVBQUUsQ0FBQztRQUM1QixNQUFNLENBQUMsVUFBVSxHQUFHLG1CQUFVLENBQUM7UUFDL0IsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzNELEtBQUssTUFBTSxNQUFNLElBQUksT0FBTyxFQUFFO1lBQzVCLEtBQUssTUFBTSxLQUFLLElBQUksU0FBUyxFQUFFO2dCQUM3QixJQUFJLEtBQUssQ0FBQyxZQUFZLEVBQUUsS0FBSyxNQUFNLENBQUMsWUFBWSxFQUFFO29CQUNoRCxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO2lCQUN6QzthQUNGO1NBQ0Y7SUFDSCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBYztRQUM3QixPQUFPLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFjLEVBQUUsUUFBZ0I7UUFDdEQsYUFBYTtRQUNiLE1BQU0sZUFBZSxHQUFHLE1BQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FDOUQsZUFBZSxDQUNoQixDQUFDO1FBQ0YsU0FBUztRQUNULE1BQU0sR0FBRyxHQUEwQixFQUFFLENBQUM7UUFDdEMsS0FBSyxNQUFNLElBQUksSUFBSSxJQUFJLEVBQUU7WUFDdkIsT0FBTztZQUNQLElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQztZQUNyQixLQUFLLE1BQU0sQ0FBQyxJQUFJLGVBQWUsRUFBRTtnQkFDL0IsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLENBQUMsQ0FBQyxTQUFTLEVBQUU7b0JBQ2pDLFdBQVcsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDO29CQUMxQixNQUFNO2lCQUNQO2FBQ0Y7WUFDRCxJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUM7WUFDM0IsSUFBSSxJQUFJLENBQUMsYUFBYSxLQUFLLEdBQUcsRUFBRTtnQkFDOUIsYUFBYSxHQUFHLE1BQU0sQ0FBQzthQUN4QjtpQkFBTSxJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssR0FBRyxFQUFFO2dCQUNyQyxhQUFhLEdBQUcsTUFBTSxDQUFDO2FBQ3hCO1lBQ0QsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDO1lBQ3RCLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxHQUFHLEVBQUU7Z0JBQzNCLFVBQVUsR0FBRyxJQUFJLENBQUM7YUFDbkI7WUFDRCxLQUFLO1lBQ0wsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxHQUFHLEVBQUU7Z0JBQzNCLFdBQVcsR0FBRyxJQUFJLENBQUM7YUFDcEI7WUFDRCxNQUFNLElBQUksR0FBRztnQkFDWCxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQ2hCLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTztnQkFDbEIsSUFBSSxFQUFFLFdBQVc7Z0JBQ2pCLElBQUksRUFBRSxJQUFJLENBQUMsWUFBWTtnQkFDdkIsSUFBSSxFQUFFLElBQUksQ0FBQyxZQUFZO2dCQUN2QixLQUFLLEVBQUUsSUFBSSxDQUFDLGNBQWM7Z0JBQzFCLElBQUksRUFBRSxhQUFhO2dCQUNuQixJQUFJLEVBQUUsVUFBVTtnQkFDaEIsSUFBSSxFQUFFLFdBQVc7Z0JBQ2pCLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTTthQUNsQixDQUFDO1lBQ0YsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNoQjtRQUNELE9BQU8sTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM3RCxDQUFDO0NBQ0YsQ0FBQTtBQTFZUztJQURQLElBQUEsYUFBTSxHQUFFOzhCQUNpQiwwQkFBZ0I7dURBQUM7QUFJbkM7SUFEUCxJQUFBLGFBQU0sR0FBRTs4QkFDb0IsaUNBQW1COzBEQUFDO0FBSXpDO0lBRFAsSUFBQSxhQUFNLEdBQUU7OEJBQ21CLGtDQUFrQjt5REFBQztBQUl2QztJQURQLElBQUEsYUFBTSxHQUFFOzhCQUNjLGdCQUFTO29EQUFDO0FBSXpCO0lBRFAsSUFBQSxhQUFNLEdBQUU7OEJBQ1MsZUFBUTsrQ0FBQztBQUlkO0lBRFosSUFBQSxXQUFJLEdBQUU7Ozs7eUNBSU47d0JBMUJVLGFBQWE7SUFGekIsSUFBQSxjQUFPLEdBQUU7SUFDVCxJQUFBLGdCQUFTLEdBQUU7R0FDQyxhQUFhLENBNll6QiJ9