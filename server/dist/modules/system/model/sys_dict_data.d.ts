/**字典数据表 */
export declare class SysDictData {
    /**数据ID */
    dataId: number;
    /**字典类型 */
    dictType: string;
    /**数据标签 */
    dataLabel: string;
    /**数据键值 */
    dataValue: string;
    /**数据排序 */
    dataSort: number;
    /**样式属性（样式扩展） */
    tagClass: string;
    /**标签类型（预设颜色） */
    tagType: string;
    /**状态（0停用 1正常） */
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
    /**备注 */
    remark: string;
}
