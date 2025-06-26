import { SysConfig } from '../model/sys_config';
/**参数配置 服务层处理 */
export declare class SysConfigService {
    /**参数配置表数据 */
    private sysConfigRepository;
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
    findByPage(query: Record<string, string>): Promise<[SysConfig[], number]>;
    /**
     * 通过ID查询信息
     * @param configId ID
     * @returns 结果
     */
    findById(configId: number): Promise<SysConfig>;
    /**
     * 新增信息
     * @param sysConfig 信息
     * @returns ID
     */
    insert(sysConfig: SysConfig): Promise<number>;
    /**
     * 修改信息
     * @param sysConfig 信息
     * @returns 影响记录数
     */
    update(sysConfig: SysConfig): Promise<number>;
    /**
     * 批量删除信息
     * @param configIds ID数组
     * @returns [影响记录数, 错误信息]
     */
    deleteByIds(configIds: number[]): Promise<[number, string]>;
    /**
     * 检查参数键名是否唯一
     * @param configKey 配置Key
     * @param configId 配置ID
     * @returns 结果
     */
    checkUniqueByKey(configKey: string, configId: number): Promise<boolean>;
    /**
     * 通过参数键名查询参数值
     * @param configKey 配置Key
     * @returns 结果
     */
    findValueByKey(configKey: string): Promise<string>;
    /**
     * 加载参数缓存数据
     * @param configKey 配置Key 传入*查询全部
     * @returns 结果
     */
    cacheLoad(configKey: string): Promise<void>;
    /**
     * 清空参数缓存数据
     * @param configKey 配置Key 传入*清除全部
     * @returns 结果
     */
    cacheClean(configKey: string): Promise<boolean>;
    /**
     * 导出数据表格
     * @param rows 信息
     * @param fileName 文件名
     * @returns 结果
     */
    exportData(rows: SysConfig[], fileName: string): Promise<import("exceljs").Buffer>;
}
