import { Resp } from '../../../framework/resp/api';
import { SysPost } from '../model/sys_post';
/**岗位信息 控制层处理*/
export declare class SysPostController {
    /**上下文 */
    private c;
    /**岗位服务 */
    private sysPostService;
    /**岗位列表 */
    list(query: Record<string, string>): Promise<Resp>;
    /**岗位信息 */
    info(postId: number): Promise<Resp>;
    /**岗位新增 */
    add(body: SysPost): Promise<Resp>;
    /**岗位修改 */
    edit(body: SysPost): Promise<Resp>;
    /**岗位删除 */
    remove(postId: string): Promise<Resp>;
    /**导出岗位信息 */
    export(query: Record<string, string>): Promise<{
        code: number;
        msg: string;
    } | import("exceljs").Buffer>;
}
