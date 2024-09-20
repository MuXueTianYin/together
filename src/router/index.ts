import { createRouter, createWebHistory,RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import Index from '../pages/Index.vue'
const Team = () => import('../pages/Team.vue')
const User = () => import('../pages/User.vue')
const routes = [
    { path: '/', component: Index, meta: { showHeaderFooter: true,title:'苏永儿的主页' } },
    { path: '/team', component: Team , meta: { showHeaderFooter: true,title:'队伍',showExport:"students" }},
    { path: '/user', component: User, meta: { showHeaderFooter: true,title:'个人' }  },
    { path: '/search', component: () => import('../pages/Search.vue') },
    { path: '/report', component: () => import('../pages/Report.vue') },
    { path: '/register', component: () => import('../pages/Register.vue') },
    {
        path: '/login',
        name: 'Login',
        meta: {title:'苏永儿的主页' },
        component: () => import('../pages/Login.vue'),
        beforeEnter: (_: RouteLocationNormalized, __: RouteLocationNormalized, next: NavigationGuardNext) => {
            const token = localStorage.getItem('token');
            if (token) {
                // 如果用户已登录，重定向到首页
                next('/');
            } else {
                next();
            }
        },
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.VUE_APP_BASE_URL),
    routes,
})
/*
* 需要路由初始化 要添加在文件的末尾，就在 export default router 之前。
* */
router.beforeEach((to: RouteLocationNormalized, _: RouteLocationNormalized, next: NavigationGuardNext) => {
    const token = localStorage.getItem('token');
    if (!token && to.path !== '/login' && to.path !== '/register') {
        // 如果用户未登录且访问的不是登录页面，则重定向到登录页面
        next('/login');
    } else {
        next();
    }
});
export default router
