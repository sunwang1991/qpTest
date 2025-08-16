<template>
  <div>
    <h1>创建新文章</h1>
    <form @submit.prevent="createArticle">
      <div>
        <label for="title">标题:</label>
        <input type="text" v-model="title" required />
      </div>
      <div>
        <label for="content">内容:</label>
        <textarea v-model="content" required></textarea>
      </div>
      <button type="submit">提交</button>
    </form>
    <div v-if="message">{{ message }}</div>
  </div>
</template>

<script setup>
const title = ref("");
const content = ref("");
const message = ref("");

const createArticle = async () => {
  try {
    const response = await fetch("/api/blog/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title.value,
        content: content.value,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      message.value = "文章创建成功！";
      title.value = "";
      content.value = "";
    } else {
      message.value = "创建文章失败！";
    }
  } catch (error) {
    console.error("Error:", error);
    message.value = "创建文章时发生错误！";
  }
};
</script>

<style scoped>
/* 添加一些样式以美化页面 */
form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: auto;
}

label {
  margin: 10px 0 5px;
}

input,
textarea {
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
