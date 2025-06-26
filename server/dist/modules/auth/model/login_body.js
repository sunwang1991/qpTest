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
exports.LoginBody = void 0;
const validate_1 = require("@midwayjs/validate");
/**用户登录对象 */
class LoginBody {
    /**用户名 */
    username;
    /**用户密码 */
    password;
    /**验证码 */
    code;
    /**验证码唯一标识 */
    uuid;
}
exports.LoginBody = LoginBody;
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().required().min(4).max(26)),
    __metadata("design:type", String)
], LoginBody.prototype, "username", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().required().min(6).max(26)),
    __metadata("design:type", String)
], LoginBody.prototype, "password", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().min(1).max(6)),
    __metadata("design:type", String)
], LoginBody.prototype, "code", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().min(8).max(64)),
    __metadata("design:type", String)
], LoginBody.prototype, "uuid", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW5fYm9keS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2F1dGgvbW9kZWwvbG9naW5fYm9keS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxpREFBb0Q7QUFFcEQsWUFBWTtBQUNaLE1BQWEsU0FBUztJQUNwQixTQUFTO0lBRVQsUUFBUSxDQUFTO0lBRWpCLFVBQVU7SUFFVixRQUFRLENBQVM7SUFFakIsU0FBUztJQUVULElBQUksQ0FBUztJQUViLGFBQWE7SUFFYixJQUFJLENBQVM7Q0FDZDtBQWhCRCw4QkFnQkM7QUFiQztJQURDLElBQUEsZUFBSSxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQzs7MkNBQ2pDO0FBSWpCO0lBREMsSUFBQSxlQUFJLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDOzsyQ0FDakM7QUFJakI7SUFEQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7O3VDQUN6QjtBQUliO0lBREMsSUFBQSxlQUFJLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDOzt1Q0FDMUIifQ==