<template>
  <div>
    <ValidationObserver ref="formObserver" tag="section">
      <b-form v-if="fields.length" @submit="onSubmit" @reset="onReset">
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
            :override-config="true"
            size="sm"
            namespace-store="storeProject"
          ></component>
        </component>
      </b-form>
      <div
        v-if="!fields.length && running"
        class="d-flex py-5 justify-content-center align-items-center"
      >
        <b-icon
          icon="arrow-clockwise"
          animation="spin"
          font-scale="4"
          variant="info"
        ></b-icon>
      </div>
    </ValidationObserver>
  </div>
</template>

<script>
import request from "../request";
import { mapState } from "vuex";
// import loadField from "components_h_vuejs/src/components/fieldsDrupal/loadField";
export default {
  name: "FormProjetType",
  data() {
    return {
      showForm: false,
    };
  },
  computed: {
    ...mapState({
      fields: (state) => state.storeProject.fields,
      running: (state) => state.storeProject.running,
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
     * Permet de valider le formulaire.
     */
    ValidationForm() {
      return this.$refs.formObserver.validate();
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
