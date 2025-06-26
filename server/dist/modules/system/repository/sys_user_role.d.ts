import { SysUserRole } from '../model/sys_user_role';
/**用户与角色关联表 数据层处理 */
export declare class SysUserRoleRepository {
    private db;
    /**
     * 存在用户使用数量
     * @param roleId 角色ID
     * @returns 数量
     */
    existUserByRoleId(roleId: number): Promise<number>;
    /**
     * 批量删除关联By用户
     *
     * @param userIds ID数组
     * @return 影响记录数
     */
    deleteByUserIds(userIds: number[]): Promise<number>;
    /**
     * 批量删除关联By角色
     *
     * @param roleId 角色ID
     * @param userIds ID数组
     * @return 影响记录数
     */
    deleteByRoleId(roleId: number, userIds: number[]): Promise<number>;
    /**
     * 批量新增信息
     *
     * @param sysUserRoles 信息
     * @return 影响记录数
     */
    batchInsert(sysUserRoles: SysUserRole[]): Promise<number>;
}
