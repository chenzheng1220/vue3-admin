<template>
    <div class="header">
       <div class="path">
        {{ pathName }}
       </div>
       <div class="info">
        <div class="admin" v-popover="popoverRef" >
            <el-icon><Avatar /></el-icon> lejibiji <el-icon><CaretBottom /></el-icon>
        </div>
        
        <el-popover
        ref="popoverRef"
        trigger="hover"
        :teleported=false
        popper-class="dropdown"	
        >
          <p class="item" @click="handleClick">跳转前台</p>
          <p class="item" @click="updatePwd">修改密码</p>
          <p class="item" @click="exit">退出登录</p>
        </el-popover> 
       
       </div>
    </div>
    <accountDialog ref="accountRef"  />
</template>

<script setup>
    import {ref,reactive,onMounted,getCurrentInstance,nextTick} from 'vue';
    import {useRouter} from 'vue-router';
    import accountDialog from './accountDialog.vue';
    const router = useRouter();
    const app = getCurrentInstance();
    const pathName = ref('统计分析');
    const globalDate = app.appContext.config.globalProperties.globalData;
    const popoverRef = ref(null);
    const accountRef = ref(null);
    
    const handleClick = () => {
        window.location.href = 'http://lejibiji.cn';
    }

    router.afterEach((to) => {

        let path = to.path.split('/');
        pathName.value = globalDate[path[1]];
    
    })

    const updatePwd = () => {
        accountRef.value.open();
    }
    const exit = () => {
        router.push({path:'/login'})
    }
    onMounted(async() => {
      
        
    })


</script>

<style lang="scss">
    .header{
        height: 100%;
        display:flex;
        align-items:center;
        justify-content: space-between;
        padding:0 30px 0 12px;
       .path{
            font-family: "kt";
            font-size:26px;
            letter-spacing: 1px;

       }
       .admin{
            cursor:pointer;
            user-select:none;
        }

        
      
    }
    .item{
            font-size: 14px;
            letter-spacing:1px;
            text-align: center;
            cursor:pointer;
            padding:6px 0;
            &:hover{
                color:#000aff;
            }
            
        }
</style>