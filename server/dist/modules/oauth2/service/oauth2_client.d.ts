import { Oauth2Client } from '../model/oauth2_client';
/**用户授权第三方应用信息 服务层处理 */
export declare class Oauth2ClientService {
    /**用户授权第三方应用表 */
    private oauth2ClientRepository;
    /**
     * 分页查询
     * @param query 查询参数
     * @return 错误结果信息
     */
    findByPage(query: Record<string, string>): Promise<[Oauth2Client[], number]>;
    /**
     * 查询集合
     * @param clientId 客户端ID
     * @return 错误结果信息
     */
    findByClientId(clientId: string): Promise<Oauth2Client>;
    /**
     * 新增
     * @param param 信息
     * @return 新增数据ID
     */
    insert(param: Oauth2Client): Promise<number>;
    /**
     * 更新
     * @param param 信息
     * @return 影响记录数
     */
    update(param: Oauth2Client): Promise<number>;
    /**
     * 更新
     * @param param 信息
     * @return 影响记录数
     */
    deleteByIds(ids: number[]): Promise<[number, string]>;
}
