import { TreeSelect } from '../model/vo/tree_select';
import { Router } from '../model/vo/router';
import { SysMenu } from '../model/sys_menu';
/**菜单 服务层处理 */
export declare class SysMenuService {
    /**菜单服务 */
    private sysMenuRepository;
    /**角色与菜单关联服务 */
    private sysRoleMenuRepository;
    /**角色服务 */
    private sysRoleRepository;
    /**
     * 查询数据
     * @param sysMenu 信息
     * @param userId 用户ID
     * @returns []
     */
    find(sysMenu: SysMenu, userId: number): Promise<SysMenu[]>;
    /**
     * 根据ID查询信息
     * @param menuId ID
     * @returns 结果
     */
    findById(menuId: number): Promise<SysMenu>;
    /**
     * 新增信息
     * @param sysMenu 信息
     * @returns ID
     */
    insert(sysMenu: SysMenu): Promise<number>;
    /**
     * 修改信息
     * @param sysMenu 信息
     * @returns 影响记录数
     */
    update(sysMenu: SysMenu): Promise<number>;
    /**
     * 删除信息
     * @param menuId ID
     * @returns 影响记录数
     */
    deleteById(menuId: number): Promise<number>;
    /**
     * 菜单下同状态存在子节点数量
     * @param menuId 菜单ID
     * @param status 状态
     * @returns 数量
     */
    existChildrenByMenuIdAndStatus(menuId: number, status: string): Promise<number>;
    /**
     * 菜单分配给的角色数量
     * @param menuId 菜单ID
     * @returns 数量
     */
    existRoleByMenuId(menuId: number): Promise<number>;
    /**
     * 检查同级下菜单名称是否唯一
     * @param parentId 父级部门ID
     * @param menuName 菜单名称
     * @param menuId 菜单ID
     * @returns 结果
     */
    checkUniqueParentIdByMenuName(parentId: number, menuName: string, menuId: number): Promise<boolean>;
    /**
     * 检查同级下路由地址是否唯一（针对目录和菜单）
     * @param parentId 父级部门ID
     * @param menuPath 菜单路径
     * @param menuId 菜单ID
     * @returns 结果
     */
    checkUniqueParentIdByMenuPath(parentId: number, menuPath: string, menuId: number): Promise<boolean>;
    /**
     * 根据用户ID查询权限标识
     * @param userId 用户ID
     * @returns 数量
     */
    findPermsByUserId(userId: number): Promise<string[]>;
    /**
     * 根据角色ID查询菜单树信息
     * @param roleId 角色ID
     * @returns 菜单ID数组
     */
    findByRoleId(roleId: number): Promise<number[]>;
    /**
     * 根据用户ID查询菜单树状嵌套
     * @param userId 用户ID
     * @returns 结果
     */
    buildTreeMenusByUserId(userId: number): Promise<SysMenu[]>;
    /**
     * 根据用户ID查询菜单树状结构
     * @param sysMenu 信息
     * @param userId 用户ID
     * @returns 结果
     */
    buildTreeSelectByUserId(sysMenu: SysMenu, userId: number): Promise<TreeSelect[]>;
    /**
     * 将数据解析为树结构，构建前端所需要下拉树结构
     * @param arr 菜单对象数组
     * @returns 数组
     */
    private parseDataToTree;
    /**
     * 构建前端路由所需要的菜单
     * @param sysMenus 菜单数组
     * @param prefix 前缀字符
     * @returns
     */
    buildRouteMenus(sysMenus: SysMenu[], prefix?: string): Promise<Router[]>;
    /**
     * 获取路由名称
     *
     * 路径英文首字母大写
     *
     * @param sysMenu 菜单信息
     * @return 路由名称
     */
    private getRouteName;
    /**
     * 获取路由地址
     *
     * @param sysMenu 菜单信息
     * @return 路由地址
     */
    private getRouterPath;
    /**
     * 获取组件信息
     *
     * @param sysMenu 菜单信息
     * @return 组件信息
     */
    private getComponent;
    /**
     * 获取路由元信息
     *
     * @param sysMenu 菜单信息
     * @return 元信息
     */
    private getRouteMeta;
    /**
     * 获取路由重定向地址（针对目录）
     *
     * @param cMenus 子菜单数组
     * @param routerPath 当期菜单路径
     * @param prefix 菜单重定向路径前缀
     * @return 重定向地址和前缀
     */
    private getRouteRedirect;
}
