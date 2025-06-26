import { Resp } from '../../../framework/resp/api';
import { CodeQuery } from '../model/code_query';
import { TokenBody } from '../model/token_body';
/**用户授权第三方应用认证 控制层处理 */
export declare class Oauth2Controller {
    /**上下文 */
    private c;
    /**Token工具 */
    private token;
    /**用户授权第三方信息服务 */
    private oauth2Service;
    /**用户授权第三方应用信息服务 */
    private oauth2ClientService;
    /**用户授权第三方应用登录日志 */
    private oauth2LogLoginService;
    /**获取登录预授权码 */
    authorize(query: CodeQuery): Promise<Resp>;
    /**通过授权码获取访问令牌 */
    createToken(body: TokenBody): Promise<Resp>;
    /**通过刷新令牌续期访问令牌 */
    refreshToken(body: TokenBody): Promise<Resp>;
}
