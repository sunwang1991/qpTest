<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="登录地址" prop="loginIp">
        <el-input
          v-model="queryParams.loginIp"
          placeholder="请输入登录地址"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="登录账号" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入登录账号"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="登录状态" prop="statusFlag">
        <el-select
          v-model="queryParams.statusFlag"
          placeholder="登录状态"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in sys_common_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="登录时间" style="width: 308px">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[
            new Date(2000, 1, 1, 0, 0, 0),
            new Date(2000, 1, 1, 23, 59, 59),
          ]"
        ></el-date-picker>
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
          type="danger"
          plain
          icon="Delete"
          @click="handleClean"
          v-hasPermi="['monitor:logininfor:remove']"
          >清空</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['monitor:logininfor:export']"
        >
          导出
        </el-button>
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      ref="logininforRef"
      v-loading="loading"
      :data="logininforList"
      :default-sort="defaultSort"
      @sort-change="handleSortChange"
    >
      <el-table-column label="日志编号" align="left" prop="id" />
      <el-table-column
        label="登录账号"
        align="left"
        prop="userName"
        :show-overflow-tooltip="true"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      />
      <el-table-column
        label="登录地址"
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
      <el-table-column label="登录状态" align="left" prop="statusFlag">
        <template #default="scope">
          <dict-tag
            :options="sys_common_status"
            :value="scope.row.statusFlag"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="登录信息"
        align="left"
        prop="msg"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="登录时间"
        align="left"
        prop="loginTime"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
        width="180"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.loginTime) }}</span>
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
  </div>
</template>

<script setup>
import { list, cleanSysLogLogin } from '@/api/system/log/login';

const { proxy } = getCurrentInstance();
const { sys_common_status } = proxy.useDict('sys_common_status');

const logininforList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const total = ref(0);
const dateRange = ref([]);
const defaultSort = ref({ prop: 'loginTime', order: 'descending' });

// 查询参数
const queryParams = ref({
  pageNum: 1,
  pageSize: 20,
  loginIp: '',
  userName: '',
  statusFlag: undefined,
  sortBy: undefined,
  sortOrder: undefined,
});

/** 查询登录日志列表 */
function getList() {
  loading.value = true;
  list(proxy.addDateRange(queryParams.value, dateRange.value)).then(
    response => {
      logininforList.value = response.data.rows;
      total.value = response.data.total;
      loading.value = false;
    }
  );
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  proxy.resetForm('queryRef');
  queryParams.value.pageNum = 1;
  proxy.$refs['logininforRef'].sort(
    defaultSort.value.prop,
    defaultSort.value.order
  );
}
/** 排序触发事件 */
function handleSortChange(column, prop, order) {
  queryParams.value.sortBy = column.prop;
  queryParams.value.sortOrder = column.order;
  getList();
}
/** 清空按钮操作 */
function handleClean() {
  proxy.$modal
    .confirm('是否确认清空所有登录日志数据项?')
    .then(function () {
      return cleanSysLogLogin();
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess('清空成功');
    })
    .catch(() => {});
}
/** 导出按钮操作 */
function handleExport() {
  proxy.download(
    '/system/log/login/export',
    {
      ...queryParams.value,
    },
    `login_log_${new Date().getTime()}.xlsx`
  );
}

getList();
</script>
