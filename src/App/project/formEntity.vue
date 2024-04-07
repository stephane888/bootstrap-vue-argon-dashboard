<template>
  <div class="form-edit-entity">
    <ValidationObserver ref="formObserver" tag="section">
      <b-form
        v-if="fields_wihiout_statiques.length"
        @submit="onSubmit"
        @reset="onReset"
      >
        <!--build statique fields-->
        <!--titre-->
        <DrupalString
          v-if="statique_fields.name && statique_fields.name.field"
          :field="statique_fields.name.field"
          :model="statique_fields.name.model"
          parent-name="0.entity."
          parent-child-name="0.entities."
          namespace-store="storeProject"
        ></DrupalString>
        <!-- time -->
        <b-row
          v-if="
            statique_fields.duree_execution &&
            statique_fields.duree_execution.field
          "
          class="align-items-baseline"
        >
          <b-col md="4">
            <div class="d-flex align-items-baseline">
              <DrupalInteger
                :field="statique_fields.duree_execution.field"
                :model="statique_fields.duree_execution.model"
                parent-name="0.entity."
                parent-child-name="0.entities."
                namespace-store="storeProject"
              >
              </DrupalInteger>
              <div class="text-info--03 text-nowrap">
                {{
                  getDureeExecution(
                    statique_fields.duree_execution.model.duree_execution
                  )
                }}
              </div>
            </div>
          </b-col>
          <b-col md="8">
            <div class="d-flex flex-wrap justify-content-end">
              <b-button v-if="userCanRunTache()" size="sm" @click="start">
                <b-icon icon="play-btn" variant="success" class="mr-1"></b-icon>
                Démarrer
              </b-button>
              <b-button v-if="userCanBreakTache()" size="sm" @click="pause">
                <b-icon icon="stop-btn" variant="danger" class="mr-1"></b-icon>
                Pause
              </b-button>
              <b-button
                :disabled="!userCanEndTache()"
                size="sm"
                @click="endTache"
              >
                <b-icon
                  icon="check-lg"
                  :variant="
                    userCanEndTache() || getStatusExecution() == 'end'
                      ? 'info'
                      : 'light'
                  "
                  class="mr-1"
                ></b-icon>
                Terminer
              </b-button>
              <b-button
                :disabled="!userCanValidate()"
                size="sm"
                @click="ValidTache"
              >
                <b-icon
                  icon="check2-all"
                  :variant="
                    userCanValidate() || getStatusExecution() == 'validate'
                      ? 'success'
                      : 'light'
                  "
                  class="mr-1"
                ></b-icon>
                Valider
              </b-button>
              <b-button
                :disabled="!userCanGiveUp()"
                size="sm"
                @click="abondonner"
              >
                <b-icon
                  icon="arrow-counterclockwise"
                  :variant="userCanGiveUp() ? 'danger' : 'light'"
                  class="mr-1"
                ></b-icon>
                Abondonner
              </b-button>
              <b-button v-if="userCanReset()" size="sm" @click="resetTache">
                <b-icon
                  icon="bootstrap-reboot"
                  :variant="userCanReset() ? 'danger' : 'light'"
                  class="mr-1"
                ></b-icon>
                Reset
              </b-button>
            </div>
            <TacheProgressBar
              :model="statique_fields.duree_execution.model"
              class="mt-3"
              class-progress="mb-0"
            ></TacheProgressBar>
          </b-col>
        </b-row>
        <!--description-->
        <TextareaCkeditor
          v-if="
            statique_fields.description && statique_fields.description.field
          "
          :field="statique_fields.description.field"
          :model="statique_fields.description.model"
          parent-name="0.entity."
          parent-child-name="0.entities."
          namespace-store="storeProject"
        ></TextareaCkeditor>
        <!--build dynamique fields-->
        <div role="tablist" class="accordion mb-4">
          <b-card no-body class="mb-1">
            <b-card-header
              v-b-toggle="'orther-fields'"
              header-tag="header"
              role="button"
              class="d-flex align-items-baseline justify-content-between btn-action bg-gradient-lighter"
              @click="getStatusAccordion()"
            >
              <div role="button">Autres champs</div>
              <div class="d-flex">
                <b-icon
                  v-if="accordionOpen"
                  icon="chevron-double-up"
                  aria-hidden="true"
                  role="button"
                ></b-icon>
                <b-icon
                  v-if="!accordionOpen"
                  icon="chevron-double-down"
                  aria-hidden="true"
                  role="button"
                ></b-icon>
              </div>
            </b-card-header>
            <b-collapse
              :id="'orther-fields'"
              accordion="my-accordion-fields"
              role="tabpanel"
            >
              <b-card-body>
                <component
                  :is="container.template"
                  v-for="(container, i) in fields_wihiout_statiques"
                  :key="i"
                  :entity="container.entity"
                  :class-entity="['pt-1']"
                >
                  <component
                    :is="render.template"
                    v-for="(render, k) in container.fields"
                    :key="k"
                    :field="render.field"
                    :model="render.model"
                    :entities="render.entities"
                    :class-css="['mb-2']"
                    :parent-name="i + '.entity.'"
                    :parent-child-name="i + '.entities.'"
                    :override-config="true"
                    size="sm"
                    namespace-store="storeProject"
                  ></component>
                </component>
              </b-card-body>
            </b-collapse>
          </b-card>
        </div>
      </b-form>
      <div
        v-if="!fields.length && running"
        class="d-flex py-5 justify-content-center align-items-center"
      >
        <b-icon
          icon="arrow-clockwise"
          animation="spin"
          font-scale="4"
          variant="info"
        ></b-icon>
      </div>
    </ValidationObserver>
  </div>
