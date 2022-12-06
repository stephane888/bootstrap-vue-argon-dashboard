<template>
  <div>
    <base-header class="pb-2 pt-5 bg-gradient-success">
      <b-row class="pt-5">
        <b-col md="6"></b-col>
        <b-col md="6" class="d-flex justify-content-end">
          <button-app @userClick="userClick"></button-app>
        </b-col>
      </b-row>
    </base-header>
    <b-container fluid class="pb-4 pt-4">
      <div v-for="(item, index) in projects" :key="index" class="">
        <h3>{{ item.label }}</h3>
        <b-row>
          <b-col
            v-for="(entity, i) in item.entities"
            :key="i"
            xl="3"
            lg="4"
            md="6"
            sm="6"
            class=""
          >
            <stats-card
              type="gradient-red"
              sub-title="350,897"
              icon="ni ni-active-40"
              class="mb-4 bg-gradient-white"
            >
              <div v-html="entity.label"></div>
              <template slot="icon">
                <b-button
                  variant="transparent"
                  size="sm"
                  @click="editProject(entity)"
                >
                  <b-icon icon="pencil-fill"></b-icon>
                </b-button>
              </template>
              <template slot="footer">
                <span class="text-info mr-2 font-weight-600">3.48%</span>
                <span class="text-nowrap">Since last month</span>
              </template>
            </stats-card>
          </b-col>
        </b-row>
      </div>
      <b-row>
        <b-col xl="3" md="4">
          <stats-card
            title="Total traffic"
            type="gradient-red"
            sub-title="350,897"
            icon="ni ni-active-40"
            class="mb-4"
          >
            <template slot="footer">
              <span class="text-success mr-2">3.48%</span>
              <span class="text-nowrap">Since last month</span>
            </template>
          </stats-card>
        </b-col>
      </b-row>
    </b-container>
    <modalFrom
      :manage-modal="manageModal"
      :title-modal="titleModal"
      @closeModal="closeModal"
    ></modalFrom>
  </div>
</template>
<script>
import ButtonApp from "../components/buttonApp.vue";
import modalFrom from "./modalForm.vue";
import { mapState } from "vuex";
export default {
  components: {
    modalFrom,
    ButtonApp,
  },
  data() {
    return {
      manageModal: false,
      titleModal: "Creer un nouveau projet",
    };
  },
  computed: {
    ...mapState({
      projects: (state) => state.storeProject.projects,
    }),
  },
  mounted() {
    this.$store.dispatch("storeProject/loadProjectType");
  },
  methods: {
    userClick(clean = true) {
      this.manageModal = this.manageModal ? false : true;
      if (clean) this.$store.commit("storeProject/SET_CURRENT_PROJECT");
    },
    closeModal(val) {
      this.manageModal = val;
    },
    editProject(entity) {
      this.$store.commit("storeProject/SET_CURRENT_PROJECT", entity);
      this.userClick(false);
    },
  },
};
</script>
