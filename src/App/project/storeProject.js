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
    SET_CURRENT_PROJECT(state, payload) {
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
    saveEntity({ state }) {
      console.log("state", state.SET_CURRENT_PROJECT);
      //request.saveEntity(this.form, "app_project_type", "app_project_type");
    },
  },
  getters: {
    //
  },
};
