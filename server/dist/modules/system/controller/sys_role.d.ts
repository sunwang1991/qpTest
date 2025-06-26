import { Resp } from '../../../framework/resp/api';
import { SysRole } from '../model/sys_role';
/**角色信息 控制层处理 */
export declare class SysRoleController {
    /**上下文 */
    private c;
    /**角色服务 */
    private sysRoleService;
    /**用户服务 */
    private sysUserService;
    /**角色列表 */
    list(query: Record<string, string>): Promise<Resp>;
    /**角色信息详情 */
    info(roleId: number): Promise<Resp>;
    /**角色信息新增 */
    add(body: SysRole): Promise<Resp>;
    /**角色信息修改 */
    edit(body: SysRole): Promise<Resp>;
    /**角色信息删除 */
    remove(roleId: string): Promise<Resp>;
    /**角色状态变更 */
    status(roleId: number, statusFlag: string): Promise<Resp>;
    /**角色数据权限修改 */
    dataScope(roleId: number, deptIds: number[], dataScope: string, deptCheckStrictly: string): Promise<Resp>;
    /**角色分配用户列表 */
    userAuthList(query: Record<string, string>): Promise<Resp>;
    /**角色分配选择授权 */
    userAuthChecked(roleId: number, userIds: number[], auth: boolean): Promise<Resp>;
    /**导出角色信息 */
    export(query: Record<string, string>): Promise<{
        code: number;
        msg: string;
    } | import("exceljs").Buffer>;
}
