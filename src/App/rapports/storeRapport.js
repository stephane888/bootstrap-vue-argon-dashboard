//import store from "../../store";
//import Vue from "vue";
import request from "../request";

const entity_type_project = () => {
  return {
    id: "",
    label: "",
    description: "",
    private: false,
    users: []
  };
};
export default {
  namespaced: true,
  state: () => ({
    users_rapports: [],
    /**
     * Actif s'il ya une sauvegarde encours.
     */
    running: false,

    /**
     * Contient les chamaps permettant d'effectuer un filtrage.
     */
    filters: {
      date_begin: null,
      date_end: null,
      status_execution: ["new", "running", "break", "end"],
      user_id: null
    }
  }),
  mutations: {
    SET_USERS_RAPPORTS(state, payload) {
      state.users_rapports = payload;
    },
    ACTIVE_RUNNING(state) {
      state.running = true;
    },
    DISABLE_RUNNING(state) {
      state.running = false;
    }
  },
  actions: {
    /**
     * Permet de charger les informations utile sur l'utilisateur.
     */
    rapportTimer({ commit }, payload) {
      commit("ACTIVE_RUNNING");
      request
        .dPost(
          "/gestion-project-v2/users-rapports/" + payload.uid,
          payload.filters
        )
        .then((resp) => {
          commit("SET_USERS_RAPPORTS", resp.data);
          commit("DISABLE_RUNNING");
        })
        .catch(() => {
          commit("DISABLE_RUNNING");
        });
    }
  },
  getters: {
    //
  }
};
