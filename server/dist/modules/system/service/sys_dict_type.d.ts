import { SysDictData } from '../model/sys_dict_data';
import { SysDictType } from '../model/sys_dict_type';
/**字典类型 服务层处理 */
export declare class SysDictTypeService {
    /**字典类型服务 */
    private sysDictTypeRepository;
    /**字典数据服务 */
    private sysDictDataRepository;
    /**文件服务 */
    private fileUtil;
    /**缓存服务 */
    private redisCache;
    /**初始化 */
    init(): Promise<void>;
    /**
     * 分页查询列表数据
     * @param query 参数
     * @returns []
     */
    findByPage(query: Record<string, string>): Promise<[SysDictType[], number]>;
    /**
     * 查询数据
     * @param sysDictType 信息
     * @returns []
     */
    find(sysDictType: SysDictType): Promise<SysDictType[]>;
    /**
     * 通过ID查询信息
     * @param dictId ID
     * @returns 结果
     */
    findById(dictId: number): Promise<SysDictType>;
    /**
     * 根据字典类型查询信息
     * @param dictType 字典类型
     * @returns 结果
     */
    findByType(dictType: string): Promise<SysDictType>;
    /**
     * 新增信息
     * @param sysDictType 信息
     * @returns ID
     */
    insert(sysDictType: SysDictType): Promise<number>;
    /**
     * 修改信息
     * @param sysDictType 信息
     * @returns 影响记录数
     */
    update(sysDictType: SysDictType): Promise<number>;
    /**
     * 批量删除信息
     * @param dictIds ID数组
     * @returns [影响记录数, 错误信息]
     */
    deleteByIds(dictIds: number[]): Promise<[number, string]>;
    /**
     * 检查字典名称是否唯一
     * @param dictName 字典名称
     * @param dictId 字典ID
     * @returns 结果
     */
    checkUniqueByName(dictName: string, dictId: number): Promise<boolean>;
    /**
     * 检查字典类型是否唯一
     * @param dictType 字典类型
     * @param dictId 字典ID
     * @returns 结果
     */
    checkUniqueByType(dictType: string, dictId: number): Promise<boolean>;
    /**
     * 获取字典数据缓存数据
     * @param dictType 字典类型
     * @returns 结果
     */
    findDataByType(dictType: string): Promise<SysDictData[]>;
    /**
     * 加载字典缓存数据
     * @param dictType 字典类型 传入*查询全部
     * @returns 结果
     */
    cacheLoad(dictType: string): Promise<void>;
    /**
     * 清空字典缓存数据
     * @param dictType 字典类型 传入*清除全部
     * @returns 结果
     */
    cacheClean(dictType: string): Promise<boolean>;
    /**
     * 导出数据表格
     * @param rows 信息
     * @param fileName 文件名
     * @returns 结果
     */
    exportData(rows: SysDictType[], fileName: string): Promise<import("exceljs").Buffer>;
}
