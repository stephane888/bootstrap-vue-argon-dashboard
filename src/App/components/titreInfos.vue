<template>
  <div class="d-inline">
    <div class="d-flex flex-wrap">
      <b-badge
        v-if="chiefId"
        class="d-inline-block ml-1 bg-gradient-transparent_02 text-lowercase text-white"
      >
        {{ chiefName }}
      </b-badge>
      <b-badge
        v-for="(name, i) in executants"
        :key="i"
        class="d-inline-block ml-1 bg-gradient-transparent_01 text-lowercase text-white"
      >
        {{ name }}
      </b-badge>
      <b-badge
        v-if="time_execution"
        class="d-inline-block ml-1 bg-gradient-blue text-lowercase text-white ml-1"
      >
        <b-icon icon="clock-history" variant="light"></b-icon>
        {{ time_execution }}h
      </b-badge>
    </div>
  </div>
</template>

<script>
import config from "../request";
export default {
  name: "TitreInfos",
  props: {
    item: { type: Object, required: true },
  },
  computed: {
    chiefId() {
      if (
        this.item.relationships.project_manager.data &&
        this.item.relationships.project_manager.data.meta
      ) {
        return this.item.relationships.project_manager.data.meta
          .drupal_internal__target_id;
      } else return null;
    },
    chiefName() {
      return config.getUserName(this.chiefId);
    },
    executants() {
      const items = [];
      if (this.item.relationships.executants.data) {
        this.item.relationships.executants.data.forEach((item) => {
          let uid = item.meta.drupal_internal__target_id;
          console.log("uid : ", uid, "\n chiefId :: ", this.chiefId);
          if (uid != this.chiefId) items.push(config.getUserName(uid));
        });
      }
      return items;
    },
    time_execution() {
      if (
        this.item.attributes.duree_execution &&
        this.item.attributes.duree_execution > 0
      ) {
        return (this.item.attributes.duree_execution / 60).toFixed(2);
      } else return null;
    },
  },
  methods: {},
};
</script>
