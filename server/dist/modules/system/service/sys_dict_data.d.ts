import { SysDictData } from '../model/sys_dict_data';
/**字典类型数据 服务层处理 */
export declare class SysDictDataService {
    /**字典数据服务 */
    private sysDictDataRepository;
    /**字典类型服务 */
    private sysDictTypeService;
    /**文件服务 */
    private fileUtil;
    /**
     * 分页查询列表数据
     * @param query 参数
     * @returns []
     */
    findByPage(query: Record<string, string>): Promise<[SysDictData[], number]>;
    /**
     * 新增信息
     * @param sysDictData 信息
     * @returns 信息数组
     */
    find(sysDictData: SysDictData): Promise<SysDictData[]>;
    /**
     * 通过ID查询信息
     * @param dictId ID
     * @returns 结果
     */
    findById(dictId: number): Promise<SysDictData>;
    /**
     * 根据字典类型查询信息
     * @param dictType 字典类型
     * @returns []
     */
    findByType(dictType: string): Promise<SysDictData[]>;
    /**
     * 新增信息
     * @param sysDictData 信息
     * @returns ID
     */
    insert(sysDictData: SysDictData): Promise<number>;
    /**
     * 修改信息
     * @param sysDictData 信息
     * @returns 影响记录数
     */
    update(sysDictData: SysDictData): Promise<number>;
    /**
     * 批量删除信息
     * @param dictIds ID数组
     * @returns [影响记录数, 错误信息]
     */
    deleteByIds(dictIds: number[]): Promise<[number, string]>;
    /**
     * 检查同字典类型下字典标签是否唯一
     * @param dictType 字典类型
     * @param dataLabel 数据标签
     * @param dataId 数据ID
     * @returns 结果
     */
    checkUniqueTypeByLabel(dictType: string, dataLabel: string, dataId: number): Promise<boolean>;
    /**
     * 检查同字典类型下字典键值是否唯一
     * @param dictType 字典类型
     * @param dataValue 数据键值
     * @param dataId 数据ID
     * @returns 结果
     */
    checkUniqueTypeByValue(dictType: string, dataValue: string, dataId: number): Promise<boolean>;
    /**
     * 导出数据表格
     * @param rows 信息
     * @param fileName 文件名
     * @returns 结果
     */
    exportData(rows: SysDictData[], fileName: string): Promise<import("exceljs").Buffer>;
}
