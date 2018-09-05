import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/dashboard',
                    component: resolve => require(['../pages/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/order',
                    component: resolve => require(['../pages/BaseTable.vue'], resolve),
                    meta: { title: '订单管理' }
                },
                {
                    path: '/hotel',
                    component: resolve => require(['../pages/hotel.vue'], resolve),
                    meta: { title: '首页图文' }
                },
                {
                    path: '/editor',
                    component: resolve => require(['../pages/editor.vue'], resolve),
                    meta: { title: '酒店详情' }
                },
                {
                    // banner
                    path: '/catebanner',
                    component: resolve => require(['../pages/cate-banner.vue'], resolve),
                    meta: { title: 'banner管理' }
                },
                {
                    // 美食菜谱
                    path: '/catelist',
                    component: resolve => require(['../pages/cate-list.vue'], resolve),
                    meta: { title: '美食菜谱' }
                },
                {
                    // 客房服务
                    path: '/servicelist',
                    component: resolve => require(['../pages/service-list.vue'], resolve),
                    meta: { title: '客房服务' }
                },
                {
                    // 菜品管理
                    path: '/catemangage',
                    component: resolve => require(['../pages/cate-mangage.vue'], resolve),
                    meta: { title: '菜品管理' }
                },
                {
                    //服务产品管理
                    path: '/servicemangage',
                    component: resolve => require(['../pages/service-mangage.vue'], resolve),
                    meta: { title: '服务管理' }
                },
                {
                    //优惠券
                    path: '/coupon',
                    component: resolve => require(['../pages/coupon.vue'], resolve),
                    meta: { title: '优惠券' }
                },
                {
                    //游记
                    path: '/travel',
                    component: resolve => require(['../pages/travel.vue'], resolve),
                    meta: { title: '游记管理' }
                },
                {
                    //话题列表
                    path: '/topic',
                    component: resolve => require(['../pages/topic.vue'], resolve),
                    meta: { title: '话题列表' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../pages/Login.vue'], resolve),
            meta: { title : '铂尔曼'}
        },
        {
            path: '/404',
            component: resolve => require(['../pages/404.vue'], resolve)
        },
        {
            path: '/403',
            component: resolve => require(['../pages/403.vue'], resolve),
             meta: { title : '403'}
        },
        {
            path: '*',
            redirect: '/404',
            meta: { title : '404'}
        }
    ]
})
