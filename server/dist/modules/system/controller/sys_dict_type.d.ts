import { Resp } from '../../../framework/resp/api';
import { SysDictType } from '../model/sys_dict_type';
/**字典类型信息 控制层处理 */
export declare class SysDictTypeController {
    /**上下文 */
    private c;
    /**字典类型服务 */
    private sysDictTypeService;
    /**字典类型列表 */
    list(query: Record<string, string>): Promise<Resp>;
    /**字典类型信息 */
    info(dictId: number): Promise<{
        code: number;
        msg: string;
    }>;
    /**字典类型新增 */
    add(body: SysDictType): Promise<Resp>;
    /**字典类型修改 */
    edit(body: SysDictType): Promise<Resp>;
    /**字典类型删除 */
    remove(dictId: string): Promise<Resp>;
    /**字典类型刷新缓存 */
    refresh(): Promise<Resp>;
    /**字典类型选择框列表 */
    options(): Promise<{
        /**字典类型服务 */
        code: number;
        msg: string;
        data: {
            label: string;
            value: string;
        }[];
    }>;
    /**字典类型列表导出 */
    export(query: Record<string, string>): Promise<{
        code: number;
        msg: string;
    } | import("exceljs").Buffer>;
}
