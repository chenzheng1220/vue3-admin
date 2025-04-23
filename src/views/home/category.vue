<template>
    <div class="category">
     <div class="category-head">
       <el-button 
       type="success"
       plain
       @click="addCategory"
       >
         新增分类
       </el-button>
     </div>
     <el-table :data="tableData" border stripe style="width: 100%" v-loading="loading">
      <el-table-column min-width='180px' prop="name" label="分类名称" />
      <el-table-column min-width='180px' prop="customOrder" label="自定义排序" />
      <el-table-column min-width='180px' prop="createTime" label="创建时间" /> 
    
      <el-table-column min-width='180px' fixed="right" label="操作">
        <template #default="scope">
          <el-button   
          type="primary"   
          plain
          @click="handleEdit(scope.$index,scope.row)">
            修改
          </el-button>
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
    <categoryDialog ref="categoryRef" :getCategoryList="getCategoryList" :type="type" :data="tags" />
    </div>
  </template>
  
  <script setup lang="ts">
  import {ref,onMounted} from 'vue';
  import {postInfo} from '@/utils';
  import {ElMessage} from 'element-plus';
  import categoryDialog from '@/components/categoryDialog.vue';
  const tableData = ref([]);
  const tags = ref({}); 
  const type = ref('');
  const categoryRef = ref(null);
  const loading = ref(false);
  const addCategory = () => {
    categoryRef.value.open();
    type.value = 'add';
  }
 
  const handleEdit = (index,row) => {
    console.log(index,row);
    categoryRef.value.open();
    type.value = 'edit';
    tags.value = row
 
  }
 
  const handleDelete = async(index,row) => {
   let obj = {id:row.id};
   const res = await postInfo('/delCategory',obj);
   if(res.data.code === 200){
     ElMessage({type:'success',message:res.data.msg});
     await getCategoryList();
   }
 
  }
 
  const getCategoryList = async(data) => {
    loading.value = true;
   const res = await postInfo('/getCategoryList',data);
   loading.value = false;
   tableData.value = res.data.list;
  }
 
  
  onMounted(async() => {
    await getCategoryList();
  })
  
  </script>
  <style lang="scss">
     .category{
       width:100%;
       .category-head{
         display:flex;
         justify-content:flex-start;
         margin:0 auto 18px;
         padding:20px;
         background-color:#ffffff;
       }
     }
     .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li {
      background-color: #ffffff;
      margin: 0 4px;
    }
     @media screen and (max-width:768px){
      .category{
        width:100%;
        .category-head{
          margin:0 auto 5px;
        }
      }
     }
   </style>