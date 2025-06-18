<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="操作模块" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入操作模块"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作人员" prop="operaBy">
        <el-input
          v-model="queryParams.operaBy"
          placeholder="请输入操作人员"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作类型" prop="businessType">
        <el-select
          v-model="queryParams.businessType"
          placeholder="操作类型"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in sys_opera_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="操作状态" prop="statusFlag">
        <el-select
          v-model="queryParams.statusFlag"
          placeholder="操作状态"
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
      <el-form-item label="操作时间" style="width: 308px">
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
          v-hasPermi="['system:log:operate:remove']"
        >
          清空
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['system:log:operate:export']"
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
      ref="operlogRef"
      v-loading="loading"
      :data="operlogList"
      :default-sort="defaultSort"
      @sort-change="handleSortChange"
    >
      <el-table-column label="日志编号" align="left" prop="id" />
      <el-table-column
        label="模块名称"
        align="left"
        prop="title"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="业务类型" align="left" prop="businessType">
        <template #default="scope">
          <dict-tag :options="sys_opera_type" :value="scope.row.businessType" />
        </template>
      </el-table-column>
      <el-table-column
        label="操作人员"
        align="left"
        width="110"
        prop="operaBy"
        :show-overflow-tooltip="true"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      />
      <el-table-column
        label="请求方式"
        align="left"
        prop="operaUrlMethod"
        width="100"
      />
      <el-table-column
        label="请求主机"
        align="left"
        prop="operaIp"
        width="130"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="操作状态" align="left" prop="statusFlag">
        <template #default="scope">
          <dict-tag
            :options="sys_common_status"
            :value="scope.row.statusFlag"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作日期"
        align="left"
        prop="operaTime"
        width="180"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.operaTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="消耗时间"
        align="left"
        prop="costTime"
        width="110"
        :show-overflow-tooltip="true"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template #default="scope">
          <span>{{ scope.row.costTime }} ms</span>
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
            icon="View"
            @click="handleView(scope.row, scope.index)"
            v-hasPermi="['system:log:operate:query']"
          >
            详细
          </el-button>
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

    <!-- 操作日志详细 -->
    <el-dialog title="操作日志详细" v-model="open" width="700px" append-to-body>
      <el-form :model="form" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作模块："
              >{{ form.title }} / {{ typeFormat(form) }}
            </el-form-item>
            <el-form-item label="登录信息："
              >{{ form.operaBy }} / {{ form.operaIp }} /
              {{ form.operaLocation }}</el-form-item
            >
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求方式：">
              {{ form.operaUrlMethod }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="请求地址：">{{ form.operaUrl }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作方法：">{{
              form.operaMethod
            }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="请求参数：">
              <el-input
                disabled
                :rows="3"
                type="textarea"
                placeholder="请求参数"
                :value="form.operaParam"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作信息：">
              <el-input
                disabled
                :rows="3"
                type="textarea"
                placeholder="操作信息"
                :value="form.operaMsg"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作状态：">
              <dict-tag :options="sys_common_status" :value="form.statusFlag" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作时间：">
              {{ parseTime(form.operaTime) }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="open = false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { list, cleanSysLogOperate } from '@/api/system/log/operate';

const { proxy } = getCurrentInstance();
const { sys_opera_type, sys_common_status } = proxy.useDict(
  'sys_opera_type',
  'sys_common_status'
);

const operlogList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const total = ref(0);
const dateRange = ref([]);
const defaultSort = ref({ prop: 'operaTime', order: 'descending' });

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    title: undefined,
    operaBy: undefined,
    businessType: undefined,
    statusFlag: undefined,
    sortBy: undefined,
    sortOrder: undefined,
  },
});

const { queryParams, form } = toRefs(data);

/** 查询登录日志 */
function getList() {
  loading.value = true;
  list(proxy.addDateRange(queryParams.value, dateRange.value)).then(
    response => {
      operlogList.value = response.data.rows;
      total.value = response.data.total;
      loading.value = false;
    }
  );
}
/** 操作日志类型字典翻译 */
function typeFormat(row, column) {
  return proxy.selectDictLabel(sys_opera_type.value, row.businessType);
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
  proxy.$refs['operlogRef'].sort(
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
/** 详细按钮操作 */
function handleView(row) {
  open.value = true;
  form.value = row;
}
/** 清空按钮操作 */
function handleClean() {
  proxy.$modal
    .confirm('是否确认清空所有操作日志数据项?')
    .then(function () {
      return cleanSysLogOperate();
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
    '/system/log/operate/export',
    {
      ...queryParams.value,
    },
    `operate_log_${new Date().getTime()}.xlsx`
  );
}

getList();
</script>
