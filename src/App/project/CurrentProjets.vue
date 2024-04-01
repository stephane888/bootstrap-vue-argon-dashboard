<template>
  <div class="m-0 p-0 custom-drop-taches">
    <b-dropdown
      :text="total_taches + ' taches en attentes'"
      block
      class="p-0 m-0"
      variant="transparent"
    >
      <div class="p-0 m-0">
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

                <!-- <b-col md="3" class="d-flex justify-content-end">
                  <span
                    v-if="item.accordionOpen"
                    v-b-toggle="'cp-' + item.id"
                    v-b-tooltip.hover
                    variant="light"
                    class="btn-action mr-4"
                    title="Fermer"
                    @click="getStatusAccordion(item)"
                  >
                    <b-icon
                      icon="chevron-double-up"
                      aria-hidden="true"
                    ></b-icon>
                  </span>
                  <span
                    v-if="!item.accordionOpen"
                    v-b-toggle="'cp-' + item.id"
                    v-b-tooltip.hover
                    variant="light"
                    class="btn-action mr-4 d-inline-block"
                    title="Ouvrir"
                    @click="getStatusAccordion(item)"
                  >
                    <b-icon
                      icon="chevron-double-down"
                      aria-hidden="true"
                    ></b-icon>
                  </span>
                </b-col> -->
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
import { mapState } from "vuex";
export default {
  name: "CurrentProjets",
  data() {
    return {
      total_taches: 0,
    };
  },
  computed: {
    ...mapState({
      all_entitties: (state) => state.storeProject.all_entitties,
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
  },
  mounted() {
    this.loadEntitiesWithFilters();
  },
  methods: {
    loadEntitiesWithFilters() {
      const date = new Date();
      date.setDate(date.getDate() - 40);
      const filters = [
        { field: "status_execution", value: "new", operator: "=" },
        {
          field: "changed",
          value: parseInt(date.getTime() / 1000),
          operator: ">",
        },
      ];
      this.$store.dispatch("storeProject/loadEntitiesWithFilters", filters);
    },
    getStatusAccordion(item) {
      item.accordionOpen = !item.accordionOpen;
    },
    resetTotal() {
      this.total_taches = 0;
    },
    addToTotal(val) {
      this.total_taches += val;
    },
  },
};
</script>
<style lang="scss">
.custom-drop-taches {
  .dropdown-menu {
    width: 500px;
    left: -50%;
    right: auto;
  }
  a {
    color: #2955e6;
  }
}
</style>
