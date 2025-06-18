import { Resp } from '../../../framework/resp/api';
/**在线用户信息 控制层处理 */
export declare class SysUserOnlineController {
    /**上下文 */
    private c;
    /**缓存服务 */
    private redisCache;
    /**在线用户服务 */
    private sysUserOnlineService;
    /**
     * 在线用户列表
     */
    list(loginIp: string, userName: string): Promise<Resp>;
    /**
     * 在线用户强制退出
     */
    logout(tokenId: string): Promise<Resp>;
}
