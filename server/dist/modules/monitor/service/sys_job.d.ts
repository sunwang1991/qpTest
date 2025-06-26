import { SysJob } from '../model/sys_job';
/**调度任务 服务层处理 */
export declare class SysJobService {
    /**调度任务数据信息 */
    private sysJobRepository;
    /**调度任务日志数据信息 */
    private sysJobLogRepository;
    /**字典类型服务 */
    private sysDictTypeService;
    /**任务队列 */
    private bullFramework;
    /**文件服务 */
    private fileUtil;
    /**初始化 */
    init(): Promise<void>;
    /**
     * 分页查询
     * @param query 分页查询
     * @returns 结果
     */
    findByPage(query: Record<string, string>): Promise<[SysJob[], number]>;
    /**
     * 查询
     * @param query 分页查询
     * @returns 结果
     */
    find(sysJob: SysJob): Promise<SysJob[]>;
    /**
     * 通过ID查询
     * @param jobId
     * @returns
     */
    findById(jobId: number): Promise<SysJob>;
    /**
     * 新增
     * @param sysJob 信息
     * @returns ID
     */
    insert(sysJob: SysJob): Promise<number>;
    /**
     * 修改
     * @param sysJob 信息
     * @returns 影响记录数
     */
    update(sysJob: SysJob): Promise<number>;
    /**
     * 批量删除
     * @param jobIds ID数组
     * @returns [影响记录数, 错误信息]
     */
    deleteByIds(jobIds: number[]): Promise<[number, string]>;
    /**
     * 校验调度任务名称和组是否唯一
     * @param jobName 调度任务名称
     * @param jobGroup 调度任务组
     * @param jobId 调度任务ID
     * @returns true 唯一，false 不唯一
     */
    checkUniqueJobName(jobName: string, jobGroup: string, jobId: number): Promise<boolean>;
    /**
     * 添加调度任务
     *
     * @param sysJob 调度任务信息
     * @param repeat 触发执行cron重复多次
     * @return 结果
     */
    private insertQueueJob;
    /**
     * 删除调度任务
     * @param sysJob 信息
     * @returns 结果
     */
    private deleteQueueJob;
    /**
     * 日志记录保存
     * @param jld 日志记录数据
     * @param status 日志状态
     * @returns
     */
    private saveJobLog;
    /**
     * 重置初始调度任务
     */
    reset(): Promise<void>;
    /**
     * 立即运行一次调度任务
     * @param sysJob 信息
     * @returns 结果
     */
    run(sysJob: SysJob): Promise<boolean>;
    /**
     * 导出数据表格
     * @param rows 信息
     * @param fileName 文件名
     * @returns 结果
     */
    exportData(rows: SysJob[], fileName: string): Promise<import("exceljs").Buffer>;
}
