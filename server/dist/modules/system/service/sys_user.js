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
exports.SysUserService = void 0;
const core_1 = require("@midwayjs/core");
const regular_1 = require("../../../framework/utils/regular/regular");
const system_1 = require("../../../framework/constants/system");
const common_1 = require("../../../framework/constants/common");
const file_1 = require("../../../framework/utils/file/file");
const data_1 = require("../../../framework/utils/date/data");
const parse_1 = require("../../../framework/utils/parse/parse");
const sys_user_role_1 = require("../repository/sys_user_role");
const sys_user_post_1 = require("../repository/sys_user_post");
const sys_user_1 = require("../repository/sys_user");
const sys_dept_1 = require("../repository/sys_dept");
const sys_role_1 = require("../repository/sys_role");
const sys_dict_type_1 = require("./sys_dict_type");
const sys_config_1 = require("./sys_config");
const sys_user_role_2 = require("../model/sys_user_role");
const sys_user_post_2 = require("../model/sys_user_post");
const sys_user_2 = require("../model/sys_user");
/**用户 服务层处理 */
let SysUserService = exports.SysUserService = class SysUserService {
    /**用户服务 */
    sysUserRepository;
    /**角色服务 */
    sysRoleRepository;
    /**部门服务 */
    sysDeptRepository;
    /**用户与角色服务 */
    sysUserRoleRepository;
    /**用户与岗位服务 */
    sysUserPostRepository;
    /**字典类型服务 */
    sysDictTypeService;
    /**参数配置服务 */
    sysConfigService;
    /**文件服务 */
    fileUtil;
    /**
     * 分页查询列表数据
     * @param query 参数
     * @param dataScopeSQL 角色数据范围过滤SQL字符串
     * @returns []
     */
    async findByPage(query, dataScopeSQL) {
        const [rows, total] = await this.sysUserRepository.selectByPage(query, dataScopeSQL);
        for (let i = 0; i < rows.length; i++) {
            const v = rows[i];
            delete rows[i].password;
            delete rows[i].delFlag;
            delete rows[i].postIds;
            // 部门
            const deptInfo = await this.sysDeptRepository.selectById(v.deptId);
            rows[i].dept = deptInfo;
            // 角色
            const roleArr = await this.sysRoleRepository.selectByUserId(v.userId);
            const roleIds = [];
            const roles = [];
            for (const role of roleArr) {
                roles.push(role);
                roleIds.push(role.roleId);
            }
            rows[i].roles = roles;
            rows[i].roleIds = roleIds;
        }
        return [rows, total];
    }
    /**
     * 查询数据
     * @param sysUser 信息
     * @returns []
     */
    async find(sysUser) {
        return await this.sysUserRepository.select(sysUser);
    }
    /**
     * 根据ID查询信息
     * @param userId ID
     * @returns 结果
     */
    async findById(userId) {
        let userInfo = new sys_user_2.SysUser();
        if (userId <= 0) {
            return userInfo;
        }
        const users = await this.sysUserRepository.selectByIds([userId]);
        if (users.length > 0) {
            userInfo = users[0];
            // 部门
            const deptInfo = await this.sysDeptRepository.selectById(userInfo.deptId);
            userInfo.dept = deptInfo;
            // 角色
            const roleArr = await this.sysRoleRepository.selectByUserId(userInfo.userId);
            const roleIds = [];
            const roles = [];
            for (const role of roleArr) {
                roles.push(role);
                roleIds.push(role.roleId);
            }
            userInfo.roles = roles;
            userInfo.roleIds = roleIds;
        }
        return userInfo;
    }
    /**
     * 新增信息
     * @param sysUser 信息
     * @returns ID
     */
    async insert(sysUser) {
        // 新增用户信息
        const insertId = await this.sysUserRepository.insert(sysUser);
        if (insertId > 0) {
            await this.insertUserRole(insertId, sysUser.roleIds); // 新增用户角色信息
            await this.insertUserPost(insertId, sysUser.postIds); // 新增用户岗位信息
        }
        return insertId;
    }
    /**
     * 新增用户角色信息
     * @param userId 用户ID
     * @param roleIds 角色ID数组
     * @returns 影响记录数
     */
    async insertUserRole(userId, roleIds) {
        if (userId <= 0 || roleIds.length <= 0) {
            return 0;
        }
        const arr = [];
        for (const roleId of roleIds) {
            // 系统管理员角色禁止操作，只能通过配置指定用户ID分配
            if (roleId <= 0 || roleId === system_1.SYS_ROLE_SYSTEM_ID) {
                continue;
            }
            const sysUserRole = new sys_user_role_2.SysUserRole();
            sysUserRole.userId = userId;
            sysUserRole.roleId = roleId;
            arr.push(sysUserRole);
        }
        return await this.sysUserRoleRepository.batchInsert(arr);
    }
    /**
     * 新增用户岗位信息
     * @param userId 用户ID
     * @param postIds 岗位ID数组
     * @returns 影响记录数
     */
    async insertUserPost(userId, postIds) {
        if (userId <= 0 || postIds.length <= 0) {
            return 0;
        }
        const arr = [];
        for (const postId of postIds) {
            if (postId <= 0) {
                continue;
            }
            const sysUserPost = new sys_user_post_2.SysUserPost();
            sysUserPost.userId = userId;
            sysUserPost.postId = postId;
            arr.push(sysUserPost);
        }
        return await this.sysUserPostRepository.batchInsert(arr);
    }
    /**
     * 修改信息
     * @param sysUser 信息
     * @returns 影响记录数
     */
    async update(sysUser) {
        return await this.sysUserRepository.update(sysUser);
    }
    /**
     * 修改用户信息同时更新角色和岗位
     * @param sysUser 信息
     * @returns 影响记录数
     */
    async updateUserAndRolePost(sysUser) {
        // 删除用户与角色关联
        await this.sysUserRoleRepository.deleteByUserIds([sysUser.userId]);
        // 新增用户角色信息
        await this.insertUserRole(sysUser.userId, sysUser.roleIds);
        // 删除用户与岗位关联
        await this.sysUserPostRepository.deleteByUserIds([sysUser.userId]);
        // 新增用户岗位信息
        await this.insertUserPost(sysUser.userId, sysUser.postIds);
        return await this.sysUserRepository.update(sysUser);
    }
    /**
     * 批量删除信息
     * @param userIds ID数组
     * @returns [影响记录数, 错误信息]
     */
    async deleteByIds(userIds) {
        // 检查是否存在
        const users = await this.sysUserRepository.selectByIds(userIds);
        if (users.length <= 0) {
            return [0, '没有权限访问用户数据！'];
        }
        if (users.length === userIds.length) {
            await this.sysUserRoleRepository.deleteByUserIds(userIds); // 删除用户与角色关联
            await this.sysUserPostRepository.deleteByUserIds(userIds); // 删除用户与岗位关联
            const rows = await this.sysUserRepository.deleteByIds(userIds);
            return [rows, ''];
        }
        return [0, '删除用户信息失败！'];
    }
    /**
     * 检查用户名称是否唯一
     * @param userName 用户名
     * @param userId 用户ID
     * @returns 结果
     */
    async checkUniqueByUserName(userName, userId) {
        const sysUser = new sys_user_2.SysUser();
        sysUser.userName = userName;
        const uniqueId = await this.sysUserRepository.checkUnique(sysUser);
        if (uniqueId === userId) {
            return true;
        }
        return uniqueId === 0;
    }
    /**
     * 检查手机号码是否唯一
     * @param phone 手机号码
     * @param userId 用户ID
     * @returns 结果
     */
    async checkUniqueByPhone(phone, userId) {
        const sysUser = new sys_user_2.SysUser();
        sysUser.phone = phone;
        const uniqueId = await this.sysUserRepository.checkUnique(sysUser);
        if (uniqueId === userId) {
            return true;
        }
        return uniqueId === 0;
    }
    /**
     * 检查Email是否唯一
     * @param email 手机号码
     * @param userId 用户ID
     * @returns 结果
     */
    async checkUniqueByEmail(email, userId) {
        const sysUser = new sys_user_2.SysUser();
        sysUser.email = email;
        const uniqueId = await this.sysUserRepository.checkUnique(sysUser);
        if (uniqueId === userId) {
            return true;
        }
        return uniqueId === 0;
    }
    /**
     * 通过用户名查询用户信息
     * @param userName 用户名
     * @returns 结果
     */
    async findByUserName(userName) {
        const userInfo = await this.sysUserRepository.selectByUserName(userName);
        if (userInfo.userName !== userName) {
            return userInfo;
        }
        // 部门
        const deptInfo = await this.sysDeptRepository.selectById(userInfo.deptId);
        userInfo.dept = deptInfo;
        // 角色
        const roleArr = await this.sysRoleRepository.selectByUserId(userInfo.userId);
        const roles = [];
        const roleIds = [];
        for (const role of roleArr) {
            roles.push(role);
            roleIds.push(role.roleId);
        }
        userInfo.roles = roles;
        userInfo.roleIds = roleIds;
        return userInfo;
    }
    /**
     * 根据条件分页查询分配用户角色列表
     * @param query 查询信息 { roleId:角色ID,auth:是否已分配 }
     * @param dataScopeSQL 角色数据范围过滤SQL字符串
     * @returns 结果
     */
    async findAuthUsersPage(query, dataScopeSQL) {
        const [rows, total] = await this.sysUserRepository.selectAuthUsersByPage(query, dataScopeSQL);
        for (let i = 0; i < rows.length; i++) {
            const v = rows[i];
            delete rows[i].password;
            delete rows[i].delFlag;
            delete rows[i].postIds;
            // 部门
            const deptInfo = await this.sysDeptRepository.selectById(v.deptId);
            rows[i].dept = deptInfo;
            // 角色
            const roleArr = await this.sysRoleRepository.selectByUserId(v.userId);
            const roleIds = [];
            const roles = [];
            for (const role of roleArr) {
                roles.push(role);
                roleIds.push(role.roleId);
            }
            rows[i].roles = roles;
            rows[i].roleIds = roleIds;
        }
        return [rows, total];
    }
    /**
     * 导出数据表格
     * @param rows 信息
     * @param fileName 文件名
     * @returns 结果
     */
    async exportData(rows, fileName) {
        // 导出数据组装
        const arr = [];
        // 读取用户性别字典数据
        const dictSysUserSex = await this.sysDictTypeService.findDataByType('sys_user_sex');
        for (const row of rows) {
            // 用户性别
            let sysUserSex = '';
            for (const v of dictSysUserSex) {
                if (row.sex === v.dataValue) {
                    sysUserSex = v.dataLabel;
                    break;
                }
            }
            // 账号状态
            let statusValue = '停用';
            if (row.statusFlag === common_1.STATUS_YES) {
                statusValue = '正常';
            }
            const data = {
                用户编号: row.userId,
                登录账号: row.userName,
                用户昵称: row.nickName,
                用户邮箱: row.email,
                手机号码: row.phone,
                用户性别: sysUserSex,
                帐号状态: statusValue,
                部门编号: row.deptId,
                部门名称: row.dept?.deptName,
                部门负责人: row.dept?.leader,
                最后登录IP: row.loginIp,
                最后登录时间: (0, data_1.parseDateToStr)(row.loginTime),
            };
            arr.push(data);
        }
        return await this.fileUtil.excelWriteRecord(arr, fileName);
    }
    /**
     * 导入数据表格
     * @param rows 表格行数组
     * @param operaName 操作员
     * @param updateSupport 支持更新
     * @returns 结果信息
     */
    async importData(rows, operaName, updateSupport) {
        // 读取默认初始密码
        const initPassword = await this.sysConfigService.findValueByKey('sys.user.initPassword');
        // 读取用户性别字典数据
        const dictSysUserSex = await this.sysDictTypeService.findDataByType('sys_user_sex');
        // 导入记录
        let successNum = 0;
        let failureNum = 0;
        const successMsgArr = [];
        const failureMsgArr = [];
        const mustItemArr = ['登录账号', '用户昵称'];
        for (const item of rows) {
            // 检查必填列
            const ownItem = mustItemArr.every(m => Object.keys(item).includes(m));
            if (!ownItem) {
                failureNum++;
                failureMsgArr.push(`表格中必填列表项，${mustItemArr.join('、')}`);
                continue;
            }
            // 用户性别转值
            let sysUserSex = '0';
            for (const v of dictSysUserSex) {
                if (v.dataLabel === item['用户性别']) {
                    sysUserSex = v.dataValue;
                    break;
                }
            }
            let sysUserStatus = common_1.STATUS_NO;
            if (item['帐号状态'] === '正常') {
                sysUserStatus = common_1.STATUS_YES;
            }
            let sysUserDeptId = 100;
            if (item['部门编号']) {
                sysUserDeptId = (0, parse_1.parseNumber)(item['部门编号']);
            }
            // 验证是否存在这个用户
            const newSysUser = await this.findByUserName(item['登录账号']);
            newSysUser.password = initPassword;
            newSysUser.userName = item['登录账号'];
            newSysUser.nickName = item['用户昵称'];
            newSysUser.phone = item['手机号码'];
            newSysUser.email = item['用户邮箱'];
            newSysUser.statusFlag = sysUserStatus;
            newSysUser.sex = sysUserSex;
            newSysUser.deptId = sysUserDeptId;
            newSysUser.roleIds = [];
            newSysUser.postIds = [];
            // 行用户编号
            const rowNo = item['用户编号'];
            // 检查手机号码格式并判断是否唯一
            if (newSysUser.phone) {
                if ((0, regular_1.validMobile)(newSysUser.phone)) {
                    const uniquePhone = await this.checkUniqueByPhone(newSysUser.phone, newSysUser.userId);
                    if (!uniquePhone) {
                        const msg = `用户编号：${rowNo} 手机号码：${newSysUser.phone} 已存在`;
                        failureNum++;
                        failureMsgArr.push(msg);
                        continue;
                    }
                }
                else {
                    const msg = `用户编号：${rowNo} 手机号码：${newSysUser.phone} 格式错误`;
                    failureNum++;
                    failureMsgArr.push(msg);
                    continue;
                }
            }
            // 检查邮箱格式并判断是否唯一
            if (newSysUser.email) {
                if ((0, regular_1.validEmail)(newSysUser.email)) {
                    const uniqueEmail = await this.checkUniqueByEmail(newSysUser.email, newSysUser.userId);
                    if (!uniqueEmail) {
                        const msg = `用户编号：${rowNo} 用户邮箱：${newSysUser.email} 已存在`;
                        failureNum++;
                        failureMsgArr.push(msg);
                        continue;
                    }
                }
                else {
                    const msg = `用户编号：${rowNo} 用户邮箱：${newSysUser.email} 格式错误`;
                    failureNum++;
                    failureMsgArr.push(msg);
                    continue;
                }
            }
            if (!newSysUser.userId) {
                newSysUser.createBy = operaName;
                const insertId = await this.insert(newSysUser);
                if (insertId > 0) {
                    const msg = `用户编号：${rowNo} 登录账号：${newSysUser.userName} 导入成功`;
                    successNum++;
                    successMsgArr.push(msg);
                }
                else {
                    const msg = `用户编号：${rowNo} 登录账号：${newSysUser.userName} 导入失败`;
                    failureNum++;
                    failureMsgArr.push(msg);
                }
                continue;
            }
            // 如果用户已存在 同时 是否更新支持
            if (newSysUser.userId > 0 && updateSupport) {
                newSysUser.password = ''; // 密码不更新
                newSysUser.updateBy = operaName;
                const rows = await this.update(newSysUser);
                if (rows > 0) {
                    const msg = `用户编号：${rowNo} 登录账号：${newSysUser.userName} 更新成功`;
                    successNum++;
                    successMsgArr.push(msg);
                }
                else {
                    const msg = `用户编号：${rowNo} 登录账号：${newSysUser.userName} 更新失败`;
                    failureNum++;
                    failureMsgArr.push(msg);
                }
                continue;
            }
        }
        let message = '';
        if (failureNum > 0) {
            const msg = `很抱歉，导入失败！共 ${failureNum} 条数据格式不正确，错误如下：`;
            failureMsgArr.unshift(msg);
            message = failureMsgArr.join('<br/>');
        }
        else {
            const msg = `恭喜您，数据已全部导入成功！共 ${successNum} 条，数据如下：`;
            successMsgArr.unshift(msg);
            message = successMsgArr.join('<br/>');
        }
        return message;
    }
};
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_user_1.SysUserRepository)
], SysUserService.prototype, "sysUserRepository", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_role_1.SysRoleRepository)
], SysUserService.prototype, "sysRoleRepository", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_dept_1.SysDeptRepository)
], SysUserService.prototype, "sysDeptRepository", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_user_role_1.SysUserRoleRepository)
], SysUserService.prototype, "sysUserRoleRepository", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_user_post_1.SysUserPostRepository)
], SysUserService.prototype, "sysUserPostRepository", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_dict_type_1.SysDictTypeService)
], SysUserService.prototype, "sysDictTypeService", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", sys_config_1.SysConfigService)
], SysUserService.prototype, "sysConfigService", void 0);
__decorate([
    (0, core_1.Inject)(),
    __metadata("design:type", file_1.FileUtil)
], SysUserService.prototype, "fileUtil", void 0);
exports.SysUserService = SysUserService = __decorate([
    (0, core_1.Provide)(),
    (0, core_1.Singleton)()
], SysUserService);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzX3VzZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9zeXN0ZW0vc2VydmljZS9zeXNfdXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBNEQ7QUFFNUQsc0VBR2tEO0FBQ2xELGdFQUF5RTtBQUN6RSxnRUFBNEU7QUFDNUUsNkRBQThEO0FBQzlELDZEQUFvRTtBQUNwRSxnRUFBbUU7QUFDbkUsK0RBQW9FO0FBQ3BFLCtEQUFvRTtBQUNwRSxxREFBMkQ7QUFDM0QscURBQTJEO0FBQzNELHFEQUEyRDtBQUMzRCxtREFBcUQ7QUFDckQsNkNBQWdEO0FBQ2hELDBEQUFxRDtBQUNyRCwwREFBcUQ7QUFFckQsZ0RBQTRDO0FBRTVDLGNBQWM7QUFHUCxJQUFNLGNBQWMsNEJBQXBCLE1BQU0sY0FBYztJQUN6QixVQUFVO0lBRUYsaUJBQWlCLENBQW9CO0lBRTdDLFVBQVU7SUFFRixpQkFBaUIsQ0FBb0I7SUFFN0MsVUFBVTtJQUVGLGlCQUFpQixDQUFvQjtJQUU3QyxhQUFhO0lBRUwscUJBQXFCLENBQXdCO0lBRXJELGFBQWE7SUFFTCxxQkFBcUIsQ0FBd0I7SUFFckQsWUFBWTtJQUVKLGtCQUFrQixDQUFxQjtJQUUvQyxZQUFZO0lBRUosZ0JBQWdCLENBQW1CO0lBRTNDLFVBQVU7SUFFRixRQUFRLENBQVc7SUFFM0I7Ozs7O09BS0c7SUFDSSxLQUFLLENBQUMsVUFBVSxDQUNyQixLQUE2QixFQUM3QixZQUFvQjtRQUVwQixNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLFlBQVksQ0FDN0QsS0FBSyxFQUNMLFlBQVksQ0FDYixDQUFDO1FBQ0YsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDcEMsTUFBTSxDQUFD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