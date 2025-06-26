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
exports.SysRoleMenuRepository = void 0;
const core_1 = require("@midwayjs/core");
const db_1 = require("../../../framework/datasource/db/db");
const sys_role_menu_1 = require("../model/sys_role_menu");
/**角色与菜单关联表 数据层处理 */
let SysRoleMenuRepository = exports.SysRoleMenuRepository = class SysRoleMenuRepository {
    db;
    /**
     * 存在角色使用数量By菜单
     * @param menuId 菜单ID
     * @returns 数量
     */
    async existRoleByMenuId(menuId) {
        if (menuId <= 0) {
            return 0;
        }
        const count = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_role_menu_1.SysRoleMenu, 's')
            .andWhere('s.menu_id = :menuId', { menuId })
            .getCount();
        return count;
    }
    /**
     * 批量删除关联By角色
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
            .from(sys_role_menu_1.SysRoleMenu)
            .andWhere('role_id in (:roleIds)', { roleIds })
            .execute();
        return tx.affected;
    }
    /**
     * 批量删除关联By菜单
     *
     * @param menuIds ID数组
     * @return 影响记录数
     */
    async deleteByMenuIds(menuIds) {
        if (menuIds.length <= 0)
            return 0;
        // 执行删除
        const tx = await this.db
            .queryBuilder('')
            .delete()
            .from(sys_role_menu_1.SysRoleMenu)
            .andWhere('menu_id in (:menuIds)', { menuIds })
            .execute();
        return tx.affected;
    }
    /**
     * 批量新增信息
     *
     * @param userRoles 信息
     * @return 影响记录数
     */
    async batchInsert(sysRoleMenus) {
        if (sysRoleMenus.length <= 0)
            return 0;
        // 执行插入
        const tx = await this.db
            .queryBuilder('')
            .insert()
            .into(sys_role_menu_1.SysRoleMenu)
            .values(sysRoleMenus)
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
], SysRoleMenuRepository.prototype, "db", void 0);
exports.SysRoleMenuRepository = SysRoleMenuRepository = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], SysRoleMenuRepository);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX3JvbGVfbWVudS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3N5c3RlbS9yZXBvc2l0b3J5L3N5c19yb2xlX21lbnUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEseUNBQTREO0FBRzVELDREQUF3RTtBQUN4RSwwREFBcUQ7QUFFckQsb0JBQW9CO0FBR2IsSUFBTSxxQkFBcUIsbUNBQTNCLE1BQU0scUJBQXFCO0lBRXhCLEVBQUUsQ0FBb0I7SUFFOUI7Ozs7T0FJRztJQUNJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxNQUFjO1FBQzNDLElBQUksTUFBTSxJQUFJLENBQUMsRUFBRTtZQUNmLE9BQU8sQ0FBQyxDQUFDO1NBQ1Y7UUFDRCxNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxFQUFFO2FBQ3hCLFlBQVksQ0FBQyxFQUFFLENBQUM7YUFDaEIsa0JBQWtCLEVBQUU7YUFDcEIsTUFBTSxDQUFDLEdBQUcsQ0FBQzthQUNYLElBQUksQ0FBQywyQkFBVyxFQUFFLEdBQUcsQ0FBQzthQUN0QixRQUFRLENBQUMscUJBQXFCLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQzthQUMzQyxRQUFRLEVBQUUsQ0FBQztRQUNkLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksS0FBSyxDQUFDLGVBQWUsQ0FBQyxPQUFpQjtRQUM1QyxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQztZQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2xDLE9BQU87UUFDUCxNQUFNLEVBQUUsR0FBaUIsTUFBTSxJQUFJLENBQUMsRUFBRTthQUNuQyxZQUFZLENBQUMsRUFBRSxDQUFDO2FBQ2hCLE1BQU0sRUFBRTthQUNSLElBQUksQ0FBQywyQkFBVyxDQUFDO2FBQ2pCLFFBQVEsQ0FBQyx1QkFBdUIsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDO2FBQzlDLE9BQU8sRUFBRSxDQUFDO1FBQ2IsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDO0lBQ3JCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLEtBQUssQ0FBQyxlQUFlLENBQUMsT0FBaUI7UUFDNUMsSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUM7WUFBRSxPQUFPLENBQUMsQ0FBQztRQUNsQyxPQUFPO1FBQ1AsTUFBTSxFQUFFLEdBQWlCLE1BQU0sSUFBSSxDQUFDLEVBQUU7YUFDbkMsWUFBWSxDQUFDLEVBQUUsQ0FBQzthQUNoQixNQUFNLEVBQUU7YUFDUixJQUFJLENBQUMsMkJBQVcsQ0FBQzthQUNqQixRQUFRLENBQUMsdUJBQXVCLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQzthQUM5QyxPQUFPLEVBQUUsQ0FBQztRQUNiLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQztJQUNyQixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxLQUFLLENBQUMsV0FBVyxDQUFDLFlBQTJCO1FBQ2xELElBQUksWUFBWSxDQUFDLE1BQU0sSUFBSSxDQUFDO1lBQUUsT0FBTyxDQUFDLENBQUM7UUFDdkMsT0FBTztRQUNQLE1BQU0sRUFBRSxHQUFpQixNQUFNLElBQUksQ0FBQyxFQUFFO2FBQ25DLFlBQVksQ0FBQyxFQUFFLENBQUM7YUFDaEIsTUFBTSxFQUFFO2FBQ1IsSUFBSSxDQUFDLDJCQUFXLENBQUM7YUFDakIsTUFBTSxDQUFDLFlBQVksQ0FBQzthQUNwQixPQUFPLEVBQUUsQ0FBQztRQUNiLE1BQU0sR0FBRyxHQUFvQixFQUFFLENBQUMsR0FBRyxDQUFDO1FBQ3BDLElBQUksR0FBRyxDQUFDLFlBQVksR0FBRyxDQUFDLEVBQUU7WUFDeEIsT0FBTyxHQUFHLENBQUMsWUFBWSxDQUFDO1NBQ3pCO1FBQ0QsT0FBTyxDQUFDLENBQUM7SUFDWCxDQUFDO0NBQ0YsQ0FBQTtBQTlFUztJQURQLElBQUEsYUFBTSxHQUFFOzhCQUNHLHNCQUFpQjtpREFBQztnQ0FGbkIscUJBQXFCO0lBRmpDLElBQUEsY0FBTyxHQUFFO0lBQ1QsSUFBQSxnQkFBUyxHQUFFO0dBQ0MscUJBQXFCLENBZ0ZqQyJ9