</template>

<script>
  import request from "../request";
  import { mapState } from "vuex";
  import AccessController from "../AccessController.js";
  import TacheProgressBar from "../components/TacheProgressBar.vue";

  // import loadField from "components_h_vuejs/src/components/fieldsDrupal/loadField";
  export default {
    name: "FormProjet",
    components: {
      DrupalString: () =>
        import(
          "components_h_vuejs/src/components/fieldsDrupal/DrupalString.vue"
        ),
      TextareaCkeditor: () =>
        import(
          "components_h_vuejs/src/components/fieldsDrupal/TextareaCkeditor.vue"
        ),
      DrupalInteger: () =>
        import(
          "components_h_vuejs/src/components/fieldsDrupal/DrupalInteger.vue"
        ),
      TacheProgressBar: TacheProgressBar
    },
    data() {
      return {
        showForm: false,
        statique_fields: {},
        accordionOpen: false,
        /**
         * On doit eviter de creer un superflux de données dans les periodes.
         * Pour une edition on ne peut ajouter q'une seule nouvelle periode.
         */
        defaultLengthDuree: 0
      };
    },
    computed: {
      ...mapState({
        fields: (state) => state.storeProject.fields,
        running: (state) => state.storeProject.running
      }),
      idEntity() {
        if (this.form.label !== "") {
          var id = request.generateIdEntityType(this.form.label);
          this.setId(id);
          return id;
        } else return "";
      },
      /**
       * On enleve les champs statiques de la contruction dynamique.
       */
      fields_wihiout_statiques() {
        const statique_fields = [
          "name",
          "project_manager",
          "duree",
          "duree_execution",
          // "executants", // l'tilisateur doit choisir les autres membres pour constituer son equipe.
          "type_project",
          "description",
          "status_execution"
        ];

        const new_fields = [];
        for (const c in this.fields) {
          const item = this.fields[c];
          const fields = [];
          for (const i in item.fields) {
            const field = item.fields[i];
            if (!statique_fields.includes(field.field.name)) fields.push(field);
            else {
              this.addStatiqueField(field.field.name, field);
              // On ajoute une description pour le champs duree_execution
              if (field.field.name == "duree_execution")
                this.addDescriptionToDureeExecution();
            }
          }

          new_fields.push({
            entity: item.entity,
            template: item.template,
            fields: fields
          });

          console.log("fields_wihiout_statiques : ", new_fields);
        }
        return new_fields;
      }
    },
    methods: {
      /**
       * @private
       * @param {*} event
       */
      onSubmit(event) {
        event.preventDefault();
        this.submit();
      },
      /**
       * Permet de valider le formulaire.
       */
      ValidationForm() {
        return new Promise((resovl, reject) => {
          this.$refs.formObserver
            .validate()
            .then((status) => {
              resovl({ status: status, formObserver: this.$refs.formObserver });
            })
            .catch((error) => {
              reject({
                status: false,
                formObserver: this.$refs.formObserver,
                error: error
              });
            });
        });
      },
      onReset(event) {
        event.preventDefault();
        // Reset our form values
        this.form.id = "";
        this.form.label = "";
        this.form.description = "";
        this.form.users = [];
        // Trick to reset/clear native browser form validation state
        this.show = false;
        this.$nextTick(() => {
          this.show = true;
        });
      },
      setId(id) {
        // Si l'uuid n'existe, alors c'est une creation de type, on peut generer l'id.
        if (!this.form.uuid) this.form.id = id;
      },
      addStatiqueField(name, field) {
        console.log("Ajout des champs statiques : ", name, "\n", field);
        this.$set(this.statique_fields, name, field);
      },
      getStatusAccordion() {
        this.accordionOpen = !this.accordionOpen;
      },
      /**
       * --
       */
      addDescriptionToDureeExecution() {
        if (
          this.statique_fields.duree_execution &&
          this.statique_fields.duree_execution.field
        ) {
          this.statique_fields.duree_execution.field.description =
            " Journée de travail " +
            this.$store.state.userConfig.duration_work_day +
            "h";
        }
      },
      /**
       *
       * @param {Array} values
       */
      getDureeExecution(values) {
        if (values && values[0]) {
          return request.convertTimeMinuteToRead(values[0].value);
        }
      },
      userCanRunTache() {
        if (this.statique_fields.project_manager.field)
          return AccessController.userCanRunTache(
            this.statique_fields.project_manager.field,
            this.statique_fields.project_manager.model
          );
        else return false;
      },
      userCanBreakTache() {
        if (this.statique_fields.project_manager.field)
          return AccessController.userCanBreakTache(
            this.statique_fields.project_manager.field,
            this.statique_fields.project_manager.model
          );
        else return false;
      },
      userCanEndTache() {
        if (this.statique_fields.project_manager.field)
          return AccessController.userCanEndTache(
            this.statique_fields.project_manager.field,
            this.statique_fields.project_manager.model
          );
        else return false;
      },
      userCanGiveUp() {
        if (this.statique_fields.project_manager.field)
          return AccessController.userCanGiveUp(
            this.statique_fields.project_manager.field,
            this.statique_fields.project_manager.model
          );
        else return false;
      },
      /**
       * -- userCanValidate
       */
      userCanValidate() {
        if (
          this.statique_fields.status_execution &&
          this.statique_fields.status_execution.model.status_execution &&
          this.statique_fields.project_manager.field
        )
          return AccessController.userCanValidate(
            this.statique_fields.project_manager.field,
            this.statique_fields.status_execution.model
          );
        return false;
      },
      userCanReset() {
        return AccessController.userCanReset();
      },
      /**
       * Lorsqu'on clique sur une tache, il met à jour le champs durée :
       * La date de depart est l'instant ou on a cliqué et la date de fin est determiné à partir du temps d'execution.
       * On met à jour egalement le chef d'execution du projet, il doit etre membre de l'execution de la tache.
       * On change egalement le status de la tache.
       */
      async start() {
        // Dure d'execution de la tache.
        var duree_execution = 0;
        const status_execution = this.statique_fields.status_execution.model
          .status_execution[0]
          ? this.statique_fields.status_execution.model.status_execution[0]
              .value
          : "";
        if (
          this.statique_fields.duree_execution.model.duree_execution &&
          this.statique_fields.duree_execution.model.duree_execution[0]
        ) {
          duree_execution =
            this.statique_fields.duree_execution.model.duree_execution[0].value;
        }
        // Mise à jour du champs durée.
        if (
          this.statique_fields.duree &&
          this.statique_fields.duree.model.duree
        ) {
          var values = [];
          /**
           * S'il ya deja des sauvagardes de temps et si le status de la tache n'est pas new.
           * Si le status est "new", soit c'est une nouvelle tache qu'on vient de demarrer l'execution
           * soit c'est une tache donc on a remis le compteur à zero.
           */
          if (
            this.statique_fields.duree.model.id.length > 0 &&
            status_execution != "new"
          )
            values = this.statique_fields.duree.model.duree;
          //
          if (
            values.length > 0 &&
            this.defaultLengthDuree > 0 &&
            values.length > this.defaultLengthDuree
          ) {
            values.pop();
          }
          // On definit le nombre d'element provenant de la derniere sauvegarde.
          else if (values.length > 0) {
            this.defaultLengthDuree = values.length;
          }
          values.push({
            value: await this.getDateForDrupal(),
            end_value: await this.getDateForDrupal(duree_execution)
          });
          this.$store.dispatch("storeProject/setValue", {
            fieldName: "0.entity.duree",
            value: values
          });
        } else {
          alert(" Champs durée non definie ");
        }
        // Mise à jour du chef de projet.
        if (
          this.statique_fields.project_manager &&
          this.statique_fields.project_manager.model.project_manager
        ) {
          const value = {
            target_id: this.$store.getters.uid
          };
          this.$store.dispatch("storeProject/setValue", {
            fieldName: "0.entity.project_manager",
            value: [value]
          });
        } else {
          alert("Champs project_manager non definie");
        }
        // Mise à jour du status de la tache
        if (
          this.statique_fields.status_execution &&
          this.statique_fields.status_execution.model.status_execution
        ) {
          const value = {
            value: "running"
          };
          this.$store.dispatch("storeProject/setValue", {
            fieldName: "0.entity.status_execution",
            value: [value]
          });
        } else {
          alert("Champs status_execution non definie");
        }
        //
      },
      async pause() {
        // Mise à jour du status de la tache
        if (this.statique_fields.status_execution.model.status_execution) {
          const value = {
            value: "break"
          };
          this.$store.dispatch("storeProject/setValue", {
            fieldName: "0.entity.status_execution",
            value: [value]
          });
        }
        // Mise à jour du champs durée de fin, il faudra aussi se rassurer que le temps restant est suffisant pour mettre en pause.
        if (
          this.statique_fields.duree &&
          this.statique_fields.duree.model.duree
        ) {
          const values = this.statique_fields.duree.model.duree;
          values[values.length - 1].end_value = await this.getDateForDrupal();
          this.$store.dispatch("storeProject/setValue", {
            fieldName: "0.entity.duree",
            value: values
          });
        }
      },
      /**
       * Seul le chef de projet doit pouvoir marquer une tache comme terminer.
       */
      async endTache() {
        // Mise à jour du champs durée.
        if (this.statique_fields.duree.model.duree.length > 0) {
          const values = this.statique_fields.duree.model.duree;
          values[values.length - 1].end_value = await this.getDateForDrupal();
          this.$store.dispatch("storeProject/setValue", {
            fieldName: "0.entity.duree",
            value: values
          });
        }
        // Mise à jour du status de la tache
        if (this.statique_fields.status_execution.model.status_execution) {
          const value = {
            value: "end"
          };
          this.$store.dispatch("storeProject/setValue", {
            fieldName: "0.entity.status_execution",
            value: [value]
          });
        }
      },
      ValidTache() {
        /**
         * On pourrait avoir besoin d'un champs pour concerver la date de validation ou voir cela dans les revisions.
         */
        // Mise à jour du status de la tache
        if (this.statique_fields.status_execution.model.status_execution) {
          const value = {
            value: "validate"
          };
          this.$store.dispatch("storeProject/setValue", {
            fieldName: "0.entity.status_execution",
            value: [value]
          });
        }
      },
      /**
       * --
       */
      async abondonner() {
        // Mise à jour du champs durée.
        if (this.statique_fields.duree.model.duree.length > 0) {
          const values = this.statique_fields.duree.model.duree;
          values[values.length - 1].end_value = await this.getDateForDrupal();
          this.$store.dispatch("storeProject/setValue", {
            fieldName: "0.entity.duree",
            value: values
          });
        }

        // Mise à jour du status de la tache
        if (this.statique_fields.status_execution.model.status_execution) {
          const value = {
            value: "cancel"
          };
          this.$store.dispatch("storeProject/setValue", {
            fieldName: "0.entity.status_execution",
            value: [value]
          });
        }
      },
      resetTache() {
        // Mise à jour du status de la tache
        if (this.statique_fields.status_execution.model.status_execution) {
          const value = {
            value: "new"
          };
          this.$store.dispatch("storeProject/setValue", {
            fieldName: "0.entity.status_execution",
            value: [value]
          });
        }
      },

      getStatusExecution() {
        return this.statique_fields &&
          this.statique_fields.status_execution.model.status_execution &&
          this.statique_fields.status_execution.model.status_execution[0].value
          ? this.statique_fields.status_execution.model.status_execution[0]
              .value
          : "";
      },

      /**
       *
       * @param {*} DateTimeStamp
       */
      getDateForDrupal(add_minutes = 0) {
        const date = new Date();
        // On force la date pour valider le developpment.
        // date.setDate(5);
        // date.setHours(9, 45, 0);
        // date.setMilliseconds(0);
        return request.getDateForDrupal(date, add_minutes);
      }
    }
  };
</script>
<style lang="scss">
  .form-edit-entity {
    .btn.disabled:hover {
      box-shadow: none;
    }
  }
</style>
