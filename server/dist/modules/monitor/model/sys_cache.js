"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SysCache = void 0;
/**缓存信息对象 */
class SysCache {
    /**缓存名称 */
    cacheName;
    /**缓存键名 */
    cacheKey;
    /**缓存内容 */
    cacheValue;
    /**备注 */
    remark;
    /**
     * 实例缓存名称列表项
     * @param cacheName 缓存名称
     * @param cacheKey 缓存键名
     */
    newNames(cacheName, cacheKey) {
        this.cacheName = cacheKey;
        this.cacheKey = '';
        this.cacheValue = '';
        this.remark = cacheName;
        return this;
    }
    /**
     * 实例缓存键名列表项
     * @param cacheName 缓存名称
     * @param cacheKey 缓存键名
     */
    newKeys(cacheName, cacheKey) {
        this.cacheName = cacheName;
        this.cacheKey = cacheKey.replace(cacheName + ':', '');
        this.cacheValue = '';
        this.remark = '';
        return this;
    }
    /**
     * 实例缓存键名内容项
     * @param cacheName 缓存名称
     * @param cacheKey 缓存键名
     * @param cacheValue 缓存内容
     */
    newValue(cacheName, cacheKey, cacheValue) {
        this.cacheName = cacheName;
        this.cacheKey = cacheKey;
        this.cacheValue = cacheValue;
        this.remark = '';
        return this;
    }
}
exports.SysCache = SysCache;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX2NhY2hlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvbW9uaXRvci9tb2RlbC9zeXNfY2FjaGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsWUFBWTtBQUNaLE1BQWEsUUFBUTtJQUNuQixVQUFVO0lBQ1YsU0FBUyxDQUFTO0lBRWxCLFVBQVU7SUFDVixRQUFRLENBQVM7SUFFakIsVUFBVTtJQUNWLFVBQVUsQ0FBUztJQUVuQixRQUFRO0lBQ1IsTUFBTSxDQUFTO0lBRWY7Ozs7T0FJRztJQUNJLFFBQVEsQ0FBQyxTQUFpQixFQUFFLFFBQWdCO1FBQ2pELElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO1FBQ3hCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxPQUFPLENBQUMsU0FBaUIsRUFBRSxRQUFnQjtRQUNoRCxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUNyQixJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNqQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLFFBQVEsQ0FBQyxTQUFpQixFQUFFLFFBQWdCLEVBQUUsVUFBa0I7UUFDckUsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDakIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0NBQ0Y7QUFwREQsNEJBb0RDIn0=