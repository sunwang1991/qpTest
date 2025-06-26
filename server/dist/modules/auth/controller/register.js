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
exports.RegisterController = void 0;
const core_1 = require("@midwayjs/core");
const regular_1 = require("../../../framework/utils/regular/regular");
const rate_limit_1 = require("../../../framework/middleware/rate_limit");
const param_1 = require("../../../framework/reqctx/param");
const common_1 = require("../../../framework/constants/common");
const api_1 = require("../../../framework/resp/api");
const sys_log_login_1 = require("../../system/service/sys_log_login");
const register_1 = require("../service/register");
const register_body_1 = require("../model/register_body");
/**账号注册操作 控制层处理 */
let RegisterController = exports.RegisterController = class RegisterController {
    /**上下文 */
    c;
    /**账号注册操作服务 */
    registerService;
    /**系统登录访问服务 */
    sysLogLoginService;
    /**账号注册 */
    async register(body) {
        // 当前请求信息
        const [ipaddr, location] = await (0, param_1.ipaddrLocation)(this.c);
        const [os, browser] = await (0, param_1.uaOsBrowser)(this.c);
        // 校验验证码
        const errMsg = await this.registerService.validateCaptcha(body.code, body.uuid);
        // 根据错误信息，创建系统访问记录
        if (errMsg) {
            const msg = `${errMsg} code ${body.code}`;
            await this.sysLogLoginService.insert(body.username, common_1.STATUS_NO, msg, [
                ipaddr,
                location,
                os,
                browser,
            ]);
            return api_1.Resp.errMsg(errMsg);
        }
        // 判断必传参数
        if (!(0, regular_1.validUsername)(body.username)) {
            return api_1.Resp.errMsg('用户账号只能包含大写小写字母，数字，且不少于4位');
        }
        if (!(0, regular_1.validPassword)(body.password)) {
            return api_1.Resp.errMsg('登录密码至少包含大小写字母、数字、特殊符号，且不少于6位');
        }
        if (body.password !== body.confirmPassword) {
            return api_1.Resp.errMsg('用户确认输入密码不一致');
        }
        // 进行注册
        const [userId, err] = await this.registerService.byUserName(body.username, body.password);
        if (userId > 0) {
            const msg = `${body.username} 注册成功 ${userId}`;
            await this.sysLogLoginService.insert(body.username, common_1.STATUS_YES, msg, [
                ipaddr,
                location,
                os,
                browser,
            ]);
            return api_1.Resp.okData('注册成功');
        }
        return api_1.Resp.errMsg(err);
    }
};
__decorate([
    (0, core_1.Inject)('ctx'),
    __metadata("design:type", Object)
], RegisterController.prototype, "c", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", register_1.RegisterService)
], RegisterController.prototype, "registerService", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_log_login_1.SysLogLoginService)
], RegisterController.prototype, "sysLogLoginService", void 0);
__decorate([
    (0, core_1.Post)('/auth/register', {
        middleware: [(0, rate_limit_1.RateLimitMiddleware)({ time: 300, count: 10, type: rate_limit_1.LIMIT_IP })],
    }),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_body_1.RegisterBody]),
    __metadata("design:returntype", Promise)
], RegisterController.prototype, "register", null);
exports.RegisterController = RegisterController = __decorate([
    (0, core_1.Controller)()
], RegisterController);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9hdXRoL2NvbnRyb2xsZXIvcmVnaXN0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUNBQWdFO0FBR2hFLHNFQUdrRDtBQUNsRCx5RUFHa0Q7QUFDbEQsMkRBQThFO0FBQzlFLGdFQUE0RTtBQUM1RSxxREFBbUQ7QUFDbkQsc0VBQXdFO0FBQ3hFLGtEQUFzRDtBQUN0RCwwREFBc0Q7QUFFdEQsa0JBQWtCO0FBRVgsSUFBTSxrQkFBa0IsZ0NBQXhCLE1BQU0sa0JBQWtCO0lBQzdCLFNBQVM7SUFFRCxDQUFDLENBQVU7SUFFbkIsY0FBYztJQUVOLGVBQWUsQ0FBa0I7SUFFekMsY0FBYztJQUVOLGtCQUFrQixDQUFxQjtJQUUvQyxVQUFVO0lBSUcsQUFBTixLQUFLLENBQUMsUUFBUSxDQUFTLElBQWtCO1FBQzlDLFNBQVM7UUFDVCxNQUFNLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxHQUFHLE1BQU0sSUFBQSxzQkFBYyxFQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4RCxNQUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxHQUFHLE1BQU0sSUFBQSxtQkFBVyxFQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVoRCxRQUFRO1FBQ1IsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FDdkQsSUFBSSxDQUFDLElBQUksRUFDVCxJQUFJLENBQUMsSUFBSSxDQUNWLENBQUM7UUFDRixrQkFBa0I7UUFDbEIsSUFBSSxNQUFNLEVBQUU7WUFDVixNQUFNLEdBQUcsR0FBRyxHQUFHLE1BQU0sU0FBUyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDMUMsTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsa0JBQVMsRUFBRSxHQUFHLEVBQUU7Z0JBQ2xFLE1BQU07Z0JBQ04sUUFBUTtnQkFDUixFQUFFO2dCQUNGLE9BQU87YUFDUixDQUFDLENBQUM7WUFDSCxPQUFPLFVBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDNUI7UUFFRCxTQUFTO1FBQ1QsSUFBSSxDQUFDLElBQUEsdUJBQWEsRUFBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDakMsT0FBTyxVQUFJLENBQUMsTUFBTSxDQUFDLDBCQUEwQixDQUFDLENBQUM7U0FDaEQ7UUFDRCxJQUFJLENBQUMsSUFBQSx1QkFBYSxFQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUNqQyxPQUFPLFVBQUksQ0FBQyxNQUFNLENBQ2hCLDhCQUE4QixDQUMvQixDQUFDO1NBQ0g7UUFDRCxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUMxQyxPQUFPLFVBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDbkM7UUFFRCxPQUFPO1FBQ1AsTUFBTSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUN6RCxJQUFJLENBQUMsUUFBUSxFQUNiLElBQUksQ0FBQyxRQUFRLENBQ2QsQ0FBQztRQUNGLElBQUksTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNkLE1BQU0sR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsU0FBUyxNQUFNLEVBQUUsQ0FBQztZQUM5QyxNQUFNLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxtQkFBVSxFQUFFLEdBQUcsRUFBRTtnQkFDbkUsTUFBTTtnQkFDTixRQUFRO2dCQUNSLEVBQUU7Z0JBQ0YsT0FBTzthQUNSLENBQUMsQ0FBQztZQUNILE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM1QjtRQUNELE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxQixDQUFDO0NBQ0YsQ0FBQTtBQWxFUztJQURQLElBQUEsYUFBTSxFQUFDLEtBQUssQ0FBQzs7NkNBQ0s7QUFJWDtJQURQLElBQUEsYUFBTSxHQUFFOzhCQUNnQiwwQkFBZTsyREFBQztBQUlqQztJQURQLElBQUEsYUFBTSxHQUFFOzhCQUNtQixrQ0FBa0I7OERBQUM7QUFNbEM7SUFIWixJQUFBLFdBQUksRUFBQyxnQkFBZ0IsRUFBRTtRQUN0QixVQUFVLEVBQUUsQ0FBQyxJQUFBLGdDQUFtQixFQUFDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxxQkFBUSxFQUFFLENBQUMsQ0FBQztLQUM1RSxDQUFDO0lBQ3FCLFdBQUEsSUFBQSxXQUFJLEdBQUUsQ0FBQTs7cUNBQU8sNEJBQVk7O2tEQW1EL0M7NkJBcEVVLGtCQUFrQjtJQUQ5QixJQUFBLGlCQUFVLEdBQUU7R0FDQSxrQkFBa0IsQ0FxRTlCIn0=