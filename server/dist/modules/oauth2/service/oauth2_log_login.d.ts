import { Oauth2LogLogin } from '../model/oauth2_log_login';
/**用户授权第三方应用登录日志 服务层处理 */
export declare class Oauth2LogLoginService {
    /**用户授权第三方应用登录日志信息 */
    private oauth2LogLoginRepository;
    /**文件服务 */
    private fileUtil;
    /**
     * 分页查询列表数据
     * @param query 参数
     * @returns [rows, total]
     */
    findByPage(query: Record<string, string>): Promise<[Oauth2LogLogin[], number]>;
    /**
     * 新增信息
     * @param clientId 用户名
     * @param status 状态
     * @param ilobArr 数组 [loginIp,loginLocation,os,browser]
     * @returns ID
     */
    insert(clientId: string, status: string, msg: string, ilobArr: string[]): Promise<number>;
    /**
     * 清空用户授权第三方应用登录日志
     * @returns 数量
     */
    clean(): Promise<number>;
    /**
     * 导出数据表格
     * @param rows 信息
     * @param fileName 文件名
     * @returns 结果
     */
    exportData(rows: Oauth2LogLogin[], fileName: string): Promise<import("exceljs").Buffer>;
}
