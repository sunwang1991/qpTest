/**响应-code正常成功 */
export const RESULT_CODE_SUCCESS = 200;
/**响应-code错误失败 */
export const RESULT_CODE_ERROR = 400;
/**响应-code授权过期 */
export const RESULT_CODE_ACCESS = 401;
/**响应-code系统错误 */
export const RESULT_CODE_EXPIRED = 500;

export default {
  401: '认证失败，无法访问系统资源',
  403: '当前操作没有权限',
  404: '访问资源不存在',
  default: '系统未知错误，请反馈给管理员',
};
