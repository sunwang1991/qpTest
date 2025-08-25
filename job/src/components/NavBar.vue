<template>
  <nav class="navbar">
    <div class="container">
      <div class="nav-content">
        <div class="nav-brand">
          <h2>孙旺</h2>
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

        <el-menu
          :default-active="activeIndex"
          class="nav-menu"
          mode="horizontal"
          @select="handleSelect"
          :ellipsis="false">
          <el-menu-item index="home" @click="scrollToSection('hero')">
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="about" @click="scrollToSection('about')">
            <span>关于我</span>
          </el-menu-item>
          <el-menu-item index="skills" @click="scrollToSection('skills')">
            <span>技能</span>
          </el-menu-item>
          <el-menu-item index="projects" @click="scrollToSection('projects')">
            <span>项目</span>
          </el-menu-item>
          <el-menu-item
            index="experience"
            @click="scrollToSection('experience')">
            <span>经历</span>
          </el-menu-item>
          <el-menu-item index="contact" @click="scrollToSection('contact')">
            <span>联系</span>
          </el-menu-item>
        </el-menu>

        <!-- 移动端菜单按钮 -->
        <el-button
          class="mobile-menu-btn"
          type="text"
          @click="mobileMenuVisible = true">
          <el-icon size="24"><Menu /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 移动端抽屉菜单 -->
    <el-drawer
      v-model="mobileMenuVisible"
      title="导航菜单"
      direction="rtl"
      size="280px">
      <el-menu
        :default-active="activeIndex"
        class="mobile-menu"
        @select="handleMobileSelect">
        <el-menu-item index="home" @click="scrollToSection('hero')">
          <el-icon><House /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="about" @click="scrollToSection('about')">
          <el-icon><User /></el-icon>
          <span>关于我</span>
        </el-menu-item>
        <el-menu-item index="skills" @click="scrollToSection('skills')">
          <el-icon><Star /></el-icon>
          <span>技能</span>
        </el-menu-item>
        <el-menu-item index="projects" @click="scrollToSection('projects')">
          <el-icon><Folder /></el-icon>
          <span>项目</span>
        </el-menu-item>
        <el-menu-item index="experience" @click="scrollToSection('experience')">
          <el-icon><Briefcase /></el-icon>
          <span>经历</span>
        </el-menu-item>
        <el-menu-item index="contact" @click="scrollToSection('contact')">
          <el-icon><Message /></el-icon>
          <span>联系</span>
        </el-menu-item>
      </el-menu>
    </el-drawer>
  </nav>
</template>

<script setup lang="ts">
import { ref } from "vue";

const activeIndex = ref("home");
const mobileMenuVisible = ref(false);

const handleSelect = (key: string) => {
  activeIndex.value = key;
};

const handleMobileSelect = (key: string) => {
  activeIndex.value = key;
  mobileMenuVisible.value = false;
};

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
  mobileMenuVisible.value = false;
};
</script>

<style scoped lang="scss">
.navbar {
  background: #f3f3f4;
  border-bottom: 1px solid #e4e7ed;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all 0.3s ease;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  .nav-menu {
    background: rgba(0, 0, 0, 0);
  }
}

.nav-brand {
  display: flex;
  align-items: center;
  h2 {
    font-size: 16px;
    margin: 0;
  }
  a {
    display: inline-block;
    width: 24px;
    height: 24px;
    margin-left: 10px;
    svg {
      width: 100%;
      height: 100%;
    }
  }
}

.nav-menu {
  border-bottom: none;
}

.nav-menu .el-menu-item {
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.nav-menu .el-menu-item:hover,
.nav-menu .el-menu-item.is-active {
  border-bottom-color: #409eff;
  background: transparent;
}

.mobile-menu-btn {
  display: none;
}

.mobile-menu {
  border-right: none;
}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }

  .mobile-menu-btn {
    display: block;
  }
}
</style>
