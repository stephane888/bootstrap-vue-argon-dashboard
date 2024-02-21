<template>
  <div class="accordion accordion-filtre" role="tablist">
    <b-card no-body class="mb-1 border-1" bg-variant="transperent">
      <b-card-header
        header-tag="header"
        class="p-1 border-0"
        role="tab"
        header-bg-variant="transparent"
      >
        <h4 v-b-toggle.accordion-1 block class="m-0 border-0">Filtre</h4>
      </b-card-header>
      <b-collapse id="accordion-1" accordion="my-accordion" role="tabpanel">
        <b-card-body>
          <b-form class="row" @submit="onSubmit" @reset="onReset">
            <b-form-group
              id="input-group-1"
              label="Date de debut"
              label-for="input-1"
              class="col-md-6"
            >
              <b-form-datepicker
                v-model="filters.date_begin"
                locale="fr"
              ></b-form-datepicker>
            </b-form-group>

            <b-form-group
              id="input-group-2"
              label="Date de fin"
              label-for="input-2"
              class="col-md-6"
            >
              <b-form-datepicker
                v-model="filters.date_end"
                locale="fr"
              ></b-form-datepicker>
            </b-form-group>
            <b-form-group
              v-slot="{ ariaDescribedby }"
              label="Status de la tache"
              class="col-md-12"
            >
              <b-form-checkbox-group
                v-model="filters.status_execution"
                :options="status_execution"
                :aria-describedby="ariaDescribedby"
                name="flavour-1"
              ></b-form-checkbox-group>
            </b-form-group>
            <b-form-group
              v-slot="{ ariaDescribedby }"
              label="Executants"
              class="col-md-12"
            >
              <b-form-checkbox-group
                v-model="filters.users"
                :options="users"
                :aria-describedby="ariaDescribedby"
                name="flavour-1"
              ></b-form-checkbox-group>
            </b-form-group>
            <b-col>
              <b-button type="submit" variant="outline-primary">
                filtrer
              </b-button>
            </b-col>
          </b-form>
        </b-card-body>
      </b-collapse>
    </b-card>
  </div>
</template>

<script>
import request from "../request";
import itemsEntity from "drupal-vuejs/src/App/jsonApi/itemsEntity.js";
import { mapState } from "vuex";
export default {
  name: "FilterProjects",
  data() {
    return {
      status_execution: [
        { text: "Nouvelle taches", value: "new" },
        { text: "En cours d'execution", value: "running" },
        { text: "Terminée", value: "end" },
        { text: "Validée", value: "validate" },
        { text: "Annulée", value: "cancel" },
      ],
      users: [],
    };
  },
  computed: {
    ...mapState({
      filters: (state) => state.storeProject.filters,
    }),
  },
  mounted() {
    this.getUsers();
    if (
      !this.filters.date_begin &&
      !this.filters.date_end &&
      !this.filters.search
    ) {
      const date = new Date();
      date.setDate(date.getDate() - 100);
      this.filters.date_begin = date;
      // Apres chargement de la configuration par defaut, on demande le chargement des données.
      this.$emit("submit_filter");
    }
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      this.$emit("submit_filter");
    },
    onReset() {
      //
    },
    getUsers() {
      let vocabulary = "user";
      if (vocabulary && request) {
        const terms = new itemsEntity(vocabulary, vocabulary, request);
        terms.remplaceConfig();
        terms.get().then(() => {
          this.users = terms.getOptions();
          console.log("users : ", this.users);
        });
      }
    },
  },
};
</script>

<style lang="scss">
.accordion-filtre {
  margin-bottom: 3rem;
  .collapse {
    min-height: 0;
  }
  .collapse.show {
    min-height: 150px;
  }
  &.accordion > .card {
    overflow: visible;
  }
}
</style>
