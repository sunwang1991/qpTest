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
exports.RoomUserModel = void 0;
const validate_1 = require("@midwayjs/validate");
const typeorm_1 = require("typeorm");
/**房间和用户关联表 */
let RoomUserModel = exports.RoomUserModel = class RoomUserModel {
    /**房间ID */
    roomId;
    /**用户ID */
    userId;
};
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.number()),
    (0, typeorm_1.PrimaryColumn)({ name: 'room_id' }),
    __metadata("design:type", Number)
], RoomUserModel.prototype, "roomId", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.number().allow(0)),
    (0, typeorm_1.PrimaryColumn)({ name: 'user_id' }),
    __metadata("design:type", Number)
], RoomUserModel.prototype, "userId", void 0);
exports.RoomUserModel = RoomUserModel = __decorate([
    (0, typeorm_1.Entity)('room_user')
], RoomUserModel);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbV91c2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvbWluaS9tb2RlbC9yb29tX3VzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsaURBQW9EO0FBQ3BELHFDQUFnRDtBQUVoRCxjQUFjO0FBRVAsSUFBTSxhQUFhLDJCQUFuQixNQUFNLGFBQWE7SUFDeEIsVUFBVTtJQUdWLE1BQU0sQ0FBUztJQUVmLFVBQVU7SUFHVixNQUFNLENBQVM7Q0FDaEIsQ0FBQTtBQU5DO0lBRkMsSUFBQSxlQUFJLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUN2QixJQUFBLHVCQUFhLEVBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUM7OzZDQUNwQjtBQUtmO0lBRkMsSUFBQSxlQUFJLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEMsSUFBQSx1QkFBYSxFQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDOzs2Q0FDcEI7d0JBVEosYUFBYTtJQUR6QixJQUFBLGdCQUFNLEVBQUMsV0FBVyxDQUFDO0dBQ1AsYUFBYSxDQVV6QiJ9