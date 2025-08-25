<template>
  <div class="home">
    <!-- Hero Section -->
    <section id="hero" class="hero-section">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <div class="hero-title">前端开发工程师</div>
            <p class="hero-description">
              8年前端开发经验|专注于构建高性能、可扩展的 Web 应用
            </p>

            <div class="hero-actions">
              <button @click="scrollToSection('projects')">查看项目</button>
              <button @click="scrollToSection('contact')">联系我</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="section about-section">
      <div class="container">
        <h2 class="section-title">关于我</h2>
        <p class="section-subtitle">
          专业的前端开发工程师，致力于创造优秀的用户体验
        </p>

        <div class="about-content">
          <div class="about-info">
            <div class="info-card">
              <el-icon size="40" color="#409eff"><Trophy /></el-icon>
              <h3>8年经验</h3>
              <p>丰富的前端开发经验</p>
            </div>
            <div class="info-card">
              <el-icon size="40" color="#67c23a"><Cpu /></el-icon>
              <h3>技术专家</h3>
              <p>精通Vue、React等主流框架</p>
            </div>
            <div class="info-card">
              <el-icon size="40" color="#e6a23c"><Lightning /></el-icon>
              <h3>性能优化</h3>
              <p>专注于应用性能提升</p>
            </div>
            <div class="info-card">
              <el-icon size="40" color="#f56c6c"><Pear /></el-icon>
              <h3>项目交付</h3>
              <p>高质量的项目完成能力</p>
            </div>
          </div>

          <div class="about-details">
            <el-card class="detail-card">
              <h3>个人信息</h3>
              <div class="detail-item">
                <span class="label">姓名：</span>
                <span>孙旺</span>
              </div>
              <div class="detail-item">
                <span class="label">年龄：</span>
                <span>34岁</span>
              </div>
              <div class="detail-item">
                <span class="label">学历：</span>
                <span>本科 - 湖南工业大学</span>
              </div>
              <div class="detail-item">
                <span class="label">工作年限：</span>
                <span>8年</span>
              </div>
              <div class="detail-item">
                <span class="label">联系电话：</span>
                <span>19967171798</span>
              </div>
              <div class="detail-item">
                <span class="label">邮箱：</span>
                <span>741967556@qq.com</span>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section id="skills" class="section skills-section">
      <div class="container">
        <h2 class="section-title">专业技能</h2>
        <p class="section-subtitle">掌握现代前端开发的核心技术栈</p>

        <div class="skills-content">
          <div class="skill-category">
            <h3>前端框架</h3>
            <div class="skill-items">
              <div class="skill-item">
                <div class="skill-header">
                  <span>Vue.js (2/3)</span>
                </div>
                <el-progress :percentage="95" color="#4fc08d" />
              </div>
              <div class="skill-item">
                <div class="skill-header">
                  <span>React</span>
                </div>
                <el-progress :percentage="80" color="#61dafb" />
              </div>
              <div class="skill-item">
                <div class="skill-header">
                  <span>UniApp</span>
                </div>
                <el-progress :percentage="90" color="#2b9939" />
              </div>
            </div>
          </div>

          <div class="skill-category">
            <h3>构建工具</h3>
            <div class="skill-items">
              <div class="skill-item">
                <div class="skill-header">
                  <span>Vite</span>
                </div>
                <el-progress :percentage="90" color="#646cff" />
              </div>
              <div class="skill-item">
                <div class="skill-header">
                  <span>Webpack</span>
                </div>
                <el-progress :percentage="85" color="#8dd6f9" />
              </div>
              <div class="skill-item">
                <div class="skill-header">
                  <span>Node.js</span>
                </div>
                <el-progress :percentage="80" color="#68a063" />
              </div>
            </div>
          </div>

          <div class="skill-category">
            <h3>核心技术</h3>
            <div class="skill-items">
              <div class="skill-item">
                <div class="skill-header">
                  <span>JavaScript/ES6+</span>
                </div>
                <el-progress :percentage="95" color="#f7df1e" />
              </div>
              <div class="skill-item">
                <div class="skill-header">
                  <span>HTML5/CSS3</span>
                </div>
                <el-progress :percentage="90" color="#e34f26" />
              </div>
              <div class="skill-item">
                <div class="skill-header">
                  <span>TypeScript</span>
                </div>
                <el-progress :percentage="75" color="#3178c6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="section projects-section">
      <div class="container">
        <h2 class="section-title">项目经验</h2>
        <p class="section-subtitle">参与开发的重点项目展示</p>

        <div class="projects-grid">
          <el-card
            class="project-card"
            v-for="project in projects"
            :key="project.id">
            <div class="project-image">
              <el-icon size="60" :color="project.color"
                ><component :is="project.icon"
              /></el-icon>
            </div>
            <div class="project-content">
              <h3>{{ project.name }}</h3>
              <p>{{ project.description }}</p>
              <div class="project-tech">
                <el-tag
                  v-for="tech in project.technologies"
                  :key="tech"
                  size="small"
                  :type="getTagType(tech)">
                  {{ tech }}
                </el-tag>
              </div>
              <div class="project-achievements">
                <h4>项目成果：</h4>
                <ul>
                  <li
                    v-for="achievement in project.achievements"
                    :key="achievement">
                    {{ achievement }}
                  </li>
                </ul>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </section>

    <!-- Experience Section -->
    <section id="experience" class="section experience-section">
      <div class="container">
        <h2 class="section-title">工作经历</h2>
        <p class="section-subtitle">我的职业发展历程</p>

        <el-timeline class="experience-timeline">
          <el-timeline-item
            v-for="exp in experiences"
            :key="exp.id"
            :timestamp="exp.period"
            placement="top"
            :color="exp.color"
            size="large">
            <el-card class="experience-card">
              <div class="exp-header">
                <h3>{{ exp.company }}</h3>
                <el-tag :type="exp.tagType">{{ exp.position }}</el-tag>
              </div>
              <p class="exp-description">{{ exp.description }}</p>
              <div class="exp-projects">
                <h4>主要项目：</h4>
                <ul>
                  <li v-for="project in exp.projects" :key="project">
                    {{ project }}
                  </li>
                </ul>
              </div>
              <div class="exp-tech">
                <h4>技术栈：</h4>
                <div class="tech-tags">
                  <el-tag
                    v-for="tech in exp.technologies"
                    :key="tech"
                    size="small">
                    {{ tech }}
                  </el-tag>
                </div>
              </div>
              <div class="exp-achievements" v-if="exp.achievements">
                <h4>项目贡献：</h4>
                <ul>
                  <li
                    v-for="achievement in exp.achievements"
                    :key="achievement">
                    {{ achievement }}
                  </li>
                </ul>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="section contact-section">
      <div class="container">
        <h2 class="section-title">联系我</h2>
        <p class="section-subtitle">期待与您的合作交流</p>

        <div class="contact-content">
          <div class="contact-item">
            <el-icon size="24" color="#409eff"><Phone /></el-icon>
            <div @click="phone">
              <h4>电话</h4>
              <p>19967171798</p>
            </div>
          </div>
          <div class="contact-item" @click="email">
            <el-icon size="24" color="#67c23a"><Message /></el-icon>
            <div>
              <h4>邮箱</h4>
              <p>741967556@qq.com</p>
            </div>
          </div>
          <div class="contact-item" @click="location">
            <el-icon size="24" color="#e6a23c"><Location /></el-icon>
            <div>
              <h4>位置</h4>
              <p>湖南省</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Back to Top -->
    <el-backtop :right="40" :bottom="40" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// 项目数据
