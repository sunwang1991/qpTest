import { Oauth2Client } from '../model/oauth2_client';
/**用户授权第三方应用表 数据层处理 */
export declare class Oauth2ClientRepository {
    private db;
    /**
     * 分页查询集合
     *
     * @param query 参数
     * @returns 集合
     */
    selectByPage(query: Record<string, string>): Promise<[Oauth2Client[], number]>;
    /**
     * 查询集合
     *
     * @param sysConfig 信息
     * @return 列表
     */
    select(param: Oauth2Client): Promise<Oauth2Client[]>;
    /**
     * 通过ID查询信息
     *
     * @param ids ID数组
     * @return 信息
     */
    selectByIds(ids: number[]): Promise<Oauth2Client[]>;
    /**
     * 新增信息 返回新增数据ID
     *
     * @param param 信息
     * @return ID
     */
    insert(param: Oauth2Client): Promise<number>;
    /**
     * 更新
     *
     * @param param 信息
     * @return 影响记录数
     */
    update(param: Oauth2Client): Promise<number>;
    /**
     * 批量删除信息 返回受影响行数
     *
     * @param ids ID数组
     * @return 影响记录数
     */
    deleteByIds(ids: number[]): Promise<number>;
    /**
     * 通过clientId查询
     * @param clientId 客户端ID
     * @returns
     */
    selectByClientId(clientId: string): Promise<Oauth2Client>;
}
