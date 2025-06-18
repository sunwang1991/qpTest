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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheController = void 0;
const core_1 = require("@midwayjs/core");
const validate_1 = require("@midwayjs/validate");
const cache_key_1 = require("../../../framework/constants/cache_key");
const authorize_user_1 = require("../../../framework/middleware/authorize_user");
const redis_1 = require("../../../framework/datasource/redis/redis");
const api_1 = require("../../../framework/resp/api");
const sys_cache_1 = require("../model/sys_cache");
/**缓存信息 控制层处理 */
let CacheController = exports.CacheController = class CacheController {
    /**缓存服务 */
    redisCache;
    /**Redis信息 */
    async info() {
        return api_1.Resp.okData({
            info: await this.redisCache.info(''),
            dbSize: await this.redisCache.keySize(''),
            commandStats: await this.redisCache.commandStats(''),
        });
    }
    /**缓存名称列表 */
    async names() {
        const caches = [
            new sys_cache_1.SysCache().newNames('用户令牌', cache_key_1.CACHE_TOKEN_DEVICE),
            new sys_cache_1.SysCache().newNames('配置信息', cache_key_1.CACHE_SYS_CONFIG),
            new sys_cache_1.SysCache().newNames('数据字典', cache_key_1.CACHE_SYS_DICT),
            new sys_cache_1.SysCache().newNames('用户验证码', cache_key_1.CACHE_CAPTCHA_CODE),
            new sys_cache_1.SysCache().newNames('防重提交', cache_key_1.CACHE_REPEAT_SUBMIT),
            new sys_cache_1.SysCache().newNames('限流处理', cache_key_1.CACHE_RATE_LIMIT),
            new sys_cache_1.SysCache().newNames('密码错误次数', cache_key_1.CACHE_PWD_ERR_COUNT),
            new sys_cache_1.SysCache().newNames('客户端授权码', cache_key_1.CACHE_OAUTH2_CODE),
            new sys_cache_1.SysCache().newNames('客户端令牌', cache_key_1.CACHE_OAUTH2_DEVICE),
        ];
        return api_1.Resp.okData(caches);
    }
    /**缓存名称下键名列表 */
    async keys(cacheName) {
        const cacheKeys = await this.redisCache.getKeys('', `${cacheName}:*`);
        const caches = [];
        for (const key of cacheKeys) {
            caches.push(new sys_cache_1.SysCache().newKeys(cacheName, key));
        }
        return api_1.Resp.okData(caches);
    }
    /**缓存内容信息 */
    async value(cacheName, cacheKey) {
        const cacheValue = await this.redisCache.get('', `${cacheName}:${cacheKey}`);
        const sysCache = new sys_cache_1.SysCache().newValue(cacheName, cacheKey, cacheValue);
        return api_1.Resp.okData(sysCache);
    }
    /**缓存名称列表安全删除 */
    async cleanNames() {
        // 指定清除的缓存列表
        const caches = [
            new sys_cache_1.SysCache().newNames('配置信息', cache_key_1.CACHE_SYS_CONFIG),
            new sys_cache_1.SysCache().newNames('数据字典', cache_key_1.CACHE_SYS_DICT),
            new sys_cache_1.SysCache().newNames('用户验证码', cache_key_1.CACHE_CAPTCHA_CODE),
            new sys_cache_1.SysCache().newNames('防重提交', cache_key_1.CACHE_REPEAT_SUBMIT),
            new sys_cache_1.SysCache().newNames('限流处理', cache_key_1.CACHE_RATE_LIMIT),
            new sys_cache_1.SysCache().newNames('密码错误次数', cache_key_1.CACHE_PWD_ERR_COUNT),
            new sys_cache_1.SysCache().newNames('客户端授权码', cache_key_1.CACHE_OAUTH2_CODE),
        ];
        for (const v of caches) {
            const cacheKeys = await this.redisCache.getKeys('', `${v.cacheName}:*`);
            await this.redisCache.delKeys('', cacheKeys);
        }
        return api_1.Resp.ok();
    }
    /**缓存名称下键名删除 */
    async cleanKeys(cacheName) {
        if (cacheName.startsWith(cache_key_1.CACHE_TOKEN_DEVICE)) {
            return api_1.Resp.errMsg('不能删除用户信息缓存');
        }
        const cacheKeys = await this.redisCache.getKeys('', `${cacheName}:*`);
        const num = await this.redisCache.delKeys('', cacheKeys);
        if (num > 0) {
            return api_1.Resp.ok();
        }
        return api_1.Resp.err();
    }
    /**缓存内容删除 */
    async clearCacheKey(cacheName, cacheKey) {
        const num = await this.redisCache.del('', cacheName + ':' + cacheKey);
        if (num > 0) {
            return api_1.Resp.ok();
        }
        return api_1.Resp.err();
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", redis_1.RedisCache)
], CacheController.prototype, "redisCache", void 0);
__decorate([
    (0, core_1.Get)('', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['monitor:cache:info'] }),
        ],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CacheController.prototype, "info", null);
