// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import store from './data/store'; // Cập nhật đường dẫn đúng
import router from './router';
import eventBus from './router/eventBus';
import { createPinia } from "pinia";


const pinia = createPinia();
const app = createApp(App);
app.provide('eventBus', eventBus);
app.use(router);
app.use(store); // Sử dụng Vuex
app.mount('#app');
app.use(pinia); // 🛠️ Đăng ký Pinia trước khi sử dụng store