const projects = ref([
  {
    id: 1,
    name: "智能货柜系列项目",
    description:
      "兴元科技开门柜前端开发，包含C端小程序、B端小程序、商家端PC和管理平台PC四个子项目。",
    technologies: ["Vue2", "Vue3", "UniApp", "Vite", "Node.js"],
    achievements: [
      "C端小程序启动速度优化200%",
      "PC端启动优化实现秒开",
      "Vue2项目成功迁移至Vite",
      "Node.js一键国际化功能",
    ],
    icon: "Star",
    color: "#409eff",
  },
  {
    id: 2,
    name: "协同监管调度平台",
    description:
      "为张家界景区开发的旅游后台管理系统，统计和展示景区交通、游客、气象等数据。",
    technologies: ["Vue.js", "ECharts", "Element UI"],
    achievements: [
      "担任前端开发组长",
      "搭建项目架构和框架选型",
      "开发可复用组件提高团队效率",
      "实现用户权限控制系统",
    ],
    icon: "Monitor",
    color: "#67c23a",
  },
  {
    id: 3,
    name: "矿博云项目",
    description:
      "为郴州矿物宝石博览会定制的项目，包含App、公众号、小程序多端应用。",
    technologies: ["UniApp", "Vue.js", "H5"],
    achievements: [
      "注册商家329户",
      "累计访问数655万次",
      "App下载超45.2万次",
      "公众号关注18.3万",
    ],
    icon: "Setting",
    color: "#e6a23c",
  },
]);

