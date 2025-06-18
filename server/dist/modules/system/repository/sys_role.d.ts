import { SysRole } from '../model/sys_role';
/**角色表 数据层处理 */
export declare class SysRoleRepository {
    private db;
    /**
     * 分页查询集合
     *
     * @param query 参数
     * @returns 集合
     */
    selectByPage(query: Record<string, string>): Promise<[SysRole[], number]>;
    /**
     * 查询集合
     *
     * @param sysRole 信息
     * @return 列表
     */
    select(sysRole: SysRole): Promise<SysRole[]>;
    /**
     * 通过ID查询
     *
     * @param roleIds ID数组
     * @return 信息
     */
    selectByIds(roleIds: number[]): Promise<SysRole[]>;
    /**
     * 新增
     *
     * @param sysConfig 信息
     * @return ID
     */
    insert(sysRole: SysRole): Promise<number>;
    /**
     * 更新
     *
     * @param sysRole 信息
     * @return 影响记录数
     */
    update(sysRole: SysRole): Promise<number>;
    /**
     * 批量删除
     *
     * @param roleIds ID数组
     * @return 影响记录数
     */
    deleteByIds(roleIds: number[]): Promise<number>;
    /**
     * 检查信息是否唯一 返回数据ID
     * @param sysRole 信息
     * @returns
     */
    checkUnique(sysRole: SysRole): Promise<number>;
    /**
     * 根据用户ID获取角色信息
     * @param userId 用户ID
     * @returns 角色数组
     */
    selectByUserId(userId: number): Promise<SysRole[]>;
}
