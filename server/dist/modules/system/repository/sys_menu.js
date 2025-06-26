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
exports.SysMenuRepository = void 0;
const core_1 = require("@midwayjs/core");
const menu_1 = require("../../../framework/constants/menu");
const db_1 = require("../../../framework/datasource/db/db");
const sys_menu_1 = require("../model/sys_menu");
/**菜单表 数据层处理 */
let SysMenuRepository = exports.SysMenuRepository = class SysMenuRepository {
    db;
    /**
     * 查询集合
     *
     * @param sysMenu 信息
     * @param userId 用户ID 为0是系统管理员
     * @return 列表
     */
    async select(sysMenu, userId) {
        const tx = this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_menu_1.SysMenu, 's')
            .andWhere("s.del_flag = '0'");
        // 构建查询条件
        if (sysMenu.menuName) {
            tx.andWhere('s.menu_name like :menuName', {
                menuName: sysMenu.menuName + '%',
            });
        }
        if (sysMenu.visibleFlag) {
            tx.andWhere('s.visible_flag = :visibleFlag', {
                visibleFlag: sysMenu.visibleFlag,
            });
        }
        if (sysMenu.statusFlag) {
            tx.andWhere('s.status_flag = :statusFlag', {
                statusFlag: sysMenu.statusFlag,
            });
        }
        // 个人菜单
        if (userId > 0) {
            tx.andWhere(`s.menu_id in (
        select menu_id from sys_role_menu where role_id in (
        select role_id from sys_user_role where user_id = :userId 
        ))`, { userId });
        }
        // 查询数据
        return await tx
            .addOrderBy('s.parent_id', 'ASC')
            .addOrderBy('s.menu_sort', 'ASC')
            .getMany();
    }
    /**
     * 通过ID查询
     *
     * @param menuIds ID数组
     * @return 信息
     */
    async selectByIds(menuIds) {
        if (menuIds.length <= 0) {
            return [];
        }
        // 查询数据
        const rows = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_menu_1.SysMenu, 's')
            .andWhere("s.menu_id in (:menuIds) and s.del_flag = '0'", { menuIds })
            .getMany();
        if (rows.length > 0) {
            return rows;
        }
        return [];
    }
    /**
     * 新增
     *
     * @param sysMenu 信息
     * @return ID
     */
    async insert(sysMenu) {
        sysMenu.delFlag = '0';
        if (sysMenu.menuId > 0) {
            return 0;
        }
        if (!sysMenu.icon) {
            sysMenu.icon = '#';
        }
        if (sysMenu.createBy) {
            const ms = Date.now().valueOf();
            sysMenu.updateBy = sysMenu.createBy;
            sysMenu.updateTime = ms;
            sysMenu.createTime = ms;
        }
        // 根据菜单类型重置参数
        if (sysMenu.menuType === menu_1.MENU_TYPE_AUTH) {
            sysMenu.component = '';
            sysMenu.frameFlag = '1';
            sysMenu.cacheFlag = '1';
            sysMenu.visibleFlag = '1';
            sysMenu.menuPath = '';
            sysMenu.icon = '#';
        }
        else if (sysMenu.menuType === menu_1.MENU_TYPE_DIR) {
            sysMenu.component = '';
            sysMenu.frameFlag = '1';
            sysMenu.cacheFlag = '1';
            sysMenu.perms = '';
        }
        // 执行插入
        const tx = await this.db
            .queryBuilder('')
            .insert()
            .into(sys_menu_1.SysMenu)
            .values(sysMenu)
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
     * @param sysDictType 信息
     * @return 影响记录数
     */
    async update(sysMenu) {
        if (sysMenu.menuId <= 0) {
            return 0;
        }
        if (!sysMenu.icon) {
            sysMenu.icon = '#';
        }
        if (sysMenu.updateBy) {
            sysMenu.updateTime = Date.now().valueOf();
        }
        // 根据菜单类型重置参数
        if (sysMenu.menuType === menu_1.MENU_TYPE_AUTH) {
            sysMenu.component = '';
            sysMenu.frameFlag = '1';
            sysMenu.cacheFlag = '1';
            sysMenu.visibleFlag = '1';
            sysMenu.menuPath = '';
            sysMenu.icon = '#';
        }
        else if (sysMenu.menuType === menu_1.MENU_TYPE_DIR) {
            sysMenu.component = '';
            sysMenu.frameFlag = '1';
            sysMenu.cacheFlag = '1';
            sysMenu.perms = '';
        }
        const data = Object.assign({}, sysMenu);
        delete data.menuId;
        delete data.delFlag;
        delete data.createBy;
        delete data.createTime;
        // 执行更新
        const tx = await this.db
            .queryBuilder('')
            .createQueryBuilder()
            .update(sys_menu_1.SysMenu)
            .set(data)
            .andWhere('menu_id = :menuId', { menuId: sysMenu.menuId })
            .execute();
        return tx.affected;
    }
    /**
     * 删除信息
     *
     * @param menuId ID
     * @return 影响记录数
     */
    async deleteById(menuId) {
        if (menuId <= 0)
            return 0;
        // 执行更新删除标记
        const tx = await this.db
            .queryBuilder('')
            .update(sys_menu_1.SysMenu)
            .set({ delFlag: '1' })
            .andWhere('menu_id = :menuId', { menuId })
            .execute();
        return tx.affected;
    }
    /**
     * 检查信息是否唯一 返回数据ID
     * @param sysMenu 信息
     * @returns
     */
    async checkUnique(sysMenu) {
        const tx = this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_menu_1.SysMenu, 's')
            .andWhere("s.del_flag = '0'");
        // 查询条件拼接
        if (sysMenu.parentId) {
            tx.andWhere('s.parent_id = :parentId', {
                parentId: sysMenu.parentId,
            });
        }
        if (sysMenu.menuName) {
            tx.andWhere('s.menu_name = :menuName', {
                menuName: sysMenu.menuName,
            });
        }
        if (sysMenu.menuPath) {
            tx.andWhere('s.menu_path = :menuPath', {
                menuPath: sysMenu.menuPath,
            });
        }
        // 查询数据
        const item = await tx.getOne();
        if (!item) {
            return 0;
        }
        return item.menuId;
    }
    /**
     * 菜单下同状态存在子节点数量
     *
     * @param menuId ID
     * @param statusFlag 状态标记
     * @return 数量
     */
    async existChildrenByMenuIdAndStatus(menuId, statusFlag) {
        if (menuId <= 0) {
            return 0;
        }
        // 查询数据
        const tx = this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_menu_1.SysMenu, 's')
            .andWhere("s.del_flag = '0'");
        // 构建查询条件
        tx.andWhere('s.parent_id = :menuId', { menuId });
        if (statusFlag) {
            tx.andWhere('s.status_flag = :statusFlag', { statusFlag: statusFlag });
            tx.andWhere('s.menu_type in (:menuType)', {
                menuType: [menu_1.MENU_TYPE_DIR, menu_1.MENU_TYPE_MENU],
            });
        }
        return await tx.getCount();
    }
    /**
     * 根据用户ID查询权限标识
     *
     * @param userId 用户ID
     * @return 标识数组
     */
    async selectPermsByUserId(userId) {
        if (userId <= 0) {
            return [];
        }
        const tx = this.db
            .queryBuilder('')
            .createQueryBuilder()
            .distinct(true)
            .select('m')
            .from(sys_menu_1.SysMenu, 'm')
            .leftJoin('sys_role_menu', 'rm', 'rm.menu_id = m.menu_id')
            .leftJoin('sys_user_role', 'ur', 'rm.role_id = ur.role_id')
            .leftJoin('sys_role', 'r', "r.role_id = ur.role_id and r.status_flag = '1'")
            .andWhere("m.status_flag = '1' AND m.perms != '' AND ur.user_id = :userId", {
            userId,
        });
        const rows = await tx.getMany();
        return rows.map(v => v.perms);
    }
    /**
     * 根据角色ID查询菜单树信息
     *
     * @param roleId 角色ID
     * @param menuCheckStrictly 是否关联显示
     * @return 数量
     */
    async selectByRoleId(roleId, menuCheckStrictly) {
        if (roleId <= 0) {
            return [];
        }
        const tx = this.db
            .queryBuilder('')
            .createQueryBuilder()
            .distinct(true)
            .select('s')
            .from(sys_menu_1.SysMenu, 's')
            .andWhere("s.del_flag = '0'")
            .andWhere('s.menu_id in (select menu_id from sys_role_menu where role_id = :roleId)', { roleId });
        // 父子互相关联显示，取所有子节点
        if (menuCheckStrictly) {
            tx.andWhere(`s.menu_id not in (
            select m.parent_id from sys_menu m 
            inner join sys_role_menu rm on m.menu_id = rm.menu_id 
            and rm.role_id = :roleId
          )`, { roleId });
        }
        // 查询数据
        const rows = await tx.getMany();
        return rows.map(v => v.menuId);
    }
    /**
     * 根据用户ID查询菜单
     *
     * @param userId 0为管理员查询全部菜单，其他为用户ID查询权限
     * @return 数量
     */
    async selectTreeByUserId(userId) {
        if (userId < 0) {
            return [];
        }
        const tx = this.db
            .queryBuilder('')
            .createQueryBuilder()
            .select('s')
            .from(sys_menu_1.SysMenu, 's')
            .andWhere("s.del_flag = '0'");
        // 管理员全部菜单
        if (userId === 0) {
            tx.andWhere("s.menu_type in (:menuType) and s.status_flag = '1'", {
                menuType: [menu_1.MENU_TYPE_DIR, menu_1.MENU_TYPE_MENU],
            });
        }
        else {
            // 用户ID权限
            tx.andWhere(`s.menu_type in (:menuType) and s.status_flag = '1' 
        and menu_id in (
        select menu_id from sys_role_menu where role_id in (
        select role_id from sys_user_role where user_id = :userId
        ))`, { menuType: [menu_1.MENU_TYPE_DIR, menu_1.MENU_TYPE_MENU], userId });
        }
        // 查询数据
        return await tx
            .addOrderBy('s.parent_id', 'ASC')
            .addOrderBy('s.menu_sort', 'ASC')
            .getMany();
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", db_1.DynamicDataSource)
], SysMenuRepository.prototype, "db", void 0);
exports.SysMenuRepository = SysMenuRepository = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], SysMenuRepository);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX21lbnUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9zeXN0ZW0vcmVwb3NpdG9yeS9zeXNfbWVudS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBNEQ7QUFHNUQsNERBSTJDO0FBQzNDLDREQUF3RTtBQUN4RSxnREFBNEM7QUFFNUMsZUFBZTtBQUdSLElBQU0saUJBQWlCLCtCQUF2QixNQUFNLGlCQUFpQjtJQUVwQixFQUFFLENBQW9CO0lBRTlCOzs7Ozs7T0FNRztJQUNJLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBZ0IsRUFBRSxNQUFjO1FBQ2xELE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFO2FBQ2YsWUFBWSxDQUFDLEVBQUUsQ0FBQzthQUNoQixrQkFBa0IsRUFBRTthQUNwQixNQUFNLENBQUMsR0FBRyxDQUFDO2FBQ1gsSUFBSSxDQUFDLGtCQUFPLEVBQUUsR0FBRyxDQUFDO2FBQ2xCLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ2hDLFNBQVM7UUFDVCxJQUFJLE9BQU8sQ0FBQyxRQUFRLEVBQUU7WUFDcEIsRUFBRSxDQUFDLFFBQVEsQ0FBQyw0QkFBNEIsRUFBRTtnQkFDeEMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEdBQUcsR0FBRzthQUNqQyxDQUFDLENBQUM7U0FDSjtRQUNELElBQUksT0FBTyxDQUFDLFdBQVcsRUFBRTtZQUN2QixFQUFFLENBQUMsUUFBUSxDQUFDLCtCQUErQixFQUFFO2dCQUMzQyxXQUFXLEVBQUUsT0FBTyxDQUFDLFdBQVc7YUFDakMsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxJQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUU7WUFDdEIsRUFBRSxDQUFDLFFBQVEsQ0FBQyw2QkFBNkIsRUFBRTtnQkFDekMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxVQUFVO2FBQy9CLENBQUMsQ0FBQztTQUNKO1FBQ0QsT0FBTztRQUNQLElB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