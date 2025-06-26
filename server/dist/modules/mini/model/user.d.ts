import { CommonBase } from '../../common/model/Base';
/**用户信息表 */
export declare class UserModel extends CommonBase {
    /**微信openId */
    openId: string;
    /**手机号码 */
    phone: string;
    /**用户昵称 */
    nickName: string;
    /**用户性别（0未知 1男 2女） */
    sex: string;
    /**头像地址 */
    avatar: string;
    /**帐号状态（0停用 1正常） */
    statusFlag: string;
    /**最后登录IP */
    loginIp: string;
    /**最后登录时间 */
    loginTime: number;
    /**备注 */
    remark: string;
}
