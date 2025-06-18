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
exports.SysJobLog = void 0;
const validate_1 = require("@midwayjs/validate");
const typeorm_1 = require("typeorm");
/**调度任务调度日志表 */
let SysJobLog = exports.SysJobLog = class SysJobLog {
    /**任务日志ID */
    logId;
    /**任务名称 */
    jobName;
    /**任务组名 */
    jobGroup;
    /**调用目标字符串 */
    invokeTarget;
    /**调用目标传入参数 */
    targetParams;
    /**日志信息 */
    jobMsg;
    /**执行状态（0失败 1正常） */
    statusFlag;
    /**创建时间 */
    createTime;
    /**消耗时间（毫秒） */
    costTime;
};
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.number().allow(0)),
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'log_id' }),
    __metadata("design:type", Number)
], SysJobLog.prototype, "logId", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().required()),
    (0, typeorm_1.Column)({
        type: 'varchar',
        name: 'job_name',
    }),
    __metadata("design:type", String)
], SysJobLog.prototype, "jobName", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().required()),
    (0, typeorm_1.Column)({ name: 'job_group' }),
    __metadata("design:type", String)
], SysJobLog.prototype, "jobGroup", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().required()),
    (0, typeorm_1.Column)({ name: 'invoke_target' }),
    __metadata("design:type", String)
], SysJobLog.prototype, "invokeTarget", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({ name: 'target_params' }),
    __metadata("design:type", String)
], SysJobLog.prototype, "targetParams", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().allow('')),
    (0, typeorm_1.Column)({
        length: 500,
        name: 'job_msg',
    }),
    __metadata("design:type", String)
], SysJobLog.prototype, "jobMsg", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.string().pattern(/^[01]$/)),
    (0, typeorm_1.Column)({ name: 'status_flag' }),
    __metadata("design:type", String)
], SysJobLog.prototype, "statusFlag", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.number().allow(0)),
    (0, typeorm_1.Column)({ name: 'create_time' }),
    __metadata("design:type", Number)
], SysJobLog.prototype, "createTime", void 0);
__decorate([
    (0, validate_1.Rule)(validate_1.RuleType.number().allow(0)),
    (0, typeorm_1.Column)({ name: 'cost_time' }),
    __metadata("design:type", Number)
], SysJobLog.prototype, "costTime", void 0);
exports.SysJobLog = SysJobLog = __decorate([
    (0, typeorm_1.Entity)('sys_job_log')
], SysJobLog);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX2pvYl9sb2cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9tb25pdG9yL21vZGVsL3N5c19qb2JfbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLGlEQUFvRDtBQUNwRCxxQ0FBaUU7QUFFakUsZUFBZTtBQUVSLElBQU0sU0FBUyx1QkFBZixNQUFNLFNBQVM7SUFDcEIsWUFBWTtJQUdaLEtBQUssQ0FBUztJQUVkLFVBQVU7SUFNVixPQUFPLENBQVM7SUFFaEIsVUFBVTtJQUdWLFFBQVEsQ0FBUztJQUVqQixhQUFhO0lBR2IsWUFBWSxDQUFTO0lBRXJCLGNBQWM7SUFHZCxZQUFZLENBQVM7SUFFckIsVUFBVTtJQU1WLE1BQU0sQ0FBUztJQUVmLG1CQUFtQjtJQUduQixVQUFVLENBQVM7SUFFbkIsVUFBVTtJQUdWLFVBQVUsQ0FBUztJQUVuQixjQUFjO0lBR2QsUUFBUSxDQUFTO0NBQ2xCLENBQUE7QUEvQ0M7SUFGQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoQyxJQUFBLGdDQUFzQixFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDOzt3Q0FDN0I7QUFRZDtJQUxDLElBQUEsZUFBSSxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDbEMsSUFBQSxnQkFBTSxFQUFDO1FBQ04sSUFBSSxFQUFFLFNBQVM7UUFDZixJQUFJLEVBQUUsVUFBVTtLQUNqQixDQUFDOzswQ0FDYztBQUtoQjtJQUZDLElBQUEsZUFBSSxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDbEMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxDQUFDOzsyQ0FDYjtBQUtqQjtJQUZDLElBQUEsZUFBSSxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDbEMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxDQUFDOzsrQ0FDYjtBQUtyQjtJQUZDLElBQUEsZUFBSSxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2pDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsQ0FBQzs7K0NBQ2I7QUFRckI7SUFMQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNqQyxJQUFBLGdCQUFNLEVBQUM7UUFDTixNQUFNLEVBQUUsR0FBRztRQUNYLElBQUksRUFBRSxTQUFTO0tBQ2hCLENBQUM7O3lDQUNhO0FBS2Y7SUFGQyxJQUFBLGVBQUksRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN6QyxJQUFBLGdCQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLENBQUM7OzZDQUNiO0FBS25CO0lBRkMsSUFBQSxlQUFJLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxDQUFDOzs2Q0FDYjtBQUtuQjtJQUZDLElBQUEsZUFBSSxFQUFDLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsQ0FBQzs7MkNBQ2I7b0JBbEROLFNBQVM7SUFEckIsSUFBQSxnQkFBTSxFQUFDLGFBQWEsQ0FBQztHQUNULFNBQVMsQ0FtRHJCIn0=