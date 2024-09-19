import rootConfig from "../rootConfig";
import store from "../store";
import manageDate from "./project/manage-time";

export default {
  ...rootConfig,
  ...manageDate,

  /**
   * Permet de creer ou mettre à jours les entitées de configuration.
   */
  saveEntity(values, entity_type_id, bundle) {
    const url =
      "/gestion-project-v2/save-entity/" + entity_type_id + "/" + bundle;
    return this.dPost(url, values);
  },

  /**
   * Charge les types de projets.
   * @returns
   */
  loadProjectType() {
    return this.dGet("/gestion-project-v2/load-projet-type");
  },
  /**
   * Permet de charger les projets via une logique propre au module de gestion de tache.
   * Il permet egalement de faire les filtres.
   */
  loadEntitiesWithFilters(uid, filters = []) {
    return this.dPost(
      "/gestion-project-v2/load-mes-taches/" + uid,
      filters,
      null,
      false
    );
  },

  /**
   * Charge un projet ou un type de projet.
   */
  loadProject(entity_type_id, id) {
    return this.dGet(
      "/gestion-project-v2/load-entity/" + entity_type_id + "/" + id
    );
  },

  /**
   * Charge le formulaire pour la creation d'entité.
   * @returns
   */
  loadFormEntity(entity_type_id, bundle, view_mode = "default", datas = []) {
    return this.dPost(
      "/apivuejs/add-entity/" + entity_type_id + "/" + bundle + "/" + view_mode,
      datas,
      null,
      false
    );
  },
  /**
   * Recupere le nom de l'utilisateur à partir de son id.
   * @param {*} id
   * @returns
   */
  getUserName(id) {
    if (store.state.users)
      for (const i in store.state.users) {
        const item = store.state.users[i];
        if (item.value == id) {
          return item.text;
        }
      }
  },
  /**
   * Liste des status
   */
  status_execution: [
    { text: "Nouvelle taches", value: "new" },
    { text: "En cours d'execution", value: "running" },
    { text: "Pause", value: "break" },
    { text: "Terminée", value: "end" },
    { text: "Validée", value: "validate" },
    { text: "Annulée", value: "cancel" }
  ],
  /**
   * Permet d'initialiser le groupe de taches.
   * @returns
   */
  initGroupeStatus() {
    return {
      running: {
        label: "En cours d'execution",
        items: []
      },
      break: {
        label: "Pauses",
        items: []
      },
      new: {
        label: "Nouvelle taches",
        items: []
      },
      end: {
        label: "Terminée",
        items: []
      },
      validate: {
        label: "Validée",
        items: []
      },
      cancel: {
        label: "Annulée",
        items: []
      },
      undefined: {
        label: "Non definie",
        items: []
      }
    };
  }
};
