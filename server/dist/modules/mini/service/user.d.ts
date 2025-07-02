import { UserModel } from '../model/user';
/**
 * 用户信息 服务层处理
 */
export declare class UserService {
    private userRepository;
    private http;
    private sysDictDataRepository;
    /**
     * 账号注册
     * userInfo: 用户信息
     */
    register(userInfo: UserModel): Promise<UserModel | null>;
    /**
     * 检查用户是否注册
     */
    checkIsRegister(openId: string): Promise<boolean>;
    /**
     * 登录
     * openId: 用户唯一标识
     *
     */
    login(code: string): Promise<UserModel>;
    /**
     * 通过code获取openId
     * @param code
     * @returns openId
     */
    getOpenId(code: string): Promise<string>;
    /**
     * 获取用户信息
     * @param openId
     * @returns
     */
    getUserInfo(userId: string): Promise<UserModel>;
    /**
     *
     * 更新用户信息
     * @param userId
     * @param userInfo
     * @returns
     */
    updateUserInfo(userInfo: any): Promise<UserModel>;
}
