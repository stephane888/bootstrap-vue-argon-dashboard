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
            @userClick="userClick"
          ></button-app>
        </b-col>
      </b-row>
    </base-header>
    <b-container fluid class="pb-4 pt-4">
      ...
      <pre> currentProject : {{ currentProject }} </pre>
    </b-container>
    <modalFrom
      :manage-modal="manageModal"
      :title-modal="titleModal"
      @closeModal="closeModal"
    ></modalFrom>
  </div>
</template>
<script>
import ButtonApp from "../components/buttonApp.vue";
import modalFrom from "./modalForm.vue";
import { mapState } from "vuex";
import AppBreadcrumb from "../components/AppBreadcrumb.vue";

export default {
  name: "ProjetType",
  components: {
    modalFrom,
    ButtonApp,
    AppBreadcrumb,
  },
  props: {
    projectType: {
      type: [String, Number],
      default: "",
    },
    idProject: {
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
    breadCrumbs() {
      const staticUrl = [{ path: "/projets", name: "Liste de projets" }];
      if (this.currentProject.id && this.currentProject.id) {
        staticUrl.push({
          path: "/projets/" + this.projectType + "/" + this.idProject,
          name: this.currentProject.label,
        });
      }
      return staticUrl;
    },
  },
  mounted() {
    this.getProjet();
  },
  methods: {
    /**
     * recupere le projet en fonction des paramettres de l'url.
     */
    getProjet() {
      if (
        this.projects[this.projectType] &&
        this.projects[this.projectType].entities &&
        this.projects[this.projectType].entities[this.idProject]
      ) {
        this.$store.commit(
          "storeProject/SET_CURRENT_PROJECT",
          this.projects[this.projectType].entities[this.idProject]
        );
      } else {
        this.$store
          .dispatch("storeProject/loadProject", {
            entity_type_id: this.projectType,
            id: this.idProject,
          })
          .then((resp) => {
            this.$store.commit("storeProject/SET_CURRENT_PROJECT", resp.data);
          });
      }
    },
    userClick(clean = true) {
      this.manageModal = this.manageModal ? false : true;
      if (clean) this.$store.commit("storeProject/SET_CURRENT_PROJECT");
    },
    closeModal(val) {
      this.manageModal = val;
    },
    editProject(entity) {
      this.$store.commit("storeProject/SET_CURRENT_PROJECT", entity);
      this.userClick(false);
    },
  },
};
</script>
