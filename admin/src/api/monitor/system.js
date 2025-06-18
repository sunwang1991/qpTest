import request from '@/utils/request';

/**服务器服务信息 */
export function getSystemInfo() {
  return request({
    url: '/monitor/system',
    method: 'get',
  });
}
