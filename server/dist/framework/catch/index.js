"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCatchFilters = void 0;
const error_catch_1 = require("./error_catch");
const validate_error_1 = require("./validate_error");
const not_found_1 = require("./not_found");
/**
 * 异常错误捕获拦截器
 *
 * 请尽可能使用标准的抛出错误的形式，方便拦截器做处理。
 */
exports.ErrorCatchFilters = [not_found_1.NotFound, validate_error_1.ValidateError, error_catch_1.ErrorCatch];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZnJhbWV3b3JrL2NhdGNoL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtDQUEyQztBQUMzQyxxREFBaUQ7QUFDakQsMkNBQXVDO0FBRXZDOzs7O0dBSUc7QUFDVSxRQUFBLGlCQUFpQixHQUFHLENBQUMsb0JBQVEsRUFBRSw4QkFBYSxFQUFFLHdCQUFVLENBQUMsQ0FBQyJ9