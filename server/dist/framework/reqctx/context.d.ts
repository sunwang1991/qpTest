import { type Context } from '@midwayjs/koa';
/**
 * 解析请求头携带的令牌
 * @param c 上下文对象
 * @returns token字符串
 */
export declare function authorization(c: Context): string;
/**
 * 用户是否为系统管理员
 * @param c 上下文对象
 * @param userId 用户ID
 * @returns boolen
 */
export declare function isSystemUser(c: Context, userId: number): boolean;
