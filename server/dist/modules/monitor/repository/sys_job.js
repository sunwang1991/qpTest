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
exports.SysJobRepository = void 0;
const core_1 = require("@midwayjs/core");
const db_1 = require("../../../framework/datasource/db/db");
const sys_job_1 = require("../model/sys_job");
/**调度任务表 数据层处理 */
let SysJobRepository = exports.SysJobRepository = class SysJobRepository {
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
            .from(sys_job_1.SysJob, 's');
        // 查询条件拼接
        if (query.jobName) {
            tx.andWhere('s.job_name like :jobName', {
                jobName: query.jobName + '%',
            });
        }
        if (query.jobGroup) {
            tx.andWhere('s.job_group = :jobGroup', { jobGroup: query.jobGroup });
        }
        if (query.invokeTarget) {
            tx.andWhere('s.invoke_target like :invokeTarget', {
                invokeTarget: query.invokeTarget + '%',
            });
        }
        if (query.statusFlag) {
            tx.andWhere('s.status_flag = :statusFlag', {
                statusFlag: query.statusFlag,
            });
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
     * @param sysJob 信息
     * @return 列表
     */
    async select(sysJob) {
        const tx = this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_job_1.SysJob, 's');
        // 构建查询条件
        if (sysJob.jobName) {
            tx.andWhere('s.job_name like :jobName', {
                v: sysJob.jobName + '%',
            });
        }
        if (sysJob.jobGroup) {
            tx.andWhere('s.job_group = :jobGroup', { jobGroup: sysJob.jobGroup });
        }
        if (sysJob.invokeTarget) {
            tx.andWhere('s.invoke_target like :invokeTarget', {
                invokeTarget: sysJob.invokeTarget + '%',
            });
        }
        if (sysJob.statusFlag) {
            tx.andWhere('s.status_flag = :statusFlag', {
                statusFlag: sysJob.statusFlag,
            });
        }
        // 查询数据
        return await tx.getMany();
    }
    /**
     * 通过ID查询
     *
     * @param id ID
     * @return 信息
     */
    async selectByIds(jobIds) {
        if (jobIds.length <= 0) {
            return [];
        }
        // 查询数据
        const rows = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_job_1.SysJob, 's')
            .andWhere('s.job_id in (:jobIds)', { jobIds })
            .getMany();
        if (rows.length > 0) {
            return rows;
        }
        return [];
    }
    /**
     * 新增
     *
     * @param sysJob 信息
     * @return ID
     */
    async insert(sysJob) {
        if (sysJob.createBy) {
            const ms = Date.now().valueOf();
            sysJob.updateBy = sysJob.createBy;
            sysJob.createTime = ms;
            sysJob.updateTime = ms;
        }
        // 执行插入
        const tx = await this.db
            .queryBuilder('')
            .insert()
            .into(sys_job_1.SysJob)
            .values(sysJob)
            .execute();
        const raw = tx.raw;
        if (raw.insertId > 0) {
            return raw.insertId;
        }
        return 0;
    }
    /**
     * 更新
     *
     * @param sysJob 信息
     * @return 影响记录数
     */
    async update(sysJob) {
        if (sysJob.jobId <= 0) {
            return 0;
        }
        if (sysJob.updateBy) {
            sysJob.updateTime = Date.now().valueOf();
        }
        const data = Object.assign({}, sysJob);
        delete data.jobId;
        delete data.createBy;
        delete data.createTime;
        // 执行更新
        const tx = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .update(sys_job_1.SysJob)
            .set(data)
            .andWhere('jobId = :jobId', { jobId: sysJob.jobId })
            .execute();
        return tx.affected;
    }
    /**
     * 批量删除
     *
     * @param ids ID数组
     * @return 影响记录数
     */
    async deleteByIds(jobIds) {
        if (jobIds.length <= 0)
            return 0;
        // 执行删除
        const tx = await this.db
            .queryBuilder('')
            .delete()
            .from(sys_job_1.SysJob)
            .andWhere('jobId in (:jobIds)', { jobIds })
            .execute();
        return tx.affected;
    }
    /**
     * 校验信息是否唯一
     *
     * @param sysJob 调度任务信息
     * @return 调度任务id
     */
    async checkUnique(sysJob) {
        const tx = this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_job_1.SysJob, 's');
        // 查询条件拼接
        if (sysJob.jobName) {
            tx.andWhere('s.job_name = :jobName', { jobName: sysJob.jobName });
        }
        if (sysJob.jobGroup) {
            tx.andWhere('s.job_group = :jobGroup', { jobGroup: sysJob.jobGroup });
        }
        // 查询数据
        const item = await tx.getOne();
        if (!item) {
            return 0;
        }
        return item.jobId;
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", db_1.DynamicDataSource)
], SysJobRepository.prototype, "db", void 0);
exports.SysJobRepository = SysJobRepository = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], SysJobRepository);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX2pvYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL21vbml0b3IvcmVwb3NpdG9yeS9zeXNfam9iLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHlDQUE0RDtBQUc1RCw0REFBd0U7QUFDeEUsOENBQTBDO0FBRTFDLGlCQUFpQjtBQUdWLElBQU0sZ0JBQWdCLDhCQUF0QixNQUFNLGdCQUFnQjtJQUVuQixFQUFFLENBQW9CO0lBRTlCOzs7OztPQUtHO0lBQ0ksS0FBSyxDQUFDLFlBQVksQ0FDdkIsS0FBNkI7UUFFN0IsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUU7YUFDZixZQUFZLENBQUMsRUFBRSxDQUFDO2FBQ2hCLGtCQUFrQixFQUFFO2FBQ3BCLE1BQU0sQ0FBQyxHQUFHLENBQUM7YUFDWCxJQUFJLENBQUMsZ0JBQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNyQixTQUFTO1FBQ1QsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFO1lBQ2pCLEVBQUUsQ0FBQyxRQUFRLENBQUMsMEJBQTBCLEVBQUU7Z0JBQ3RDLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxHQUFHLEdBQUc7YUFDN0IsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDbEIsRUFBRSxDQUFDLFFBQVEsQ0FBQyx5QkFBeUIsRUFBRSxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztTQUN0RTtRQUNELElBQUksS0FBSyxDQUFDLFlBQVksRUFBRTtZQUN0QixFQUFFLENBQUMsUUFBUSxDQUFDLG9DQUFvQyxFQUFFO2dCQUNoRCxZQUFZLEVBQUUsS0FBSyxDQUFDLFlBQVksR0FBRyxHQUFHO2FBQ3ZDLENBQUMsQ0FBQztTQUNKO1FBQ0QsSUFBSSxLQUFLLENBQUMsVUFBVSxFQUFFO1lBQ3BCLEVBQUUsQ0FBQyxRQUFRLENBQUMsNkJB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