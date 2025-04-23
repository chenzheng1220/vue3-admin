import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home.vue';
import {useUserStore} from '@/stores/userStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path:'/',
      redirect:'/login'
    },
    {
      path:'/login',
      name:'login',
      component:() => import('@/views/login.vue')
    },
    {
      path:'/home',
      name:'home',
      component:Home,
      children:[
        {
          path: 'dashboard',
          name: 'dashboard',
          meta:{
            title:'统计分析',
            keepAlive:false,
            
          },
          component: () => import('@/views/home/dashboard.vue')
        },
        {
          path: 'article',
          name: 'article',
          meta:{
            title:'文章管理',
            keepAlive:true
          },
          component: () => import('@/views/home/article.vue')
        },
        {
          path:'addArticle',
          name:'addArticle',
          meta:{
            title:'添加文章',
            keepAlive:false
          },
          component:() => import('@/views/home/addArticle.vue')
        },
        {
          path: 'category',
          name: 'category',
          meta:{
            title:'分类管理',
            keepAlive:true
          },
          component: () => import('@/views/home/category.vue')
        },
        {
          path: 'tag',
          name: 'tag',
          meta:{
            title:'标签管理',
            keepAlive:true
          },
          component: () => import('@/views/home/tag.vue')
        },
        {
          path: 'comments',
          name: 'comments',
          meta:{
            title:'评论管理',
            keepAlive:true
          },
          component: () => import('@/views/home/comments.vue')
        },
        {
          path: 'project',
          name: 'project',
          meta:{
            title:'项目管理',
            keepAlive:true
          },
          component: () => import('@/views/home/project.vue')
        },
        {
          path: 'resource',
          name: 'resource',
          meta:{
            title:'资源管理',
            keepAlive:true
          },
          component: () => import('@/views/home/resource.vue')
        },
        {
          path: 'settings',
          name: 'settings',
          meta:{
            title:'博客设置',
            keepAlive:true
          },
          component: () => import('@/views/home/settings.vue')
        }
      ]
    }
   
  ]
})


router.beforeEach((to,from,next) => {
  const {isLogin} = useUserStore();
  console.log(to)
  const routeExists = to.matched.length > 0;
    const publicPaths = ['/login'];
    const isPublic = publicPaths.includes(to.path);
    if (isPublic) {
      next(); 
     return;
    }else if(!routeExists){
      next('/login'); 
      return;
    }else if(!isLogin){
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      next('/login');
    }else{
      next(); 
    }
 
})

export default router
