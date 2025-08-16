// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  // 添加tailwindcss模块
  modules: ["@nuxtjs/tailwindcss", "@element-plus/nuxt"],
  // 可选：自定义Tailwind配置位置
  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css", // 默认是'~/assets/css/tailwind.css'
    configPath: "~/tailwind.config.js", // 默认是'~/tailwind.config.js'
    exposeConfig: false, // 是否将配置暴露给@nuxt/tailwindcss
    viewer: true, // 启用Tailwind Viewer
  },
  elementPlus: {
    /** Options */
    // 可以在这里配置 Element Plus 的选项
    importStyle: "css", // 导入 CSS
    themes: ["dark"], // 可选：添加暗色主题
  },
  nitro: {
    experimental: {
      openAPI: true,
    },
    // 添加路由规则
    routeRules: {
      "/blog/**": {
        cors: true,
        headers: {
          "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
      },
    },
  },
});
