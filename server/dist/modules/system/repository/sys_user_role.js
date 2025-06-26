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
exports.SysUserRoleRepository = void 0;
const core_1 = require("@midwayjs/core");
const db_1 = require("../../../framework/datasource/db/db");
const sys_user_role_1 = require("../model/sys_user_role");
/**用户与角色关联表 数据层处理 */
let SysUserRoleRepository = exports.SysUserRoleRepository = class SysUserRoleRepository {
    db;
    /**
     * 存在用户使用数量
     * @param roleId 角色ID
     * @returns 数量
     */
    async existUserByRoleId(roleId) {
        if (roleId <= 0) {
            return 0;
        }
        const count = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_user_role_1.SysUserRole, 's')
            .andWhere('s.role_id = :roleId', { roleId })
            .getCount();
        return count;
    }
    /**
     * 批量删除关联By用户
     *
     * @param userIds ID数组
     * @return 影响记录数
     */
    async deleteByUserIds(userIds) {
        if (userIds.length <= 0)
            return 0;
        // 执行删除
        const tx = await this.db
            .queryBuilder('')
            .delete()
            .from(sys_user_role_1.SysUserRole)
            .andWhere('user_id in (:userIds)', { userIds })
            .execute();
        return tx.affected;
    }
    /**
     * 批量删除关联By角色
     *
     * @param roleId 角色ID
     * @param userIds ID数组
     * @return 影响记录数
     */
    async deleteByRoleId(roleId, userIds) {
        if (roleId <= 0 || userIds.length <= 0)
            return 0;
        // 执行删除
        const tx = await this.db
            .queryBuilder('')
            .delete()
            .from(sys_user_role_1.SysUserRole)
            .andWhere('role_id = :roleId', { roleId })
            .andWhere('user_id in (:userIds)', { userIds })
            .execute();
        return tx.affected;
    }
    /**
     * 批量新增信息
     *
     * @param sysUserRoles 信息
     * @return 影响记录数
     */
    async batchInsert(sysUserRoles) {
        if (sysUserRoles.length <= 0)
            return 0;
        // 执行插入
        const tx = await this.db
            .queryBuilder('')
            .insert()
            .into(sys_user_role_1.SysUserRole)
            .values(sysUserRoles)
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
], SysUserRoleRepository.prototype, "db", void 0);
exports.SysUserRoleRepository = SysUserRoleRepository = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], SysUserRoleRepository);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX3VzZXJfcm9sZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3N5c3RlbS9yZXBvc2l0b3J5L3N5c191c2VyX3JvbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEseUNBQTREO0FBRzVELDREQUF3RTtBQUN4RSwwREFBcUQ7QUFFckQsb0JBQW9CO0FBR2IsSUFBTSxxQkFBcUIsbUNBQTNCLE1BQU0scUJBQXFCO0lBRXhCLEVBQUUsQ0FBb0I7SUFFOUI7Ozs7T0FJRztJQUNJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxNQUFjO1FBQzNDLElBQUksTUFBTSxJQUFJLENBQUMsRUFBRTtZQUNmLE9BQU8sQ0FBQyxDQUFDO1NBQ1Y7UUFDRCxNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxFQUFFO2FBQ3hCLFlBQVksQ0FBQyxFQUFFLENBQUM7YUFDaEIsa0JBQWtCLEVBQUU7YUFDcEIsTUFBTSxDQUFDLEdBQUcsQ0FBQzthQUNYLElBQUksQ0FBQywyQkFBVyxFQUFFLEdBQUcsQ0FBQzthQUN0QixRQUFRLENBQUMscUJBQXFCLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQzthQUMzQyxRQUFRLEVBQUUsQ0FBQztRQUNkLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksS0FBSyxDQUFDLGVBQWUsQ0FBQyxPQUFpQjtRQUM1QyxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQztZQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2xDLE9BQU87UUFDUCxNQUFNLEVBQUUsR0FBaUIsTUFBTSxJQUFJLENBQUMsRUFBRTthQUNuQyxZQUFZLENBQUMsRUFBRSxDQUFDO2FBQ2hCLE1BQU0sRUFBRTthQUNSLElBQUksQ0FBQywyQkFBVyxDQUFDO2FBQ2pCLFFBQVEsQ0FBQyx1QkFBdUIsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDO2FBQzlDLE9BQU8sRUFBRSxDQUFDO1FBQ2IsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDO0lBQ3JCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxLQUFLLENBQUMsY0FBYyxDQUN6QixNQUFjLEVBQ2QsT0FBaUI7UUFFakIsSUFBSSxNQUFNLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQztZQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2pELE9BQU87UUFDUCxNQUFNLEVBQUUsR0FBaUIsTUFBTSxJQUFJLENBQUMsRUFBRTthQUNuQyxZQUFZLENBQUMsRUFBRSxDQUFDO2FBQ2hCLE1BQU0sRUFBRTthQUNSLElBQUksQ0FBQywyQkFBVyxDQUFDO2FBQ2pCLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDO2FBQ3pDLFFBQVEsQ0FBQyx1QkFBdUIsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDO2FBQzlDLE9BQU8sRUFBRSxDQUFDO1FBQ2IsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDO0lBQ3JCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLEtBQUssQ0FBQyxXQUFXLENBQUMsWUFBMkI7UUFDbEQsSUFBSSxZQUFZLENBQUMsTUFBTSxJQUFJLENBQUM7WUFBRSxPQUFPLENBQUMsQ0FBQztRQUN2QyxPQUFPO1FBQ1AsTUFBTSxFQUFFLEdBQWlCLE1BQU0sSUFBSSxDQUFDLEVBQUU7YUFDbkMsWUFBWSxDQUFDLEVBQUUsQ0FBQzthQUNoQixNQUFNLEVBQUU7YUFDUixJQUFJLENBQUMsMkJBQVcsQ0FBQzthQUNqQixNQUFNLENBQUMsWUFBWSxDQUFDO2FBQ3BCLE9BQU8sRUFBRSxDQUFDO1FBQ2IsTUFBTSxHQUFHLEdBQW9CLEVBQUUsQ0FBQyxHQUFHLENBQUM7UUFDcEMsSUFBSSxHQUFHLENBQUMsWUFBWSxHQUFHLENBQUMsRUFBRTtZQUN4QixPQUFPLEdBQUcsQ0FBQyxZQUFZLENBQUM7U0FDekI7UUFDRCxPQUFPLENBQUMsQ0FBQztJQUNYLENBQUM7Q0FDRixDQUFBO0FBbkZTO0lBRFAsSUFBQSxhQUFNLEdBQUU7OEJBQ0csc0JBQWlCO2lEQUFDO2dDQUZuQixxQkFBcUI7SUFGakMsSUFBQSxjQUFPLEdBQUU7SUFDVCxJQUFBLGdCQUFTLEdBQUU7R0FDQyxxQkFBcUIsQ0FxRmpDIn0=