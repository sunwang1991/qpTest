"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserToDataScopeSQL = exports.loginUserByContainPerms = exports.loginUserByContainRoles = exports.loginUserToUserName = exports.loginUserToUserID = exports.loginUser = void 0;
const role_data_scope_1 = require("../constants/role_data_scope");
const common_1 = require("../constants/common");
const user_info_1 = require("../token/user_info");
const context_1 = require("./context");
/**
 * 登录用户信息
 * @param c 上下文对象
 * @returns 登录用户信息
 */
function loginUser(c) {
    const value = c.getAttr(common_1.CTX_LOGIN_USER);
    if (value && value.deptId) {
        delete value.user.password;
        return [value, ''];
    }
    return [new user_info_1.UserInfo(), 'invalid login user information'];
}
exports.loginUser = loginUser;
/**
 * 登录用户信息-用户ID
 * @param c 上下文对象
 * @returns 用户ID
 */
function loginUserToUserID(c) {
    const [info, err] = loginUser(c);
    if (err) {
        return 0;
    }
    return info.userId;
}
exports.loginUserToUserID = loginUserToUserID;
/**
 * 登录用户信息-用户名称
 * @param c 上下文对象
 * @returns 用户名称
 */
function loginUserToUserName(c) {
    const [info, err] = loginUser(c);
    if (err) {
        return '';
    }
    return info.user.userName;
}
exports.loginUserToUserName = loginUserToUserName;
/**
 * 登录用户信息-包含角色KEY
 * @param c 上下文对象
 * @returns boolen
 */
function loginUserByContainRoles(c, target) {
    const [info, err] = loginUser(c);
    if (err) {
        return false;
    }
    if ((0, context_1.isSystemUser)(c, info.userId)) {
        return true;
    }
    if (Array.isArray(info.user.roles)) {
        for (const item of info.user.roles) {
            if (item.roleKey === target) {
                return true;
            }
        }
    }
    return false;
}
exports.loginUserByContainRoles = loginUserByContainRoles;
/**
 * 登录用户信息-包含权限标识
 * @param c 上下文对象
 * @returns boolen
 */
function loginUserByContainPerms(c, target) {
    const [info, err] = loginUser(c);
    if (err) {
        return false;
    }
    if ((0, context_1.isSystemUser)(c, info.userId)) {
        return true;
    }
    if (Array.isArray(info.permissions)) {
        for (const str of info.permissions) {
            if (str === target) {
                return true;
            }
        }
    }
    return false;
}
exports.loginUserByContainPerms = loginUserByContainPerms;
/**
 * 登录用户信息-角色数据范围过滤SQL字符串
 * @param c 上下文对象
 * @param deptAlias 部门表别名
 * @param userAlias 用户表别名
 * @return SQL字符串 (...)
 */
function loginUserToDataScopeSQL(c, deptAlias, userAlias) {
    let dataScopeSQL = '';
    // 登录用户信息
    const [info, err] = loginUser(c);
    if (err) {
        return dataScopeSQL;
    }
    const userInfo = info.user;
    // 如果是系统管理员，则不过滤数据
    if ((0, context_1.isSystemUser)(c, userInfo.userId)) {
        return dataScopeSQL;
    }
    // 无用户角色
    if (!Array.isArray(userInfo.roles) || userInfo.roles.length <= 0) {
        return dataScopeSQL;
    }
    // 记录角色权限范围定义添加过, 非自定数据权限不需要重复拼接SQL
    const scopeKeys = [];
    const conditions = [];
    for (const role of userInfo.roles) {
        const dataScope = role.dataScope;
        if (role_data_scope_1.ROLE_SCOPE_ALL === dataScope) {
            break;
        }
        if (role_data_scope_1.ROLE_SCOPE_CUSTOM !== dataScope) {
            if (scopeKeys.includes(dataScope)) {
                continue;
            }
        }
        if (role_data_scope_1.ROLE_SCOPE_CUSTOM === dataScope) {
            const sql = `${deptAlias}.dept_id IN 
        ( SELECT dept_id FROM sys_role_dept WHERE role_id = ${role.roleId} ) 
        AND ${deptAlias}.dept_id NOT IN 
        ( 
        SELECT d.parent_id FROM sys_dept d 
        INNER JOIN sys_role_dept rd ON rd.dept_id = d.dept_id 
        AND rd.role_id = ${role.roleId}
        )`;
            conditions.push(sql);
        }
        if (role_data_scope_1.ROLE_SCOPE_DEPT === dataScope) {
            conditions.push(`${deptAlias}.dept_id = ${userInfo.deptId}`);
        }
        if (role_data_scope_1.ROLE_SCOPE_DEPT_CHILD === dataScope) {
            const sql = `${deptAlias}.dept_id IN ( 
        SELECT dept_id FROM sys_dept 
        WHERE dept_id = ${userInfo.deptId} 
        OR find_in_set(${userInfo.deptId}, ancestors ) 
        )`;
            conditions.push(sql);
        }
        if (role_data_scope_1.ROLE_SCOPE_SELF === dataScope) {
            if (userAlias === '') {
                conditions.push(`${deptAlias}.dept_id = ${userInfo.deptId}`);
            }
            else {
                conditions.push(`${userAlias}.user_id = ${userInfo.userId}`);
            }
        }
        // 记录角色范围
        scopeKeys.push(dataScope);
    }
    // 构建查询条件语句
    if (conditions.length > 0) {
        dataScopeSQL = ` ( ${conditions.join(' OR ')} ) `;
    }
    return dataScopeSQL;
}
exports.loginUserToDataScopeSQL = loginUserToDataScopeSQL;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mcmFtZXdvcmsvcmVxY3R4L2F1dGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsa0VBTXNDO0FBQ3RDLGdEQUFxRDtBQUNyRCxrREFBOEM7QUFDOUMsdUNBQXlDO0FBRXpDOzs7O0dBSUc7QUFDSCxTQUFnQixTQUFTLENBQUMsQ0FBVTtJQUNsQyxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFXLHVCQUFjLENBQUMsQ0FBQztJQUNsRCxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO1FBQ3pCLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDM0IsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNwQjtJQUNELE9BQU8sQ0FBQyxJQUFJLG9CQUFRLEVBQUUsRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO0FBQzVELENBQUM7QUFQRCw4QkFPQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFnQixpQkFBaUIsQ0FBQyxDQUFVO0lBQzFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pDLElBQUksR0FBRyxFQUFFO1FBQ1AsT0FBTyxDQUFDLENBQUM7S0FDVjtJQUNELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUNyQixDQUFDO0FBTkQsOENBTUM7QUFFRDs7OztHQUlHO0FBQ0gsU0FBZ0IsbUJBQW1CLENBQUMsQ0FBVTtJQUM1QyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqQyxJQUFJLEdBQUcsRUFBRTtRQUNQLE9BQU8sRUFBRSxDQUFDO0tBQ1g7SUFDRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQzVCLENBQUM7QUFORCxrREFNQztBQUVE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