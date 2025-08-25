<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-info">
          <h3>孙旺</h3>
          <p>专注前端开发 · 追求技术卓越</p>
          <div class="contact-info">
            <div class="contact-item">
              <el-icon><Phone /></el-icon>
              <span>19967171798</span>
            </div>
            <div class="contact-item">
              <el-icon><Message /></el-icon>
              <span>741967556@qq.com</span>
            </div>
          </div>
        </div>

        <div class="footer-links">
          <h4>快速导航</h4>
          <ul>
            <li @click="scrollToSection('about')"><a>关于我</a></li>
            <li @click="scrollToSection('skills')"><a>专业技能</a></li>
            <li @click="scrollToSection('projects')"><a>项目经验</a></li>
            <li @click="scrollToSection('experience')"><a>工作经历</a></li>
          </ul>
        </div>

        <div class="footer-tech">
          <h4>技术栈</h4>
          <div class="tech-tags">
            <el-tag size="small">Vue3</el-tag>
            <el-tag size="small" type="success">ElementPlus</el-tag>
            <el-tag size="small" type="warning">Vite</el-tag>
            <el-tag size="small" type="info">TypeScript</el-tag>
          </div>
          <p class="tech-note">本站使用 Vue3 + ElementPlus + Vite 构建</p>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="copyright">
          <p>&copy; 2024 孙旺. 保留所有权利.</p>
        </div>
        <div class="social-links">
          <el-button circle size="small" type="primary">
            <el-icon><Platform /></el-icon>
          </el-button>
          <el-button circle size="small" type="success" @click="wechat">
            <el-icon><ChatDotRound /></el-icon>
          </el-button>
          <el-button circle size="small" type="info">
            <el-icon><Link /></el-icon>
          </el-button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const wechat = () => {
  window.location.href = "weixin://contacts/profile/Brave741967556";
};
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 3rem;
  padding: 3rem 0;
}

.footer-info h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: white;
}

.footer-info p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
}

.footer-links h4,
.footer-tech h4 {
  margin-bottom: 1rem;
  color: white;
}

.footer-links ul {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: white;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tech-note {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.copyright p {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.social-links {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .contact-info {
    align-items: center;
  }
}
</style>
