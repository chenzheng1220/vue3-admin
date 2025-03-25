import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory('/vue3-admin/'),
  routes: [
    {
      path:'/',
      redirect:'/login'
    },
    {
      path:'/login',
      name:'login',
      component:() => import('../views/login.vue')
    },
    {
      path: '/chart',
      name: 'chart',
      meta:{
        keepAlive:false,
        
      },
      component: () => import('../views/chart.vue')
    },
    {
      path: '/article',
      name: 'article',
      meta:{
        keepAlive:true
      },
      component: () => import('../views/article.vue')
    },
    {
      path:'/addArticle/',
      name:'addArticle',
      meta:{
        keepAlive:false
      },
      component:() => import('../views/addArticle.vue')
    },
    {
      path: '/category',
      name: 'category',
      meta:{
        keepAlive:true
      },
      component: () => import('../views/category.vue')
    },
    {
      path: '/tag',
      name: 'tag',
      meta:{
        keepAlive:true
      },
      component: () => import('../views/tag.vue')
    },
    {
      path: '/comments',
      name: 'comments',
      meta:{
        keepAlive:true
      },
      component: () => import('../views/comments.vue')
    },
    {
      path: '/project',
      name: 'project',
      meta:{
        keepAlive:true
      },
      component: () => import('../views/project.vue')
    },
    {
      path: '/resource',
      name: 'resource',
      meta:{
        keepAlive:true
      },
      component: () => import('../views/resource.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      meta:{
        keepAlive:true
      },
      component: () => import('../views/settings.vue')
    }
  ]
})


export default router
