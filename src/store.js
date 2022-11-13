import Vue from "vue";
import Vuex from "vuex";
import config from "./rootConfig";
import storeProject from "./App/project/storeProject";
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
    /**
     * Permet d'envoyer les identifiants de l'utilisateur.
     * @param {*} param0
     * @param {*} values
     */
    login({ commit }, values) {
      config.login(values).then((resp) => {
        commit("SET_USER", resp.data);
      });
    },
    /**
     * Permet de verifier si l'utilisateur s'est deja authentifier.
     */
    CheckUserIsLogin({ commit }) {
      const cre = config.checkCurrentUserIsLogin();
      if (cre) {
        commit("SET_USER", cre);
      }
    },
  },
  modules: {
    storeProject: storeProject,
  },
});
