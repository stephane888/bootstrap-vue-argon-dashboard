import { mode } from "d3";
import store from "../store";
export default {
  /**
   * Determine si l'utlisateur peut editer une entité de configuration.
   * @param {*} entity
   */
  accessToEditEntityConfig(entity) {
    var status = false;
    if (this.userIsAdministrator()) status = true;
    else if (this.userIsManager()) {
      if (entity.user_id == store.getters.uid) status = true;
      else if (!entity.private) status = true;
    } else if (this.userIsEmployee() || this.userIsPerformer()) {
      if (entity.user_id == store.getters.uid) status = true;
    }
    return status;
  },
  /**
   * Determine si l'utlisateur peut supprimer une entité de configuration.
   * @param {*} entity
   */
  accessToDeleteEntityConfig(entity) {
    var status = false;
    if (this.userIsAdministrator()) status = true;
    else if (
      this.userIsManager() ||
      this.userIsEmployee() ||
      this.userIsPerformer()
    ) {
      if (entity.user_id == store.getters.uid) status = true;
    }
    return status;
  },
  /**
   * Permet de determiner si l'utilisateur peut demarrer la tache ou pas.
   * il doit etre dans la liste des utilisateurs.
   * @param {*} entity
   */
  userCanRunTache(field, model) {
    const status_execution = model.status_execution;
    if (
      status_execution[0] &&
      (status_execution[0].value == "new" || status_execution[0].value == "")
    ) {
      return this.userIsIncludeInperformer(field);
    } else {
      return false;
    }
  },
  userCanEndTache(field, model) {
    const status_execution = model.status_execution;
    if (status_execution[0] && status_execution[0].value == "running") {
      return this.userIsIncludeInperformer(field);
    } else {
      return false;
    }
  },
  /**
   * L'utilisateur peut marquer la tache comme valider.
   */
  userCanValidate(field, model) {
    const status_execution = model.status_execution;
    if (status_execution[0] && status_execution[0].value != "end") {
      return false;
    }
    if (this.userIsAdministrator() || this.userIsManager()) {
      return true;
    } else return false;
  },
  /**
   * L'utilisateur peut marquer la tache comme abandonner.
   */
  userCanGiveUp(field, model) {
    const status_execution = model.status_execution;
    if (
      status_execution[0] &&
      status_execution[0].value != "new" &&
      status_execution[0].value != ""
    ) {
      return true;
    } else return false;
  },
  /**
   * L'utilisateur est inclus dans la liste des exectutants.
   * @param {*} field
   * @returns
   */
  userIsIncludeInperformer(field) {
    if (
      field.definition_settings.allowed_values &&
      store.getters.uid &&
      field.definition_settings.allowed_values[store.getters.uid]
    ) {
      return true;
    } else return false;
  },
  userIsAdministrator() {
    if (store.state.roles.length > 0) {
      return store.state.roles.includes("administrator");
    } else return false;
  },
  userIsManager() {
    if (store.state.roles.length > 0) {
      return store.state.roles.includes("manager");
    } else return false;
  },
  userIsEmployee() {
    if (store.state.roles.length > 0) {
      return store.state.roles.includes("employee");
    } else return false;
  },
  userIsPerformer() {
    if (store.state.roles.length > 0) {
      return store.state.roles.includes("performer");
    } else return false;
  },
};
