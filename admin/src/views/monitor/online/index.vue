<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item label="登录账号" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入登录账号"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="登录IP" prop="loginIp">
        <el-input
          v-model="queryParams.loginIp"
          placeholder="请输入登录IP"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="onlineList.slice((pageNum - 1) * pageSize, pageNum * pageSize)"
      style="width: 100%"
    >
      <el-table-column label="序号" width="50" type="index" align="left">
        <template #default="scope">
          <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="会话编号"
        align="left"
        prop="tokenId"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="登录账号"
        align="left"
        prop="userName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="所属部门"
        align="left"
        prop="deptName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="登录IP"
        align="left"
        prop="loginIp"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="登录地点"
        align="left"
        prop="loginLocation"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="操作系统"
        align="left"
        prop="os"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="浏览器"
        align="left"
        prop="browser"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="登录时间"
        align="left"
        prop="loginTime"
        width="180"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.loginTime) }}</span>
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
            icon="Delete"
            @click="handleForceLogout(scope.row)"
            v-hasPermi="['monitor:online:forceLogout']"
            >强退</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="pageNum"
      v-model:limit="pageSize"
    />
  </div>
</template>

<script setup>
import { forceLogout, list as initData } from '@/api/monitor/online';

const { proxy } = getCurrentInstance();

const onlineList = ref([]);
const loading = ref(true);
const total = ref(0);
const pageNum = ref(1);
const pageSize = ref(10);

const queryParams = ref({
  loginIp: '',
  userName: '',
});

/** 查询登录日志列表 */
function getList() {
  loading.value = true;
  initData(queryParams.value).then(response => {
    onlineList.value = response.data.rows;
    total.value = response.data.total;
    loading.value = false;
  });
}
/** 搜索按钮操作 */
function handleQuery() {
  pageNum.value = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm('queryRef');
  handleQuery();
}
/** 强退按钮操作 */
function handleForceLogout(row) {
  proxy.$modal
    .confirm('是否确认强退名称为"' + row.userName + '"的用户?')
    .then(function () {
      return forceLogout(row.tokenId);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess('删除成功');
    })
    .catch(() => {});
}

getList();
</script>
