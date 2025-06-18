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
exports.DemoORM = void 0;
const validate_1 = require("@midwayjs/validate");
const typeorm_1 = require("typeorm");
/**
 * 测试ORM表 demo_orm
 *
 * 必须要model目录下实体文件名称才能匹配使用typeorm实体扫描
 */
let DemoORM = exports.DemoORM = class DemoORM {
    /**测试ID */
    id;
    /**测试标题 */
    title;
    /**orm类型 */
    ormType;
    /**状态（0关闭 1正常） */
    statusFlag;
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
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),
    __metadata("design:type", Number)
], DemoORM.prototype, "id", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().required()),
    (0, typeorm_1.Column)({
        type: 'varchar',
        name: 'title',
    }),
    __metadata("design:type", String)
], DemoORM.prototype, "title", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().required()),
    (0, typeorm_1.Column)({ name: 'orm_type' }),
    __metadata("design:type", String)
], DemoORM.prototype, "ormType", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string()
        .required()
        .pattern(/^[01]$/)),
    (0, typeorm_1.Column)({ name: 'status_flag' }),
    __metadata("design:type", String)
], DemoORM.prototype, "statusFlag", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'create_by' }),
    __metadata("design:type", String)
], DemoORM.prototype, "createBy", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.number().allow(0)),
    (0, typeorm_1.Column)({ name: 'create_time' }),
    __metadata("design:type", Number)
], DemoORM.prototype, "createTime", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'update_by' }),
    __metadata("design:type", String)
], DemoORM.prototype, "updateBy", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.number().allow(0)),
    (0, typeorm_1.Column)({ name: 'update_time' }),
    __metadata("design:type", Number)
], DemoORM.prototype, "updateTime", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({
        length: 200,
        name: 'remark',
    }),
    __metadata("design:type", String)
], DemoORM.prototype, "remark", void 0);
exports.DemoORM = DemoORM = __decorate([
    (0, typeorm_1.Entity)('demo_orm')
], DemoORM);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVtb19vcm0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9kZW1vL21vZGVsL2RlbW9fb3JtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLGlEQUFvRDtBQUNwRCxxQ0FBaUU7QUFFakU7Ozs7R0FJRztBQUVJLElBQU0sT0FBTyxxQkFBYixNQUFNLE9BQU87SUFDbEIsVUFBVTtJQUdWLEVBQUUsQ0FBUztJQUVYLFVBQVU7SUFNVixLQUFLLENBQVM7SUFFZCxXQUFXO0lBR1gsT0FBTyxDQUFTO0lBRWhCLGlCQUFpQjtJQU9qQixVQUFVLENBQVM7SUFFbkIsU0FBUztJQUdULFFBQVEsQ0FBUztJQUVqQixVQUFVO0lBR1YsVUFBVSxDQUFTO0lBRW5CLFNBQVM7SUFHVCxRQUFRLENBQVM7SUFFakIsVUFBVTtJQUdWLFVBQVUsQ0FBUztJQUVuQixRQUFRO0lBTVIsTUFBTSxDQUFTO0NBQ2hCLENBQUE7QUFuREM7SUFGQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoQyxJQUFBLGdDQUFzQixFQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDOzttQ0FDNUI7QUFRWDtJQUxDLElBQUEsZUFBSSxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDbEMsSUFBQSxnQkFBTSxFQUFDO1FBQ04sSUFBSSxFQUFFLFNBQVM7UUFDZixJQUFJLEVBQUUsT0FBTztLQUNkLENBQUM7O3NDQUNZO0FBS2Q7SUFGQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2xDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQzs7d0NBQ2I7QUFTaEI7SUFOQyxJQUFBLGVBQUksRUFDSCxtQkFBUSxDQUFDLE1BQU0sRUFBRTtTQUNkLFFBQVEsRUFBRTtTQUNWLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FDckI7SUFDQSxJQUFBLGdCQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLENBQUM7OzJDQUNiO0FBS25CO0lBRkMsSUFBQSxlQUFJLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDakMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxDQUFDOzt5Q0FDYjtBQUtqQjtJQUZDLElBQUEsZUFBSSxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsQ0FBQzs7MkNBQ2I7QUFLbkI7SUFGQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNqQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLENBQUM7O3lDQUNiO0FBS2pCO0lBRkMsSUFBQSxlQUFJLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxDQUFDOzsyQ0FDYjtBQVFuQjtJQUxDLElBQUEsZUFBSSxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2pDLElBQUEsZ0JBQU0sRUFBQztRQUNOLE1BQU0sRUFBRSxHQUFHO1FBQ1gsSUFBSSxFQUFFLFFBQVE7S0FDZixDQUFDOzt1Q0FDYTtrQkF0REosT0FBTztJQURuQixJQUFBLGdCQUFNLEVBQUMsVUFBVSxDQUFDO0dBQ04sT0FBTyxDQXVEbkIifQ==