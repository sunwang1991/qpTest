import { IMiddleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';
/**操作日志-业务操作类型枚举 */
export declare enum BUSINESS_TYPE {
    /**其它 */
    OTHER = "0",
    /**新增 */
    INSERT = "1",
    /**修改 */
    UPDATE = "2",
    /**删除 */
    DELETE = "3",
    /**授权 */
    GRANT = "4",
    /**导出 */
    EXPORT = "5",
    /**导入 */
    IMPORT = "6",
    /**强退 */
    FORCE = "7",
    /**清空数据 */
    CLEAN = "8"
}
/** 操作日志参数 */
interface Options {
    /**标题 */
    title: string;
    /**类型 */
    businessType: BUSINESS_TYPE;
    /**是否保存请求的参数 */
    isSaveRequestData?: boolean;
    /**是否保存响应的参数 */
    isSaveResponseData?: boolean;
}
/**访问操作日志记录-中间件 */
export declare class OperateLog implements IMiddleware<Context, NextFunction> {
    resolve(_: any, options: Options): (c: Context, next: NextFunction) => Promise<any>;
    static getName(): string;
}
/**
 * 访问操作日志记录-中间件
 *
 * 请在用户身份授权认证校验后使用以便获取登录用户信息
 * @param options 操作日志参数
 */
export declare function OperateLogMiddleware(options: Options): import("@midwayjs/core").CompositionMiddleware<import("@midwayjs/core").Context, unknown, unknown>;
export {};
