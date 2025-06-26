"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uaInfo = void 0;
// 依赖来源 https://github.com/faisalman/ua-parser-js
const ua_parser_js_1 = require("ua-parser-js");
/**
 * 获取user-agent信息
 * @param userAgent 请求头 user-agent
 * @returns 信息对象
 */
function uaInfo(userAgent) {
    return new ua_parser_js_1.UAParser(userAgent);
}
exports.uaInfo = uaInfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidWEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZnJhbWV3b3JrL3V0aWxzL3VhL3VhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlEQUFpRDtBQUNqRCwrQ0FBd0M7QUFDeEM7Ozs7R0FJRztBQUNILFNBQWdCLE1BQU0sQ0FBQyxTQUFpQjtJQUN0QyxPQUFPLElBQUksdUJBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBRkQsd0JBRUMifQ==