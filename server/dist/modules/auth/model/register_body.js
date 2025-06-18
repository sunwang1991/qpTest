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
exports.RegisterBody = void 0;
const validate_1 = require("@midwayjs/validate");
/**用户注册对象 */
class RegisterBody {
    /**用户名 */
    username;
    /**用户密码 */
    password;
    /**用户密码确认 */
    confirmPassword;
    /**验证码 */
    code;
    /**验证码唯一标识 */
    uuid;
}
exports.RegisterBody = RegisterBody;
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().required().min(4).max(26)),
    __metadata("design:type", String)
], RegisterBody.prototype, "username", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().required().min(6).max(26)),
    __metadata("design:type", String)
], RegisterBody.prototype, "password", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().required().min(6).max(26)),
    __metadata("design:type", String)
], RegisterBody.prototype, "confirmPassword", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().min(1).max(6)),
    __metadata("design:type", String)
], RegisterBody.prototype, "code", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().min(8).max(64)),
    __metadata("design:type", String)
], RegisterBody.prototype, "uuid", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXJfYm9keS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2F1dGgvbW9kZWwvcmVnaXN0ZXJfYm9keS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxpREFBb0Q7QUFFcEQsWUFBWTtBQUNaLE1BQWEsWUFBWTtJQUN2QixTQUFTO0lBRVQsUUFBUSxDQUFTO0lBRWpCLFVBQVU7SUFFVixRQUFRLENBQVM7SUFFakIsWUFBWTtJQUVaLGVBQWUsQ0FBUztJQUV4QixTQUFTO0lBRVQsSUFBSSxDQUFTO0lBRWIsYUFBYTtJQUViLElBQUksQ0FBUztDQUNkO0FBcEJELG9DQW9CQztBQWpCQztJQURDLElBQUEsZUFBSSxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQzs7OENBQ2pDO0FBSWpCO0lBREMsSUFBQSxlQUFJLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDOzs4Q0FDakM7QUFJakI7SUFEQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7O3FEQUMxQjtBQUl4QjtJQURDLElBQUEsZUFBSSxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7MENBQ3pCO0FBSWI7SUFEQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7OzBDQUMxQiJ9