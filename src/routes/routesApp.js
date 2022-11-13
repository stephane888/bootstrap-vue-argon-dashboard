import DashboardLayout from "@/views/Layout/DashboardLayout.vue";
import AuthLayout from "@/views/Pages/AuthLayout.vue";

import NotFound from "@/views/NotFoundPage.vue";

const routes = [
  {
    path: "/",
    redirect: "dashboard",
    component: DashboardLayout,
    meta: {
      requiresAuth: true,
      hideFooter: true,
    },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        meta: {
          requiresAuth: true,
          hideFooter: true,
        },
        component: () =>
          import(/* webpackChunkName: "demo" */ "../views/DashboardApp.vue"),
      },
      {
        path: "/projets",
        name: "Projets",
        meta: {
          requiresAuth: true,
          hideFooter: true,
        },
        component: () =>
          import(
            /* webpackChunkName: "demo" */ "../App/project/ProjetsType.vue"
          ),
      },
    ],
  },
  {
    path: "/",
    redirect: "login",
    component: AuthLayout,
    children: [
      {
        path: "/login",
        name: "login",
        component: () =>
          import(/* webpackChunkName: "demo" */ "../views/Pages/LoGin.vue"),
      },
      {
        path: "/register",
        name: "register",
        component: () =>
          import(/* webpackChunkName: "demo" */ "../views/Pages/RegisTer.vue"),
      },
      { path: "*", component: NotFound },
    ],
  },
];

export default routes;
