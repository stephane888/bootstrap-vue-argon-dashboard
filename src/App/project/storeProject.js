//import store from "../../store";
import request from "../request";
export default {
  namespaced: true,
  state: () => ({
    /**
     * Contient la liste de tous les projets.
     */
    projects: [],
    /**
     * Contient les infos sur un projet.
     * ( Un projet du point de vue drupal est une entity de configuration. )
     */
    currentProject: {
      id: "",
      label: "",
      description: "",
      users: [],
    },
  }),
  mutations: {
    SET_PROJECTS(state, payload) {
      state.projects = payload;
    },
    ADD_PROJECT(state, payload) {
      console.log("state.projects : ", state.projects);
      if (payload.entity && payload.entity_type_id)
        state.projects[payload.entity_type_id].entities[payload.entity.id] =
          payload.entity;
    },
    SET_CURRENT_PROJECT(state, payload = {}) {
      if (payload.id && payload.uuid) state.currentProject = payload;
      else
        state.currentProject = {
          id: "",
          label: "",
          description: "",
          users: [],
        };
    },
  },
  actions: {
    loadProjectType({ commit }) {
      request
        .loadProjectType()
        .then((resp) => {
          commit("SET_PROJECTS", resp.data);
        })
        .catch((resp) => {
          console.log("resp : ", resp);
        });
    },
    // necessite une MAJ( car elle doit gerer toutes les sauvegardes );
    saveEntity({ commit, state }) {
      return new Promise((resolv, reject) => {
        request
          .saveEntity(
            state.currentProject,
            "app_project_type",
            "app_project_type"
          )
          .then((resp) => {
            console.log("resp : ", resp);
            if (!state.currentProject.uuid)
              commit("ADD_PROJECT", {
                entity: resp.data,
                entity_type_id: "app_project_type",
              });
            resolv(resp);
          })
          .catch((er) => {
            reject(er);
          });
      });
    },
    loadProject({}, payload) {
      return request.loadProject(payload.entity_type_id, payload.id);
    },
  },
  getters: {
    //
  },
};
