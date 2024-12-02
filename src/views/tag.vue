<template>
  <div class="tag">
   <div class="tag-head">
     <el-button 
     type="success"
     plain
     @click="addTag"
     >
       添加标签
     </el-button>
   </div>
   <el-table :data="tableData" border stripe style="width: 100%">
    <el-table-column prop="name" label="标签名称" />
    <el-table-column prop="createTime" label="创建时间" />
  
    <el-table-column fixed="right" label="操作">
      <template #default="scope">
        <el-popconfirm
        confirm-button-text="确定"
         cancel-button-text="取消"
         title="确定删除?"
         icon-color="#626AEF"
         @confirm="handleDelete(scope.$index, scope.row)"
       
        >
         <template #reference>
           <el-button
           type="danger"
           plain
         >
           删除
         </el-button>
         </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog v-model="dialogVisible" title="添加标签" width="600px" height="300px">
 
      <el-tag
      v-for="tag in dynamicTags"
      :key="tag"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
      >
        {{ tag }}
      </el-tag>
      <el-input
        v-if="inputVisible"
        ref="inputRef"
        v-model="inputValue"
        style="width:100px"
        size="small"
        @keyup.enter="handleInputConfirm"
        @blur="handleInputConfirm"
      />
      <el-button v-else class="button-new-tag" size="small" @click="showInput">
       + 新增标签
      </el-button>
     
    <template #footer>
      <div class="dialog-footer">
        <el-button  size="large" style="width:120px;" plain type="danger" @click="dialogVisible = false">取消</el-button>
        <el-button size="large" style="width:120px;" plain type="primary" @click="submitForm">
          确定
        </el-button>
      </div>
    </template>
   
   </el-dialog>
  </div>
</template>

<script setup>
import {ref,reactive,onMounted,nextTick} from 'vue';
import {postInfo,getInfo} from '@/utils';
import {ElMessage} from 'element-plus';
const tableData = ref([]);
const dialogVisible = ref(false);
const inputValue = ref('')
const dynamicTags = ref([]);
const inputVisible = ref(false)
const inputRef = ref(null);

const handleClose = (tag) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    inputRef.value.focus();
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}

const addTag = () => {
  dialogVisible.value = true;
}

const submitForm = async() => {
  console.log(dynamicTags.value);
  const res = await postInfo('/addTag',dynamicTags.value);
  if(res.data.code === 200){
    ElMessage({type:'success',message:"标签添加成功"});
    await getTagList();
  }

}

const handleDelete = async(index,row) => {
 let obj = {id:row.id};
 const res = await postInfo('/delTag',obj);
 if(res.data.code === 200){
   ElMessage({type:'success',message:res.data.msg});
   await getTagList();
 }

}

const getTagList = async() => {
 const res = await getInfo('/getTagList');
 tableData.value = res.data.list;
}


onMounted(async() => {
  await getTagList();
})

</script>
<style lang="scss">
   .tag{
     width:100%;
     .tag-head{
       display:flex;
       justify-content:flex-start;
       margin:0 auto 18px;
       padding:20px;
       background-color:#ffffff;
     }
   }
   @media screen and (max-width:768px){
    .tag{
      width:100%;
      .tag-head{
        margin:0 auto 5px;
      }
    }
   }
 </style>