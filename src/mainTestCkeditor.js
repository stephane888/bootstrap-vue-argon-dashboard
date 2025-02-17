/*!

=========================================================
* BootstrapVue Argon Dashboard - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/bootstrap-vue-argon-dashboard
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Vue from "vue";
//import DashboardPlugin from "./plugins/dashboard-plugin";
//import App from "./App.vue";
import App from "./tests/TestCkeditor.vue";

// router setup
//import router from "./routes/router";

//import store from "./store";

// Verification de l'authentification.
// store.dispatch("CheckUserIsLogin");
// router.beforeEach((to, from, next) => {
//   if (to.matched.some((record) => record.meta.requiresAuth)) {
//     // this route requires auth, check if logged in
//     // if not, redirect to login page.
//     if (!store.getters.isLoggedIn) {
//       //store.dispatch("getUtilisateur");
//       next({ name: "login" });
//     } else {
//       next(); // go to wherever I'm going
//     }
//   } else {
//     next(); // does not require auth, make sure to always call next()!
//   }
// });
// // plugin setup
// Vue.use(DashboardPlugin);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: (h) => h(App),
  // store,
  //  router,
});
