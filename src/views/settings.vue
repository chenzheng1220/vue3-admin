<template>
   <div class="settings">
    <el-form
    :model="state.ruleForm"
    :rules="state.rules"
     ref="ruleFormRef"
     label-width="auto"
     label-position="right"
    >
     <el-form-item label="博客名称" prop="name">
         <el-input size="large"  clearable v-model="state.ruleForm.name" placeholder="请输入博客名称" />
     </el-form-item>

     <el-form-item label="作者名称" prop="author">
         <el-input size="large"  clearable v-model="state.ruleForm.author" placeholder="请输入作者名称" />
     </el-form-item>
     
     <el-form-item label="头像" prop="avatar">
         <el-upload
             class="avatar-uploader"
             action="/api/upload"
             appect="jpg,jpeg,png"
             :headers="{
               Authorization:`Bearer ${token}`
             }"
             :show-file-list="false"
             :on-success="handleAvatarSuccess"
             :on-error="handleAvatarError"
             :before-upload="beforeAvatarUpload"
             >
             <img v-if="state.ruleForm.avatar" :src="state.ruleForm.avatar" class="avatar" />
             <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
         </el-upload>
     </el-form-item>
     
     <el-form-item label="个人简介" prop="introduction">
         <el-input type="textarea" size="large"  clearable v-model="state.ruleForm.introduction" placeholder="请输入个人简介" />
     </el-form-item>

     <el-form-item required label="关于博客" >
        <MdEditor  editorId="editor" v-model="editor" @onUploadImg="onUploadImg" />
      </el-form-item>

     <el-form-item label="GitHub主页地址" prop="github">
         <el-input size="large"  clearable v-model="state.ruleForm.github" placeholder="请输入GitHub主页地址" />
     </el-form-item>

     <el-form-item label="博主邮箱" prop="email">
         <el-input size="large"  clearable v-model="state.ruleForm.email" placeholder="请输入邮箱地址" />
     </el-form-item>
 
     <el-form-item>
       <el-button size="large" style="width:120px;" plain type="primary" @click="submitForm(ruleFormRef)">
         保存
       </el-button>
       <el-button size="large" style="width:120px;" plain type="danger" @click="resetForm(ruleFormRef)">重置</el-button>
     </el-form-item>
   
    
 
    </el-form>
   </div>
 </template>
   
   <script setup>
 
   import { reactive, ref,onMounted, nextTick } from 'vue'  
   import {postInfo,getInfo} from '@/utils';
   import axios from 'axios';
   import {ElMessage} from 'element-plus';
   import { MdEditor } from 'md-editor-v3';
   import 'md-editor-v3/lib/style.css';
   const ruleFormRef = ref(null);
   const editor = ref('');
   const token = localStorage.getItem("token") || '';
   const state = reactive({
     ruleForm:{
       name: '',
       author:'',
       avatar: '',
       introduction: '',
       about:'',
       github:'',
       email:''
     },
     rules:{
       name:[
         {required:true,message:'博客名称不能为空',trigger:'blur'}
       ],
       author:[
         {required:true,message:"作者名称不能为空",trigger:'blur'}
       ],
       avatar:[
         {required:true,message:'头像不能为空',trigger:'blur'}
       ],
       introduction:[
         {required:true,message:"个人简介不能为空",trigger:'blur'}
       ],
       github:[
         {required:true,message:"GitHub主页地址不能为空",trigger:'blur'}
       ],
       email:[
         {required:true,message:"邮箱地址不能为空",trigger:'blur'},
         {pattern:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,message:'这不是一个有效的邮箱！',trigger:'blur'}
       ]
     }
   })

   const onUploadImg = async (files, callback) => {
    const res = await Promise.all(
      files.map((file) => {
        return new Promise((rev, rej) => {
          const form = new FormData();
          form.append('file', file);
          axios.post('/api/upload', form, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization':`Bearer ${token}`
              }
            })
            .then((res) => rev(res))
            .catch((error) => rej(error));
        });
    })
  );
  const imageUrls = res.map((item) => item.data.data);
  callback(imageUrls);
  }
 
   const handleAvatarSuccess = (response,uploadFile) => {
     state.ruleForm.avatar = response.data;
     ElMessage({type:'success',message:response.msg});
     
   }
 
   const handleAvatarError = (error) => {
     ElMessage({type:'error',message:"权限不足，无法执行此操作！"});
   }
 
   const beforeAvatarUpload = (rawFile) => {
     console.log('rawFile',rawFile);
     if (!['image/jpeg','image/jpg','image/png'].includes(rawFile.type)) {
       return ElMessage({type:'error',message:"请上传jpg、jpeg、png格式的图片！"});
     } else if (rawFile.size / 1024 / 1024 > 2) {
       return ElMessage({type:'error',message:"图片大小不能超过2M!"});
      
     }
     return true
   }
 
 
   const submitForm = () => {
   if (!ruleFormRef.value) return
     ruleFormRef.value.validate(async(valid, fields) => {
     if (valid) {   
       state.ruleForm.about = editor.value;
       const res = await postInfo('updateSettings',state.ruleForm);
       if(res.data.code === 200){
         ElMessage({type:'success',message:res.data.msg});
         await getSettingsDetail();
       }
     
     } else {
       console.log('error submit!',fields);
     }
   })
 }
 
 const resetForm = () => {
   if (!ruleFormRef.value) return
   ruleFormRef.value.resetFields();
 }
 

 const getSettingsDetail = async() => {
   const res = await getInfo('/getSettingsDetail');
   state.ruleForm.name = res.data.data.name;
   state.ruleForm.author = res.data.data.author;
   state.ruleForm.avatar = res.data.data.avatar;
   state.ruleForm.introduction = res.data.data.introduction;
   editor.value = res.data.data.about;
   state.ruleForm.github = res.data.data.github;
   state.ruleForm.email = res.data.data.email;
 }
 
 onMounted(async() => {
     await getSettingsDetail();
 
 })
 
   
   </script>
 
   <style lang="scss">
   .settings{
    background-color:#ffffff;
    padding:20px;
   }
     .avatar{
       display:block;
       width:120px;
       height:120px;
 
     }
     .avatar-uploader .el-upload {
         border: 1px dashed var(--el-border-color);
         border-radius: 6px;
         cursor: pointer;
         position: relative;
         overflow: hidden;
         transition: var(--el-transition-duration-fast);
         }
 
         .avatar-uploader .el-upload:hover {
         border-color: var(--el-color-primary);
         }
 
         .el-icon.avatar-uploader-icon {
         font-size: 28px;
         color: #8c939d;
         width: 178px;
         height: 178px;
         text-align: center;
         }
         .el-textarea__inner{
            min-height:120px!important;
         }
   </style>
   