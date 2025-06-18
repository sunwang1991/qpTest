<script setup>
import { reactive } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import saveAs from 'file-saver';
import {
  downloadFile,
  downloadFileChunk,
  uploadFile,
  uploadFileChunk,
} from '@/api/tool/file';

let state = reactive({
  loading: false,
  uploadFilePath: '/src/assets/logo/logo.png',
  downloadFilePath: '',
  fileList: [],
});

/**下载文件 */
function fnDownload() {
  const filePath = state.downloadFilePath;
  if (!filePath) {
    ElMessage({
      message: '下载资源地址为空',
      type: 'warning',
      duration: 3000,
    });
    return;
  }

  downloadFile(filePath).then(res => {
    console.log(res);
    if (res.status === 200 && res.data instanceof Blob) {
      ElMessage({
        message: '已完成下载',
        type: 'success',
        duration: 3000,
      });
      const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
      saveAs(res.data, fileName);
    } else {
      ElMessage({
        message: res.msg,
        type: 'error',
        duration: 3000,
      });
    }
  });
}

/**下载切片文件 */
function fnDownloadChunk() {
  const filePath = state.downloadFilePath;
  if (!filePath) {
    ElMessage({
      message: '下载资源地址为空',
      type: 'warning',
      duration: 3000,
    });
    return;
  }
  downloadFileChunk(filePath, 5).then(blob => {
    console.log(blob);
    if (blob instanceof Blob) {
      ElMessage({
        message: '已完成下载',
        type: 'success',
        duration: 3000,
      });
      const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
      saveAs(blob, fileName);
    } else {
      ElMessage({
        message: blob.msg,

        type: 'error',
        duration: 3000,
      });
    }
  });
}

/**上传前检查或转换压缩 */
function fnBeforeUpload(file) {
  if (state.loading) return false;
  const isJpgOrPng = ['image/jpeg', 'image/png'].includes(file.type);
  if (!isJpgOrPng) {
    ElMessage({
      message: '只支持上传图片格式（jpg、png）',
      type: 'error',
      duration: 3000,
    });
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    ElMessage({
      message: '图片文件大小必须小于 2MB',
      type: 'error',
      duration: 3000,
    });
  }
  return isJpgOrPng && isLt2M;
}

/**上传文件 */
function fnUpload(up) {
  ElMessageBox.confirm(`确认要上传文件吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 发送请求
      state.loading = true;
      let formData = new FormData();
      formData.append('file', up.file);
      formData.append('subPath', 'default');
      uploadFile(formData).then(res => {
        if (res.data) {
          ElMessage({
            message: '文件上传成功！',
            type: 'success',
            duration: 3000,
          });
          state.uploadFilePath = res.data.url;
          state.downloadFilePath = res.data.filePath;
        } else {
          ElMessage({
            message: res.msg,
            type: 'error',
            duration: 3000,
          });
        }
      });
    })
    .finally(() => {
      state.loading = false;
    });
}

/**上传分片 */
function fnUploadChunk(up) {
  const fileData = up.file;
  const item = state.fileList.find(f => f.name === fileData.name);
  ElMessageBox.confirm(`确认要进行分片上传文件吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 发送请求
      state.loading = true;
      uploadFileChunk(fileData, 4, 'default')
        .then(res => {
          if (res.data) {
            ElMessage({
              message: '文件上传成功！',
              type: 'success',
              duration: 3000,
            });
            if (item) {
              item.url = res.data.url;
              item.name = res.data.newFileName;
              item.percentage = 100;
              item.status = 'success';
              state.downloadFilePath = res.data.filePath;
            }
          } else {
            ElMessage({
              message: res.msg,
              type: 'error',
              duration: 3000,
            });
            state.fileList.splice(state.fileList.length - 1, 1);
          }
        })
        .finally(() => {
          state.loading = false;
        });
    })
    .catch(() => {
      if (item) {
        state.fileList.splice(state.fileList.length - 1, 1);
      }
    });
}
</script>

<template>
  <div class="app-container">
    <el-row :gutter="16">
      <el-col :span="12">
        <el-card title="小文件普通上传" style="margin-bottom: 16px">
          <el-space direction="vertical" :size="16">
            <el-upload
              name="file"
              list-type="picture"
              :limit="1"
              :show-file-list="false"
              :before-upload="fnBeforeUpload"
              :http-request="fnUpload"
              :disabled="state.loading"
            >
              <el-button type="default" :loading="state.loading">
                选择文件
              </el-button>
            </el-upload>
            <el-image
              style="width: 128px; height: 128px"
              :src="state.uploadFilePath"
            />
          </el-space>
        </el-card>
        <el-card title="大文件分片上传">
          <el-upload
            v-model:file-list="state.fileList"
            name="file"
            list-type="text"
            :http-request="fnUploadChunk"
            :disabled="state.loading"
          >
            <el-button :loading="state.loading"> 选择文件 </el-button>
          </el-upload>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card title="文件下载" style="margin-bottom: 16px">
          <el-row :gutter="8">
            <el-col :span="24" style="margin-bottom: 16px">
              <el-input
                style="margin-bottom: 16px"
                type="text"
                placeholder="输入资源地址，列如：/upload/default/2024/12/xxx.png"
                v-model="state.downloadFilePath"
              >
                <template #append>
                  <el-button type="primary" @click="fnDownload">
                    普通下载
                  </el-button>
                </template>
              </el-input>
              <el-input
                type="text"
                placeholder="输入资源地址，列如：/upload/default/2024/12/xxx.png"
                v-model="state.downloadFilePath"
              >
                <template #append>
                  <el-button type="primary" @click="fnDownloadChunk">
                    分片下载
                  </el-button>
                </template>
              </el-input>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="less" scoped></style>
