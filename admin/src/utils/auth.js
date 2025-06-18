import Cookies from 'js-cookie';
import {
  TOKEN_ACCESS_COOKIE,
  TOKEN_REFRESH_COOKIE,
} from '@/constants/token-constants';

/**获取访问令牌 */
export function getAccessToken() {
  return Cookies.get(TOKEN_ACCESS_COOKIE) || '';
}

/**
 * 设置访问令牌
 * @param token token字符串
 * @param exp 过期时间（秒）
 */
export function setAccessToken(token, exp) {
  const expires = new Date(new Date().getTime() + exp * 1000);
  Cookies.set(TOKEN_ACCESS_COOKIE, token, { expires });
}

/**移除访问令牌 */
export function delAccessToken() {
  Cookies.remove(TOKEN_ACCESS_COOKIE);
}

/**获取刷新令牌 */
export function getRefreshToken() {
  return Cookies.get(TOKEN_REFRESH_COOKIE) || '';
}

/**
 * 设置刷新令牌
 * @param token token字符串
 * @param exp 过期时间（秒）
 */
export function setRefreshToken(token, exp) {
  const expires = new Date(new Date().getTime() + exp * 1000);
  Cookies.set(TOKEN_REFRESH_COOKIE, token, { expires });
}

/**移除刷新令牌 */
export function delRefreshToken() {
  Cookies.remove(TOKEN_REFRESH_COOKIE);
}
