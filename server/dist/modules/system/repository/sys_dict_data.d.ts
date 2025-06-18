import { SysDictData } from '../model/sys_dict_data';
/**字典类型数据表 数据层处理 */
export declare class SysDictDataRepository {
    private db;
    /**
     * 分页查询集合
     *
     * @param query 参数
     * @returns 集合
     */
    selectByPage(query: Record<string, string>): Promise<[SysDictData[], number]>;
    /**
     * 查询集合
     *
     * @param sysDictData 信息
     * @return 列表
     */
    select(sysDictData: SysDictData): Promise<SysDictData[]>;
    /**
     * 通过ID查询
     *
     * @param dataIds ID数组
     * @return 信息
     */
    selectByIds(dataIds: number[]): Promise<SysDictData[]>;
    /**
     * 新增
     *
     * @param sysDictData 信息
     * @return ID
     */
    insert(sysDictData: SysDictData): Promise<number>;
    /**
     * 更新
     *
     * @param sysDictData 信息
     * @return 影响记录数
     */
    update(sysDictData: SysDictData): Promise<number>;
    /**
     * 批量删除
     *
     * @param dataIds ID数组
     * @return 影响记录数
     */
    deleteByIds(dataIds: number[]): Promise<number>;
    /**
     * 检查信息是否唯一 返回数据ID
     * @param sysDictData 信息
     * @returns
     */
    checkUnique(sysDictData: SysDictData): Promise<number>;
    /**
     * 存在数据数量
     *
     * @param dictType 字典类型
     * @return 数量
     */
    existDataByDictType(dictType: string): Promise<number>;
    /**
     * 更新一组字典类型
     *
     * @param oldDictType 旧字典类型
     * @param newDictType 新字典类型
     * @return 影响记录数
     */
    updateDataByDictType(oldDictType: string, newDictType: string): Promise<number>;
}
