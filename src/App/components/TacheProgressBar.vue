<template>
  <div v-if="show_bar" class="progress-custom d-flex row no-gutters">
    <div
      v-if="showEndDate"
      class="d-flex justify-content-start accordi-date col p-0"
    >
      <div class="d-inline mr-3">
        {{ manageTime.getDateToFrench(date_interval.begin) }}
      </div>
      <div>{{ manageTime.getDateToFrench(date_interval.end) }}</div>
    </div>
    <b-progress
      :max="max"
      show-progress
      :animated="animated"
      :class="classProgress"
      class="progress-custom--bar col"
    >
      <b-progress-bar
        :variant="progress_bar_variant"
        :value="value"
      ></b-progress-bar>
      <div class="custom-label text-vert-sombre2">
        {{ percent_progress + "%" }}
      </div>
    </b-progress>
    <div v-if="showDate" class="d-flex justify-content-between col-12">
      <small>{{ manageTime.getDateToFrench(date_interval.begin) }}</small>
      <small>{{ manageTime.getDateToFrench(date_interval.end) }}</small>
    </div>

    <!-- <pre> animated : {{ animated }} </pre>
    <pre> percent_progress : {{ percent_progress }} </pre>
    <pre> value : {{ value }} </pre> -->
  </div>
</template>
<script>
  import manageTime from "../project/manage-time";
  import getDureeDisplay from "./getDureeDisplay.js";
  export default {
    name: "TacheProgressBar",
    props: {
      /**
       * Peut etre les données d'edition ou alors les données provenant de jsonapi.
       */
      model: { type: Object, required: true },
      classProgress: { type: String, default: "" },
      showDate: { type: Boolean, default: true },
      showEndDate: { type: Boolean, default: false }
    },
    data() {
      return {
        value: 0,
        max: 0,
        date_interval: { begin: null, end: null },
        percent_progress: "",
        manageTime: manageTime
      };
    },
    computed: {
      donneeFromJsonapi() {
        if (this.model.drupal_internal__id) {
          return true;
        } else return false;
      },
      duree_execution() {
        if (this.donneeFromJsonapi) {
          return this.model.duree_execution;
        } else if (this.model.duree_execution[0]) {
          return this.model.duree_execution[0].value;
        } else return 0;
      },
      get_status_execution() {
        if (this.donneeFromJsonapi) {
          return this.model.status_execution;
        } else if (this.model.status_execution[0]) {
          return this.model.status_execution[0].value;
        } else return null;
      },
      animated() {
        if (this.get_status_execution == "running") return true;
        else return false;
      },

      show_bar() {
        const valideStatus = ["running", "end", "validate"];
        if (valideStatus.includes(this.get_status_execution)) return true;
        else return false;
      },
      progress_bar_variant() {
        if (this.percent_progress > 100) return "danger";
        if (this.percent_progress > 85) return "warning";
        if (this.percent_progress > 70) return "info";
        else return "success";
      }
    },
    mounted() {
      this.getValue().then(() => {
        this.getLabelPercent();
      });
    },
    methods: {
      async getValue() {
        const diff_minutes = (dt2, dt1) => {
          var diff = (dt2.getTime() - dt1.getTime()) / 1000;
          diff /= 60;
          return Math.abs(Math.round(diff));
        };
        this.date_interval = await this.GetDateInterval();
        if (this.date_interval.begin && this.date_interval.end) {
          const dt1 = new Date(this.date_interval.begin);
          var dt2 = new Date(this.date_interval.end);
          if (this.get_status_execution == "running") {
            this.value = diff_minutes(dt1, new Date());
          } else this.value = diff_minutes(dt1, dt2);
          this.max = diff_minutes(dt1, dt2);
          return this.value;
        } else return this.value;
      },
      async GetDateInterval() {
        const data = getDureeDisplay.retrivePlageDuree(this.model.duree);
        return data;
      },
      async getLabelPercent() {
        if (this.max && this.value) {
          this.percent_progress = ((this.value / this.max) * 100).toFixed(1);
        } else this.percent_progress = 0;
      }
    }
  };
</script>
<style lang="scss">
  .progress-custom {
    font-size: 70%;
    position: relative;
    &--bar {
      height: 16px;
      position: relative;
      line-height: 1;
      .custom-label {
        position: absolute;
        left: 15px;
        line-height: 1;
        top: 50%;
        transform: translate(10px, -50%);
      }
    }
    .accordi-date {
      padding: 0 10px;
      width: 170px;
      max-width: 170px;
    }
  }
</style>
