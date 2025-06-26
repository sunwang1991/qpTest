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
exports.RoomModel = void 0;
const validate_1 = require("@midwayjs/validate");
const typeorm_1 = require("typeorm");
const Base_1 = require("../../common/model/Base");
/**房间 */
let RoomModel = exports.RoomModel = class RoomModel extends Base_1.CommonBase {
    /**创建者 */
    creatorId;
    /**房间名称 */
    roomName;
    /**房间状态（0停用 1正常 2已结算） */
    statusFlag;
    /** 备注 */
    remark;
};
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'creator_id' }),
    __metadata("design:type", Number)
], RoomModel.prototype, "creatorId", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'room_name' }),
    __metadata("design:type", String)
], RoomModel.prototype, "roomName", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().pattern(/^[012]$/)),
    (0, typeorm_1.Column)({ name: 'status_flag' }),
    __metadata("design:type", String)
], RoomModel.prototype, "statusFlag", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'remark' }),
    __metadata("design:type", String)
], RoomModel.prototype, "remark", void 0);
exports.RoomModel = RoomModel = __decorate([
    (0, typeorm_1.Entity)('room')
], RoomModel);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL21pbmkvbW9kZWwvcm9vbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxpREFBb0Q7QUFDcEQscUNBQXlDO0FBQ3pDLGtEQUFxRDtBQUVyRCxRQUFRO0FBRUQsSUFBTSxTQUFTLHVCQUFmLE1BQU0sU0FBVSxTQUFRLGlCQUFVO0lBQ3ZDLFNBQVM7SUFHVCxTQUFTLENBQVM7SUFFbEIsVUFBVTtJQUdWLFFBQVEsQ0FBUztJQUVqQix3QkFBd0I7SUFHeEIsVUFBVSxDQUFTO0lBRW5CLFNBQVM7SUFHVCxNQUFNLENBQVM7Q0FDaEIsQ0FBQTtBQWhCQztJQUZDLElBQUEsZUFBSSxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2pDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsQ0FBQzs7NENBQ2I7QUFLbEI7SUFGQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNqQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLENBQUM7OzJDQUNiO0FBS2pCO0lBRkMsSUFBQSxlQUFJLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDMUMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxDQUFDOzs2Q0FDYjtBQUtuQjtJQUZDLElBQUEsZUFBSSxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2pDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQzs7eUNBQ1o7b0JBbkJKLFNBQVM7SUFEckIsSUFBQSxnQkFBTSxFQUFDLE1BQU0sQ0FBQztHQUNGLFNBQVMsQ0FvQnJCIn0=