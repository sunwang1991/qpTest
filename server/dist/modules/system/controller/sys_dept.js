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
exports.SysDeptController = void 0;
const core_1 = require("@midwayjs/core");
const validate_1 = require("@midwayjs/validate");
const auth_1 = require("../../../framework/reqctx/auth");
const operate_log_1 = require("../../../framework/middleware/operate_log");
const authorize_user_1 = require("../../../framework/middleware/authorize_user");
const common_1 = require("../../../framework/constants/common");
const api_1 = require("../../../framework/resp/api");
const sys_dept_1 = require("../service/sys_dept");
const sys_dept_2 = require("../model/sys_dept");
/**部门信息 控制层处理 */
let SysDeptController = exports.SysDeptController = class SysDeptController {
    /**上下文 */
    c;
    /**部门服务 */
    sysDeptService;
    /**部门列表 */
    async list(deptId, parentId, deptName, statusFlag) {
        const sysDept = new sys_dept_2.SysDept();
        sysDept.deptId = deptId;
        sysDept.parentId = parentId;
        sysDept.deptName = deptName;
        sysDept.statusFlag = statusFlag;
        const dataScopeSQL = (0, auth_1.loginUserToDataScopeSQL)(this.c, 'sys_dept', '');
        const data = await this.sysDeptService.find(sysDept, dataScopeSQL);
        return api_1.Resp.okData(data);
    }
    /**部门信息 */
    async info(deptId) {
        if (deptId <= 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: deptId is empty');
        }
        const data = await this.sysDeptService.findById(deptId);
        if (data.deptId === deptId) {
            return api_1.Resp.okData(data);
        }
        return api_1.Resp.err();
    }
    /**部门新增 */
    async add(body) {
        if (body.deptId > 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: deptId not is empty');
        }
        // 父级ID不为0是要检查
        if (body.parentId > 0) {
            const deptParent = await this.sysDeptService.findById(body.parentId);
            if (deptParent.deptId !== body.parentId) {
                return api_1.Resp.errMsg('没有权限访问部门数据！');
            }
            if (deptParent.statusFlag === common_1.STATUS_NO) {
                return api_1.Resp.errMsg(`上级部门【${deptParent.deptName}】停用，不允许新增`);
            }
            if (deptParent.delFlag === common_1.STATUS_YES) {
                return api_1.Resp.errMsg(`上级部门【${deptParent.deptName}】已删除，不允许新增`);
            }
            body.ancestors = `${deptParent.ancestors},${body.parentId}`;
        }
        else {
            body.ancestors = '0';
        }
        // 检查同级下名称唯一
        const uniqueDeptName = await this.sysDeptService.checkUniqueParentIdByDeptName(body.parentId, body.deptName, 0);
        if (!uniqueDeptName) {
            return api_1.Resp.errMsg(`部门新增【${body.deptName}】失败，部门名称已存在`);
        }
        body.createBy = (0, auth_1.loginUserToUserName)(this.c);
        const insertId = await this.sysDeptService.insert(body);
        if (insertId > 0) {
            return api_1.Resp.okData(insertId);
        }
        return api_1.Resp.err();
    }
    /**部门修改 */
    async edit(body) {
        if (body.deptId <= 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: deptId is empty');
        }
        // 上级部门不能选自己
        if (body.deptId === body.parentId) {
            return api_1.Resp.errMsg(`部门修改【${body.deptName}】失败，上级部门不能是自己`);
        }
        // 检查数据是否存在
        const deptInfo = await this.sysDeptService.findById(body.deptId);
        if (deptInfo.deptId !== body.deptId) {
            return api_1.Resp.errMsg('没有权限访问部门数据！');
        }
        // 父级ID不为0是要检查
        if (body.parentId > 0) {
            const deptParent = await this.sysDeptService.findById(body.parentId);
            if (deptParent.deptId !== body.parentId) {
                return api_1.Resp.errMsg('没有权限访问部门数据！');
            }
        }
        // 检查同级下名称唯一
        const uniqueName = await this.sysDeptService.checkUniqueParentIdByDeptName(body.parentId, body.deptName, body.deptId);
        if (!uniqueName) {
            return api_1.Resp.errMsg(`部门修改【${body.deptName}】失败，部门名称已存在`);
        }
        // 上级停用需要检查下级是否有在使用
        if (body.statusFlag === common_1.STATUS_NO) {
            const hasChild = await this.sysDeptService.existChildrenByDeptId(body.deptId);
            if (hasChild > 0) {
                return api_1.Resp.errMsg(`该部门包含未停用的子部门数量：${hasChild}`);
            }
        }
        deptInfo.deptName = body.deptName;
        deptInfo.parentId = body.parentId;
        deptInfo.deptSort = body.deptSort;
        deptInfo.leader = body.leader;
        deptInfo.phone = body.phone;
        deptInfo.email = body.email;
        deptInfo.statusFlag = body.statusFlag;
        deptInfo.updateBy = (0, auth_1.loginUserToUserName)(this.c);
        const rows = await this.sysDeptService.update(deptInfo);
        if (rows > 0) {
            return api_1.Resp.ok();
        }
        return api_1.Resp.err();
    }
    /**部门删除 */
    async remove(deptId) {
        if (deptId <= 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: deptId is empty');
        }
        // 检查数据是否存在
        const dept = await this.sysDeptService.findById(deptId);
        if (dept.deptId !== deptId) {
            return api_1.Resp.errMsg('没有权限访问部门数据！');
        }
        // 检查是否存在子部门
        const hasChild = await this.sysDeptService.existChildrenByDeptId(deptId);
        if (hasChild > 0) {
            return api_1.Resp.errMsg(`不允许删除，存在子部门数：${hasChild}`);
        }
        // 检查是否分配给用户
        const existUser = await this.sysDeptService.existUserByDeptId(deptId);
        if (existUser > 0) {
            return api_1.Resp.errMsg(`不允许删除，部门已分配给用户数：${hasChild}`);
        }
        const rows = await this.sysDeptService.deleteById(deptId);
        if (rows > 0) {
            return api_1.Resp.okData(`删除成功：${rows}`);
        }
        return api_1.Resp.err();
    }
    /**部门列表（排除节点） */
    async excludeChild(deptId) {
        if (deptId <= 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: deptId is empty');
        }
        const dataScopeSQL = (0, auth_1.loginUserToDataScopeSQL)(this.c, 's', '');
        const data = await this.sysDeptService.find(new sys_dept_2.SysDept(), dataScopeSQL);
        // 过滤排除节点
        const filtered = [];
        for (const dept of data) {
            if (dept.deptId === deptId) {
                continue;
            }
            // 如果当前部门的ancestors不包含要排除的deptId，则添加到filtered中
            if (dept.ancestors.indexOf(`${deptId}`) !== -1) {
                filtered.push(dept);
            }
        }
        return api_1.Resp.okData(filtered);
    }
    /**部门树结构列表 */
    async tree(deptId, parentId, deptName, statusFlag) {
        const sysDept = new sys_dept_2.SysDept();
        sysDept.deptId = deptId;
        sysDept.parentId = parentId;
        sysDept.deptName = deptName;
        sysDept.statusFlag = statusFlag;
        const dataScopeSQL = (0, auth_1.loginUserToDataScopeSQL)(this.c, 's', '');
        const data = await this.sysDeptService.buildTreeSelect(sysDept, dataScopeSQL);
        return api_1.Resp.okData(data);
    }
    /**部门树结构列表（指定角色） */
    async treeRole(roleId) {
        if (roleId <= 0) {
            this.c.status = 422;
            return api_1.Resp.codeMsg(422002, 'bind err: roleId is empty');
        }
        const dataScopeSQL = (0, auth_1.loginUserToDataScopeSQL)(this.c, 's', '');
        const deptTreeSelect = await this.sysDeptService.buildTreeSelect(new sys_dept_2.SysDept(), dataScopeSQL);
        const checkedKeys = await this.sysDeptService.findDeptIdsByRoleId(roleId);
        return api_1.Resp.okData({
            depts: deptTreeSelect,
            checkedKeys: checkedKeys,
        });
    }
};
__decorate([
    (0, core_1.Inject)('ctx'),
    __metadata("design:type", Object)
], SysDeptController.prototype, "c", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_dept_1.SysDeptService)
], SysDeptController.prototype, "sysDeptService", void 0);
__decorate([
    (0, core_1.Get)('/list', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:dept:list'] })],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.number())),
    __param(0, (0, core_1.Query)('deptId')),
    __param(1, (0, validate_1.Valid)(validate_1.RuleType.number())),
    __param(1, (0, core_1.Query)('parentId')),
    __param(2, (0, validate_1.Valid)(validate_1.RuleType.string())),
    __param(2, (0, core_1.Query)('deptName')),
    __param(3, (0, validate_1.Valid)(validate_1.RuleType.string().pattern(/^[01]$/))),
    __param(3, (0, core_1.Query)('statusFlag')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], SysDeptController.prototype, "list", null);
__decorate([
    (0, core_1.Get)('/:deptId', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:dept:query'] })],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.number().required())),
    __param(0, (0, core_1.Param)('deptId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SysDeptController.prototype, "info", null);
__decorate([
    (0, core_1.Post)('', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:dict:add'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '部门信息',
                businessType: operate_log_1.BUSINESS_TYPE.INSERT,
            }),
        ],
    }),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sys_dept_2.SysDept]),
    __metadata("design:returntype", Promise)
], SysDeptController.prototype, "add", null);
__decorate([
    (0, core_1.Put)('', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:dict:edit'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '部门信息',
                businessType: operate_log_1.BUSINESS_TYPE.UPDATE,
            }),
        ],
    }),
    __param(0, (0, core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sys_dept_2.SysDept]),
    __metadata("design:returntype", Promise)
], SysDeptController.prototype, "edit", null);
__decorate([
    (0, core_1.Del)('/:deptId', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:dict:remove'] }),
            (0, operate_log_1.OperateLogMiddleware)({
                title: '部门信息',
                businessType: operate_log_1.BUSINESS_TYPE.DELETE,
            }),
        ],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.number())),
    __param(0, (0, core_1.Param)('deptId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SysDeptController.prototype, "remove", null);
__decorate([
    (0, core_1.Get)('/list/exclude/:deptId', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:dept:list'] })],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.number())),
    __param(0, (0, core_1.Param)('deptId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SysDeptController.prototype, "excludeChild", null);
__decorate([
    (0, core_1.Get)('/tree', {
        middleware: [
            (0, authorize_user_1.AuthorizeUserMiddleware)({
                hasPerms: ['system:dept:list', 'system:user:list'],
            }),
        ],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.number().allow(0))),
    __param(0, (0, core_1.Query)('deptId')),
    __param(1, (0, validate_1.Valid)(validate_1.RuleType.number().allow(0))),
    __param(1, (0, core_1.Query)('parentId')),
    __param(2, (0, validate_1.Valid)(validate_1.RuleType.string().allow(''))),
    __param(2, (0, core_1.Query)('deptName')),
    __param(3, (0, validate_1.Valid)(validate_1.RuleType.string().pattern(/^[01]$/))),
    __param(3, (0, core_1.Query)('statusFlag')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], SysDeptController.prototype, "tree", null);
__decorate([
    (0, core_1.Get)('/tree/role/:roleId', {
        middleware: [(0, authorize_user_1.AuthorizeUserMiddleware)({ hasPerms: ['system:role:query'] })],
    }),
    __param(0, (0, validate_1.Valid)(validate_1.RuleType.number().required())),
    __param(0, (0, core_1.Param)('roleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SysDeptController.prototype, "treeRole", null);
exports.SysDeptController = SysDeptController = __decorate([
    (0, core_1.Controller)('/system/dept')
], SysDeptController);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX2RlcHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9zeXN0ZW0vY29udHJvbGxlci9zeXNfZGVwdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5Q0FVd0I7QUFDeEIsaURBQXFEO0FBR3JELHlEQUd3QztBQUN4QywyRUFHbUQ7QUFDbkQsaUZBQXVGO0FBQ3ZGLGdFQUE0RTtBQUM1RSxxREFBbUQ7QUFDbkQsa0RBQXFEO0FBQ3JELGdEQUE0QztBQUU1QyxnQkFBZ0I7QUFFVCxJQUFNLGlCQUFpQiwrQkFBdkIsTUFBTSxpQkFBaUI7SUFDNUIsU0FBUztJQUVELENBQUMsQ0FBVTtJQUVuQixVQUFVO0lBRUYsY0FBYyxDQUFpQjtJQUV2QyxVQUFVO0lBSUcsQUFBTixLQUFLLENBQUMsSUFBSSxDQUM0QixNQUFjLEVBQ1osUUFBZ0IsRUFDaEIsUUFBZ0IsRUFHN0QsVUFBa0I7UUFFbEIsTUFBTSxPQUFPLEdBQUcsSUFBSSxrQkFBTyxFQUFFLENBQUM7UUFDOUIsT0FBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDeEIsT0FBTyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDNUIsT0FBTyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDNUIsT0FBTyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDaEMsTUFBTSxZQUFZLEdBQUcsSUFBQSw4QkFBdUIsRUFBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNyRSxNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztRQUNuRSxPQUFPLFVBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVELFVBQVU7SUFJRyxBQUFOLEtBQUssQ0FBQyxJQUFJLENB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