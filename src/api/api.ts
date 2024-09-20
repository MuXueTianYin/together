import axios from 'axios';
import router from "../router";
import {showFailToast} from "vant";

// 创建 axios 实例
const service = axios.create({
    baseURL: '/api', // API 的 base URL
    timeout: 10000 // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
    config => {
        // 在这里可以做一些请求前的操作
        /*
        * 设置全局token
        * */
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        // 处理请求错误
        console.error(error); // for debug
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    response => {
        // 在这里可以做一些响应数据的操作
        console.log(response)
        if (response.data && response.data.code === 40101) {
            // 如果返回的状态码为40101，说明token过期，清除token并跳转到登录页面
            showFailToast('登录已经过期');
            localStorage.removeItem('token');
            router.push('/login');
        }
        // 如果请求的 URL 包含 '/students/export/'，则返回整个响应对象

        if (response.config.url?.includes('/students/export/')) {
            return response;
        }
        return response.data;
    },
    error => {
        // 处理响应错误
        console.error(error); // for debug
        return Promise.reject(error);
    }
);

export default service;
