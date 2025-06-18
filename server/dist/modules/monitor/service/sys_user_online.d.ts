import { UserInfo } from '../../../framework/token/user_info';
import { SysUserOnline } from '../model/sys_user_online';
/**在线用户 服务层处理 */
export declare class SysUserOnlineService {
    /**
     * 在线用户信息
     *
     * @param info 登录用户信息
     * @return 在线用户
     */
    userInfoToUserOnline(info: UserInfo): Promise<SysUserOnline>;
}
