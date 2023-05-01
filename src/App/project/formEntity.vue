<template>
  <div>
    <b-form v-if="show" @submit="onSubmit" @reset="onReset">
      <component
        :is="container.template"
        v-for="(container, i) in fields"
        :key="i"
        :entity="container.entity"
        :class-entity="['pt-1']"
      >
        <component
          :is="render.template"
          v-for="(render, k) in container.fields"
          :key="k"
          :field="render.field"
          :model="render.model"
          :entities="render.entities"
          :class-css="['mb-2']"
          :parent-name="i + '.entity.'"
          :parent-child-name="i + '.entities.'"
          size="sm"
          namespace-store="storeProject"
        ></component>
      </component>
    </b-form>
  </div>
</template>

<script>
import request from "../request";
import { mapState } from "vuex";
// import loadField from "components_h_vuejs/src/components/fieldsDrupal/loadField";
export default {
  name: "FormProjetType",
  props: {
    showSubmit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      show: true,
    };
  },
  computed: {
    ...mapState({
      fields: (state) => state.storeProject.fields,
    }),
    idEntity() {
      if (this.form.label !== "") {
        var id = request.generateIdEntityType(this.form.label);
        this.setId(id);
        return id;
      } else return "";
    },
  },
  methods: {
    /**
     * @private
     * @param {*} event
     */
    onSubmit(event) {
      event.preventDefault();
      this.submit();
    },
    /**
     * n'est pas utilisé
     * @public
     * @deprecated
     */
    submit() {
      if (!this.form.id) {
        alert("Contenu vide");
        return;
      }
      alert("save");
      return this.$store.dispatch("storeProject/saveEntities");
    },
    onReset(event) {
      event.preventDefault();
      // Reset our form values
      this.form.id = "";
      this.form.label = "";
      this.form.description = "";
      this.form.users = [];
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
    setId(id) {
      // Si l'uuid n'existe, alors c'est une creation de type, on peut generer l'id.
      if (!this.form.uuid) this.form.id = id;
    },
  },
};
</script>
