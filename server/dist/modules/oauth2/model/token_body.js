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
exports.TokenBody = void 0;
const validate_1 = require("@midwayjs/validate");
/**获取访问令牌参数 */
class TokenBody {
    /**申请应用时获得的client_id */
    clientId;
    /**申请应用时分配的secret */
    clientSecret;
    /**请求的类型，此处的值固定为 authorization_code/refresh_token */
    grantType;
    /**授权拿到的code值 */
    code;
    /**刷新令牌 */
    refreshToken;
}
exports.TokenBody = TokenBody;
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().required()),
    __metadata("design:type", String)
], TokenBody.prototype, "clientId", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().required()),
    __metadata("design:type", String)
], TokenBody.prototype, "clientSecret", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().required()),
    __metadata("design:type", String)
], TokenBody.prototype, "grantType", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    __metadata("design:type", String)
], TokenBody.prototype, "code", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    __metadata("design:type", String)
], TokenBody.prototype, "refreshToken", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW5fYm9keS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL29hdXRoMi9tb2RlbC90b2tlbl9ib2R5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLGlEQUFvRDtBQUVwRCxjQUFjO0FBQ2QsTUFBYSxTQUFTO0lBQ3BCLHVCQUF1QjtJQUV2QixRQUFRLENBQVM7SUFFakIsb0JBQW9CO0lBRXBCLFlBQVksQ0FBUztJQUVyQixvREFBb0Q7SUFFcEQsU0FBUyxDQUFTO0lBRWxCLGdCQUFnQjtJQUVoQixJQUFJLENBQVM7SUFFYixVQUFVO0lBRVYsWUFBWSxDQUFTO0NBQ3RCO0FBcEJELDhCQW9CQztBQWpCQztJQURDLElBQUEsZUFBSSxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7OzJDQUNsQjtBQUlqQjtJQURDLElBQUEsZUFBSSxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7OytDQUNkO0FBSXJCO0lBREMsSUFBQSxlQUFJLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQzs7NENBQ2pCO0FBSWxCO0lBREMsSUFBQSxlQUFJLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7O3VDQUNyQjtBQUliO0lBREMsSUFBQSxlQUFJLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7OytDQUNiIn0=