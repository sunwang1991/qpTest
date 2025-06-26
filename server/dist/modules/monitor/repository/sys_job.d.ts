import { SysJob } from '../model/sys_job';
/**调度任务表 数据层处理 */
export declare class SysJobRepository {
    private db;
    /**
     * 分页查询集合
     *
     * @param query 参数
     * @returns 集合
     */
    selectByPage(query: Record<string, string>): Promise<[SysJob[], number]>;
    /**
     * 查询集合
     *
     * @param sysJob 信息
     * @return 列表
     */
    select(sysJob: SysJob): Promise<SysJob[]>;
    /**
     * 通过ID查询
     *
     * @param id ID
     * @return 信息
     */
    selectByIds(jobIds: number[]): Promise<SysJob[]>;
    /**
     * 新增
     *
     * @param sysJob 信息
     * @return ID
     */
    insert(sysJob: SysJob): Promise<number>;
    /**
     * 更新
     *
     * @param sysJob 信息
     * @return 影响记录数
     */
    update(sysJob: SysJob): Promise<number>;
    /**
     * 批量删除
     *
     * @param ids ID数组
     * @return 影响记录数
     */
    deleteByIds(jobIds: number[]): Promise<number>;
    /**
     * 校验信息是否唯一
     *
     * @param sysJob 调度任务信息
     * @return 调度任务id
     */
    checkUnique(sysJob: SysJob): Promise<number>;
}
