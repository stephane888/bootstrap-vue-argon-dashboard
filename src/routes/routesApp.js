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
      hideFooter: true
    },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        meta: {
          requiresAuth: true,
          hideFooter: true
        },
        component: () => import("../views/DashboardApp.vue")
      },
      {
        path: "/projets",
        name: "Liste de projets",
        meta: {
          requiresAuth: true,
          hideFooter: true
        },
        component: () => import("../App/project/ProjetsType.vue")
      },
      {
        path: "/rapports",
        name: "Rapport et analyse",
        meta: {
          requiresAuth: true,
          hideFooter: true
        },
        component: () => import("../App/rapports/RapportsAnalyse.vue")
      },
      {
        path: "/projets/:configEntityTypeId/:configEntityId",
        name: "Liste de tache d'un projet",
        meta: {
          requiresAuth: true,
          hideFooter: true
        },
        props: true,
        component: () => import("../App/project/CollectionEntitties.vue")
      },
      {
        path: "/projets/:configEntityTypeId/:configEntityId/:drupalInternalId",
        name: "Taches et sous taches",
        meta: {
          requiresAuth: true,
          hideFooter: true
        },
        props: true,
        component: () =>
          import(/* webpackChunkName: "demo" */ "../App/project/EntityView.vue")
      }
    ]
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
          import(/* webpackChunkName: "demo" */ "../views/Pages/LoGin.vue")
      },
      {
        path: "/register",
        name: "register",
        component: () =>
          import(/* webpackChunkName: "demo" */ "../views/Pages/RegisTer.vue")
      },
      { path: "*", component: NotFound }
    ]
  }
];

export default routes;
