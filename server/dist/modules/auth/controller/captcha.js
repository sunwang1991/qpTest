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
exports.CaptchaController = void 0;
const core_1 = require("@midwayjs/core");
const svg_captcha_fixed_1 = require("svg-captcha-fixed");
const svgBase64 = require("mini-svg-data-uri");
const rate_limit_1 = require("../../../framework/middleware/rate_limit");
const cache_key_1 = require("../../../framework/constants/cache_key");
const generate_1 = require("../../../framework/utils/generate/generate");
const parse_1 = require("../../../framework/utils/parse/parse");
const redis_1 = require("../../../framework/datasource/redis/redis");
const config_1 = require("../../../framework/config/config");
const api_1 = require("../../../framework/resp/api");
const sys_config_1 = require("../../system/service/sys_config");
/**验证码操作 控制层处理 */
let CaptchaController = exports.CaptchaController = class CaptchaController {
    /**缓存服务 */
    redisCache;
    /**配置信息 */
    config;
    /**参数配置服务 */
    sysConfigService;
    /**获取验证码-图片 */
    async image() {
        // 从数据库配置获取验证码开关 true开启，false关闭
        const captchaEnabledStr = await this.sysConfigService.findValueByKey('sys.account.captchaEnabled');
        const captchaEnabled = (0, parse_1.parseBoolean)(captchaEnabledStr);
        if (!captchaEnabled) {
            return api_1.Resp.okData({ enabled: captchaEnabled });
        }
        // 生成唯一标识
        let verifyKey = '';
        const data = {
            enabled: captchaEnabled,
            uuid: '',
            img: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        };
        // 验证码有效期，单位秒
        const captchaExpiration = 2 * 60;
        // 从数据库配置获取验证码类型 math 数值计算 char 字符验证
        const captchaType = await this.sysConfigService.findValueByKey('sys.account.captchaType');
        if (captchaType === 'math') {
            const uuid = (0, generate_1.generateCode)(20);
            const options = this.config.get('mathCaptcha');
            const { data: question, text: answer } = (0, svg_captcha_fixed_1.createMathExpr)(options);
            data.uuid = uuid;
            data.img = svgBase64(question);
            verifyKey = cache_key_1.CACHE_CAPTCHA_CODE + ':' + uuid;
            await this.redisCache.set('', verifyKey, answer, captchaExpiration);
        }
        if (captchaType === 'char') {
            const uuid = (0, generate_1.generateCode)(20);
            const options = this.config.get('charCaptcha');
            const { data: question, text: answer } = (0, svg_captcha_fixed_1.create)(options);
            data.uuid = uuid;
            data.img = svgBase64(question);
            verifyKey = cache_key_1.CACHE_CAPTCHA_CODE + ':' + uuid;
            await this.redisCache.set('', verifyKey, answer.toLowerCase(), captchaExpiration);
        }
        // 本地开发下返回验证码结果，方便接口调试
        if (this.config.getEnv() === 'local') {
            const text = await this.redisCache.get('', verifyKey);
            return api_1.Resp.okData({ text, ...data });
        }
        return api_1.Resp.okData(data);
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", redis_1.RedisCache)
], CaptchaController.prototype, "redisCache", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", config_1.GlobalConfig)
], CaptchaController.prototype, "config", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_config_1.SysConfigService)
], CaptchaController.prototype, "sysConfigService", void 0);
__decorate([
    (0, core_1.Get)('/captcha-image', {
        middleware: [(0, rate_limit_1.RateLimitMiddleware)({ time: 300, count: 6, type: rate_limit_1.LIMIT_IP })],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CaptchaController.prototype, "image", null);
exports.CaptchaController = CaptchaController = __decorate([
    (0, core_1.Controller)()
], CaptchaController);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FwdGNoYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2F1dGgvY29udHJvbGxlci9jYXB0Y2hhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHlDQUF5RDtBQUN6RCx5REFBeUU7QUFDekUsK0NBQWdEO0FBRWhELHlFQUdrRDtBQUNsRCxzRUFBNEU7QUFDNUUseUVBQTBFO0FBQzFFLGdFQUFvRTtBQUNwRSxxRUFBdUU7QUFDdkUsNkRBQWdFO0FBQ2hFLHFEQUFtRDtBQUNuRCxnRUFBbUU7QUFFbkUsaUJBQWlCO0FBRVYsSUFBTSxpQkFBaUIsK0JBQXZCLE1BQU0saUJBQWlCO0lBQzVCLFVBQVU7SUFFRixVQUFVLENBQWE7SUFFL0IsVUFBVTtJQUVGLE1BQU0sQ0FBZTtJQUU3QixZQUFZO0lBRUosZ0JBQWdCLENBQW1CO0lBRTNDLGNBQWM7SUFJRCxBQUFOLEtBQUssQ0FBQyxLQUFLO1FBQ2hCLCtCQUErQjtRQUMvQixNQUFNLGlCQUFpQixHQUFHLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FDbEUsNEJBQTRCLENBQzdCLENBQUM7UUFDRixNQUFNLGNBQWMsR0FBRyxJQUFBLG9CQUFZLEVBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ25CLE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDO1NBQ2pEO1FBRUQsU0FBUztRQUNULElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUNuQixNQUFNLElBQUksR0FBRztZQUNYLE9BQU8sRUFBRSxjQUFjO1lBQ3ZCLElBQUksRUFBRSxFQUFFO1lBQ1IsR0FBRyxFQUFFLGdGQUFnRjtTQUN0RixDQUFDO1FBRUYsYUFBYTtRQUNiLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNqQyxvQ0FBb0M7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