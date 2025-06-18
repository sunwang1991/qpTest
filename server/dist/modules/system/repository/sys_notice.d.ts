import { SysNotice } from '../model/sys_notice';
/**通知公告表 数据层处理 */
export declare class SysNoticeRepository {
    private db;
    /**
     * 分页查询集合
     *
     * @param query 参数
     * @returns 集合
     */
    selectByPage(query: Record<string, string>): Promise<[SysNotice[], number]>;
    /**
     * 查询集合
     *
     * @param sysNotice 信息
     * @return 列表
     */
    select(sysNotice: SysNotice): Promise<SysNotice[]>;
    /**
     * 通过ID查询
     *
     * @param noticeIds ID数组
     * @return 信息
     */
    selectByIds(noticeIds: number[]): Promise<SysNotice[]>;
    /**
     * 新增
     *
     * @param sysConfig 信息
     * @return ID
     */
    insert(sysNotice: SysNotice): Promise<number>;
    /**
     * 更新
     *
     * @param sysNotice 信息
     * @return 影响记录数
     */
    update(sysNotice: SysNotice): Promise<number>;
    /**
     * 批量删除
     *
     * @param configIds ID数组
     * @return 影响记录数
     */
    deleteByIds(noticeIds: number[]): Promise<number>;
}
