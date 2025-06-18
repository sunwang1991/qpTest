import { type Context } from '@midwayjs/koa';
/**
 * 解析ip地址
 * @param c 上下文对象
 * @returns [ip地址, 地理位置]
 */
export declare function ipaddrLocation(c: Context): Promise<[string, string]>;
/**
 * 解析请求用户代理信息
 * @param c 上下文对象
 * @returns [操作系统, 浏览器]
 */
export declare function uaOsBrowser(c: Context): Promise<[string, string]>;
/**
 * 设备指纹信息
 * @param c 上下文对象
 * @returns 字符
 */
export declare function deviceFingerprint(c: Context, v: string | number): Promise<string>;
