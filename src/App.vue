<template>
  <el-container v-if="isShowLogin">
    <Login />
  </el-container>
  <el-container v-else>
    <el-aside :style="{width:isMobile ? '64px':'200px'}">
      <h2 v-if="!isMobile" class="title" @click="handleReload">乐记笔记后台</h2>
      <div class="line"></div>
      <el-menu
      default-active="/chart"
      class="el-menu-vertical-demo dark-mode" 
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :router="true"
       :collapse="isCollapse"
    >
      <el-menu-item index="/chart" >
        <el-icon><Histogram /></el-icon>
        <template #title>统计分析</template>
      </el-menu-item>
      <el-menu-item index="/article">
        <el-icon><Document /></el-icon>
        <template #title>文章管理</template>
      </el-menu-item>
      <el-menu-item index="/category">
        <el-icon><FolderOpened /></el-icon>
        <template #title>分类管理</template>
      </el-menu-item>
      <el-menu-item index="/tag">
        <el-icon><CollectionTag /></el-icon>
        <template #title>标签管理</template>
      </el-menu-item>
    
      <el-menu-item index="/comments">
        <el-icon><ChatDotSquare /></el-icon>
        <template #title>评论管理</template>
      </el-menu-item>
      <el-menu-item index="/resource">
        <el-icon><collection /></el-icon>
        <template #title>资源管理</template>
      </el-menu-item>
      <el-menu-item index="/settings">
        <el-icon><Setting /></el-icon>
        <template #title>博客设置</template>
      </el-menu-item>
    </el-menu>
    </el-aside>
  
    <el-container>
      <el-header>
        <Header></Header>
      </el-header>
      <el-main :class="isMobile ? 'phoneMain' : ''" >
        <el-config-provider :locale="zhCn">
          <router-view v-slot="{Component,route}">
            <keep-alive>
              <component :is="Component" v-if="route.meta.keepAlive" :key="route.name" />
            </keep-alive>
            <component :is="Component" v-if="!route.meta.keepAlive" :key="route.name" />
          </router-view>
        </el-config-provider>
      </el-main>
      <el-footer>
        <Footer></Footer>
      </el-footer>
    </el-container>
  </el-container>
 
  </template>
  
  <script setup>
  import {ref,onMounted} from 'vue';
  import {useRouter} from 'vue-router';
  import Header from './components/header.vue';
  import Footer from './components/footer.vue';
  import Login from './views/login.vue';
  import { useUserStore } from '@/stores/userStore';
  import zhCn from 'element-plus/es/locale/lang/zh-cn'
  import useSystem from './hooks/useSystem'
  const loginState = useUserStore();

  const isShowLogin = ref(true);
  const router = useRouter();
  const isCollapse = ref(false);
  const isMobile = ref(useSystem().isMobile);
 

  router.beforeEach((to,from,next) => {
    //debugger;
    if(loginState.isLogin){
      isShowLogin.value = false;
      next();
    }else{
      isShowLogin.value = true;
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      next();
    }
   
  })

  const handleReload = () => {
    window.location.reload(true);
  }

  const handleResize = () => {
    isMobile.value = useSystem().isMobile;
    isCollapse.value = useSystem().isMobile;
  }
  
  onMounted(() => {
    handleResize();
    window.addEventListener('resize',handleResize);
   
  })


   
  </script>
  
  <style lang="scss">
    $menuBgColor:#222832;
    $borderColor:#eef0fc;
    .el-container{
      width:100%;
      height:100%;
      overflow:hidden;
     
      .el-aside{
        width: 200px;
        background-color:$menuBgColor;
        font-family: "kt";
        .title{
          font-size:26px;
          color:#ffffff;
          letter-spacing:2px;
          text-align:center;
          margin:0;
          padding:12px 0;
          user-select:none;
          cursor:pointer;
          font-weight:normal;
        }
        .line{
          border-top: 1px solid hsla(0, 0%, 100%, .05);
          border-bottom: 1px solid rgba(0, 0, 0, .2);
        }
        .el-menu{
          background-color:$menuBgColor;
          border:none;
          .el-sub-menu__title{
            font-size:22px;
          }
          .el-menu-item{
            font-size:22px;
          }
        }
      }
      .el-header{
        border-bottom: 1px solid $borderColor;
        box-shadow: 0 0 2px $borderColor;
      }
      .el-main{
        background-color: $borderColor;
        border: 1px solid $borderColor;
        box-shadow: 0 0 2px $borderColor;
        overflow:auto;
      }
      .el-footer{
        border-top: 1px solid $borderColor;
        box-shadow: 0 0 2px $borderColor;
      }
   
    }
    .phoneMain{
      padding:5px 0;
    }

  </style>

  