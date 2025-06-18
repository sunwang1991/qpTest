import request from '@/utils/request';

// 查询操作日志列表
export function list(query) {
  return request({
    url: '/system/log/operate/list',
    method: 'get',
    params: query,
  });
}

/**
 * 清空操作日志
 * @returns object
 */
export function cleanSysLogOperate() {
  return request({
    url: '/system/log/operate/clean',
    method: 'delete',
  });
}
