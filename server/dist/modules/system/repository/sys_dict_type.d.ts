import { SysDictType } from '../model/sys_dict_type';
/**字典类型表 数据层处理 */
export declare class SysDictTypeRepository {
    private db;
    /**
     * 分页查询集合
     *
     * @param query 参数
     * @returns 集合
     */
    selectByPage(query: Record<string, string>): Promise<[SysDictType[], number]>;
    /**
     * 查询集合
     *
     * @param sysDictType 信息
     * @return 列表
     */
    select(sysDictType: SysDictType): Promise<SysDictType[]>;
    /**
     * 通过ID查询
     *
     * @param dictIds ID数组
     * @return 信息
     */
    selectByIds(dictIds: number[]): Promise<SysDictType[]>;
    /**
     * 新增
     *
     * @param sysDictType 信息
     * @return ID
     */
    insert(sysDictType: SysDictType): Promise<number>;
    /**
     * 更新
     *
     * @param sysDictType 信息
     * @return 影响记录数
     */
    update(sysDictType: SysDictType): Promise<number>;
    /**
     * 批量删除
     *
     * @param dictIds ID数组
     * @return 影响记录数
     */
    deleteByIds(dictIds: number[]): Promise<number>;
    /**
     * 检查信息是否唯一 返回数据ID
     * @param sysDictType 信息
     * @returns
     */
    checkUnique(sysDictType: SysDictType): Promise<number>;
    /**
     * 通过字典类型查询信息
     *
     * @param dictType 字典类型
     * @return 数量
     */
    selectByType(dictType: string): Promise<SysDictType>;
}