// 工作经历数据
const experiences = ref([
  {
    id: 1,
    company: "湖南兴元科技股份有限公司",
    position: "Web前端工程师",
    period: "2022-12 至今",
    description: "开门柜前端开发，负责前端框架选型到开发落地。",
    projects: [
      "智能货柜C端小程序",
      "智能货柜B端小程序",
      "智能货柜商家端PC",
      "智能货柜管理平台PC",
    ],
    technologies: ["Vue2", "Vue3", "UniApp", "Vite", "Webpack", "Node.js"],
    achievements: [
      "Vue2项目webpack迁移vite",
      "Node.js一键国际化",
      "Node.js一键修复项目缓存",
      "C端小程序启动速度优化200%",
      "PC端启动优化秒开",
    ],
    color: "#409eff",
    tagType: "primary",
  },
  {
    id: 2,
    company: "湖南领域科技（原名玛塔科技）",
    position: "Web前端工程师",
    period: "2018-6 ~ 2022-10",
    description:
      "负责多个大型项目的前端开发工作，包括协同监管平台和矿博云项目。",
    projects: ["协同监管调度平台后台系统", "矿博云UniApp项目", "矿博云官网"],
    technologies: ["Vue.js", "UniApp", "ECharts", "Element UI"],
    color: "#67c23a",
    tagType: "success",
  },
  {
    id: 3,
    company: "湖南大汉商管云",
    position: "Web前端工程师",
    period: "2018-7 ~ 2020-6",
    description: "负责商管云相关项目的前端开发，包括小程序和PC端管理系统。",
    projects: ["悦中心微信小程序", "集团版PC端后台系统"],
    technologies: ["微信小程序", "Vue.js", "Element Admin"],
    color: "#e6a23c",
    tagType: "warning",
  },
  {
    id: 4,
    company: "深圳华汉鼎软件技术有限公司",
    position: "Web前端工程师",
    period: "2015-7 ~ 2018-7",
    description: "职业生涯起步阶段，参与多个Web项目的前端开发工作。",
    projects: ["企业级Web应用开发"],
    technologies: ["HTML5", "CSS3", "JavaScript", "jQuery"],
    color: "#909399",
    tagType: "info",
  },
]);

// 方法
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

const getTagType = (tech: string) => {
  const typeMap: { [key: string]: string } = {
    Vue2: "success",
    Vue3: "success",
    React: "primary",
    UniApp: "warning",
    Vite: "info",
    Webpack: "info",
    "Node.js": "success",
  };
  return typeMap[tech] || "";
};

/**
 * 拨打电话
 */
const phone = () => {
  window.location.href = "tel:19967171798";
};

const email = () => {
  window.location.href = "mailto:741967556@qq.com";
};

const location = () => {
  //导航前往百度地图 坐标112.873299,28.231046
  window.open(
    "https://uri.amap.com/navigation?from=112.873299,28.231046,湖南省,湖南省,长沙市,湖南省,410000&to=112.873299,28.231046,湖南省,湖南省,长沙市,湖南省,410000&via=&mode=&policy=&src=&coordinate=gaode&callnative=0"
  );
};
</script>

