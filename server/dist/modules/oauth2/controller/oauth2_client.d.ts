import { Resp } from '../../../framework/resp/api';
import { Oauth2Client } from '../model/oauth2_client';
/**客户端授权管理 控制层处理 */
export declare class Oauth2ClientController {
    /**上下文 */
    private c;
    /**用户授权第三方应用信息服务 */
    private oauth2ClientService;
    /**列表 */
    list(query: Record<string, string>): Promise<Resp>;
    /**信息 */
    info(clientId: string): Promise<Resp>;
    /**新增 */
    add(body: Oauth2Client): Promise<{
        code: number;
        msg: string;
    }>;
    /**更新 */
    edit(body: Oauth2Client): Promise<{
        code: number;
        msg: string;
    }>;
    /**删除 */
    remove(id: string): Promise<{
        code: number;
        msg: string;
    }>;
}
