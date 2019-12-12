import Layout from '@/layout';

export default [{
    path: '/order',
    name: 'order',
    component: Layout,
    redirect: '/order/list',
    // meta: { title: '引导指南', icon: 'el-icon-s-flag' },
    children: [{
        path: 'list',
        name: 'order-list',
        component: () => import('../views/order/index'),
        meta: { title: '订单管理', icon: 'el-icon-s-order' }
    }]
}]