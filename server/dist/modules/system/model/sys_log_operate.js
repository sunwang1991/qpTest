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
exports.SysLogOperate = void 0;
const validate_1 = require("@midwayjs/validate");
const typeorm_1 = require("typeorm");
/**系统操作日志表 */
let SysLogOperate = exports.SysLogOperate = class SysLogOperate {
    /**操作ID */
    id;
    /**模块标题 */
    title;
    /**业务类型（0其它 1新增 2修改 3删除 4授权 5导出 6导入 7强退 8清空数据） */
    businessType;
    /**请求URL */
    operaUrl;
    /**请求方式 */
    operaUrlMethod;
    /**主机地址 */
    operaIp;
    /**操作地点 */
    operaLocation;
    /**请求参数 */
    operaParam;
    /**操作消息 */
    operaMsg;
    /**方法名称 */
    operaMethod;
    /**操作人员 */
    operaBy;
    /**操作时间 */
    operaTime;
    /**操作状态（0异常 1正常） */
    statusFlag;
    /**消耗时间（毫秒） */
    costTime;
};
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.number().allow(0)),
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id' }),
    __metadata("design:type", Number)
], SysLogOperate.prototype, "id", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'title' }),
    __metadata("design:type", String)
], SysLogOperate.prototype, "title", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'business_type' }),
    __metadata("design:type", String)
], SysLogOperate.prototype, "businessType", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'opera_url' }),
    __metadata("design:type", String)
], SysLogOperate.prototype, "operaUrl", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'opera_url_method' }),
    __metadata("design:type", String)
], SysLogOperate.prototype, "operaUrlMethod", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'opera_ip' }),
    __metadata("design:type", String)
], SysLogOperate.prototype, "operaIp", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'opera_location' }),
    __metadata("design:type", String)
], SysLogOperate.prototype, "operaLocation", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'opera_param' }),
    __metadata("design:type", String)
], SysLogOperate.prototype, "operaParam", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'opera_msg' }),
    __metadata("design:type", String)
], SysLogOperate.prototype, "operaMsg", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'opera_method' }),
    __metadata("design:type", String)
], SysLogOperate.prototype, "operaMethod", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'opera_by' }),
    __metadata("design:type", String)
], SysLogOperate.prototype, "operaBy", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.number().allow(0)),
    (0, typeorm_1.Column)({ name: 'opera_time' }),
    __metadata("design:type", Number)
], SysLogOperate.prototype, "operaTime", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().pattern(/^[01]$/)),
    (0, typeorm_1.Column)({ name: 'status_flag' }),
    __metadata("design:type", String)
], SysLogOperate.prototype, "statusFlag", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.number().allow(0)),
    (0, typeorm_1.Column)({ name: 'cost_time' }),
    __metadata("design:type", Number)
], SysLogOperate.prototype, "costTime", void 0);
exports.SysLogOperate = SysLogOperate = __decorate([
    (0, typeorm_1.Entity)('sys_log_operate')
], SysLogOperate);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX2xvZ19vcGVyYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvc3lzdGVtL21vZGVsL3N5c19sb2dfb3BlcmF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxpREFBb0Q7QUFDcEQscUNBQWlFO0FBRWpFLGFBQWE7QUFFTixJQUFNLGFBQWEsMkJBQW5CLE1BQU0sYUFBYTtJQUN4QixVQUFVO0lBR1YsRUFBRSxDQUFTO0lBRVgsVUFBVTtJQUdWLEtBQUssQ0FBUztJQUVkLGlEQUFpRDtJQUdqRCxZQUFZLENBQVM7SUFFckIsV0FBVztJQUdYLFFBQVEsQ0FBUztJQUVqQixVQUFVO0lBR1YsY0FBYyxDQUFTO0lBRXZCLFVBQVU7SUFHVixPQUFPLENBQVM7SUFFaEIsVUFBVTtJQUdWLGFBQWEsQ0FBUztJQUV0QixVQUFVO0lBR1YsVUFBVSxDQUFTO0lBRW5CLFVBQVU7SUFHVixRQUFRLENBQVM7SUFFakIsVUFBVTtJQUdWLFdBQVcsQ0FBUztJQUVwQixVQUFVO0lBR1YsT0FBTyxDQUFTO0lBRWhCLFVBQVU7SUFHVixTQUFTLENBQVM7SUFFbEIsbUJBQW1CO0lBR25CLFVBQVUsQ0FBUztJQUVuQixjQUFjO0lBR2QsUUFBUSxDQUFTO0NBQ2xCLENBQUE7QUFsRUM7SUFGQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoQyxJQUFBLGdDQUFzQixFQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDOzt5Q0FDNUI7QUFLWDtJQUZDLElBQUEsZUFBSSxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2pDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQzs7NENBQ1o7QUFLZDtJQUZDLElBQUEsZUFB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