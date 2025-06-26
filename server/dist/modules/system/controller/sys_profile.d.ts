import { Resp } from '../../../framework/resp/api';
/**个人信息 控制层处理 */
export declare class SysProfileController {
    /**上下文 */
    private c;
    /**Token工具 */
    private token;
    /**用户服务 */
    private sysUserService;
    /**角色服务 */
    private sysRoleService;
    /**岗位服务 */
    private sysPostService;
    /**个人信息 */
    info(): Promise<Resp>;
    /**个人信息修改 */
    updateProfile(nickName: string, sex: string, phone: string, email: string, avatar: string): Promise<Resp>;
    /**个人重置密码 */
    updatePassword(oldPassword: string, newPassword: string): Promise<Resp>;
}
