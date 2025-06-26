/**
 * 判断是否为http(s)://开头
 *
 * @param s 网络链接
 * @returns true | false
 */
export declare function validHttp(s: string): boolean;
/**
 * 判断是否为有效用户名格式
 *
 * 用户账号只能包含大写小写字母，数字，且不少于4位
 * @param username 用户名字符串
 * @returns true | false
 */
export declare function validUsername(s: string): boolean;
/**
 * 判断是否为有效手机号格式，1开头的11位手机号
 *
 * @param s 手机号字符串
 * @returns true | false
 */
export declare function validMobile(s: string): boolean;
/**
 * 判断是否为有效密码格式
 *
 * 密码至少包含大小写字母、数字、特殊符号，且不少于6位
 * @param s 密码字符串
 * @returns true | false
 */
export declare function validPassword(s: string): boolean;
/**
 * 判断是否为有效邮箱格式
 *
 * @param s 邮箱字符串
 * @returns true | false
 */
export declare function validEmail(s: string): boolean;
/**
 * 正则替换字符串中匹配的字符串
 * @param pattern 正则表达式字符串
 * @param src 源字符串
 * @param repl 替换字符串
 * @returns 替换后的字符串
 */
export declare function replace(pattern: string, src: string, repl: string): string;
