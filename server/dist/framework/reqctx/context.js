"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSystemUser = exports.authorization = void 0;
const token_1 = require("../constants/token");
/**
 * 解析请求头携带的令牌
 * @param c 上下文对象
 * @returns token字符串
 */
function authorization(c) {
    const authHeader = c.get(token_1.HEADER_KEY);
    if (!authHeader) {
        return '';
    }
    // 拆分 Authorization 请求头，提取 JWT 令牌部分
    const tokenStr = authHeader.replace(token_1.HEADER_PREFIX, '');
    if (tokenStr.length > 64) {
        return tokenStr.trim();
    }
    return '';
}
exports.authorization = authorization;
/**
 * 用户是否为系统管理员
 * @param c 上下文对象
 * @param userId 用户ID
 * @returns boolen
 */
function isSystemUser(c, userId) {
    if (userId <= 0)
        return false;
    // 从配置中获取系统管理员ID列表
    const configUser = c.app.getConfig('systemUser');
    if (Array.isArray(configUser.system)) {
        return configUser.system.includes(userId);
    }
    return false;
}
exports.isSystemUser = isSystemUser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mcmFtZXdvcmsvcmVxY3R4L2NvbnRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsOENBQStEO0FBRS9EOzs7O0dBSUc7QUFDSCxTQUFnQixhQUFhLENBQUMsQ0FBVTtJQUN0QyxNQUFNLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLGtCQUFVLENBQUMsQ0FBQztJQUNyQyxJQUFJLENBQUMsVUFBVSxFQUFFO1FBQ2YsT0FBTyxFQUFFLENBQUM7S0FDWDtJQUNELG1DQUFtQztJQUNuQyxNQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLHFCQUFhLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDdkQsSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLEVBQUUsRUFBRTtRQUN4QixPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUN4QjtJQUNELE9BQU8sRUFBRSxDQUFDO0FBQ1osQ0FBQztBQVhELHNDQVdDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFnQixZQUFZLENBQUMsQ0FBVSxFQUFFLE1BQWM7SUFDckQsSUFBSSxNQUFNLElBQUksQ0FBQztRQUFFLE9BQU8sS0FBSyxDQUFDO0lBQzlCLGtCQUFrQjtJQUNsQixNQUFNLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNqRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQ3BDLE9BQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDM0M7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFSRCxvQ0FRQyJ9