<template>
  <div class="register">
    <el-form
      ref="registerRef"
      :model="registerForm"
      :rules="registerRules"
      class="register-form"
    >
      <h3 class="title">{{ app.appName }}</h3>
      <el-form-item prop="username">
        <el-input
          v-model="registerForm.username"
          type="text"
          size="large"
          auto-complete="off"
          placeholder="账号"
        >
          <template #prefix
            ><svg-icon icon-class="user" class="el-input__icon input-icon"
          /></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="registerForm.password"
          type="password"
          size="large"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter="handleRegister"
        >
          <template #prefix
            ><svg-icon icon-class="password" class="el-input__icon input-icon"
          /></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input
          v-model="registerForm.confirmPassword"
          type="password"
          size="large"
          auto-complete="off"
          placeholder="确认密码"
          @keyup.enter="handleRegister"
        >
          <template #prefix
            ><svg-icon icon-class="password" class="el-input__icon input-icon"
          /></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="code" v-if="captchaEnabled">
        <el-input
          size="large"
          v-model="registerForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter="handleRegister"
        >
          <template #prefix
            ><svg-icon icon-class="validCode" class="el-input__icon input-icon"
          /></template>
        </el-input>
        <div class="register-code">
          <img :src="codeUrl" @click="getCode" class="register-code-img" />
        </div>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          size="large"
          type="primary"
          style="width: 100%"
          @click.prevent="handleRegister"
        >
          <span v-if="!loading">注 册</span>
          <span v-else>注 册 中...</span>
        </el-button>
        <div style="float: right">
          <router-link class="link-type" :to="'/login'">
            使用已有账户登录
          </router-link>
        </div>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-register-footer">
      <span>Copyright © 2023 TsMask All Rights Reserved.</span>
    </div>
  </div>
</template>

<script setup>
import { ElMessageBox } from 'element-plus';
import { getCodeImg, register } from '@/api/auth';
import { regExpUserName, regExpPasswd } from '@/utils/validate';
import useAppStore from '@/store/modules/app';
const app = useAppStore();
const router = useRouter();
const { proxy } = getCurrentInstance();

const registerForm = ref({
  username: '',
  password: '',
  confirmPassword: '',
  code: '',
  uuid: '',
});

const equalToPassword = (rule, value, callback) => {
  if (registerForm.value.password !== value) {
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback();
  }
};

const registerRules = {
  username: [
    { required: true, trigger: 'blur', message: '请输入您的账号' },
    {
      pattern: regExpUserName,
      message: '账号只能包含大写小写字母，数字，且不少于4位',
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, trigger: 'blur', message: '请输入您的密码' },
    {
      pattern: regExpPasswd,
      message: '密码至少包含大小写字母、数字、特殊符号，且不少于6位',
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    { required: true, trigger: 'blur', message: '请再次输入您的密码' },
    { required: true, validator: equalToPassword, trigger: 'blur' },
  ],
  code: [{ required: true, trigger: 'change', message: '请输入验证码' }],
};

const codeUrl = ref('');
const loading = ref(false);
const captchaEnabled = ref(false);

function handleRegister() {
  proxy.$refs.registerRef.validate(valid => {
    if (valid) {
      loading.value = true;
      register(registerForm.value)
        .then(res => {
          const username = registerForm.value.username;
          ElMessageBox.alert(
            "<font color='#67c23a'>恭喜你，您的账号 " +
              username +
              ' 注册成功！</font>',
            '系统提示',
            {
              dangerouslyUseHTMLString: true,
              type: 'success',
            }
          )
            .then(() => {
              router.push('/login');
            })
            .catch(() => {});
        })
        .finally(() => {
          loading.value = false;
          if (captchaEnabled) {
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
      registerForm.value.uuid = res.data.uuid;
      if (res.data?.text) {
        registerForm.value.code = res.data.text;
      }
    }
  });
}

getCode();
</script>

<style lang="scss" scoped>
.register {
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

.register-form {
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
.register-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.register-code {
  width: 33%;
  height: 40px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-register-footer {
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
.register-code-img {
  height: 40px;
  padding-left: 12px;
}
</style>
