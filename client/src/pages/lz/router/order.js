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
        component: () => resolve => require(['../views/order/index'], resolve),
        meta: { title: '订单管理', icon: 'el-icon-s-order' }
    }]
}]