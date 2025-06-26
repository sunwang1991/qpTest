import { Oauth2Info } from '../../../framework/token/oauth2_info';
/**用户授权第三方应用信息 服务层处理 */
export declare class Oauth2Service {
    /**缓存操作 */
    private redis;
    /**用户授权第三方应用表 */
    private oauth2ClientRepository;
    /**
     * 创建授权码
     * @return 授权码
     */
    createCode(): Promise<string>;
    /**
     * 校验授权码
     * @param code 授权码
     * @returns 错误信息
     */
    validateCode(code: string): Promise<string>;
    /**
     * 客户端信息
     * @param clientId 客户端ID
     * @param clientSecret 客户端密钥
     * @return 错误结果信息
     */
    byClient(clientId: string, clientSecret: string): Promise<[Oauth2Info, string]>;
    /**
     * 更新登录时间和IP
     * @returns 更新是否成功
     */
    updateLoginDateAndIP(info: Oauth2Info): Promise<boolean>;
}
