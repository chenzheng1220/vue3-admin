import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
//npm install -D unplugin-vue-components unplugin-auto-import 使用插件自动引入ElementPlus
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
//npm i vite-plugin-compression -D 安装插件
import viteCompression from 'vite-plugin-compression'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
     //代码压缩
     viteCompression({
      verbose: true, // 是否在控制台输出压缩结果
      disable: false, // 是否禁用
      threshold: 10240, // 体积大于 threshold 才会被压缩,单位 b
      algorithm: 'gzip', // 压缩算法,可选 [ 'gzip' , 'brotliCompress' ,'deflate' , 'deflateRaw']
      ext: '.gz', // 生成的压缩包后缀
      deleteOriginFile: false //压缩后是否删除源文件
    }),
    VueDevTools(),
  ],
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    },
     //默认是esbuild,但这里需要改成terser，并且想使用terser的话，需提前安装，命令为npm add -D terser
     minify:'terser',
     terserOptions: {
       compress: {
         //生产环境时移除console,debugger
         drop_console: true,
         drop_debugger: true,
       },
     },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base:'/vue3-admin/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081', // 目标服务器地址
        changeOrigin: true,             // 是否改变源地址
        rewrite: (path) => path.replace(/^\/api/, '') // 重写路径
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: { api: 'modern-compiler' },
    }
  }
})
