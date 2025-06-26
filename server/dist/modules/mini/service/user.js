"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const core_1 = require("@midwayjs/core");
const user_1 = require("../repository/user");
const http_service_1 = require("../../common/service/http.service");
/**
 * 用户信息 服务层处理
 */
let UserService = exports.UserService = class UserService {
    userRepository;
    http;
    /**
     * 账号注册
     * userInfo: 用户信息
     */
    async register(userInfo) {
        // 检查用户登录账号是否唯一
        const userMsg = await this.userRepository.selectByOpenId(userInfo.openId);
        if (userMsg)
            return null;
        const newUserInfo = await this.userRepository.insertUserInfo(userInfo);
        return newUserInfo;
    }
    /**
     * 检查用户是否注册
     */
    async checkIsRegister(openId) {
        return true;
    }
    /**
     * 登录
     * openId: 用户唯一标识
     *
     */
    async login(code) {
        const openId = await this.getOpenId(code);
        // 检查用户登录账号是否唯一
        let userInfo = await this.userRepository.selectByOpenId(openId);
        if (!userInfo) {
            userInfo = await this.userRepository.insertUserInfo({ openId });
        }
        return userInfo;
    }
    /**
     * 通过code获取openId
     * @param code
     * @returns openId
     */
    async getOpenId(code) {
        // 发送请求，获取session
        const result = await this.http.get('https://api.weixin.qq.com/sns/jscode2session', {
            js_code: code,
            appid: 'wxecb8522186879691',
            secret: '1eb1d2532fc2c1659a828f32b946a0b6',
            grant_type: 'authorization_code',
        });
        // 检查返回数据结构，可能需要从 result.data 中获取
        const data = result.data || result;
        return data.openid;
    }
    /**
     * 获取用户信息
     * @param openId
     * @returns
     */
    async getUserInfo(userId) {
        return await await this.userRepository.selectById(userId);
    }
    /**
     *
     * 更新用户信息
     * @param userId
     * @param userInfo
     * @returns
     */
    updateUserInfo(userInfo) {
        return this.userRepository.updateUserInfo(userInfo);
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", user_1.UserRepository)
], UserService.prototype, "userRepository", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", http_service_1.HttpService)
], UserService.prototype, "http", void 0);
exports.UserService = UserService = __decorate([
    (0, core_1.Provide)()
], UserService);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL21pbmkvc2VydmljZS91c2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHlDQUFpRDtBQUVqRCw2Q0FBb0Q7QUFDcEQsb0VBQWdFO0FBQ2hFOztHQUVHO0FBRUksSUFBTSxXQUFXLHlCQUFqQixNQUFNLFdBQVc7SUFFZCxjQUFjLENBQWlCO0lBRy9CLElBQUksQ0FBYztJQUUxQjs7O09BR0c7SUFDSCxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQW1CO1FBQ2hDLGVBQWU7UUFDZixNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxRSxJQUFJLE9BQU87WUFBRSxPQUFPLElBQUksQ0FBQztRQUN6QixNQUFNLFdBQVcsR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZFLE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUM7SUFFRDs7T0FFRztJQUNILEtBQUssQ0FBQyxlQUFlLENBQUMsTUFBYztRQUNsQyxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFZO1FBQ3RCLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxQyxlQUFlO1FBQ2YsSUFBSSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2IsUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1NBQ2pFO1FBQ0QsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsU0FBUyxDQUFDLElBQVk7UUFDMUIsaUJBQWlCO1FBQ2pCLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQ2hDLDhDQUE4QyxFQUM5QztZQUNFLE9BQU8sRUFBRSxJQUFJO1lBQ2IsS0FBSyxFQUFFLG9CQUFvQjtZQUMzQixNQUFNLEVBQUUsa0NBQWtDO1lBQzFDLFVBQVUsRUFBRSxvQkFBb0I7U0FDakMsQ0FDRixDQUFDO1FBQ0YsaUNBQWlDO1FBQ2pDLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFDO1FBQ25DLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBYztRQUM5QixPQUFPLE1BQU0sTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsY0FBYyxDQUFDLFFBQVE7UUFDckIsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN0RCxDQUFDO0NBQ0YsQ0FBQTtBQS9FUztJQURQLElBQUEsYUFBTSxHQUFFOzhCQUNlLHFCQUFjO21EQUFDO0FBRy9CO0lBRFAsSUFBQSxhQUFNLEdBQUU7OEJBQ0ssMEJBQVc7eUNBQUM7c0JBTGYsV0FBVztJQUR2QixJQUFBLGNBQU8sR0FBRTtHQUNHLFdBQVcsQ0FpRnZCIn0=