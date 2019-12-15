import Layout from "@/layout";

export default [
  {
    path: "/",
    name: "home",
    component: Layout,
    redirect: "/",
    children: [
      {
        path: "/",
        name: "home",
        component: () => import("./views/home"),
        meta: { title: "首页", icon: "el-icon-s-home" }
      }
    ]
  },
  {
    path: "/order",
    name: "order",
    component: Layout,
    redirect: "/list",
    children: [
      {
        path: "list",
        name: "order-list",
        component: () => import("./views/order/index"),
        meta: { title: "订单管理", icon: "el-icon-s-order" }
      },
      {
        path: "detail",
        name: "order-list",
        hidden: true,
        component: () => import("./views/order/index"),
        meta: { title: "订单详情" }
      }
    ]
  },
  {
    path: "/plat",
    name: "plat",
    component: Layout,
    redirect: "/list",
    children: [
      {
        path: "list",
        name: "plat-list",
        component: () => import("./views/plat"),
        meta: { title: "平台管理", icon: "el-icon-menu" }
      }
    ]
  },
  {
    path: "/ticket-count",
    name: "ticket-count",
    component: Layout,
    redirect: "/list",
    children: [
      {
        path: "list",
        name: "ticket-count-list",
        component: () => import("./views/ticket-count"),
        meta: { title: "票量管理", icon: "el-icon-s-ticket" }
      }
    ]
  },
  {
    path: "/ticket",
    name: "ticket",
    component: Layout,
    redirect: "/list",
    children: [
      {
        path: "list",
        name: "ticket-list",
        component: () => import("./views/ticket"),
        meta: { title: "票务管理", icon: "el-icon-s-management" }
      }
    ]
  },
  {
    path: "/user",
    name: "user",
    component: Layout,
    redirect: "/list",
    children: [
      {
        path: "list",
        name: "user-list",
        component: () => import("./views/user"),
        meta: { title: "用户管理", icon: "el-icon-user-solid" }
      }
    ]
  }
];
