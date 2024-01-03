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
      :max="getMax()"
      show-progress
      :animated="animated"
      :class="classProgress"
      class="progress-custom--bar col"
    >
      <b-progress-bar
        :variant="progress_bar_variant"
        :value="value"
        :label="percent_progress + '%'"
      ></b-progress-bar>
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
export default {
  name: "TacheProgressBar",
  props: {
    /**
     * Peut etre les données d'edition ou alors les données provenant de jsonapi.
     */
    model: { type: Object, required: true },
    classProgress: { type: String, default: "" },
    showDate: { type: Boolean, default: true },
    showEndDate: { type: Boolean, default: false },
  },
  data() {
    return {
      value: 0,
      max: 100,
      date_interval: { begin: null, end: null },
      percent_progress: "",
      manageTime: manageTime,
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
    },
  },
  mounted() {
    this.getValue().then(() => {
      this.getLabelPercent();
    });
  },
  methods: {
    getMax() {
      if (this.duree_execution) {
        return this.duree_execution;
      } else return this.max;
    },
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
        if (this.get_status_execution == "running") dt2 = new Date();
        this.value = diff_minutes(dt1, dt2);
        return this.value;
      } else return this.value;
    },
    async GetDateInterval() {
      if (this.donneeFromJsonapi) {
        if (this.model.duree) {
          /**
           * La date renvoyée ici est contient le decallage.
           * example en BD on a : 2023-05-16T06:55:59 ==> 2023-05-16T07:55:59+01:00
           */
          // petite fonction pour corriger cela, en attendant la MAJ sur drupal.
          const getReelValue = async (str) => {
            return new Promise((resolv) => {
              if (str) var d2 = str.split("+");
              else return str;
              if (d2[1]) {
                const date = new Date(d2[0]);
                const time_zone = d2[1].split(":");
                const dd = parseInt(time_zone[0]);
                if (dd > 0) {
                  date.setHours(date.getHours() - dd);
                }
                manageTime.getDateForDrupal(date).then((date_string) => {
                  // console.log(
                  //   "resul : ",
                  //   date_string,
                  //   "\n str : ",
                  //   str,
                  //   "\n date : ",
                  //   date
                  // );
                  resolv(date_string);
                });
              } else resolv(str);
            });
          };
          const begin = await getReelValue(this.model.duree.value);
          const end = await getReelValue(this.model.duree.end_value);
          //console.log("begin : ", begin, "\n end : ", end);
          return {
            begin: begin,
            end: end,
          };
        } else return { begin: null, end: null };
      } else if (this.model.duree[0]) {
        return {
          begin: this.model.duree[0].value.replace("T", " "),
          end: this.model.duree[0].end_value.replace("T", " "),
        };
      } else return { begin: null, end: null };
    },
    async getLabelPercent() {
      const max = this.getMax();
      if (max && this.value) {
        this.percent_progress = ((this.value / max) * 100).toFixed(1);
      } else this.percent_progress = 0;
    },
  },
};
</script>
<style lang="scss">
.progress-custom {
  font-size: 70%;
  position: relative;
  &--bar {
    height: 13px;
  }
  .accordi-date {
    padding: 0 10px;
    width: 170px;
    max-width: 170px;
  }
}
</style>
