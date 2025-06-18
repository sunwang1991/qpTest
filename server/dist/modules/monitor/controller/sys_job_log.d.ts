import { Resp } from '../../../framework/resp/api';
/**调度任务日志信息 控制层处理 */
export declare class SysJobLogController {
    /**上下文 */
    private c;
    /**调度任务服务 */
    private sysJobService;
    /**调度任务日志服务 */
    private sysJobLogService;
    /**调度任务日志列表 */
    list(query: Record<string, string>): Promise<Resp>;
    /**调度任务日志信息 */
    info(logId: number): Promise<Resp>;
    /**调度任务日志删除 */
    remove(logId: string): Promise<Resp>;
    /**调度任务日志清空 */
    clean(): Promise<Resp>;
    /**导出调度任务日志信息 */
    export(query: Record<string, string>): Promise<{
        code: number;
        msg: string;
    } | import("exceljs").Buffer>;
}
