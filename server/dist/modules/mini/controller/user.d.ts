import { Resp } from '../../../framework/resp/api';
import { UserModel } from '../model/user';
/**
 * 用户信息
 *
 */
export declare class UserController {
    /**用户服务 */
    private userService;
    /**用户注册 */
    register(user: UserModel): Promise<Resp>;
    /**用户登录 */
    login(data: {
        code: string;
    }): Promise<Resp>;
    /**用户信息 */
    info(data: {
        id: string;
    }): Promise<Resp>;
    /**
     * 更新用户信息
     * @param data
     */
    update(data: {
        id: string;
        avatar: string;
        nickName: string;
    }): Promise<Resp>;
}
