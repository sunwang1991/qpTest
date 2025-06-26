import { Resp } from '../../../framework/resp/api';
/**缓存信息 控制层处理 */
export declare class CacheController {
    /**缓存服务 */
    private redisCache;
    /**Redis信息 */
    info(): Promise<Resp>;
    /**缓存名称列表 */
    names(): Promise<Resp>;
    /**缓存名称下键名列表 */
    keys(cacheName: string): Promise<Resp>;
    /**缓存内容信息 */
    value(cacheName: string, cacheKey: string): Promise<Resp>;
    /**缓存名称列表安全删除 */
    cleanNames(): Promise<Resp>;
    /**缓存名称下键名删除 */
    cleanKeys(cacheName: string): Promise<Resp>;
    /**缓存内容删除 */
    clearCacheKey(cacheName: string, cacheKey: string): Promise<Resp>;
}
