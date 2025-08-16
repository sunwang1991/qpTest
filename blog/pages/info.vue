<template>
  <div class="max-w-2xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">用户信息设置</h1>

    <!-- 信息表单 -->
    <form @submit.prevent="saveUserInfo" class="space-y-4">
      <!-- 姓名 -->
      <div class="form-group">
        <label for="name" class="block text-sm font-medium text-gray-700"
          >姓名</label
        >
        <input
          type="text"
          id="name"
          v-model="userInfo.name"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required />
      </div>

      <!-- 年龄 -->
      <div class="form-group">
        <label for="age" class="block text-sm font-medium text-gray-700"
          >年龄</label
        >
        <input
          type="number"
          id="age"
          v-model="userInfo.age"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required />
      </div>

      <!-- 性别 -->
      <div class="form-group">
        <label for="sex" class="block text-sm font-medium text-gray-700"
          >性别</label
        >
        <select
          id="sex"
          v-model="userInfo.sex"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required>
          <option value="男">男</option>
          <option value="女">女</option>
        </select>
      </div>

      <!-- 手机号码 -->
      <div class="form-group">
        <label for="phone" class="block text-sm font-medium text-gray-700"
          >手机号码</label
        >
        <input
          type="tel"
          id="phone"
          v-model="userInfo.phone"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required />
      </div>

      <!-- 邮箱 -->
      <div class="form-group">
        <label for="email" class="block text-sm font-medium text-gray-700"
          >邮箱</label
        >
        <input
          type="email"
          id="email"
          v-model="userInfo.email"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required />
      </div>

      <!-- 工作年限 -->
      <div class="form-group">
        <label for="seniority" class="block text-sm font-medium text-gray-700"
          >工作年限</label
        >
        <input
          type="text"
          id="seniority"
          v-model="userInfo.seniority"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required />
      </div>

      <!-- 微信号 -->
      <div class="form-group">
        <label
          for="wechatNumber"
          class="block text-sm font-medium text-gray-700"
          >微信号</label
        >
        <input
          type="text"
          id="wechatNumber"
          v-model="userInfo.wechatNumber"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required />
      </div>

      <!-- 提交按钮 -->
      <div class="flex justify-end mt-6">
        <button
          type="submit"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          保存信息
        </button>
      </div>
    </form>

    <!-- 提示消息 -->
    <div v-if="message" :class="['mt-4 p-4 rounded-md', messageClass]">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { userInfoApi } from "~/utils/api";

const userInfo = ref({
  name: "",
  age: null,
  sex: "男",
  phone: "",
  email: "",
  seniority: "",
  wechatNumber: "",
});

const message = ref("");
const messageClass = ref("");

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const { data } = await userInfoApi.getUserInfo();
    if (data) {
      userInfo.value = data;
    }
  } catch (error) {
    console.error("获取用户信息失败:", error);
    message.value = error.message;
    messageClass.value = "bg-red-100 text-red-700";
  }
};

// 保存用户信息
const saveUserInfo = async () => {
  try {
    const { data } = await userInfoApi.saveUserInfo(userInfo.value);
    message.value = "信息保存成功！";
    messageClass.value = "bg-green-100 text-green-700";
  } catch (error) {
    message.value = error.message || "保存失败，请稍后重试";
    messageClass.value = "bg-red-100 text-red-700";
    console.error("保存用户信息失败:", error);
  }
};

// 页面加载时获取用户信息
onMounted(() => {
  fetchUserInfo();
});
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}

input[type="text"],
input[type="number"],
input[type="tel"],
input[type="email"],
select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
}

input:focus,
select:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}
</style>
