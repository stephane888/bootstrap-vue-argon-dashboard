<template>
  <div v-if="show_bar">
    <b-progress
      :max="getMax()"
      show-progress
      :animated="animated"
      :class="classProgress"
      class="progress-custom"
    >
      <b-progress-bar
        :variant="progress_bar_variant"
        :value="getValue()"
        :label="percent_progress + '%'"
      ></b-progress-bar>
    </b-progress>
    <div v-if="showDate" class="d-flex justify-content-between">
      <small>{{ date_interval.begin }}</small>
      <small>{{ date_interval.end }}</small>
    </div>
  </div>
</template>
<script>
import manageTime from "../project/manage-time";
export default {
  name: "TacheProgressBar",
  props: {
    /**
     * Peut etre les données d'edition ou alors les données provenant de jsonapi.
     */
    model: { type: Object, required: true },
    classProgress: { type: String, default: "" },
    showDate: { type: Boolean, default: true },
  },
  data() {
    return {
      value: 0,
      max: 100,
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
    date_interval() {
      if (this.donneeFromJsonapi) {
        if (this.model.duree) {
          /**
           * La date renvoyée ici est contient le decallage.
           * example en BD on a : 2023-05-16T06:55:59 ==> 2023-05-16T07:55:59+01:00
           */
          // petite fonction pour corriger cela, en attendant la MAJ sur drupal.
          const getReelValue = (str) => {
            if (str) var d2 = str.split("+");
            else return str;
            if (d2[1]) {
              const date = new Date(d2[0]);
              const time_zone = d2[1].split(":");
              const dd = parseInt(time_zone[0]);
              if (dd > 0) {
                date.setHours(date.getHours() - dd);
              }
              return manageTime.getDateForDrupal(date);
            } else return str;
          };
          return {
            begin: getReelValue(this.model.duree.value),
            end: getReelValue(this.model.duree.end_value),
          };
        } else return { begin: null, end: null };
      } else if (this.model.duree[0]) {
        return {
          begin: this.model.duree[0].value,
          end: this.model.duree[0].end_value,
        };
      } else return { begin: null, end: null };
    },
    percent_progress() {
      const max = this.getMax();
      const value = this.getValue();
      if (max && value) {
        return ((value / max) * 100).toFixed(1);
      } else return 0;
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
    },
  },
  methods: {
    getMax() {
      if (this.duree_execution) {
        return this.duree_execution;
      } else return this.max;
    },
    getValue() {
      const diff_minutes = (dt2, dt1) => {
        var diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= 60;
        return Math.abs(Math.round(diff));
      };
      if (this.date_interval.begin && this.date_interval.end) {
        const dt1 = new Date(this.date_interval.begin);
        var dt2 = new Date(this.date_interval.end);
        if (this.get_status_execution == "running") dt2 = new Date();
        // console.log(
        //   "dates : ",
        //   "\n date 1 string : ",
        //   this.date_interval.begin,
        //   "\n",
        //   dt1,
        //   "\n date 2 : ",
        //   dt2
        // );
        return diff_minutes(dt1, dt2);
      } else return this.value;
    },
  },
};
</script>
<style lang="scss">
.progress-custom {
  font-size: 60%;
}
</style>
