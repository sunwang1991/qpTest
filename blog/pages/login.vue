<!-- 登录页面 -->
<template>
  <div>
    <button @click="wxLogin">微信授权登录</button>
  </div>
</template>

<script setup lang="ts">
const wxLogin = async () => {
  try {
    // const { code } = await useLogin();
  } catch (error) {
    console.error("微信登录失败:", error);
  }
};
</script>

<style scoped>
/* 添加一些样式以美化页面 */
ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 20px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

h2 {
  margin: 0;
}

small {
  color: #666;
}
</style>
