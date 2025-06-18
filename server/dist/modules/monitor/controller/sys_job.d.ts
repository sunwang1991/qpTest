import { Resp } from '../../../framework/resp/api';
import { SysJob } from '../model/sys_job';
/**调度任务信息 控制层处理*/
export declare class SysJobController {
    /**上下文 */
    private c;
    /**调度任务服务 */
    private sysJobService;
    /**调度任务列表 */
    list(query: Record<string, string>): Promise<Resp>;
    /**调度任务信息 */
    info(jobId: number): Promise<Resp>;
    /**调度任务新增 */
    add(body: SysJob): Promise<Resp>;
    /**调度任务修改 */
    edit(body: SysJob): Promise<Resp>;
    /**调度任务删除 */
    remove(jobId: string): Promise<Resp>;
    /**调度任务修改状态 */
    status(jobId: number, statusFlag: string): Promise<Resp>;
    /**调度任务立即执行一次 */
    run(jobId: number): Promise<Resp>;
    /**调度任务重置刷新队列 */
    reset(): Promise<Resp>;
    /**
     * 导出调度任务信息
     */
    export(query: Record<string, string>): Promise<{
        code: number;
        msg: string;
    } | import("exceljs").Buffer>;
}
