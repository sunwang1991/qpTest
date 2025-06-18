import { Resp } from '../../../framework/resp/api';
/**系统登录日志信息 控制层处理 */
export declare class SysLogLoginController {
    /**上下文 */
    private c;
    /**系统登录日志服务 */
    private sysLogLoginService;
    /**系统登录日志列表 */
    list(query: Record<string, string>): Promise<Resp>;
    /**系统登录日志清空 */
    clean(): Promise<Resp>;
    /**导出系统登录日志信息 */
    export(query: Record<string, string>): Promise<{
        code: number;
        msg: string;
    } | import("exceljs").Buffer>;
}
