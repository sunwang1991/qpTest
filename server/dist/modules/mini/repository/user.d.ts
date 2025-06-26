import { UserModel } from '../model/user';
/**用户表 数据层处理 */
export declare class UserRepository {
    private db;
    /**
     * 通过openId查询
     *
     * @param openId
     * @return 信息
     */
    selectByOpenId(openId: string): Promise<UserModel>;
    /**
     * 插入数据
     *
     * @param userInfo
     * @return 信息
     */
    insertUserInfo(userInfo: any): Promise<UserModel>;
    /**
     * 通过userId查询用户信息
     * @param id
     */
    selectById(userId: string): Promise<UserModel>;
    /**
     * 更新用户信息
     * @param userInfo
     */
    updateUserInfo(userInfo: any): Promise<any>;
}
