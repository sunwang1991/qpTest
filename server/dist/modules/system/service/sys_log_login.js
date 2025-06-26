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
exports.SysLogLoginService = void 0;
const core_1 = require("@midwayjs/core");
const file_1 = require("../../../framework/utils/file/file");
const data_1 = require("../../../framework/utils/date/data");
const sys_log_login_1 = require("../repository/sys_log_login");
const sys_log_login_2 = require("../model/sys_log_login");
/**系统登录日志 服务层处理 */
let SysLogLoginService = exports.SysLogLoginService = class SysLogLoginService {
    /**系统登录日志信息 */
    sysLogLoginRepository;
    /**文件服务 */
    fileUtil;
    /**
     * 分页查询列表数据
     * @param query 参数
     * @param dataScopeSQL 角色数据范围过滤SQL字符串
     * @returns [rows, total]
     */
    async findByPage(query, dataScopeSQL) {
        return await this.sysLogLoginRepository.selectByPage(query, dataScopeSQL);
    }
    /**
     * 新增信息
     * @param userName 用户名
     * @param status 状态
     * @param ilobArr 数组 [loginIp,loginLocation,os,browser]
     * @returns ID
     */
    async insert(userName, status, msg, ilobArr) {
        const sysLogLogin = new sys_log_login_2.SysLogLogin();
        sysLogLogin.loginIp = ilobArr[0];
        sysLogLogin.loginLocation = ilobArr[1];
        sysLogLogin.os = ilobArr[2];
        sysLogLogin.browser = ilobArr[3];
        sysLogLogin.userName = userName;
        sysLogLogin.statusFlag = status;
        sysLogLogin.msg = msg;
        const insertId = await this.sysLogLoginRepository.insert(sysLogLogin);
        if (insertId > 0) {
            return insertId;
        }
        return 0;
    }
    /**
     * 清空系统登录日志
     * @returns 数量
     */
    async clean() {
        return await this.sysLogLoginRepository.clean();
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
            let statusValue = '停用';
            if (row.statusFlag === '1') {
                statusValue = '正常';
            }
            const data = {
                序号: row.id,
                用户账号: row.userName,
                登录状态: statusValue,
                登录地址: row.loginIp,
                登录地点: row.loginLocation,
                浏览器: row.browser,
                操作系统: row.os,
                提示消息: row.msg,
                访问时间: (0, data_1.parseDateToStr)(row.loginTime),
            };
            arr.push(data);
        }
        return await this.fileUtil.excelWriteRecord(arr, fileName);
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_log_login_1.SysLogLoginRepository)
], SysLogLoginService.prototype, "sysLogLoginRepository", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", file_1.FileUtil)
], SysLogLoginService.prototype, "fileUtil", void 0);
exports.SysLogLoginService = SysLogLoginService = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], SysLogLoginService);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX2xvZ19sb2dpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3N5c3RlbS9zZXJ2aWNlL3N5c19sb2dfbG9naW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEseUNBQTREO0FBRTVELDZEQUE4RDtBQUM5RCw2REFBb0U7QUFDcEUsK0RBQW9FO0FBQ3BFLDBEQUFxRDtBQUVyRCxrQkFBa0I7QUFHWCxJQUFNLGtCQUFrQixnQ0FBeEIsTUFBTSxrQkFBa0I7SUFDN0IsY0FBYztJQUVOLHFCQUFxQixDQUF3QjtJQUVyRCxVQUFVO0lBRUYsUUFBUSxDQUFXO0lBRTNCOzs7OztPQUtHO0lBQ0ksS0FBSyxDQUFDLFVBQVUsQ0FDckIsS0FBNkIsRUFDN0IsWUFBb0I7UUFFcEIsT0FBTyxNQUFNLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxLQUFLLENBQUMsTUFBTSxDQUNqQixRQUFnQixFQUNoQixNQUFjLEVBQ2QsR0FBVyxFQUNYLE9BQWlCO1FBRWpCLE1BQU0sV0FBVyxHQUFHLElBQUksMkJBQVcsRUFBRSxDQUFDO1FBQ3RDLFdBQVcsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLFdBQVcsQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLFdBQVcsQ0FBQyxFQUFFLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVCLFdBQVcsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLFdBQVcsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ2hDLFdBQVcsQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO1FBQ2hDLFdBQVcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ3RCLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN0RSxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUU7WUFDaEIsT0FBTyxRQUFRLENBQUM7U0FDakI7UUFDRCxPQUFPLENBQUMsQ0FBQztJQUNYLENBQUM7SUFFRDs7O09BR0c7SUFDSSxLQUFLLENBQUMsS0FBSztRQUNoQixPQUFPLE1BQU0sSUFBSSxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2xELENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBbUIsRUFBRSxRQUFnQjtRQUMzRCxTQUFTO1FBQ1QsTUFBTSxHQUFHLEdBQTBCLEVBQUUsQ0FBQztRQUN0QyxLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksRUFBRTtZQUN0QixJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDdkIsSUFBSSxHQUFHLENBQUMsVUFBVSxLQUFLLEdBQUcsRUFBRTtnQkFDMUIsV0FBVyxHQUFHLElBQUksQ0FBQzthQUNwQjtZQUNELE1BQU0sSUFBSSxHQUFHO2dCQUNYLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRTtnQkFDVixJQUFJLEVBQUUsR0FBRyxDQUFDLFFBQVE7Z0JBQ2xCLElBQUksRUFBRSxXQUFXO2dCQUNqQixJQUFJLEVBQUUsR0FBRyxDQUFDLE9BQU87Z0JBQ2pCLElBQUksRUFBRSxHQUFHLENBQUMsYUFBYTtnQkFDdkIsR0FBRyxFQUFFLEdBQUcsQ0FBQyxPQUFPO2dCQUNoQixJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUU7Z0JBQ1osSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHO2dCQUNiLElBQUksRUFBRSxJQUFBLHFCQUFjLEVBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQzthQUNwQyxDQUFDO1lBQ0YsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNoQjtRQUNELE9BQU8sTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM3RCxDQUFDO0NBQ0YsQ0FBQTtBQXBGUztJQURQLElBQUEsYUFBTSxHQUFFOzhCQUNzQixxQ0FBcUI7aUVBQUM7QUFJN0M7SUFEUCxJQUFBLGFBQU0sR0FBRTs4QkFDUyxlQUFRO29EQUFDOzZCQVBoQixrQkFBa0I7SUFGOUIsSUFBQSxjQUFPLEdBQUU7SUFDVCxJQUFBLGdCQUFTLEdBQUU7R0FDQyxrQkFBa0IsQ0F1RjlCIn0=