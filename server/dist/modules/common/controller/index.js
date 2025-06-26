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
exports.IndexController = void 0;
const core_1 = require("@midwayjs/core");
const rate_limit_1 = require("../../../framework/middleware/rate_limit");
const api_1 = require("../../../framework/resp/api");
/**路由主页 控制层处理 */
let IndexController = exports.IndexController = class IndexController {
    /**内置的信息服务，提供基础的项目数据 */
    midwayInformationService;
    /**根路由 */
    async index() {
        const pkg = this.midwayInformationService.getPkg();
        return api_1.Resp.okData({
            name: pkg.name,
            version: pkg.version,
        });
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", core_1.MidwayInformationService)
], IndexController.prototype, "midwayInformationService", void 0);
__decorate([
    (0, core_1.Get)('', {
        middleware: [(0, rate_limit_1.RateLimitMiddleware)({ time: 300, count: 60, type: rate_limit_1.LIMIT_IP })],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IndexController.prototype, "index", null);
exports.IndexController = IndexController = __decorate([
    (0, core_1.Controller)('/')
], IndexController);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9jb21tb24vY29udHJvbGxlci9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSx5Q0FLd0I7QUFFeEIseUVBR2tEO0FBQ2xELHFEQUFtRDtBQUVuRCxnQkFBZ0I7QUFFVCxJQUFNLGVBQWUsNkJBQXJCLE1BQU0sZUFBZTtJQUMxQix1QkFBdUI7SUFFZix3QkFBd0IsQ0FBMkI7SUFFM0QsU0FBUztJQUlJLEFBQU4sS0FBSyxDQUFDLEtBQUs7UUFDaEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ25ELE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FBQztZQUNqQixJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUk7WUFDZCxPQUFPLEVBQUUsR0FBRyxDQUFDLE9BQU87U0FDckIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGLENBQUE7QUFiUztJQURQLElBQUEsYUFBTSxHQUFFOzhCQUN5QiwrQkFBd0I7aUVBQUM7QUFNOUM7SUFIWixJQUFBLFVBQUcsRUFBQyxFQUFFLEVBQUU7UUFDUCxVQUFVLEVBQUUsQ0FBQyxJQUFBLGdDQUFtQixFQUFDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxxQkFBUSxFQUFFLENBQUMsQ0FBQztLQUM1RSxDQUFDOzs7OzRDQU9EOzBCQWZVLGVBQWU7SUFEM0IsSUFBQSxpQkFBVSxFQUFDLEdBQUcsQ0FBQztHQUNILGVBQWUsQ0FnQjNCIn0=