<template>
  <div>
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
            <b-col> </b-col>
          </b-col>
          <b-col md="8" class="d-flex flex-wrap justify-content-end">
            <b-button size="sm" @click="start"> Démarrer </b-button>
            <b-button size="sm"> Terminer </b-button>
            <b-button size="sm"> Valider </b-button>
            <b-button size="sm" @click="abondonner"> Abondonner </b-button>
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
// import loadField from "components_h_vuejs/src/components/fieldsDrupal/loadField";
export default {
  name: "FormProjetType",
  components: {
    DrupalString: () =>
      import("components_h_vuejs/src/components/fieldsDrupal/DrupalString.vue"),
    TextareaCkeditor: () =>
      import(
        "components_h_vuejs/src/components/fieldsDrupal/TextareaCkeditor.vue"
      ),
    DrupalInteger: () =>
      import(
        "components_h_vuejs/src/components/fieldsDrupal/DrupalInteger.vue"
      ),
  },
  data() {
    return {
      showForm: false,
      statique_fields: {},
      accordionOpen: false,
    };
  },
  computed: {
    ...mapState({
      fields: (state) => state.storeProject.fields,
      running: (state) => state.storeProject.running,
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
        "executants",
        "type_project",
        "description",
        "status_execution",
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
          }
        }
        // console.log("new_fields : ", fields);
        new_fields.push({
          entity: item.entity,
          template: item.template,
          fields: fields,
        });
      }
      return new_fields;
    },
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
              error: error,
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
      console.log("name : ", name, field);
      this.$set(this.statique_fields, name, field);
    },
    getStatusAccordion() {
      this.accordionOpen = !this.accordionOpen;
    },
    /**
     *
     * @param {Array} values
     */
    getDureeExecution(values) {
      if (values && values[0]) {
        console.log("values : ", values);
        const mn = parseInt(values[0].value);
        var string = "";
        if (mn) {
          const h = mn / 60;
          if (h > this.$store.state.userConfig.duree_jour) {
            string +=
              Math.floor(h / this.$store.state.userConfig.duree_jour) +
              " jour(s) ";
          }
          const mn_restant = h % this.$store.state.userConfig.duree_jour;
          if (mn_restant) {
            string += mn_restant.toFixed(2) + " h";
          }
        }
        return string;
      }
      r;
    },
    start() {
      //
    },
    /**
     * --
     */
    abondonner() {
      //
    },
  },
};
</script>
