<template>
    <el-aside :style="{width:isMobile ? '64px':'200px'}">
        <h2 v-if="!isMobile" class="title">乐记笔记后台</h2>
        <div class="line"></div>
        <el-menu
            :default-active="current"
            class="el-menu-vertical-demo dark-mode" 
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            router
            :collapse="isCollapse"
            >
            <el-menu-item v-for="item in menuData" :key="item.id" :index="item.index" >
                <el-icon><component :is="item.icon"></component></el-icon>
                <template #title>{{ item.title }}</template>
            </el-menu-item>
        </el-menu>
    </el-aside>
     
</template>
<script setup lang="ts">
import {ref} from 'vue';
import {useRoute} from 'vue-router';
import useSystem from '@/hooks/useSystem';  
import menuData from './index';
const {isMobile} = useSystem();
const route = useRoute();
const current = ref(route.path);
const isCollapse = ref(isMobile);

</script>
<style lang="scss" scoped>
 $menuBgColor:#222832;
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

</style>