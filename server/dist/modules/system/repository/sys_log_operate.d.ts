import { SysLogOperate } from '../model/sys_log_operate';
/**操作日志表 数据层处理 */
export declare class SysLogOperateRepository {
    private db;
    /**
     * 分页查询集合
     *
     * @param query 参数
     * @param dataScopeSQL 角色数据范围过滤SQL字符串
     * @returns 集合
     */
    selectByPage(query: Record<string, string>, dataScopeSQL: string): Promise<[SysLogOperate[], number]>;
    /**
     * 新增
     *
     * @param sysLogOperate 信息
     * @return ID
     */
    insert(sysLogOperate: SysLogOperate): Promise<number>;
    /**
     * 清空信息
     *
     * @return 影响记录数
     */
    clean(): Promise<number>;
}
