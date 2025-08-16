<template>
  <div>
    <h1>文章列表</h1>
    <ul>
      <li v-for="article in articles" :key="article.id">
        <h2>{{ article.title }}</h2>
        <p>{{ article.content }}</p>
        <small
          >创建于: {{ new Date(article.createdAt).toLocaleString() }}</small
        >
      </li>
    </ul>
    <div v-if="!articles.length">没有找到文章。</div>
  </div>
</template>

<script setup>
const articles = ref([]);

const fetchArticles = async () => {
  try {
    const response = await fetch("/api/blog/articles");
    if (response.ok) {
      articles.value = await response.json();
    } else {
      console.error("获取文章失败");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

onMounted(() => {
  fetchArticles();
});
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
