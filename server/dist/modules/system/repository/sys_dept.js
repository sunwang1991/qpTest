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
exports.SysDeptRepository = void 0;
const core_1 = require("@midwayjs/core");
const db_1 = require("../../../framework/datasource/db/db");
const sys_dept_1 = require("../model/sys_dept");
const sys_user_1 = require("../model/sys_user");
/**部门表 数据层处理 */
let SysDeptRepository = exports.SysDeptRepository = class SysDeptRepository {
    db;
    /**
     * 查询集合
     *
     * @param sysDept 信息
     * @param dataScopeSQL 角色数据范围过滤SQL字符串
     * @return 列表
     */
    async select(sysDept, dataScopeSQL) {
        const tx = this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_dept_1.SysDept, 's')
            .andWhere("s.del_flag = '0'");
        // 构建查询条件
        if (sysDept.deptId) {
            tx.andWhere('s.dept_id = :deptId', {
                deptId: sysDept.deptId,
            });
        }
        if (sysDept.parentId) {
            tx.andWhere('s.parent_id = :parentId', {
                parentId: sysDept.parentId,
            });
        }
        if (sysDept.deptName) {
            tx.andWhere('s.dept_name like :deptName', {
                deptName: sysDept.deptName + '%',
            });
        }
        if (sysDept.statusFlag) {
            tx.andWhere('s.status_flag = :statusFlag', {
                statusFlag: sysDept.statusFlag,
            });
        }
        if (dataScopeSQL) {
            tx.andWhere(dataScopeSQL);
        }
        // 查询数据
        return await tx.getMany();
    }
    /**
     * 通过ID查询
     *
     * @param deptId ID
     * @return 信息
     */
    async selectById(deptId) {
        if (deptId <= 0) {
            return new sys_dept_1.SysDept();
        }
        // 查询数据
        const item = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_dept_1.SysDept, 's')
            .andWhere("s.dept_id = :deptId and s.del_flag = '0'", { deptId })
            .getOne();
        if (!item) {
            return new sys_dept_1.SysDept();
        }
        return item;
    }
    /**
     * 新增
     *
     * @param sysDept 信息
     * @return ID
     */
    async insert(sysDept) {
        sysDept.delFlag = '0';
        if (sysDept.createBy) {
            const ms = Date.now().valueOf();
            sysDept.updateBy = sysDept.createBy;
            sysDept.updateTime = ms;
            sysDept.createTime = ms;
        }
        // 执行插入
        const tx = await this.db
            .queryBuilder('')
            .insert()
            .into(sys_dept_1.SysDept)
            .values(sysDept)
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
     * @param sysDept 信息
     * @return 影响记录数
     */
    async update(sysDept) {
        if (sysDept.deptId <= 0) {
            return 0;
        }
        if (sysDept.updateBy) {
            sysDept.updateTime = Date.now().valueOf();
        }
        const data = Object.assign({}, sysDept);
        delete data.deptId;
        delete data.delFlag;
        delete data.createBy;
        delete data.createTime;
        // 执行更新
        const tx = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .update(sys_dept_1.SysDept)
            .set(data)
            .andWhere('dept_id = :deptId', { deptId: sysDept.deptId })
            .execute();
        return tx.affected;
    }
    /**
     * 删除信息
     *
     * @param deptId ID
     * @return 影响记录数
     */
    async deleteById(deptId) {
        if (deptId <= 0)
            return 0;
        // 执行更新删除标记
        const tx = await this.db
            .queryBuilder('')
            .update(sys_dept_1.SysDept)
            .set({ delFlag: '1' })
            .andWhere('dept_id = :deptId', { deptId })
            .execute();
        return tx.affected;
    }
    /**
     * 检查信息是否唯一 返回数据ID
     * @param sysDept 信息
     * @returns
     */
    async checkUnique(sysDept) {
        const tx = this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_dept_1.SysDept, 's')
            .andWhere("s.del_flag = '0'");
        // 查询条件拼接
        if (sysDept.deptName) {
            tx.andWhere('s.dept_name = :deptName', {
                deptName: sysDept.deptName,
            });
        }
        if (sysDept.parentId) {
            tx.andWhere('s.parent_id = :parentId', {
                parentId: sysDept.parentId,
            });
        }
        // 查询数据
        const item = await tx.getOne();
        if (!item) {
            return 0;
        }
        return item.deptId;
    }
    /**
     * 存在子节点数量
     *
     * @param deptId ID
     * @return 数量
     */
    async existChildrenByDeptId(deptId) {
        if (deptId <= 0) {
            return 0;
        }
        // 查询数据
        const count = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_dept_1.SysDept, 's')
            .andWhere("s.del_flag = '0' and s.status_flag = '1'")
            .andWhere('s.parent_id = :deptId', { deptId })
            .getCount();
        return count;
    }
    /**
     * 存在用户使用数量
     *
     * @param deptId ID
     * @return 数量
     */
    async existUserByDeptId(deptId) {
        if (deptId <= 0) {
            return 0;
        }
        // 查询数据
        const count = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_user_1.SysUser, 's')
            .andWhere("s.del_flag = '0'")
            .andWhere('s.dept_id = :deptId', { deptId })
            .getCount();
        return count;
    }
    /**
     * 通过角色ID查询包含的部门ID
     *
     * @param roleId 角色ID
     * @param deptCheckStrictly 是否关联显示
     * @return 数量
     */
    async selectDeptIdsByRoleId(roleId, deptCheckStrictly) {
        if (roleId <= 0) {
            return [];
        }
        const tx = this.db
            .queryBuilder('')
            .createQueryBuilder()
            .distinctOn(['s.dept_id'])
            .select('s')
            .from(sys_dept_1.SysDept, 's')
            .andWhere("s.del_flag = '0'")
            .andWhere('s.dept_id in (SELECT DISTINCT dept_id FROM sys_role_dept WHERE role_id = :roleId)', { roleId });
        // 父子互相关联显示，取所有子节点
        if (deptCheckStrictly) {
            tx.andWhere(`s.dept_id not in (
        SELECT d.parent_id FROM sys_dept d 
        INNER JOIN sys_role_dept rd ON rd.dept_id = d.dept_id 
        AND rd.role_id = :roleId 
        )`, { roleId });
        }
        // 查询数据
        const rows = await tx.getMany();
        return rows.map(v => v.deptId);
    }
    /**
     * 根据ID查询所有子部门
     *
     * @param deptId ID
     * @return 数量
     */
    async selectChildrenDeptById(deptId) {
        const rows = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_dept_1.SysDept, 's')
            .andWhere("s.del_flag = '0'")
            .andWhere('find_in_set(:deptId, s.ancestors)', { deptId })
            .getMany();
        if (rows.length > 0) {
            return rows;
        }
        return [];
    }
    /**
     * 修改所在部门正常状态
     *
     * @param deptIds ID数组
     * @return 影响记录数
     */
    async updateDeptStatusNormal(deptIds) {
        if (deptIds.length <= 0) {
            return 0;
        }
        // 执行更新状态标记
        const tx = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .update(sys_dept_1.SysDept)
            .set("status_flag = '1'")
            .andWhere('dept_id in (:deptIds)', { deptIds })
            .execute();
        return tx.affected;
    }
    /**
     * 修改子元素关系
     *
     * @param arr 信息数组
     * @return 影响记录数
     */
    async updateDeptChildren(arr) {
        if (arr.length <= 0) {
            return 0;
        }
        // 构建查询条件
        const conditions = [];
        const deptIds = [];
        for (const v of arr) {
            conditions.push(`WHEN dept_id = ${v.deptId} THEN '${v.ancestors}'`);
            deptIds.push(v.deptId);
        }
        const casesValues = `"CASE ${conditions.join(',')} END"`;
        // 执行更新操作
        const tx = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .update(sys_dept_1.SysDept)
            .set(`ancestors = ${casesValues}`)
            .andWhere('dept_id in (:deptIds)', { deptIds })
            .execute();
        return tx.affected;
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", db_1.DynamicDataSource)
], SysDeptRepository.prototype, "db", void 0);
exports.SysDeptRepository = SysDeptRepository = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], SysDeptRepository);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX2RlcHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9zeXN0ZW0vcmVwb3NpdG9yeS9zeXNfZGVwdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBNEQ7QUFHNUQsNERBQXdFO0FBQ3hFLGdEQUE0QztBQUM1QyxnREFBNEM7QUFFNUMsZUFBZTtBQUdSLElBQU0saUJBQWlCLCtCQUF2QixNQUFNLGlCQUFpQjtJQUVwQixFQUFFLENBQW9CO0lBRTlCOzs7Ozs7T0FNRztJQUNJLEtBQUssQ0FBQyxNQUFNLENBQ2pCLE9BQWdCLEVBQ2hCLFlBQW9CO1FBRXBCLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFO2FBQ2YsWUFBWSxDQUFDLEVBQUUsQ0FBQzthQUNoQixrQkFBa0IsRUFBRTthQUNwQixNQUFNLENBQUMsR0FBRyxDQUFDO2FBQ1gsSUFBSSxDQUFDLGtCQUFPLEVBQUUsR0FBRyxDQUFDO2FBQ2xCLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ2hDLFNBQVM7UUFDVCxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDbEIsRUFBRSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtnQkFDakMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO2FBQ3ZCLENBQUMsQ0FBQztTQUNKO1FBQ0QsSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFO1lBQ3BCLEVBQUUsQ0FBQyxRQUFRLENBQUMseUJBQXlCLEVBQUU7Z0JBQ3JDLFFBQVEsRUFBRSxPQUFPLENBQUMsUUFBUTthQUMzQixDQUFDLENBQUM7U0FDSjtRQUNELElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRTtZQUNwQixFQUFFLENBQUMsUUFBUSxDQUFDLDRCQUE0QixFQUFFO2dCQUN4QyxRQUFRLEVBQUUsT0FBTyxDQUFDLFFBQVEsR0FBRyxHQUFHO2FBQ2pDLENBQUMsQ0FBQztTQUNKO1FBQ0QsSUFBSSxPQUFP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