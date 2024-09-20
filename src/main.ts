import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'
import router from "./router";
import 'intro.js/introjs.css'
import './style.css'
import 'vant/es/toast/style';
// 创建 Pinia 实例
const pinia = createPinia();
const app = createApp(App)
app.use(router)
// 使用 Pinia
app.use(pinia);
app.mount('#app')
