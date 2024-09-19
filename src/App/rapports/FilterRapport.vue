<template>
  <div>
    <div class="accordion accordion-rapport" role="tablist">
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
        <b-collapse
          id="accordion-1"
          accordion="my-accordion"
          role="tabpanel"
          visible
        >
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
                label="Executant et ou chef de projet"
                class="col-md-12"
              >
                <b-select
                  v-model="filters.user_id"
                  :options="users"
                  :aria-describedby="ariaDescribedby"
                ></b-select>
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
    <h3>{{ render() }}</h3>
    <div class="accordion" role="tablist">
      <b-card v-for="(item, k) in userRapports" :key="k" no-body>
        <b-card-header header-tag="header" class="p-2 bg-light" role="tab">
          <b-row>
            <b-col v-b-toggle="'te-' + item.type" class="d-flex">
              <span> {{ item.name_project }} </span>
              <div>
                <b-badge
                  class="d-inline-block ml-1 bg-gradient-transparent_01 text-lowercase text-white ml-2"
                >
                  {{ (item.duree / 3600).toFixed(2) }} h
                </b-badge>
              </div>
            </b-col>
          </b-row>
        </b-card-header>
        <b-collapse
          :id="'te-' + item.type"
          accordion="my-cp-accordion"
          role="tabpanel"
        >
          <b-card-body>
            <div v-for="(element, p) in item.elements" :key="p">
              <div class="d-flex w-100 justify-content-between">
                <span class="pr-3"> {{ element.name }} </span>
                <span> {{ (element.duree / 3600).toFixed(2) }} h </span>
              </div>
            </div>
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
  </div>
</template>

<script>
  import { mapState } from "vuex";
  import manageTime from "../project/manage-time";
  export default {
    name: "FilterRapport",
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
        //
      };
    },
    computed: {
      ...mapState({
        userConfig: (state) => state.userConfig,
        filters: (state) => state.storeRapport.filters,
        running: (state) => state.storeRapport.running,
        users: (state) => state.users,
        user: (state) => state.user,
        users_rapports: (state) => state.storeRapport.users_rapports
      }),
      userRapports() {
        var datas = {};
        this.initTime();
        if (
          this.users_rapports &&
          this.users_rapports.timers_works &&
          this.users_rapports.timers_works.length
        ) {
          this.users_rapports.timers_works.forEach((userInfo) => {
            if (datas[userInfo.type]) {
              datas[userInfo.type].duree += parseInt(userInfo.duree);
              datas[userInfo.type].elements.push(userInfo);
            } else {
              datas[userInfo.type] = {
                name_project: userInfo.name_project,
                duree: parseInt(userInfo.duree),
                elements: [userInfo],
                type: userInfo.type
              };
            }
            this.addTime(userInfo.duree);
          });
        }
        return datas;
      }
    },
    data() {
      return {
        total_time: 0
      };
    },
    mounted() {
      if (!this.filters.date_begin && !this.filters.date_end) {
        const date = new Date();
        date.setDate(1);
        this.filters.date_begin = date;
      }
      // set default user.
      if (this.user && this.user.current_user) {
        this.filters.user_id = this.user.current_user.uid;
      }
      // load current tache.
      this.getRapports();
    },

    methods: {
      onSubmit(event) {
        event.preventDefault();
        //
        this.getRapports();
      },
      onReset() {
        //
      },
      getRapports() {
        const filters = { AND: [], OR: [] };
        // recuperation date de debut
        if (this.filters.date_begin) {
          const date_begin = new Date(this.filters.date_begin);
          filters.AND.push({
            column: "duree_value",
            preffix: "apd",
            operator: ">=",
            value: "'" + manageTime.formatDate(date_begin).date + "'"
          });
        }
        // recuperation date de fin
        if (this.filters.date_end) {
          const date_end = new Date(this.filters.date_end);
          filters.AND.push({
            column: "duree_value",
            preffix: "apd",
            operator: "=<",
            value: "'" + manageTime.formatDate(date_end).date + "'"
          });
        }
        // Recuperation creer par.
        if (this.filters.user_id) {
          filters.OR.push({
            column: "project_manager",
            operator: "=",
            preffix: "ap",
            value: this.filters.user_id
          });
          filters.OR.push({
            column: "executants_target_id",
            operator: "=",
            preffix: "ape",
            value: this.filters.user_id
          });
        }
        this.$store.dispatch("storeRapport/rapportTimer", {
          uid: this.filters.user_id
            ? this.filters.user_id
            : this.user.current_user.uid,
          filters: filters
        });
      },
      initTime() {
        this.total_time = 0;
      },
      addTime(minutes) {
        this.total_time += parseInt(minutes);
      },
      render() {
        var time = "0";
        if (this.total_time > 0) time = (this.total_time / 3600).toFixed(2);
        const byJour =
          (time / this.userConfig.duration_work_day).toFixed(2) + " Jrs | ";
        return byJour + time + "h";
      }
    }
  };
</script>

<style lang="scss">
  .accordion-rapport {
    margin-bottom: 3rem;
    .collapse {
      min-height: 0;
    }
    .collapse.show {
      min-height: 100px;
    }
    &.accordion > .card {
      overflow: visible;
    }
  }
</style>
