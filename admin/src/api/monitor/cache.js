import request from '@/utils/request';

// 查询缓存详细
export function getCache() {
  return request({
    url: '/monitor/cache',
    method: 'get',
  });
}

// 查询缓存名称列表
export function listCacheName() {
  return request({
    url: '/monitor/cache/names',
    method: 'get',
  });
}

// 查询缓存键名列表
export function listCacheKey(cacheName) {
  return request({
    url: `/monitor/cache//keys`,
    method: 'get',
    params: { cacheName },
  });
}

// 查询缓存内容
export function getCacheValue(cacheName, cacheKey) {
  return request({
    url: `/monitor/cache/value`,
    method: 'get',
    params: { cacheName, cacheKey },
  });
}

// 清理指定名称缓存
export function clearCacheName(cacheName) {
  return request({
    url: `/monitor/cache/keys`,
    method: 'delete',
    params: { cacheName },
  });
}

// 清理指定键名缓存
export function clearCacheKey(cacheName, cacheKey) {
  return request({
    url: `/monitor/cache/value`,
    method: 'delete',
    params: { cacheName, cacheKey },
  });
}

// 安全清理缓存名称
export function clearCacheAll() {
  return request({
    url: '/monitor/cache/names',
    method: 'delete',
  });
}
