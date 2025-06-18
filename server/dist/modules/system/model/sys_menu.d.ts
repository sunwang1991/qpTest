/**菜单权限表 */
export declare class SysMenu {
    /**菜单ID */
    menuId: number;
    /**菜单名称 */
    menuName: string;
    /**父菜单ID 默认0 */
    parentId: number;
    /**显示顺序 */
    menuSort: number;
    /**路由地址 */
    menuPath: string;
    /**组件路径 */
    component: string;
    /**是否内部跳转（0否 1是） */
    frameFlag: string;
    /**是否缓存（0不缓存 1缓存） */
    cacheFlag: string;
    /**菜单类型（D目录 M菜单 A权限） */
    menuType: string;
    /**是否显示（0隐藏 1显示） */
    visibleFlag: string;
    /**菜单状态（0停用 1正常） */
    statusFlag: string;
    /**权限标识 */
    perms: string;
    /**菜单图标（#无图标） */
    icon: string;
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
    /**子菜单 */
    children: SysMenu[];
}
