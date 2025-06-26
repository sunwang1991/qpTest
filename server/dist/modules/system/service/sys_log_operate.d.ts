import { SysLogOperate } from '../model/sys_log_operate';
/**操作日志表 服务层处理 */
export declare class SysLogOperateService {
    /**操作日志信息 */
    private sysLogOperateRepository;
    /**文件服务 */
    private fileUtil;
    /**
     * 分页查询列表数据
     * @param query 参数
     * @param dataScopeSQL 角色数据范围过滤SQL字符串
     * @returns [rows, total]
     */
    findByPage(query: Record<string, string>, dataScopeSQL: string): Promise<[SysLogOperate[], number]>;
    /**
     * 新增信息
     * @param sysLogOperate 信息
     * @returns ID
     */
    insert(sysLogOperate: SysLogOperate): Promise<number>;
    /**
     * 清空操作日志
     * @returns 数量
     */
    clean(): Promise<number>;
    /**
     * 导出数据表格
     * @param rows 信息
     * @param fileName 文件名
     * @returns 结果
     */
    exportData(rows: SysLogOperate[], fileName: string): Promise<import("exceljs").Buffer>;
}
