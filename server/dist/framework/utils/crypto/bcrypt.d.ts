/**
 * Bcrypt密码加密
 * @param originStr 原始密码
 * @returns 加密字符串
 */
export declare function bcryptHash(originStr: string): Promise<string>;
/**
 * Bcrypt密码匹配检查
 * @param originStr 原始密码
 * @param hashStr 加密字符串
 * @returns 是否匹配
 */
export declare function bcryptCompare(originStr: string, hashStr: string): Promise<boolean>;
