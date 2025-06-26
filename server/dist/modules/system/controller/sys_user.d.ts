/// <reference types="node" />
/// <reference types="node" />
import { Resp } from '../../../framework/resp/api';
import { SysUser } from '../model/sys_user';
/**用户信息 控制层处理 */
export declare class SysUserController {
    /**上下文 */
    private c;
    /**配置信息 */
    private config;
    /**文件服务 */
    private fileUtil;
    /**用户服务 */
    private sysUserService;
    /**角色服务 */
    private sysRoleService;
    /**岗位服务 */
    private sysPostService;
    /**账号身份操作服务 */
    private accountService;
    /**用户信息列表 */
    list(query: Record<string, string>): Promise<Resp>;
    /**用户信息详情 */
    info(userId: number): Promise<Resp>;
    /**用户信息新增 */
    add(body: SysUser): Promise<Resp>;
    /**用户信息修改 */
    edit(body: SysUser): Promise<Resp>;
    /**用户信息删除 */
    remove(userId: string): Promise<Resp>;
    /**用户密码修改 */
    password(userId: number, password: string): Promise<Resp>;
    /**用户状态修改 */
    status(userId: number, statusFlag: string): Promise<Resp>;
    /**用户账户解锁 */
    unlock(userName: string): Promise<Resp>;
    /**用户信息列表导出 */
    export(query: Record<string, string>): Promise<{
        code: number;
        msg: string;
    } | import("exceljs").Buffer>;
    /**用户信息列表导入模板下载 */
    template(): Promise<Buffer | "failed to read file">;
    /**用户信息列表导入 */
    import(filePath: string, update: boolean): Promise<Resp>;
}
