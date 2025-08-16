<template>
  <div class="p-4">
    <el-card class="mb-4">
      <template #header>
        <div class="flex justify-between items-center">
          <span>项目经验管理</span>
          <el-button type="primary" @click="dialogVisible = true">
            新增项目
          </el-button>
        </div>
      </template>

      <!-- 项目列表 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <el-card v-for="project in projectList" :key="project.id" class="mb-4">
          <template #header>
            <div class="flex justify-between items-center">
              <span>{{ project.title }}</span>
              <el-button
                type="danger"
                size="small"
                @click="handleDelete(project.id)">
                删除
              </el-button>
            </div>
          </template>

          <img :src="project.image" class="w-full h-48 object-cover mb-4" />
          <p class="text-gray-600 mb-2">{{ project.description }}</p>
          <p class="text-gray-500 mb-2">{{ project.duration }}</p>
          <div class="flex flex-wrap gap-2 mb-2">
            <el-tag v-for="tech in project.technologies" :key="tech">
              {{ tech }}
            </el-tag>
          </div>
          <a :href="project.link" target="_blank" class="text-blue-500"
            >项目链接</a
          >
        </el-card>
      </div>
    </el-card>

    <!-- 新增对话框 -->
    <el-dialog v-model="dialogVisible" title="新增项目" width="50%">
      <el-form :model="form" label-width="120px">
        <el-form-item label="项目标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="项目描述">
          <el-input v-model="form.description" type="textarea" />
        </el-form-item>
        <el-form-item label="技术栈">
          <el-select
            v-model="form.technologies"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择或输入技术栈">
            <el-option
              v-for="tech in techOptions"
              :key="tech"
              :label="tech"
              :value="tech" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目周期">
          <el-input
            v-model="form.duration"
            placeholder="例：2022.03 - 2023.06" />
        </el-form-item>
        <el-form-item label="项目链接">
          <el-input v-model="form.link" />
        </el-form-item>
        <el-form-item label="项目图片">
          <el-input v-model="form.image" placeholder="请输入图片URL" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

// 明确 ref 的类型
const projectList = ref<
  {
    id: number;
    title: string;
    description: string;
    duration: string;
    technologies: string[];
    link: string;
    image: string;
  }[]
>([]);
const dialogVisible = ref(false);
const techOptions = [
  "Vue.js",
  "TypeScript",
  "Element Plus",
  "React",
  "Node.js",
];
const form = ref<{
  title: string;
  description: string;
  technologies: string[];
  duration: string;
  link: string;
  image: string;
}>({
  title: "",
  description: "",
  technologies: [],
  duration: "",
  link: "",
  image: "",
});

// 获取项目列表
const fetchProjects = async () => {
  try {
    const res = await fetch("/api/blog/projects");
    const { data } = await res.json();
    projectList.value = data;
  } catch (error) {
    ElMessage.error("获取项目列表失败");
  }
};

// 提交表单
const handleSubmit = async () => {
  try {
    const res = await fetch("/api/blog/projects", {
      method: "POST",
      body: JSON.stringify(form.value),
    });
    const { code, message } = await res.json();
    if (code === 200) {
      ElMessage.success("添加成功");
      dialogVisible.value = false;
      fetchProjects();
      form.value = {
        title: "",
        description: "",
        technologies: [],
        duration: "",
        link: "",
        image: "",
      };
    } else {
      ElMessage.error(message);
    }
  } catch (error) {
    ElMessage.error("添加失败");
  }
};

// 删除项目
const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm("确认删除该项目？", "提示", {
      type: "warning",
    });
    const res = await fetch(`/api/blog/projects?id=${id}`, {
      method: "DELETE",
    });
    const { code } = await res.json();
    if (code === 200) {
      ElMessage.success("删除成功");
      fetchProjects();
    }
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除失败");
    }
  }
};

// 初始化获取数据
onMounted(() => {
  fetchProjects();
});
</script>
