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
exports.Oauth2LogLogin = void 0;
const validate_1 = require("@midwayjs/validate");
const typeorm_1 = require("typeorm");
/**用户授权第三方应用登录日志表 */
let Oauth2LogLogin = exports.Oauth2LogLogin = class Oauth2LogLogin {
    /**登录ID */
    id;
    /**应用的唯一标识 */
    clientId;
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
], Oauth2LogLogin.prototype, "id", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'client_id' }),
    __metadata("design:type", String)
], Oauth2LogLogin.prototype, "clientId", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'login_ip' }),
    __metadata("design:type", String)
], Oauth2LogLogin.prototype, "loginIp", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'login_location' }),
    __metadata("design:type", String)
], Oauth2LogLogin.prototype, "loginLocation", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'browser' }),
    __metadata("design:type", String)
], Oauth2LogLogin.prototype, "browser", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'os' }),
    __metadata("design:type", String)
], Oauth2LogLogin.prototype, "os", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().pattern(/^[01]$/)),
    (0, typeorm_1.Column)({ name: 'status_flag' }),
    __metadata("design:type", String)
], Oauth2LogLogin.prototype, "statusFlag", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'msg' }),
    __metadata("design:type", String)
], Oauth2LogLogin.prototype, "msg", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.number().allow(0)),
    (0, typeorm_1.Column)({ name: 'login_time' }),
    __metadata("design:type", Number)
], Oauth2LogLogin.prototype, "loginTime", void 0);
exports.Oauth2LogLogin = Oauth2LogLogin = __decorate([
    (0, typeorm_1.Entity)('oauth2_log_login')
], Oauth2LogLogin);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2F1dGgyX2xvZ19sb2dpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL29hdXRoMi9tb2RlbC9vYXV0aDJfbG9nX2xvZ2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLGlEQUFvRDtBQUNwRCxxQ0FBaUU7QUFFakUsb0JBQW9CO0FBRWIsSUFBTSxjQUFjLDRCQUFwQixNQUFNLGNBQWM7SUFDekIsVUFBVTtJQUdWLEVBQUUsQ0FBUztJQUVYLGFBQWE7SUFHYixRQUFRLENBQVM7SUFFakIsWUFBWTtJQUdaLE9BQU8sQ0FBUztJQUVoQixVQUFVO0lBR1YsYUFBYSxDQUFTO0lBRXRCLFdBQVc7SUFHWCxPQUFPLENBQVM7SUFFaEIsVUFBVTtJQUdWLEVBQUUsQ0FBUztJQUVYLG1CQUFtQjtJQUduQixVQUFVLENBQVM7SUFFbkIsVUFBVTtJQUdWLEdBQUcsQ0FBUztJQUVaLFVBQVU7SUFHVixTQUFTLENBQVM7Q0FDbkIsQ0FBQTtBQXpDQztJQUZDLElBQUEsZUFBSSxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLElBQUEsZ0NBQXNCLEVBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUM7OzBDQUM1QjtBQUtYO0lBRkMsSUFBQSxlQUFJLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDakMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxDQUFDOztnREFDYjtBQUtqQjtJQUZDLElBQUEsZUFBSSxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2pDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQzs7K0NBQ2I7QUFLaEI7SUFGQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNqQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQzs7cURBQ2I7QUFLdEI7SUFGQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNqQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUM7OytDQUNaO0FBS2hCO0lBRkMsSUFBQSxlQUFJLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDakMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDOzswQ0FDWjtBQUtYO0lBRkMsSUFBQSxlQUFJLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDekMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxDQUFDOztrREFDYjtBQUtuQjtJQUZDLElBQUEsZUFBSSxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2pDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQzs7MkNBQ1o7QUFLWjtJQUZDLElBQUEsZUFBSSxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsQ0FBQzs7aURBQ2I7eUJBNUNQLGNBQWM7SUFEMUIsSUFBQSxnQkFBTSxFQUFDLGtCQUFrQixDQUFDO0dBQ2QsY0FBYyxDQTZDMUIifQ==