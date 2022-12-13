<template>
  <bread-crumb list-classes="breadcrumb-links bg-transparent">
    <BreadCrumbItem>
      <router-link to="/">
        <i class="fas fa-home"></i>
      </router-link>
    </BreadCrumbItem>
    <BreadCrumbItem
      v-for="(route, index) in breadCrumbs"
      :key="index"
      :active="false"
      style="display: inline-block"
    >
      <router-link :to="route.path">
        {{ route.name }}
      </router-link>
    </BreadCrumbItem>
  </bread-crumb>
</template>

<script>
import BreadCrumb from "../../components/Breadcrumb/Breadcrumb.vue";
import BreadCrumbItem from "../../components/Breadcrumb/BreadcrumbItem";

export default {
  name: "AppBreadcrumb",
  components: {
    BreadCrumb,
    BreadCrumbItem,
  },
  props: {
    breadCrumbs: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  methods: {
    getBreadName(route) {
      return route.name;
    },
  },
};
</script>
