<!-- 
    Affiche les informations sur un project, 
-->
<template>
  <div>
    <base-header class="pb-2 pt-5">
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
        <b-col lg="12" md="12" xl="12">
          <h1 class="position-relative d-flex">
            Liste des taches : {{ getNumbers }}
            <div v-if="running">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                class="svg-loader box-spin"
                width="2rem"
                height="2rem"
              >
                <path
                  d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z"
                ></path>
              </svg>
              <!--
              <svg
                version="1.1"
                id="L4"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 30 30"
                enable-background="new 0 0 0 0"
                xml:space="preserve"
                width="4.5rem"
                height="2rem"
                class="svg-loader d-none"
              >
                <circle fill="#ccc" stroke="none" cx="0" cy="13" r="6">
                  <animate
                    attributeName="opacity"
                    dur="1s"
                    values="0;1;0"
                    repeatCount="indefinite"
                    begin="0.1"
                  />
                </circle>
                <circle fill="#ccc" stroke="none" cx="20" cy="13" r="6">
                  <animate
                    attributeName="opacity"
                    dur="1s"
                    values="0;1;0"
                    repeatCount="indefinite"
                    begin="0.2"
                  />
                </circle>
                <circle fill="#ccc" stroke="none" cx="40" cy="13" r="6">
                  <animate
                    attributeName="opacity"
                    dur="1s"
                    values="0;1;0"
                    repeatCount="indefinite"
                    begin="0.3"
                  />
                </circle>
              </svg>
-->
            </div>
          </h1>
          <filtre
            :config-entity-id="configEntityId"
            :drupal-interna-id="drupalInternalId"
            @submit_filter="loadEntities"
          ></filtre>
          <AccordionEntities
            :config-entity-type-id="configEntityTypeId"
            :config-entity-id="configEntityId"
            :entities="entities"
            @editEntity="editEntity"
            @DeleteEntity="DeleteEntity"
          ></AccordionEntities>
        </b-col>
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
  import manageTime from "./manage-time";
  export default {
    name: "CollectionEntitties",
    components: {
      modalFrom,
      ButtonApp,
      AppBreadcrumb,
      formEntity,
      AccordionEntities: () => import("./AccordionEntities.vue"),
      filtre: () => import("./FilterProjects.vue")
    },
    props: {
      configEntityTypeId: {
        type: [String, Number],
        default: ""
      },
      configEntityId: {
        type: [String, Number],
        default: ""
      },
      drupalInternalId: {
        type: [String, Number],
        default: null
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
        projects: (state) => state.storeProject.projects,
        group_entities: (state) => state.storeProject.entities,
        filters: (state) => state.storeProject.filters,
        running: (state) => state.storeProject.running
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
      },
      getNumbers() {
        var total = 0;
        if (this.entities && this.entities.length) {
          total = this.entities.length;
        }
        return total;
      },
      entities() {
        if (this.group_entities) {
          const entities = this.group_entities[this.configEntityId]
            ? this.group_entities[this.configEntityId]
            : [];
          return entities;
        }
        return [];
      }
    },
    mounted() {
      this.getProjet();
      this.PeriodiqueRun();
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
              id: this.configEntityId
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

      /**
       * On recupere les contenus.
       */
      loadEntities() {
        if (this.entity_type_id && this.configEntityId) {
          const typeDate =
            this.filters.type_date == "created" ? "created" : "changed";
          const filters = [];
          const pagination = { limit: 50, offset: 0 };
          // recuperation date de debut
          if (this.filters.date_begin) {
            const date_begin = new Date(this.filters.date_begin);
            filters.push({
              field_name: typeDate,
              operator: ">",
              value: date_begin.getTime() / 1000
            });
          }
          // recuperation date de fin
          if (this.filters.date_end) {
            const date_end = new Date(this.filters.date_end);
            filters.push({
              field_name: typeDate,
              operator: "<",
              value: date_end.getTime() / 1000
            });
          }
          // Recuperation du status des taches.
          if (
            this.filters.status_execution &&
            this.filters.status_execution.length
          ) {
            filters.push({
              field_name: "status_execution",
              operator: "IN",
              value: this.filters.status_execution
            });
          }
          // Recuperation creer par.
          if (this.filters.user_id && this.filters.user_id.length) {
            filters.push({
              field_name: "user_id.meta.drupal_internal__target_id",
              operator: "IN",
              value: this.filters.user_id
            });
          }
          // Recuperation executer par.
          if (this.filters.executants && this.filters.executants.length) {
            filters.push({
              field_name: "executants.meta.drupal_internal__target_id",
              operator: "IN",
              value: this.filters.executants
            });
          }
          //
          if (this.filters.search && this.filters.search.length >= 3) {
            filters.push({
              field_name: "name",
              operator: "CONTAINS",
              value: this.filters.search
            });
          }
          // recuperation de la pagination
          if (this.filters.limit && this.filters.limit >= 1) {
            pagination.limit = this.filters.limit;
            if (this.filters.offset)
              pagination.offset = this.filters.offset - 1;
          }
          if (filters) {
            this.$store.dispatch("storeProject/loadEntityWithBundle", {
              entity_type_id: this.entity_type_id,
              bundle: this.configEntityId,
              url: "?include=executants,project_manager&sort=-" + typeDate,
              filters: filters,
              pagination: pagination,
              fields: [
                "drupal_internal__id",
                "name",
                "user_id",
                "private",
                "type_project",
                "status_execution",
                "type_tache",
                "tache_renumerer",
                "duree",
                "duree_execution",
                "primes",
                "project_manager",
                "executants",
                "created",
                "changed"
              ]
            });
          }
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
                console.log(
                  " Field invalid : ",
                  field.name,
                  "\n field : ",
                  field
                );
              }
            }
          }
        });
      },

      /**
       *
       * @param {*} attributes
       */
      editEntity(attributes) {
        this.$store.commit("storeProject/CLEAN_ENTITY_EDIT");
        this.manageModal = this.manageModal ? false : true;
        this.titleModal = attributes.name;
        this.iconFormEdit = "pencil-square";
        const payload = {
          id: attributes.drupal_internal__id,
          entity_type_id: this.entity_type_id
        };
        this.$store.dispatch("storeProject/loadEntityById", payload);
      },

      /**
       *
       * @param {*} item
       */
      DeleteEntity(item) {
        var info = item.type.split("--");
        this.$store
          .dispatch("storeProject/deleteEntity", {
            entity_type_id: info[0],
            id: item.attributes.drupal_internal__id,
            delete_subentities: false
          })
          .then(() => {
            this.loadEntities(false);
          });
      },

      /**
       * @
       */
      PeriodiqueRun() {
        clearInterval(manageTime.timer_load_collection);
        /**
         * - DrupalInternalId ne doit pas etre definie
         * - configEntityId doit etre definie
         */
        if (!this.drupalInternalId && this.configEntityId)
          manageTime.timer_load_collection = setInterval(() => {
            this.loadEntities(false);
          }, 3600000); // 1h
      }
    }
  };
</script>
<style lang="scss">
  .svg-loader {
    margin-left: 1rem;
  }
  .box-spin {
    animation: fa-spin 2s infinite linear;
  }
</style>
