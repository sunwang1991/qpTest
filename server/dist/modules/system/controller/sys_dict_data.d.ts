import { Resp } from '../../../framework/resp/api';
import { SysDictData } from '../model/sys_dict_data';
/**字典类型对应的字典数据信息 控制层处理 */
export declare class SysDictDataController {
    /**上下文 */
    private c;
    /**字典数据服务 */
    private sysDictDataService;
    /**字典类型服务 */
    private sysDictTypeService;
    /**字典数据列表 */
    list(query: Record<string, string>): Promise<Resp>;
    /**字典数据详情 */
    info(dataId: number): Promise<Resp>;
    /**字典数据新增 */
    add(body: SysDictData): Promise<Resp>;
    /**字典类型修改 */
    edit(body: SysDictData): Promise<Resp>;
    /**字典数据删除 */
    remove(dataId: string): Promise<Resp>;
    /**字典数据列表（指定字典类型） */
    dictType(dictType: string): Promise<Resp>;
    /**字典数据列表导出 */
    export(query: Record<string, string>): Promise<{
        code: number;
        msg: string;
    } | import("exceljs").Buffer>;
}
