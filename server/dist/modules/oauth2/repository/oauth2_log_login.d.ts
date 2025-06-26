import { Oauth2LogLogin } from '../model/oauth2_log_login';
/**用户授权第三方应用登录日志表 数据层处理 */
export declare class Oauth2LogLoginRepository {
    private db;
    /**
     * 分页查询集合
     *
     * @param query 参数
     * @returns 集合
     */
    selectByPage(query: Record<string, string>): Promise<[Oauth2LogLogin[], number]>;
    /**
     * 新增
     *
     * @param param 信息
     * @return ID
     */
    insert(param: Oauth2LogLogin): Promise<number>;
    /**
     * 清空信息
     *
     * @return 影响记录数
     */
    clean(): Promise<number>;
}
