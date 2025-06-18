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
exports.SysRoleDeptRepository = void 0;
const core_1 = require("@midwayjs/core");
const db_1 = require("../../../framework/datasource/db/db");
const sys_role_dept_1 = require("../model/sys_role_dept");
/**角色与部门关联表 数据层处理 */
let SysRoleDeptRepository = exports.SysRoleDeptRepository = class SysRoleDeptRepository {
    db;
    /**
     * 批量删除信息By角色
     *
     * @param roleIds ID数组
     * @return 影响记录数
     */
    async deleteByRoleIds(roleIds) {
        if (roleIds.length <= 0)
            return 0;
        // 执行删除
        const tx = await this.db
            .queryBuilder('')
            .delete()
            .from(sys_role_dept_1.SysRoleDept)
            .andWhere('role_id in (:roleIds)', { roleIds })
            .execute();
        return tx.affected;
    }
    /**
     * 批量删除信息By部门
     *
     * @param deptIds ID数组
     * @return 影响记录数
     */
    async deleteByDeptIds(deptIds) {
        if (deptIds.length <= 0)
            return 0;
        // 执行删除
        const tx = await this.db
            .queryBuilder('')
            .delete()
            .from(sys_role_dept_1.SysRoleDept)
            .andWhere('dept_id in (:deptIds)', { deptIds })
            .execute();
        return tx.affected;
    }
    /**
     * 批量新增信息
     *
     * @param sysRoleDepts 信息
     * @return 影响记录数
     */
    async batchInsert(sysRoleDepts) {
        if (sysRoleDepts.length <= 0)
            return 0;
        // 执行插入
        const tx = await this.db
            .queryBuilder('')
            .insert()
            .into(sys_role_dept_1.SysRoleDept)
            .values(sysRoleDepts)
            .execute();
        const raw = tx.raw;
        if (raw.affectedRows > 0) {
            return raw.affectedRows;
        }
        return 0;
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", db_1.DynamicDataSource)
], SysRoleDeptRepository.prototype, "db", void 0);
exports.SysRoleDeptRepository = SysRoleDeptRepository = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], SysRoleDeptRepository);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX3JvbGVfZGVwdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3N5c3RlbS9yZXBvc2l0b3J5L3N5c19yb2xlX2RlcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEseUNBQTREO0FBRzVELDREQUF3RTtBQUN4RSwwREFBcUQ7QUFFckQsb0JBQW9CO0FBR2IsSUFBTSxxQkFBcUIsbUNBQTNCLE1BQU0scUJBQXFCO0lBRXhCLEVBQUUsQ0FBb0I7SUFFOUI7Ozs7O09BS0c7SUFDSSxLQUFLLENBQUMsZUFBZSxDQUFDLE9BQWlCO1FBQzVDLElBQUksT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDO1lBQUUsT0FBTyxDQUFDLENBQUM7UUFDbEMsT0FBTztRQUNQLE1BQU0sRUFBRSxHQUFpQixNQUFNLElBQUksQ0FBQyxFQUFFO2FBQ25DLFlBQVksQ0FBQyxFQUFFLENBQUM7YUFDaEIsTUFBTSxFQUFFO2FBQ1IsSUFBSSxDQUFDLDJCQUFXLENBQUM7YUFDakIsUUFBUSxDQUFDLHVCQUF1QixFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUM7YUFDOUMsT0FBTyxFQUFFLENBQUM7UUFDYixPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUM7SUFDckIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksS0FBSyxDQUFDLGVBQWUsQ0FBQyxPQUFpQjtRQUM1QyxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQztZQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2xDLE9BQU87UUFDUCxNQUFNLEVBQUUsR0FBaUIsTUFBTSxJQUFJLENBQUMsRUFBRTthQUNuQyxZQUFZLENBQUMsRUFBRSxDQUFDO2FBQ2hCLE1BQU0sRUFBRTthQUNSLElBQUksQ0FBQywyQkFBVyxDQUFDO2FBQ2pCLFFBQVEsQ0FBQyx1QkFBdUIsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDO2FBQzlDLE9BQU8sRUFBRSxDQUFDO1FBQ2IsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDO0lBQ3JCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLEtBQUssQ0FBQyxXQUFXLENBQUMsWUFBMkI7UUFDbEQsSUFBSSxZQUFZLENBQUMsTUFBTSxJQUFJLENBQUM7WUFBRSxPQUFPLENBQUMsQ0FBQztRQUN2QyxPQUFPO1FBQ1AsTUFBTSxFQUFFLEdBQWlCLE1BQU0sSUFBSSxDQUFDLEVBQUU7YUFDbkMsWUFBWSxDQUFDLEVBQUUsQ0FBQzthQUNoQixNQUFNLEVBQUU7YUFDUixJQUFJLENBQUMsMkJBQVcsQ0FBQzthQUNqQixNQUFNLENBQUMsWUFBWSxDQUFDO2FBQ3BCLE9BQU8sRUFBRSxDQUFDO1FBQ2IsTUFBTSxHQUFHLEdBQW9CLEVBQUUsQ0FBQyxHQUFHLENBQUM7UUFDcEMsSUFBSSxHQUFHLENBQUMsWUFBWSxHQUFHLENBQUMsRUFBRTtZQUN4QixPQUFPLEdBQUcsQ0FBQyxZQUFZLENBQUM7U0FDekI7UUFDRCxPQUFPLENBQUMsQ0FBQztJQUNYLENBQUM7Q0FDRixDQUFBO0FBM0RTO0lBRFAsSUFBQSxhQUFNLEdBQUU7OEJBQ0csc0JBQWlCO2lEQUFDO2dDQUZuQixxQkFBcUI7SUFGakMsSUFBQSxjQUFPLEdBQUU7SUFDVCxJQUFBLGdCQUFTLEdBQUU7R0FDQyxxQkFBcUIsQ0E2RGpDIn0=