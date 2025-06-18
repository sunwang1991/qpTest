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
exports.SysNoticeRepository = void 0;
const core_1 = require("@midwayjs/core");
const db_1 = require("../../../framework/datasource/db/db");
const parse_1 = require("../../../framework/utils/parse/parse");
const sys_notice_1 = require("../model/sys_notice");
/**通知公告表 数据层处理 */
let SysNoticeRepository = exports.SysNoticeRepository = class SysNoticeRepository {
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
            .from(sys_notice_1.SysNotice, 's')
            .andWhere("del_flag = '0'");
        // 查询条件拼接
        if (query.noticeTitle) {
            tx.andWhere('s.notice_title like :noticeTitle', {
                noticeTitle: query.noticeTitle + '%',
            });
        }
        if (query.noticeType) {
            tx.andWhere('s.notice_type = :noticeType', {
                noticeType: query.noticeType,
            });
        }
        if (query.createBy) {
            tx.andWhere('s.create_by like :createBy', {
                createBy: query.createBy + '%',
            });
        }
        if (query.statusFlag) {
            tx.andWhere('s.status_flag = :statusFlag', {
                statusFlag: query.statusFlag,
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
     * @param sysNotice 信息
     * @return 列表
     */
    async select(sysNotice) {
        const tx = this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_notice_1.SysNotice, 's');
        // 构建查询条件
        if (sysNotice.noticeTitle) {
            tx.andWhere('s.notice_title like :noticeTitle', {
                noticeTitle: sysNotice.noticeTitle + '%',
            });
        }
        if (sysNotice.noticeType) {
            tx.andWhere('s.notice_type = :noticeType', {
                noticeType: sysNotice.noticeType,
            });
        }
        if (sysNotice.createBy) {
            tx.andWhere('s.create_by like :createBy', {
                createBy: sysNotice.createBy + '%',
            });
        }
        if (sysNotice.statusFlag) {
            tx.andWhere('s.status_flag = :statusFlag', {
                statusFlag: sysNotice.statusFlag,
            });
        }
        // 查询数据
        return await tx.getMany();
    }
    /**
     * 通过ID查询
     *
     * @param noticeIds ID数组
     * @return 信息
     */
    async selectByIds(noticeIds) {
        if (noticeIds.length <= 0) {
            return [];
        }
        // 查询数据
        const rows = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_notice_1.SysNotice, 's')
            .andWhere("s.notice_id in (:noticeIds) and s.del_flag = '0'", {
            noticeIds,
        })
            .getMany();
        if (rows.length > 0) {
            return rows;
        }
        return [];
    }
    /**
     * 新增
     *
     * @param sysConfig 信息
     * @return ID
     */
    async insert(sysNotice) {
        sysNotice.delFlag = '0';
        if (sysNotice.createBy) {
            const ms = Date.now().valueOf();
            sysNotice.updateBy = sysNotice.createBy;
            sysNotice.updateTime = ms;
            sysNotice.createTime = ms;
        }
        // 执行插入
        const tx = await this.db
            .queryBuilder('')
            .insert()
            .into(sys_notice_1.SysNotice)
            .values(sysNotice)
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
     * @param sysNotice 信息
     * @return 影响记录数
     */
    async update(sysNotice) {
        if (sysNotice.noticeId <= 0) {
            return 0;
        }
        if (sysNotice.updateBy) {
            sysNotice.updateTime = Date.now().valueOf();
        }
        const data = Object.assign({}, sysNotice);
        delete data.noticeId;
        delete data.delFlag;
        delete data.createBy;
        delete data.createTime;
        // 执行更新
        const tx = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .update(sys_notice_1.SysNotice)
            .set(data)
            .andWhere('notice_id = :noticeId', { noticeId: sysNotice.noticeId })
            .execute();
        return tx.affected;
    }
    /**
     * 批量删除
     *
     * @param configIds ID数组
     * @return 影响记录数
     */
    async deleteByIds(noticeIds) {
        if (noticeIds.length === 0)
            return 0;
        // 执行更新删除标记
        const tx = await this.db
            .queryBuilder('')
            .update(sys_notice_1.SysNotice)
            .set({ delFlag: '1' })
            .andWhere('notice_id in (:noticeIds)', { noticeIds })
            .execute();
        return tx.affected;
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", db_1.DynamicDataSource)
], SysNoticeRepository.prototype, "db", void 0);
exports.SysNoticeRepository = SysNoticeRepository = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], SysNoticeRepository);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX25vdGljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3N5c3RlbS9yZXBvc2l0b3J5L3N5c19ub3RpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEseUNBQTREO0FBRzVELDREQUF3RTtBQUN4RSxnRUFBbUU7QUFDbkUsb0RBQWdEO0FBRWhELGlCQUFpQjtBQUdWLElBQU0sbUJBQW1CLGlDQUF6QixNQUFNLG1CQUFtQjtJQUV0QixFQUFFLENBQW9CO0lBRTlCOzs7OztPQUtHO0lBQ0ksS0FBSyxDQUFDLFlBQVksQ0FDdkIsS0FBNkI7UUFFN0IsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUU7YUFDZixZQUFZLENBQUMsRUFBRSxDQUFDO2FBQ2hCLGtCQUFrQixFQUFFO2FBQ3BCLE1BQU0sQ0FBQyxHQUFHLENBQUM7YUFDWCxJQUFJLENBQUMsc0JBQVMsRUFBRSxHQUFHLENBQUM7YUFDcEIsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDOUIsU0FBUztRQUNULElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRTtZQUNyQixFQUFFLENBQUMsUUFBUSxDQUFDLGtDQUFrQyxFQUFFO2dCQUM5QyxXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVcsR0FBRyxHQUFHO2FBQ3JDLENBQUMsQ0FBQztTQUNKO1FBQ0QsSUFBSSxLQUFLLENBQUMsVUFBVSxFQUFFO1lBQ3BCLEVBQUUsQ0FBQyxRQUFRLENBQUMsNkJBQTZCLEVBQUU7Z0JBQ3pDLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVTthQUM3QixDQUFDLENBQUM7U0FDSjtRQUNELElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRTtZQUNsQixFQUFFLENBQUMsUUFBUSxDQUFDLDRCQUE0QixFQUFFO2dCQUN4QyxRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVEsR0FBRyxHQUFHO2FBQy9CLENBQUMsQ0FBQztTQUNKO1FBQ0QsSUFBSSxL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