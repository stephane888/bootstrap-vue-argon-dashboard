<template>
  <div class="accordion accordion-filtre" role="tablist">
    <b-card no-body class="mb-1 border-0" bg-variant="transparent">
      <b-card-header
        header-tag="header"
        class="p-1"
        role="tab"
        header-bg-variant="transparent"
      >
        <h4 block v-b-toggle.accordion-1 class="m-0 border-0">Filtre</h4>
      </b-card-header>
      <b-collapse
        id="accordion-1"
        accordion="my-accordion"
        role="tabpanel"
        visible
      >
        <b-card-body>
          <b-form @submit="onSubmit" @reset="onReset" class="row">
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
import { mapState } from "vuex";
export default {
  name: "FilterProjects",
  data() {
    return {};
  },
  computed: {
    ...mapState({
      filters: (state) => state.storeProject.filters,
    }),
  },

  methods: {
    onSubmit() {
      this.$emit("submit_filter");
    },
    onReset() {
      //
    },
  },
};
</script>

<style lang="scss">
.accordion-filtre {
  .collapse {
    min-height: 0;
  }
  .collapse.show {
    min-height: 500px;
  }
}
</style>
