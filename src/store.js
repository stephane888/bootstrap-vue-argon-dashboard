import Vue from "vue";
import Vuex from "vuex";
import config from "./rootConfig";
import storeProject from "./App/project/storeProject";
import router from "./routes/router";
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
    /**
     * Recupere le type d'entity en function de l'url si cela est possible.
     * getter ne marche pas avec les changements de route.
     * @returns
     */
    entity_type_id: () => {
      console.log(router);
      if (
        router.history &&
        router.history.current.params &&
        router.history.current.params.configEntityTypeId
      ) {
        var entity_type_id = null;
        switch (router.history.current.params.configEntityTypeId) {
          case "app_project_type":
            entity_type_id = "app_project";
            break;
        }
        return entity_type_id;
      } else return null;
    },
    /**
     * Retourne le bundle de l'entite encours.
     * On ne peut pas obtenir le bundle dela route car le changement de route n'est pas vue par getters.
     * @returns
     */
    bundle: (router) => {
      console.log(" routerParams : ", router.history);
      if (
        router.history &&
        router.history.current.params &&
        router.history.current.params.configEntityId
      ) {
        return router.history.current.params.configEntityId;
      } else return null;
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
      return new Promise((resolv, reject) => {
        config
          .login(values)
          .then((resp) => {
            commit("SET_USER", resp.data);
            resolv(resp.data);
          })
          .catch((err) => {
            reject(err);
          });
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
    /**
     * Deconnexion de l'utilisateur
     */
    deleteConnexion({ commit }) {
      config.deleteConnexion();
      commit("SET_USER", null);
    },

    /**
     * Utiliser par FormUtilities afin de faire la sauvegarde.
     *
     * @param {*} param0
     * @param {*} payload
     * @returns
     */
    saveEntity({}, payload) {
      return new Promise((resolv, reject) => {
        if (payload.entity_type_id == undefined || !payload.entity_type_id) {
          reject("Paramettre manquant");
        } else
          config
            .dPost(
              "/apivuejs/save-entity/" + payload.entity_type_id,
              payload.value
            )
            .then((resp) => {
              resolv(resp);
            })
            .catch((er) => {
              reject(er);
            });
      });
    },
  },
  modules: {
    storeProject: storeProject,
  },
});
