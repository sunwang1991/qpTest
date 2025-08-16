<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 固定导航栏 -->
    <nav class="fixed top-0 w-full bg-white/90 backdrop-blur-sm shadow-sm z-50">
      <div
        class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center space-x-4 align-center">
          <h1 class="text-xl font-bold text-gray-800">{{ userInfo.name }}</h1>
          <a
            href="https://github.com/sunwang1991"
            target="_blank"
            class="text-gray-600 hover:text-blue-600 transition-colors github">
            <svg
              t="1742263600390"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2599"
              width="20"
              height="20">
              <path
                d="M64 512c0 195.2 124.8 361.6 300.8 422.4 22.4 6.4 19.2-9.6 19.2-22.4v-76.8c-134.4 16-140.8-73.6-150.4-89.6-19.2-32-60.8-38.4-48-54.4 32-16 64 3.2 99.2 57.6 25.6 38.4 76.8 32 105.6 25.6 6.4-22.4 19.2-44.8 35.2-60.8-144-22.4-201.6-108.8-201.6-211.2 0-48 16-96 48-131.2-22.4-60.8 0-115.2 3.2-121.6 57.6-6.4 118.4 41.6 124.8 44.8 32-9.6 70.4-12.8 112-12.8 41.6 0 80 6.4 112 12.8 12.8-9.6 67.2-48 121.6-44.8 3.2 6.4 25.6 57.6 6.4 118.4 32 38.4 48 83.2 48 131.2 0 102.4-57.6 188.8-201.6 214.4 22.4 22.4 38.4 54.4 38.4 92.8v112c0 9.6 0 19.2 16 19.2C832 876.8 960 710.4 960 512c0-246.4-201.6-448-448-448S64 265.6 64 512z"
                fill="#040000"
                p-id="2600"></path>
            </svg>
          </a>
        </div>

        <div class="flex items-center space-x-8">
          <a
            v-for="item in navItems"
            :key="item.id"
            :class="{ 'text-blue-600': activeSection === item.id }"
            class="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
            @click="scrollToSection(item.id)">
            {{ item.name }}
          </a>
        </div>
      </div>
    </nav>
    <!-- Hero区域 -->
    <section id="hero" class="relative h-screen flex items-center">
      <div class="absolute inset-0">
        <img :src="heroImage" class="w-full h-full object-cover" alt="背景" />
        <div
          class="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-transparent"></div>
      </div>
      <div class="relative max-w-7xl mx-auto px-4 text-white">
        <h2 class="text-5xl font-bold mb-6">前端开发工程师</h2>
        <p class="text-xl mb-8 max-w-2xl">
          {{ userInfo.seniority }} 年前端开发经验 | 专注于构建高性能、可扩展的
          Web 应用
        </p>
        <button
          class="!rounded-button bg-blue-600 hover:bg-blue-700 px-8 py-3 text-white transition-colors"
          @click="scrollToSection('projects')">
          查看作品集
        </button>
      </div>
    </section>
    <!-- 技能区域 -->
    <section id="skills" class="py-20">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-16">专业技能</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="skill in skills"
            :key="skill.category"
            class="bg-white rounded-xl p-8 shadow-sm">
            <h3 class="text-xl font-semibold mb-6">{{ skill.category }}</h3>
            <div class="space-y-4">
              <div
                v-for="item in skill.items"
                :key="item.name"
                class="flex items-center">
                <el-icon class="text-blue-600 text-xl mr-3"
                  ><component :is="item.icon"
                /></el-icon>
                <div class="flex-1">
                  <div class="flex justify-between mb-1">
                    <span>{{ item.name }}</span>
                    <span class="text-gray-500">{{ item.level }}%</span>
                  </div>
                  <div class="h-2 bg-gray-200 rounded-full">
                    <div
                      class="h-full bg-blue-600 rounded-full transition-all duration-500"
                      :style="`width: ${item.level}%`"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- 项目经验 -->
    <section id="projects" class="py-20 bg-gray-100">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-16">项目经验</h2>
        <el-carousel :interval="4000" type="card" height="500px">
          <el-carousel-item v-for="project in projects" :key="project.title">
            <div
              class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img
                :src="project.image"
                class="w-full h-48 object-cover object-top"
                :alt="project.title" />
              <div class="p-6">
                <h3 class="text-xl font-semibold mb-2">{{ project.title }}</h3>
                <p class="text-gray-600 mb-4">{{ project.description }}</p>
                <div class="flex flex-wrap gap-2 mb-4">
                  <span
                    v-for="tech in project.technologies"
                    :key="tech"
                    class="px-3 py-1 bg-gray-100 text-sm rounded-full text-gray-600">
                    {{ tech }}
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-500">{{ project.duration }}</span>
                  <a
                    :href="project.link"
                    target="_blank"
                    class="!rounded-button text-blue-600 hover:text-blue-700">
                    查看详情
                  </a>
                </div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </section>
    <!-- 联系方式 -->
    <section id="contact" class="py-20">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-16">联系我</h2>
        <div class="flex justify-center space-x-8 mb-8">
          <a
            v-for="social in socials"
            :key="social.name"
            :href="social.link"
            target="_blank"
            class="text-gray-600 hover:text-blue-600 transition-colors">
            <el-icon class="text-3xl"><component :is="social.icon" /></el-icon>
          </a>
        </div>
        <div class="flex flex-col space-y-4">
          <a
            :href="`mailto:${userInfo.email}`"
            class="text-xl text-blue-600 hover:text-blue-700">
            {{ userInfo.email }}
          </a>
          <p class="text-xl text-gray-600">手机：+86 {{ userInfo.phone }}</p>
          <p class="text-xl text-gray-600">微信：{{ userInfo.wechatNumber }}</p>
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts" setup>
import { userInfoApi } from "~/utils/api";

