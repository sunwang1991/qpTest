/**
 * 生成随机Hash
 * 包含数字、小写字母
 * @param size 长度
 * @returns string 不保证长度满足
 */
export declare function generateCode(size: number): string;
/**
 * 生成随机字符串
 * 包含数字、大小写字母、下划线、横杠
 * @param size 长度
 * @returns string 不保证长度满足
 */
export declare function generateString(size: number): string;
/**
 * 随机数 纯数字0-9
 * @param size 长度
 * @returns 字符串
 */
export declare function generateNumber(size: number): string;
