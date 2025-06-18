import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import Compression from 'vite-plugin-compression';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  // 读取环境配置变量，指定前缀
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    // 访问基础路径
    base: env.VITE_HISTORY_BASE_URL,
    resolve: {
      // https://cn.vitejs.dev/config/#resolve-alias
      alias: {
        // 设置路径
        '~': path.resolve(__dirname, './'),
        // 设置别名
        '@': path.resolve(__dirname, './src'),
      },
      // https://cn.vitejs.dev/config/#resolve-extensions
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    // vite 相关配置
    server: {
      port: 6265, // 端口
      host: true, // 暴露到网络地址
      open: false, // 完成后自动跳转浏览器打开
      proxy: {
        // https://cn.vitejs.dev/config/#server-proxy
        [env.VITE_API_BASE_URL]: {
          target: 'http://113.46.139.108/admin',
          changeOrigin: true,
          rewrite: p => p.replace(env.VITE_API_BASE_URL, ''),
        },
      },
    },
    //fix:error:stdin>:7356:1: warning: "@charset" must be the first rule in the file
    css: {
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: atRule => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              },
            },
          },
        ],
      },
    },
    // 插件
    plugins: [
      vue(),
      // Vue文件中自动导入组件
      AutoImport({
        dts: false,
        imports: ['vue', 'vue-router', 'pinia'],
        resolvers: [ElementPlusResolver()],
      }),
      // 组件按需加载，el会有页面重新加载的情况
      Components({
        dts: false,
        deep: true,
        dirs: ['src/components'],
        extensions: ['vue'],
        resolvers: [ElementPlusResolver()],
      }),
      // svg图片
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/svg')],
        symbolId: 'icon-[dir]-[name]',
        svgoOptions: command === 'build',
      }),
      Compression({
        verbose: false,
        ext: '.gz',
        deleteOriginFile: false,
      }),
    ],
  };
});
