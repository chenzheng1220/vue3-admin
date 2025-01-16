<template>
    <canvas id="q"></canvas>

    <div class="login">
        <div class="logo">
          乐记笔记后台管理系统
        </div>

        <div class="form">
            <el-form
            ref="ruleFormRef"
            :model="state.ruleForm"
            :rules="state.rules"
            >
                <el-form-item label="账号" prop="username">
                    <el-input size="large" v-model="state.ruleForm.username" style="width:240px;" placeholder="请输入用户名" clearable/>
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input size="large" type="password" v-model="state.ruleForm.password" style="width:240px;" show-password placeholder="请输入密码" />
                </el-form-item>

            </el-form>
        </div>

        <div class="btn">
            <el-button @click="submitForm()" plain size="large" style="width:120px" type="primary">立即登录</el-button>
        </div>

    </div>
</template>

<script setup>
    import {ref,reactive, onMounted} from 'vue';
    import {useRouter} from 'vue-router';
    import {postInfo} from '@/utils';
    import {SHA256} from 'crypto-js';
    import {ElMessage} from 'element-plus';
    const router = useRouter();
    const ruleFormRef = ref(null);
    const state = reactive({
        ruleForm:{
            username:'lejibiji',
            password:'123456'
        },
        rules:{
            username:[
                { required: true, message: '账号不能为空', trigger: 'blur' },
                { min: 6,max:24, message: '账号长度至少六位', trigger: 'blur' },
            ],
            password:[
                {required:true,message:'密码不能为空',trigger:'blur'},
                { min: 6,max:24,message: '密码长度至少六位', trigger: 'blur' },
            ]
        }
    })
  
    const submitForm = () => {
        if(!ruleFormRef.value) return;
         ruleFormRef.value.validate(async(valid,fields) => {
            if(valid){
                let url = '/login';
                let data = {
                    username:state.ruleForm.username,
                    password:SHA256(state.ruleForm.password).toString()
                };
                const res = await postInfo(url,data);
                if(res.data.code === 200){
                    localStorage.setItem('token',res.data.token);
                    localStorage.setItem('refreshToken',res.data.refreshToken);
                    router.push({path:'/chart'});
                    ElMessage({type:'success',message:res.data.msg});
                }
            }else{
                console.log('fields',fields);
            }
        })
      

    }

    const codeRain = () => {
        const s = window.screen;
        const w = (q.width = Math.max(s.width,s.height));
        const h = (q.height = Math.min(s.width,s.height));
        const ctx = q.getContext("2d");

        const p = Array(Math.floor(w / 10) + 1).fill(0);

        const random = (items) => items[Math.floor(Math.random() * items.length)];

        const hex = "0123456789ABCDEF".split("");

        setInterval(() => {
        ctx.fillStyle = "rgba(0,0,0,.05)";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#0f0";
        p.map((v, i) => {
            ctx.fillText(random(hex), i * 10, v);
            p[i] = v >= h || v > 50 + 10000 * Math.random() ? 0 : v + 10;
        });
        }, 1000 / 30);
    }


    onMounted(async() => {
     codeRain();
    })
   
    

</script>

<style lang="scss">
    #q{
        position:fixed;
        left:0;
        top:0;
        right:0;
        bottom:0;
        // transform-origin: 0 0;
        // transform: rotateZ(90deg) translateY(-100%);
    }
    .login{
        position: absolute;
        top: 50%;
        left: 50%;
        transform:translate(-50%,-50%);
        backdrop-filter: blur(12px);
        background-color:hsl(0deg 0% 100% / 20%);
        box-shadow: 0 2px 8px 0 #ffffff;
        padding:30px;
        animation:changeShadow 2s ease-in-out infinite;
        @keyframes changeShadow {
            0%,100%{
                box-shadow: 0 0 12px #ffffff;
            }
            50%{
                box-shadow: 0 0 12px transparent;
            }
        }
        .logo{
            width:100%;
            text-align:center;
            font-family:'kt';
            color:#ffffff;
            font-size:30px;
            margin:0 0 30px;
            >img{
                display:block;
                width:100%;
            }
        }
        .form{
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            height: 100px;
            .el-form-item__label{
                color:#ffffff;
            }
        }
        .btn{
            display:flex;
            justify-content:center;
            margin:24px auto;
            .el-button{
                font-size:16px;
                letter-spacing:1px;
             
            }
        }
    }
</style>