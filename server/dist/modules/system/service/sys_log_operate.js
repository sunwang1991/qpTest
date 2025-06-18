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
exports.SysLogOperateService = void 0;
const core_1 = require("@midwayjs/core");
const file_1 = require("../../../framework/utils/file/file");
const data_1 = require("../../../framework/utils/date/data");
const sys_log_operate_1 = require("../repository/sys_log_operate");
/**操作日志表 服务层处理 */
let SysLogOperateService = exports.SysLogOperateService = class SysLogOperateService {
    /**操作日志信息 */
    sysLogOperateRepository;
    /**文件服务 */
    fileUtil;
    /**
     * 分页查询列表数据
     * @param query 参数
     * @param dataScopeSQL 角色数据范围过滤SQL字符串
     * @returns [rows, total]
     */
    async findByPage(query, dataScopeSQL) {
        return await this.sysLogOperateRepository.selectByPage(query, dataScopeSQL);
    }
    /**
     * 新增信息
     * @param sysLogOperate 信息
     * @returns ID
     */
    async insert(sysLogOperate) {
        return await this.sysLogOperateRepository.insert(sysLogOperate);
    }
    /**
     * 清空操作日志
     * @returns 数量
     */
    async clean() {
        return await this.sysLogOperateRepository.clean();
    }
    /**
     * 导出数据表格
     * @param rows 信息
     * @param fileName 文件名
     * @returns 结果
     */
    async exportData(rows, fileName) {
        // 导出数据组装
        const arr = [];
        for (const row of rows) {
            // 业务类型
            const businessType = '';
            // 状态
            let statusValue = '停用';
            if (row.statusFlag === '1') {
                statusValue = '正常';
            }
            const data = {
                操作序号: row.id,
                模块标题: row.title,
                业务类型: businessType,
                请求URL: row.operaUrl,
                请求方式: row.operaUrlMethod,
                主机地址: row.operaIp,
                操作地点: row.operaLocation,
                请求参数: row.operaParam,
                操作消息: row.operaMsg,
                方法名称: row.operaMethod,
                操作人员: row.operaBy,
                操作时间: (0, data_1.parseDateToStr)(row.operaTime),
                操作状态: statusValue,
                消耗时间: row.costTime,
            };
            arr.push(data);
        }
        return await this.fileUtil.excelWriteRecord(arr, fileName);
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_log_operate_1.SysLogOperateRepository)
], SysLogOperateService.prototype, "sysLogOperateRepository", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", file_1.FileUtil)
], SysLogOperateService.prototype, "fileUtil", void 0);
exports.SysLogOperateService = SysLogOperateService = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], SysLogOperateService);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX2xvZ19vcGVyYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvc3lzdGVtL3NlcnZpY2Uvc3lzX2xvZ19vcGVyYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHlDQUE0RDtBQUU1RCw2REFBOEQ7QUFDOUQsNkRBQW9FO0FBQ3BFLG1FQUF3RTtBQUd4RSxpQkFBaUI7QUFHVixJQUFNLG9CQUFvQixrQ0FBMUIsTUFBTSxvQkFBb0I7SUFDL0IsWUFBWTtJQUVKLHVCQUF1QixDQUEwQjtJQUV6RCxVQUFVO0lBRUYsUUFBUSxDQUFXO0lBRTNCOzs7OztPQUtHO0lBQ0ksS0FBSyxDQUFDLFVBQVUsQ0FDckIsS0FBNkIsRUFDN0IsWUFBb0I7UUFFcEIsT0FBTyxNQUFNLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksS0FBSyxDQUFDLE1BQU0sQ0FBQyxhQUE0QjtRQUM5QyxPQUFPLE1BQU0sSUFBSSxDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksS0FBSyxDQUFDLEtBQUs7UUFDaEIsT0FBTyxNQUFNLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNwRCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxLQUFLLENBQUMsVUFBVSxDQUFDLElBQXFCLEVBQUUsUUFBZ0I7UUFDN0QsU0FBUztRQUNULE1BQU0sR0FBRyxHQUEwQixFQUFFLENBQUM7UUFDdEMsS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLEVBQUU7WUFDdEIsT0FBTztZQUNQLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQztZQUN4QixLQUFLO1lBQ0wsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLElBQUksR0FBRyxDQUFDLFVBQVUsS0FBSyxHQUFHLEVBQUU7Z0JBQzFCLFdBQVcsR0FBRyxJQUFJLENBQUM7YUFDcEI7WUFDRCxNQUFNLElBQUksR0FBRztnQkFDWCxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUU7Z0JBQ1osSUFBSSxFQUFFLEdBQUcsQ0FBQyxLQUFLO2dCQUNmLElBQUksRUFBRSxZQUFZO2dCQUNsQixLQUFLLEVBQUUsR0FBRyxDQUFDLFFBQVE7Z0JBQ25CLElBQUksRUFBRSxHQUFHLENBQUMsY0FBYztnQkFDeEIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxPQUFPO2dCQUNqQixJQUFJLEVBQUUsR0FBRyxDQUFDLGFBQWE7Z0JBQ3ZCLElBQUksRUFBRSxHQUFHLENBQUMsVUFBVTtnQkFDcEIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxRQUFRO2dCQUNsQixJQUFJLEVBQUUsR0FBRyxDQUFDLFdBQVc7Z0JBQ3JCLElBQUksRUFBRSxHQUFHLENBQUMsT0FBTztnQkFDakIsSUFBSSxFQUFFLElBQUEscUJBQWMsRUFBQyxHQUFHLENBQUMsU0FBUyxDQUFDO2dCQUNuQyxJQUFJLEVBQUUsV0FBVztnQkFDakIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxRQUFRO2FBQ25CLENBQUM7WUFDRixHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2hCO1FBQ0QsT0FBTyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzdELENBQUM7Q0FDRixDQUFBO0FBekVTO0lBRFAsSUFBQSxhQUFNLEdBQUU7OEJBQ3dCLHlDQUF1QjtxRUFBQztBQUlqRDtJQURQLElBQUEsYUFBTSxHQUFFOzhCQUNTLGVBQVE7c0RBQUM7K0JBUGhCLG9CQUFvQjtJQUZoQyxJQUFBLGNBQU8sR0FBRTtJQUNULElBQUEsZ0JBQVMsR0FBRTtHQUNDLG9CQUFvQixDQTRFaEMifQ==