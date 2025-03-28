<template>
    <div>
      <ComHeader /> 
      <h1>Chào mừng đến với trang chủ!</h1>
      <p>Đây là trang mà người dùng bình thường có thể xem khi đăng nhập.</p>
    </div>
  </template>
  
  <script>
    import ComHeader from '@/components/ComHeader.vue'; 
  
  export default {
    name: 'HomePage',
    components: {
      ComHeader, 
    },
  };
  </script>
  
  <style scoped>
  h1 {
    color: #42b983;
  }



  </style>
  