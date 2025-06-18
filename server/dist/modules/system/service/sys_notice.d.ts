import { SysNotice } from '../model/sys_notice';
/**公告 服务层处理 */
export declare class SysNoticeService {
    /**公告服务 */
    private sysNoticeRepository;
    /**
     * 分页查询列表数据
     * @param query 参数
     * @returns [rows, total]
     */
    findByPage(query: Record<string, string>): Promise<[SysNotice[], number]>;
    /**
     * 根据ID查询信息
     * @param noticeId ID
     * @returns 结果
     */
    findById(noticeId: number): Promise<SysNotice>;
    /**
     * 新增信息
     * @param sysNotice 信息
     * @returns ID
     */
    insert(sysNotice: SysNotice): Promise<number>;
    /**
     * 修改信息
     * @param sysNotice 信息
     * @returns 影响记录数
     */
    update(sysNotice: SysNotice): Promise<number>;
    /**
     * 批量删除信息
     * @param noticeIds ID数组
     * @returns [影响记录数, 错误信息]
     */
    deleteByIds(noticeIds: number[]): Promise<[number, string]>;
}
