import { Resp } from '../../../framework/resp/api';
import { RegisterBody } from '../model/register_body';
/**账号注册操作 控制层处理 */
export declare class RegisterController {
    /**上下文 */
    private c;
    /**账号注册操作服务 */
    private registerService;
    /**系统登录访问服务 */
    private sysLogLoginService;
    /**账号注册 */
    register(body: RegisterBody): Promise<Resp>;
}
