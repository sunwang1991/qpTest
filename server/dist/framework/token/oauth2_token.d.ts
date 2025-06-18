import { Oauth2Info } from './oauth2_info';
/**第三方客户端令牌工具验证处理 */
export declare class Oauth2TokenService {
    /**缓存服务 */
    private redis;
    /**配置信息 */
    private config;
    /**
     * 生成令牌
     * @param clientId 客户端ID
     * @param deviceFingerprint 设备指纹 SHA256
     * @param tokenType 令牌类型 access:访问令牌 refresh:刷新令牌
     * @returns [令牌, 过期时间]
     */
    oauth2TokenCreate(clientId: string, deviceFingerprint: string, tokenType: 'access' | 'refresh'): Promise<[string, number]>;
    /**
     * 校验令牌是否有效
     * @param tokenStr 身份令牌
     * @param tokenType 令牌类型 access:访问令牌 refresh:刷新令牌
     * @returns [令牌负荷, 错误信息]
     */
    oauth2TokenVerify(tokenStr: string, tokenType: 'access' | 'refresh'): Promise<[Record<string, any>, string]>;
    /**
     * 清除登录第三方客户端信息
     * @param tokenStr 身份令牌
     * @returns [用户名, 错误信息]
     */
    oauth2InfoRemove(tokenStr: string): Promise<[string, string]>;
    /**
     * 生成访问第三方客户端信息缓存
     * @param info 登录用户信息对象
     * @param deviceFingerprint 设备指纹 SHA256
     * @param ilobArr 登录客户端信息 [IP, 地点, 系统, 浏览器]
     * @returns 登录用户信息对象
     */
    oauth2InfoCreate(info: Oauth2Info, deviceFingerprint: string, ilobArr: string[]): Promise<Oauth2Info>;
    /**
     * 更新访问第三方客户端信息缓存
     * @param info 登录用户信息对象
     */
    oauth2InfoUpdate(info: Oauth2Info): Promise<void>;
    /**
     * 缓存的登录第三方客户端信息
     * @param claims 令牌信息
     * @returns 身份信息
     */
    oauth2InfoGet(claims: Record<string, any>): Promise<Oauth2Info>;
}