__decorate([
    (0, core_1.Get)('/names', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['monitor:cache:list'] }),
        ],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CacheController.prototype, "names", null);
__decorate([
    (0, core_1.Get)('/keys', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['monitor:cache:list'] }),
        ],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.string().required())),
    __param(0, (0, core_1.Query)('cacheName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CacheController.prototype, "keys", null);
__decorate([
    (0, core_1.Get)('/value', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['monitor:cache:query'] }),
        ],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.string().required())),
    __param(0, (0, core_1.Query)('cacheName')),
    __param(1, (0, validate_1.Valid)(validate_1.RuleType.string().required())),
    __param(1, (0, core_1.Query)('cacheKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CacheController.prototype, "value", null);
__decorate([
    (0, core_1.Del)('/names', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['monitor:cache:remove'] }),
        ],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CacheController.prototype, "cleanNames", null);
__decorate([
    (0, core_1.Del)('/keys', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['monitor:cache:remove'] }),
        ],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.string().required())),
    __param(0, (0, core_1.Query)('cacheName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CacheController.prototype, "cleanKeys", null);
__decorate([
    (0, core_1.Del)('/value', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['monitor:cache:remove'] }),
        ],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.string().required())),
    __param(0, (0, core_1.Query)('cacheName')),
    __param(1, (0, validate_1.Valid)(validate_1.RuleType.string().required())),
    __param(1, (0, core_1.Query)('cacheKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CacheController.prototype, "clearCacheKey", null);
exports.CacheController = CacheController = __decorate([
    (0, core_1.Controller)('/monitor/cache')
], CacheController);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX2NhY2hlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvbW9uaXRvci9jb250cm9sbGVyL3N5c19jYWNoZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBcUU7QUFDckUsaURBQXFEO0FBRXJELHNFQVVnRDtBQUNoRCxpRkFBdUY7QUFDdkYscUVBQXVFO0FBQ3ZFLHFEQUFtRDtBQUNuRCxrREFBOEM7QUFFOUMsZ0JBQWdCO0FBRVQsSUFBTSxlQUFlLDZCQUFyQixNQUFNLGVBQWU7SUFDMUIsVUFBVTtJQUVGLFVBQVUsQ0FBYTtJQUUvQixhQUFhO0lBTUEsQUFBTixLQUFLLENBQUMsSUFBSTtRQUNmLE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FBQztZQUNqQixJQUFJLEVBQUUsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDcEMsTUFBTSxFQUFFLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQ3pDLFlBQVksRUFBRSxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQztTQUNyRCxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsWUFBWTtJQU1DLEFBQU4sS0FBSyxDQUFDLEtBQUs7UUFDaEIsTUFBTSxNQUFNLEdBQWU7WUFDekIsSUFBSSxvQkFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSw4QkFBa0IsQ0FBQztZQUNuRCxJQUFJLG9CQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLDRCQUFnQixDQUFDO1lBQ2pELElBQUksb0JBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsMEJBQWMsQ0FBQztZQUMvQyxJQUFJLG9CQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLDhCQUFrQixDQUFDO1lBQ3BELElBQUksb0JB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