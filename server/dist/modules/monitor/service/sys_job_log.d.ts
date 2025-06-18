import { SysJobLog } from '../model/sys_job_log';
/**调度任务日志 服务层处理 */
export declare class SysJobLogService {
    /**调度任务日志数据信息 */
    private sysJobLogRepository;
    /**字典类型服务 */
    private sysDictDataService;
    /**文件服务 */
    private fileUtil;
    /**
     * 分页查询
     * @param query 查询参数
     * @returns 结果
     */
    findByPage(query: Record<string, string>): Promise<[SysJobLog[], number]>;
    /**
     * 查询
     * @param sysJobLog 信息
     * @returns 列表
     */
    find(sysJobLog: SysJobLog): Promise<SysJobLog[]>;
    /**
     * 通过ID查询
     * @param logId 日志ID
     * @returns 结果
     */
    findById(logId: number): Promise<SysJobLog>;
    /**
     * 批量删除
     * @param logIds 日志ID数组
     * @returns
     */
    deleteByIds(logIds: number[]): Promise<number>;
    /**
     * 清空调度任务日志
     * @return 删除记录数
     */
    clean(): Promise<number>;
    /**
     * 导出数据表格
     * @param rows 信息
     * @param fileName 文件名
     * @returns 结果
     */
    exportData(rows: SysJobLog[], fileName: string): Promise<import("exceljs").Buffer>;
}
