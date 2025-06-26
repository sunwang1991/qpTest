import { Resp } from '../../../framework/resp/api';
import { SysConfig } from '../model/sys_config';
/**参数配置信息 控制层处理 */
export declare class SysConfigController {
    /**上下文 */
    private c;
    /**参数配置服务 */
    private sysConfigService;
    /**参数配置列表 */
    list(query: Record<string, string>): Promise<Resp>;
    /**参数配置信息 */
    info(configId: number): Promise<Resp>;
    /**参数配置新增 */
    add(body: SysConfig): Promise<{
        code: number;
        msg: string;
    }>;
    /**参数配置修改 */
    edit(body: SysConfig): Promise<{
        code: number;
        msg: string;
    }>;
    /**参数配置删除 */
    remove(configId: string): Promise<{
        code: number;
        msg: string;
    }>;
    /**参数配置刷新缓存 */
    refresh(): Promise<Resp>;
    /**参数配置根据参数键名 */
    configKey(configKey: string): Promise<Resp>;
    /**导出参数配置信息 */
    export(query: Record<string, string>): Promise<{
        code: number;
        msg: string;
    } | import("exceljs").Buffer>;
}
