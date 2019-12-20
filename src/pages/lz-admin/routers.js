import Layout from "@/layout";

export default [{
        path: "/",
        name: "home",
        component: Layout,
        redirect: "/",
        children: [{
            path: "/",
            name: "home",
            component: () => import("./views/home"),
            meta: { title: "首页", icon: "el-icon-s-home" }
        }]
    },
    {
        path: "/order",
        name: "order",
        component: Layout,
        redirect: "/list",
        children: [{
                path: "list",
                name: "order-list",
                component: () => import("./views/order/index"),
                meta: { title: "订单管理", icon: "el-icon-s-order", activeMenu: 'order-list' }
            },
            {
                path: "view/:id",
                name: "order-list",
                hidden: true,
                component: () => import("./views/order/view"),
                meta: { title: "订单管理 / 订单详情", activeMenu: 'order-list' }
            }
        ]
    },
    {
        path: "/ticket-assign",
        name: "ticket-assign",
        component: Layout,
        redirect: "/list",
        children: [{
            path: "list",
            name: "ticket-assign-list",
            component: () => import("./views/ticket-assign"),
            meta: { title: "票量管理", icon: "el-icon-s-ticket" }
        }]
    },
    {
        path: "/plat",
        name: "plat",
        component: Layout,
        redirect: "/list",
        children: [{
            path: "list",
            name: "plat-list",
            component: () => import("./views/plat"),
            meta: { title: "平台管理", icon: "el-icon-menu" }
        }]
    },
    {
        path: "/ticket",
        name: "ticket",
        component: Layout,
        redirect: "/type",
        meta: { title: "票务配置", icon: "el-icon-s-management" },
        children: [{
            path: "type",
            name: "ticket-type",
            component: () => import("./views/ticket-type"),
            meta: { title: "票务类型配置", icon: "el-icon-bank-card" }
        }, {
            path: "commission",
            name: "ticket-commission",
            component: () => import("./views/ticket-commission"),
            meta: { title: "分佣配置", icon: "el-icon-money" }
        }]
    },
    {
        path: "/agent",
        name: "agent",
        component: Layout,
        redirect: "/list",
        children: [{
                path: "list",
                name: "agent-list",
                component: () => import("./views/agent"),
                meta: { title: "商家管理", icon: "el-icon-menu", activeMenu: 'agent-list' }
            },
            {
                path: "account/:id",
                name: "agent-account",
                hidden: true,
                component: () => import("./views/agent-account"),
                meta: { title: "商家管理 / 账户管理", activeMenu: 'agent-list' }
            }
        ]
    },
    {
        path: "/account",
        name: "account",
        component: Layout,
        redirect: "/list",
        children: [{
            path: "list",
            name: "account-list",
            component: () => import("./views/account"),
            meta: { title: "用户管理", icon: "el-icon-user-solid" }
        }]
    },
];