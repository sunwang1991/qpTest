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
exports.DemoORMService = void 0;
const core_1 = require("@midwayjs/core");
const db_1 = require("../../../framework/datasource/db/db");
const demo_orm_1 = require("../model/demo_orm");
/**
 * 测试ORM信息
 */
let DemoORMService = exports.DemoORMService = class DemoORMService {
    db;
    /**
     * 分页查询
     * @param query 参数
     * @returns
     */
    async findByPage(query) {
        const tx = this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('d')
            .from(demo_orm_1.DemoORM, 'd');
        // 查询条件拼接
        if (query.title) {
            tx.andWhere('d.title like :title', { title: query.title + '%' });
        }
        if (query.statusFlag) {
            tx.andWhere('d.status_flag = :statusFlag', {
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
     * @param param 信息
     * @return 列表
     */
    async find(param) {
        const tx = this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('d')
            .from(demo_orm_1.DemoORM, 'd');
        // 构建查询条件
        if (param.title) {
            tx.andWhere('d.title like :title', { title: param.title + '%' });
        }
        if (param.statusFlag) {
            tx.andWhere('d.status_flag = :statusFlag', {
                statusFlag: param.statusFlag,
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
    async findById(id) {
        if (id <= 0) {
            return new demo_orm_1.DemoORM();
        }
        // 查询数据
        const item = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('d')
            .from(demo_orm_1.DemoORM, 'd')
            .andWhere('d.id = :id', { id })
            .getOne();
        if (!item) {
            return new demo_orm_1.DemoORM();
        }
        return item;
    }
    /**
     * 新增
     *
     * @param param 信息
     * @return ID
     */
    async insert(param) {
        param.createBy = 'system';
        param.createTime = Date.now().valueOf();
        param.updateBy = param.createBy;
        param.updateTime = param.createTime;
        // 执行插入
        const tx = await this.db
            .queryBuilder('')
            .insert()
            .into(demo_orm_1.DemoORM)
            .values(param)
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
     * @param param 信息
     * @return 影响记录数
     */
    async update(param) {
        if (param.id <= 0) {
            return 0;
        }
        const item = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('d')
            .from(demo_orm_1.DemoORM, 'd')
            .andWhere('d.id = :id', { id: param.id })
            .getOne();
        if (!item)
            return 0;
        // 只改某些属性
        const setColumns = {
            title: param.title,
            ormType: param.ormType,
            statusFlag: param.statusFlag,
            remark: param.remark,
            updateBy: 'system',
            updateTime: Date.now().valueOf(),
        };
        // 执行更新
        const tx = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .update(demo_orm_1.DemoORM)
            .set(setColumns)
            .andWhere('id = :id', { id: item.id })
            .execute();
        return tx.affected;
    }
    /**
     * 批量删除
     *
     * @param ids ID数组
     * @return 影响记录数
     */
    async deleteByIds(ids) {
        if (ids.length === 0)
            return 0;
        // 执行删除
        const tx = await this.db
            .queryBuilder('')
            .delete()
            .from(demo_orm_1.DemoORM)
            .andWhere('id in (:ids)', { ids })
            .execute();
        return tx.affected;
    }
    /**
     * 清空测试ORM表
     * @return 删除记录数
     */
    async clean() {
        const tx = await this.db
            .queryBuilder('')
            .delete()
            .from(demo_orm_1.DemoORM)
            .execute();
        return tx.affected;
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", db_1.DynamicDataSource)
], DemoORMService.prototype, "db", void 0);
exports.DemoORMService = DemoORMService = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], DemoORMService);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVtb19vcm0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9kZW1vL3NlcnZpY2UvZGVtb19vcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEseUNBQTREO0FBRTVELDREQUF3RTtBQUN4RSxnREFBNEM7QUFFNUM7O0dBRUc7QUFHSSxJQUFNLGNBQWMsNEJBQXBCLE1BQU0sY0FBYztJQUVqQixFQUFFLENBQW9CO0lBRTlCOzs7O09BSUc7SUFDSSxLQUFLLENBQUMsVUFBVSxDQUNyQixLQUE2QjtRQUU3QixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRTthQUNmLFlBQVksQ0FBQyxFQUFFLENBQUM7YUFDaEIsa0JBQWtCLEVBQUU7YUFDcEIsTUFBTSxDQUFDLEdBQUcsQ0FBQzthQUNYLElBQUksQ0FBQyxrQkFBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLFNBQVM7UUFDVCxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUU7WUFDZixFQUFFLENBQUMsUUFBUSxDQUFDLHFCQUFxQixFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQztTQUNsRTtRQUNELElBQUksS0FBSyxDQUFDLFVBQVUsRUFBRTtZQUNwQixFQUFFLENBQUMsUUFBUSxDQUFDLDZCQUE2QixFQUFFO2dCQUN6QyxVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVU7YUFDN0IsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxPQUFPO1FBQ1AsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxJQUFJLEdBQWMsRUFBRSxDQUFDO1FBRXpCLGFBQWE7UUFDYixLQUFLLEdBQUcsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDNUIsSUFBSSxLQUFLLElBQUksQ0FBQyxFQUFFO1lBQ2QsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztTQUN0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