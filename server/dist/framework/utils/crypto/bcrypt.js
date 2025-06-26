"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bcryptCompare = exports.bcryptHash = void 0;
const bcrypt_1 = require("@node-rs/bcrypt");
/**
 * Bcrypt密码加密
 * @param originStr 原始密码
 * @returns 加密字符串
 */
async function bcryptHash(originStr) {
    return await (0, bcrypt_1.hash)(originStr, 10);
}
exports.bcryptHash = bcryptHash;
/**
 * Bcrypt密码匹配检查
 * @param originStr 原始密码
 * @param hashStr 加密字符串
 * @returns 是否匹配
 */
async function bcryptCompare(originStr, hashStr) {
    return await (0, bcrypt_1.verify)(originStr, hashStr);
}
exports.bcryptCompare = bcryptCompare;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmNyeXB0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2ZyYW1ld29yay91dGlscy9jcnlwdG8vYmNyeXB0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDRDQUErQztBQUUvQzs7OztHQUlHO0FBQ0ksS0FBSyxVQUFVLFVBQVUsQ0FBQyxTQUFpQjtJQUNoRCxPQUFPLE1BQU0sSUFBQSxhQUFJLEVBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFGRCxnQ0FFQztBQUVEOzs7OztHQUtHO0FBQ0ksS0FBSyxVQUFVLGFBQWEsQ0FDakMsU0FBaUIsRUFDakIsT0FBZTtJQUVmLE9BQU8sTUFBTSxJQUFBLGVBQU0sRUFBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDMUMsQ0FBQztBQUxELHNDQUtDIn0=