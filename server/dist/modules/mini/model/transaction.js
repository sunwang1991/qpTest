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
exports.TransactionModel = void 0;
const validate_1 = require("@midwayjs/validate");
const typeorm_1 = require("typeorm");
const Base_1 = require("../../common/model/Base");
/**交易记录表 */
let TransactionModel = exports.TransactionModel = class TransactionModel extends Base_1.CommonBase {
    /**房间ID */
    roomId;
    /**支付用户ID */
    userId;
    /**收款对象ID */
    receiveUserId;
    /** 金额 */
    payMoney;
};
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.number().allow(0)),
    (0, typeorm_1.PrimaryColumn)({ name: 'room_id' }),
    __metadata("design:type", Number)
], TransactionModel.prototype, "roomId", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.number().allow(0)),
    (0, typeorm_1.PrimaryColumn)({ name: 'user_id' }),
    __metadata("design:type", Number)
], TransactionModel.prototype, "userId", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.number().allow(0)),
    (0, typeorm_1.PrimaryColumn)({ name: 'receive_user_id' }),
    __metadata("design:type", Number)
], TransactionModel.prototype, "receiveUserId", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.number().allow(0)),
    (0, typeorm_1.Column)({ name: 'pay_money' }),
    __metadata("design:type", Number)
], TransactionModel.prototype, "payMoney", void 0);
exports.TransactionModel = TransactionModel = __decorate([
    (0, typeorm_1.Entity)('transaction')
], TransactionModel);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9taW5pL21vZGVsL3RyYW5zYWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLGlEQUFvRDtBQUNwRCxxQ0FBd0Q7QUFDeEQsa0RBQXFEO0FBRXJELFdBQVc7QUFFSixJQUFNLGdCQUFnQiw4QkFBdEIsTUFBTSxnQkFBaUIsU0FBUSxpQkFBVTtJQUM5QyxVQUFVO0lBR1YsTUFBTSxDQUFTO0lBRWYsWUFBWTtJQUdaLE1BQU0sQ0FBUztJQUVmLFlBQVk7SUFHWixhQUFhLENBQVM7SUFFdEIsU0FBUztJQUdULFFBQVEsQ0FBUztDQUNsQixDQUFBO0FBaEJDO0lBRkMsSUFBQSxlQUFJLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEMsSUFBQSx1QkFBYSxFQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDOztnREFDcEI7QUFLZjtJQUZDLElBQUEsZUFBSSxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLElBQUEsdUJBQWEsRUFBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQzs7Z0RBQ3BCO0FBS2Y7SUFGQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoQyxJQUFBLHVCQUFhLEVBQUMsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQzs7dURBQ3JCO0FBS3RCO0lBRkMsSUFBQSxlQUFJLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxDQUFDOztrREFDYjsyQkFuQk4sZ0JBQWdCO0lBRDVCLElBQUEsZ0JBQU0sRUFBQyxhQUFhLENBQUM7R0FDVCxnQkFBZ0IsQ0FvQjVCIn0=