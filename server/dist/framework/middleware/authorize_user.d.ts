import { IMiddleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';
/** 授权限制参数 */
interface Options {
    /**只需含有其中角色 */
    hasRoles?: string[];
    /**只需含有其中权限 */
    hasPerms?: string[];
    /**同时匹配其中角色 */
    matchRoles?: string[];
    /**同时匹配其中权限 */
    matchPerms?: string[];
}
/**用户身份授权认证校验-中间件 */
export declare class AuthorizeUser implements IMiddleware<Context, NextFunction> {
    resolve(_: any, options: Options): (c: Context, next: NextFunction) => Promise<any>;
    static getName(): string;
}
/**
 * 用户身份授权认证校验-中间件
 *
 * @param options 授权限制参数
 */
export declare function AuthorizeUserMiddleware(options?: Options): import("@midwayjs/core").CompositionMiddleware<import("@midwayjs/core").Context, unknown, unknown>;
export {};
