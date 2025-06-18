import { SysDept } from './sys_dept';
import { SysRole } from './sys_role';
/**用户信息表 */
export declare class SysUser {
    /**用户ID */
    userId: number;
    /**部门ID */
    deptId: number;
    /**用户账号 */
    userName: string;
    /**用户邮箱 */
    email: string;
    /**手机号码 */
    phone: string;
    /**用户昵称 */
    nickName: string;
    /**用户性别（0未知 1男 2女） */
    sex: string;
    /**头像地址 */
    avatar: string;
    /**密码 */
    password: string;
    /**帐号状态（0停用 1正常） */
    statusFlag: string;
    /**删除标志（0代表存在 1代表删除） */
    delFlag: string;
    /**最后登录IP */
    loginIp: string;
    /**最后登录时间 */
    loginTime: number;
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
    /**部门对象 */
    dept: SysDept;
    /**角色对象组 */
    roles: SysRole[];
    /**角色ID */
    roleId: string;
    /**角色组 */
    roleIds: number[];
    /**岗位组 */
    postIds: number[];
}
