<template>
  <div
    class="custom-control custom-radio"
    :class="[inlineClass, { disabled: disabled }]"
  >
    <input
      :id="cbId"
      v-model="model"
      class="custom-control-input"
      type="radio"
      :disabled="disabled"
      :value="name"
    />
    <label :for="cbId" class="custom-control-label">
      <slot>
        <span v-if="inline">&nbsp;</span>
      </slot>
    </label>
  </div>
</template>
<script>
export default {
  name: "BaseRadio",
  props: {
    name: {
      type: [String, Number],
      description: "Radio label",
      default: "",
    },
    disabled: {
      type: Boolean,
      description: "Whether radio is disabled",
    },
    value: {
      type: [String, Boolean],
      description: "Radio value",
      default: "",
    },
    inline: {
      type: Boolean,
      description: "Whether radio is inline",
    },
  },
  data() {
    return {
      cbId: "",
    };
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    inlineClass() {
      if (this.inline) {
        return `form-check-inline`;
      }
      return "";
    },
  },
  created() {
    this.cbId = Math.random().toString(16).slice(2);
  },
};
</script>
