import { SysRoleMenu } from '../model/sys_role_menu';
/**角色与菜单关联表 数据层处理 */
export declare class SysRoleMenuRepository {
    private db;
    /**
     * 存在角色使用数量By菜单
     * @param menuId 菜单ID
     * @returns 数量
     */
    existRoleByMenuId(menuId: number): Promise<number>;
    /**
     * 批量删除关联By角色
     *
     * @param roleIds ID数组
     * @return 影响记录数
     */
    deleteByRoleIds(roleIds: number[]): Promise<number>;
    /**
     * 批量删除关联By菜单
     *
     * @param menuIds ID数组
     * @return 影响记录数
     */
    deleteByMenuIds(menuIds: number[]): Promise<number>;
    /**
     * 批量新增信息
     *
     * @param userRoles 信息
     * @return 影响记录数
     */
    batchInsert(sysRoleMenus: SysRoleMenu[]): Promise<number>;
}
