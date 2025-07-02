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
const sys_dict_data_1 = require("../../system/repository/sys_dict_data");
/**
 * 用户信息 服务层处理
 */
let UserService = exports.UserService = class UserService {
    userRepository;
    http;
    sysDictDataRepository;
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
        let miniDict = await this.sysDictDataRepository.selectByPage({
            dictType: 'mini_appid_secret',
        });
        let miniConfig = JSON.parse(miniDict[0][0].dataValue);
        // 发送请求，获取session
        const result = await this.http.get('https://api.weixin.qq.com/sns/jscode2session', {
            js_code: code,
            appid: miniConfig.appid,
            secret: miniConfig.secret,
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
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_dict_data_1.SysDictDataRepository)
], UserService.prototype, "sysDictDataRepository", void 0);
exports.UserService = UserService = __decorate([
    (0, core_1.Provide)()
], UserService);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL21pbmkvc2VydmljZS91c2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHlDQUFpRDtBQUVqRCw2Q0FBb0Q7QUFDcEQsb0VBQWdFO0FBQ2hFLHlFQUE4RTtBQUM5RTs7R0FFRztBQUVJLElBQU0sV0FBVyx5QkFBakIsTUFBTSxXQUFXO0lBRWQsY0FBYyxDQUFpQjtJQUcvQixJQUFJLENBQWM7SUFHbEIscUJBQXFCLENBQXdCO0lBRXJEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBbUI7UUFDaEMsZUFBZTtRQUNmLE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzFFLElBQUksT0FBTztZQUFFLE9BQU8sSUFBSSxDQUFDO1FBQ3pCLE1BQU0sV0FBVyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdkUsT0FBTyxXQUFXLENBQUM7SUFDckIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsS0FBSyxDQUFDLGVBQWUsQ0FBQyxNQUFjO1FBQ2xDLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsS0FBSyxDQUFDLElBQVk7UUFDdEIsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFDLGVBQWU7UUFDZixJQUFJLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDYixRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7U0FDakU7UUFDRCxPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBWTtRQUMxQixJQUFJLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxZQUFZLENBQUM7WUFDM0QsUUFBUSxFQUFFLG1CQUFtQjtTQUM5QixDQUFDLENBQUM7UUFDSCxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN0RCxpQkFBaUI7UUFDakIsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FDaEMsOENBQThDLEVBQzlDO1lBQ0UsT0FBTyxFQUFFLElBQUk7WUFDYixLQUFLLEVBQUUsVUFBVSxDQUFDLEtBQUs7WUFDdkIsTUFBTSxFQUFFLFVBQVUsQ0FBQyxNQUFNO1lBQ3pCLFVBQVUsRUFBRSxvQkFBb0I7U0FDakMsQ0FDRixDQUFDO1FBQ0YsaUNBQWlDO1FBQ2pDLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFDO1FBQ25DLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBYztRQUM5QixPQUFPLE1BQU0sTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsY0FBYyxDQUFDLFFBQVE7UUFDckIsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN0RCxDQUFDO0NBQ0YsQ0FBQTtBQXRGUztJQURQLElBQUEsYUFBTSxHQUFFOzhCQUNlLHFCQUFjO21EQUFDO0FBRy9CO0lBRFAsSUFBQSxhQUFNLEdBQUU7OEJBQ0ssMEJBQVc7eUNBQUM7QUFHbEI7SUFEUCxJQUFBLGFBQU0sR0FBRTs4QkFDc0IscUNBQXFCOzBEQUFDO3NCQVIxQyxXQUFXO0lBRHZCLElBQUEsY0FBTyxHQUFFO0dBQ0csV0FBVyxDQXdGdkIifQ==