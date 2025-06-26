"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateError = void 0;
const core_1 = require("@midwayjs/core");
const validate_1 = require("@midwayjs/validate");
const api_1 = require("../resp/api");
/**
 * 处理校验错误-拦截器
 *
 * 422 参数错误会到这里
 */
let ValidateError = exports.ValidateError = class ValidateError {
    async catch(err, c) {
        c.logger.error('%s > %s', err.name, err.message);
        // 返回422，提示错误信息
        c.body = api_1.Resp.codeMsg(422001, err.message);
        c.status = core_1.HttpStatus.UNPROCESSABLE_ENTITY;
    }
};
exports.ValidateError = ValidateError = __decorate([
    (0, core_1.Catch)(validate_1.MidwayValidationError)
], ValidateError);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGVfZXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZnJhbWV3b3JrL2NhdGNoL3ZhbGlkYXRlX2Vycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNBLHlDQUFtRDtBQUNuRCxpREFBMkQ7QUFFM0QscUNBQW1DO0FBRW5DOzs7O0dBSUc7QUFFSSxJQUFNLGFBQWEsMkJBQW5CLE1BQU0sYUFBYTtJQUN4QixLQUFLLENBQUMsS0FBSyxDQUFDLEdBQTBCLEVBQUUsQ0FBVTtRQUNoRCxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDakQsZUFBZTtRQUNmLENBQUMsQ0FBQyxJQUFJLEdBQUcsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQyxNQUFNLEdBQUcsaUJBQVUsQ0FBQyxvQkFBb0IsQ0FBQztJQUM3QyxDQUFDO0NBQ0YsQ0FBQTt3QkFQWSxhQUFhO0lBRHpCLElBQUEsWUFBSyxFQUFDLGdDQUFxQixDQUFDO0dBQ2hCLGFBQWEsQ0FPekIifQ==