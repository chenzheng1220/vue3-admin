<template>
    <el-container >
        <Aside></Aside>
        <el-container>
            <el-header>
                <Header></Header>
            </el-header>
            <el-main :class="isMobile ? 'phoneMain' : ''" >
                <router-view v-slot="{Component,route}">
                    <template v-if="route.meta.keepAlive">
                        <keep-alive>
                            <component :is="Component" v-if="route.meta.keepAlive" :key="route.fullPath" />
                        </keep-alive>
                    </template>
                    <template v-else>
                        <component :is="Component" v-if="!route.meta.keepAlive" :key="route.fullPath" />
                    </template>
                </router-view>
            </el-main>
            <el-footer>
                <Footer></Footer>
            </el-footer>
        </el-container>
  </el-container>
</template>
<script setup lang="ts">
import {ref,onMounted} from 'vue';
  import Header from '@/components/header.vue';
  import Aside from '@/components/aside/index.vue';
  import Footer from '@/components/footer.vue';
  import useSystem from '@/hooks/useSystem';
  const isCollapse = ref(false);
  const isMobile = ref(useSystem().isMobile);
 
  const handleResize = () => {
    isMobile.value = useSystem().isMobile;
    isCollapse.value = useSystem().isMobile;
  }
  
  onMounted(() => {
    handleResize();
    window.addEventListener('resize',handleResize);
   
  })
</script>
<style lang="scss" scoped>
    $borderColor:#eef0fc;
    .el-container{
      width:100%;
      height:100%;
      overflow:hidden;
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