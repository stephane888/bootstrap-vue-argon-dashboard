<template>
  <base-nav
    container-classes="container-fluid"
    class="navbar-top navbar-expand"
    :class="{ 'navbar-dark': type === 'default' }"
  >
    <a
      href="#"
      aria-current="page"
      class="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block active router-link-active"
    >
      {{ $route.name }}
    </a>
    <!-- Navbar links -->
    <b-navbar-nav class="align-items-center ml-md-auto">
      <!-- This item dont have <b-nav-item> because item have data-action/data-target on tag <a>, wich we cant add -->
      <li class="nav-item d-sm-none">
        <a
          class="nav-link"
          href="#"
          data-action="search-show"
          data-target="#navbar-search-main"
        >
          <i class="ni ni-zoom-split-in"></i>
        </a>
      </li>
    </b-navbar-nav>
    <b-navbar-nav class="align-items-center ml-md-auto">
      <CurrentProjets></CurrentProjets>
      <TimerExecution></TimerExecution>
    </b-navbar-nav>
    <b-navbar-nav class="align-items-center ml-auto ml-md-0">
      <b-form
        id="navbar-search-main"
        class="navbar-search form-inline mr-sm-3 d-none"
        :class="{
          'navbar-search-dark': type === 'default',
          'navbar-search-light': type === 'light'
        }"
      >
        <b-form-group class="mb-0">
          <b-input-group class="input-group-alternative input-group-merge">
            <b-form-input placeholder="Search" type="text"> </b-form-input>

            <div class="input-group-append">
              <span class="input-group-text">
                <i class="fas fa-search"></i>
              </span>
            </div>
          </b-input-group>
        </b-form-group>
      </b-form>
      <base-dropdown
        menu-on-right
        class="nav-item"
        tag="li"
        title-tag="a"
        title-classes="nav-link pr-0"
      >
        <a slot="title-container" href="#" class="nav-link pr-0" @click.prevent>
          <b-media no-body class="align-items-center">
            <span
              class="avatar avatar-sm rounded-circle text-uppercase font-weight-900"
            >
              {{ userName[0] }}{{ userName[1] }}
            </span>
            <b-media-body class="ml-2 d-none d-lg-block">
              <span class="mb-0 text-sm font-weight-bold">
                {{ userName }}
              </span>
            </b-media-body>
          </b-media>
        </a>

        <template v-if="show_template">
          <div>
            <b-dropdown-header class="noti-title">
              <h6 class="text-overflow m-0">Welcome!</h6>
            </b-dropdown-header>
            <b-dropdown-item href="#!">
              <i class="ni ni-single-02"></i>
              <span>My profile</span>
            </b-dropdown-item>
            <b-dropdown-item href="#!">
              <i class="ni ni-settings-gear-65"></i>
              <span>Settings</span>
            </b-dropdown-item>
            <b-dropdown-item href="#!">
              <i class="ni ni-calendar-grid-58"></i>
              <span>Activity</span>
            </b-dropdown-item>
            <b-dropdown-item href="#!">
              <i class="ni ni-support-16"></i>
              <span>Support</span>
            </b-dropdown-item>
            <div class="dropdown-divider"></div>
            <b-dropdown-item @click="deconnexion">
              <i class="ni ni-user-run"></i>
              <span> Logout </span>
            </b-dropdown-item>
          </div>
        </template>
      </base-dropdown>
    </b-navbar-nav>
  </base-nav>
</template>
<script>
  //import { CollapseTransition } from "vue2-transitions";
  import { BaseNav } from "@/components";
  import { mapState } from "vuex";

  export default {
    components: {
      BaseNav,
      CurrentProjets: () => import("../../App/project/CurrentProjets.vue"),
      TimerExecution: () => import("../../App/project/TimerExecution.vue")
    },
    props: {
      type: {
        type: String,
        default: "default", // default|light
        description:
          "Look of the dashboard navbar. Default (Green) or light (gray)"
      }
    },
    data() {
      return {
        activeNotifications: false,
        showMenu: false,
        searchModalVisible: false,
        searchQuery: "",
        show_template: true
      };
    },
    computed: {
      routeName() {
        const { name } = this.$route;
        return this.capitalizeFirstLetter(name);
      },
      userName() {
        if (this.user && this.user.current_user) {
          return this.user.current_user.name;
        } else return "Anonyme";
      },
      ...mapState(["user"])
    },

    methods: {
      capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      },
      toggleNotificationDropDown() {
        this.activeNotifications = !this.activeNotifications;
      },
      closeDropDown() {
        this.activeNotifications = false;
      },
      deconnexion() {
        this.$store.dispatch("deleteConnexion");
        this.$router.push({ name: "login" });
      }
    }
  };
</script>
