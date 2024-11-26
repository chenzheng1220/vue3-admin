<template>
    <div class="comments">
         <el-table :data="tableData" border stripe style="width:100%;">
            <el-table-column min-width='180px' label="文章ID" prop="articleId"/>
            <el-table-column min-width='180px' label="昵称" prop="nickname"/>
            <el-table-column min-width='180px' show-overflow-tooltip label="评论内容" prop="content" />
            <el-table-column min-width='180px' label="所在城市" prop="city"/>
            <el-table-column min-width='180px' label="审核是否通过" prop="state">
                <template #default="scope">
    
                    <el-switch @change="handleChange(scope.row.id,$event)"  v-model="scope.row.state" />
                   
                </template>
            </el-table-column>
            <el-table-column min-width='180px' label="发布时间" prop="date" />
           <el-table-column min-width='180px' fixed="right" label="操作">
                <template #default="scope">
                    <el-button plain type="primary" @click="handleClick(scope.row.id)">
                        查看
                    </el-button>
                    <el-popconfirm
                     title="确定删除？"
                     confirm-button-text="确定"
                     cancel-button-text="取消"
                     icon-color="#626AEF"
                     @confirm="handleDel(scope.row.id)"
                     >
                     <template #reference>
                        <el-button plain type="danger" >
                         删除
                        </el-button>
                     </template>
                    </el-popconfirm>
                </template>
           </el-table-column>
         </el-table>
         <div class="page">
            <el-pagination
            background
            layout="prev,pager,next"
            :current-page="state.pageNumber"
            :page-size="state.pageSize"
            @current-change="changeCurrentPage"
              :total="total"
             />
         </div>

         <commentsDialog ref="commentsDialogRef" :id="id"/>

      
         
    </div>
 </template>
 
 <script setup>
 import {ref,reactive,onMounted} from 'vue';
 import {postInfo} from '@/utils';
import { ElMessage } from 'element-plus';
import commentsDialog from '@/components/commentsDialog.vue';
const total = ref(0);
 const state = reactive({
    pageNumber:1,
    pageSize:12
 })
 const id = ref(null);
 let tableData = ref([]);
 const commentsDialogRef = ref(null);
  const getCommentsList = async() => {
    const res = await postInfo('/getCommentsList',state);
    const list = res.data.list.map(item => {
        item.state === 1 ?item.state = true : item.state = false;
        return item;
    })
    
    tableData.value = list;
    total.value = res.data.totalNum;
  }

  
  const handleClick = async(val) => {
    id.value = val;
    commentsDialogRef.value.open();
  }
  const changeCurrentPage = async(val) => {
    state.pageNumber = val;
    await getCommentsList();
  }
  
  const handleDel = async(id) => {
    const res = await postInfo('/delComments',{id:id});
    if(res.data.code === 200){
        ElMessage({type:'success',message:res.data.msg});
        await getCommentsList();
    }
  }

  const handleChange = async(id,state) => {
    try{
        let obj = {
          id:id,
          state:state === true ? 1 :0
      }
      const res = await postInfo('/updateCommentsState',obj);
      if(res.data.code === 200){
          ElMessage({type:'success',message:res.data.msg});
      }
    }catch(error){
      await getCommentsList();
    }


  }

  onMounted(async() => {
    await getCommentsList();
  })
 </script>
 
 <style lang="scss">
    .comments{
        width:100%;
        .page{
            display:flex;
            justify-content:center;
            margin:50px auto;
        }
    }
    @media screen and (max-width:768px){
      .comments{
        width:100%;
        .page{
          margin:30px auto;
        }
      }
    }
 </style>