<template>
  <div>
    <base-header class="pb-2 pt-5">
      <b-row class="pt-5">
        <b-col md="6">
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block m-0">
            <AppBreadcrumb :bread-crumbs="breadCrumbs"></AppBreadcrumb>
          </nav>
        </b-col>
        <b-col md="6" class="d-flex justify-content-end">
          <!-- <button-app @userClick="userClick"></button-app> -->
        </b-col>
      </b-row>
    </base-header>
    <b-container fluid class="pb-4 pt-4">
      <FilterRapport></FilterRapport>
    </b-container>
  </div>
</template>

<script>
  import AppBreadcrumb from "../components/AppBreadcrumb.vue";
  export default {
    name: "RapportsAnalyse",
    components: {
      AppBreadcrumb,
      FilterRapport: () => import("./FilterRapport.vue")
    },
    computed: {
      breadCrumbs() {
        const staticUrl = [{ path: "/rapports", name: "Rapport et analyse" }];
        return staticUrl;
      }
    }
  };
</script>
