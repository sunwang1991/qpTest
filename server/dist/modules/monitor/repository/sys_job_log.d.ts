import { SysJobLog } from '../model/sys_job_log';
/**调度任务日志表 数据层处理 */
export declare class SysJobLogRepository {
    private db;
    /**
     * 分页查询集合
     *
     * @param query 参数
     * @returns 集合
     */
    selectByPage(query: Record<string, string>): Promise<[SysJobLog[], number]>;
    /**
     * 查询集合
     *
     * @param sysJobLog 信息
     * @return 列表
     */
    select(sysJobLog: SysJobLog): Promise<SysJobLog[]>;
    /**
     * 通过ID查询
     *
     * @param logId ID
     * @return 信息
     */
    selectById(logId: number): Promise<SysJobLog>;
    /**
     * 新增
     *
     * @param sysJobLog 信息
     * @return ID
     */
    insert(sysJobLog: SysJobLog): Promise<number>;
    /**
     * 批量删除
     *
     * @param logIds ID数组
     * @return 影响记录数
     */
    deleteByIds(logIds: number[]): Promise<number>;
    /**
     * 清空集合数据
     *
     * @return 影响记录数
     */
    clean(): Promise<number>;
}
