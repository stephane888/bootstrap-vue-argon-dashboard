//import store from "../../store";
import request from "../request";
export default {
  namespaced: true,
  state: () => ({
    projects: [],
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
  },
  getters: {
    //
  },
};
