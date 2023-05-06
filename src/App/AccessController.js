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
