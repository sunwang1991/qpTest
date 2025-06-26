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
const user_2 = require("../model/user");
/**
 * 用户信息
 *
 */
let UserController = exports.UserController = class UserController {
    /**用户服务 */
    userService;
    /**用户注册 */
    async register(user) {
        if (!user.openId)
            return api_1.Resp.errMsg('code不能为空');
        const userInfo = await this.userService.register(user);
        return api_1.Resp.okData(userInfo);
    }
    /**用户登录 */
    async login(data) {
        if (!data.code)
            return api_1.Resp.errMsg('code不能为空');
        const userInfo = await this.userService.login(data.code);
        return api_1.Resp.okData(userInfo);
    }
    /**用户信息 */
    async info(data) {
        if (!data.id)
            return api_1.Resp.errMsg('id不能为空');
        const userInfo = await this.userService.getUserInfo(data.id);
        return api_1.Resp.okData(userInfo);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL21pbmkvY29udHJvbGxlci91c2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUFnRTtBQUNoRSxxREFBbUQ7QUFDbkQseUVBR2tEO0FBQ2xELDBDQUE4QztBQUM5Qyx3Q0FBMEM7QUFFMUM7OztHQUdHO0FBRUksSUFBTSxjQUFjLDRCQUFwQixNQUFNLGNBQWM7SUFDekIsVUFBVTtJQUVGLFdBQVcsQ0FBYztJQUVqQyxVQUFVO0lBSUcsQUFBTixLQUFLLENBQUMsUUFBUSxDQUFTLElBQWU7UUFDM0MsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNO1lBQUUsT0FBTyxVQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2pELE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkQsT0FBTyxVQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxVQUFVO0lBRUcsQUFBTixLQUFLLENBQUMsS0FBSyxDQUFTLElBQXNCO1FBQy9DLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSTtZQUFFLE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMvQyxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6RCxPQUFPLFVBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVELFVBQVU7SUFFRyxBQUFOLEtBQUssQ0FBQyxJQUFJLENBQVMsSUFBb0I7UUFDNUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQUUsT0FBTyxVQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNDLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzdELE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQ7OztPQUdHO0lBRVUsQUFBTixLQUFLLENBQUMsTUFBTSxDQUNULElBQXNEO1FBRTlELElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUFFLE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzQyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVDLE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQixDQUFDO0NBQ0YsQ0FBQTtBQXhDUztJQURQLElBQUEsYUFBTSxHQUFFOzhCQUNZLGtCQUFXO21EQUFDO0FBTXBCO0lBSFosSUFBQSxXQUFJLEVBQUMsV0FBVyxFQUFFO1FBQ2pCLFVBQVUsRUFBRSxDQUFDLElBQUEsZ0NBQW1CLEVBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLHFCQUFRLEVBQUUsQ0FBQyxDQUFDO0tBQzVFLENBQUM7SUFDcUIsV0FBQSxJQUFBLFdBQUksR0FBRSxDQUFBOztxQ0FBTyxnQkFBUzs7OENBSTVDO0FBSVk7SUFEWixJQUFBLFdBQUksRUFBQyxRQUFRLENBQUM7SUFDSyxXQUFBLElBQUEsV0FBSSxHQUFFLENBQUE7Ozs7MkNBSXpCO0FBSVk7SUFEWixJQUFBLFdBQUksRUFBQyxPQUFPLENBQUM7SUFDSyxXQUFBLElBQUEsV0FBSSxHQUFFLENBQUE7Ozs7MENBSXhCO0FBT1k7SUFEWixJQUFBLFdBQUksRUFBQyxTQUFTLENBQUM7SUFFYixXQUFBLElBQUEsV0FBSSxHQUFFLENBQUE7Ozs7NENBS1I7eUJBMUNVLGNBQWM7SUFEMUIsSUFBQSxpQkFBVSxFQUFDLFlBQVksQ0FBQztHQUNaLGNBQWMsQ0EyQzFCIn0=