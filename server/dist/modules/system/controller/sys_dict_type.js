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
exports.SysDictTypeController = void 0;
const core_1 = require("@midwayjs/core");
const validate_1 = require("@midwayjs/validate");
const parse_1 = require("../../../framework/utils/parse/parse");
const operate_log_1 = require("../../../framework/middleware/operate_log");
const authorize_user_1 = require("../../../framework/middleware/authorize_user");
const auth_1 = require("../../../framework/reqctx/auth");
const api_1 = require("../../../framework/resp/api");
const sys_dict_type_1 = require("../service/sys_dict_type");
const sys_dict_type_2 = require("../model/sys_dict_type");
/**字典类型信息 控制层处理 */
let SysDictTypeController = exports.SysDictTypeController = class SysDictTypeController {
    /**上下文 */
    c;
    /**字典类型服务 */
    sysDictTypeService;
    /**字典类型列表 */
    async list(query) {
        const [rows, total] = await this.sysDictTypeService.findByPage(query);
        return api_1.Resp.okData({ rows, total });
    }
    /**字典类型信息 */
    async info(dictId) {
        if (dictId <= 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: dictId is empty');
        }
        const data = await this.sysDictTypeService.findById(dictId);
        if (data.dictId === dictId) {
            return api_1.Resp.okData(data);
        }
        return api_1.Resp.err();
    }
    /**字典类型新增 */
    async add(body) {
        if (body.dictId > 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: dictId not is empty');
        }
        // 检查字典名称唯一
        const uniqueName = await this.sysDictTypeService.checkUniqueByName(body.dictName, 0);
        if (!uniqueName) {
            return api_1.Resp.errMsg(`字典新增【${body.dictName}】失败，字典名称已存在`);
        }
        // 检查字典类型唯一
        const uniqueType = await this.sysDictTypeService.checkUniqueByType(body.dictType, 0);
        if (!uniqueType) {
            return api_1.Resp.errMsg(`字典新增【${body.dictName}】失败，字典类型已存在`);
        }
        body.createBy = (0, auth_1.loginUserToUserName)(this.c);
        const insertId = await this.sysDictTypeService.insert(body);
        if (insertId > 0) {
            return api_1.Resp.okData(insertId);
        }
        return api_1.Resp.err();
    }
    /**字典类型修改 */
    async edit(body) {
        if (body.dictId <= 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: dictId is empty');
        }
        // 检查数据是否存在
        const dictType = await this.sysDictTypeService.findById(body.dictId);
        if (dictType.dictId !== body.dictId) {
            return api_1.Resp.errMsg('没有权限访问字典类型数据！');
        }
        // 检查字典名称唯一
        const uniqueName = await this.sysDictTypeService.checkUniqueByName(body.dictName, body.dictId);
        if (!uniqueName) {
            return api_1.Resp.errMsg(`字典修改【${body.dictName}】失败，字典名称已存在`);
        }
        // 检查字典类型唯一
        const uniqueType = await this.sysDictTypeService.checkUniqueByType(body.dictType, body.dictId);
        if (!uniqueType) {
            return api_1.Resp.errMsg(`字典修改【${dictType}】失败，字典类型已存在`);
        }
        dictType.dictName = body.dictName;
        dictType.dictType = body.dictType;
        dictType.statusFlag = body.statusFlag;
        dictType.remark = body.remark;
        dictType.updateBy = (0, auth_1.loginUserToUserName)(this.c);
        const rows = await this.sysDictTypeService.update(dictType);
        if (rows > 0) {
            return api_1.Resp.ok();
        }
        return api_1.Resp.err();
    }
    /**字典类型删除 */
    async remove(dictId) {
        if (dictId === '') {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: dataId is empty');
        }
        // 处理字符转id数组后去重
        const uniqueIDs = (0, parse_1.parseRemoveDuplicatesToArray)(dictId, ',');
        // 转换成number数组类型
        const ids = uniqueIDs.map(id => (0, parse_1.parseNumber)(id));
        const [rows, err] = await this.sysDictTypeService.deleteByIds(ids);
        if (err) {
            return api_1.Resp.errMsg(err);
        }
        return api_1.Resp.okMsg(`删除成功: ${rows}`);
    }
    /**字典类型刷新缓存 */
    async refresh() {
        await this.sysDictTypeService.cacheClean('*');
        await this.sysDictTypeService.cacheLoad('*');
        return api_1.Resp.ok();
    }
    /**字典类型选择框列表 */
    async options() {
        const data = await this.sysDictTypeService.find(new sys_dict_type_2.SysDictType());
        let arr = [];
        if (data.length <= 0) {
            return api_1.Resp.okData(arr);
        }
        // 数据组
        arr = data.map(item => ({
            label: item.dictName,
            value: item.dictType,
        }));
        return api_1.Resp.okData(arr);
    }
    /**字典类型列表导出 */
    async export(query) {
        const [rows, total] = await this.sysDictTypeService.findByPage(query);
        if (total === 0) {
            return api_1.Resp.errMsg('export data record as empty');
        }
        // 导出文件名称
        const fileName = `dict_type_export_${rows.length}_${Date.now()}.xlsx`;
        this.c.set('content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        this.c.set('content-disposition', `attachment;filename=${encodeURIComponent(fileName)}`);
        return await this.sysDictTypeService.exportData(rows, fileName);
    }
};
__decorate([
    (0, core_1.Inject)('ctx'),
    __metadata("design:type", Object)
], SysDictTypeController.prototype, "c", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_dict_type_1.SysDictTypeService)
], SysDictTypeController.prototype, "sysDictTypeService", void 0);
__decorate([
    (0, core_1.Get)('/list', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:dict:list'] })],
    }),
    __param(0, (0, core_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SysDictTypeController.prototype, "list", null);
__decorate([
    (0, core_1.Get)('/:dictId', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:dict:query'] })],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.number())),
    __param(0, (0, core_1.Param)('dictId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SysDictTypeController.prototype, "info", null);
__decorate([
    (0, core_1.Post)('', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:dict:add'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '字典类型信息',
                businessType: operate_log_1.BUSINESS_TYPE.INSERT,
            }),
        ],
    }),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sys_dict_type_2.SysDictType]),
    __metadata("design:returntype", Promise)
], SysDictTypeController.prototype, "add", null);
__decorate([
    (0, core_1.Put)('', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:dict:edit'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '字典类型信息',
                businessType: operate_log_1.BUSINESS_TYPE.UPDATE,
            }),
        ],
    }),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sys_dict_type_2.SysDictType]),
    __metadata("design:returntype", Promise)
], SysDictTypeController.prototype, "edit", null);
__decorate([
    (0, core_1.Del)('/:dictId', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:dict:remove'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '字典类型信息',
                businessType: operate_log_1.BUSINESS_TYPE.DELETE,
            }),
        ],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.string().allow(''))),
    __param(0, (0, core_1.Param)('dictId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SysDictTypeController.prototype, "remove", null);
__decorate([
    (0, core_1.Put)('/refresh', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:dict:remove'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '字典类型信息',
                businessType: operate_log_1.BUSINESS_TYPE.CLEAN,
            }),
        ],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SysDictTypeController.prototype, "refresh", null);
__decorate([
    (0, core_1.Get)('/options', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:dict:query'] })],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SysDictTypeController.prototype, "options", null);
__decorate([
    (0, core_1.Get)('/export', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:dict:export'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '字典类型信息',
                businessType: operate_log_1.BUSINESS_TYPE.EXPORT,
            }),
        ],
    }),
    __param(0, (0, core_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SysDictTypeController.prototype, "export", null);
exports.SysDictTypeController = SysDictTypeController = __decorate([
    (0, core_1.Controller)('/system/dict/type')
], SysDictTypeController);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX2RpY3RfdHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3N5c3RlbS9jb250cm9sbGVyL3N5c19kaWN0X3R5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUNBVXdCO0FBQ3hCLGlEQUFxRDtBQUdyRCxnRUFHOEM7QUFDOUMsMkVBR21EO0FBQ25ELGlGQUF1RjtBQUN2Rix5REFBcUU7QUFDckUscURBQW1EO0FBQ25ELDREQUE4RDtBQUM5RCwwREFBcUQ7QUFFckQsa0JBQWtCO0FBRVgsSUFBTSxxQkFBcUIsbUNBQTNCLE1BQU0scUJBQXFCO0lBQ2hDLFNBQVM7SUFFRCxDQUFDLENBQVU7SUFFbkIsWUFBWTtJQUVKLGtCQUFrQixDQUFxQjtJQUUvQyxZQUFZO0lBSUMsQUFBTixLQUFLLENBQUMsSUFBSSxDQUFVLEtBQTZCO1FBQ3RELE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RFLE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRCxZQUFZO0lBSUMsQUFBTixLQUFLLENBQUMsSUFBSSxDQUE0QyxNQUFjO1FBQ3pFLElBQUksTUFBTSxJQUFJLENBQUMsRUFBRTtZQUNmLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztZQUNwQixPQUFPLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLDJCQUEyQixDQUFDLENBQUM7U0FDMUQ7UUFFRCxNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUQsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLE1BQU0sRUFBRTtZQUMxQixPQUFPLFVBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDMUI7UUFDRCxPQUFPLFVBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRUQsWUFBWTtJQVVDLEFBQU4sS0FBSyxDQUFDLEdBQUcsQ0FBUyxJQUFpQjtRQUN4QyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ25CLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztZQUNwQixPQUFPLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLCtCQUErQixDQUFDLENBQUM7U0FDOUQ7UUFFRCxXQUFXO1FBQ1gsTUFBTSxVQUFVLEdBQUcsTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsaUJBQWlCLENBQ2hFLElBQUksQ0FBQyxRQUFRLEVBQ2IsQ0FBQyxDQUNGLENBQUM7UUFDRixJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2YsT0FBTyxVQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsSUFBSSxDQUFDLFFBQVEsYUFBYSxDQUFDLENBQUM7U0FDeEQ7UUFFRCxXQUFXO1FBQ1gsTUFBTSxVQUFVLEdBQUcsTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsaUJBQWlCLENBQ2hFLElBQUksQ0FBQyxRQUFRLEVBQ2IsQ0FBQyxDQUNGLENBQUM7UUFDRixJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2YsT0FBTyxVQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsSUFBSSxDQUFDLFFBQVEsYUFBYSxDQUFDLENBQUM7U0FDeEQ7UUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUEsMEJBQW1CLEVBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVDLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1RCxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUU7WUFDaEIsT0FBTyxVQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQzlCO1FBQ0QsT0FBTyxVQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVELFlBQVk7SUFVQyxBQUFOLEtBQUssQ0FBQyxJQUFJLENBQVMsSUFBaUI7UUFDekMsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtZQUNwQixJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7WUFDcEIsT0FBTyxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO1NBQzFEO1FBRUQsV0FBVztRQUNYLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckUsSUFBSSxRQUFRLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDbkMsT0FBTyxVQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1NBQ3JDO1FBRUQsV0FBVztRQUNYLE1BQU0sVUFBVSxHQUFHLE1BQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLGlCQUFpQixDQUNoRSxJQUFJLENBQUMsUUFBUSxFQUNiLElBQUksQ0FBQyxNQUFNLENBQ1osQ0FBQztRQUNGLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDZixPQUFPLFVBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxJQUFJLENBQUMsUUFBUSxhQUFhLENBQUMsQ0FBQztTQUN4RDtRQUVELFdBQVc7UUFDWCxNQUFNLFVBQVUsR0FBRyxNQUFNLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxpQkFBaUIsQ0FDaEUsSUFBSSxDQUFDLFFBQVEsRUFDYixJQUFJLENBQUMsTUFBTSxDQUNaLENBQUM7UUFDRixJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2YsT0FBTyxVQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsUUFBUSxhQUFhLENBQUMsQ0FBQztTQUNuRDtRQUVELFFBQVEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUNsQyxRQUFRLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDbEMsUUFBUSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3RDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUM5QixRQUFRLENBQUMsUUFBUSxHQUFHLElBQUEsMEJBQW1CLEVBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hELE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1RCxJQUFJLElBQUksR0FBRyxDQUFDLEVBQUU7WUFDWixPQUFPLFVBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztTQUNsQjtRQUNELE9BQU8sVUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxZQUFZO0lBVUMsQUFBTixLQUFLLENBQUMsTUFBTSxDQUNvQyxNQUFjO1FBRW5FLElBQUksTUFBTSxLQUFLLEVBQUUsRUFBRTtZQUNqQixJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7WUFDcEIsT0FBTyxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO1NBQzFEO1FBRUQsZUFBZTtRQUNmLE1BQU0sU0FBUyxHQUFHLElBQUEsb0NBQTRCLEVBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzVELGdCQUFnQjtRQUNoQixNQUFNLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBQSxtQkFBVyxFQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFakQsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkUsSUFBSSxHQUFHLEVBQUU7WUFDUCxPQUFPLFVBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDekI7UUFDRCxPQUFPLFVBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxjQUFjO0lBVUQsQUFBTixLQUFLLENBQUMsT0FBTztRQUNsQixNQUFNLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUMsTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdDLE9BQU8sVUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFFRCxlQUFlO0lBSUYsQUFBTixLQUFLLENBQUMsT0FBTztRQUNsQixNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSwyQkFBVyxFQUFFLENBQUMsQ0FBQztRQUNuRSxJQUFJLEdBQUcsR0FBdUMsRUFBRSxDQUFDO1FBQ2pELElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDcEIsT0FBTyxVQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3pCO1FBQ0QsTUFBTTtRQUNOLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN0QixLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDcEIsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRO1NBQ3JCLENBQUMsQ0FBQyxDQUFDO1FBQ0osT0FBTyxVQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFRCxjQUFjO0lBVUQsQUFBTixLQUFLLENBQUMsTUFBTSxDQUFVLEtBQTZCO1FBQ3hELE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RFLElBQUksS0FBSyxLQUFLLENBQUMsRUFBRTtZQUNmLE9BQU8sVUFBSSxDQUFDLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1NBQ25EO1FBRUQsU0FBUztRQUNULE1BQU0sUUFBUSxHQUFHLG9CQUFvQixJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUNSLGNBQWMsRUFDZCxtRUFBbUUsQ0FDcEUsQ0FBQztRQUNGLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUNSLHFCQUFxQixFQUNyQix1QkFBdUIsa0JBQWtCLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FDdEQsQ0FBQztRQUNGLE9BQU8sTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNsRSxDQUFDO0NBQ0YsQ0FBQTtBQTFOUztJQURQLElBQUEsYUFBTSxFQUFDLEtBQUssQ0FBQzs7Z0RBQ0s7QUFJWDtJQURQLElBQUEsYUFBTSxHQUFFOzhCQUNtQixrQ0FBa0I7aUVBQUM7QUFNbEM7SUFIWixJQUFBLFVBQUcsRUFBQyxPQUFPLEVBQUU7UUFDWixVQUFVLEVBQUUsQ0FBQyxJQUFBLHdDQUF1QixFQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDMUUsQ0FBQztJQUNpQixXQUFBLElBQUEsWUFBSyxHQUFFLENBQUE7Ozs7aURBR3pCO0FBTVk7SUFIWixJQUFBLFVBQUcsRUFBQyxVQUFVLEVBQUU7UUFDZixVQUFVLEVBQUUsQ0FBQyxJQUFBLHdDQUF1QixFQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDM0UsQ0FBQztJQUNpQixXQUFBLElBQUEsZ0JBQUssRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUE7SUFBRSxXQUFBLElBQUEsWUFBSyxFQUFDLFFBQVEsQ0FBQyxDQUFBOzs7O2lEQVczRDtBQVlZO0lBVFosSUFBQSxXQUFJLEVBQUMsRUFBRSxFQUFFO1FBQ1IsVUFBVSxFQUFFO1lBQ1YsSUFBQSx3Q0FBdUIsRUFBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQztZQUMxRCxJQUFBLGtDQUFvQixFQUFDO2dCQUNuQixLQUFLLEVBQUUsUUFBUTtnQkFDZixZQUFZLEVBQUUsMkJBQWEsQ0FBQyxNQUFNO2FBQ25DLENBQUM7U0FDSDtLQUNGLENBQUM7SUFDZ0IsV0FBQSxJQUFBLFdBQUksR0FBRSxDQUFBOztxQ0FBTywyQkFBVzs7Z0RBOEJ6QztBQVlZO0lBVFosSUFBQSxVQUFHLEVBQUMsRUFBRSxFQUFFO1FBQ1AsVUFBVSxFQUFFO1lBQ1YsSUFBQSx3Q0FBdUIsRUFBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FBQztZQUMzRCxJQUFBLGtDQUFvQixFQUFDO2dCQUNuQixLQUFLLEVBQUUsUUFBUTtnQkFDZixZQUFZLEVBQUUsMkJBQWEsQ0FBQyxNQUFNO2FBQ25DLENBQUM7U0FDSDtLQUNGLENBQUM7SUFDaUIsV0FBQSxJQUFBLFdBQUksR0FBRSxDQUFBOztxQ0FBTywyQkFBVzs7aURBd0MxQztBQVlZO0lBVFosSUFBQSxVQUFHLEVBQUMsVUFBVSxFQUFFO1FBQ2YsVUFBVSxFQUFFO1lBQ1YsSUFBQSx3Q0FBdUIsRUFBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQztZQUM3RCxJQUFBLGtDQUFvQixFQUFDO2dCQUNuQixLQUFLLEVBQUUsUUFBUTtnQkFDZixZQUFZLEVBQUUsMkJBQWEsQ0FBQyxNQUFNO2FBQ25DLENBQUM7U0FDSDtLQUNGLENBQUM7SUFFQyxXQUFBLElBQUEsZ0JBQUssRUFBQyxtQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBQUUsV0FBQSxJQUFBLFlBQUssRUFBQyxRQUFRLENBQUMsQ0FBQTs7OzttREFpQnJEO0FBWVk7SUFUWixJQUFBLFVBQUcsRUFBQyxVQUFVLEVBQUU7UUFDZixVQUFVLEVBQUU7WUFDVixJQUFBLHdDQUF1QixFQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsb0JBQW9CLENBQUMsRUFBRSxDQUFDO1lBQzdELElBQUEsa0NBQW9CLEVBQUM7Z0JBQ25CLEtBQUssRUFBRSxRQUFRO2dCQUNmLFlBQVksRUFBRSwyQkFBYSxDQUFDLEtBQUs7YUFDbEMsQ0FBQztTQUNIO0tBQ0YsQ0FBQzs7OztvREFLRDtBQU1ZO0lBSFosSUFBQSxVQUFHLEVBQUMsVUFBVSxFQUFFO1FBQ2YsVUFBVSxFQUFFLENBQUMsSUFBQSx3Q0FBdUIsRUFBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQzNFLENBQUM7Ozs7b0RBYUQ7QUFZWTtJQVRaLElBQUEsVUFBRyxFQUFDLFNBQVMsRUFBRTtRQUNkLFVBQVUsRUFBRTtZQUNWLElBQUEsd0NBQXVCLEVBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLENBQUM7WUFDN0QsSUFBQSxrQ0FBb0IsRUFBQztnQkFDbkIsS0FBSyxFQUFFLFFBQVE7Z0JBQ2YsWUFBWSxFQUFFLDJCQUFhLENBQUMsTUFBTTthQUNuQyxDQUFDO1NBQ0g7S0FDRixDQUFDO0lBQ21CLFdBQUEsSUFBQSxZQUFLLEdBQUUsQ0FBQTs7OzttREFpQjNCO2dDQTVOVSxxQkFBcUI7SUFEakMsSUFBQSxpQkFBVSxFQUFDLG1CQUFtQixDQUFDO0dBQ25CLHFCQUFxQixDQTZOakMifQ==