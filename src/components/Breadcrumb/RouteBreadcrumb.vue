<template>
  <bread-crumb list-classes="breadcrumb-links breadcrumb-dark">
    <BreadCrumbItem>
      <router-link to="/">
        <i class="fas fa-home"></i>
      </router-link>
    </BreadCrumbItem>
    <BreadCrumbItem
      v-for="(route, index) in $route.matched.slice()"
      :key="route.name"
      :active="index === $route.matched.length - 1"
      style="display: inline-block"
    >
      <router-link
        v-if="index < $route.matched.length - 1"
        :to="{ name: route.name }"
      >
        {{ route.name }}
      </router-link>
      <span v-else>{{ route.name }}</span>
    </BreadCrumbItem>
  </bread-crumb>
</template>

<script>
  import BreadCrumb from "./Breadcrumb";
  import BreadCrumbItem from "./BreadcrumbItem";

  export default {
    name: "RouteBreadcrumb",
    components: {
      BreadCrumb,
      BreadCrumbItem
    },
    // mounted() {
    //   console.log("routes : ", this.$route.matched.slice());
    // },
    methods: {
      getBreadName(route) {
        return route.name;
      }
    }
  };
</script>

<style scoped></style>
