<!--
  登录页面组件
  提供用户登录功能，包括用户名密码输入、验证码验证、记住密码等功能
-->
<template>
  <div class="login">
    <!-- 登录表单容器 -->
    <el-form
      ref="loginRef"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
    >
      <!-- 应用标题 -->
      <h3 class="title">{{ defaultSettings.title }}</h3>

      <!-- 用户名输入框 -->
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          type="text"
          size="large"
          auto-complete="off"
          placeholder="账号"
        >
          <template #prefix>
            <svg-icon icon-class="user" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>

      <!-- 密码输入框 -->
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          size="large"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter="handleLogin"
        >
          <template #prefix>
            <svg-icon icon-class="password" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>

      <!-- 验证码输入框（仅在启用验证码时显示） -->
      <el-form-item prop="code" v-if="captchaEnabled">
        <el-input
          v-model="loginForm.code"
          size="large"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter="handleLogin"
        >
          <template #prefix>
            <svg-icon
              icon-class="validCode"
              class="el-input__icon input-icon"
            />
          </template>
        </el-input>
        <!-- 验证码图片，点击可刷新 -->
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img" />
        </div>
      </el-form-item>

      <!-- 记住密码复选框 -->
      <el-checkbox
        v-model="loginForm.rememberMe"
        style="margin: 0px 0px 25px 0px"
        >记住密码</el-checkbox
      >

      <!-- 登录按钮和注册链接 -->
      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          size="large"
          type="primary"
          style="width: 100%"
          @click.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <!-- 注册链接（仅在启用注册时显示） -->
        <div style="float: right" v-if="register">
          <router-link class="link-type" :to="'/register'"
            >立即注册</router-link
          >
        </div>
      </el-form-item>
    </el-form>

    <!-- 页面底部版权信息 -->
    <div class="el-login-footer">
      <span>Copyright © 2023 TsMask All Rights Reserved.</span>
    </div>
  </div>
</template>

<script setup>
/**
 * 登录页面组件脚本
 * 使用 Vue 3 Composition API 和 setup 语法糖
 */

// 导入依赖模块
import { getCodeImg } from '@/api/auth'; // 获取验证码图片的API
import Cookies from 'js-cookie'; // Cookie操作库
import { encrypt, decrypt } from '@/utils/jsencrypt'; // 密码加密解密工具
import useUserStore from '@/store/modules/user'; // 用户状态管理
import defaultSettings from '@/settings'; // 默认设置配置

// 初始化状态管理和路由
const userStore = useUserStore(); // 用户状态存储实例
const router = useRouter(); // Vue Router实例
const { proxy } = getCurrentInstance(); // 当前组件实例代理

/**
 * 登录表单数据对象
 * @type {Object}
 * @property {string} username - 用户名
 * @property {string} password - 密码
 * @property {boolean} rememberMe - 是否记住密码
 * @property {string} code - 验证码
 * @property {string} uuid - 验证码唯一标识
 */
const loginForm = ref({
  username: '',
  password: '',
  rememberMe: false,
  code: '',
  uuid: '',
});

/**
 * 表单验证规则配置
 * 定义用户名、密码、验证码的验证规则
 */
const loginRules = {
  username: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
  password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
  code: [{ required: true, trigger: 'change', message: '请输入验证码' }],
};

// 响应式状态变量
const codeUrl = ref(''); // 验证码图片URL
const loading = ref(false); // 登录按钮加载状态
const captchaEnabled = ref(true); // 验证码功能开关
const register = ref(true); // 注册功能开关
const redirect = ref(undefined); // 登录成功后重定向路径

/**
 * 处理用户登录逻辑
 * 1. 验证表单数据
 * 2. 处理记住密码功能（Cookie存储）
 * 3. 调用登录API
 * 4. 处理登录成功后的跳转
 * 5. 刷新验证码
 */
function handleLogin() {
  // 验证表单数据
  proxy.$refs.loginRef.validate(valid => {
    if (valid) {
      loading.value = true; // 开启加载状态

      // 处理记住密码功能
      if (loginForm.value.rememberMe) {
        // 勾选了记住密码，将用户信息保存到Cookie（30天有效期）
        Cookies.set('username', loginForm.value.username, { expires: 30 });
        Cookies.set('password', encrypt(loginForm.value.password), {
          expires: 30,
        });
        Cookies.set('rememberMe', loginForm.value.rememberMe, { expires: 30 });
      } else {
        // 未勾选记住密码，清除相关Cookie
        Cookies.remove('username');
        Cookies.remove('password');
        Cookies.remove('rememberMe');
      }

      // 调用用户状态管理中的登录方法
      userStore
        .login(loginForm.value)
        .then(() => {
          // 登录成功，跳转到指定页面或首页
          router.push({ path: redirect.value || '/' });
        })
        .finally(() => {
          loading.value = false; // 关闭加载状态
          // 重新获取验证码（无论登录成功或失败）
          if (captchaEnabled.value) {
            getCode();
          }
        });
    }
  });
}

function getCode() {
  getCodeImg().then(res => {
    captchaEnabled.value = Boolean(res.data.enabled);
    if (captchaEnabled.value) {
      const img = res.data.img;
      if (img.startsWith('data:image')) {
        codeUrl.value = img;
      } else {
        codeUrl.value = 'data:image/gif;base64,' + img;
      }
      loginForm.value.uuid = res.data.uuid;
      if (res.data?.text) {
        loginForm.value.code = res.data.text;
      }
    }
  });
}

function getCookie() {
  const username = Cookies.get('username');
  const password = Cookies.get('password');
  const rememberMe = Cookies.get('rememberMe');
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    password:
      password === undefined ? loginForm.value.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
  };
}

getCode();
getCookie();
loginForm.value.username = 'system';
loginForm.value.password = 'Abcd@1234..';
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url('../assets/images/login-background.png');
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 40px;
    input {
      height: 40px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 40px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 40px;
  padding-left: 12px;
}
</style>
