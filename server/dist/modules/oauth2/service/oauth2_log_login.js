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
exports.Oauth2LogLoginService = void 0;
const core_1 = require("@midwayjs/core");
const file_1 = require("../../../framework/utils/file/file");
const data_1 = require("../../../framework/utils/date/data");
const oauth2_log_login_1 = require("../repository/oauth2_log_login");
const oauth2_log_login_2 = require("../model/oauth2_log_login");
/**用户授权第三方应用登录日志 服务层处理 */
let Oauth2LogLoginService = exports.Oauth2LogLoginService = class Oauth2LogLoginService {
    /**用户授权第三方应用登录日志信息 */
    oauth2LogLoginRepository;
    /**文件服务 */
    fileUtil;
    /**
     * 分页查询列表数据
     * @param query 参数
     * @returns [rows, total]
     */
    async findByPage(query) {
        return await this.oauth2LogLoginRepository.selectByPage(query);
    }
    /**
     * 新增信息
     * @param clientId 用户名
     * @param status 状态
     * @param ilobArr 数组 [loginIp,loginLocation,os,browser]
     * @returns ID
     */
    async insert(clientId, status, msg, ilobArr) {
        const item = new oauth2_log_login_2.Oauth2LogLogin();
        item.loginIp = ilobArr[0];
        item.loginLocation = ilobArr[1];
        item.os = ilobArr[2];
        item.browser = ilobArr[3];
        item.clientId = clientId;
        item.statusFlag = status;
        item.msg = msg;
        const insertId = await this.oauth2LogLoginRepository.insert(item);
        if (insertId > 0) {
            return insertId;
        }
        return 0;
    }
    /**
     * 清空用户授权第三方应用登录日志
     * @returns 数量
     */
    async clean() {
        return await this.oauth2LogLoginRepository.clean();
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
            let statusValue = '失败';
            if (row.statusFlag === '1') {
                statusValue = '成功';
            }
            const data = {
                序号: row.id,
                应用的唯一标识: row.clientId,
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
    __metadata("design:type", oauth2_log_login_1.Oauth2LogLoginRepository)
], Oauth2LogLoginService.prototype, "oauth2LogLoginRepository", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", file_1.FileUtil)
], Oauth2LogLoginService.prototype, "fileUtil", void 0);
exports.Oauth2LogLoginService = Oauth2LogLoginService = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], Oauth2LogLoginService);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2F1dGgyX2xvZ19sb2dpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL29hdXRoMi9zZXJ2aWNlL29hdXRoMl9sb2dfbG9naW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEseUNBQTREO0FBRTVELDZEQUE4RDtBQUM5RCw2REFBb0U7QUFDcEUscUVBQTBFO0FBQzFFLGdFQUEyRDtBQUUzRCx5QkFBeUI7QUFHbEIsSUFBTSxxQkFBcUIsbUNBQTNCLE1BQU0scUJBQXFCO0lBQ2hDLHFCQUFxQjtJQUViLHdCQUF3QixDQUEyQjtJQUUzRCxVQUFVO0lBRUYsUUFBUSxDQUFXO0lBRTNCOzs7O09BSUc7SUFDSSxLQUFLLENBQUMsVUFBVSxDQUNyQixLQUE2QjtRQUU3QixPQUFPLE1BQU0sSUFBSSxDQUFDLHdCQUF3QixDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksS0FBSyxDQUFDLE1BQU0sQ0FDakIsUUFBZ0IsRUFDaEIsTUFBYyxFQUNkLEdBQVcsRUFDWCxPQUFpQjtRQUVqQixNQUFNLElBQUksR0FBRyxJQUFJLGlDQUFjLEVBQUUsQ0FBQztRQUNsQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsRUFBRSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQztRQUN6QixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsRSxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUU7WUFDaEIsT0FBTyxRQUFRLENBQUM7U0FDakI7UUFDRCxPQUFPLENBQUMsQ0FBQztJQUNYLENBQUM7SUFFRDs7O09BR0c7SUFDSSxLQUFLLENBQUMsS0FBSztRQUNoQixPQUFPLE1BQU0sSUFBSSxDQUFDLHdCQUF3QixDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3JELENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBc0IsRUFBRSxRQUFnQjtRQUM5RCxTQUFTO1FBQ1QsTUFBTSxHQUFHLEdBQTBCLEVBQUUsQ0FBQztRQUN0QyxLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksRUFBRTtZQUN0QixJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDdkIsSUFBSSxHQUFHLENBQUMsVUFBVSxLQUFLLEdBQUcsRUFBRTtnQkFDMUIsV0FBVyxHQUFHLElBQUksQ0FBQzthQUNwQjtZQUNELE1BQU0sSUFBSSxHQUFHO2dCQUNYLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRTtnQkFDVixPQUFPLEVBQUUsR0FBRyxDQUFDLFFBQVE7Z0JBQ3JCLElBQUksRUFBRSxXQUFXO2dCQUNqQixJQUFJLEVBQUUsR0FBRyxDQUFDLE9BQU87Z0JBQ2pCLElBQUksRUFBRSxHQUFHLENBQUMsYUFBYTtnQkFDdkIsR0FBRyxFQUFFLEdBQUcsQ0FBQyxPQUFPO2dCQUNoQixJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUU7Z0JBQ1osSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHO2dCQUNiLElBQUksRUFBRSxJQUFBLHFCQUFjLEVBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQzthQUNwQyxDQUFDO1lBQ0YsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNoQjtRQUNELE9BQU8sTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM3RCxDQUFDO0NBQ0YsQ0FBQTtBQWxGUztJQURQLElBQUEsYUFBTSxHQUFFOzhCQUN5QiwyQ0FBd0I7dUVBQUM7QUFJbkQ7SUFEUCxJQUFBLGFBQU0sR0FBRTs4QkFDUyxlQUFRO3VEQUFDO2dDQVBoQixxQkFBcUI7SUFGakMsSUFBQSxjQUFPLEdBQUU7SUFDVCxJQUFBLGdCQUFTLEdBQUU7R0FDQyxxQkFBcUIsQ0FxRmpDIn0=