<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入部门名称"
            clearable
            prefix-icon="Search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="{ label: 'label', children: 'children' }"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="deptTreeRef"
            node-key="id"
            highlight-current
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryRef"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
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
          <el-form-item label="状态" prop="statusFlag">
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
              type="primary"
              plain
              icon="Plus"
              @click="handleAdd"
              v-hasPermi="['system:user:add']"
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
              v-hasPermi="['system:user:edit']"
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
              v-hasPermi="['system:user:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              plain
              icon="Upload"
              @click="handleImport"
              v-hasPermi="['system:user:import']"
              >导入</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['system:user:export']"
              >导出</el-button
            >
          </el-col>
          <right-toolbar
            v-model:showSearch="showSearch"
            @queryTable="getList"
            :columns="columns"
          ></right-toolbar>
        </el-row>

        <el-table
          v-loading="loading"
          :data="userList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="left" />
          <el-table-column
            label="用户编号"
            align="left"
            key="userId"
            prop="userId"
            v-if="columns[0].visible"
          />
          <el-table-column
            label="登录账号"
            align="left"
            key="userName"
            prop="userName"
            v-if="columns[1].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="用户昵称"
            align="left"
            key="nickName"
            prop="nickName"
            v-if="columns[2].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="部门名称"
            align="left"
            key="deptName"
            prop="dept.deptName"
            v-if="columns[3].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="手机号码"
            align="left"
            key="phone"
            prop="phone"
            v-if="columns[4].visible"
            width="120"
          />
          <el-table-column
            label="状态"
            align="left"
            key="statusFlag"
            v-if="columns[5].visible"
          >
            <template #default="scope">
              <el-switch
                v-if="!scope.row.roleIds?.includes(SYS_ROLE_SYSTEM_ID)"
                v-hasPermi="['system:user:edit']"
                v-model="scope.row.statusFlag"
                active-value="1"
                inactive-value="0"
                @change="handleStatusChange(scope.row)"
              ></el-switch>
              <dict-tag
                v-else
                :options="sys_normal_disable"
                :value="scope.row.statusFlag"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="登录时间"
            align="left"
            prop="loginTime"
            v-if="columns[6].visible"
            width="160"
          >
            <template #default="scope">
              <span>{{ parseTime(scope.row.loginTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="left"
            width="150"
            class-name="small-padding fixed-width"
          >
            <template #default="scope">
              <el-tooltip
                content="修改"
                placement="top"
                v-if="!scope.row?.roleIds?.includes(SYS_ROLE_SYSTEM_ID)"
              >
                <el-button
                  link
                  type="primary"
                  icon="Edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:user:edit']"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                content="删除"
                placement="top"
                v-if="!scope.row?.roleIds?.includes(SYS_ROLE_SYSTEM_ID)"
              >
                <el-button
                  link
                  type="primary"
                  icon="Delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['system:user:remove']"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                content="重置密码"
                placement="top"
                v-if="!scope.row?.roleIds?.includes(SYS_ROLE_SYSTEM_ID)"
              >
                <el-button
                  link
                  type="primary"
                  icon="Key"
                  @click="handleResetPwd(scope.row)"
                  v-hasPermi="['system:user:resetPwd']"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                content="解锁"
                placement="top"
                v-if="!scope.row?.roleIds?.includes(SYS_ROLE_SYSTEM_ID)"
              >
                <el-button
                  link
                  type="primary"
                  icon="Unlock"
                  @click="handleUnlock(scope.row.userName)"
                  v-hasPermi="['monitor:logininfor:unlock']"
                ></el-button>
              </el-tooltip>
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
      </el-col>
    </el-row>

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form :model="form" :rules="rules" ref="userRef" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="nickName">
              <el-input
                v-model="form.nickName"
                placeholder="请输入用户昵称"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属部门" prop="deptId">
              <el-tree-select
                v-model="form.deptId"
                :data="deptOptions"
                :props="{ value: 'id', label: 'label', children: 'children' }"
                value-key="id"
                placeholder="请选择归属部门"
                check-strictly
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input
                v-model="form.phone"
                placeholder="请输入手机号码"
                maxlength="11"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="form.email"
                placeholder="请输入邮箱"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              v-if="form.userId == undefined"
              label="登录账号"
              prop="userName"
            >
              <el-input
                v-model="form.userName"
                placeholder="请输入登录账号"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="form.userId == undefined"
              label="用户密码"
              prop="password"
            >
              <el-input
                v-model="form.password"
                placeholder="请输入用户密码"
                type="password"
                maxlength="20"
                show-password
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户性别">
              <el-select v-model="form.sex" placeholder="请选择">
                <el-option
                  v-for="dict in sys_user_sex"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.statusFlag">
                <el-radio
                  v-for="dict in sys_normal_disable"
                  :key="dict.value"
                  :value="dict.value"
                  >{{ dict.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="岗位">
              <el-select v-model="form.postIds" multiple placeholder="请选择">
                <el-option
                  v-for="item in postOptions"
                  :key="item.postId"
                  :label="item.postName"
                  :value="item.postId"
                  :disabled="item.status === '0'"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-select v-model="form.roleIds" multiple placeholder="请选择">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                  :disabled="item.status === '0'"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog
      :title="upload.title"
      v-model="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="uploadRef"
        :limit="1"
        accept=".xlsx, .xls"
        :http-request="requestUpload"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :auto-upload="false"
        drag
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-left">
            <div class="el-upload__tip">
              <el-checkbox
                v-model="upload.updateSupport"
                :disabled="upload.isUploading"
              />是否更新已经存在的用户数据
            </div>
            <span>仅允许导入xls、xlsx格式文件。</span>
            <el-link
              type="primary"
              :underline="false"
              style="font-size: 12px; vertical-align: baseline"
              :disabled="upload.isUploading"
              @click="importTemplate"
              >下载模板</el-link
            >
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { uploadFile } from '@/api/tool/file';
import {
  changeUserStatus,
  listUser,
  resetUserPwd,
  delUser,
  getUser,
  updateUser,
  addUser,
  deptTreeSelect,
  importData,
  unlock,
} from '@/api/system/user';
import {
  regExpUserName,
  regExpPasswd,
  regExpMobile,
  regExpEmail,
} from '@/utils/validate';
import { SYS_ROLE_SYSTEM_ID } from '@/constants/admin-constants';
import { ElMessageBox } from 'element-plus';
const { proxy } = getCurrentInstance();
const { sys_normal_disable, sys_user_sex } = proxy.useDict(
  'sys_normal_disable',
  'sys_user_sex'
);

const userList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref('');
const dateRange = ref([]);
const deptName = ref('');
const deptOptions = ref([]);
const initPassword = ref('');
const postOptions = ref([]);
const roleOptions = ref([]);
/*** 用户导入参数 */
const upload = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: '',
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: false,
  // 上传信息
  msg: '',
});
// 列显隐信息
const columns = ref([
  { key: 0, label: `用户编号`, visible: true },
  { key: 1, label: `登录账号`, visible: true },
  { key: 2, label: `用户昵称`, visible: true },
  { key: 3, label: `部门`, visible: true },
  { key: 4, label: `手机号码`, visible: true },
  { key: 5, label: `状态`, visible: true },
  { key: 6, label: `登录时间`, visible: true },
]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    userName: '',
    phone: '',
    statusFlag: undefined,
    deptId: 100,
  },
  rules: {
    userName: [
      { required: true, message: '登录账号不能为空', trigger: 'blur' },
      {
        pattern: regExpUserName,
        message: '账号只能包含大写小写字母，数字，且不少于4位',
        trigger: 'blur',
      },
    ],
    nickName: [
      { required: true, message: '用户昵称不能为空', trigger: 'blur' },
    ],
    password: [
      { required: true, message: '用户密码不能为空', trigger: 'blur' },
      {
        pattern: regExpPasswd,
        message: '密码至少包含大小写字母、数字、特殊符号，且不少于6位',
        trigger: 'blur',
      },
    ],
    email: [
      {
        pattern: regExpEmail,
        message: '请输入正确的邮箱地址',
        trigger: ['blur', 'change'],
      },
    ],
    phone: [
      {
        pattern: regExpMobile,
        message: '请输入正确的手机号码',
        trigger: 'blur',
      },
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};
/** 根据名称筛选部门树 */
watch(deptName, val => {
  proxy.$refs['deptTreeRef'].filter(val);
});
/** 查询部门下拉树结构 */
function getDeptTree() {
  deptTreeSelect().then(response => {
    deptOptions.value = response.data;
  });
}
/** 查询用户列表 */
function getList() {
  loading.value = true;
  listUser(proxy.addDateRange(queryParams.value, dateRange.value)).then(res => {
    loading.value = false;
    userList.value = res.data.rows;
    total.value = res.data.total;
  });
}
/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams.value.deptId = data.id;
  handleQuery();
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
  queryParams.value.deptId = undefined;
  proxy.$refs.deptTreeRef.setCurrentKey(null);
  handleQuery();
}
/** 删除按钮操作 */
function handleDelete(row) {
  const userIds = row.userId || ids.value;
  proxy.$modal
    .confirm('是否确认删除用户编号为"' + userIds + '"的数据项？')
    .then(function () {
      return delUser(userIds);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess('删除成功');
    })
    .catch(() => {});
}
/** 导出按钮操作 */
function handleExport() {
  proxy.download(
    'system/user/export',
    {
      ...queryParams.value,
    },
    `user_${new Date().getTime()}.xlsx`
  );
}
/** 覆盖默认上传行为 */
function requestUpload(e) {
  upload.isUploading = true;
  let formData = new FormData();
  formData.append('file', e.file, e.file.name);
  formData.append('subPath', 'import');
  uploadFile(formData)
    .then(res => {
      if (res.data) {
        return res.data.filePath;
      }
      return '';
    })
    .then(filePath => {
      if (filePath === '') return undefined;
      return importData(filePath, upload.updateSupport);
    })
    .then(res => {
      if (res === undefined) return;
      const msg = res.msg?.replaceAll(/<br\/>+/g, '\r');
      handleFileSuccess(msg, e.file);
    })
    .finally(() => {
      upload.isUploading = false;
    });
}
/** 用户状态修改  */
function handleStatusChange(row) {
  let text = row.statusFlag === '1' ? '启用' : '停用';
  proxy.$modal
    .confirm('确认要"' + text + '""' + row.userName + '"用户吗?')
    .then(function () {
      return changeUserStatus(row.userId, row.statusFlag);
    })
    .then(() => {
      proxy.$modal.msgSuccess(text + '成功');
    })
    .catch(function () {
      row.statusFlag = row.statusFlag === '1' ? '0' : '1';
    });
}
/** 解锁按钮操作 */
function handleUnlock(username) {
  proxy.$modal
    .confirm('是否确认解锁用户"' + username + '"数据项?')
    .then(function () {
      return unlock(username);
    })
    .then(() => {
      proxy.$modal.msgSuccess('用户' + username + '解锁成功');
    })
    .catch(() => {});
}
/** 重置密码按钮操作 */
function handleResetPwd(row) {
  ElMessageBox.prompt('请输入"' + row.userName + '"的新密码', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    inputPattern: regExpPasswd,
    inputErrorMessage: '密码至少包含大小写字母、数字、特殊符号，且不少于6位',
  })
    .then(({ value }) => {
      resetUserPwd(row.userId, value).then(response => {
        proxy.$modal.msgSuccess('修改成功，新密码是：' + value);
      });
    })
    .catch(() => {});
}
/** 选择条数  */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.userId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
/** 导入按钮操作 */
function handleImport() {
  upload.title = '用户导入';
  upload.open = true;
}
/** 下载模板操作 */
function importTemplate() {
  proxy.download(
    'system/user/import/template',
    {},
    `user_template_${new Date().getTime()}.xlsx`
  );
}
/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (msg, file) => {
  upload.open = false;
  upload.isUploading = false;
  proxy.$refs['uploadRef'].handleRemove(file);
  ElMessageBox.alert(
    "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
      msg +
      '</div>',
    '导入结果',
    { dangerouslyUseHTMLString: true }
  );
  getList();
};
/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs['uploadRef'].submit();
}
/** 重置操作表单 */
function reset() {
  form.value = {
    userId: undefined,
    deptId: 100,
    userName: '',
    nickName: '',
    password: '',
    phone: '',
    email: '',
    sex: '0',
    statusFlag: '0',
    remark: '',
    postIds: [],
    roleIds: [],
  };
  proxy.resetForm('userRef');
}
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}
/** 新增按钮操作 */
function handleAdd() {
  reset();
  getUser().then(response => {
    const { posts, roles } = response.data;
    postOptions.value = posts;
    roleOptions.value = roles;
    open.value = true;
    title.value = '添加用户';
    if (queryParams.value.deptId) {
      form.value.deptId = queryParams.value.deptId;
    } else {
      form.value.deptId = 100;
    }
    form.value.password = initPassword.value;
  });
}
/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const userId = row.userId || ids.value;
  getUser(userId).then(response => {
    const { user, posts, roles, postIds, roleIds } = response.data;
    user.password = '';
    user.dept = undefined;
    form.value = user;
    postOptions.value = posts;
    roleOptions.value = roles;
    form.value.postIds = postIds;
    form.value.roleIds = roleIds;
    open.value = true;
    title.value = '修改用户';
  });
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs['userRef'].validate(valid => {
    if (valid) {
      if (form.value.userId) {
        updateUser(form.value).then(response => {
          proxy.$modal.msgSuccess('修改成功');
          open.value = false;
          getList();
        });
      } else {
        addUser(form.value).then(response => {
          proxy.$modal.msgSuccess('新增成功');
          open.value = false;
          getList();
        });
      }
    }
  });
}

getDeptTree();
getList();
</script>
