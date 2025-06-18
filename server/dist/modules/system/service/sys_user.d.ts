import { SysUser } from '../model/sys_user';
/**用户 服务层处理 */
export declare class SysUserService {
    /**用户服务 */
    private sysUserRepository;
    /**角色服务 */
    private sysRoleRepository;
    /**部门服务 */
    private sysDeptRepository;
    /**用户与角色服务 */
    private sysUserRoleRepository;
    /**用户与岗位服务 */
    private sysUserPostRepository;
    /**字典类型服务 */
    private sysDictTypeService;
    /**参数配置服务 */
    private sysConfigService;
    /**文件服务 */
    private fileUtil;
    /**
     * 分页查询列表数据
     * @param query 参数
     * @param dataScopeSQL 角色数据范围过滤SQL字符串
     * @returns []
     */
    findByPage(query: Record<string, string>, dataScopeSQL: string): Promise<[SysUser[], number]>;
    /**
     * 查询数据
     * @param sysUser 信息
     * @returns []
     */
    find(sysUser: SysUser): Promise<SysUser[]>;
    /**
     * 根据ID查询信息
     * @param userId ID
     * @returns 结果
     */
    findById(userId: number): Promise<SysUser>;
    /**
     * 新增信息
     * @param sysUser 信息
     * @returns ID
     */
    insert(sysUser: SysUser): Promise<number>;
    /**
     * 新增用户角色信息
     * @param userId 用户ID
     * @param roleIds 角色ID数组
     * @returns 影响记录数
     */
    private insertUserRole;
    /**
     * 新增用户岗位信息
     * @param userId 用户ID
     * @param postIds 岗位ID数组
     * @returns 影响记录数
     */
    private insertUserPost;
    /**
     * 修改信息
     * @param sysUser 信息
     * @returns 影响记录数
     */
    update(sysUser: SysUser): Promise<number>;
    /**
     * 修改用户信息同时更新角色和岗位
     * @param sysUser 信息
     * @returns 影响记录数
     */
    updateUserAndRolePost(sysUser: SysUser): Promise<number>;
    /**
     * 批量删除信息
     * @param userIds ID数组
     * @returns [影响记录数, 错误信息]
     */
    deleteByIds(userIds: number[]): Promise<[number, string]>;
    /**
     * 检查用户名称是否唯一
     * @param userName 用户名
     * @param userId 用户ID
     * @returns 结果
     */
    checkUniqueByUserName(userName: string, userId: number): Promise<boolean>;
    /**
     * 检查手机号码是否唯一
     * @param phone 手机号码
     * @param userId 用户ID
     * @returns 结果
     */
    checkUniqueByPhone(phone: string, userId: number): Promise<boolean>;
    /**
     * 检查Email是否唯一
     * @param email 手机号码
     * @param userId 用户ID
     * @returns 结果
     */
    checkUniqueByEmail(email: string, userId: number): Promise<boolean>;
    /**
     * 通过用户名查询用户信息
     * @param userName 用户名
     * @returns 结果
     */
    findByUserName(userName: string): Promise<SysUser>;
    /**
     * 根据条件分页查询分配用户角色列表
     * @param query 查询信息 { roleId:角色ID,auth:是否已分配 }
     * @param dataScopeSQL 角色数据范围过滤SQL字符串
     * @returns 结果
     */
    findAuthUsersPage(query: Record<string, string>, dataScopeSQL: string): Promise<[SysUser[], number]>;
    /**
     * 导出数据表格
     * @param rows 信息
     * @param fileName 文件名
     * @returns 结果
     */
    exportData(rows: SysUser[], fileName: string): Promise<import("exceljs").Buffer>;
    /**
     * 导入数据表格
     * @param rows 表格行数组
     * @param operaName 操作员
     * @param updateSupport 支持更新
     * @returns 结果信息
     */
    importData(rows: Record<string, string>[], operaName: string, updateSupport: boolean): Promise<string>;
}
