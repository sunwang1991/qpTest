import request from '@/utils/request';

/**
 * 登录方法
 * @param data 数据
 * @returns 结果
 */
export function login(data) {
  return request({
    url: '/auth/login',
    headers: {
      isToken: false,
    },
    method: 'post',
    data: data,
  });
}

// 注册方法
export function register(data) {
  return request({
    url: '/auth/register',
    headers: {
      isToken: false,
    },
    method: 'post',
    data: data,
  });
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/me',
    method: 'get',
  });
}

/**
 * 退出方法
 * @returns object
 */
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post',
  });
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captcha-image',
    headers: {
      isToken: false,
    },
    method: 'get',
    timeout: 20000,
  });
}

// 刷新登录令牌
export function refreshToken(refreshToken) {
  return request({
    url: '/auth/refresh-token',
    headers: {
      isToken: false,
    },
    method: 'post',
    data: { refreshToken },
  });
}

// 获取路由
export const getRouters = () => {
  return request({
    url: '/router',
    method: 'get',
  });
};
