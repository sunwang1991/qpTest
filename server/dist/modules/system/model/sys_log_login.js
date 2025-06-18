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
exports.SysLogLogin = void 0;
const validate_1 = require("@midwayjs/validate");
const typeorm_1 = require("typeorm");
/**系统登录日志表 */
let SysLogLogin = exports.SysLogLogin = class SysLogLogin {
    /**登录ID */
    id;
    /**用户账号 */
    userName;
    /**登录IP地址 */
    loginIp;
    /**登录地点 */
    loginLocation;
    /**浏览器类型 */
    browser;
    /**操作系统 */
    os;
    /**登录状态（0失败 1成功） */
    statusFlag;
    /**提示消息 */
    msg;
    /**登录时间 */
    loginTime;
};
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.number().allow(0)),
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),
    __metadata("design:type", Number)
], SysLogLogin.prototype, "id", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'user_name' }),
    __metadata("design:type", String)
], SysLogLogin.prototype, "userName", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'login_ip' }),
    __metadata("design:type", String)
], SysLogLogin.prototype, "loginIp", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'login_location' }),
    __metadata("design:type", String)
], SysLogLogin.prototype, "loginLocation", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'browser' }),
    __metadata("design:type", String)
], SysLogLogin.prototype, "browser", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'os' }),
    __metadata("design:type", String)
], SysLogLogin.prototype, "os", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().pattern(/^[01]$/)),
    (0, typeorm_1.Column)({ name: 'status_flag' }),
    __metadata("design:type", String)
], SysLogLogin.prototype, "statusFlag", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'msg' }),
    __metadata("design:type", String)
], SysLogLogin.prototype, "msg", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.number().allow(0)),
    (0, typeorm_1.Column)({ name: 'login_time' }),
    __metadata("design:type", Number)
], SysLogLogin.prototype, "loginTime", void 0);
exports.SysLogLogin = SysLogLogin = __decorate([
    (0, typeorm_1.Entity)('sys_log_login')
], SysLogLogin);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX2xvZ19sb2dpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3N5c3RlbS9tb2RlbC9zeXNfbG9nX2xvZ2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLGlEQUFvRDtBQUNwRCxxQ0FBaUU7QUFFakUsYUFBYTtBQUVOLElBQU0sV0FBVyx5QkFBakIsTUFBTSxXQUFXO0lBQ3RCLFVBQVU7SUFHVixFQUFFLENBQVM7SUFFWCxVQUFVO0lBR1YsUUFBUSxDQUFTO0lBRWpCLFlBQVk7SUFHWixPQUFPLENBQVM7SUFFaEIsVUFBVTtJQUdWLGFBQWEsQ0FBUztJQUV0QixXQUFXO0lBR1gsT0FBTyxDQUFTO0lBRWhCLFVBQVU7SUFHVixFQUFFLENBQVM7SUFFWCxtQkFBbUI7SUFHbkIsVUFBVSxDQUFTO0lBRW5CLFVBQVU7SUFHVixHQUFHLENBQVM7SUFFWixVQUFVO0lBR1YsU0FBUyxDQUFTO0NBQ25CLENBQUE7QUF6Q0M7SUFGQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoQyxJQUFBLGdDQUFzQixFQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDOzt1Q0FDNUI7QUFLWDtJQUZDLElBQUEsZUFBSSxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2pDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsQ0FBQzs7NkNBQ2I7QUFLakI7SUFGQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNqQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLENBQUM7OzRDQUNiO0FBS2hCO0lBRkMsSUFBQSxlQUFJLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDakMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLENBQUM7O2tEQUNiO0FBS3RCO0lBRkMsSUFBQSxlQUFJLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDakMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDOzs0Q0FDWjtBQUtoQjtJQUZDLElBQUEsZUFBSSxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2pDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQzs7dUNBQ1o7QUFLWDtJQUZDLElBQUEsZUFBSSxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3pDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsQ0FBQzs7K0NBQ2I7QUFLbkI7SUFGQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNqQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUM7O3dDQUNaO0FBS1o7SUFGQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLENBQUM7OzhDQUNiO3NCQTVDUCxXQUFXO0lBRHZCLElBQUEsZ0JBQU0sRUFBQyxlQUFlLENBQUM7R0FDWCxXQUFXLENBNkN2QiJ9