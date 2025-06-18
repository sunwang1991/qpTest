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
exports.SysRoleService = void 0;
const core_1 = require("@midwayjs/core");
const role_data_scope_1 = require("../../../framework/constants/role_data_scope");
const file_1 = require("../../../framework/utils/file/file");
const system_1 = require("../../../framework/constants/system");
const sys_user_role_1 = require("../repository/sys_user_role");
const sys_role_dept_1 = require("../repository/sys_role_dept");
const sys_role_menu_1 = require("../repository/sys_role_menu");
const sys_role_1 = require("../repository/sys_role");
const sys_user_role_2 = require("../model/sys_user_role");
const sys_role_menu_2 = require("../model/sys_role_menu");
const sys_role_dept_2 = require("../model/sys_role_dept");
const sys_role_2 = require("../model/sys_role");
/**角色 服务层处理 */
let SysRoleService = exports.SysRoleService = class SysRoleService {
    /**角色服务 */
    sysRoleRepository;
    /**用户与角色关联服务 */
    sysUserRoleRepository;
    /**角色与部门关联服务 */
    sysRoleDeptRepository;
    /**角色与菜单关联服务 */
    sysRoleMenuRepository;
    /**文件服务 */
    fileUtil;
    /**
     * 分页查询列表数据
     * @param query 参数
     * @returns [rows, total]
     */
    async findByPage(query) {
        return await this.sysRoleRepository.selectByPage(query);
    }
    /**
     * 查询列表数据
     * @param sysRole 信息
     * @returns []
     */
    async find(sysRole) {
        const rows = await this.sysRoleRepository.select(sysRole);
        const arr = [];
        for (const v of rows) {
            if (v.roleId === system_1.SYS_ROLE_SYSTEM_ID) {
                continue;
            }
            arr.push(v);
        }
        return arr;
    }
    /**
     * 通过ID查询信息
     * @param roleId ID
     * @returns 结果
     */
    async findById(roleId) {
        if (roleId < 0) {
            return new sys_role_2.SysRole();
        }
        const rows = await this.sysRoleRepository.selectByIds([roleId]);
        if (rows.length > 0) {
            return rows[0];
        }
        return new sys_role_2.SysRole();
    }
    /**
     * 新增信息
     * @param sysRole 信息
     * @returns ID
     */
    async insert(sysRole) {
        const insertId = await this.sysRoleRepository.insert(sysRole);
        if (insertId > 0 &&
            Array.isArray(sysRole.menuIds) &&
            sysRole.menuIds.length > 0) {
            await this.insertRoleMenu(insertId, sysRole.menuIds);
        }
        return insertId;
    }
    /**
     * 修改信息
     * @param sysRole 信息
     * @returns 影响记录数
     */
    async update(sysRole) {
        const rows = await this.sysRoleRepository.update(sysRole);
        if (rows > 0 &&
            Array.isArray(sysRole.menuIds) &&
            sysRole.menuIds.length >= 0) {
            // 删除角色与菜单关联
            await this.sysRoleMenuRepository.deleteByRoleIds([sysRole.roleId]);
            await this.insertRoleMenu(sysRole.roleId, sysRole.menuIds);
        }
        return rows;
    }
    /**
     * 新增角色菜单信息
     * @param roleId 角色ID
     * @param menuIds 菜单ID数组
     * @returns 影响记录数
     */
    async insertRoleMenu(roleId, menuIds) {
        if (roleId <= 0 || menuIds.length <= 0) {
            return 0;
        }
        const sysRoleMenus = [];
        for (const menuId of menuIds) {
            if (menuId <= 0) {
                continue;
            }
            const sysRoleMenu = new sys_role_menu_2.SysRoleMenu();
            sysRoleMenu.roleId = roleId;
            sysRoleMenu.menuId = menuId;
            sysRoleMenus.push(sysRoleMenu);
        }
        return await this.sysRoleMenuRepository.batchInsert(sysRoleMenus);
    }
    /**
     * 批量删除信息
     * @param configIds ID数组
     * @returns [影响记录数, 错误信息]
     */
    async deleteByIds(roleIds) {
        // 检查是否存在
        const roles = await this.sysRoleRepository.selectByIds(roleIds);
        if (roles.length <= 0) {
            return [0, '没有权限访问角色数据！'];
        }
        for (const role of roles) {
            // 检查是否为内置参数
            if (role.delFlag === '1') {
                return [0, `ID:${role.roleId} 角色信息已经删除！`];
            }
            // 检查分配用户
            const useCount = await this.sysUserRoleRepository.existUserByRoleId(role.roleId);
            if (useCount > 0) {
                return [0, `【${role.roleName}】已分配给用户,不能删除`];
            }
        }
        if (roles.length === roleIds.length) {
            this.sysRoleMenuRepository.deleteByRoleIds(roleIds); // 删除角色与菜单关联
            this.sysRoleDeptRepository.deleteByRoleIds(roleIds); // 删除角色与部门关联
            const rows = await this.sysRoleRepository.deleteByIds(roleIds);
            return [rows, ''];
        }
        return [0, '删除角色信息失败！'];
    }
    /**
     * 根据用户ID获取角色选择框列表
     * @param userId 用户ID
     * @returns 结果
     */
    async findByUserId(userId) {
        return this.sysRoleRepository.selectByUserId(userId);
    }
    /**
     * 检查角色名称是否唯一
     * @param dictName 字典名称
     * @param dictId 字典ID
     * @returns 结果
     */
    async checkUniqueByName(roleName, roleId) {
        const sysRole = new sys_role_2.SysRole();
        sysRole.roleName = roleName;
        const uniqueId = await this.sysRoleRepository.checkUnique(sysRole);
        if (uniqueId === roleId) {
            return true;
        }
        return uniqueId === 0;
    }
    /**
     * 检查角色权限是否唯一
     * @param roleKey 角色键值
     * @param dictId 字典ID
     * @returns 结果
     */
    async checkUniqueByKey(roleKey, roleId) {
        const sysRole = new sys_role_2.SysRole();
        sysRole.roleKey = roleKey;
        const uniqueId = await this.sysRoleRepository.checkUnique(sysRole);
        if (uniqueId === roleId) {
            return true;
        }
        return uniqueId === 0;
    }
    /**
     * 修改信息同时更新数据权限信息
     * @param sysRole 角色信息
     * @returns 结果
     */
    async updateAndDataScope(sysRole) {
        // 修改角色信息
        const rows = await this.sysRoleRepository.update(sysRole);
        if (rows > 0) {
            // 删除角色与部门关联
            await this.sysRoleDeptRepository.deleteByRoleIds([sysRole.roleId]);
            // 新增角色和部门信息
            if (sysRole.dataScope === role_data_scope_1.ROLE_SCOPE_CUSTOM &&
                sysRole.deptIds.length > 0) {
                const arr = [];
                for (const deptId of sysRole.deptIds) {
                    if (deptId <= 0) {
                        continue;
                    }
                    const sysRoleDept = new sys_role_dept_2.SysRoleDept();
                    sysRoleDept.roleId = sysRole.roleId;
                    sysRoleDept.deptId = deptId;
                    arr.push(sysRoleDept);
                }
                await this.sysRoleDeptRepository.batchInsert(arr);
            }
        }
        return rows;
    }
    /**
     * 批量新增授权用户角色
     * @param roleId 角色ID
     * @param userIds 用户ID数组
     * @returns 结果
     */
    async insertAuthUsers(roleId, userIds) {
        if (roleId <= 0 || userIds.length <= 0) {
            return 0;
        }
        const sysUserRoles = [];
        for (const userId of userIds) {
            if (userId <= 0) {
                continue;
            }
            const sysUserRole = new sys_user_role_2.SysUserRole();
            sysUserRole.userId = userId;
            sysUserRole.roleId = roleId;
            sysUserRoles.push(sysUserRole);
        }
        return await this.sysUserRoleRepository.batchInsert(sysUserRoles);
    }
    /**
     * 批量取消授权用户角色
     * @param roleId 角色ID
     * @param userIds 用户ID数组
     * @returns 结果
     */
    async deleteAuthUsers(roleId, userIds) {
        return await this.sysUserRoleRepository.deleteByRoleId(roleId, userIds);
    }
    /**
     * 导出数据表格
     * @param rows 信息
     * @param fileName 文件名
     * @returns 结果
     */
    async exportData(rows, fileName) {
        // 导出数据组装
        const arr = [];
        for (const row of rows) {
            // 数据范围
            let dataScope = role_data_scope_1.ROLE_SCOPE_DATA[row.dataScope];
            if (!dataScope) {
                dataScope = '';
            }
            // 角色状态
            let statusValue = '停用';
            if (row.statusFlag === '1') {
                statusValue = '正常';
            }
            const data = {
                角色序号: row.roleId,
                角色名称: row.roleName,
                角色键值: row.roleKey,
                角色排序: row.dataScope,
                数据范围: dataScope,
                角色状态: statusValue,
            };
            arr.push(data);
        }
        return await this.fileUtil.excelWriteRecord(arr, fileName);
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_role_1.SysRoleRepository)
], SysRoleService.prototype, "sysRoleRepository", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_user_role_1.SysUserRoleRepository)
], SysRoleService.prototype, "sysUserRoleRepository", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_role_dept_1.SysRoleDeptRepository)
], SysRoleService.prototype, "sysRoleDeptRepository", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_role_menu_1.SysRoleMenuRepository)
], SysRoleService.prototype, "sysRoleMenuRepository", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", file_1.FileUtil)
], SysRoleService.prototype, "fileUtil", void 0);
exports.SysRoleService = SysRoleService = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], SysRoleService);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX3JvbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9zeXN0ZW0vc2VydmljZS9zeXNfcm9sZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBNEQ7QUFFNUQsa0ZBR3NEO0FBQ3RELDZEQUE4RDtBQUM5RCxnRUFBeUU7QUFDekUsK0RBQW9FO0FBQ3BFLCtEQUFvRTtBQUNwRSwrREFBb0U7QUFDcEUscURBQTJEO0FBQzNELDBEQUFxRDtBQUNyRCwwREFBcUQ7QUFDckQsMERBQXFEO0FBQ3JELGdEQUE0QztBQUU1QyxjQUFjO0FBR1AsSUFBTSxjQUFjLDRCQUFwQixNQUFNLGNBQWM7SUFDekIsVUFBVTtJQUVGLGlCQUFpQixDQUFvQjtJQUU3QyxlQUFlO0lBRVAscUJBQXFCLENBQXdCO0lBRXJELGVBQWU7SUFFUCxxQkFBcUIsQ0FBd0I7SUFFckQsZUFBZTtJQUVQLHFCQUFxQixDQUF3QjtJQUVyRCxVQUFVO0lBRUYsUUFBUSxDQUFXO0lBRTNCOzs7O09BSUc7SUFDSSxLQUFLLENBQUMsVUFBVSxDQUNyQixLQUE2QjtRQUU3QixPQUFPLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBZ0I7UUFDaEMsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzFELE1BQU0sR0FBRyxHQUFjLEVBQUUsQ0FBQztRQUMxQixLQUFLLE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRTtZQUNwQixJQUFJLENBQUMsQ0FBQyxNQUFNLEtBQUssMkJBQWtCLEVBQUU7Z0JBQ25DLFNBQVM7YUFDVjtZQUNELEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDYjtR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