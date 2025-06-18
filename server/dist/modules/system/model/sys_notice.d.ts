/**通知公告表 */
export declare class SysNotice {
    /**公告ID */
    noticeId: number;
    /**公告标题 */
    noticeTitle: string;
    /**公告类型（1通知 2公告） */
    noticeType: string;
    /**公告内容 */
    noticeContent: string;
    /**状态（0停用 1正常） */
    statusFlag: string;
    /**删除标记（0存在 1删除） */
    delFlag: string;
    /**创建者 */
    createBy: string;
    /**创建时间 */
    createTime: number;
    /**更新者 */
    updateBy: string;
    /**更新时间 */
    updateTime: number;
    /**备注 */
    remark: string;
}
