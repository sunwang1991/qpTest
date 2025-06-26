import { SysRole } from '../model/sys_role';
/**角色 服务层处理 */
export declare class SysRoleService {
    /**角色服务 */
    private sysRoleRepository;
    /**用户与角色关联服务 */
    private sysUserRoleRepository;
    /**角色与部门关联服务 */
    private sysRoleDeptRepository;
    /**角色与菜单关联服务 */
    private sysRoleMenuRepository;
    /**文件服务 */
    private fileUtil;
    /**
     * 分页查询列表数据
     * @param query 参数
     * @returns [rows, total]
     */
    findByPage(query: Record<string, string>): Promise<[SysRole[], number]>;
    /**
     * 查询列表数据
     * @param sysRole 信息
     * @returns []
     */
    find(sysRole: SysRole): Promise<SysRole[]>;
    /**
     * 通过ID查询信息
     * @param roleId ID
     * @returns 结果
     */
    findById(roleId: number): Promise<SysRole>;
    /**
     * 新增信息
     * @param sysRole 信息
     * @returns ID
     */
    insert(sysRole: SysRole): Promise<number>;
    /**
     * 修改信息
     * @param sysRole 信息
     * @returns 影响记录数
     */
    update(sysRole: SysRole): Promise<number>;
    /**
     * 新增角色菜单信息
     * @param roleId 角色ID
     * @param menuIds 菜单ID数组
     * @returns 影响记录数
     */
    private insertRoleMenu;
    /**
     * 批量删除信息
     * @param configIds ID数组
     * @returns [影响记录数, 错误信息]
     */
    deleteByIds(roleIds: number[]): Promise<[number, string]>;
    /**
     * 根据用户ID获取角色选择框列表
     * @param userId 用户ID
     * @returns 结果
     */
    findByUserId(userId: number): Promise<SysRole[]>;
    /**
     * 检查角色名称是否唯一
     * @param dictName 字典名称
     * @param dictId 字典ID
     * @returns 结果
     */
    checkUniqueByName(roleName: string, roleId: number): Promise<boolean>;
    /**
     * 检查角色权限是否唯一
     * @param roleKey 角色键值
     * @param dictId 字典ID
     * @returns 结果
     */
    checkUniqueByKey(roleKey: string, roleId: number): Promise<boolean>;
    /**
     * 修改信息同时更新数据权限信息
     * @param sysRole 角色信息
     * @returns 结果
     */
    updateAndDataScope(sysRole: SysRole): Promise<number>;
    /**
     * 批量新增授权用户角色
     * @param roleId 角色ID
     * @param userIds 用户ID数组
     * @returns 结果
     */
    insertAuthUsers(roleId: number, userIds: number[]): Promise<number>;
    /**
     * 批量取消授权用户角色
     * @param roleId 角色ID
     * @param userIds 用户ID数组
     * @returns 结果
     */
    deleteAuthUsers(roleId: number, userIds: number[]): Promise<number>;
    /**
     * 导出数据表格
     * @param rows 信息
     * @param fileName 文件名
     * @returns 结果
     */
    exportData(rows: SysRole[], fileName: string): Promise<import("exceljs").Buffer>;
}
