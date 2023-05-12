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
            text-button=" Creer une tache / un tuto / ... "
            @userClick="LoadEmptyForm"
          ></button-app>
        </b-col>
      </b-row>
    </base-header>
    <b-container fluid class="pb-4 pt-4">
      <b-row>
        <b-col lg="9"> filtres </b-col>
      </b-row>
      <b-row>
        <b-col lg="9">
          <h1>Liste des taches</h1>
          <AccordionEntities
            @editEntity="editEntity"
            @DeleteEntity="DeleteEntity"
          ></AccordionEntities>
        </b-col>
        <b-col lg="3"></b-col>
      </b-row>
    </b-container>
    <modalFrom
      :manage-modal="manageModal"
      @closeModal="closeModal"
      @submitModel="submitModel"
    >
      <template #titleModal>
        <div class="align-items-center d-flex">
          <div class="pr-3 text-info">
            <b-icon :icon="iconFormEdit" font-scale="1.5"></b-icon>
          </div>
          <small>
            <i> {{ titleModal }} </i>
          </small>
        </div>
      </template>
      <div>
        <formEntity ref="formProjet"></formEntity>
      </div>
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
    AccordionEntities: () => import("./AccordionEntities.vue"),
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
      iconFormEdit: "",
    };
  },
  computed: {
    ...mapState({
      currentProject: (state) => state.storeProject.currentProject,
      projects: (state) => state.storeProject.projects,
      entities: (state) => state.storeProject.entities,
    }),
    ...mapGetters(["entity_type_id"]),
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
    this.$store.dispatch("getUsers");
    this.getProjet();
    this.loadEntities();
    /**
     * On a un bug avec le modal de bootstrap,
     * on force cette solution.
     */
    this.$root.$on("bv::modal::show", (bvEvent, modalId) => {
      console.log("Modal is about to be shown", bvEvent, modalId);
      setTimeout(() => {
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.querySelector(".modal-content").removeAttribute("tabindex");
        }
      }, 1500);
    });
  },
  methods: {
    /**
     * Recupere le projet en fonction des paramettres de l'url.
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
      this.titleModal = "Creer une nouvelle tache ou memo ou article ...";
      this.iconFormEdit = "plus-square";
      if (this.manageModal) {
        this.$store.commit("storeProject/CLEAN_ENTITY_EDIT");
        this.$store.dispatch("storeProject/loadFormEntity", {
          entity_type_id: this.configEntityTypeId,
          bundle: this.configEntityId,
        });
      }
    },
    closeModal(val) {
      this.manageModal = val;
    },
    loadEntities() {
      if (this.entity_type_id && this.configEntityId) {
        this.$store.dispatch("storeProject/loadEntityWithBundle", {
          entity_type_id: this.entity_type_id,
          bundle: this.configEntityId,
        });
      }
    },
    // editProject(entity) {
    //   this.$store.commit("storeProject/SET_CURRENT_PROJECT", entity);
    //   this.userClick(false);
    // },
    submitModel() {
      this.$refs.formProjet.ValidationForm().then((data) => {
        if (data.status) {
          this.$store.dispatch("storeProject/saveEntities").then(() => {
            this.$store.commit("storeProject/CLEAN_ENTITY_EDIT");
            this.loadEntities();
            this.$bvModal.hide("b-modal-manage-project");
          });
        } else {
          for (const i in data.formObserver.fields) {
            const field = data.formObserver.fields[i];
            if (field.invalid) {
              console.log("field invalid", field.name, "\n field : ", field);
            }
          }
        }
      });
    },
    editEntity(attributes) {
      this.$store.commit("storeProject/CLEAN_ENTITY_EDIT");
      this.manageModal = this.manageModal ? false : true;
      this.titleModal = attributes.name;
      this.iconFormEdit = "pencil-square";
      const payload = {
        id: attributes.drupal_internal__id,
        entity_type_id: this.entity_type_id,
      };
      this.$store.dispatch("storeProject/loadEntityById", payload);
    },
    DeleteEntity(item) {
      var info = item.type.split("--");
      this.$store
        .dispatch("storeProject/deleteEntity", {
          entity_type_id: info[0],
          id: item.attributes.drupal_internal__id,
          delete_subentities: false,
        })
        .then(() => {
          this.loadEntities();
        });
    },
  },
};
</script>
