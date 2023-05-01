<!-- 
    Affiche la liste des projets.
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
          <button-app @userClick="userClick"></button-app>
        </b-col>
      </b-row>
    </base-header>
    <b-container fluid class="pb-4 pt-4">
      <div v-for="(item, index) in projects" :key="index" class="">
        <h3>{{ item.label }}</h3>
        <b-row>
          <b-col
            v-for="(entity, i) in item.entities"
            :key="i"
            xl="4"
            lg="6"
            md="6"
            sm="6"
            class=""
          >
            <stats-card
              type="gradient-red"
              sub-title="350,897"
              icon="ni ni-active-40"
              class="mb-4 bg-gradient-white"
            >
              <router-link :to="'/projets/' + item.id + '/' + entity.id">
                <div v-html="entity.label"></div>
              </router-link>
              <template slot="icon">
                <b-button
                  variant="transparent"
                  size="sm"
                  @click="editProject(entity)"
                >
                  <b-icon icon="eye"></b-icon>
                </b-button>
                <b-button
                  variant="transparent"
                  size="sm"
                  @click="editProject(entity)"
                >
                  <b-icon icon="pencil-fill"></b-icon>
                </b-button>
                <b-button
                  variant="transparent"
                  size="sm"
                  @click="DeleteProject(entity)"
                >
                  <b-icon icon="trash" variant="danger"></b-icon>
                </b-button>
              </template>
              <template slot="footer">
                <span class="text-info mr-2 font-weight-600">3.48%</span>
                <span class="text-nowrap">Since last month</span>
              </template>
            </stats-card>
          </b-col>
        </b-row>
      </div>
      <b-row>
        <b-col xl="3" md="4">
          <stats-card
            title="Total traffic"
            type="gradient-red"
            sub-title="350,897"
            icon="ni ni-active-40"
            class="mb-4"
          >
            <template slot="footer">
              <span class="text-success mr-2">3.48%</span>
              <span class="text-nowrap">Since last month</span>
            </template>
          </stats-card>
        </b-col>
      </b-row>
    </b-container>
    <modalFrom
      :manage-modal="manageModal"
      :title-modal="titleModal"
      @closeModal="closeModal"
      @submitModel="submif"
    >
      <template #formEdit>
        <formProjet ref="formProjet" @saveProjectType="saveProjectType" />
      </template>
    </modalFrom>
  </div>
</template>
<script>
import ButtonApp from "../components/buttonApp.vue";
import modalFrom from "./modalForm.vue";
import { mapState } from "vuex";
import AppBreadcrumb from "../components/AppBreadcrumb.vue";
import formProjet from "./formProjetType.vue";
import config from "../../rootConfig";

export default {
  name: "ProjetsType",
  components: {
    modalFrom,
    ButtonApp,
    AppBreadcrumb,
    formProjet,
  },
  props: {
    //
  },
  data() {
    return {
      manageModal: false,
      titleModal: "Creer un nouveau projet",
      /**
       * determiner le type de d'entite de configuration à partir du /{path}.
       */
      projet_type_id: null,
    };
  },
  computed: {
    ...mapState({
      projects: (state) => state.storeProject.projects,
    }),
    breadCrumbs() {
      const staticUrl = [{ path: "/projets", name: "Liste de projets" }];
      return staticUrl;
    },
  },
  mounted() {
    this.loadEntities();
    if (this.$router.history.current) {
      switch (this.$router.history.current.path) {
        case "/projets":
          this.projet_type_id = "app_project_type";
          break;
        default:
          this.projet_type_id = null;
          break;
      }
    }
  },
  methods: {
    loadEntities() {
      this.$store.dispatch("storeProject/loadProjectType");
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
    DeleteProject(entity) {
      config
        .modalConfirmDelete(
          "Confirmer la suppression, NB : cette action est irreverssible.",
          { title: " Suppresion de : " + entity.label }
        )
        .then((status) => {
          if (status) {
            this.$store
              .dispatch("storeProject/deleteEntity", {
                entity_type_id: this.projet_type_id,
                id: entity.id,
                delete_subentities: false,
              })
              .then(() => {
                this.loadEntities();
              });
          }
        });
    },
    /**
     * Permet de sauverger les données de creation ou de modification
     * declancher par FormProjetType.
     */
    saveProjectType() {
      const payload = { entity_type_id: this.projet_type_id };
      this.$store
        .dispatch("storeProject/saveEntityType", payload)
        .then(() => {
          this.$bvModal.hide("b-modal-manage-project");
        })
        .catch((er) => {
          // On doit afficher sur le modal.
          console.log("error : ", er);
        });
    },
    /**
     * Declencher par le submit de la function modal, ce dernier declenche le
     * submit de form qui emettra un event @saveProjectType.
     */
    submif() {
      this.$refs.formProjet.submit();
    },
  },
};
</script>
