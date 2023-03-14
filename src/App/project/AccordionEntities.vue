<template>
  <div>
    <div role="tablist" class="accordion">
      <b-card v-for="(item, k) in entities" :key="k" no-body class="mb-1">
        <b-card-header
          header-tag="header"
          class="px-2 py-1"
          role="tab"
          header-bg-variant="light"
        >
          <b-row>
            <b-col md="9">
              <h5 class="mb-0">
                {{ item.attributes.name }}
              </h5>
            </b-col>
            <b-col md="3">
              <span
                v-if="item.accordionOpen"
                v-b-toggle="item.accordionId"
                v-b-tooltip.hover
                variant="light"
                class="btn-action mr-4"
                title="Fermer"
                @click="getStatusAccordion(item)"
              >
                <b-icon icon="chevron-double-up" aria-hidden="true"></b-icon>
              </span>
              <span
                v-if="!item.accordionOpen"
                v-b-toggle="item.accordionId"
                v-b-tooltip.hover
                variant="light"
                class="btn-action mr-4 d-inline-block"
                title="Ouvrir"
                @click="getStatusAccordion(item)"
              >
                <b-icon icon="chevron-double-down" aria-hidden="true"></b-icon>
              </span>
              <span
                v-b-tooltip.hover.v-info
                class="btn-action mr-4"
                title="Modifier"
                role="button"
                href="#"
                @click.prevent="editEntity(item.attributes)"
              >
                <b-icon
                  icon="pencil"
                  aria-hidden="true"
                  variant="info"
                ></b-icon>
              </span>
              <span
                v-b-tooltip.hover.v-danger
                class="btn-action mr-4"
                title="Modifier"
                role="button"
                href="#"
                @click.prevent="DeleteEntity(item)"
              >
                <b-icon
                  icon="trash"
                  aria-hidden="true"
                  variant="danger"
                ></b-icon>
              </span>
            </b-col>
          </b-row>
        </b-card-header>
        <b-collapse
          :id="item.accordionId"
          accordion="my-accordion"
          role="tabpanel"
        >
          <b-card-body>
            <b-card-text>
              <div
                v-if="
                  item.attributes.description &&
                  item.attributes.description.processed
                "
                v-html="item.attributes.description.processed"
              ></div>
            </b-card-text>
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import config from "../../rootConfig";
export default {
  name: "AccordionEntities",
  data() {
    return {
      idBase: "accd-item-" + Math.random().toString(36),
    };
  },
  computed: {
    ...mapState({
      entities: (state) => state.storeProject.entities,
    }),
    ...mapGetters(["entity_type_id"]),
  },
  mounted() {
    //
  },
  methods: {
    /**
     * --
     */
    editEntity(attributes) {
      this.$emit("editEntity", attributes);
    },
    getStatusAccordion(item) {
      item.accordionOpen = !item.accordionOpen;
    },
    DeleteEntity(item) {
      config
        .modalConfirmDelete(
          "Confirmer la suppression, NB : cette action est irreverssible.",
          { title: " Suppresion de : " + item.attributes.name }
        )
        .then((status) => {
          if (status) {
            this.$emit("DeleteEntity", item);
          }
        });
    },
  },
};
</script>
