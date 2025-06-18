"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replace = exports.validEmail = exports.validPassword = exports.validMobile = exports.validUsername = exports.validHttp = void 0;
/**
 * 判断是否为http(s)://开头
 *
 * @param s 网络链接
 * @returns true | false
 */
function validHttp(s) {
    if (!s)
        return false;
    return /^http(s)?:\/\/+/.test(s);
}
exports.validHttp = validHttp;
/**
 * 判断是否为有效用户名格式
 *
 * 用户账号只能包含大写小写字母，数字，且不少于4位
 * @param username 用户名字符串
 * @returns true | false
 */
function validUsername(s) {
    if (!s)
        return false;
    return /[a-z0-9A-Z]{3,}$/.test(s);
}
exports.validUsername = validUsername;
/**
 * 判断是否为有效手机号格式，1开头的11位手机号
 *
 * @param s 手机号字符串
 * @returns true | false
 */
function validMobile(s) {
    if (!s)
        return false;
    return /^1[3-9]\d{9}$/.test(s);
}
exports.validMobile = validMobile;
/**
 * 判断是否为有效密码格式
 *
 * 密码至少包含大小写字母、数字、特殊符号，且不少于6位
 * @param s 密码字符串
 * @returns true | false
 */
function validPassword(s) {
    if (!s)
        return false;
    return /^(?![A-Za-z0-9]+$)(?![a-z0-9\W]+$)(?![A-Za-z\W]+$)(?![A-Z0-9\W]+$)[a-zA-Z0-9\W]{6,}$/.test(s);
}
exports.validPassword = validPassword;
/**
 * 判断是否为有效邮箱格式
 *
 * @param s 邮箱字符串
 * @returns true | false
 */
function validEmail(s) {
    if (!s)
        return false;
    return /^(([^<>()\\.,;:\s@"]+(\.[^<>()\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+\.)+[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}))$/.test(s);
}
exports.validEmail = validEmail;
/**
 * 正则替换字符串中匹配的字符串
 * @param pattern 正则表达式字符串
 * @param src 源字符串
 * @param repl 替换字符串
 * @returns 替换后的字符串
 */
function replace(pattern, src, repl) {
    return src.replace(pattern, repl);
}
exports.replace = replace;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVndWxhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9mcmFtZXdvcmsvdXRpbHMvcmVndWxhci9yZWd1bGFyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7OztHQUtHO0FBQ0gsU0FBZ0IsU0FBUyxDQUFDLENBQVM7SUFDakMsSUFBSSxDQUFDLENBQUM7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUNyQixPQUFPLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBSEQsOEJBR0M7QUFFRDs7Ozs7O0dBTUc7QUFDSCxTQUFnQixhQUFhLENBQUMsQ0FBUztJQUNyQyxJQUFJLENBQUMsQ0FBQztRQUFFLE9BQU8sS0FBSyxDQUFDO0lBQ3JCLE9BQU8sa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BDLENBQUM7QUFIRCxzQ0FHQztBQUVEOzs7OztHQUtHO0FBQ0gsU0FBZ0IsV0FBVyxDQUFDLENBQVM7SUFDbkMsSUFBSSxDQUFDLENBQUM7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUNyQixPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakMsQ0FBQztBQUhELGtDQUdDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsU0FBZ0IsYUFBYSxDQUFDLENBQVM7SUFDckMsSUFBSSxDQUFDLENBQUM7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUNyQixPQUFPLHNGQUFzRixDQUFDLElBQUksQ0FDaEcsQ0FBQyxDQUNGLENBQUM7QUFDSixDQUFDO0FBTEQsc0NBS0M7QUFFRDs7Ozs7R0FLRztBQUNILFNBQWdCLFVBQVUsQ0FBQyxDQUFTO0lBQ2xDLElBQUksQ0FBQyxDQUFDO1FBQUUsT0FBTyxLQUFLLENBQUM7SUFDckIsT0FBTyw4TkFBOE4sQ0FBQyxJQUFJLENBQ3hPLENBQUMsQ0FDRixDQUFDO0FBQ0osQ0FBQztBQUxELGdDQUtDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsU0FBZ0IsT0FBTyxDQUFDLE9BQWUsRUFBRSxHQUFXLEVBQUUsSUFBWTtJQUNoRSxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3BDLENBQUM7QUFGRCwwQkFFQyJ9