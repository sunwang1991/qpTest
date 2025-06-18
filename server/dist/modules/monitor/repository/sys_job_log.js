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
exports.SysJobLogRepository = void 0;
const core_1 = require("@midwayjs/core");
const parse_1 = require("../../../framework/utils/parse/parse");
const db_1 = require("../../../framework/datasource/db/db");
const sys_job_log_1 = require("../model/sys_job_log");
/**调度任务日志表 数据层处理 */
let SysJobLogRepository = exports.SysJobLogRepository = class SysJobLogRepository {
    db;
    /**
     * 分页查询集合
     *
     * @param query 参数
     * @returns 集合
     */
    async selectByPage(query) {
        const tx = this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_job_log_1.SysJobLog, 's');
        // 查询条件拼接
        if (query.jobName) {
            tx.andWhere('s.job_name = :jobName', { jobName: query.jobName });
        }
        if (query.jobGroup) {
            tx.andWhere('s.job_group = :jobGroup', { jobGroup: query.jobGroup });
        }
        if (query.statusFlag) {
            tx.andWhere('s.status_flag = :statusFlag', {
                statusFlag: query.statusFlag,
            });
        }
        if (query.invokeTarget) {
            tx.andWhere('s.invoke_target like :invokeTarget', {
                invokeTarget: query.invokeTarget + '%',
            });
        }
        if (query.beginTime) {
            if (`${query.beginTime}`.length === 10) {
                tx.andWhere('s.create_time >= :beginTime', {
                    beginTime: (0, parse_1.parseNumber)(`${query.beginTime}000`),
                });
            }
            else if (`${query.beginTime}`.length === 13) {
                tx.andWhere('s.create_time >= :beginTime', {
                    beginTime: (0, parse_1.parseNumber)(query.beginTime),
                });
            }
        }
        if (query.endTime) {
            if (`${query.endTime}`.length === 10) {
                tx.andWhere('s.create_time <= :endTime', {
                    endTime: (0, parse_1.parseNumber)(`${query.endTime}000`),
                });
            }
            else if (`${query.endTime}`.length === 13) {
                tx.andWhere('s.create_time <= :endTime', {
                    endTime: (0, parse_1.parseNumber)(query.endTime),
                });
            }
        }
        // 查询结果
        let total = 0;
        let rows = [];
        // 查询数量为0直接返回
        total = await tx.getCount();
        if (total <= 0) {
            return [rows, total];
        }
        // 查询数据分页
        const [pageNum, pageSize] = this.db.pageNumSize(query.pageNum, query.pageSize);
        tx.skip(pageSize * pageNum).take(pageSize);
        rows = await tx.getMany();
        return [rows, total];
    }
    /**
     * 查询集合
     *
     * @param sysJobLog 信息
     * @return 列表
     */
    async select(sysJobLog) {
        const tx = this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_job_log_1.SysJobLog, 's');
        // 构建查询条件
        if (sysJobLog.jobName) {
            tx.andWhere('s.job_name like :jobName', {
                jobName: sysJobLog.jobName + '%',
            });
        }
        if (sysJobLog.jobGroup) {
            tx.andWhere('s.job_group = :jobGroup', { jobGroup: sysJobLog.jobGroup });
        }
        if (sysJobLog.statusFlag) {
            tx.andWhere('s.status_flag = :statusFlag', {
                statusFlag: sysJobLog.statusFlag,
            });
        }
        if (sysJobLog.invokeTarget) {
            tx.andWhere('s.invoke_target like :invokeTarget', {
                invokeTarget: sysJobLog.invokeTarget + '%',
            });
        }
        // 查询数据
        return await tx.getMany();
    }
    /**
     * 通过ID查询
     *
     * @param logId ID
     * @return 信息
     */
    async selectById(logId) {
        if (logId <= 0) {
            return new sys_job_log_1.SysJobLog();
        }
        // 查询数据
        const item = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_job_log_1.SysJobLog, 's')
            .andWhere('s.log_id = :logId', { logId })
            .getOne();
        if (!item) {
            return new sys_job_log_1.SysJobLog();
        }
        return item;
    }
    /**
     * 新增
     *
     * @param sysJobLog 信息
     * @return ID
     */
    async insert(sysJobLog) {
        // 执行插入
        const tx = await this.db
            .queryBuilder('')
            .insert()
            .into(sys_job_log_1.SysJobLog)
            .values(sysJobLog)
            .execute();
        const raw = tx.raw;
        if (raw.insertId > 0) {
            return raw.insertId;
        }
        return 0;
    }
    /**
     * 批量删除
     *
     * @param logIds ID数组
     * @return 影响记录数
     */
    async deleteByIds(logIds) {
        if (logIds.length === 0)
            return 0;
        // 执行删除
        const tx = await this.db
            .queryBuilder('')
            .delete()
            .from(sys_job_log_1.SysJobLog)
            .andWhere('log_id in (:logIds)', { logIds: logIds })
            .execute();
        return tx.affected;
    }
    /**
     * 清空集合数据
     *
     * @return 影响记录数
     */
    async clean() {
        // 执行删除
        const tx = await this.db
            .queryBuilder('')
            .delete()
            .from(sys_job_log_1.SysJobLog)
            .execute();
        return tx.affected;
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", db_1.DynamicDataSource)
], SysJobLogRepository.prototype, "db", void 0);
exports.SysJobLogRepository = SysJobLogRepository = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], SysJobLogRepository);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX2pvYl9sb2cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9tb25pdG9yL3JlcG9zaXRvcnkvc3lzX2pvYl9sb2cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEseUNBQTREO0FBRzVELGdFQUFtRTtBQUNuRSw0REFBd0U7QUFDeEUsc0RBQWlEO0FBRWpELG1CQUFtQjtBQUdaLElBQU0sbUJBQW1CLGlDQUF6QixNQUFNLG1CQUFtQjtJQUV0QixFQUFFLENBQW9CO0lBRTlCOzs7OztPQUtHO0lBQ0ksS0FBSyxDQUFDLFlBQVksQ0FDdkIsS0FBNkI7UUFFN0IsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUU7YUFDZixZQUFZLENBQUMsRUFBRSxDQUFDO2FBQ2hCLGtCQUFrQixFQUFFO2FBQ3BCLE1BQU0sQ0FBQyxHQUFHLENBQUM7YUFDWCxJQUFJLENBQUMsdUJBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN4QixTQUFTO1FBQ1QsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFO1lBQ2pCLEVBQUUsQ0FBQyxRQUFRLENBQUMsdUJBQXVCLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7U0FDbEU7UUFDRCxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDbEIsRUFBRSxDQUFDLFFBQVEsQ0FBQyx5QkFBeUIsRUFBRSxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztTQUN0RTtRQUNELElBQUksS0FBSyxDQUFDLFVBQVUsRUFBRTtZQUNwQixFQUFFLENBQUMsUUFBUSxDQUFDLDZCQUE2QixFQUFFO2dCQUN6QyxVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVU7YUFDN0IsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxJQUFJLEtBQUssQ0FBQyxZQUFZLEVBQUU7WUFDdEIsRUFBRSxDQUFDLFFBQVEsQ0FBQyxvQ0FB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