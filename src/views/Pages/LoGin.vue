<template>
  <div>
    <!-- Header -->
    <div
      v-if="!isLoggedIn"
      class="header bg-gradient-success py-7 py-lg-8 pt-lg-9"
    >
      <b-container>
        <div class="header-body text-center mb-7">
          <b-row class="justify-content-center">
            <b-col xl="5" lg="6" md="8" class="px-5">
              <h3 class="text-white">Habeuk</h3>
              <p class="text-lead text-white">Connectez vous !</p>
            </b-col>
          </b-row>
        </div>
      </b-container>
      <div class="separator separator-bottom separator-skew zindex-100">
        <svg
          x="0"
          y="0"
          viewBox="0 0 2560 100"
          preserveAspectRatio="none"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            class="fill-default"
            points="2560 0 2560 100 0 100"
          ></polygon>
        </svg>
      </div>
    </div>
    <!-- Page content -->
    <b-container v-if="!isLoggedIn" class="mt--8 pb-5">
      <b-row class="justify-content-center">
        <b-col lg="5" md="7">
          <b-card no-body class="bg-secondary border-0 mb-0">
            <b-card-header class="bg-transparent pb-5">
              <div class="text-muted text-center mt-2 mb-3">
                <small>Sign in with</small>
              </div>
              <div class="btn-wrapper text-center">
                <a href="#" class="btn btn-neutral btn-icon">
                  <span class="btn-inner--icon">
                    <img src="img/icons/common/github.svg" />
                  </span>
                  <span class="btn-inner--text">Github</span>
                </a>
                <a href="#" class="btn btn-neutral btn-icon">
                  <span class="btn-inner--icon">
                    <img src="img/icons/common/google.svg" />
                  </span>
                  <span class="btn-inner--text">Google</span>
                </a>
              </div>
            </b-card-header>
            <b-card-body class="px-lg-5 py-lg-5">
              <div class="text-center text-muted mb-4">
                <small>Or sign in with credentials</small>
              </div>
              <b-alert :show="has_error" variant="danger" dismissible>
                {{ error_message }}
              </b-alert>
              <validation-observer
                v-slot="{ handleSubmit }"
                ref="formValidator"
              >
                <b-form role="form" @submit.prevent="handleSubmit(onSubmit)">
                  <base-input
                    v-model="model.email"
                    alternative
                    class="mb-3"
                    name="Email"
                    :rules="{ required: true, email: false }"
                    prepend-icon="ni ni-email-83"
                    placeholder="Email"
                  >
                  </base-input>

                  <base-input
                    v-model="model.password"
                    alternative
                    class="mb-3"
                    name="Password"
                    :rules="{ required: true, min: 6 }"
                    prepend-icon="ni ni-lock-circle-open"
                    type="password"
                    placeholder="Password"
                  >
                  </base-input>

                  <b-form-checkbox v-model="model.rememberMe">
                    Remember me
                  </b-form-checkbox>
                  <div class="text-center">
                    <base-button
                      type="primary"
                      native-type="submit"
                      class="my-4"
                    >
                      Sign in
                    </base-button>
                  </div>
                </b-form>
              </validation-observer>
            </b-card-body>
          </b-card>
          <b-row class="mt-3">
            <b-col cols="6">
              <router-link to="/dashboard" class="text-light">
                <small>Forgot password?</small>
              </router-link>
            </b-col>
            <b-col cols="6" class="text-right">
              <router-link to="/register" class="text-light">
                <small>Create new account</small>
              </router-link>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
    <div
      v-if="isLoggedIn"
      class="header bg-gradient-success py-7 py-lg-8 pt-lg-9"
    >
      <b-container>
        <div class="header-body text-center mb-7">
          <b-row class="justify-content-center">
            <b-col xl="5" lg="6" md="8" class="px-5">
              <h3 class="text-white">Bienvenue sur Habeuk</h3>
              <p class="text-lead text-white">Vous etes connecte</p>
            </b-col>
          </b-row>
        </div>
      </b-container>
      <div class="separator separator-bottom separator-skew zindex-100">
        <svg
          x="0"
          y="0"
          viewBox="0 0 2560 100"
          preserveAspectRatio="none"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            class="fill-default"
            points="2560 0 2560 100 0 100"
          ></polygon>
        </svg>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "LoGin",
  data() {
    return {
      model: {
        email: "",
        password: "",
        rememberMe: false,
      },
      has_error: false,
      error_message: "Erreur d'identification",
    };
  },
  computed: {
    ...mapGetters(["isLoggedIn"]),
  },
  methods: {
    onSubmit() {
      this.has_error = false;
      var values = {
        name: this.model.email,
        pass: this.model.password,
      };
      this.$store
        .dispatch("login", values)
        .then(() => {
          this.$router.push({ path: "/" });
        })
        .catch((err) => {
          if (err.error && err.error.data && err.error.data.message) {
            this.error_message = err.error.data.message;
          }
          this.has_error = true;
        });
    },
  },
};
</script>
