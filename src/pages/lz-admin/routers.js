import Layout from '@/layout';
export default [{
    path: '/',
    name: 'order',
    component: Layout,
    redirect: '/list',
    children: [{
        path: 'list',
        name: 'order-list',
        component: () => import('./views/order/index'),
        meta: { title: '订单管理', icon: 'el-icon-s-order' }
    }]
}]