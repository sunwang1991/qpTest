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
exports.SysJob = void 0;
const validate_1 = require("@midwayjs/validate");
const typeorm_1 = require("typeorm");
/**调度任务调度表 */
let SysJob = exports.SysJob = class SysJob {
    /**任务ID */
    jobId;
    /**任务名称 */
    jobName;
    /**任务组名 */
    jobGroup;
    /**调用目标字符串 */
    invokeTarget;
    /**调用目标传入参数 */
    targetParams;
    /**cron执行表达式 */
    cronExpression;
    /**计划执行错误策略（1立即执行 2执行一次 3放弃执行） */
    misfirePolicy;
    /**是否并发执行（0禁止 1允许） */
    concurrent;
    /**任务状态（0暂停 1正常） */
    statusFlag;
    /**是否记录任务日志（0不记录 1记录） */
    saveLog;
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
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'job_id' }),
    __metadata("design:type", Number)
], SysJob.prototype, "jobId", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().required()),
    (0, typeorm_1.Column)({
        type: 'varchar',
        name: 'job_name',
    }),
    __metadata("design:type", String)
], SysJob.prototype, "jobName", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().required()),
    (0, typeorm_1.Column)({ name: 'job_group' }),
    __metadata("design:type", String)
], SysJob.prototype, "jobGroup", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().required()),
    (0, typeorm_1.Column)({ name: 'invoke_target' }),
    __metadata("design:type", String)
], SysJob.prototype, "invokeTarget", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'target_params' }),
    __metadata("design:type", String)
], SysJob.prototype, "targetParams", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().required()),
    (0, typeorm_1.Column)({ name: 'cron_expression' }),
    __metadata("design:type", String)
], SysJob.prototype, "cronExpression", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().pattern(/^[123]$/)),
    (0, typeorm_1.Column)({ name: 'misfire_policy' }),
    __metadata("design:type", String)
], SysJob.prototype, "misfirePolicy", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().pattern(/^[01]$/)),
    (0, typeorm_1.Column)({ name: 'concurrent' }),
    __metadata("design:type", String)
], SysJob.prototype, "concurrent", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().pattern(/^[01]$/)),
    (0, typeorm_1.Column)({ name: 'status_flag' }),
    __metadata("design:type", String)
], SysJob.prototype, "statusFlag", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().pattern(/^[01]$/)),
    (0, typeorm_1.Column)({ name: 'save_log' }),
    __metadata("design:type", String)
], SysJob.prototype, "saveLog", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'create_by' }),
    __metadata("design:type", String)
], SysJob.prototype, "createBy", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.number().allow(0)),
    (0, typeorm_1.Column)({ name: 'create_time' }),
    __metadata("design:type", Number)
], SysJob.prototype, "createTime", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'update_by' }),
    __metadata("design:type", String)
], SysJob.prototype, "updateBy", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.number().allow(0)),
    (0, typeorm_1.Column)({ name: 'update_time' }),
    __metadata("design:type", Number)
], SysJob.prototype, "updateTime", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({
        length: 200,
        name: 'remark',
    }),
    __metadata("design:type", String)
], SysJob.prototype, "remark", void 0);
exports.SysJob = SysJob = __decorate([
    (0, typeorm_1.Entity)('sys_job')
], SysJob);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX2pvYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL21vbml0b3IvbW9kZWwvc3lzX2pvYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxpREFBb0Q7QUFDcEQscUNBQWlFO0FBRWpFLGFBQWE7QUFFTixJQUFNLE1BQU0sb0JBQVosTUFBTSxNQUFNO0lBQ2pCLFVBQVU7SUFHVixLQUFLLENBQVM7SUFFZCxVQUFVO0lBTVYsT0FBTyxDQUFTO0lBRWhCLFVBQVU7SUFHVixRQUFRLENBQVM7SUFFakIsYUFBYTtJQUdiLFlBQVksQ0FBUztJQUVyQixjQUFjO0lBR2QsWUFBWSxDQUFTO0lBRXJCLGVBQWU7SUFHZixjQUFjLENBQVM7SUFFdkIsaUNBQWlDO0lBR2pDLGFBQWEsQ0FBUztJQUV0QixxQkFBcUI7SUFHckIsVUFBVSxDQUFTO0lBRW5CLG1CQUFtQjtJQUduQixVQUFVLENBQVM7SUFFbkIsd0JBQXdCO0lBR3hCLE9BQU8sQ0FBUztJQUVoQixTQUFTO0lBR1QsUUFBUSxDQUFTO0lBRWpCLFVBQVU7SUFHVixVQUFVLENBQVM7SUFFbkIsU0FBUztJQUdULFFBQVEsQ0FBUztJQUVqQixVQUFVO0lBR1YsVUFBVSxDQUFTO0lBRW5CLFFBQVE7SUFNUixNQUFNLENBQVM7Q0FDaEIsQ0FBQTtBQTdFQztJQUZDLElBQUEsZUFBSSxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLElBQUEsZ0NBQXNCLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUM7O3FDQUM3QjtBQVFkO0lBTEMsSUFBQSxlQUFJLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNsQyxJQUFBLGdCQUFNLEVBQUM7UUFDTixJQUFJLEVBQUUsU0FBUztRQUNmLElBQUksRUFBRSxVQUFVO0tBQ2pCLENB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