import { createSSRApp } from 'vue'
import App from './App.vue'
import plugins from './plugins' // plugins

export function createApp() {
  const app = createSSRApp(App)
  app.use(plugins)
  return {
    app,
  }
}
