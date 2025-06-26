import { Resp } from '../../../framework/resp/api';
import { SysMenu } from '../model/sys_menu';
/**菜单信息 控制层处理 */
export declare class SysMenuController {
    /**上下文 */
    private c;
    /**配置信息 */
    private config;
    /**菜单服务 */
    private sysMenuService;
    /**菜单列表 */
    list(menuName: string, statusFlag: string): Promise<Resp>;
    /**菜单信息 */
    info(menuId: number): Promise<Resp>;
    /**菜单新增 */
    add(body: SysMenu): Promise<Resp>;
    /**菜单修改 */
    edit(body: SysMenu): Promise<Resp>;
    /**菜单删除 */
    remove(menuId: number): Promise<Resp>;
    /**菜单树结构列表 */
    tree(menuName: string, statusFlag: string): Promise<Resp>;
    /**菜单树结构列表（指定角色） */
    treeRole(roleId: number, menuName: string, statusFlag: string): Promise<Resp>;
}
