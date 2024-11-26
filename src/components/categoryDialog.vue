<template>
   <el-dialog v-model="dialogVisible" :title="type === 'add' ? '添加分类':'修改分类'" width="450px" draggable append-to-body>
    <el-form
    :model="state.ruleForm"
    :rules="state.rules"
    ref="ruleFormRef"
    label-width="auto"
    label-position="right"
    >
    <el-form-item label="分类名称" prop="name">
        <el-input size="large" clearable v-model="state.ruleForm.name" placeholder="请输入分类名称" />
    </el-form-item>
    
    <el-form-item label="自定义排序" prop="customOrder">
    <el-input-number size="large" style="width:100%;" :min="0" v-model="state.ruleForm.customOrder" />
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
 
   import { reactive, ref,onMounted, nextTick,computed } from 'vue'  
   import {postInfo,getInfo} from '@/utils';
   import {ElMessage} from 'element-plus';
   import {useRoute,useRouter} from 'vue-router';
   const router = useRouter();
   const route = useRoute();
   const ruleFormRef = ref(null);
   const token = ref(localStorage.getItem("token"));
   const dialogVisible = ref(false);
   const props = defineProps({
    type:String,
    data:Object,
    getCategoryList:Function
   })
  
   const state = reactive({
     ruleForm:{
        id:'',
       name: '',
       customOrder:0
     },
     rules:{
       name:[
         {required:true,message:'分类名称不能为空',trigger:'blur'},
         {min:3,message:"分类名称至少三位",trigger:'blur'}
       ],
       customOrder:[
         {required:true,message:"自定义排序不能为空",trigger:'blur'}
       ]
     }
   })

 
   const submitForm = () => {
   
   if (!ruleFormRef.value) return
     ruleFormRef.value.validate(async(valid, fields) => {
     if (valid) {   
        let url = props.type === 'add' ? '/addCategory' : '/updateCategory';
       const res = await postInfo(url,state.ruleForm);
       if(res.data.code === 200){
        ElMessage({type:'success',message:res.data.msg})
        props.getCategoryList();
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
            state.ruleForm.name = props.data.name;
            state.ruleForm.customOrder = props.data.customOrder;
        }else{
            state.ruleForm.id = '';
            state.ruleForm.name = '';
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
   