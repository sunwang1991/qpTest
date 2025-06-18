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
exports.SysDictType = void 0;
const validate_1 = require("@midwayjs/validate");
const typeorm_1 = require("typeorm");
/**字典类型表 */
let SysDictType = exports.SysDictType = class SysDictType {
    /**字典ID */
    dictId;
    /**字典名称 */
    dictName;
    /**字典类型 */
    dictType;
    /**状态（0停用 1正常） */
    statusFlag;
    /**删除标记（0存在 1删除） */
    delFlag;
    /**创建者 */
    createBy;
    /**创建时间 */
    createTime;
    /**更新者 */
    updateBy;
    /**更新时间 */
    updateTime;
    /**备注 */
    remark;
};
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.number().allow(0)),
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'dict_id' }),
    __metadata("design:type", Number)
], SysDictType.prototype, "dictId", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().required()),
    (0, typeorm_1.Column)({ name: 'dict_name' }),
    __metadata("design:type", String)
], SysDictType.prototype, "dictName", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().required()),
    (0, typeorm_1.Column)({ name: 'dict_type' }),
    __metadata("design:type", String)
], SysDictType.prototype, "dictType", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().pattern(/^[01]$/)),
    (0, typeorm_1.Column)({ name: 'status_flag' }),
    __metadata("design:type", String)
], SysDictType.prototype, "statusFlag", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().pattern(/^[01]$/)),
    (0, typeorm_1.Column)({ name: 'del_flag' }),
    __metadata("design:type", String)
], SysDictType.prototype, "delFlag", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'create_by' }),
    __metadata("design:type", String)
], SysDictType.prototype, "createBy", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.number().allow(0)),
    (0, typeorm_1.Column)({ name: 'create_time' }),
    __metadata("design:type", Number)
], SysDictType.prototype, "createTime", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'update_by' }),
    __metadata("design:type", String)
], SysDictType.prototype, "updateBy", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.number().allow(0)),
    (0, typeorm_1.Column)({ name: 'update_time' }),
    __metadata("design:type", Number)
], SysDictType.prototype, "updateTime", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({
        length: 200,
        name: 'remark',
    }),
    __metadata("design:type", String)
], SysDictType.prototype, "remark", void 0);
exports.SysDictType = SysDictType = __decorate([
    (0, typeorm_1.Entity)('sys_dict_type')
], SysDictType);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX2RpY3RfdHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3N5c3RlbS9tb2RlbC9zeXNfZGljdF90eXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLGlEQUFvRDtBQUNwRCxxQ0FBaUU7QUFFakUsV0FBVztBQUVKLElBQU0sV0FBVyx5QkFBakIsTUFBTSxXQUFXO0lBQ3RCLFVBQVU7SUFHVixNQUFNLENBQVM7SUFFZixVQUFVO0lBR1YsUUFBUSxDQUFTO0lBRWpCLFVBQVU7SUFHVixRQUFRLENBQVM7SUFFakIsaUJBQWlCO0lBR2pCLFVBQVUsQ0FBUztJQUVuQixtQkFBbUI7SUFHbkIsT0FBTyxDQUFTO0lBRWhCLFNBQVM7SUFHVCxRQUFRLENBQVM7SUFFakIsVUFBVTtJQUdWLFVBQVUsQ0FBUztJQUVuQixTQUFTO0lBR1QsUUFBUSxDQUFTO0lBRWpCLFVBQVU7SUFHVixVQUFVLENBQVM7SUFFbkIsUUFBUTtJQU1SLE1BQU0sQ0FBUztDQUNoQixDQUFBO0FBakRDO0lBRkMsSUFBQSxlQUFJLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEMsSUFBQSxnQ0FBc0IsRUFBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQzs7MkNBQzdCO0FBS2Y7SUFGQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2xDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsQ0FBQzs7NkNBQ2I7QUFLakI7SUFGQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2xDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsQ0FBQzs7NkNBQ2I7QUFLakI7SUFGQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN6QyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLENBQUM7OytDQUNiO0FBS25CO0lBRkMsSUFBQSxlQUFJLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDekMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxDQUFDOzs0Q0FDYjtBQUtoQjtJQUZDLElBQUEsZUFBSSxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2pDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsQ0FBQzs7NkNBQ2I7QUFLakI7SUFGQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLENBQUM7OytDQUNiO0FBS25CO0lBRkMsSUFBQSxlQUFJLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDakMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxDQUFDOzs2Q0FDYjtBQUtqQjtJQUZDLElBQUEsZUFBSSxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsQ0FBQzs7K0NBQ2I7QUFRbkI7SUFMQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNqQyxJQUFBLGdCQUFNLEVBQUM7UUFDTixNQUFNLEVBQUUsR0FBRztRQUNYLElBQUksRUFBRSxRQUFRO0tBQ2YsQ0FBQzs7MkNBQ2E7c0JBcERKLFdBQVc7SUFEdkIsSUFBQSxnQkFBTSxFQUFDLGVBQWUsQ0FBQztHQUNYLFdBQVcsQ0FxRHZCIn0=