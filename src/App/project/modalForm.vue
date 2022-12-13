<!-- Ce fichier permet de gerer tous edition de cntenu quii doit se faire via un model. -->
<template>
  <b-modal
    id="b-modal-manage-project"
    v-model="openModel"
    title="BootstrapVue"
    size="lg"
    footer-bg-variant="secondary"
    :no-close-on-backdrop="true"
    @ok="handleOk"
  >
    <template #modal-header>
      <h2 v-html="titleModal"></h2>
    </template>
    <template #default>
      <slot name="formEdit"></slot>
    </template>
    <template #modal-footer="{ cancel }">
      <b-button size="md" variant="outline-primary" @click="handleOk">
        <b-icon icon="save2" variant="success"></b-icon>
        Enregister
      </b-button>
      <b-button size="md" variant="outline-warning" @click="cancel()">
        Annuler
      </b-button>
    </template>
  </b-modal>
</template>
<script>
export default {
  props: {
    manageModal: {
      type: Boolean,
      default: false,
    },
    titleModal: {
      type: String,
      required: true,
    },
  },
  computed: {
    openModel: {
      get() {
        if (this.manageModal) return true;
        return false;
      },
      set(value) {
        this.$emit("closeModal", value);
      },
    },
  },
  methods: {
    handleOk() {
      this.$emit("submitModel");
    },
  },
};
</script>
