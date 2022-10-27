import Vue from "vue";
import Vuex from "vuex";
import config from "./rootConfig";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    /**
     * information concernant l'utilisateur connecté.
     */
    user: null,
    /**
     * Contient la valeur de rediection.( Par defaut / );
     */
    redirectAfterLogin: "/",
  },
  getters: {
    isLoggedIn(state) {
      if (state.user) return true;
      else return false;
    },
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_URL_REDICTION(state, url) {
      state.redirectAfterLogin = url;
    },
  },
  actions: {
    getUtilisateur({ commit }) {
      config
        .post(
          "/gestion-project/users",
          {},
          {
            headers: {
              Authorization: config.auth,
            },
          }
        )
        .then((reponse) => {
          console.log("reponse", reponse);
          if (reponse.status) {
            if (reponse) {
              commit("SET_UTILISATEUR", reponse.data);
            }
          }
        })
        .catch(function (error) {
          console.log("error user", error);
        });
    },
    login({ commit }, values) {
      config.login(values).then((resp) => {
        console.log(resp);
        commit("SET_USER", resp.data);
      });
    },
  },
});
