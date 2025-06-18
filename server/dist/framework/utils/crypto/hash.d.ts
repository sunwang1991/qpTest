/**
 * SHA-256哈希并编码为Base64 URL格式
 * @param str 原始字符串
 * @returns Base64 URL编码的SHA-256哈希字符串
 */
export declare function sha256ToBase64(str: string): string;
/**
 * SHA-256 HMAC算法
 * @param key 密钥
 * @param data 数据
 * @returns HMAC值的十六进制字符串
 */
export declare function sha256Hmac(key: string, data: string): string;
/**
 * md5加密
 * @param str 原始字符
 * @returns 加密字符串
 */
export declare function md5(str: string): string;
