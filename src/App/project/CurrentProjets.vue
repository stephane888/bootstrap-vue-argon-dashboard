<template>
  <div class="m-0 p-0 custom-drop-taches">
    <b-dropdown
      :text="total_taches + '  ' + getCurrentLabel"
      block
      class="p-0 m-0"
      variant="transparent"
      right
    >
      <div class="p-0 m-0">
        <b-form class="row">
          <b-form-group
            label="Status de la tache"
            label-size="sm"
            class="col-md-6"
          >
            <b-select
              v-model="form.status_execution"
              :options="status_execution_options"
              @change="loadEntitiesWithFilters"
              size="sm"
            ></b-select>
          </b-form-group>
          <b-form-group label="Executé par" label-size="sm" class="col-md-6">
            <b-select
              v-model="form.user_id"
              :options="users"
              @change="loadEntitiesWithFilters"
              size="sm"
            ></b-select>
          </b-form-group>
        </b-form>
        <div class="accordion" role="tablist">
          <b-card v-for="(item, k) in list_has_datas" :key="k" no-body>
            <b-card-header header-tag="header" class="p-2 bg-light" role="tab">
              <b-row>
                <b-col v-b-toggle="'cp-' + item.id">
                  <div class="d-flex justify-content-between">
                    <span> {{ item.label }} </span>
                    <div>
                      <b-badge
                        v-if="item.count_sub_taches > 0"
                        class="d-inline-block ml-1 bg-gradient-transparent_01 text-lowercase text-white ml-2"
                      >
                        {{ item.count_sub_taches }} sous taches
                      </b-badge>
                      <b-badge
                        v-if="item.entities_content.length"
                        class="d-inline-block ml-1 bg-gradient-transparent_02 text-lowercase text-white ml-2"
                      >
                        {{ item.entities_content.length }} taches
                      </b-badge>
                    </div>
                  </div>
                </b-col>
              </b-row>
            </b-card-header>
            <b-collapse
              :id="'cp-' + item.id"
              accordion="my-cp-accordion"
              role="tabpanel"
            >
              <b-card-body>
                <b-card-text
                  v-for="(entity, p) in item.entities_content"
                  :key="p"
                >
                  <router-link
                    :to="
                      '/projets/' +
                      item.entity_type_id +
                      '/' +
                      item.id +
                      '/' +
                      entity.id[0].value
                    "
                  >
                    {{ entity.name[0].value }}
                  </router-link>
                </b-card-text>
              </b-card-body>
            </b-collapse>
          </b-card>
        </div>
      </div>
    </b-dropdown>
  </div>
</template>
<script>
  import request from "../request";
  import { mapState } from "vuex";
  export default {
    name: "CurrentProjets",
    data() {
      return {
        total_taches: 0,
        form: {
          status_execution: "new",
          user_id: ""
        },
        status_execution_options: request.status_execution
      };
    },
    computed: {
      ...mapState({
        all_entitties: (state) => state.storeProject.all_entitties,
        users: (state) => state.users,
        user: (state) => state.user
      }),
      list_has_datas() {
        const list = [];
        this.resetTotal();
        if (this.all_entitties) {
          for (const i in this.all_entitties) {
            for (const j in this.all_entitties[i].entities) {
              const entities = this.all_entitties[i].entities[j];
              if (entities.entities_content.length) {
                this.addToTotal(entities.entities_content.length);
                entities["entity_type_id"] = i;
                // get subTache
                entities["count_sub_taches"] = 0;
                for (const k in entities.entities_content) {
                  entities["count_sub_taches"] +=
                    entities.entities_content[k].sub_taches.length;
                }
                list.push(entities);
              }
            }
          }
        }
        return list;
      },
      getCurrentLabel() {
        var label = "";
        if (
          this.form.status_execution &&
          this.status_execution_options.length
        ) {
          this.status_execution_options.forEach((element) => {
            if (element.value === this.form.status_execution)
              label = element.text;
          });
        }
        return label;
      }
    },
    mounted() {
      this.loadEntitiesWithFilters();
      // set default user.
      if (this.user && this.user.current_user) {
        this.form.user_id = this.user.current_user.uid;
      }
    },
    methods: {
      loadEntitiesWithFilters() {
        const date = new Date();
        date.setDate(date.getDate() - 40);
        const filters = {
          AND: [
            {
              field: "status_execution",
              value: this.form.status_execution,
              operator: "="
            },

            {
              field: "changed",
              value: parseInt(date.getTime() / 1000),
              operator: ">"
            }
          ],
          OR: []
        };
        if (this.form.user_id > 0 && this.form.status_execution != "new") {
          filters.OR.push({
            field: "project_manager",
            operator: "=",
            value: this.form.user_id
          });
          filters.OR.push({
            field: "executants",
            operator: "IN",
            value: this.form.user_id
          });
        }
        this.$store.dispatch("storeProject/loadEntitiesWithFilters", {
          uid: this.form.user_id
            ? this.form.user_id
            : this.user.current_user.uid,
          filters: filters
        });
      },
      getStatusAccordion(item) {
        item.accordionOpen = !item.accordionOpen;
      },
      resetTotal() {
        this.total_taches = 0;
      },
      addToTotal(val) {
        this.total_taches += val;
      }
    }
  };
</script>
<style lang="scss">
  .custom-drop-taches {
    .dropdown-menu {
      width: 400px;
      padding: 0.5rem;
    }
  }
</style>
