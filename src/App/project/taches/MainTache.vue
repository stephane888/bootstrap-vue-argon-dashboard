<template>
  <div v-if="entity.attributes" class="my-5 p-3">
    <div class="d-flex justify-content-between">
      <h3 class="pr-3">Listes des sous taches</h3>
      <div class="d-flex">
        <b-button
          v-b-tooltip.hover.v-info
          size="sm"
          variant="outline-success"
          class="btn-action d-flex justify-content-between align-items-center"
          title="Ajouter une sous tache"
          role="button"
          href="#"
          @click.prevent="addSubTache(entity.attributes)"
        >
          <b-icon icon="plus" aria-hidden="true"></b-icon>
        </b-button>
      </div>
    </div>
    <div class="">
      <div v-for="(group, i) in entities_groups" :key="i" class="hr">
        <div v-if="group.items.length">
          <h4 class="d-none">{{ group.label }}</h4>
          <div class="accordion mb-1" role="tablist">
            <b-card v-for="(item, k) in group.items" :key="k" no-body>
              <b-card-header
                header-tag="header"
                class="p-2"
                role="tab"
                :class="getdynamicHeaderClassByStatus(item, i)"
              >
                <div class="text-left">
                  <b-row>
                    <b-col>
                      <div class="d-flex justify-content-between">
                        <div class="mr-3">
                          <b-badge class="mr-2" variant="transparent">
                            {{ item.attributes.drupal_internal__id }}
                          </b-badge>
                          {{ item.attributes.name }}
                        </div>
                        <titreInfos :item="item"></titreInfos>
                      </div>
                    </b-col>
                    <b-col md="3" class="d-flex justify-content-end">
                      <span
                        v-if="item.accordionOpen"
                        v-b-toggle="item.accordionId"
                        v-b-tooltip.hover
                        variant="light"
                        class="btn-action mr-4"
                        title="Fermer"
                        @click="getStatusAccordion(item)"
                      >
                        <b-icon
                          icon="chevron-double-up"
                          aria-hidden="true"
                        ></b-icon>
                      </span>
                      <span
                        v-if="!item.accordionOpen"
                        v-b-toggle="item.accordionId"
                        v-b-tooltip.hover
                        variant="light"
                        class="btn-action mr-4 d-inline-block"
                        title="Ouvrir"
                        @click="getStatusAccordion(item)"
                      >
                        <b-icon
                          icon="chevron-double-down"
                          aria-hidden="true"
                        ></b-icon>
                      </span>
                      <span
                        v-b-tooltip.hover.v-info
                        class="btn-action mr-4"
                        title="Modifier"
                        role="button"
                        href="#"
                        @click.prevent="editEntity(item.attributes)"
                      >
                        <b-icon
                          icon="pencil"
                          aria-hidden="true"
                          variant="info"
                        ></b-icon>
                      </span>
                      <span
                        v-b-tooltip.hover.v-danger
                        class="btn-action"
                        title="Modifier"
                        role="button"
                        href="#"
                        @click.prevent="DeleteEntity(item)"
                      >
                        <b-icon
                          icon="trash"
                          aria-hidden="true"
                          variant="danger"
                        ></b-icon>
                      </span>
                    </b-col>
                  </b-row>
                </div>
              </b-card-header>
              <b-collapse
                :id="item.accordionId"
                accordion="my-taches-accordion"
                role="tabpanel"
              >
                <b-card-body>
                  <b-card-text>
                    <div
                      v-if="
                        item.attributes.description &&
                        item.attributes.description.processed
                      "
                      v-html="item.attributes.description.processed"
                    ></div>
                  </b-card-text>
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>
        </div>
      </div>
    </div>
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
import formEntity from "../formEntity.vue";
import modalFrom from "../modalForm.vue";
import { mapState } from "vuex";
import config from "../../request";
export default {
  name: "MainTache",
  components: {
    modalFrom,
    formEntity,
    titreInfos: () => import("../../components/TitreInfos.vue"),
  },
  props: {
    entity: {
      type: [Object],
      required: true,
    },
    entityTypeId: { type: String, default: "sub_tache" },
    bundle: { type: String, default: "sub_tache" },
  },
  data() {
    return {
      manageModal: false,
      titleModal: "Creer une nouvelle sous tache",
      iconFormEdit: "",
      timer: "",
    };
  },
  computed: {
    ...mapState({
      entities: (state) => state.storeProject.entities,
    }),
    entities_groups() {
      var groupe_taches = config.initGroupeStatus();
      if (this.entities) {
        this.entities.forEach((item) => {
          if (item.attributes.status_execution) {
            groupe_taches[item.attributes.status_execution].items.push(item);
          } else {
            groupe_taches.undefined.items.push(item);
          }
        });
      }
      return groupe_taches;
    },
  },
  mounted() {
    this.loadEntities();
  },
  methods: {
    /**
     * On recupere les utilisateurs pouvant executer la taches parentes.
     */
    addRunners() {
      //
    },
    /**
     * Recupere le formulaire pour la creation d'une entité.
     *
     * @param {*} clean
     */
    addSubTache() {
      this.manageModal = this.manageModal ? false : true;
      this.titleModal = "Creer une nouvelle tache ou memo ou article ...";
      this.iconFormEdit = "plus-square";
      if (this.manageModal) {
        this.$store.commit("storeProject/CLEAN_ENTITY_EDIT");
        this.$store.dispatch("storeProject/loadFormEntity", {
          entity_type_id: this.entityTypeId,
          bundle: this.bundle,
          params: {
            app_project: [
              { target_id: this.entity.attributes.drupal_internal__id },
            ],
          },
        });
      }
    },
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
    /**
     *
     * @param {*} val
     */
    closeModal(val) {
      this.manageModal = val;
    },
    getStatusAccordion(item) {
      item.accordionOpen = !item.accordionOpen;
    },
    /**
     *
     * @param {*} clean
     */
    loadEntities(clean = true) {
      if (this.bundle && this.entityTypeId) {
        this.$store.dispatch("storeProject/loadEntityWithBundle", {
          entity_type_id: this.entityTypeId,
          bundle: this.bundle,
          clean: clean,
          url: "?include=project_manager&sort=-created",
          filters: [
            {
              field_name: "app_project.meta.drupal_internal__target_id",
              operator: "=",
              value: this.entity.attributes.drupal_internal__id,
            },
          ],
        });
      }
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
        entity_type_id: this.entityTypeId,
      };
      this.$store.dispatch("storeProject/loadEntityById", payload);
    },

    DeleteEntity(item) {
      config
        .modalConfirmDelete(
          "Confirmer la suppression, NB : cette action est irreverssible.",
          { title: " Suppresion de : " + item.attributes.name }
        )
        .then((status) => {
          if (status) {
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
          }
        });
    },
    /**
     * Permet de recuperer l'etat de la classe du header en function du status.
     * @param {*} item
     */
    getdynamicHeaderClassByStatus(item, group_id) {
      var variant_header = "bg-light";
      switch (group_id) {
        case "running":
          variant_header = "bg-gradient-vert-sombre text-white";
          break;
        case "validate":
          variant_header = "bg-gradient-vert-sombre2 text-white";
          break;
        case "end":
          variant_header = "bg-gradient-gray-dark text-white";
          break;
      }
      if (item.attributes.private) {
        variant_header += " border-right border-danger";
      }
      return variant_header;
    },
  },
};
</script>
