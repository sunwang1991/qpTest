import { Resp } from '../../../framework/resp/api';
import { SysNotice } from '../model/sys_notice';
/**通知公告信息 控制层处理 */
export declare class SysNoticeController {
    /**上下文 */
    private c;
    /**公告服务 */
    private sysNoticeService;
    /**通知公告列表 */
    list(query: Record<string, string>): Promise<Resp>;
    /**通知公告信息 */
    info(noticeId: number): Promise<Resp>;
    /**通知公告新增 */
    add(body: SysNotice): Promise<Resp>;
    /**通知公告修改 */
    edit(body: SysNotice): Promise<Resp>;
    /**通知公告删除 */
    remove(noticeId: string): Promise<Resp>;
}
