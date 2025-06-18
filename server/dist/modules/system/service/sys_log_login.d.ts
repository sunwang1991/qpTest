import { SysLogLogin } from '../model/sys_log_login';
/**系统登录日志 服务层处理 */
export declare class SysLogLoginService {
    /**系统登录日志信息 */
    private sysLogLoginRepository;
    /**文件服务 */
    private fileUtil;
    /**
     * 分页查询列表数据
     * @param query 参数
     * @param dataScopeSQL 角色数据范围过滤SQL字符串
     * @returns [rows, total]
     */
    findByPage(query: Record<string, string>, dataScopeSQL: string): Promise<[SysLogLogin[], number]>;
    /**
     * 新增信息
     * @param userName 用户名
     * @param status 状态
     * @param ilobArr 数组 [loginIp,loginLocation,os,browser]
     * @returns ID
     */
    insert(userName: string, status: string, msg: string, ilobArr: string[]): Promise<number>;
    /**
     * 清空系统登录日志
     * @returns 数量
     */
    clean(): Promise<number>;
    /**
     * 导出数据表格
     * @param rows 信息
     * @param fileName 文件名
     * @returns 结果
     */
    exportData(rows: SysLogLogin[], fileName: string): Promise<import("exceljs").Buffer>;
}
