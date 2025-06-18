/**缓存信息对象 */
export declare class SysCache {
    /**缓存名称 */
    cacheName: string;
    /**缓存键名 */
    cacheKey: string;
    /**缓存内容 */
    cacheValue: string;
    /**备注 */
    remark: string;
    /**
     * 实例缓存名称列表项
     * @param cacheName 缓存名称
     * @param cacheKey 缓存键名
     */
    newNames(cacheName: string, cacheKey: string): this;
    /**
     * 实例缓存键名列表项
     * @param cacheName 缓存名称
     * @param cacheKey 缓存键名
     */
    newKeys(cacheName: string, cacheKey: string): this;
    /**
     * 实例缓存键名内容项
     * @param cacheName 缓存名称
     * @param cacheKey 缓存键名
     * @param cacheValue 缓存内容
     */
    newValue(cacheName: string, cacheKey: string, cacheValue: string): this;
}
