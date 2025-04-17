<template>
   <el-dialog v-model="dialogVisible" :title="type === 'add' ? '添加资源':'修改资源'" width="600px" draggable append-to-body>
    <el-form
    :model="state.ruleForm"
    :rules="state.rules"
    ref="ruleFormRef"
    label-width="auto"
    label-position="right"
    >
    <el-form-item label="资源类型" prop="type">
      <el-select
        v-model="state.ruleForm.type"
        clearable
        placeholder="请选择资源类型"
        size="large"
      >
        <el-option
          v-for="(item,index) in options"
          :key="index"
          :value="item"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="资源名称" prop="name">
        <el-input size="large"  clearable v-model="state.ruleForm.name" placeholder="请输入资源名称" />
    </el-form-item>

    <el-form-item label="资源链接" prop="url">
        <el-input size="large"  clearable v-model="state.ruleForm.url" placeholder="请输入资源链接" />
    </el-form-item>
    
    <el-form-item label="自定义排序" prop="customOrder">
    <el-input-number size="large" style="width:100%;"  :min="0" v-model="state.ruleForm.customOrder" />
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
   
   <script setup lang="ts">
 
   import { reactive, ref,onMounted, nextTick } from 'vue'  
   import {postInfo} from '@/utils';
   import {ElMessage} from 'element-plus';
   const ruleFormRef = ref(null);
   const dialogVisible = ref(false);
   const props = defineProps({
    type:String,
    data:Object,
    getResourceList:Function
   })

   const state = reactive({
     ruleForm:{
        id:'',
        type:'',
        name: '',
        url:'',
        customOrder:0
     },
     rules:{
      type:[
        {required:true,message:"资源类型不能为空",trigger:'blur'}
      ],
       name:[
         {required:true,message:'资源名称不能为空',trigger:'blur'},
         {min:3,max:24,message:"分类名称至少三位",trigger:'blur'}
       ],
       url:[
        {required:true,message:"资源链接不能为空",trigger:'blur'}
       ],
       customOrder:[
         {required:true,message:"自定义排序不能为空",trigger:'blur'}
       ]
     }
   });
   const options = ["学习文档","在线工具","资源下载","技术博主"];

 
   const submitForm = () => {
   if (!ruleFormRef.value) return
     ruleFormRef.value.validate(async(valid, fields) => {
     if (valid) {   
        let url = props.type === 'add' ? '/addResource' : '/updateResource';
       const res = await postInfo(url,state.ruleForm);
       if(res.data.code === 200){
        ElMessage({type:'success',message:res.data.msg});
        props.getResourceList({pageNumber:1,pageSize:12,selectType:''});
       }
     
     } else {
       console.log('error submit!',fields);
     }
   })
 }

 const open = () => {
    dialogVisible.value = true;
    nextTick(() => {
        if(props.type === 'edit'){
            state.ruleForm.id = props.data.id;
            state.ruleForm.type = props.data.type;
            state.ruleForm.name = props.data.name;
            state.ruleForm.url = props.data.url;
            state.ruleForm.customOrder = props.data.customOrder;
        }else{
            state.ruleForm.id = '';
            state.ruleForm.type = '';
            state.ruleForm.name = '';
            state.ruleForm.url = '';
            state.ruleForm.customOrder = 0;
        }
    })
 }
 
 defineExpose({open})
 onMounted(async() => {
    
  
 
 
 })
 
   
   </script>
 
   <style lang="scss">
   
   </style>
   