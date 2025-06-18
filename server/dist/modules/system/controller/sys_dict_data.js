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
exports.SysDictDataController = void 0;
const core_1 = require("@midwayjs/core");
const validate_1 = require("@midwayjs/validate");
const parse_1 = require("../../../framework/utils/parse/parse");
const operate_log_1 = require("../../../framework/middleware/operate_log");
const authorize_user_1 = require("../../../framework/middleware/authorize_user");
const auth_1 = require("../../../framework/reqctx/auth");
const api_1 = require("../../../framework/resp/api");
const sys_dict_type_1 = require("../service/sys_dict_type");
const sys_dict_data_1 = require("../service/sys_dict_data");
const sys_dict_data_2 = require("../model/sys_dict_data");
/**字典类型对应的字典数据信息 控制层处理 */
let SysDictDataController = exports.SysDictDataController = class SysDictDataController {
    /**上下文 */
    c;
    /**字典数据服务 */
    sysDictDataService;
    /**字典类型服务 */
    sysDictTypeService;
    /**字典数据列表 */
    async list(query) {
        const [rows, total] = await this.sysDictDataService.findByPage(query);
        return api_1.Resp.okData({ rows, total });
    }
    /**字典数据详情 */
    async info(dataId) {
        if (dataId <= 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: deptId is empty');
        }
        const data = await this.sysDictDataService.findById(dataId);
        if (data.dataId === dataId) {
            return api_1.Resp.okData(data);
        }
        return api_1.Resp.err();
    }
    /**字典数据新增 */
    async add(body) {
        if (body.dataId > 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: dataId not is empty');
        }
        // 检查字典类型是否存在
        const dictType = await this.sysDictTypeService.findByType(body.dictType);
        if (dictType.dictType !== body.dictType) {
            return api_1.Resp.errMsg('没有权限访问字典类型数据！');
        }
        // 检查字典标签唯一
        const uniqueLabel = await this.sysDictDataService.checkUniqueTypeByLabel(body.dictType, body.dataLabel, 0);
        if (!uniqueLabel) {
            return api_1.Resp.errMsg(`数据新增【${body.dataLabel}】失败，该字典类型下标签名已存在`);
        }
        // 检查字典键值唯一
        const uniqueValue = await this.sysDictDataService.checkUniqueTypeByValue(body.dictType, body.dataValue, 0);
        if (!uniqueValue) {
            return api_1.Resp.errMsg(`数据新增【${body.dataLabel}】失败，该字典类型下标签值已存在`);
        }
        body.createBy = (0, auth_1.loginUserToUserName)(this.c);
        const insertId = await this.sysDictDataService.insert(body);
        if (insertId > 0) {
            return api_1.Resp.okData(insertId);
        }
        return api_1.Resp.err();
    }
    /**字典类型修改 */
    async edit(body) {
        if (body.dataId <= 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: dataId is empty');
        }
        // 检查字典类型是否存在
        const dictType = await this.sysDictTypeService.findByType(body.dictType);
        if (dictType.dictType !== body.dictType) {
            return api_1.Resp.errMsg('没有权限访问字典类型数据！');
        }
        // 检查字典编码是否存在
        const dictData = await this.sysDictDataService.findById(body.dataId);
        if (dictData.dataId !== body.dataId) {
            return api_1.Resp.errMsg('没有权限访问字典编码数据！');
        }
        // 检查字典标签唯一
        const uniqueLabel = await this.sysDictDataService.checkUniqueTypeByLabel(body.dictType, body.dataLabel, body.dataId);
        if (!uniqueLabel) {
            return api_1.Resp.errMsg(`数据修改【${body.dataLabel}】失败，该字典类型下标签名已存在`);
        }
        // 检查字典键值唯一
        const uniqueValue = await this.sysDictDataService.checkUniqueTypeByValue(body.dictType, body.dataLabel, body.dataId);
        if (!uniqueValue) {
            return api_1.Resp.errMsg(`数据修改【${body.dataLabel}】失败，该字典类型下标签值已存在`);
        }
        dictData.dictType = body.dictType;
        dictData.dataLabel = body.dataLabel;
        dictData.dataValue = body.dataValue;
        dictData.dataSort = body.dataSort;
        dictData.tagClass = body.tagClass;
        dictData.tagType = body.tagType;
        dictData.statusFlag = body.statusFlag;
        dictData.remark = body.remark;
        dictData.updateBy = (0, auth_1.loginUserToUserName)(this.c);
        const rows = await this.sysDictDataService.update(dictData);
        if (rows > 0) {
            return api_1.Resp.ok();
        }
        return api_1.Resp.err();
    }
    /**字典数据删除 */
    async remove(dataId) {
        if (dataId === '') {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: dataId is empty');
        }
        // 处理字符转id数组后去重
        const uniqueIDs = (0, parse_1.parseRemoveDuplicatesToArray)(dataId, ',');
        // 转换成number数组类型
        const ids = uniqueIDs.map(id => (0, parse_1.parseNumber)(id));
        const [rows, err] = await this.sysDictDataService.deleteByIds(ids);
        if (err) {
            return api_1.Resp.errMsg(err);
        }
        return api_1.Resp.okMsg(`删除成功: ${rows}`);
    }
    /**字典数据列表（指定字典类型） */
    async dictType(dictType) {
        if (dictType === '') {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: dictType is empty');
        }
        const data = await this.sysDictDataService.findByType(dictType);
        return api_1.Resp.okData(data);
    }
    /**字典数据列表导出 */
    async export(query) {
        const [rows, total] = await this.sysDictDataService.findByPage(query);
        if (total === 0) {
            return api_1.Resp.errMsg('export data record as empty');
        }
        // 导出文件名称
        const fileName = `dict_data_export_${rows.length}_${Date.now()}.xlsx`;
        this.c.set('content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        this.c.set('content-disposition', `attachment;filename=${encodeURIComponent(fileName)}`);
        return await this.sysDictDataService.exportData(rows, fileName);
    }
};
__decorate([
    (0, core_1.Inject)('ctx'),
    __metadata("design:type", Object)
], SysDictDataController.prototype, "c", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_dict_data_1.SysDictDataService)
], SysDictDataController.prototype, "sysDictDataService", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_dict_type_1.SysDictTypeService)
], SysDictDataController.prototype, "sysDictTypeService", void 0);
__decorate([
    (0, core_1.Get)('/list', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:dict:list'] })],
    }),
    __param(0, (0, core_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SysDictDataController.prototype, "list", null);
__decorate([
    (0, core_1.Get)('/:dataId', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:dict:query'] })],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.number())),
    __param(0, (0, core_1.Param)('dataId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SysDictDataController.prototype, "info", null);
__decorate([
    (0, core_1.Post)('', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:dict:add'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '字典数据信息',
                businessType: operate_log_1.BUSINESS_TYPE.INSERT,
            }),
        ],
    }),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sys_dict_data_2.SysDictData]),
    __metadata("design:returntype", Promise)
], SysDictDataController.prototype, "add", null);
__decorate([
    (0, core_1.Put)('', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:dict:edit'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '字典数据信息',
                businessType: operate_log_1.BUSINESS_TYPE.UPDATE,
            }),
        ],
    }),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sys_dict_data_2.SysDictData]),
    __metadata("design:returntype", Promise)
], SysDictDataController.prototype, "edit", null);
__decorate([
    (0, core_1.Del)('/:dataId', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:dict:remove'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '字典数据信息',
                businessType: operate_log_1.BUSINESS_TYPE.DELETE,
            }),
        ],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.string().allow(''))),
    __param(0, (0, core_1.Param)('dataId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SysDictDataController.prototype, "remove", null);
__decorate([
    (0, core_1.Get)('/type/:dictType', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:dict:query'] })],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.string().allow(''))),
    __param(0, (0, core_1.Param)('dictType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SysDictDataController.prototype, "dictType", null);
__decorate([
    (0, core_1.Get)('/export', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:dict:export'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '字典数据信息',
                businessType: operate_log_1.BUSINESS_TYPE.EXPORT,
            }),
        ],
    }),
    __param(0, (0, core_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SysDictDataController.prototype, "export", null);
exports.SysDictDataController = SysDictDataController = __decorate([
    (0, core_1.Controller)('/system/dict/data')
], SysDictDataController);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX2RpY3RfZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3N5c3RlbS9jb250cm9sbGVyL3N5c19kaWN0X2RhdGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUNBVXdCO0FBQ3hCLGlEQUFxRDtBQUdyRCxnRUFHOEM7QUFDOUMsMkVBR21EO0FBQ25ELGlGQUF1RjtBQUN2Rix5REFBcUU7QUFDckUscURBQW1EO0FBQ25ELDREQUE4RDtBQUM5RCw0REFBOEQ7QUFDOUQsMERBQXFEO0FBRXJELHlCQUF5QjtBQUVsQixJQUFNLHFCQUFxQixtQ0FBM0IsTUFBTSxxQkFBcUI7SUFDaEMsU0FBUztJQUVELENBQUMsQ0FBVTtJQUVuQixZQUFZO0lBRUosa0JBQWtCLENBQXFCO0lBRS9DLFlBQVk7SUFFSixrQkFBa0IsQ0FBcUI7SUFFL0MsWUFBWTtJQUlDLEFBQU4sS0FBSyxDQUFDLElBQUksQ0FBVSxLQUE2QjtRQUN0RCxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0RSxPQUFPLFVBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsWUFBWTtJQUlDLEFBQU4sS0FBSyxDQUFDLElBQUksQ0FDNEIsTUFBYztRQUV6RCxJQUFJLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDZixJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7WUFDcEIsT0FBTyxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO1NBQzFEO1FBQ0QsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxD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