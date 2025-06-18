import { SysConfig } from '../model/sys_config';
/**参数配置表 数据层处理 */
export declare class SysConfigRepository {
    private db;
    /**
     * 分页查询集合
     *
     * @param query 参数
     * @returns 集合
     */
    selectByPage(query: Record<string, string>): Promise<[SysConfig[], number]>;
    /**
     * 查询集合
     *
     * @param sysConfig 信息
     * @return 列表
     */
    select(sysConfig: SysConfig): Promise<SysConfig[]>;
    /**
     * 通过ID查询
     *
     * @param configIds ID数组
     * @return 信息
     */
    selectByIds(configIds: number[]): Promise<SysConfig[]>;
    /**
     * 新增
     *
     * @param sysConfig 信息
     * @return ID
     */
    insert(sysConfig: SysConfig): Promise<number>;
    /**
     * 更新
     *
     * @param sysConfig 信息
     * @return 影响记录数
     */
    update(sysConfig: SysConfig): Promise<number>;
    /**
     * 批量删除
     *
     * @param configIds ID数组
     * @return 影响记录数
     */
    deleteByIds(configIds: number[]): Promise<number>;
    /**
     * 检查信息是否唯一 返回数据ID
     * @param sysConfig 信息
     * @returns
     */
    checkUnique(sysConfig: SysConfig): Promise<number>;
    /**
     * 通过Key查询Value
     * @param configKey 数据Key
     * @returns
     */
    selectValueByKey(configKey: string): Promise<string>;
}
