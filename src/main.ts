import './assets/fonts/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import ElementPlus from 'element-plus'
// import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App);
app.config.globalProperties.globalData = {
  'chart':'统计分析',
  'article':'文章管理',
  'addArticle':'文章管理',
  'category':'分类管理',
  'tag':'标签管理',
  'comments':'评论管理',
  'project':'项目管理',
  'resource':'资源管理',
  'account':'修改密码',
  'settings':'博客设置'
}

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
//   app.use(ElementPlus, {
//     locale: zhCn,
//   })
app.use(createPinia())
app.use(router)

app.mount('#app');
