<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      v-show="showSearch"
      :inline="true"
    >
      <el-form-item label="登录账号" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入登录账号"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号码"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户状态" prop="statusFlag">
        <el-select
          v-model="queryParams.statusFlag"
          placeholder="用户状态"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="openSelectUser"
          v-hasPermi="['system:role:add']"
          >添加用户</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="CircleClose"
          :disabled="multiple"
          @click="cancelAuthUserAll"
          v-hasPermi="['system:role:remove']"
          >批量取消授权</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Close" @click="handleClose"
          >关闭</el-button
        >
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="userList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="left" />
      <el-table-column
        label="登录账号"
        prop="userName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="用户昵称"
        prop="nickName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="邮箱"
        prop="email"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="手机"
        prop="phone"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="状态" align="left" prop="statusFlag">
        <template #default="scope">
          <dict-tag
            :options="sys_normal_disable"
            :value="scope.row.statusFlag"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="left"
        prop="createTime"
        width="180"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="left"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            link
            type="primary"
            icon="CircleClose"
            @click="cancelAuthUser(scope.row)"
            v-hasPermi="['system:role:remove']"
            >取消授权</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
    <auth-user-select
      ref="selectRef"
      :roleId="queryParams.roleId"
      @ok="handleQuery"
    />
  </div>
</template>

<script setup>
import AuthUserSelect from './components/auth-user-select';
import {
  allocatedUserList,
  authUserCancel,
  authUserCancelAll,
} from '@/api/system/role';

const route = useRoute();
const { proxy } = getCurrentInstance();
const { sys_normal_disable } = proxy.useDict('sys_normal_disable');

const userList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const multiple = ref(true);
const total = ref(0);
const userIds = ref([]);

const queryParams = reactive({
  pageNum: 1,
  pageSize: 20,
  /**是否已分配 */
  auth: true,
  /**角色ID */
  roleId: route.params.roleId,
  userName: undefined,
  phone: undefined,
  statusFlag: undefined,
});

/** 查询授权用户列表 */
function getList() {
  loading.value = true;
  allocatedUserList(queryParams).then(response => {
    userList.value = response.data.rows;
    total.value = response.data.total;
    loading.value = false;
  });
}
// 返回按钮
function handleClose() {
  const obj = { path: '/system/role' };
  proxy.$tab.closeOpenPage(obj);
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm('queryRef');
  handleQuery();
}
// 多选框选中数据
function handleSelectionChange(selection) {
  userIds.value = selection.map(item => item.userId);
  multiple.value = !selection.length;
}
/** 打开授权用户表弹窗 */
function openSelectUser() {
  proxy.$refs['selectRef'].show();
}
/** 取消授权按钮操作 */
function cancelAuthUser(row) {
  proxy.$modal
    .confirm('确认要取消该用户"' + row.userName + '"角色吗？')
    .then(function () {
      return authUserCancel({
        auth: false,
        userIds: [parseInt(row.userId)],
        roleId: parseInt(queryParams.roleId),
      });
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess('取消授权成功');
    })
    .catch(() => {});
}
/** 批量取消授权按钮操作 */
function cancelAuthUserAll(row) {
  proxy.$modal
    .confirm('是否取消选中用户授权数据项?')
    .then(function () {
      return authUserCancelAll({
        auth: false,
        userIds: userIds.value.map(v => parseInt(v)),
        roleId: parseInt(queryParams.roleId),
      });
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess('取消授权成功');
    })
    .catch(() => {});
}

getList();
</script>
