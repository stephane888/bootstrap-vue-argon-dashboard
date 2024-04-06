import Vue from "vue";
import Vuex from "vuex";
import config from "./rootConfig";
import storeProject from "./App/project/storeProject";
import router from "./routes/router";
import itemsEntity from "drupal-vuejs/src/App/jsonApi/itemsEntity.js";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    /**
     * information concernant l'utilisateur connecté.
     */
    user: null,

    /**
     * Roles attribues à l'utilisateur. Cela permet d'afficher certaines informations facilitant l'utilisation.
     * Cela ne modifie ou n'impacte pas les actions au niveau du serveur.
     */
    roles: [],

    /**
     * Contient les informations de configuration des utilisateurs
     */
    userConfig: {},

    /**
     * Contient les informations utile sur l'utlisateur connecté.
     */
    userInfos: [],

    /**
     * Contient la valeur de rediection.( Par defaut / );
     */
    redirectAfterLogin: "/",

    /**
     * Liste des utilisateurs.
     */
    users: []
  },
  getters: {
    isLoggedIn(state) {
      if (state.user) return true;
      else return false;
    },
    /**
     * Recupere le type d'entity en function de l'url si cela est possible.
     * getter ne marche pas avec les changements de route.
     * On ne peut pas obtenir le bundle dela route car le changement de route n'est pas vue par getters.
     * @deprecated on doit tester cela avc d'autre entité que "app_project_type"?
     * @returns
     */
    entity_type_id: () => {
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
    uid(state) {
      if (state.user && state.user.current_user.uid) {
        return state.user.current_user.uid;
      } else return false;
    }
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_USERS(state, users) {
      state.users = users;
    },
    SET_ROLES(state, roles) {
      state.roles = roles;
    },
    SET_URL_REDICTION(state, url) {
      state.redirectAfterLogin = url;
    },
    SET_USER_CONFIG(state, payload) {
      state.userConfig = payload;
    },
    SET_USER_INFOS(state, payload) {
      state.userInfos = payload;
    }
  },
  actions: {
    /**
     * Permet d'envoyer les identifiants de l'utilisateur.
     * @param {*} param0
     * @param {*} values
     */
    login({ commit, dispatch }, values) {
      return new Promise((resolv, reject) => {
        config
          .login(values)
          .then((resp) => {
            commit("SET_USER", resp.data);
            // On charge les informations utile concernant l'utilisateur.
            dispatch("userConfig");
            resolv(resp.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    /**
     * Permet de charger la configuration de l'utilisateur.
     */
    userConfig({ commit, state }) {
      const uid =
        state.user && state.user.current_user.uid
          ? state.user.current_user.uid
          : false;
      if (uid) {
        config.dGet("/gestion-project-v2/user-config/" + uid).then((resp) => {
          commit("SET_USER_CONFIG", resp.data);
          commit("SET_ROLES", resp.data.roles);
        });
      }
    },
    /**
     * Permet de charger les informations utile sur l'utilisateur.
     */
    userInfos({ commit, state }) {
      const uid =
        state.user && state.user.current_user.uid
          ? state.user.current_user.uid
          : false;
      if (uid) {
        config.dGet("/gestion-project-v2/user-infos/" + uid).then((resp) => {
          commit("SET_USER_INFOS", resp.data);
        });
      }
    },
    userIsAdministrator({ state }) {
      if (state.roles.length > 0) {
        return state.roles.includes("administrator");
      } else return false;
    },
    userIsManager({ state }) {
      if (state.roles.length > 0) {
        state.roles.includes("manager");
      } else return false;
    },
    userIsEmployee({ state }) {
      if (state.roles.length > 0) {
        return state.roles.includes("employee");
      } else return false;
    },
    userIsPerformer({ state }) {
      if (state.roles.length > 0) {
        return state.roles.includes("performer");
      } else return false;
    },
    /**
     * Permet de verifier si l'utilisateur s'est deja authentifier.
     */
    CheckUserIsLogin({ commit, dispatch }) {
      const cre = config.checkCurrentUserIsLogin();
      if (cre) {
        commit("SET_USER", cre);
        // On charge les informations utile concernant l'utilisateur.
        dispatch("userConfig");
      }
    },
    /**
     * Deconnexion de l'utilisateur
     */
    deleteConnexion({ commit }) {
      // il faudrait vider les entites chargées.
      commit("storeProject/CLEAN_ENTITY_EDIT");
      commit("storeProject/SET_ENTITIES", []);
      commit("storeProject/SET_PROJECTS", []);
      commit("storeProject/SET_CLEAN_CURRENT_PROJECT");
      config.deleteConnexion();
      commit("SET_USER", null);
    },
    /**
     * Liste des utilisateurs, utilisé dans plusieurs fonctionnalitées;
     */
    getUsers({ commit, state }) {
      let vocabulary = "user";
      if (vocabulary && config && Object.keys(state.users).length === 0) {
        const terms = new itemsEntity(vocabulary, vocabulary, config);
        terms.remplaceConfig();
        terms.filter("status", "=", 1);
        terms.get().then(() => {
          commit("SET_USERS", terms.getOptions());
        });
      }
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
    }
  },
  modules: {
    storeProject: storeProject
  }
});
