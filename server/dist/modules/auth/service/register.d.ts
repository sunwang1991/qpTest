/**账号注册操作 服务层处理 */
export declare class RegisterService {
    /**缓存操作 */
    private redis;
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
     * 账号注册
     * @param username 登录用户名
     * @param password 密码
     * @returns [用户ID, 错误信息]
     */
    byUserName(username: string, password: string): Promise<[number, string]>;
    /**
     * 注册初始角色
     * @returns 角色id组
     */
    private registerRoleInit;
    /**
     * 注册初始岗位
     * @returns 岗位id组
     */
    private registerPostInit;
}
