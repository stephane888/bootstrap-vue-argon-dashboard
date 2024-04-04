<template>
  <div class="entity">
    <base-header class="pb-2 pt-5 bg-gradient-success">
      <b-row class="pt-5">
        <b-col md="6">
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block m-0">
            <AppBreadcrumb :bread-crumbs="breadCrumbs"></AppBreadcrumb>
          </nav>
        </b-col>
        <b-col md="6" class="d-flex justify-content-end">
          <button-app
            text-button=" Creer une sous tache "
            class="d-none"
            @userClick="LoadEmptyForm"
          ></button-app>
        </b-col>
      </b-row>
    </base-header>
    <!-- main or corps-->
    <b-container v-if="entity.attributes" fluid class="pb-4 pt-4 main-entity">
      <b-row>
        <b-col md="12">
          <div class="text-white p-1 bg-gradient-vert-sombre">
            <div class="d-flex justify-content-between">
              <h1 class="pr-3">{{ entity.attributes.name }}</h1>
              <titreInfos :item="entity"></titreInfos>
            </div>
            <TacheProgressBar
              class=""
              :model="entity.attributes"
              class-progress="mb-0"
              :show-date="false"
              :show-end-date="true"
            ></TacheProgressBar>
          </div>
        </b-col>
      </b-row>
      <MainTache :entity="entity"></MainTache>
      <div
        v-if="entity.attributes.description"
        class="py-4"
        v-html="entity.attributes.description.value"
      ></div>
      <div class="accor-more-infos-dion" role="tablist">
        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <h4 v-b-toggle.accor-more-infos-dion-1 class="p-2 mb-0">
              Informations supplementaire
            </h4>
          </b-card-header>
          <b-collapse
            id="accor-more-infos-dion-1"
            accor-more-infos-dion="my-accor-more-infos-dion"
            role="tabpanel"
          >
            <b-card-body>
              <b-card-text> /// </b-card-text>
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
    </b-container>
    <!-- modal -->
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
  import modalFrom from "./modalForm.vue";
  import formEntity from "./formEntity.vue";
  import AppBreadcrumb from "../components/AppBreadcrumb.vue";
  import ButtonApp from "../components/buttonApp.vue";
  import { mapState, mapGetters } from "vuex";
  export default {
    name: "EntityView",
    components: {
      modalFrom,
      ButtonApp,
      AppBreadcrumb,
      formEntity,
      TacheProgressBar: () => import("../components/TacheProgressBar.vue"),
      titreInfos: () => import("../components/TitreInfos.vue"),
      MainTache: () => import("./taches/MainTache.vue")
    },
    props: {
      configEntityTypeId: {
        type: [String, Number],
        required: true
      },
      configEntityId: {
        type: [String, Number],
        required: true
      },
      drupalInternalId: {
        type: [String, Number],
        required: true
      }
    },
    data() {
      return {
        manageModal: false,
        titleModal: "Creer une nouvelle tache ou memo ou article ...",
        iconFormEdit: "",
        timer: ""
      };
    },

    computed: {
      ...mapState({
        currentProject: (state) => state.storeProject.currentProject,
        entity: (state) => state.storeProject.entity
      }),
      ...mapGetters(["entity_type_id"]),
      breadCrumbs() {
        const staticUrl = [{ path: "/projets", name: "Liste de projets" }];
        if (this.currentProject.id && this.currentProject.id) {
          staticUrl.push({
            path:
              "/projets/" + this.configEntityTypeId + "/" + this.configEntityId,
            name: this.currentProject.label
          });
        }
        return staticUrl;
      }
    },
    watch: {
      drupalInternalId() {
        console.log("watch drupalInternalId");
        this.getProjet();
        this.loadEntity();
      }
    },
    mounted() {
      this.getProjet();
      this.loadEntity();
    },
    methods: {
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
            bundle: this.configEntityId
          });
        }
      },
      /**
       *
       * @param {*} val
       */
      closeModal(val) {
        this.manageModal = val;
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
              //this.loadEntities();
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
      /**
       * Recupere le projet en fonction des paramettres de l'url.
       */
      getProjet() {
        this.$store
          .dispatch("storeProject/loadProject", {
            entity_type_id: this.configEntityTypeId,
            id: this.configEntityId
          })
          .then((resp) => {
            this.$store.commit("storeProject/SET_CURRENT_PROJECT", resp.data);
          });
      },
      /**
       *
       * @param {*} clean
       */
      loadEntity(clean = true) {
        if (this.entity_type_id && this.configEntityId) {
          this.$store.dispatch("storeProject/loadEntity", {
            entity_type_id: this.entity_type_id,
            bundle: this.configEntityId,
            id: this.drupalInternalId,
            clean: clean
          });
        }
      }
    }
  };
</script>

<style lang="scss"></style>
