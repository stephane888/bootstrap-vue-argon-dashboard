<!-- 
    Affiche les informations sur un project, 
-->
<template>
  <div>
    <base-header class="pb-2 pt-5 bg-gradient-success">
      <b-row class="pt-5">
        <b-col md="6">
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block m-0">
            <AppBreadcrumb :bread-crumbs="breadCrumbs"></AppBreadcrumb>
          </nav>
        </b-col>
        <b-col md="6" class="d-flex justify-content-end">
          <button-app
            text-button="Creer une tache / un tuto / ..."
            @userClick="LoadEmptyForm"
          ></button-app>
        </b-col>
      </b-row>
    </base-header>
    <b-container fluid class="pb-4 pt-4">
      //
      <pre> currentProject : {{ currentProject }} </pre>
    </b-container>
    <modalFrom
      :manage-modal="manageModal"
      :title-modal="titleModal"
      @closeModal="closeModal"
      @submitModel="submitModel"
    >
      <template #formEdit>
        <formEntity ref="formProjet"></formEntity>
      </template>
    </modalFrom>
  </div>
</template>
<script>
import ButtonApp from "../components/buttonApp.vue";
import modalFrom from "./modalForm.vue";
import { mapState, mapGetters } from "vuex";
import AppBreadcrumb from "../components/AppBreadcrumb.vue";
import formEntity from "./formEntity.vue";
export default {
  name: "CollectionEntitties",
  components: {
    modalFrom,
    ButtonApp,
    AppBreadcrumb,
    formEntity,
  },
  props: {
    configEntityTypeId: {
      type: [String, Number],
      default: "",
    },
    configEntityId: {
      type: [String, Number],
      default: "",
    },
  },
  data() {
    return {
      manageModal: false,
      titleModal: "Creer une nouvelle tache ou memo ou article ...",
    };
  },
  computed: {
    ...mapState({
      currentProject: (state) => state.storeProject.currentProject,
      projects: (state) => state.storeProject.projects,
    }),
    ...mapGetters(["entity_type_id", "bundle"]),
    breadCrumbs() {
      const staticUrl = [{ path: "/projets", name: "Liste de projets" }];
      if (this.currentProject.id && this.currentProject.id) {
        staticUrl.push({
          path:
            "/projets/" + this.configEntityTypeId + "/" + this.configEntityId,
          name: this.currentProject.label,
        });
      }
      return staticUrl;
    },
  },
  mounted() {
    this.getProjet();
    if (this.entity_type_id && this.bundle)
      this.$store.dispatch("storeProject/loadEntityWithBundle", {
        entity_type_id: this.entity_type_id,
        bundle: this.bundle,
      });
  },
  methods: {
    /**
     * recupere le projet en fonction des paramettres de l'url.
     */
    getProjet() {
      if (
        this.projects[this.configEntityTypeId] &&
        this.projects[this.configEntityTypeId].entities &&
        this.projects[this.configEntityTypeId].entities[this.configEntityId]
      ) {
        this.$store.commit(
          "storeProject/SET_CURRENT_PROJECT",
          this.projects[this.configEntityTypeId].entities[this.configEntityId]
        );
      } else {
        this.$store
          .dispatch("storeProject/loadProject", {
            entity_type_id: this.configEntityTypeId,
            id: this.configEntityId,
          })
          .then((resp) => {
            this.$store.commit("storeProject/SET_CURRENT_PROJECT", resp.data);
          });
      }
    },
    /**
     * Recupere le formulaire pour la creation d'une entité.
     *
     * @param {*} clean
     */
    LoadEmptyForm() {
      this.manageModal = this.manageModal ? false : true;
      if (this.manageModal) {
        this.$store.dispatch("storeProject/loadFormEntity", {
          entity_type_id: this.configEntityTypeId,
          bundle: this.configEntityId,
        });
      }
    },
    closeModal(val) {
      this.manageModal = val;
    },
    editProject(entity) {
      this.$store.commit("storeProject/SET_CURRENT_PROJECT", entity);
      this.userClick(false);
    },
    submitModel() {
      this.$store.dispatch("storeProject/saveEntities").then(() => {
        this.$bvModal.hide("b-modal-manage-project");
      });
    },
  },
};
</script>
