import request from '@/utils/request';
import { parseStrEmpty } from '@/utils/ruoyi';

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query,
  });
}

// 查询用户详细
export function getUser(userId = '0') {
  return request({
    url: '/system/user/' + parseStrEmpty(userId),
    method: 'get',
  });
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/system/user',
    method: 'post',
    data: data,
  });
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/system/user',
    method: 'put',
    data: data,
  });
}

// 删除用户
export function delUser(userId) {
  return request({
    url: '/system/user/' + userId,
    method: 'delete',
  });
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  const data = {
    userId,
    password,
  };
  return request({
    url: '/system/user/password',
    method: 'put',
    data: data,
  });
}

// 用户状态修改
export function changeUserStatus(userId, statusFlag) {
  const data = {
    userId,
    statusFlag,
  };
  return request({
    url: '/system/user/status',
    method: 'put',
    data: data,
  });
}

// 解锁用户登录状态
export function unlock(userName) {
  return request({
    url: `/system/user/unlock/${userName}`,
    method: 'put',
  });
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/system/user/profile',
    method: 'get',
  });
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/system/user/profile',
    method: 'put',
    data: data,
  });
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword,
  };
  return request({
    url: '/system/user/profile/password',
    method: 'put',
    data: data,
  });
}

// 查询部门下拉树结构
export function deptTreeSelect() {
  return request({
    url: '/system/dept/tree',
    method: 'get',
  });
}

// 导入用户模板数据
export function importData(filePath, update) {
  return request({
    url: '/system/user/import',
    method: 'post',
    data: { filePath, update },
    timeout: 60_000,
  });
}
