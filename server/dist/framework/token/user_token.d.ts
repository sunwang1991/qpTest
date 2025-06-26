import { UserInfo } from './user_info';
/**系统用户令牌工具验证处理 */
export declare class UserTokenService {
    /**缓存服务 */
    private redis;
    /**配置信息 */
    private config;
    /**
     * 生成令牌
     * @param userId 用户ID
     * @param deviceFingerprint 设备指纹 SHA256
     * @param tokenType 令牌类型 access:访问令牌 refresh:刷新令牌
     * @returns [令牌, 过期时间]
     */
    userTokenCreate(userId: number, deviceFingerprint: string, tokenType: 'access' | 'refresh'): Promise<[string, number]>;
    /**
     * 校验令牌是否有效
     * @param token 身份令牌
     * @param tokenType 令牌类型 access:访问令牌 refresh:刷新令牌
     * @returns [令牌负荷, 错误信息]
     */
    userTokenVerify(token: string, tokenType: 'access' | 'refresh'): Promise<[Record<string, any>, string]>;
    /**
     * 清除访问用户信息缓存
     * @param token 身份令牌
     * @returns [用户名, 错误信息]
     */
    userInfoRemove(token: string): Promise<[string, string]>;
    /**
     * 生成访问用户信息缓存
     * @param info 登录用户信息对象
     * @param deviceFingerprint 设备指纹 SHA256
     * @param ilobArr 登录客户端信息 [IP, 地点, 系统, 浏览器]
     * @returns 登录用户信息对象
     */
    userInfoCreate(info: UserInfo, deviceFingerprint: string, ilobArr: string[]): Promise<UserInfo>;
    /**
     * 更新访问用户信息缓存
     * @param info 登录用户信息对象
     */
    UserInfoUpdate(info: UserInfo): Promise<void>;
    /**
     * 缓存的访问用户信息
     * @param claims 令牌信息
     * @returns 身份信息
     */
    userInfoGet(claims: Record<string, any>): Promise<UserInfo>;
}
