<template>
  <div>
    <b-form v-if="show" @submit="onSubmit" @reset="onReset">
      <b-form-group
        id="input-group-1"
        label="Nom du projet "
        label-for="input-1"
        :description="!form.uuid ? idEntity : form.id"
      >
        <b-form-input
          id="input-1"
          v-model="form.label"
          placeholder="Nom du projet"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-2"
        label="Une description tres courte du project"
        label-for="input-2"
      >
        <b-form-textarea
          id="textarea-rows"
          v-model="form.description"
          placeholder="Description du projet"
          rows="6"
        ></b-form-textarea>
      </b-form-group>
      <b-form-group label="Privée">
        <b-form-checkbox v-model="form.private" required></b-form-checkbox>
      </b-form-group>
      <b-form-group label="Status">
        <b-form-checkbox v-model="form.status" required></b-form-checkbox>
      </b-form-group>
      <b-form-group
        label="Liste de personne autorisé à travailler sur le projet"
      >
        <b-form-checkbox-group
          v-model="form.users"
          :options="options"
          name="flavour-1"
        ></b-form-checkbox-group>
      </b-form-group>

      <b-button v-if="showSubmit" type="submit" variant="outline-primary">
        Creer le projet
      </b-button>
    </b-form>
  </div>
</template>

<script>
import request from "../request";
import { mapState } from "vuex";
import itemsEntity from "drupal-vuejs/src/App/jsonApi/itemsEntity.js";
//import CKEditor from "ckeditor4-vue";
export default {
  name: "FormProjetType",
  components: {
    //ckeditor: CKEditor.component,
  },
  props: {
    showSubmit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      show: true,
      options: [],
    };
  },
  computed: {
    ...mapState({
      form: (state) => state.storeProject.currentProject,
    }),
    idEntity() {
      if (this.form.label !== "") {
        var id = request.generateIdEntityType(this.form.label);
        this.setId(id);
        return id;
      } else return "";
    },
  },
  mounted() {
    this.loadTerms();
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
     * @public
     */
    submit() {
      if (!this.form.id) {
        alert("Contenu vide");
        return;
      }
      // return this.$store.dispatch("storeProject/saveEntity");
      // const payload = { entity_type_id: "app_project_type", value: this.form };
      // return this.$store.dispatch("storeProject/saveEntity", payload);
      this.$emit("saveProjectType", this.form);
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
    loadTerms() {
      let vocabulary = "user";
      if (vocabulary && request) {
        const terms = new itemsEntity(vocabulary, vocabulary, request);
        terms.remplaceConfig();
        terms.get().then(() => {
          this.options = terms.getOptions();
        });
      }
    },
  },
};
</script>
