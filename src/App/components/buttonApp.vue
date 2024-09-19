<template>
  <base-button
    type="transparent"
    class="mb-3 btn-outline-neutral"
    size="sm"
    @click="userClick"
  >
    <span class="d-flex align-items-center">
      <b-icon
        :icon="icon"
        :variant="variant"
        :font-scale="fontScale"
        :class="customClass"
      ></b-icon>
      <span> {{ textButton }} </span>
    </span>
  </base-button>
</template>

<script>
  export default {
    props: {
      icon: {
        type: String,
        default: "plus"
      },
      variant: {
        type: String,
        default: "dark"
      },
      fontScale: {
        type: Number,
        default: 1.4
      },
      customClass: {
        type: String,
        default: "mr-1"
      },
      textButton: {
        type: String,
        default: "Creer un projet"
      }
    },
    computed: {
      openModel: {
        get() {
          if (this.manageModal) return true;
          return false;
        },
        set() {}
      }
    },
    methods: {
      userClick() {
        this.$emit("userClick", true);
      }
    }
  };
</script>
