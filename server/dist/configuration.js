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
exports.MainConfiguration = void 0;
const node_path_1 = require("node:path");
const core_1 = require("@midwayjs/core");
const koa = require("@midwayjs/koa");
const validate = require("@midwayjs/validate");
const typeorm = require("@midwayjs/typeorm");
const redis = require("@midwayjs/redis");
const upload = require("@midwayjs/upload");
const staticFile = require("@midwayjs/static-file");
const bull = require("@midwayjs/bull");
const crossDomain = require("@midwayjs/cross-domain");
const security = require("@midwayjs/security");
const utils_1 = require("./framework/utils/file/utils");
const report_1 = require("./framework/middleware/report");
const catch_1 = require("./framework/catch");
let MainConfiguration = exports.MainConfiguration = class MainConfiguration {
    app;
    decoratorService;
    /**
     * 在依赖注入容器 ready 的时候执行
     */
    async onReady() {
        // 注册中间件
        this.app.useMiddleware([report_1.ReportMiddleware]);
        // 注册捕获异常处理器
        this.app.useFilter(catch_1.ErrorCatchFilters);
    }
    /**
     * 在应用服务启动后执行
     */
    async onServerReady() {
        // 读取静态文件配置目录检查并初始创建目录
        const staticDir = this.app.getConfig('staticFile.dirs.default.dir');
        const uploadDir = this.app.getConfig('staticFile.dirs.upload.dir');
        await (0, utils_1.checkDirPathExists)(staticDir);
        await (0, utils_1.checkDirPathExists)(uploadDir);
        // 记录程序开始运行的时间点
        this.app.setAttr('runTime', Date.now());
        // 输出当期服务环境运行配置
        this.app.getLogger().warn('当期服务环境运行配置 => %s', this.app.getEnv());
    }
};
__decorate([
    (0, core_1.App)('koa'),
    __metadata("design:type", Object)
], MainConfiguration.prototype, "app", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", core_1.MidwayDecoratorService)
], MainConfiguration.prototype, "decoratorService", void 0);
exports.MainConfiguration = MainConfiguration = __decorate([
    (0, core_1.Configuration)({
        imports: [
            koa,
            validate,
            security,
            crossDomain,
            upload,
            staticFile,
            typeorm,
            redis,
            bull, // 任务队列Bull
        ],
        importConfigs: [(0, node_path_1.normalize)((0, node_path_1.join)(__dirname, './config'))],
    })
], MainConfiguration);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlndXJhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb25maWd1cmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHlDQUE0QztBQUU1Qyx5Q0FLd0I7QUFDeEIscUNBQXFDO0FBQ3JDLCtDQUErQztBQUMvQyw2Q0FBNkM7QUFDN0MseUNBQXlDO0FBQ3pDLDJDQUEyQztBQUMzQyxvREFBb0Q7QUFDcEQsdUNBQXVDO0FBQ3ZDLHNEQUFzRDtBQUN0RCwrQ0FBK0M7QUFFL0Msd0RBQWtFO0FBQ2xFLDBEQUFpRTtBQUNqRSw2Q0FBc0Q7QUFnQi9DLElBQU0saUJBQWlCLCtCQUF2QixNQUFNLGlCQUFpQjtJQUU1QixHQUFHLENBQWtCO0lBR3JCLGdCQUFnQixDQUF5QjtJQUV6Qzs7T0FFRztJQUNILEtBQUssQ0FBQyxPQUFPO1FBQ1gsUUFBUTtRQUNSLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMseUJBQWdCLENBQUMsQ0FBQyxDQUFDO1FBQzNDLFlBQVk7UUFDWixJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyx5QkFBaUIsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRDs7T0FFRztJQUNILEtBQUssQ0FBQyxhQUFhO1FBQ2pCLHNCQUFzQjtRQUN0QixNQUFNLFNBQVMsR0FBVyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1FBQzVFLE1BQU0sU0FBUyxHQUFXLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDRCQUE0QixDQUFDLENBQUM7UUFDM0UsTUFBTSxJQUFBLDBCQUFrQixFQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3BDLE1BQU0sSUFBQSwwQkFBa0IsRUFBQyxTQUFTLENBQUMsQ0FBQztRQUNwQyxlQUFlO1FBQ2YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3hDLGVBQWU7UUFDZixJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDbkUsQ0FBQztDQUNGLENBQUE7QUE3QkM7SUFEQyxJQUFBLFVBQUcsRUFBQyxLQUFLLENBQUM7OzhDQUNVO0FBR3JCO0lBREMsSUFBQSxhQUFNLEdBQUU7OEJBQ1MsNkJBQXNCOzJEQUFDOzRCQUw5QixpQkFBaUI7SUFkN0IsSUFBQSxvQkFBYSxFQUFDO1FBQ2IsT0FBTyxFQUFFO1lBQ1AsR0FBRztZQUNILFFBQVE7WUFDUixRQUFRO1lBQ1IsV0FBVztZQUNYLE1BQU07WUFDTixVQUFVO1lBQ1YsT0FBTztZQUNQLEtBQUs7WUFDTCxJQUFJLEVBQUUsV0FBVztTQUNsQjtRQUNELGFBQWEsRUFBRSxDQUFDLElBQUEscUJBQVMsRUFBQyxJQUFBLGdCQUFJLEVBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7S0FDeEQsQ0FBQztHQUNXLGlCQUFpQixDQStCN0IifQ==