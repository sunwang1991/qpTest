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
exports.UserModel = void 0;
const validate_1 = require("@midwayjs/validate");
const typeorm_1 = require("typeorm");
const Base_1 = require("../../common/model/Base");
/**用户信息表 */
let UserModel = exports.UserModel = class UserModel extends Base_1.CommonBase {
    /**微信openId */
    openId;
    /**手机号码 */
    phone;
    /**用户昵称 */
    nickName;
    /**用户性别（0未知 1男 2女） */
    sex;
    /**头像地址 */
    avatar;
    /**帐号状态（0停用 1正常） */
    statusFlag;
    /**最后登录IP */
    loginIp;
    /**最后登录时间 */
    loginTime;
    /**备注 */
    remark;
};
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().required()),
    (0, typeorm_1.Column)({ name: 'open_id' }),
    __metadata("design:type", String)
], UserModel.prototype, "openId", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'phone', nullable: true, default: '' }),
    __metadata("design:type", String)
], UserModel.prototype, "phone", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'nick_name', nullable: true, default: '' }),
    __metadata("design:type", String)
], UserModel.prototype, "nickName", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().pattern(/^[012]$/)),
    (0, typeorm_1.Column)({ name: 'sex', default: '0' }),
    __metadata("design:type", String)
], UserModel.prototype, "sex", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'avatar', nullable: true, default: '' }),
    __metadata("design:type", String)
], UserModel.prototype, "avatar", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().pattern(/^[01]$/)),
    (0, typeorm_1.Column)({ name: 'status_flag', default: '1' }),
    __metadata("design:type", String)
], UserModel.prototype, "statusFlag", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'login_ip', nullable: true, default: '' }),
    __metadata("design:type", String)
], UserModel.prototype, "loginIp", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.number().allow(0)),
    (0, typeorm_1.Column)({ name: 'login_time', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], UserModel.prototype, "loginTime", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({
        length: 200,
        name: 'remark',
        nullable: true,
        default: '',
    }),
    __metadata("design:type", String)
], UserModel.prototype, "remark", void 0);
exports.UserModel = UserModel = __decorate([
    (0, typeorm_1.Entity)('user')
], UserModel);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL21pbmkvbW9kZWwvdXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxpREFBb0Q7QUFDcEQscUNBQXlDO0FBQ3pDLGtEQUFxRDtBQUVyRCxXQUFXO0FBRUosSUFBTSxTQUFTLHVCQUFmLE1BQU0sU0FBVSxTQUFRLGlCQUFVO0lBQ3ZDLGNBQWM7SUFHZCxNQUFNLENBQVM7SUFFZixVQUFVO0lBR1YsS0FBSyxDQUFTO0lBRWQsVUFBVTtJQUdWLFFBQVEsQ0FBUztJQUVqQixxQkFBcUI7SUFHckIsR0FBRyxDQUFTO0lBRVosVUFBVTtJQUdWLE1BQU0sQ0FBUztJQUVmLG1CQUFtQjtJQUduQixVQUFVLENBQVM7SUFFbkIsWUFBWTtJQUdaLE9BQU8sQ0FBUztJQUVoQixZQUFZO0lBR1osU0FBUyxDQUFTO0lBRWxCLFFBQVE7SUFRUixNQUFNLENBQVM7Q0FDaEIsQ0FBQTtBQTlDQztJQUZDLElBQUEsZUFBSSxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDbEMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDOzt5Q0FDYjtBQUtmO0lBRkMsSUFBQSxlQUFJLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDakMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQzs7d0NBQ3pDO0FBS2Q7SUFGQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNqQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxDQUFDOzsyQ0FDMUM7QUFLakI7SUFGQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMxQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQzs7c0NBQzFCO0FBS1o7SUFGQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNqQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxDQUFDOzt5Q0FDekM7QUFLZjtJQUZDLElBQUEsZUFBSSxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3pDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDOzs2Q0FDM0I7QUFLbkI7SUFGQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNqQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxDQUFDOzswQ0FDMUM7QUFLaEI7SUFGQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDOzs0Q0FDekM7QUFVbEI7SUFQQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNqQyxJQUFBLGdCQUFNLEVBQUM7UUFDTixNQUFNLEVBQUUsR0FBRztRQUNYLElBQUksRUFBRSxRQUFRO1FBQ2QsUUFBUSxFQUFFLElBQUk7UUFDZCxPQUFPLEVBQUUsRUFBRTtLQUNaLENBQUM7O3lDQUNhO29CQWpESixTQUFTO0lBRHJCLElBQUEsZ0JBQU0sRUFBQyxNQUFNLENBQUM7R0FDRixTQUFTLENBa0RyQiJ9