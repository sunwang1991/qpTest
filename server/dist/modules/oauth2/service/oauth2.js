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
exports.Oauth2Service = void 0;
const core_1 = require("@midwayjs/core");
const hash_1 = require("../../../framework/utils/crypto/hash");
const cache_key_1 = require("../../../framework/constants/cache_key");
const generate_1 = require("../../../framework/utils/generate/generate");
const redis_1 = require("../../../framework/datasource/redis/redis");
const oauth2_info_1 = require("../../../framework/token/oauth2_info");
const oauth2_client_1 = require("../repository/oauth2_client");
const oauth2_client_2 = require("../model/oauth2_client");
/**用户授权第三方应用信息 服务层处理 */
let Oauth2Service = exports.Oauth2Service = class Oauth2Service {
    /**缓存操作 */
    redis;
    /**用户授权第三方应用表 */
    oauth2ClientRepository;
    /**
     * 创建授权码
     * @return 授权码
     */
    async createCode() {
        const code = (0, generate_1.generateCode)(8);
        const uuid = (0, hash_1.md5)(code);
        const verifyKey = cache_key_1.CACHE_OAUTH2_CODE + ':' + uuid;
        // 授权码有效期，单位秒
        const codeExpiration = 2 * 60 * 60;
        await this.redis.set('', verifyKey, code, codeExpiration);
        return code;
    }
    /**
     * 校验授权码
     * @param code 授权码
     * @returns 错误信息
     */
    async validateCode(code) {
        if (code.length > 16) {
            return 'code length error';
        }
        const uuid = (0, hash_1.md5)(code);
        const verifyKey = cache_key_1.CACHE_OAUTH2_CODE + ':' + uuid;
        const captcha = await this.redis.get('', verifyKey);
        if (captcha == '') {
            return 'code expire';
        }
        await this.redis.del('', verifyKey);
        if (captcha != code.toLowerCase()) {
            return 'code error';
        }
        return '';
    }
    /**
     * 客户端信息
     * @param clientId 客户端ID
     * @param clientSecret 客户端密钥
     * @return 错误结果信息
     */
    async byClient(clientId, clientSecret) {
        const info = new oauth2_info_1.Oauth2Info();
        // 查询用户登录账号
        let item = new oauth2_client_2.Oauth2Client();
        item.clientId = clientId;
        item.clientSecret = clientSecret;
        const rows = await this.oauth2ClientRepository.select(item);
        if (rows.length > 0) {
            item = rows[0];
        }
        if (item.clientId === '') {
            return [info, 'clientId or clientSecret is not exist'];
        }
        info.clientId = clientId;
        // 用户权限组标识
        info.scope = [];
        return [info, ''];
    }
    /**
     * 更新登录时间和IP
     * @returns 更新是否成功
     */
    async updateLoginDateAndIP(info) {
        const item = await this.oauth2ClientRepository.selectByClientId(info.clientId);
        item.loginIp = info.loginIp;
        item.loginTime = info.loginTime;
        const rows = await this.oauth2ClientRepository.update(item);
        return rows > 0;
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", redis_1.RedisCache)
], Oauth2Service.prototype, "redis", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", oauth2_client_1.Oauth2ClientRepository)
], Oauth2Service.prototype, "oauth2ClientRepository", void 0);
exports.Oauth2Service = Oauth2Service = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], Oauth2Service);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2F1dGgyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvb2F1dGgyL3NlcnZpY2Uvb2F1dGgyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHlDQUE0RDtBQUU1RCwrREFBMkQ7QUFDM0Qsc0VBQTJFO0FBQzNFLHlFQUEwRTtBQUMxRSxxRUFBdUU7QUFDdkUsc0VBQWtFO0FBQ2xFLCtEQUFxRTtBQUNyRSwwREFBc0Q7QUFFdEQsdUJBQXVCO0FBR2hCLElBQU0sYUFBYSwyQkFBbkIsTUFBTSxhQUFhO0lBQ3hCLFVBQVU7SUFFRixLQUFLLENBQWE7SUFFMUIsZ0JBQWdCO0lBRVIsc0JBQXNCLENBQXlCO0lBRXZEOzs7T0FHRztJQUNJLEtBQUssQ0FBQyxVQUFVO1FBQ3JCLE1BQU0sSUFBSSxHQUFHLElBQUEsdUJBQVksRUFBQyxDQUFDLENBQUMsQ0FBQztRQUM3QixNQUFNLElBQUksR0FBRyxJQUFBLFVBQUcsRUFBQyxJQUFJLENBQUMsQ0FBQztRQUN2QixNQUFNLFNBQVMsR0FBRyw2QkFBaUIsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQ2pELGFBQWE7UUFDYixNQUFNLGNBQWMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNuQyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQzFELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxLQUFLLENBQUMsWUFBWSxDQUFDLElBQVk7UUFDcEMsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsRUFBRTtZQUNwQixPQUFPLG1CQUFtQixDQUFDO1NBQzVCO1FBQ0QsTUFBTSxJQUFJLEdBQUcsSUFBQSxVQUFHLEVBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkIsTUFBTSxTQUFTLEdBQUcsNkJBQWlCLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQztRQUNqRCxNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNwRCxJQUFJLE9BQU8sSUFBSSxFQUFFLEVBQUU7WUFDakIsT0FBTyxhQUFhLENBQUM7U0FDdEI7UUFDRCxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNwQyxJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUU7WUFDakMsT0FBTyxZQUFZLENBQUM7U0FDckI7UUFDRCxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLEtBQUssQ0FBQyxRQUFRLENBQ25CLFFBQWdCLEVBQ2hCLFlBQW9CO1FBRXBCLE1BQU0sSUFBSSxHQUFHLElBQUksd0JBQVUsRUFBRSxDQUFDO1FBRTlCLFdBQVc7UUFDWCxJQUFJLElBQUksR0FBRyxJQUFJLDRCQUFZLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztRQUNqQyxNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUQsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNuQixJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2hCO1FBQ0QsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLEVBQUUsRUFBRTtZQUN4QixPQUFPLENBQUMsSUFBSSxFQUFFLHVDQUF1QyxDQUFDLENBQUM7U0FDeEQ7UUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixVQUFVO1FBQ1YsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDaEIsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksS0FBSyxDQUFDLG9CQUFvQixDQUFDLElBQWdCO1FBQ2hELE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLHNCQUFzQixDQUFDLGdCQUFnQixDQUM3RCxJQUFJLENBQUMsUUFBUSxDQUNkLENBQUM7UUFDRixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDNUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ2hDLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1RCxPQUFPLElBQUksR0FBRyxDQUFDLENBQUM7SUFDbEIsQ0FBQztDQUNGLENBQUE7QUFyRlM7SUFEUCxJQUFBLGFBQU0sR0FBRTs4QkFDTSxrQkFBVTs0Q0FBQztBQUlsQjtJQURQLElBQUEsYUFBTSxHQUFFOzhCQUN1QixzQ0FBc0I7NkRBQUM7d0JBUDVDLGFBQWE7SUFGekIsSUFBQSxjQUFPLEdBQUU7SUFDVCxJQUFBLGdCQUFTLEdBQUU7R0FDQyxhQUFhLENBd0Z6QiJ9