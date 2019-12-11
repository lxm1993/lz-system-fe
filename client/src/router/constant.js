import Layout from '@/layout';
export default [{
        path: '/error',
        name: 'error',
        component: () => import('@/commonViews/error'),
        hidden: true,
    }, {
        path: '/',
        name: 'home',
        component: Layout,
        redirect: '/home',
        meta: {
            title: '首页',
        },
        hidden: true,
        children: [{
            path: 'home',
            hidden: true,
            component: () => import('@/commonViews/home'),
        }],
    },
    //{
    //     path: '*',
    //     redirect: '/error',
    //     hidden: true,
    //     realpath: '*',
    // }
]