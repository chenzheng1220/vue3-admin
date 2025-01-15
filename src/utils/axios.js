import axios from 'axios';
import router from '@/router';
import { ElMessage } from 'element-plus';
const service = axios.create({
    baseURL:'/api',
    withCredentials: false, // 跨域请求是否需要携带cookie
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=utf-8",
      },
    timeout: 3000, // 请求超时时间

})

// 请求拦截
service.interceptors.request.use(
    
    (config) => {
      // 如果开启token认证
      const token = localStorage.getItem("token") || '';
      token && (config.headers.Authorization = `Bearer ${token}`)
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );


  
  let isRefreshing = false;//是否开启刷新token
  let pendingRequests = [];//等待请求的队列
  service.interceptors.response.use(
    (response) => {
      return response;
    },
    async(error) => {
      const originalRequest = error.config;
      // 响应数据失败的处理逻辑
      if(error.response.status === 401 && !isRefreshing){
        isRefreshing = true;
        try{
          const refreshToken = localStorage.getItem('refreshToken');
          const res = await axios.post('/refreshToken',{token:refreshToken});
          const {token} = res.data;
          localStorage.setItem('token',token);
          //重试原始请求
          pendingRequests.forEach(callback => callback(token));
          pendingRequests = [];
          return service(originalRequest)
        }catch(error){
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          router.push({path:'/login'});
          return Promise.reject(error); 
        }finally{
          isRefreshing = false;
        }

        //router.push({path:'/login'});
      }
      if(isRefreshing){
        return new Promise((resolve,reject) => {
          pendingRequests.push(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            resolve(service(originalRequest));
          })
        })
      }
      if(error.response.status === 403 || error.response.status === 404 || error.response.status === 500 ){
        ElMessage({type:"error",message:error.response.data.msg});
      }
      if(error.response.status === 409){
        ElMessage({type:"warning",message:error.response.data.msg});
      }
     

      // else if(error.response.data.msg){
      //   
      // }
      // else{
      //   ElMessage({type:"error",message:error.response.statusText});
      // }
    

     
      
      return Promise.reject(error);
    }
  );

export default service;