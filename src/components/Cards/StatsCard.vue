<template>
  <card class="card-stats" :show-footer-line="true">
    <b-row>
      <b-col>
        <slot>
          <h5 v-if="title" class="card-title text-uppercase text-muted mb-0">
            {{ title }}
          </h5>
          <span v-if="subTitle" class="h2 font-weight-bold mb-0">{{
            subTitle
          }}</span>
        </slot>
      </b-col>

      <b-col v-if="$slots.icon || icon" cols="auto">
        <slot name="icon">
          <div
            class="icon icon-shape text-white rounded-circle shadow"
            :class="[`bg-${type}`, iconClasses]"
          >
            <i :class="icon"></i>
          </div>
        </slot>
      </b-col>
    </b-row>

    <p class="mt-3 mb-0 text-sm">
      <slot name="footer"> </slot>
    </p>
  </card>
</template>
<script>
import Card from "./CaRd.vue";

export default {
  name: "StatsCard",
  components: {
    Card,
  },
  props: {
    type: {
      type: String,
      default: "primary",
    },
    icon: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    subTitle: {
      type: String,
      default: "",
    },
    iconClasses: {
      type: [String, Array],
      default: "",
    },
  },
};
</script>
<style></style>
