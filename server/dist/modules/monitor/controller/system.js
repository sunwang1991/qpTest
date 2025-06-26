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
exports.SystemInfoController = void 0;
const core_1 = require("@midwayjs/core");
const api_1 = require("../../../framework/resp/api");
const system_info_1 = require("../service/system_info");
const authorize_user_1 = require("../../../framework/middleware/authorize_user");
const authorize_oauth2_1 = require("../../../framework/middleware/authorize_oauth2");
/**服务器监控信息 控制层处理 */
let SystemInfoController = exports.SystemInfoController = class SystemInfoController {
    /**在线用户服务 */
    systemInfoService;
    /**
     * 服务器信息
     */
    async info() {
        return api_1.Resp.okData({
            project: this.systemInfoService.projectInfo(),
            cpu: this.systemInfoService.cpuInfo(),
            memory: this.systemInfoService.memoryInfo(),
            network: this.systemInfoService.networkInfo(),
            time: this.systemInfoService.timeInfo(),
            system: this.systemInfoService.systemInfo(),
            disk: await this.systemInfoService.diskInfo(),
        });
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", system_info_1.SystemInfoService)
], SystemInfoController.prototype, "systemInfoService", void 0);
__decorate([
    (0, core_1.Get)('/oauth2/open/monitor/system', {
        middleware: [(0, authorize_oauth2_1.AuthorizeOauth2Middleware)([])],
    }),
    (0, core_1.Get)('/monitor/system', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['monitor:system:info'] }),
        ],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SystemInfoController.prototype, "info", null);
exports.SystemInfoController = SystemInfoController = __decorate([
    (0, core_1.Controller)()
], SystemInfoController);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzdGVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvbW9uaXRvci9jb250cm9sbGVyL3N5c3RlbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBeUQ7QUFFekQscURBQW1EO0FBQ25ELHdEQUEyRDtBQUMzRCxpRkFBdUY7QUFDdkYscUZBQTJGO0FBRTNGLG1CQUFtQjtBQUVaLElBQU0sb0JBQW9CLGtDQUExQixNQUFNLG9CQUFvQjtJQUMvQixZQUFZO0lBRUosaUJBQWlCLENBQW9CO0lBRTdDOztPQUVHO0lBU1UsQUFBTixLQUFLLENBQUMsSUFBSTtRQUNmLE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FBQztZQUNqQixPQUFPLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsRUFBRTtZQUM3QyxHQUFHLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRTtZQUNyQyxNQUFNLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsRUFBRTtZQUMzQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsRUFBRTtZQUM3QyxJQUFJLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRTtZQUN2QyxNQUFNLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsRUFBRTtZQUMzQyxJQUFJLEVBQUUsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFO1NBQzlDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRixDQUFBO0FBeEJTO0lBRFAsSUFBQSxhQUFNLEdBQUU7OEJBQ2tCLCtCQUFpQjsrREFBQztBQWFoQztJQVJaLElBQUEsVUFBRyxFQUFDLDZCQUE2QixFQUFFO1FBQ2xDLFVBQVUsRUFBRSxDQUFDLElBQUEsNENBQXlCLEVBQUMsRUFBRSxDQUFDLENBQUM7S0FDNUMsQ0FBQztJQUNELElBQUEsVUFBRyxFQUFDLGlCQUFpQixFQUFFO1FBQ3RCLFVBQVUsRUFBRTtZQUNWLElBQUEsd0NBQXVCLEVBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLENBQUM7U0FDL0Q7S0FDRixDQUFDOzs7O2dEQVdEOytCQTFCVSxvQkFBb0I7SUFEaEMsSUFBQSxpQkFBVSxHQUFFO0dBQ0Esb0JBQW9CLENBMkJoQyJ9