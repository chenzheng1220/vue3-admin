<template>
    <el-dialog title="评论详情" v-model="dialogVisible" width="600px" draggable append-to-body>
        <el-form :mode="ruleForm" label-width="auto" label-position="right">
         
            <el-form-item label="文章ID">
                <el-input  size="large" v-model="ruleForm.articleId" />
            </el-form-item>
            <el-form-item label="IP地址">
                <el-input  size="large" v-model="ruleForm.ip" />
            </el-form-item>
            <el-form-item label="所在城市">
                <el-input  size="large" v-model="ruleForm.city" />
            </el-form-item>
            <el-form-item label="头像">
                <img :src="ruleForm.avatar" />
            </el-form-item>
            <el-form-item label="昵称">
                <el-input size="large" v-model="ruleForm.nickname" />
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input size="large" v-model="ruleForm.email" />
            </el-form-item>
            <el-form-item label="评论内容">
                <el-input size="large" type="textarea" v-model="ruleForm.content" />
            </el-form-item>
            <el-form-item label="审核是否通过">
               <el-switch v-model="ruleForm.state" />
            </el-form-item>
            <el-form-item label="发布时间">
               <el-input size="large" v-model="ruleForm.date" />
            </el-form-item>
            
        </el-form>
    </el-dialog>
</template>

<script setup lang="ts">
import {ref,nextTick} from 'vue';
import {postInfo} from '@/utils';
const dialogVisible = ref(false);
const props = defineProps({
    id:Number
})
const ruleForm = ref({});
const open = () => {
  nextTick(async() => {
    if(props.id){
      
        const res = await postInfo('/getCommentDetails',{id:props.id});
        if(res.data.code === 200){
            dialogVisible.value = true;
            let obj = res.data.list;
            obj.state = obj.state === 1 ? true:false;
            ruleForm.value = obj;
        }
    }
  })
}
defineExpose({open});
</script>

<style lang="scss">
    .el-textarea__inner{
        min-height:100px!important;
    }
</style>