<template>
   <div class="article">
    <div class="article-head">
      <el-button 
      type="success"
      plain
      @click="addArticle"
      >
        新增文章
      </el-button>
      <el-select
        v-model="value"
        clearable
        placeholder="请选择文章类型"
        style="width: 240px"
        @change="changeCategory"
      >
        <el-option
          v-for="item in options"
          :value="item"
        />
  </el-select>
    </div>
    <el-table :data="tableData" border stripe style="width: 100%">
     <el-table-column min-width='180px' show-overflow-tooltip prop="title" label="标题" />
     <el-table-column min-width='180px' show-overflow-tooltip prop="introduction" label="摘要" />
     <el-table-column min-width='180px' label="缩略图" >
      <template #default="scope">
        <div style="display: flex; align-items: center;justify-content: center;">
            <img width="100px" height="100px" style="object-fit: cover;object-position: center top;" :src="scope.row.articleCover"/>
        </div>
      </template>
     </el-table-column>
     <el-table-column min-width='180px' prop="category" label="分类名称" />
     <el-table-column min-width='180px' prop="customOrder" label="自定义排序" />
     <el-table-column min-width='180px' prop="releaseTime" label="发布时间" />

     <el-table-column min-width='240px' fixed="right" label="操作">

       <template #default="scope">
        <el-button   
         type="success"   
         plain
         @click="handleView(scope.$index,scope.row)">
           查看
         </el-button>
         <el-button   
         type="primary"   
         plain
         @click="handleEdit(scope.$index,scope.row)">
           编辑
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
   <div class="page">
    <el-pagination 
      background 
      layout="prev, pager, next" 
      :current-page="state.pageNumber" 
      :page-size="state.pageSize" 
      @current-change="handleCurrentChange"
      :total="total" />
   </div>
   </div>
 </template>
 
 <script setup>
 import {ref,reactive,onMounted} from 'vue';
 import {useRouter} from 'vue-router';
 import {postInfo} from '@/utils';
 import {ElMessage} from 'element-plus';
 const router = useRouter();
 const tableData = ref([]);
 const state = reactive({keyword:'',pageNumber:1,pageSize:12});
 const total = ref(0);
 const options = ref([]);
 const addArticle = () => {
  router.push({path:'/addArticle'})
 }

 const handleView = (index,row) => {
   window.open(`http://lejibiji.cn/article?id=${row.id}`);
 }

 const handleEdit = (index,row) => {

   router.push({path:'/addArticle',query:{id:row.id}});

 }

 const handleDelete = async(index,row) => {
  let obj = {id:row.id};
  const res = await postInfo('/delArticle',obj);
  if(res.data.code === 200){
    ElMessage({type:'success',message:res.data.msg});
    await getArticleList(JSON.stringify(state));
  }

 }

 const getArticleList = async(data) => {
  const res = await postInfo('/getArticleList',data);
  tableData.value = res.data.list;
  total.value = res.data.totalNum;
 }

 const getCategoryList = async() => {
  const res = await postInfo('/getCategoryList');
  const list = res.data.list;
  options.value = list.reduce((acc,item) => [...acc,item.name],[]);
 }

 const handleCurrentChange = async(val) => {
  state.pageNumber = val;
  await getArticleList(state);
 }
 
 const changeCategory = (val) => {
  state.keyword = val || '';
  console.log(state)
  getArticleList(state);

 }
 
 onMounted(async() => {
  await getCategoryList();
  await getArticleList(JSON.stringify(state));

 })
 
 </script>
 <style lang="scss">
    .article{
      width:100%;
      .article-head{
        display:flex;
        justify-content: space-between;
        margin:0 auto 18px;
        padding:20px;
        background-color:#ffffff;
      }
      .page{
        display:flex;
        justify-content: center;
        margin:50px auto;
      }
    }
    @media screen and (max-width:768px){
      .article{
        width:100%;
        .article-head{
          margin:0 auto 5px;
        }
        .page{
          margin:30px auto;
        }
      }
    }
  </style>