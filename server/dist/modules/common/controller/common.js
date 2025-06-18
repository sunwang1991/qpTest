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
exports.CommonController = void 0;
const node_crypto_1 = require("node:crypto");
const core_1 = require("@midwayjs/core");
const validate_1 = require("@midwayjs/validate");
const authorize_user_1 = require("../../../framework/middleware/authorize_user");
const api_1 = require("../../../framework/resp/api");
/**通用请求 控制层处理 */
let CommonController = exports.CommonController = class CommonController {
    /**哈希编码 */
    async hash(type, str) {
        const hash = (0, node_crypto_1.createHash)(type);
        hash.update(str);
        return api_1.Resp.okData(hash.digest('hex'));
    }
};
__decorate([
    (0, core_1.Post)('/hash', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)()],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.string().required())),
    __param(0, (0, core_1.Body)('type')),
    __param(1, (0, validate_1.Valid)(validate_1.RuleType.string().required())),
    __param(1, (0, core_1.Body)('str')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CommonController.prototype, "hash", null);
exports.CommonController = CommonController = __decorate([
    (0, core_1.Controller)('/common')
], CommonController);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvY29tbW9uL2NvbnRyb2xsZXIvY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZDQUF5QztBQUV6Qyx5Q0FBd0Q7QUFDeEQsaURBQXFEO0FBRXJELGlGQUF1RjtBQUN2RixxREFBbUQ7QUFFbkQsZ0JBQWdCO0FBRVQsSUFBTSxnQkFBZ0IsOEJBQXRCLE1BQU0sZ0JBQWdCO0lBQzNCLFVBQVU7SUFJRyxBQUFOLEtBQUssQ0FBQyxJQUFJLENBR2YsSUFBMEMsRUFDUSxHQUFXO1FBRTdELE1BQU0sSUFBSSxHQUFHLElBQUEsd0JBQVUsRUFBQyxJQUFJLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDekMsQ0FBQztDQUNGLENBQUE7QUFWYztJQUhaLElBQUEsV0FBSSxFQUFDLE9BQU8sRUFBRTtRQUNiLFVBQVUsRUFBRSxDQUFDLElBQUEsd0NBQXVCLEdBQUUsQ0FBQztLQUN4QyxDQUFDO0lBRUMsV0FBQSxJQUFBLGdCQUFLLEVBQUMsbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO0lBQ25DLFdBQUEsSUFBQSxXQUFJLEVBQUMsTUFBTSxDQUFDLENBQUE7SUFFWixXQUFBLElBQUEsZ0JBQUssRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7SUFBRSxXQUFBLElBQUEsV0FBSSxFQUFDLEtBQUssQ0FBQyxDQUFBOzs7OzRDQUtsRDsyQkFkVSxnQkFBZ0I7SUFENUIsSUFBQSxpQkFBVSxFQUFDLFNBQVMsQ0FBQztHQUNULGdCQUFnQixDQWU1QiJ9