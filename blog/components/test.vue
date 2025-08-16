<template>
  <div>
    <h1>用户列表</h1>

    <!-- 用户表单 -->
    <form @submit.prevent="submitUser">
      <input v-model="newUser.name" placeholder="姓名" required />
      <input v-model="newUser.email" placeholder="邮箱" required />
      <button type="submit">{{ editingId ? "更新" : "添加" }}用户</button>
      <button v-if="editingId" type="button" @click="cancelEdit">取消</button>
    </form>

    <!-- 用户列表 -->
    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.name }} ({{ user.email }})
        <button @click="editUser(user)">编辑</button>
        <button @click="deleteUser(user.id)">删除</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
const users = ref([]);
const newUser = ref({ name: "", email: "" });
const editingId = ref(null);

// 获取所有用户
async function fetchUsers() {
  try {
    const { data } = await useFetch("/api/users");
    users.value = data.value.users;
  } catch (error) {
    console.error("获取用户失败:", error);
    alert("获取用户失败");
  }
}

// 添加或更新用户
async function submitUser() {
  try {
    if (editingId.value) {
      // 更新用户
      await $fetch(`/api/users/${editingId.value}`, {
        method: "PUT",
        body: newUser.value,
      });
    } else {
      // 添加新用户
      await $fetch("/api/users", {
        method: "POST",
        body: newUser.value,
      });
    }

    // 重置表单并刷新用户列表
    newUser.value = { name: "", email: "" };
    editingId.value = null;
    await fetchUsers();
  } catch (error) {
    console.error("保存用户失败:", error);
    alert("保存用户失败");
  }
}

// 编辑用户
function editUser(user) {
  newUser.value = { name: user.name, email: user.email };
  editingId.value = user.id;
}

// 取消编辑
function cancelEdit() {
  newUser.value = { name: "", email: "" };
  editingId.value = null;
}

// 删除用户
async function deleteUser(id) {
  if (!confirm("确定要删除此用户吗？")) return;

  try {
    await $fetch(`/api/users/${id}`, {
      method: "DELETE",
    });
    await fetchUsers();
  } catch (error) {
    console.error("删除用户失败:", error);
    alert("删除用户失败");
  }
}

// 页面加载时获取用户列表
onMounted(() => {
  fetchUsers();
});
</script>
