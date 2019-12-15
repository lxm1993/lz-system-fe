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
    },
    {
        path: '/user',
        name: 'user',
        component: Layout,
        redirect: '/list',
        children: [{
                path: 'list',
                name: 'user-list',
                component: () => import('./views/user/index'),
                meta: { title: '用户管理', icon: 'el-icon-user-solid' }
            },
            {
                path: 'create',
                name: 'user-create',
                hidden: true,
                component: () => import('./views/user/create'),
                meta: { title: '新建用户' }
            }
        ]
    },
    {
        path: '/plat',
        name: 'plat',
        component: Layout,
        redirect: '/list',
        children: [{
                path: 'list',
                name: 'plat-list',
                component: () => import('./views/plat/index'),
                meta: { title: '平台管理', icon: 'el-icon-menu' }
            },
            {
                path: 'create',
                name: 'plat-create',
                hidden: true,
                component: () => import('./views/plat/create'),
                meta: { title: '新建平台' }
            }
        ]
    },
]