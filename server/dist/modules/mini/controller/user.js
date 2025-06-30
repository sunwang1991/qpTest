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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const core_1 = require("@midwayjs/core");
const api_1 = require("../../../framework/resp/api");
const rate_limit_1 = require("../../../framework/middleware/rate_limit");
const user_1 = require("../service/user");
const transaction_1 = require("../service/transaction");
const user_2 = require("../model/user");
/**
 * 用户信息
 *
 */
let UserController = exports.UserController = class UserController {
    /**用户服务 */
    userService;
    /**交易服务 */
    transactionService;
    /**用户注册 */
    async register(user) {
        if (!user.openId)
            return api_1.Resp.errMsg('code不能为空');
        const userInfo = await this.userService.register(user);
        return api_1.Resp.okData(userInfo);
    }
    /**用户登录 */
    async login(data) {
        try {
            if (!data.code)
                return api_1.Resp.errMsg('code不能为空');
            // 用户登录获取基本信息
            const userInfo = await this.userService.login(data.code);
            if (!userInfo || !userInfo.id) {
                return api_1.Resp.errMsg('登录失败');
            }
            // 获取用户战绩统计
            const gameStats = await this.transactionService.getUserGameStats(userInfo.id);
            // 合并用户信息和战绩统计
            const userInfoWithStats = {
                ...userInfo,
                gameStats: {
                    totalIncome: gameStats.totalIncome,
                    winRate: gameStats.winRate,
                    totalGames: gameStats.totalGames,
                    winGames: gameStats.winGames,
                    loseGames: gameStats.loseGames,
                    netIncome: gameStats.netIncome,
                    totalExpense: gameStats.totalExpense, // 总支出
                },
            };
            return api_1.Resp.okData(userInfoWithStats);
        }
        catch (error) {
            console.error('用户登录失败:', error);
            return api_1.Resp.errMsg(error.message || '登录失败');
        }
    }
    /**用户信息 */
    async info(data) {
        try {
            if (!data.id)
                return api_1.Resp.errMsg('id不能为空');
            // 获取用户基本信息
            const userInfo = await this.userService.getUserInfo(data.id);
            if (!userInfo) {
                return api_1.Resp.errMsg('用户不存在');
            }
            // 获取用户战绩统计
            const gameStats = await this.transactionService.getUserGameStats(parseInt(data.id));
            // 合并用户信息和战绩统计
            const userInfoWithStats = {
                ...userInfo,
                gameStats: {
                    totalIncome: gameStats.totalIncome,
                    winRate: gameStats.winRate,
                    totalGames: gameStats.totalGames,
                    winGames: gameStats.winGames,
                    loseGames: gameStats.loseGames,
                    netIncome: gameStats.netIncome,
                    totalExpense: gameStats.totalExpense, // 总支出
                },
            };
            return api_1.Resp.okData(userInfoWithStats);
        }
        catch (error) {
            console.error('获取用户信息失败:', error);
            return api_1.Resp.errMsg(error.message || '获取用户信息失败');
        }
    }
    /**
     * 更新用户信息
     * @param data
     */
    async update(data) {
        if (!data.id)
            return api_1.Resp.errMsg('id不能为空');
        await this.userService.updateUserInfo(data);
        return api_1.Resp.okData(null);
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", user_1.UserService)
], UserController.prototype, "userService", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", transaction_1.TransactionService)
], UserController.prototype, "transactionService", void 0);
__decorate([
    (0, core_1.Post)('/register', {
        middleware: [(0, rate_limit_1.RateLimitMiddleware)({ time: 300, count: 10, type: rate_limit_1.LIMIT_IP })],
    }),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_2.UserModel]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    (0, core_1.Post)('/login'),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, core_1.Post)('/info'),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "info", null);
__decorate([
    (0, core_1.Post)('/update'),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
exports.UserController = UserController = __decorate([
    (0, core_1.Controller)('/mini/user')
], UserController);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL21pbmkvY29udHJvbGxlci91c2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUFnRTtBQUNoRSxxREFBbUQ7QUFDbkQseUVBR2tEO0FBQ2xELDBDQUE4QztBQUM5Qyx3REFBNEQ7QUFDNUQsd0NBQTBDO0FBRTFDOzs7R0FHRztBQUVJLElBQU0sY0FBYyw0QkFBcEIsTUFBTSxjQUFjO0lBQ3pCLFVBQVU7SUFFRixXQUFXLENBQWM7SUFFakMsVUFBVTtJQUVGLGtCQUFrQixDQUFxQjtJQUUvQyxVQUFVO0lBSUcsQUFBTixLQUFLLENBQUMsUUFBUSxDQUFTLElBQWU7UUFDM0MsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNO1lBQUUsT0FBTyxVQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2pELE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkQsT0FBTyxVQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxVQUFVO0lBRUcsQUFBTixLQUFLLENBQUMsS0FBSyxDQUFTLElBQXNCO1FBQy9DLElBQUk7WUFDRixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUk7Z0JBQUUsT0FBTyxVQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRS9DLGFBQWE7WUFDYixNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUV6RCxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRTtnQkFDN0IsT0FBTyxVQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQzVC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