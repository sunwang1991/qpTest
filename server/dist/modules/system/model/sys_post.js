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
exports.SysPost = void 0;
const validate_1 = require("@midwayjs/validate");
const typeorm_1 = require("typeorm");
/**岗位表 */
let SysPost = exports.SysPost = class SysPost {
    /**岗位ID */
    postId;
    /**岗位编码 */
    postCode;
    /**岗位名称 */
    postName;
    /**显示顺序 */
    postSort;
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
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'post_id' }),
    __metadata("design:type", Number)
], SysPost.prototype, "postId", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().required()),
    (0, typeorm_1.Column)({ name: 'post_code' }),
    __metadata("design:type", String)
], SysPost.prototype, "postCode", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().required()),
    (0, typeorm_1.Column)({ name: 'post_name' }),
    __metadata("design:type", String)
], SysPost.prototype, "postName", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.number().allow(0)),
    (0, typeorm_1.Column)({ name: 'post_sort' }),
    __metadata("design:type", Number)
], SysPost.prototype, "postSort", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().pattern(/^[01]$/)),
    (0, typeorm_1.Column)({ name: 'status_flag' }),
    __metadata("design:type", String)
], SysPost.prototype, "statusFlag", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().pattern(/^[01]$/)),
    (0, typeorm_1.Column)({ name: 'del_flag' }),
    __metadata("design:type", String)
], SysPost.prototype, "delFlag", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'create_by' }),
    __metadata("design:type", String)
], SysPost.prototype, "createBy", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.number().allow(0)),
    (0, typeorm_1.Column)({ name: 'create_time' }),
    __metadata("design:type", Number)
], SysPost.prototype, "createTime", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'update_by' }),
    __metadata("design:type", String)
], SysPost.prototype, "updateBy", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.number().allow(0)),
    (0, typeorm_1.Column)({ name: 'update_time' }),
    __metadata("design:type", Number)
], SysPost.prototype, "updateTime", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({
        length: 200,
        name: 'remark',
    }),
    __metadata("design:type", String)
], SysPost.prototype, "remark", void 0);
exports.SysPost = SysPost = __decorate([
    (0, typeorm_1.Entity)('sys_post')
], SysPost);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX3Bvc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9zeXN0ZW0vbW9kZWwvc3lzX3Bvc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsaURBQW9EO0FBQ3BELHFDQUFpRTtBQUVqRSxTQUFTO0FBRUYsSUFBTSxPQUFPLHFCQUFiLE1BQU0sT0FBTztJQUNsQixVQUFVO0lBR1YsTUFBTSxDQUFTO0lBRWYsVUFBVTtJQUdWLFFBQVEsQ0FBUztJQUVqQixVQUFVO0lBR1YsUUFBUSxDQUFTO0lBRWpCLFVBQVU7SUFHVixRQUFRLENBQVM7SUFFakIsaUJBQWlCO0lBR2pCLFVBQVUsQ0FBUztJQUVuQixtQkFBbUI7SUFHbkIsT0FBTyxDQUFTO0lBRWhCLFNBQVM7SUFHVCxRQUFRLENBQVM7SUFFakIsVUFBVTtJQUdWLFVBQVUsQ0FBUztJQUVuQixTQUFTO0lBR1QsUUFBUSxDQUFTO0lBRWpCLFVBQVU7SUFHVixVQUFVLENBQVM7SUFFbkIsUUFBUTtJQU1SLE1BQU0sQ0FBUztDQUNoQixDQUFBO0FBdERDO0lBRkMsSUFBQSxlQUFJLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEMsSUFBQSxnQ0FBc0IsRUFBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQzs7dUNBQzdCO0FBS2Y7SUFGQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2xDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsQ0FBQzs7eUNBQ2I7QUFLakI7SUFGQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2xDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsQ0FBQzs7eUNBQ2I7QUFLakI7SUFGQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLENBQUM7O3lDQUNiO0FBS2pCO0lBRkMsSUFBQSxlQUFJLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDekMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxDQUFDOzsyQ0FDYjtBQUtuQjtJQUZDLElBQUEsZUFBSSxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3pDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQzs7d0NBQ2I7QUFLaEI7SUFGQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNqQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLENBQUM7O3lDQUNiO0FBS2pCO0lBRkMsSUFBQSxlQUFJLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxDQUFDOzsyQ0FDYjtBQUtuQjtJQUZDLElBQUEsZUFBSSxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2pDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsQ0FBQzs7eUNBQ2I7QUFLakI7SUFGQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoQyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLENBQUM7OzJDQUNiO0FBUW5CO0lBTEMsSUFBQSxlQUFJLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDakMsSUFBQSxnQkFBTSxFQUFDO1FBQ04sTUFBTSxFQUFFLEdBQUc7UUFDWCxJQUFJLEVBQUUsUUFBUTtLQUNmLENBQUM7O3VDQUNhO2tCQXpESixPQUFPO0lBRG5CLElBQUEsZ0JBQU0sRUFBQyxVQUFVLENBQUM7R0FDTixPQUFPLENBMERuQiJ9