<template>
  <div class="addArticle">
    <el-form
   :model="state.ruleForm"
   :rules="state.rules"
    ref="ruleFormRef"
    label-width="auto"
    label-position="right"
   >
    <el-form-item label="文章标题" prop="title">
        <el-input maxlength="40" show-word-limit size="large" clearable v-model="state.ruleForm.title" placeholder="请输入文章标题" />
    </el-form-item>

    <el-form-item required label="文章内容">
        <MdEditor  editorId="editor" v-model="editor" @onUploadImg="onUploadImg" />
    </el-form-item>
    
    <el-form-item label="文章摘要" prop="introduction">
        <el-input maxlength="100" show-word-limit type="textarea" size="large" clearable v-model="state.ruleForm.introduction" placeholder="请输入文章摘要" />
    </el-form-item>

    <el-form-item label="文章封面" prop="articleCover">
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
            <img v-if="state.ruleForm.articleCover" :src="state.ruleForm.articleCover" class="avatar" alt="articleCover" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
    </el-form-item>

    <el-form-item label="文章分类" prop="category">
      <el-select size="large" style="width:340px;"  clearable v-model="state.ruleForm.category" placeholder="请选择文章分类">
        <el-option 
        v-for="(item,index) in categoryOptions"
        :key="index"
        :label="item"
        :value="item"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="文章标签" prop="tag">
      <el-select multiple size="large" style="width:340px;" clearable v-model="state.ruleForm.tag" placeholder="请选择文章标标签">
        <el-option 
        v-for="(item,index) in tagOptions"
        :key="index"
        :label="item"
        :value="item"
        />
      </el-select>
    </el-form-item>

  

    

    <el-form-item label="自定义排序" prop="customOrder">
      <el-input-number  size="large" :min="0" style="width:340px;" v-model="state.ruleForm.customOrder" />
    </el-form-item>

    <el-form-item label="发布时间" prop="releaseTime">
        <el-date-picker
        size="large"
       style="width:340px;"
        type="date"
        v-model="state.ruleForm.releaseTime"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        placeholder="请选择发布时间"
        clearable
      />
      
    </el-form-item>

    <el-form-item>
      <el-button size="large" style="width:120px;" plain type="primary" @click="submitForm(ruleFormRef)">
        发布文章
      </el-button>
      <el-button size="large" style="width:120px;" plain type="danger" @click="resetForm(ruleFormRef)">
        重置
      </el-button>
    </el-form-item>
  
   </el-form>
  </div>
</template>
  
  <script setup>

  import { reactive, ref,onMounted } from 'vue'  
  import {postInfo,getInfo} from '@/utils';
  import {ElMessage} from 'element-plus';
  import {useRoute,useRouter} from 'vue-router';
  import { MdEditor } from 'md-editor-v3';
  import 'md-editor-v3/lib/style.css';
  import axios from 'axios';
  const router = useRouter();
  const route = useRoute();
  const editor = ref('');
  const ruleFormRef = ref(null);
  const token = localStorage.getItem("token") || '';
  const {id} = route.query;
  const categoryOptions = ref([]);
  const tagOptions = ref([]);
  const state = reactive({
    ruleForm:{
      title: '',
      introduction: '',
      category: '',
      tag:[],
      articleCover: '',
      content:'',
      customOrder:0,
      releaseTime: '',
    },
    rules:{
      title:[
        {required:true,message:'文章标题不能为空',trigger:'blur'}
      ],
      introduction:[
        {required:true,message:"文章摘要不能为空",trigger:'blur'}
      ],
      category:[
        {required:true,message:"文章分类不能为空",trigger:'blur'}
      ],
      tag:[
        {required:true,message:"文章标签不能为空",trigger:'blur'}
      ],
      articleCover:[
        {required:true,message:'文章封面不能为空',trigger:'blur'}
      ],
      customOrder:[
        {required:true,message:"自定义排序不能为空",trigger:'blur'}
      ],
      releaseTime:[
        {required:true,message:"发布时间不能为空",trigger:'blur'}
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
    state.ruleForm.articleCover = response.data;
    ElMessage({type:'success',message:response.msg});
    
  }

  const handleAvatarError = (error) => {
    error ? ElMessage({type:'error',message:"权限不足，无法执行此操作！"}) : '';
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
      state.ruleForm.content = editor.value;
      state.ruleForm.id = id ? parseInt(id) : '';
      let url = id ? '/updateArticle':'/addArticle';
      const res = await postInfo(url,state.ruleForm);
      if(res.data.code === 200){
        ElMessage({type:'success',message:res.data.msg});
        router.push({path:'/article'});
      }
    
    } else {
      console.log('error submit!',fields);
    }
  })
}

const resetForm = () => {
  if (!ruleFormRef.value) return
  ruleFormRef.value.resetFields();
  editor.value = '';
}

const getCategoryList = async() => {
  const res = await postInfo('/getCategoryList');
  categoryOptions.value = res.data.list.reduce((acc,item) => [...acc,item.name],[]);

}

const getTagList = async() => {
  const res = await getInfo('/getTagList');
  const data = res.data.list.reduce((acc,item) => [...acc,item.name],[]);
  tagOptions.value = [...new Set(data)];

}
onMounted(async() => {
    await getCategoryList();
    await getTagList();
    if(id){
      const res = await getInfo('/getArticle',{id:id});
      editor.value = res.data.data.content;
      state.ruleForm = {
        title: res.data.data.title,
        introduction:res.data.data.introduction,
        category: res.data.data.category,
        tag:res.data.data.tag,
        articleCover: res.data.data.articleCover,
        customOrder:res.data.data.customOrder,
        releaseTime:res.data.data.releaseTime,
      };
    }
})
  
  </script>

  <style lang="scss">
    .addArticle{
      background-color: #ffffff;
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
  </style>
  