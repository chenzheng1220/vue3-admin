import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('login', () => {
  const isLogin = ref(false);
  function updateLogin(val) {
    isLogin.value = val; // 更新响应式状态
  }
  return { 
    isLogin, 
    updateLogin 
  };
})
