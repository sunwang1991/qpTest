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
exports.Oauth2ClientService = void 0;
const core_1 = require("@midwayjs/core");
const oauth2_client_1 = require("../repository/oauth2_client");
const generate_1 = require("../../../framework/utils/generate/generate");
/**用户授权第三方应用信息 服务层处理 */
let Oauth2ClientService = exports.Oauth2ClientService = class Oauth2ClientService {
    /**用户授权第三方应用表 */
    oauth2ClientRepository;
    /**
     * 分页查询
     * @param query 查询参数
     * @return 错误结果信息
     */
    async findByPage(query) {
        return await this.oauth2ClientRepository.selectByPage(query);
    }
    /**
     * 查询集合
     * @param clientId 客户端ID
     * @return 错误结果信息
     */
    async findByClientId(clientId) {
        return await this.oauth2ClientRepository.selectByClientId(clientId);
    }
    /**
     * 新增
     * @param param 信息
     * @return 新增数据ID
     */
    async insert(param) {
        param.clientId = (0, generate_1.generateCode)(16);
        param.clientSecret = (0, generate_1.generateCode)(32);
        return await this.oauth2ClientRepository.insert(param);
    }
    /**
     * 更新
     * @param param 信息
     * @return 影响记录数
     */
    async update(param) {
        return await this.oauth2ClientRepository.update(param);
    }
    /**
     * 更新
     * @param param 信息
     * @return 影响记录数
     */
    async deleteByIds(ids) {
        // 检查是否存在
        const arr = await this.oauth2ClientRepository.selectByIds(ids);
        if (arr.length <= 0) {
            return [0, '没有权限访问用户授权第三方应用数据！'];
        }
        if (arr.length == ids.length) {
            const rows = await this.oauth2ClientRepository.deleteByIds(ids);
            return [rows, ''];
        }
        return [0, '删除用户授权第三方应用信息失败！'];
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", oauth2_client_1.Oauth2ClientRepository)
], Oauth2ClientService.prototype, "oauth2ClientRepository", void 0);
exports.Oauth2ClientService = Oauth2ClientService = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], Oauth2ClientService);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2F1dGgyX2NsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL29hdXRoMi9zZXJ2aWNlL29hdXRoMl9jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEseUNBQTREO0FBRTVELCtEQUFxRTtBQUVyRSx5RUFBMEU7QUFFMUUsdUJBQXVCO0FBR2hCLElBQU0sbUJBQW1CLGlDQUF6QixNQUFNLG1CQUFtQjtJQUM5QixnQkFBZ0I7SUFFUixzQkFBc0IsQ0FBeUI7SUFFdkQ7Ozs7T0FJRztJQUNJLEtBQUssQ0FBQyxVQUFVLENBQ3JCLEtBQTZCO1FBRTdCLE9BQU8sTUFBTSxJQUFJLENBQUMsc0JBQXNCLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksS0FBSyxDQUFDLGNBQWMsQ0FBQyxRQUFnQjtRQUMxQyxPQUFPLE1BQU0sSUFBSSxDQUFDLHNCQUFzQixDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFtQjtRQUNyQyxLQUFLLENBQUMsUUFBUSxHQUFHLElBQUEsdUJBQVksRUFBQyxFQUFFLENBQUMsQ0FBQztRQUNsQyxLQUFLLENBQUMsWUFBWSxHQUFHLElBQUEsdUJBQVksRUFBQyxFQUFFLENBQUMsQ0FBQztRQUN0QyxPQUFPLE1BQU0sSUFBSSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBbUI7UUFDckMsT0FBTyxNQUFNLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxLQUFLLENBQUMsV0FBVyxDQUFDLEdBQWE7UUFDcEMsU0FBUztRQUNULE1BQU0sR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLHNCQUFzQixDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvRCxJQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1lBQ25CLE9BQU8sQ0FBQyxDQUFDLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztTQUNsQztRQUNELElBQUksR0FBRyxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUMsTUFBTSxFQUFFO1lBQzVCLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLHNCQUFzQixDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNoRSxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQ25CO1FBQ0QsT0FBTyxDQUFDLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7Q0FDRixDQUFBO0FBM0RTO0lBRFAsSUFBQSxhQUFNLEdBQUU7OEJBQ3VCLHNDQUFzQjttRUFBQzs4QkFINUMsbUJBQW1CO0lBRi9CLElBQUEsY0FBTyxHQUFFO0lBQ1QsSUFBQSxnQkFBUyxHQUFFO0dBQ0MsbUJBQW1CLENBOEQvQiJ9