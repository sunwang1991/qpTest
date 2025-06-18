/**岗位表 */
export declare class SysPost {
    /**岗位ID */
    postId: number;
    /**岗位编码 */
    postCode: string;
    /**岗位名称 */
    postName: string;
    /**显示顺序 */
    postSort: number;
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
