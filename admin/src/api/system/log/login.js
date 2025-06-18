import request from '@/utils/request';

// 查询登录日志列表
export function list(query) {
  return request({
    url: '/system/log/login/list',
    method: 'get',
    params: query,
  });
}

// 清空登录日志
export function cleanSysLogLogin() {
  return request({
    url: '/system/log/login/clean',
    method: 'delete',
  });
}
