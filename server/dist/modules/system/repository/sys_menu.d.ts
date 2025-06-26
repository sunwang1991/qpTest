import { SysMenu } from '../model/sys_menu';
/**菜单表 数据层处理 */
export declare class SysMenuRepository {
    private db;
    /**
     * 查询集合
     *
     * @param sysMenu 信息
     * @param userId 用户ID 为0是系统管理员
     * @return 列表
     */
    select(sysMenu: SysMenu, userId: number): Promise<SysMenu[]>;
    /**
     * 通过ID查询
     *
     * @param menuIds ID数组
     * @return 信息
     */
    selectByIds(menuIds: number[]): Promise<SysMenu[]>;
    /**
     * 新增
     *
     * @param sysMenu 信息
     * @return ID
     */
    insert(sysMenu: SysMenu): Promise<number>;
    /**
     * 更新
     *
     * @param sysDictType 信息
     * @return 影响记录数
     */
    update(sysMenu: SysMenu): Promise<number>;
    /**
     * 删除信息
     *
     * @param menuId ID
     * @return 影响记录数
     */
    deleteById(menuId: number): Promise<number>;
    /**
     * 检查信息是否唯一 返回数据ID
     * @param sysMenu 信息
     * @returns
     */
    checkUnique(sysMenu: SysMenu): Promise<number>;
    /**
     * 菜单下同状态存在子节点数量
     *
     * @param menuId ID
     * @param statusFlag 状态标记
     * @return 数量
     */
    existChildrenByMenuIdAndStatus(menuId: number, statusFlag: string): Promise<number>;
    /**
     * 根据用户ID查询权限标识
     *
     * @param userId 用户ID
     * @return 标识数组
     */
    selectPermsByUserId(userId: number): Promise<string[]>;
    /**
     * 根据角色ID查询菜单树信息
     *
     * @param roleId 角色ID
     * @param menuCheckStrictly 是否关联显示
     * @return 数量
     */
    selectByRoleId(roleId: number, menuCheckStrictly: boolean): Promise<number[]>;
    /**
     * 根据用户ID查询菜单
     *
     * @param userId 0为管理员查询全部菜单，其他为用户ID查询权限
     * @return 数量
     */
    selectTreeByUserId(userId: number): Promise<SysMenu[]>;
}
