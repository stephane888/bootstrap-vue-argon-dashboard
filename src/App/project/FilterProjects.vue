<template>
  <div class="accordion accordion-filtre" role="tablist">
    <b-card
      no-body
      class="mb-1 border-1 bg-gradient-lighter"
      bg-variant="transperent"
    >
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
            <b-form-group class="col-md-12">
              <b-form-input
                v-model="filters.search"
                size="lg"
                placeholder="Saisir un terme à rechercher"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="input-group-1"
              label="Date de debut"
              label-for="input-1"
              class="col-md-4"
            >
              <b-form-datepicker
                v-model="filters.date_begin"
                locale="fr"
              ></b-form-datepicker>
            </b-form-group>

            <b-form-group label="Date de fin" class="col-md-4">
              <b-form-datepicker
                v-model="filters.date_end"
                locale="fr"
              ></b-form-datepicker>
            </b-form-group>
            <b-form-group label="Type de date" class="col-md-4">
              <b-form-select
                v-model="filters.type_date"
                :options="optionsDate"
              ></b-form-select>
            </b-form-group>
            <b-form-group label="Nombre d'element par page" class="col-md-4">
              <b-form-input v-model="filters.limit"></b-form-input>
            </b-form-group>
            <b-form-group label="Page de debut" class="col-md-4">
              <b-form-input v-model="filters.offset"></b-form-input>
            </b-form-group>
            <b-form-group
              v-slot="{ ariaDescribedby }"
              label="Status de la tache"
              class="col-md-12"
            >
              <b-form-checkbox-group
                v-model="filters.status_execution"
                :options="status_execution_options"
                :aria-describedby="ariaDescribedby"
                name="flavour-1"
              ></b-form-checkbox-group>
            </b-form-group>
            <b-form-group
              v-slot="{ ariaDescribedby }"
              label="Creer par"
              class="col-md-12"
            >
              <b-form-checkbox-group
                v-model="filters.user_id"
                :options="users"
                :aria-describedby="ariaDescribedby"
                name="flavour-1"
              ></b-form-checkbox-group>
            </b-form-group>
            <b-form-group
              v-slot="{ ariaDescribedby }"
              label="Executer par"
              class="col-md-12"
            >
              <b-form-checkbox-group
                v-model="filters.executants"
                :options="users"
                :aria-describedby="ariaDescribedby"
                name="flavour-1"
              ></b-form-checkbox-group>
            </b-form-group>
            <b-col>
              <b-button
                type="submit"
                :variant="running ? 'outline-light' : 'outline-primary'"
                :disabled="running"
              >
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
  import { mapState } from "vuex";
  export default {
    name: "FilterProjects",
    props: {
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
        status_execution_options: request.status_execution,
        optionsDate: [
          { text: "Date de creation", value: "created" },
          { text: "Date de mise à jour", value: "update" }
        ]
      };
    },
    computed: {
      ...mapState({
        filters: (state) => state.storeProject.filters,
        running: (state) => state.storeProject.running,
        users: (state) => state.users
      })
    },
    mounted() {
      if (!this.filters.date_begin && !this.filters.date_end) {
        // On ne tire plus en function des dates, mais de la paginaion.
        // const date = new Date();
        // date.setDate(date.getDate() - 50);
        // this.filters.date_begin = date;
        // Apres chargement de la configuration par defaut, on demande le chargement des données.
        this.$emit("submit_filter");
      } else this.$emit("submit_filter");
    },
    methods: {
      onSubmit(event) {
        event.preventDefault();
        this.$emit("submit_filter");
      },
      onReset() {
        //
      }
    }
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
