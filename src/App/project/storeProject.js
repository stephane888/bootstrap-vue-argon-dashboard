//import store from "../../store";
//import Vue from "vue";
import request from "../request";
import generateField from "components_h_vuejs/src/js/FormUttilities";
import loadField from "components_h_vuejs/src/components/fieldsDrupal/loadField";
import itemsEntity from "drupal-vuejs/src/App/jsonApi/itemsEntity.js";
import manageTime from "./manage-time";
const entity_type_project = () => {
  return {
    id: "",
    label: "",
    description: "",
    private: false,
    users: [],
    status: true
  };
};
export default {
  namespaced: true,
  state: () => ({
    /**
     * Contient la liste de tous les projets.
     * ( configEntities )
     */
    projects: [],
    /**
     * Contient les infos sur un projet.
     * ( Un projet du point de vue drupal est une entity de configuration. )
     */
    currentProject: entity_type_project(),
    /**
     * Contient l'entite encours d'edition.
     */
    entityEdit: [],
    /**
     * Contient la structure du formulaire (encours d'edition).
     */
    fields: [],
    /**
     * Suit la construction des formualires.
     */
    building_fields: false,
    /**
     *  Permet de definir un temps moyen pour la constructin d'un formulaire.
     */
    RunBuildingForm: {
      time: 3000,
      timeout: null
    },
    /**
     * Permet de suivre la creation des entites.
     */
    run_entity: {
      numbers: 0,
      creates: 0,
      page: ""
    },
    /**
     * Actif s'il ya une sauvegarde encours.
     */
    running: false,
    /**
     * Contient les données d'un projet (taches, ressources,  bugs ...) et en
     * relations les données tels que les primes, client, executant ...
     * Dans un soucis de reduire la charge de connexion, on va sauvagarger les données dans les clées ( example: id de type de projet ).
     */
    entities: {},
    /**
     * Contient l'entite qui est affiché.
     */
    entity: {},
    /**
     * Contient la lsite des entities issues du filtre.
     */
    all_entitties: [],
    /**
     * Contient les chamaps permettant d'effectuer un filtrage.
     */
    filters: {
      date_begin: null,
      date_end: null,
      search: null,
      search_in_description: false,
      status_execution: ["new", "running", "break", "end"],
      user_id: [],
      executants: []
    }
  }),
  mutations: {
    SET_PROJECTS(state, payload) {
      state.projects = payload;
    },
    SET_CLEAN_PROJECTS(state) {
      state.projects = [];
    },
    ADD_PROJECT(state, payload) {
      if (payload.entity && payload.entity_type_id)
        state.projects[payload.entity_type_id].entities[payload.entity.id] =
          payload.entity;
    },
    SET_CURRENT_PROJECT(state, payload = {}) {
      if (payload.id && payload.uuid) state.currentProject = payload;
      else state.currentProject = entity_type_project();
    },
    SET_ENTITY_EDIT(state, payload) {
      state.entityEdit = payload;
    },
    /**
     * On vide le contenu de l'entité à editer.
     * @param {*} state
     */
    CLEAN_ENTITY_EDIT(state) {
      state.entityEdit = [];
      state.fields = [];
    },
    // https://stackoverflow.com/questions/64635384/write-data-to-a-nested-dictionary-given-a-key-path-of-unknown-length/64641327#64641327.
    // https://stackoverflow.com/questions/66236245/multi-level-dynamic-key-setting.
    // https://lodash.com/docs/4.17.15#update
    // il faudra faire un tuto
    SET_VALUE(state, payload) {
      console.log(" SET_VALUE payload ", payload);
      function updateSettings(settings, keyPath, value) {
        const keys = keyPath.split(".");
        const targetKey = keys.pop();
        let current = settings;
        for (let i = 0; i < keys.length; ++i) {
          current = current[keys[i]];
          if (!current) {
            throw new Error(" Specified key not found. " + keys[i]);
          }
        }
        current[targetKey] = value;
      }
      updateSettings(state.entityEdit, payload.fieldName, payload.value);
    },
    SET_FIELDS(state, payload) {
      state.fields = payload;
    },
    /**
     * il est assez complique de suivre, la construction d'un formulaire;
     * donc, on va fixer une valeur de 3s par appel.
     * @param {*} state
     */
    RUN_BUILDING_FIELDS(state) {
      state.building_fields = true;
      clearTimeout(state.RunBuildingForm.timeout);
      state.RunBuildingForm.timeout = setTimeout(() => {
        state.building_fields = false;
      }, state.RunBuildingForm.time);
    },
    ACTIVE_RUNNING(state) {
      state.running = true;
    },
    DISABLE_RUNNING(state) {
      state.running = false;
    },
    /**
     * --
     * @param {*} state
     * @param {*} payload
     */
    SET_ENTITIES(state, payload) {
      if (
        payload.key === undefined ||
        payload.key === null ||
        payload.items === undefined ||
        !(typeof payload.key == "string")
      )
        throw new Error(" La clée de sauvegarde n'est pas definie ", payload);
      // Cet approche ne permet pas à vuejs de suivre les modifications effectuer. on peut s'appuyer sur running pour relire le contenu.
      // state.entities[payload.key] = payload.items;

      // Cette approche regle le probleme.
      state.entities = Object.assign({}, state.entities, {
        [payload.key]: payload.items
      });
    },
    SET_CLEAN_ENTITIES(state) {
      state.entities = {};
    },
    SET_ALL_ENTITIES(state, payload) {
      state.all_entitties = payload;
    },
    SET_ENTITY(state, payload) {
      state.entity = payload;
    },
    SET_CLEAN_CURRENT_PROJECT(state) {
      state.currentProject = entity_type_project();
    }
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
    /**
     * Permet d'effectuer la sauvegarde d'un matrice de type entities.
     * @param {*} param0
     * @returns
     */
    saveEntities({ commit, state }) {
      return new Promise((resolv, reject) => {
        commit("ACTIVE_RUNNING");
        generateField
          .getNumberEntities(state.entityEdit)
          .then((numbers) => {
            state.run_entity.numbers = numbers;
            generateField
              .prepareSaveEntities(this, state.entityEdit, state.run_entity)
              .then((resp) => {
                commit("DISABLE_RUNNING");
                resolv(resp);
              })
              .catch((er) => {
                commit("DISABLE_RUNNING");
                reject(er);
              });
          })
          .catch((er) => {
            commit("DISABLE_RUNNING");
            reject(er);
          });
      });
    },
    /**
     * Permet de sauvegarder une entite de configuration.
     * @param {*} param
     * @returns
     */
    saveEntityType({ commit, state }, payload) {
      return new Promise((resolv, reject) => {
        if (payload.entity_type_id)
          request
            .saveEntity(
              state.currentProject,
              payload.entity_type_id,
              payload.entity_type_id
            )
            .then((resp) => {
              if (!state.currentProject.uuid)
                commit("ADD_PROJECT", {
                  entity: resp.data,
                  entity_type_id: payload.entity_type_id
                });
              resolv(resp);
            })
            .catch((er) => {
              reject(er);
            });
        else {
          reject(" Parametre de configuration manquant. ");
        }
      });
    },
    loadProject({}, payload) {
      return request.loadProject(payload.entity_type_id, payload.id);
    },
    loadFormEntity({ commit, dispatch }, payload) {
      const params = payload.params ? payload.params : [];
      request
        .loadFormEntity(
          payload.entity_type_id,
          payload.bundle,
          "default",
          params
        )
        .then((resp) => {
          commit("SET_ENTITY_EDIT", resp.data);
          dispatch("buildFields");
        });
    },
    // Permet de mettre à jour un champs ...
    setValue({ commit }, payload) {
      commit("SET_VALUE", payload);
    },
    buildFields({ commit, state }) {
      var fields = [];
      loadField.setConfig(request);
      commit("RUN_BUILDING_FIELDS");
      if (state.entityEdit.length) {
        generateField
          .generateFields(state.entityEdit, fields, null)
          .then((resp) => {
            commit("SET_FIELDS", resp);
          });
      }
    },
    LaodEntityByUrl({ commit }, payload) {
      commit("ACTIVE_RUNNING");
      return new Promise((resolv, reject) => {
        request
          .dGet(payload.url)
          .then((resp) => {
            commit("DISABLE_RUNNING");
            resolv(resp.data);
          })
          .catch((er) => {
            commit("DISABLE_RUNNING");
            reject(er);
          });
      });
    },
    /**
     * Permet de charger les entites (via JSONAPI) en function de entity_type_id et du bundle.
     *
     * @param {*} param0
     * @param {*} payload
     */
    loadEntityWithBundle({ commit }, payload) {
      commit("ACTIVE_RUNNING");
      if (payload.clean) {
        commit("SET_ENTITIES", { items: [], key: payload.bundle });
      }
      const IE = new itemsEntity(
        payload.entity_type_id,
        payload.bundle,
        request
      );
      if (payload.fields && payload.fields.length) IE.setFields(payload.fields);
      IE.remplaceConfig();
      if (payload.url) IE.url += payload.url;
      // Add fillter
      if (payload.filters) {
        payload.filters.forEach((item) => {
          IE.filter(item.field_name, item.operator, item.value);
        });
      }
      IE.get()
        .then((resp) => {
          /**
           * FORMATAGE DES DONNEES
           *
           * 1- On ajoute les proprietes supplementaire afin de contruire un accordeon.
           * 2- On format egalement les dates. ( plus tard on va corriger le prpbleme au niveau de Drupal ).
           */
          const items = [];
          if (resp.data) {
            resp.data.forEach((item) => {
              if (item.attributes.duree && item.attributes.duree.length) {
                item.attributes.duree.forEach((duree, d_index) => {
                  item.attributes.duree[d_index].value =
                    manageTime.getReelValueDate(duree.value);
                  item.attributes.duree[d_index].end_value =
                    manageTime.getReelValueDate(duree.end_value);
                });
              }
              //
              items.push({
                ...item,
                accordionId: item.id,
                accordionOpen: false
              });
            });
            //
            commit("SET_ENTITIES", { items: items, key: payload.bundle });
          } else {
            commit("SET_ENTITIES", { items: items, key: payload.bundle });
          }
          setTimeout(() => {
            commit("DISABLE_RUNNING");
          }, 1500);
        })
        .catch((er) => {
          console.log("er : ", er);
          commit("DISABLE_RUNNING");
        });
    },
    /**
     * Permet de charger une entité en function de son id via JSONAPI.
     *
     * @param {*} param0
     * @param {*} payload
     */
    loadEntity({ commit }, payload) {
      if (payload.clean) commit("SET_ENTITY", {});
      const IE = new itemsEntity(
        payload.entity_type_id,
        payload.bundle,
        request
      );
      IE.remplaceConfig();
      IE.getValueById(payload.id).then((resp) => {
        // On recupere le premier contenu.
        if (resp.data) {
          if (resp.data[0]) {
            const item = resp.data[0];
            //Correction du decallage sur le champs duree.
            item.attributes.duree.forEach((duree, index) => {
              item.attributes.duree[index].end_value =
                manageTime.getReelValueDate(duree.end_value);
              item.attributes.duree[index].value = manageTime.getReelValueDate(
                duree.value
              );
            });
            commit("SET_ENTITY", item);
          }
        }
      });
    },
    /**
     * Permet de charger une entitée en function de son id ou de la dupliquée.
     */
    loadEntityById({ commit, dispatch }, payload) {
      return new Promise((resolv, reject) => {
        if (payload.id && payload.entity_type_id)
          request
            .dPost("/apivuejs/edit-duplicate-entity", payload, null, false)
            .then((resp) => {
              commit("SET_ENTITY_EDIT", resp.data);
              dispatch("buildFields");
              resolv(resp.data);
            })
            .catch((er) => {
              reject(er);
            });
        else {
          reject(" Parametre de configuration manquant. ");
        }
      });
    },
    /**
     * --
     * @param {*} param0
     * @param {*} payload
     * @returns
     */
    loadEntitiesWithFilters({ commit }, payload) {
      return new Promise((resolv, reject) => {
        commit("SET_ALL_ENTITIES", []);
        request
          .loadEntitiesWithFilters(payload.uid, payload.filters)
          .then((resp) => {
            if (resp.data) {
              // add accordionOpen
              for (const i in resp.data) {
                for (const j in resp.data[i].entities) {
                  resp.data[i].entities[j].accordionOpen = false;
                }
              }
              commit("SET_ALL_ENTITIES", resp.data);
            }
            resolv(resp);
          })
          .catch((er) => {
            reject(er);
          });
      });
    },
    /**
     * --
     * @param {*} param0
     * @param {*} payload
     * @returns
     */
    deleteEntity({}, payload) {
      return new Promise((resolv, reject) => {
        if (payload.id && payload.entity_type_id)
          request
            .dPost("/apivuejs/entity-delete", payload, null, false)
            .then((resp) => {
              resolv(resp.data);
            })
            .catch((er) => {
              reject(er);
            });
        else {
          reject(" Parametre de configuration manquant. ");
        }
      });
    }
  },
  getters: {
    //
  }
};
