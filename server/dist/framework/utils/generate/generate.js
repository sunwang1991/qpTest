"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNumber = exports.generateString = exports.generateCode = void 0;
const nanoid_1 = require("nanoid");
// V4 不支持commonjs
// https://github.com/ai/nanoid#readme
// 查看重复率 https://zelark.github.io/nano-id-cc/
/**
 * 生成随机Hash
 * 包含数字、小写字母
 * @param size 长度
 * @returns string 不保证长度满足
 */
function generateCode(size) {
    const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
    const nanoid = (0, nanoid_1.customAlphabet)(alphabet, size);
    return nanoid();
}
exports.generateCode = generateCode;
/**
 * 生成随机字符串
 * 包含数字、大小写字母、下划线、横杠
 * @param size 长度
 * @returns string 不保证长度满足
 */
function generateString(size) {
    return (0, nanoid_1.nanoid)(size);
}
exports.generateString = generateString;
/**
 * 随机数 纯数字0-9
 * @param size 长度
 * @returns 字符串
 */
function generateNumber(size) {
    let str = '';
    for (let i = 0; i < size; i++) {
        const digit = Math.floor(Math.random() * 10);
        str += digit.toString();
    }
    return str;
}
exports.generateNumber = generateNumber;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZnJhbWV3b3JrL3V0aWxzL2dlbmVyYXRlL2dlbmVyYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFnRDtBQUNoRCxpQkFBaUI7QUFDakIsc0NBQXNDO0FBQ3RDLDZDQUE2QztBQUU3Qzs7Ozs7R0FLRztBQUNILFNBQWdCLFlBQVksQ0FBQyxJQUFZO0lBQ3ZDLE1BQU0sUUFBUSxHQUFHLHNDQUFzQyxDQUFDO0lBQ3hELE1BQU0sTUFBTSxHQUFHLElBQUEsdUJBQWMsRUFBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDOUMsT0FBTyxNQUFNLEVBQUUsQ0FBQztBQUNsQixDQUFDO0FBSkQsb0NBSUM7QUFFRDs7Ozs7R0FLRztBQUNILFNBQWdCLGNBQWMsQ0FBQyxJQUFZO0lBQ3pDLE9BQU8sSUFBQSxlQUFNLEVBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEIsQ0FBQztBQUZELHdDQUVDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQWdCLGNBQWMsQ0FBQyxJQUFZO0lBQ3pDLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUNiLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDN0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDN0MsR0FBRyxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUN6QjtJQUNELE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQVBELHdDQU9DIn0=