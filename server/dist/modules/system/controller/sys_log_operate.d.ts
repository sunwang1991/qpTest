import { Resp } from '../../../framework/resp/api';
/**操作日志记录信息 控制层处理 */
export declare class SysLogOperateController {
    /**上下文 */
    private c;
    /**操作日志服务 */
    private sysLogOperateService;
    /**操作日志列表 */
    list(query: Record<string, string>): Promise<Resp>;
    /**操作日志清空 */
    clean(): Promise<Resp>;
    /**导出操作日志 */
    export(query: Record<string, string>): Promise<{
        code: number;
        msg: string;
    } | import("exceljs").Buffer>;
}
