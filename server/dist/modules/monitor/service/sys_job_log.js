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
exports.SysJobLogService = void 0;
const core_1 = require("@midwayjs/core");
const file_1 = require("../../../framework/utils/file/file");
const data_1 = require("../../../framework/utils/date/data");
const sys_job_log_1 = require("../repository/sys_job_log");
const sys_dict_data_1 = require("../../system/service/sys_dict_data");
/**调度任务日志 服务层处理 */
let SysJobLogService = exports.SysJobLogService = class SysJobLogService {
    /**调度任务日志数据信息 */
    sysJobLogRepository;
    /**字典类型服务 */
    sysDictDataService;
    /**文件服务 */
    fileUtil;
    /**
     * 分页查询
     * @param query 查询参数
     * @returns 结果
     */
    async findByPage(query) {
        return await this.sysJobLogRepository.selectByPage(query);
    }
    /**
     * 查询
     * @param sysJobLog 信息
     * @returns 列表
     */
    async find(sysJobLog) {
        return await this.sysJobLogRepository.select(sysJobLog);
    }
    /**
     * 通过ID查询
     * @param logId 日志ID
     * @returns 结果
     */
    async findById(logId) {
        return await this.sysJobLogRepository.selectById(logId);
    }
    /**
     * 批量删除
     * @param logIds 日志ID数组
     * @returns
     */
    async deleteByIds(logIds) {
        return await this.sysJobLogRepository.deleteByIds(logIds);
    }
    /**
     * 清空调度任务日志
     * @return 删除记录数
     */
    async clean() {
        return this.sysJobLogRepository.clean();
    }
    /**
     * 导出数据表格
     * @param rows 信息
     * @param fileName 文件名
     * @returns 结果
     */
    async exportData(rows, fileName) {
        // 读取任务组名字典数据
        const dictSysJobGroup = await this.sysDictDataService.findByType('sys_job_group');
        // 导出数据组装
        const arr = [];
        for (const item of rows) {
            // 任务组名
            let sysJobGroup = '';
            for (const v of dictSysJobGroup) {
                if (item.jobGroup === v.dataValue) {
                    sysJobGroup = v.dataLabel;
                    break;
                }
            }
            // 状态
            let statusValue = '失败';
            if (item.statusFlag === '1') {
                statusValue = '成功';
            }
            const data = {
                日志序号: item.logId,
                任务名称: item.jobName,
                任务组名: sysJobGroup,
                调用目标: item.invokeTarget,
                传入参数: item.targetParams,
                日志信息: item.jobMsg,
                执行状态: statusValue,
                记录时间: (0, data_1.parseDateToStr)(+item.createTime),
            };
            arr.push(data);
        }
        return await this.fileUtil.excelWriteRecord(arr, fileName);
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_job_log_1.SysJobLogRepository)
], SysJobLogService.prototype, "sysJobLogRepository", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_dict_data_1.SysDictDataService)
], SysJobLogService.prototype, "sysDictDataService", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", file_1.FileUtil)
], SysJobLogService.prototype, "fileUtil", void 0);
exports.SysJobLogService = SysJobLogService = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], SysJobLogService);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX2pvYl9sb2cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9tb25pdG9yL3NlcnZpY2Uvc3lzX2pvYl9sb2cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEseUNBQTREO0FBRTVELDZEQUE4RDtBQUM5RCw2REFBb0U7QUFDcEUsMkRBQWdFO0FBQ2hFLHNFQUF3RTtBQUd4RSxrQkFBa0I7QUFHWCxJQUFNLGdCQUFnQiw4QkFBdEIsTUFBTSxnQkFBZ0I7SUFDM0IsZ0JBQWdCO0lBRVIsbUJBQW1CLENBQXNCO0lBRWpELFlBQVk7SUFFSixrQkFBa0IsQ0FBcUI7SUFFL0MsVUFBVTtJQUVGLFFBQVEsQ0FBVztJQUUzQjs7OztPQUlHO0lBQ0ksS0FBSyxDQUFDLFVBQVUsQ0FDckIsS0FBNkI7UUFFN0IsT0FBTyxNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQW9CO1FBQ3BDLE9BQU8sTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFhO1FBQ2pDLE9BQU8sTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFnQjtRQUNoQyxPQUFPLE1BQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksS0FBSyxDQUFDLEtBQUs7UUFDaEIsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDMUMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFpQixFQUFFLFFBQWdCO1FBQ3pELGFBQWE7UUFDYixNQUFNLGVBQWUsR0FBRyxNQUFNLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQzlELGVBQWUsQ0FDaEIsQ0FBQztRQUNGLFNBQVM7UUFDVCxNQUFNLEdBQUcsR0FBMEIsRUFBRSxDQUFDO1FBQ3RDLEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxFQUFFO1lBQ3ZCLE9BQU87WUFDUCxJQUFJLFdBQVcsR0FBRyxFQUFFLENBQUM7WUFDckIsS0FBSyxNQUFNLENBQUMsSUFBSSxlQUFlLEVBQUU7Z0JBQy9CLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxDQUFDLENBQUMsU0FBUyxFQUFFO29CQUNqQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQztvQkFDMUIsTUFBTTtpQkFDUDthQUNGO1lBQ0QsS0FBSztZQUNMLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQztZQUN2QixJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssR0FBRyxFQUFFO2dCQUMzQixXQUFXLEdBQUcsSUFBSSxDQUFDO2FBQ3BCO1lBQ0QsTUFBTSxJQUFJLEdBQUc7Z0JBQ1gsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUNoQixJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU87Z0JBQ2xCLElBQUksRUFBRSxXQUFXO2dCQUNqQixJQUFJLEVBQUUsSUFBSSxDQUFDLFlBQVk7Z0JBQ3ZCLElBQUksRUFBRSxJQUFJLENBQUMsWUFBWTtnQkFDdkIsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNO2dCQUNqQixJQUFJLEVBQUUsV0FBVztnQkFDakIsSUFBSSxFQUFFLElBQUEscUJBQWMsRUFBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7YUFDdkMsQ0FBQztZQUNGLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDaEI7UUFDRCxPQUFPLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDN0QsQ0FBQztDQUNGLENBQUE7QUFqR1M7SUFEUCxJQUFBLGFBQU0sR0FBRTs4QkFDb0IsaUNBQW1COzZEQUFDO0FBSXpDO0lBRFAsSUFBQSxhQUFNLEdBQUU7OEJBQ21CLGtDQUFrQjs0REFBQztBQUl2QztJQURQLElBQUEsYUFBTSxHQUFFOzhCQUNTLGVBQVE7a0RBQUM7MkJBWGhCLGdCQUFnQjtJQUY1QixJQUFBLGNBQU8sR0FBRTtJQUNULElBQUEsZ0JBQVMsR0FBRTtHQUNDLGdCQUFnQixDQW9HNUIifQ==