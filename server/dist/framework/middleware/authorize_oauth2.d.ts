import { IMiddleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';
/**客户端授权认证校验-中间件 */
export declare class AuthorizeOauth2 implements IMiddleware<Context, NextFunction> {
    resolve(_: any, scope: string[]): (c: Context, next: NextFunction) => Promise<any>;
    static getName(): string;
}
/**
 * 客户端授权认证校验-中间件
 *
 * @param scope 授权范围数组
 */
export declare function AuthorizeOauth2Middleware(scope: string[]): import("@midwayjs/core").CompositionMiddleware<import("@midwayjs/core").Context, unknown, unknown>;
