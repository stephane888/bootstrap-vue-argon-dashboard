<template>
  <nav
    id="sidenav-main"
    class="navbar navbar-vertical fixed-left navbar-expand-md navbar-light bg-gradient-lighter"
  >
    <div class="container-fluid">
      <!--Toggler-->
      <navbar-toggle-button @click.native="showSidebar"> </navbar-toggle-button>
      <router-link class="navbar-brand" to="/">
        <img :src="logo" class="navbar-brand-img" alt="..." />
        <h3>HABEUK</h3>
      </router-link>

      <slot name="mobile-right">
        <ul class="nav align-items-center d-md-none">
          <base-dropdown class="nav-item" menu-on-right tag="li" title-tag="a">
            <a
              slot="title-container"
              class="nav-link nav-link-icon"
              href="#"
              role="button"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i class="ni ni-bell-55"></i>
            </a>

            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#">Something else here</a>
          </base-dropdown>
          <base-dropdown class="nav-item" menu-on-right tag="li" title-tag="a">
            <a slot="title-container" class="nav-link" href="#" role="button">
              <div class="media align-items-center">
                <span class="avatar avatar-sm rounded-circle">
                  <img alt="Image placeholder" src="img/theme/team-1.jpg" />
                </span>
              </div>
            </a>

            <div class="dropdown-header noti-title">
              <h6 class="text-overflow m-0">Welcome!</h6>
            </div>
            <router-link to="/profile" class="dropdown-item">
              <i class="ni ni-single-02"></i>
              <span>My profile</span>
            </router-link>
            <router-link to="/profile" class="dropdown-item">
              <i class="ni ni-settings-gear-65"></i>
              <span>Settings</span>
            </router-link>
            <router-link to="/profile" class="dropdown-item">
              <i class="ni ni-calendar-grid-58"></i>
              <span>Activity</span>
            </router-link>
            <router-link to="/profile" class="dropdown-item">
              <i class="ni ni-support-16"></i>
              <span>Support</span>
            </router-link>
            <div class="dropdown-divider"></div>
            <a href="#!" class="dropdown-item">
              <i class="ni ni-user-run"></i>
              <span>Logout (none)</span>
            </a>
          </base-dropdown>
        </ul>
      </slot>
      <slot></slot>
      <div
        v-show="$sidebar.showSidebar"
        id="sidenav-collapse-main"
        class="navbar-collapse collapse show"
      >
        <div class="navbar-collapse-header d-md-none">
          <div class="row">
            <div class="col-6 collapse-brand">
              <router-link to="/">
                <img :src="logo" />
              </router-link>
            </div>
            <div class="col-6 collapse-close">
              <navbar-toggle-button
                @click.native="closeSidebar"
              ></navbar-toggle-button>
            </div>
          </div>
        </div>

        <ul class="navbar-nav">
          <slot name="links"> </slot>
        </ul>
        <!--Divider-->
        <hr class="my-3" />
        <h5 class="navbar-heading text-muted">Programme de travail</h5>
        <ul class="navbar-nav mb-md-3">
          <li v-if="userConfig.day_duration" class="nav-item">
            <a class="nav-link d-flex flex-column align-items-baseline">
              <strong>Horaire de travail</strong>
              <div>
                {{ userConfig.day_duration[0] }}h --
                {{ userConfig.day_duration[1] }}h
              </div>
            </a>
          </li>
          <li v-if="userConfig.duration_work_day" class="nav-item">
            <a class="nav-link d-flex flex-column align-items-baseline">
              <strong>Durée de travail/jour</strong>
              <div>{{ userConfig.duration_work_day }}h</div>
            </a>
          </li>
          <li v-if="userConfig.pauses" class="nav-item">
            <a class="nav-link d-flex flex-column align-items-baseline">
              <strong>
                Pauses <small>{{ userConfig.duration_pauses }}h</small>
              </strong>
              <div v-for="(pause, i) in userConfig.pauses" :key="i">
                {{ pause[0] }}h -- {{ pause[1] }}h
              </div>
            </a>
          </li>
        </ul>

        <!--Divider-->
        <hr class="my-3" />
        <!--Heading-->
        <h6 class="navbar-heading text-muted">Documentation ...</h6>
        <!--Navigation-->
        <ul class="navbar-nav mb-md-3">
          <li class="nav-item">
            <a
              class="nav-link"
              href="https://www.creative-tim.com/learning-lab/bootstrap-vue/alerts/argon-dashboard"
            >
              <i class="ni ni-spaceship"></i> Getting started
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              href="https://www.creative-tim.com/learning-lab/bootstrap-vue/colors/argon-dashboard"
            >
              <i class="ni ni-palette"></i> Foundation
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              href="https://www.creative-tim.com/learning-lab/bootstrap-vue/alerts/argon-dashboard"
            >
              <i class="ni ni-ui-04"></i> Components
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
  import NavbarToggleButton from "@/components/NavbarToggleButton";
  import { mapState } from "vuex";
  export default {
    name: "SideBar",
    components: {
      NavbarToggleButton
    },
    provide() {
      return {
        autoClose: this.autoClose
      };
    },
    props: {
      logo: {
        type: String,
        default: "img/brand/untitled-42_4x-v2.png",
        description: "Sidebar app logo"
      },
      autoClose: {
        type: Boolean,
        default: true,
        description:
          "Whether sidebar should autoclose on mobile when clicking an item"
      }
    },
    computed: {
      ...mapState({
        userConfig: (state) => state.userConfig
      })
      // formatterWorkDay() {
      //   if (this.userConfig) {

      //   } else return {};
      // }
    },
    beforeDestroy() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.showSidebar = false;
      }
    },
    methods: {
      closeSidebar() {
        this.$sidebar.displaySidebar(false);
      },
      showSidebar() {
        this.$sidebar.displaySidebar(true);
      }
    }
  };
</script>
