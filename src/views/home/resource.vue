<template>
    <div class="resource">
     <div class="resource-head">
       <el-button 
        type="success"
        plain
        @click="addResource"
        >
         新增资源
       </el-button>
      
        <el-select
            v-model="state.selectType"
            clearable
            placeholder="请选择资源类型"
            style="width: 240px"
            @change="changeType"
            >
            <el-option
            v-for="(item,index) in options"
            :key="index"
            :value="item"
            />
        </el-select>
     
     </div>
     <el-table :data="tableData" border  style="width: 100%" v-loading="loading">
      <el-table-column min-width="180px" prop="type" label="资源类型" />
      <el-table-column min-width="180px" prop="name" label="资源名称" />
      <el-table-column min-width="180px" prop="customOrder" label="自定义排序" />
      <el-table-column min-width="180px" prop="createTime" label="创建时间" />
    
      <el-table-column min-width="240px" fixed="right"  label="操作">
        <template #default="scope">
          <el-button   
            type="success"   
            plain
            @click="handleClick(scope.$index,scope.row)">
                查看
          </el-button>
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
    <div class="page">
        <el-pagination
         background 
         layout="prev, pager, next,total" 
         :page-size="state.pageSize"
          :current-page="state.pageNumber"
         @current-change="handleChange"
         :total="total" />
    </div>
    <resourceDialog ref="resourceRef" :getResourceList="getResourceList" :type="type" :data="mydata" />
    </div>
  </template>
  
  <script setup lang="ts">
  import {ref,reactive,onMounted} from 'vue';
  import {postInfo} from '@/utils';
  import {ElMessage} from 'element-plus';
  import resourceDialog from '@/components/resourceDialog.vue';
  const tableData = ref([]);
  const  mydata= ref({}); 
  const type = ref('');
  const resourceRef = ref(null);
  const state = reactive({
    pageNumber:1,
    pageSize:12,
    selectType:''
  })
  const total = ref(0);
  const loading = ref(false);
  const options = ["学习文档","在线工具","资源下载","技术博主"];
  const changeType = (val) => {
    state.selectType = val || '';
    getResourceList(state);
  }
  const addResource = () => {
    resourceRef.value.open();
    type.value = 'add';
  }
 const handleClick = (index,row) => {
    window.open(row.url);
 }
  const handleEdit = (index,row) => {
    console.log(index,row);
    resourceRef.value.open();
    type.value = 'edit';
    mydata.value = row;
 
  }
 
  const handleDelete = async(index,row) => {
   let obj = {id:row.id};
   const res = await postInfo('/delResource',obj);
   if(res.data.code === 200){
     ElMessage({type:'success',message:res.data.msg});
     await getResourceList(state);
   }
 
  }
 
  const getResourceList = async(data) => {
    loading.value = true;
   const res = await postInfo('/getResourceList',data);
   loading.value = false;
   tableData.value = res.data.list;
   total.value = res.data.totalNum;
  }
 
  const handleChange = async(val) => {
    state.pageNumber = val;
    await getResourceList(state);

  }
  
  onMounted(async() => {
    await getResourceList(state);
  })
  
  </script>
  <style lang="scss">
     .resource{
       width:100%;
       .resource-head{
         display:flex;
         justify-content:space-between;
         margin:0 auto 18px;
         padding:20px;
         background-color:#ffffff;
       }
       .page{
        width:100%;
        display:flex;
        justify-content:center;
        margin:50px auto;
       }
     }
     .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li {
      background-color: #ffffff;
      margin: 0 4px;
    }
     @media screen and (max-width:768px){
      .resource{
        width:100%;
        .resource-head{
          margin:0 auto 5px;
        }
        .page{
          margin:30px auto;
        }
      }
     }
   </style>