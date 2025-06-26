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
exports.SettlementModel = void 0;
const validate_1 = require("@midwayjs/validate");
const typeorm_1 = require("typeorm");
const Base_1 = require("../../common/model/Base");
/**结算记录表 */
let SettlementModel = exports.SettlementModel = class SettlementModel extends Base_1.CommonBase {
    /**房间ID */
    roomId;
    /**用户ID */
    userId;
    /** 金额 */
    money;
};
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.number().allow(0)),
    (0, typeorm_1.PrimaryColumn)({ name: 'room_id' }),
    __metadata("design:type", Number)
], SettlementModel.prototype, "roomId", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.number().allow(0)),
    (0, typeorm_1.PrimaryColumn)({ name: 'user_id' }),
    __metadata("design:type", Number)
], SettlementModel.prototype, "userId", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.number().allow(0)),
    (0, typeorm_1.Column)({ name: 'money' }),
    __metadata("design:type", Number)
], SettlementModel.prototype, "money", void 0);
exports.SettlementModel = SettlementModel = __decorate([
    (0, typeorm_1.Entity)('settlement')
], SettlementModel);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGxlbWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL21pbmkvbW9kZWwvc2V0dGxlbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxpREFBb0Q7QUFDcEQscUNBQXdEO0FBQ3hELGtEQUFxRDtBQUVyRCxXQUFXO0FBRUosSUFBTSxlQUFlLDZCQUFyQixNQUFNLGVBQWdCLFNBQVEsaUJBQVU7SUFDN0MsVUFBVTtJQUdWLE1BQU0sQ0FBUztJQUVmLFVBQVU7SUFHVixNQUFNLENBQVM7SUFFZixTQUFTO0lBR1QsS0FBSyxDQUFTO0NBQ2YsQ0FBQTtBQVhDO0lBRkMsSUFBQSxlQUFJLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEMsSUFBQSx1QkFBYSxFQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDOzsrQ0FDcEI7QUFLZjtJQUZDLElBQUEsZUFBSSxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLElBQUEsdUJBQWEsRUFBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQzs7K0NBQ3BCO0FBS2Y7SUFGQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUM7OzhDQUNaOzBCQWRILGVBQWU7SUFEM0IsSUFBQSxnQkFBTSxFQUFDLFlBQVksQ0FBQztHQUNSLGVBQWUsQ0FlM0IifQ==