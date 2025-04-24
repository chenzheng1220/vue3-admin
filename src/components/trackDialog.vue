<template>
    <el-dialog title="近一周操作日志" v-model="dialogVisible"  @close="handleClose" width="70%" draggable append-to-body>
        <el-scrollbar height="60vh">
            <el-table :data="trackList" border  style="width:100%;">
                <el-table-column min-width='120px' label="event" prop="event"/>
                <el-table-column min-width='120px' label="type" prop="type"/>
                <el-table-column min-width='120px' label="target" prop="target"/>
                <el-table-column min-width='120px' label="stayTime" prop="stayTime"/>
                <el-table-column min-width='120px' label="triggerTime" prop="triggerTime"/>
            </el-table>
        </el-scrollbar>
      
    </el-dialog>
</template>

<script setup lang="ts">
import {watchEffect,ref } from 'vue';
const dialogVisible = ref(false);
const props = defineProps({
    trackList:Array,
    isShow:Boolean
});

watchEffect(() => {
    dialogVisible.value = props.isShow;
})

const emit = defineEmits(['update:modelValue']);
    
const handleClose = () =>  {
    emit('close',false);
}



</script>

<style lang="scss" scoped>
    .el-textarea__inner{
        min-height:100px!important;
    }
</style>