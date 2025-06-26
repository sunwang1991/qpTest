"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.md5 = exports.sha256Hmac = exports.sha256ToBase64 = void 0;
const crypto_1 = require("crypto");
/**
 * SHA-256哈希并编码为Base64 URL格式
 * @param str 原始字符串
 * @returns Base64 URL编码的SHA-256哈希字符串
 */
function sha256ToBase64(str) {
    const hash = (0, crypto_1.createHash)('sha256');
    hash.update(str);
    const base64Hash = hash.digest('base64');
    // 将Base64编码中的'+'替换为'-'，'/'替换为'_'，并去掉尾部的'='
    const base64UrlHash = base64Hash
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    return base64UrlHash;
}
exports.sha256ToBase64 = sha256ToBase64;
/**
 * SHA-256 HMAC算法
 * @param key 密钥
 * @param data 数据
 * @returns HMAC值的十六进制字符串
 */
function sha256Hmac(key, data) {
    const hmac = (0, crypto_1.createHmac)('sha256', key);
    hmac.update(data);
    return hmac.digest('hex');
}
exports.sha256Hmac = sha256Hmac;
/**
 * md5加密
 * @param str 原始字符
 * @returns 加密字符串
 */
function md5(str) {
    const hash = (0, crypto_1.createHash)('md5');
    hash.update(str);
    return hash.digest('hex');
}
exports.md5 = md5;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9mcmFtZXdvcmsvdXRpbHMvY3J5cHRvL2hhc2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQWdEO0FBRWhEOzs7O0dBSUc7QUFDSCxTQUFnQixjQUFjLENBQUMsR0FBVztJQUN4QyxNQUFNLElBQUksR0FBRyxJQUFBLG1CQUFVLEVBQUMsUUFBUSxDQUFDLENBQUM7SUFDbEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqQixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRXpDLDJDQUEyQztJQUMzQyxNQUFNLGFBQWEsR0FBRyxVQUFVO1NBQzdCLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDO1NBQ25CLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDO1NBQ25CLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFFdEIsT0FBTyxhQUFhLENBQUM7QUFDdkIsQ0FBQztBQVpELHdDQVlDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFnQixVQUFVLENBQUMsR0FBVyxFQUFFLElBQVk7SUFDbEQsTUFBTSxJQUFJLEdBQUcsSUFBQSxtQkFBVSxFQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN2QyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBSkQsZ0NBSUM7QUFFRDs7OztHQUlHO0FBQ0gsU0FBZ0IsR0FBRyxDQUFDLEdBQVc7SUFDN0IsTUFBTSxJQUFJLEdBQUcsSUFBQSxtQkFBVSxFQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9CLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDakIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVCLENBQUM7QUFKRCxrQkFJQyJ9