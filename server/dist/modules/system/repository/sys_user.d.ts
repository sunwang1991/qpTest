import { SysUser } from '../model/sys_user';
/**用户表 数据层处理 */
export declare class SysUserRepository {
    private db;
    /**
     * 分页查询集合
     *
     * @param query 参数
     * @param dataScopeSQL 角色数据范围过滤SQL字符串
     * @returns 集合
     */
    selectByPage(query: Record<string, string>, dataScopeSQL: string): Promise<[SysUser[], number]>;
    /**
     * 查询集合
     *
     * @param sysUser 信息
     * @return 列表
     */
    select(sysUser: SysUser): Promise<SysUser[]>;
    /**
     * 通过ID查询
     *
     * @param userIds ID数组
     * @return 信息
     */
    selectByIds(userIds: number[]): Promise<SysUser[]>;
    /**
     * 新增
     *
     * @param sysUser 信息
     * @return ID
     */
    insert(sysUser: SysUser): Promise<number>;
    /**
     * 更新
     *
     * @param sysUser 信息
     * @return 影响记录数
     */
    update(sysUser: SysUser): Promise<number>;
    /**
     * 批量删除
     *
     * @param userIds ID数组
     * @return 影响记录数
     */
    deleteByIds(userIds: number[]): Promise<number>;
    /**
     * 检查信息是否唯一 返回数据ID
     * @param sysUser 信息
     * @returns
     */
    checkUnique(sysUser: SysUser): Promise<number>;
    /**
     * 通过登录账号查询信息
     * @param userName 用户账号
     * @returns
     */
    selectByUserName(userName: string): Promise<SysUser>;
    /**
     * 分页查询集合By分配用户角色
     *
     * @param query 参数
     * @param dataScopeSQL 角色数据范围过滤SQL字符串
     * @returns 集合
     */
    selectAuthUsersByPage(query: Record<string, string>, dataScopeSQL: string): Promise<[SysUser[], number]>;
}
