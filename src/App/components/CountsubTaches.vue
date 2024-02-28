<template>
  <div>
    <router-link
      :to="
        '/projets/' +
        configEntityTypeId +
        '/' +
        configEntityId +
        '/' +
        entity.attributes.drupal_internal__id
      "
    >
      <div class="d-flex text-info--03 px-3 align-items-baseline">
        <strong> {{ count_subtaches }} sous taches</strong>
        <b-badge
          v-if="results.new && results.new.items.length"
          class="d-inline-block ml-1 bg-gradient-danger text-lowercase text-white"
        >
          {{ results.new.items.length }} en attente
        </b-badge>
        <b-badge
          v-if="results.end && results.end.items.length"
          class="d-inline-block ml-1 bg-gradient-transparent_01 text-lowercase text-white"
        >
          {{ results.end.items.length }} terminées
        </b-badge>
      </div>
    </router-link>
  </div>
</template>
<script>
import request from "../request";
import itemsEntity from "drupal-vuejs/src/App/jsonApi/itemsEntity.js";
export default {
  name: "CountSubTaches",
  props: {
    entity: {
      type: Object,
      required: true,
    },
    entityTypeId: { type: String, default: "sub_tache" },
    bundle: { type: String, default: "sub_tache" },
    configEntityTypeId: {
      type: [String, Number],
      required: true,
    },
    configEntityId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      results: {},
      count_subtaches: 0,
    };
  },
  mounted() {
    this.loadEntities();
  },
  methods: {
    /**
     * Pour le moment, on recupere cela ainsi, en attendant de maitriser le coeur de Drupal.
     */
    loadEntities() {
      this.results = request.initGroupeStatus();
      const IE = new itemsEntity(this.entityTypeId, this.bundle, request);
      IE.remplaceConfig();
      IE.setFields(["drupal_internal__id", "name", "status_execution"]);
      IE.filter(
        "app_project.meta.drupal_internal__target_id",
        "=",
        this.entity.attributes.drupal_internal__id
      );
      IE.get().then((resp) => {
        if (resp.data) {
          this.count_subtaches = resp.data.length;
          resp.data.forEach((item) => {
            if (item.attributes.status_execution) {
              this.results[item.attributes.status_execution].items.push(item);
            } else {
              this.results.undefined.items.push(item);
            }
          });
        }
      });
    },
  },
};
</script>
