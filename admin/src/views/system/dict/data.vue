<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="字典名称" prop="dictType">
        <el-select v-model="queryParams.dictType" style="width: 200px" disabled>
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="字典标签" prop="dataLabel">
        <el-input
          v-model="queryParams.dataLabel"
          placeholder="请输入字典标签"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="statusFlag">
        <el-select
          v-model="queryParams.statusFlag"
          placeholder="数据状态"
          clearable
          style="width: 200px"
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
          @click="handleAdd"
          v-hasPermi="['system:dict:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:dict:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:dict:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['system:dict:export']"
          >导出</el-button
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
      :data="dataList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="left" />
      <el-table-column label="数据编号" align="left" prop="dataId" />
      <el-table-column label="数据标签" align="left" prop="dataLabel">
        <template #default="scope">
          <span
            v-if="scope.row.tagType == '' || scope.row.tagType == 'default'"
          >
            {{ scope.row.dataLabel }}
          </span>
          <el-tag v-else :type="scope.row.tagType">
            {{ scope.row.dataLabel }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="数据键值" align="left" prop="dataValue" />
      <el-table-column label="数据排序" align="left" prop="dataSort" />
      <el-table-column label="数据状态" align="left" prop="statusFlag">
        <template #default="scope">
          <dict-tag
            :options="sys_normal_disable"
            :value="scope.row.statusFlag"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
        align="left"
        prop="remark"
        :show-overflow-tooltip="true"
      />
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
        width="160"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            link
            type="primary"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:dict:edit']"
            >修改</el-button
          >
          <el-button
            link
            type="primary"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:dict:remove']"
            >删除</el-button
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="dataRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="字典类型">
          <el-input v-model="form.dictType" :disabled="true" />
        </el-form-item>
        <el-form-item label="数据标签" prop="dataLabel">
          <el-input v-model="form.dataLabel" placeholder="请输入数据标签" />
        </el-form-item>
        <el-form-item label="数据键值" prop="dataValue">
          <el-input v-model="form.dataValue" placeholder="请输入数据键值" />
        </el-form-item>
        <el-form-item label="数据排序" prop="dataSort">
          <el-input-number
            v-model="form.dataSort"
            controls-position="right"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="标签类型" prop="tagType">
          <el-select v-model="form.tagType">
            <el-option
              v-for="item in tagTypeOptions"
              :key="item.value"
              :label="item.label + '(' + item.value + ')'"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="样式属性" prop="tagClass">
          <el-input v-model="form.tagClass" placeholder="请输入样式属性" />
        </el-form-item>
        <el-form-item label="数据状态" prop="statusFlag">
          <el-radio-group v-model="form.statusFlag">
            <el-radio
              v-for="dict in sys_normal_disable"
              :key="dict.value"
              :value="dict.value"
              >{{ dict.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数据说明" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import useDictStore from '@/store/modules/dict';
import { getDictOptionselect, getType } from '@/api/system/dict/type';
import {
  listData,
  getData,
  delData,
  addData,
  updateData,
} from '@/api/system/dict/data';
import { onMounted } from 'vue';

const { proxy } = getCurrentInstance();
const { sys_normal_disable } = proxy.useDict('sys_normal_disable');

const dataList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref('');
const defaultDictType = ref('');
const typeOptions = ref([]);
const route = useRoute();
// 数据标签回显样式
const tagTypeOptions = ref([
  { value: 'default', label: '默认' },
  { value: 'primary', label: '主要' },
  { value: 'success', label: '成功' },
  { value: 'info', label: '信息' },
  { value: 'warning', label: '警告' },
  { value: 'danger', label: '危险' },
]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    dictName: '',
    dictType: '',
    statusFlag: undefined,
  },
  rules: {
    dataLabel: [
      { required: true, message: '数据标签不能为空', trigger: 'blur' },
    ],
    dataValue: [
      { required: true, message: '数据键值不能为空', trigger: 'blur' },
    ],
    dataSort: [
      { required: true, message: '数据顺序不能为空', trigger: 'blur' },
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询字典数据列表 */
function getList() {
  loading.value = true;
  listData(queryParams.value).then(response => {
    dataList.value = response.data.rows;
    total.value = response.data.total;
    loading.value = false;
  });
}
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}
/** 表单重置 */
function reset() {
  form.value = {
    dataId: undefined,
    dataLabel: '',
    dataValue: '',
    tagClass: '',
    tagType: 'default',
    dataSort: 0,
    statusFlag: '0',
    remark: '',
  };
  proxy.resetForm('dataRef');
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}
/** 返回按钮操作 */
function handleClose() {
  const obj = { path: '/system/dict' };
  proxy.$tab.closeOpenPage(obj);
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm('queryRef');
  queryParams.value.dictType = defaultDictType.value;
  handleQuery();
}
/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = '添加字典数据';
  form.value.dictType = queryParams.value.dictType;
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.dataId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const dataId = row.dataId || ids.value;
  getData(dataId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = '修改字典数据';
  });
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs['dataRef'].validate(valid => {
    if (valid) {
      if (form.value.dataId) {
        updateData(form.value).then(response => {
          useDictStore().removeDict(queryParams.value.dictType);
          proxy.$modal.msgSuccess('修改成功');
          open.value = false;
          getList();
        });
      } else {
        addData(form.value).then(response => {
          useDictStore().removeDict(queryParams.value.dictType);
          proxy.$modal.msgSuccess('新增成功');
          open.value = false;
          getList();
        });
      }
    }
  });
}
/** 删除按钮操作 */
function handleDelete(row) {
  const dataIds = row.dataId || ids.value;
  proxy.$modal
    .confirm('是否确认删除字典编码为"' + dataIds + '"的数据项？')
    .then(function () {
      return delData(dataIds);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess('删除成功');
      useDictStore().removeDict(queryParams.value.dictType);
    })
    .catch(() => {});
}
/** 导出按钮操作 */
function handleExport() {
  proxy.download(
    'system/dict/data/export',
    {
      ...queryParams.value,
    },
    `dict_data_${new Date().getTime()}.xlsx`
  );
}

onMounted(() => {
  const dictId = route.params && route.params.dictId;
  if (dictId && dictId != '0') {
    getType(dictId).then(response => {
      queryParams.value.dictType = response.data.dictType;
      defaultDictType.value = response.data.dictType;
      getList();
    });
  } else {
    getList();
  }

  // 表单字典类型回显
  getDictOptionselect().then(response => {
    typeOptions.value = response.data;
  });
});
</script>
