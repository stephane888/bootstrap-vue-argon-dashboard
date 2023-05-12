import rootConfig from "../rootConfig";
import store from "../store";

export default {
  ...rootConfig,

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
  loadFormEntity(entity_type_id, bundle, view_mode = "default") {
    return this.dGet(
      "/apivuejs/add-entity/" + entity_type_id + "/" + bundle + "/" + view_mode
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
   * Permet d'initialiser le groupe de taches.
   * @returns
   */
  initGroupeStatus() {
    return {
      running: {
        label: "En cours d'execution",
        items: [],
      },
      end: {
        label: "Terminée",
        items: [],
      },
      validate: {
        label: "Validée",
        items: [],
      },
      new: {
        label: "Nouvelle taches",
        items: [],
      },
      cancel: {
        label: "Annulée",
        items: [],
      },
      undefined: {
        label: "Non definie",
        items: [],
      },
    };
  },
};
