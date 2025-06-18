import { UserInfo } from '../../../framework/token/user_info';
import { Router } from '../../system/model/vo/router';
/**账号身份操作 服务层处理 */
export declare class AccountService {
    /**缓存操作 */
    private redis;
    /**配置信息 */
    private config;
    /**菜单服务 */
    private sysMenuService;
    /**角色服务 */
    private sysRoleService;
    /**参数配置服务 */
    private sysConfigService;
    /**用户信息服务 */
    private sysUserService;
    /**
     * 校验验证码
     * @param code 验证码
     * @param uuid 唯一标识
     * @return 错误结果信息
     */
    validateCaptcha(code: string, uuid: string): Promise<string>;
    /**
     * 登录创建用户信息
     * @param username 登录用户名
     * @param password 密码
     * @return [UserInfo, string] 登录用户信息对象和错误结果信息
     */
    byUsername(username: string, password: string): Promise<[UserInfo, string]>;
    /**
     * 用户ID刷新令牌创建用户信息
     * @param userId 登录ID
     * @return [UserInfo, string] 登录用户信息对象和错误结果信息
     */
    byUserId(userId: number): Promise<[UserInfo, string]>;
    /**
     * 更新登录时间和IP
     * @param info 登录用户信息对象
     * @returns 记录完成
     */
    updateLoginDateAndIP(info: UserInfo): Promise<boolean>;
    /**
     * 清除错误记录次数
     * @param username 登录用户名
     * @returns boolean
     */
    clearLoginRecordCache(username: string): Promise<boolean>;
    /**
     * 密码重试次数
     * @param username 登录用户名
     * @returns [retryKey, retryCount, lockTime, err]
     */
    passwordRetryCount(username: string): Promise<[string, number, number, string]>;
    /**
     * 角色和菜单数据权限
     * @param userId 用户ID
     * @param isSystemUser 是否为系统管理员
     * @returns [角色key数组, 菜单权限key数组]
     */
    roleAndMenuPerms(userId: number, isSystemUser: boolean): Promise<[string[], string[]]>;
    /**
     * 前端路由所需要的菜单
     * @param userId 用户ID
     * @param isSystemUser 是否为系统管理员
     * @returns 路由菜单数组
     */
    routeMenus(userId: number, isSystemUser: boolean): Promise<Router[]>;
}
