<template>
  <SlideYUpTransition :duration="animationDuration">
    <b-modal
      ref="app-modal"
      tabindex="-1"
      class="modal fade"
      :size="size"
      :hide-header="!$slots.header"
      :modal-class="[{ 'modal-mini': type === 'mini' }, ...modalClasses]"
      role="dialog"
      centered
      :header-class="headerClasses"
      :footer-class="footerClasses"
      :content-class="[
        gradient ? `bg-gradient-${gradient}` : '',
        ...modalContentClasses,
      ]"
      :body-class="bodyClasses"
      :aria-hidden="!show"
      @mousedown.self="closeModal"
      @close="closeModal"
      @hide="closeModal"
    >
      <template #modal-header>
        <slot name="header"></slot>
        <slot name="close-button">
          <button
            v-if="showClose"
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
            @click="closeModal"
          >
            <span :aria-hidden="!show">×</span>
          </button>
        </slot>
      </template>

      <slot />

      <template #modal-footer>
        <slot name="footer"></slot>
      </template>
    </b-modal>
  </SlideYUpTransition>
</template>
<script>
import { SlideYUpTransition } from "vue2-transitions";

export default {
  name: "ModAl",
  components: {
    SlideYUpTransition,
  },
  props: {
    show: Boolean,
    showClose: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: "",
      validator(value) {
        let acceptedValues = ["", "notice", "mini"];
        return acceptedValues.indexOf(value) !== -1;
      },
      description: 'Modal type (notice|mini|"") ',
    },
    modalClasses: {
      type: [Object, String],
      description: "Modal dialog css classes",
      default: "",
    },
    size: {
      type: String,
      description: "Modal size",
      default: "",
      validator(value) {
        let acceptedValues = ["", "sm", "lg"];
        return acceptedValues.indexOf(value) !== -1;
      },
    },
    modalContentClasses: {
      type: [Object, String],
      description: "Modal dialog content css classes",
      default: "",
    },
    gradient: {
      type: String,
      description: "Modal gradient type (danger, primary etc)",
      default: "",
    },
    headerClasses: {
      type: [Object, String],
      description: "Modal Header css classes",
      default: "",
    },
    bodyClasses: {
      type: [Object, String],
      description: "Modal Body css classes",
      default: "",
    },
    footerClasses: {
      type: [Object, String],
      description: "Modal Footer css classes",
      default: "",
    },
    animationDuration: {
      type: Number,
      default: 500,
      description: "Modal transition duration",
    },
  },
  watch: {
    show(val) {
      if (val) {
        this.$refs["app-modal"].show();
      } else {
        this.$refs["app-modal"].hide();
      }
    },
  },
  methods: {
    closeModal() {
      this.$emit("update:show", false);
      this.$emit("close");
    },
  },
};
</script>
<style>
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.6) !important;
}
</style>
