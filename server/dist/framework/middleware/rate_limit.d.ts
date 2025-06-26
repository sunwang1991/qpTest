import { IMiddleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';
/**默认策略全局限流 */
export declare const LIMIT_GLOBAL = 1;
/**根据请求者IP进行限流 */
export declare const LIMIT_IP = 2;
/**根据用户ID进行限流 */
export declare const LIMIT_USER = 3;
/** 限流参数 */
interface RateLimitOptions {
    /**限流时间,单位秒 */
    time: number;
    /**限流次数 */
    count: number;
    /**限流条件类型 */
    type: number;
}
/**请求限流-中间件 */
export declare class RateLimit implements IMiddleware<Context, NextFunction> {
    resolve(x: any, options: RateLimitOptions): (c: Context, next: NextFunction) => Promise<any>;
    static getName(): string;
}
/**
 * 请求限流-中间件
 *
 * 示例参数：`{ time: 5, count: 10, type: LIMIT_IP }`
 *
 * 参数表示：5秒内，最多请求10次，类型记录IP
 *
 * 使用 `LIMIT_USER` 时，请在用户身份授权认证校验后使用
 * 以便获取登录用户信息，无用户信息时默认为 `LIMIT_GLOBAL`
 * @param options 限流参数
 */
export declare function RateLimitMiddleware(options: RateLimitOptions): import("@midwayjs/core").CompositionMiddleware<import("@midwayjs/core").Context, unknown, unknown>;
export {};
