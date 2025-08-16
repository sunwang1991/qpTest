<template>
  <nav class="navbar">
    <div class="container">
      <div class="nav-content">
        <div class="nav-brand">
          <h2>孙旺</h2>
          <span class="nav-subtitle">前端开发工程师</span>
        </div>
        
        <el-menu
          :default-active="activeIndex"
          class="nav-menu"
          mode="horizontal"
          @select="handleSelect"
          :ellipsis="false"
        >
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

        <!-- 移动端菜单按钮 -->
        <el-button
          class="mobile-menu-btn"
          type="text"
          @click="mobileMenuVisible = true"
        >
          <el-icon size="24"><Menu /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 移动端抽屉菜单 -->
    <el-drawer
      v-model="mobileMenuVisible"
      title="导航菜单"
      direction="rtl"
      size="280px"
    >
      <el-menu
        :default-active="activeIndex"
        class="mobile-menu"
        @select="handleMobileSelect"
      >
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
import { ref } from 'vue'

const activeIndex = ref('home')
const mobileMenuVisible = ref(false)

const handleSelect = (key: string) => {
  activeIndex.value = key
}

const handleMobileSelect = (key: string) => {
  activeIndex.value = key
  mobileMenuVisible.value = false
}

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
  mobileMenuVisible.value = false
}
</script>

<style scoped>
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
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
}

.nav-brand h2 {
  color: #409eff;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.nav-subtitle {
  color: #909399;
  font-size: 0.9rem;
  margin-left: 8px;
}

.nav-menu {
  border-bottom: none;
  background: transparent;
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
  
  .nav-brand h2 {
    font-size: 1.3rem;
  }
  
  .nav-subtitle {
    font-size: 0.8rem;
  }
}
</style>

