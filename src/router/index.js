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
      component: () => import('../views/chart.vue')
    },
    {
      path: '/article',
      name: 'article',
      component: () => import('../views/article.vue')
    },
    {
      path:'/addArticle/',
      name:'addArticle',
      component:() => import('../views/addArticle.vue')
    },
    {
      path: '/category',
      name: 'category',
      component: () => import('../views/category.vue')
    },
    {
      path: '/tag',
      name: 'tag',
      component: () => import('../views/tag.vue')
    },
    {
      path: '/comments',
      name: 'comments',
      component: () => import('../views/comments.vue')
    },
    {
      path: '/project',
      name: 'project',
      component: () => import('../views/project.vue')
    },
    {
      path: '/resource',
      name: 'resource',
      component: () => import('../views/resource.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/settings.vue')
    }
  ]
})


export default router
