import { type Context } from '@midwayjs/koa';
import { UserInfo } from '../token/user_info';
/**
 * 登录用户信息
 * @param c 上下文对象
 * @returns 登录用户信息
 */
export declare function loginUser(c: Context): [UserInfo, string];
/**
 * 登录用户信息-用户ID
 * @param c 上下文对象
 * @returns 用户ID
 */
export declare function loginUserToUserID(c: Context): number;
/**
 * 登录用户信息-用户名称
 * @param c 上下文对象
 * @returns 用户名称
 */
export declare function loginUserToUserName(c: Context): string;
/**
 * 登录用户信息-包含角色KEY
 * @param c 上下文对象
 * @returns boolen
 */
export declare function loginUserByContainRoles(c: Context, target: string): boolean;
/**
 * 登录用户信息-包含权限标识
 * @param c 上下文对象
 * @returns boolen
 */
export declare function loginUserByContainPerms(c: Context, target: string): boolean;
/**
 * 登录用户信息-角色数据范围过滤SQL字符串
 * @param c 上下文对象
 * @param deptAlias 部门表别名
 * @param userAlias 用户表别名
 * @return SQL字符串 (...)
 */
export declare function loginUserToDataScopeSQL(c: Context, deptAlias: string, userAlias: string): string;