<style scoped lang="scss">
.home {
  padding-top: 70px;
}
/* Hero Section */
.hero-section {
  /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
  background: url("../assets/images/hero-bg.jpg") no-repeat center center;
  background-size: cover;
  color: white;
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.8) 0%,
      rgba(0, 0, 0, 0.4) 50%,
      rgba(0, 0, 0, 0.6) 100%
    ),
    url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.8;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-title {
  font-weight: 700;
  font-size: 3rem;
  line-height: 1;
  margin-bottom: 1.5rem;
}

.hero-description {
  font-size: 1.25rem;
  line-height: 1.75rem;
  max-width: 42rem;
  margin-bottom: 2rem;
}

.hero-tags {
  display: flex;
  gap: 1rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  button {
    text-align: center;
    padding-bottom: 0.75rem;
    color: #fff;
    padding-top: 0.75rem;
    padding-left: 2rem;
    padding-right: 2rem;
    cursor: pointer;
    background-color: rgb(37 99 235);
    border: none;
    user-select: none;
  }
}

.avatar-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-avatar {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 4px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.avatar-decoration {
  position: absolute;
  width: 240px;
  height: 240px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  /* animation: rotate 20s linear infinite; */
}

.avatar-decoration img {
  width: 240px;
  height: 240px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* About Section */
.about-section {
  background: #f8f9fa;
}

.about-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 4rem;
  align-items: start;
}

.about-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.info-card {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.info-card h3 {
  margin: 1rem 0 0.5rem;
  color: #303133;
}

.detail-card {
  height: fit-content;
  h3 {
    padding-bottom: 20px;
  }
}

.detail-item {
  display: flex;
  margin-bottom: 1rem;
  align-items: center;
}

.label {
  font-weight: 600;
  color: #606266;
  min-width: 80px;
}

/* Skills Section */
.skills-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
}

.skill-category h3 {
  margin-bottom: 2rem;
  color: #303133;
  font-size: 1.3rem;
}

.skill-item {
  margin-bottom: 2rem;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

/* Projects Section */
.projects-section {
  background: #f8f9fa;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.project-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.project-image {
  text-align: center;
  padding: 2rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.project-content h3 {
  margin-bottom: 1rem;
  color: #303133;
}

.project-tech {
  margin: 1.5rem 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.project-achievements h4 {
  margin-bottom: 0.5rem;
  color: #606266;
}

.project-achievements ul {
  list-style: none;
  padding: 0;
}

.project-achievements li {
  padding: 0.3rem 0;
  position: relative;
  padding-left: 1.5rem;
}

.project-achievements li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #67c23a;
  font-weight: bold;
}

/* Experience Section */
.experience-timeline {
  max-width: 800px;
  margin: 0 auto;
}

.experience-card {
  margin-bottom: 1rem;
}

.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.exp-header h3 {
  color: #303133;
  margin: 0;
}

.exp-description {
  color: #606266;
  margin-bottom: 1.5rem;
}

.exp-projects h4,
.exp-tech h4,
.exp-achievements h4 {
  color: #606266;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.exp-projects ul,
.exp-achievements ul {
  list-style: none;
  padding: 0;
  margin-bottom: 1.5rem;
}

.exp-projects li,
.exp-achievements li {
  padding: 0.3rem 0;
  position: relative;
  padding-left: 1.5rem;
}

.exp-projects li::before,
.exp-achievements li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #409eff;
  font-weight: bold;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* Contact Section */
.contact-section {
  background: #f8f9fa;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  user-select: none;
}

.contact-item h4 {
  margin: 0 0 0.5rem;
  color: #303133;
}

.contact-item p {
  margin: 0;
  color: #606266;
}

.contact-form h3 {
  margin-bottom: 2rem;
  color: #303133;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-section {
    background-position: center top;
    background-size: cover;
    min-height: 90vh;
  }

  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }

  .hero-tags,
  .hero-actions {
    display: flex;
    justify-content: center;
  }

  .about-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .about-info {
    grid-template-columns: 1fr;
  }

  .skills-content {
    grid-template-columns: 1fr;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .contact-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .exp-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .hero-avatar {
    margin-top: 20px;
  }
}
</style>