const activeSection = ref("hero");
const heroImage =
  "https://ai-public.mastergo.com/ai/img_res/74f373ce487be61038c70931f01e32b3.jpg";
const navItems = [
  { id: "hero", name: "首页" },
  { id: "skills", name: "技能" },
  { id: "projects", name: "项目" },
  { id: "contact", name: "联系" },
];
const skills = [
  {
    category: "前端框架",
    items: [
      { name: "Vue.js", level: 95, icon: "Platform" },
      { name: "React", level: 90, icon: "Platform" },
      { name: "Angular", level: 85, icon: "Platform" },
    ],
  },
  {
    category: "编程语言",
    items: [
      { name: "TypeScript", level: 95, icon: "Connection" },
      { name: "JavaScript", level: 95, icon: "Connection" },
      { name: "Node.js", level: 85, icon: "Connection" },
    ],
  },
  {
    category: "开发工具",
    items: [
      { name: "Git", level: 90, icon: "Tools" },
      { name: "Webpack", level: 85, icon: "Tools" },
      { name: "Docker", level: 80, icon: "Tools" },
    ],
  },
];

const socials = [
  { name: "GitHub", icon: "Platform", link: "https://github.com" },
  { name: "LinkedIn", link: "https://linkedin.com", icon: "Share" },
  { name: "Email", icon: "Message", link: "mailto:chensiyuan@example.com" },
];
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};
onMounted(() => {
  fetchUserInfo();
  fetchProjects();

  // 监听滚动事件
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id;
        }
      });
    },
    { threshold: 0.5 }
  );
  navItems.forEach((item) => {
    const element = document.getElementById(item.id);
    if (element) {
      observer.observe(element);
    }
  });
});

// 用户信息
const userInfo = ref({
  name: "",
  age: null,
  sex: "男",
  phone: "",
  email: "",
  seniority: "",
  wechatNumber: "",
});

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const { data } = await userInfoApi.getUserInfo();
    if (data) {
      userInfo.value = data;
    }
  } catch (error) {
    console.error("获取用户信息失败:", error);
  }
};

// 项目列表
const projects = ref([
  {
    name: "",
    description: "",
    link: "",
    image: "",
    technologies: [],
    duration: "",
    title: "",
  },
]);

// 获取项目列表
const fetchProjects = async () => {
  try {
    const res = await fetch("/api/blog/projects");
    const { data } = await res.json();
    projects.value = data;
  } catch (error) {
    ElMessage.error("获取项目列表失败");
  }
};
</script>
<style scoped>
.resume-section {
  scroll-margin-top: 4rem;
}
</style>
