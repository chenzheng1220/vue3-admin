import { ref,watchEffect } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('login', () => {
  const isLogin = ref(false);
  isLogin.value = localStorage.getItem('isLogin') || false;
  watchEffect(() => {
    if(isLogin.value){
      localStorage.setItem('isLogin',isLogin.value);
    }else{
      localStorage.removeItem('isLogin');
    }
  })  
  function updateLogin(val) {
    isLogin.value = val; // 更新响应式状态
  }
  function clearLogin() {
    isLogin.value = false; // 更新响应式状态
  }
  // 暴露给组件使用的方法和变量       
  return { 
    isLogin, 
    updateLogin,
    clearLogin
  };
})
