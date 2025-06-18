<template>
  <div class="app-container">
    <el-card :header="app.appName">
      <p>
        选择 RuoYi 生态中 RuoYi-Vue3 前端项目进行改造后台管理系统， 对接基于
        Mask-API 后端接口服务。
      </p>

      <p>
        <el-tag type="info"> 当前版本：{{ app.appVersion }} </el-tag>
        &nbsp;&nbsp;
        <el-tag type="danger">&yen;免费开源</el-tag>
      </p>
      <p>
        <el-button
          type="primary"
          icon="HomeFilled"
          plain
          @click="goTarget('code')"
        >
          开源仓库
        </el-button>
        <el-button icon="Comment" plain @click="goTarget('issues')">
          提些建议
        </el-button>
      </p>
    </el-card>
    <el-divider />
    <el-row :gutter="20">
      <el-col :lg="16" :md="16" :xs="24" style="margin-bottom: 16px">
        <el-card header="项目简介">
          <p>
            <strong>Vue3</strong>
            技术组合，支持按钮及数据权限，可自定义部门数据权限。
          </p>
          <p>
            内置模块如：部门管理、角色用户、菜单及按钮授权、数据权限、系统参数、日志管理等，支持在线定时任务配置。
          </p>
          <p>
            使用
            <strong>Element-Plus</strong>
            组件库，搭建的前后端分离极速后台管理系统。
          </p>
        </el-card>
      </el-col>
      <el-col :lg="8" :md="8" :xs="24">
        <el-card header="快速开始" style="margin-bottom: 16px">
          <el-row :gutter="16">
            <el-col :lg="6" :md="12" :xs="24">
              <el-link
                type="primary"
                title="开发手册"
                href="https://juejin.cn/column/7188761626017792056"
                target="_blank"
              >
                开发手册
              </el-link>
            </el-col>
            <el-col :lg="6" :md="12" :xs="24">
              <el-link
                type="primary"
                title="来自Apifox的接口文档"
                href="https://mask-api-midwayjs.apifox.cn/"
                target="_blank"
              >
                接口文档
              </el-link>
            </el-col>
            <el-col :lg="6" :md="12" :xs="24">
              <el-link
                type="primary"
                title="Middwayjs版本服务端"
                href="https://gitee.com/TsMask/mask_api_midwayjs"
                target="_blank"
              >
                Node后端
              </el-link>
            </el-col>
            <el-col :lg="6" :md="12" :xs="24">
              <el-link
                type="primary"
                title="Gin版本服务端"
                href="https://gitee.com/TsMask/mask_api_gin"
                target="_blank"
              >
                Go后端
              </el-link>
            </el-col>
            <el-col :lg="6" :md="12" :xs="24">
              <el-link type="info">相关待定</el-link>
            </el-col>
          </el-row>
        </el-card>
        <el-card header="捐赠鼓励">
          <el-image
            :src="donate"
            :preview-src-list="[donate]"
            :zoom-rate="1.2"
            :initial-index="4"
            fit="cover"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import useAppStore from '@/store/modules/app';
import donate from '@/assets/donate.jpg';
const app = useAppStore();

function goTarget(type) {
  let url = '';
  if (type === 'code') {
    url = 'https://gitee.com/TsMask/';
  }
  if (type === 'issues') {
    url = 'https://gitee.com/TsMask/mask_vue3_element/issues';
  }
  window.open(url, '__blank');
}
</script>

<style scoped lang="scss"></style>
