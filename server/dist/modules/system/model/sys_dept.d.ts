/**部门表 */
export declare class SysDept {
    /**部门ID */
    deptId: number;
    /**父部门ID */
    parentId: number;
    /**祖级列表 */
    ancestors: string;
    /**部门名称 */
    deptName: string;
    /**显示顺序 */
    deptSort: number;
    /**负责人 */
    leader: string;
    /**联系电话 */
    phone: string;
    /**邮箱 */
    email: string;
    /**部门状态（0正常 1停用） */
    statusFlag: string;
    /**删除标志（0代表存在 1代表删除） */
    delFlag: string;
    /**创建者 */
    createBy: string;
    /**创建时间 */
    createTime: number;
    /**更新者 */
    updateBy: string;
    /**更新时间 */
    updateTime: number;
    /**子部门 */
    children: SysDept[];
}
