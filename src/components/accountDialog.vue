<template>
    <el-dialog v-model="dialogVisible" title="修改密码" width="450px" draggable append-to-body>
     <el-form
     :model="state.ruleForm"
     :rules="state.rules"
     ref="ruleFormRef"
     label-width="auto"
     label-position="right"
     >
     <el-form-item label="账号" prop="username">
         <el-input size="large" disabled style="width:360px;" clearable v-model="state.ruleForm.username"  />
     </el-form-item>
 
     <el-form-item label="新密码" prop="password">
         <el-input size="large" style="width:360px;" clearable v-model="state.ruleForm.password" placeholder="请输入新密码" />
     </el-form-item>
     
     <el-form-item label="确定新密码" prop="confirmPassword">
        <el-input size="large" style="width:360px;" clearable v-model="state.ruleForm.confirmPassword" placeholder="请输入新密码" />
     </el-form-item>
     
     </el-form>
     <template #footer>
       <div class="dialog-footer">
         <el-button  size="large" style="width:120px;" plain type="danger" @click="dialogVisible = false">取消</el-button>
         <el-button size="large" style="width:120px;" plain type="primary" @click="submitForm">
           确定
         </el-button>
       </div>
     </template>
    
    </el-dialog>
  </template>
    
    <script setup>
  
    import { reactive, ref,onMounted} from 'vue'  
    import {postInfo} from '@/utils';
    import {ElMessage} from 'element-plus';
    import {SHA256} from 'crypto-js';
    const ruleFormRef = ref(null);
    const dialogVisible = ref(false);
   
    const state = reactive({
      ruleForm:{
         username:'lejibiji',
         password:'',
         confirmPassword: '',
      },
      rules:{
        password:[
          {required:true,message:'密码不能为空',trigger:'blur'},
          {min:6,max:24,message:"密码至少六位",trigger:'blur'}
        ],
        confirmPassword:[
          {required:true,message:'密码不能为空',trigger:'blur'},
          {min:6,max:24,message:"密码至少六位",trigger:'blur'}
        ],
      }
    });

 
    const submitForm = () => {
    if (!ruleFormRef.value) return;
      ruleFormRef.value.validate(async(valid, fields) => {
      if (valid) {   
        if(state.ruleForm.password === state.ruleForm.confirmPassword){
            const res = await postInfo('/updatePassword',{
              username:state.ruleForm.username,
              password:SHA256(state.ruleForm.password).toString()
            });
            if(res.data.code === 200){
                ElMessage({type:'success',message:res.data.msg});
                setTimeout(() => dialogVisible.value = false,1500);
            }
        }else{
            ElMessage({type:"error",message:"两次密码输入不一致，请检查！"});
        }
       
       
      
      } else {
        console.log('error submit!',fields);
      }
    })
  }

  const open = () => {
    dialogVisible.value = true;
  }
  
  defineExpose({open});
  onMounted(async() => {
     
   
  
  
  })
  
    
    </script>
  
    <style lang="scss">
    
    </style>
    