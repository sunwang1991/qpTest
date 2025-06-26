/**
 * 测试ORM表 demo_orm
 *
 * 必须要model目录下实体文件名称才能匹配使用typeorm实体扫描
 */
export declare class DemoORM {
    /**测试ID */
    id: number;
    /**测试标题 */
    title: string;
    /**orm类型 */
    ormType: string;
    /**状态（0关闭 1正常） */
    statusFlag: string;
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
