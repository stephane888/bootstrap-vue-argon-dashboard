<template>
  <div>
    <b-progress
      :value="value"
      :max="max"
      show-progress
      :animated="animated"
    ></b-progress>
    <div class="d-flex justify-content-between">
      <small>{{ date_interval.begin }}</small>
      <small>{{ date_interval.end }}</small>
    </div>
  </div>
</template>
<script>
export default {
  name: "TacheProgressBar",
  props: {
    model: { type: Object, required: true },
  },
  data() {
    return {
      value: 0,
      max: 100,
    };
  },
  computed: {
    animated() {
      if (this.model.status_execution[0]) {
        if (this.model.status_execution[0].value == "running") return true;
        else return false;
      } else return null;
    },
    date_interval() {
      if (this.model.duree[0]) {
        return {
          begin: this.model.duree[0].value,
          end: this.model.duree[0].end_value,
        };
      } else return { begin: "", end: "" };
    },
  },
};
</script>
