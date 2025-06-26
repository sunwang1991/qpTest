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
exports.SysPostRepository = void 0;
const core_1 = require("@midwayjs/core");
const db_1 = require("../../../framework/datasource/db/db");
const sys_post_1 = require("../model/sys_post");
/**岗位表 数据层处理 */
let SysPostRepository = exports.SysPostRepository = class SysPostRepository {
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
            .from(sys_post_1.SysPost, 's')
            .andWhere("s.del_flag = '0'");
        // 查询条件拼接
        if (query.postCode) {
            tx.andWhere('s.post_code like :postCode', {
                postCode: query.postCode + '%',
            });
        }
        if (query.postName) {
            tx.andWhere('s.post_name like :postName', {
                postName: query.postName + '%',
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
        rows = await tx.addOrderBy('s.post_sort', 'ASC').getMany();
        return [rows, total];
    }
    /**
     * 查询集合
     *
     * @param sysPost 信息
     * @return 列表
     */
    async select(sysPost) {
        const tx = this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_post_1.SysPost, 's')
            .andWhere("s.del_flag = '0'");
        // 构建查询条件
        if (sysPost.postCode) {
            tx.andWhere('s.post_code like :postCode', {
                postCode: sysPost.postCode + '%',
            });
        }
        if (sysPost.postName) {
            tx.andWhere('s.post_name like :postName', {
                postName: sysPost.postName + '%',
            });
        }
        if (sysPost.statusFlag) {
            tx.andWhere('s.status_flag = :statusFlag', {
                statusFlag: sysPost.statusFlag,
            });
        }
        // 查询数据
        return await tx.getMany();
    }
    /**
     * 通过ID查询
     *
     * @param postIds ID数组
     * @return 信息
     */
    async selectByIds(postIds) {
        if (postIds.length <= 0) {
            return [];
        }
        // 查询数据
        const rows = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_post_1.SysPost, 's')
            .andWhere("s.post_id in (:postIds) and s.del_flag = '0'", { postIds })
            .getMany();
        if (rows.length > 0) {
            return rows;
        }
        return [];
    }
    /**
     * 新增
     *
     * @param sysPost 信息
     * @return ID
     */
    async insert(sysPost) {
        sysPost.delFlag = '0';
        if (sysPost.createBy) {
            const ms = Date.now().valueOf();
            sysPost.updateBy = sysPost.createBy;
            sysPost.updateTime = ms;
            sysPost.createTime = ms;
        }
        // 执行插入
        const tx = await this.db
            .queryBuilder('')
            .insert()
            .into(sys_post_1.SysPost)
            .values(sysPost)
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
     * @param sysPost 信息
     * @return 影响记录数
     */
    async update(sysPost) {
        if (sysPost.postId <= 0) {
            return 0;
        }
        if (sysPost.updateBy) {
            sysPost.updateTime = Date.now().valueOf();
        }
        const data = Object.assign({}, sysPost);
        delete data.postId;
        delete data.delFlag;
        delete data.createBy;
        delete data.createTime;
        // 执行更新
        const tx = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .update(sys_post_1.SysPost)
            .set(data)
            .andWhere('post_id = :postId', { postId: sysPost.postId })
            .execute();
        return tx.affected;
    }
    /**
     * 批量删除
     *
     * @param postIds ID数组
     * @return 影响记录数
     */
    async deleteByIds(postIds) {
        if (postIds.length === 0)
            return 0;
        // 执行更新删除标记
        const tx = await this.db
            .queryBuilder('')
            .update(sys_post_1.SysPost)
            .set({ delFlag: '1' })
            .andWhere('post_id in (:postIds)', { postIds })
            .execute();
        return tx.affected;
    }
    /**
     * 检查信息是否唯一 返回数据ID
     * @param sysPost 信息
     * @returns
     */
    async checkUnique(sysPost) {
        const tx = this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_post_1.SysPost, 's')
            .andWhere("s.del_flag = '0'");
        // 查询条件拼接
        if (sysPost.postName) {
            tx.andWhere('s.post_name = :postName', {
                postName: sysPost.postName,
            });
        }
        if (sysPost.postCode) {
            tx.andWhere('s.post_code = :postCode', {
                postCode: sysPost.postCode,
            });
        }
        // 查询数据
        const item = await tx.getOne();
        if (!item) {
            return 0;
        }
        return item.postId;
    }
    /**
     * 根据用户ID获取岗位选择框列表
     * @param configKey 数据Key
     * @returns
     */
    async selectByUserId(userId) {
        if (userId < 0) {
            return [];
        }
        // 查询数据
        const rows = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_post_1.SysPost, 's')
            .andWhere('s.post_id in (select post_id from sys_user_post  where user_id = :userId)', { userId })
            .addOrderBy('s.post_id', 'ASC')
            .getMany();
        if (rows.length > 0) {
            return rows;
        }
        return [];
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", db_1.DynamicDataSource)
], SysPostRepository.prototype, "db", void 0);
exports.SysPostRepository = SysPostRepository = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], SysPostRepository);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX3Bvc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9zeXN0ZW0vcmVwb3NpdG9yeS9zeXNfcG9zdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBNEQ7QUFHNUQsNERBQXdFO0FBQ3hFLGdEQUE0QztBQUU1QyxlQUFlO0FBR1IsSUFBTSxpQkFBaUIsK0JBQXZCLE1BQU0saUJBQWlCO0lBRXBCLEVBQUUsQ0FBb0I7SUFFOUI7Ozs7O09BS0c7SUFDSSxLQUFLLENBQUMsWUFBWSxDQUN2QixLQUE2QjtRQUU3QixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRTthQUNmLFlBQVksQ0FBQyxFQUFFLENBQUM7YUFDaEIsa0JBQWtCLEVBQUU7YUFDcEIsTUFBTSxDQUFDLEdBQUcsQ0FBQzthQUNYLElBQUksQ0FBQyxrQkFBTyxFQUFFLEdBQUcsQ0FBQzthQUNsQixRQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUNoQyxTQUFTO1FBQ1QsSUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFO1lBQ2xCLEVBQUUsQ0FBQyxRQUFRLENBQUMsNEJBQTRCLEVBQUU7Z0JBQ3hDLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUSxHQUFHLEdBQUc7YUFDL0IsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDbEIsRUFBRSxDQUFDLFFBQVEsQ0FBQyw0QkFBNEIsRUFBRTtnQkFDeEMsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRLEdBQUcsR0FBRzthQUMvQixDQUFDLENBQUM7U0FDSjtRQUNELElBQUksS0FBSyxDQUFDLFVBQVUsRUFBRTtZQUNwQixFQUFFLENBQUMsUUFBUSxDQUFDLDZCQUE2QixFQUFFO2dCQUN6QyxVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVU7YUFDN0IsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxPQUFPO1FBQ1AsSUFBSSxLQUFLLEdBQUcs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