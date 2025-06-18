import { Resp } from '../../../framework/resp/api';
import { LoginBody } from '../model/login_body';
/**账号身份操作 控制层处理 */
export declare class AccountController {
    /**上下文 */
    private c;
    /**系统用户令牌工具 */
    private token;
    /**配置信息 */
    private config;
    /**账号身份操作服务 */
    private accountService;
    /**系统登录访问 */
    private sysLogLoginService;
    /**系统登录 */
    login(body: LoginBody): Promise<Resp>;
    /**系统登出 */
    logout(): Promise<Resp>;
    /**刷新Token */
    refreshToken(body: Record<string, string>): Promise<Resp>;
    /**登录用户信息 */
    me(): Promise<Resp>;
    /**登录用户路由信息 */
    router(): Promise<Resp>;
}
