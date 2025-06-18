import { SysRoleDept } from '../model/sys_role_dept';
/**角色与部门关联表 数据层处理 */
export declare class SysRoleDeptRepository {
    private db;
    /**
     * 批量删除信息By角色
     *
     * @param roleIds ID数组
     * @return 影响记录数
     */
    deleteByRoleIds(roleIds: number[]): Promise<number>;
    /**
     * 批量删除信息By部门
     *
     * @param deptIds ID数组
     * @return 影响记录数
     */
    deleteByDeptIds(deptIds: number[]): Promise<number>;
    /**
     * 批量新增信息
     *
     * @param sysRoleDepts 信息
     * @return 影响记录数
     */
    batchInsert(sysRoleDepts: SysRoleDept[]): Promise<number>;
}
