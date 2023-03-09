import rootConfig from "../rootConfig";

export default {
  ...rootConfig,
  // /**
  //  * Permet de creer ou mettre à jours les entitées.
  //  * @deprecated : il faut utiliser saveEntities
  //  */
  // saveEntity(values, entity_type_id, bundle) {
  //   const url =
  //     "/gestion-project-v2/save-entity/" + entity_type_id + "/" + bundle;
  //   return this.dPost(url, values);
  // },

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
};
