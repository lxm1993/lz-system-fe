import Layout from '@/layout';

export default [{
        path: '/',
        name: 'home',
        component: Layout,
        redirect: '/',
        children: [{
            path: '/',
            name: 'home',
            component: () => import('./views/home'),
            meta: { title: '首页', icon: 'el-icon-s-home' }
        }]
    },
    {
        path: '/order',
        name: 'order',
        component: Layout,
        redirect: '/list',
        children: [{
                path: 'list',
                name: 'order-list',
                component: () => import('./views/order/index'),
                meta: { title: '订单管理', icon: 'el-icon-s-order' }
            },
            {
                path: 'detail',
                name: 'order-list',
                hidden: true,
                component: () => import('./views/order/index'),
                meta: { title: '订单详情' }
            }
        ]
    }
]