<template>
  <div class="list-entities">
    <div v-for="(group, i) in entities_groups" :key="i" class="hr">
      <div v-if="group.items.length">
        <h3>{{ group.label }} : {{ group.items.length }}</h3>
        <div role="tablist" class="accordion mb-4">
          <b-card v-for="(item, k) in group.items" :key="k" no-body>
            <b-card-header
              header-tag="header"
              class="pl-0 pr-2 py-1"
              role="tab"
              :class="getdynamicHeaderClassByStatus(item, i)"
            >
              <b-row>
                <b-col md="9">
                  <div class="d-flex">
                    <b-badge class="mr-2" variant="transparent">
                      {{ item.attributes.drupal_internal__id }}
                    </b-badge>
                    <h4
                      class="mb-2 d-flex w-100 align-items-baseline justify-content-between"
                    >
                      <router-link
                        :to="
                          '/projets/' +
                          configEntityTypeId +
                          '/' +
                          configEntityId +
                          '/' +
                          item.attributes.drupal_internal__id
                        "
                      >
                        <div class="mr-3">
                          {{ item.attributes.name }}
                        </div>
                      </router-link>

                      <titreInfos :item="item"></titreInfos>
                    </h4>
                  </div>
                  <div class="d-flex">
                    <small class="text-info--03 d-inline-block">
                      <b-icon icon="clock"></b-icon>
                      {{ timeAgoText(item.attributes.changed) }}
                    </small>
                    <small class="text-info--03 d-inline-block">
                      <b-icon icon="calendar2-check"></b-icon>
                      {{ getDateInfrench(item.attributes.created) }} by
                      {{ getUserName(item.relationships) }}
                    </small>
                    <countsubTaches
                      :entity="item"
                      :config-entity-type-id="configEntityTypeId"
                      :config-entity-id="configEntityId"
                    ></countsubTaches>
                  </div>
                </b-col>
                <b-col md="3" class="d-flex justify-content-end">
                  <span
                    v-b-tooltip.hover
                    variant="light"
                    class="btn-action mr-4"
                    title="Voir"
                  >
                    <router-link
                      :to="
                        '/projets/' +
                        configEntityTypeId +
                        '/' +
                        configEntityId +
                        '/' +
                        item.attributes.drupal_internal__id
                      "
                    >
                      <b-icon icon="eye" aria-hidden="true"></b-icon>
                    </router-link>
                  </span>
                  <span
                    v-if="item.accordionOpen"
                    v-b-toggle="item.accordionId"
                    v-b-tooltip.hover
                    variant="light"
                    class="btn-action mr-4"
                    title="Fermer"
                    @click="getStatusAccordionAndLoadEntity(item, $event)"
                  >
                    <b-icon
                      icon="chevron-double-up"
                      aria-hidden="true"
                    ></b-icon>
                  </span>
                  <span
                    v-if="!item.accordionOpen"
                    v-b-toggle="item.accordionId"
                    v-b-tooltip.hover
                    variant="light"
                    class="btn-action mr-4 d-inline-block"
                    title="Ouvrir"
                    @click="getStatusAccordionAndLoadEntity(item, $event)"
                  >
                    <b-icon
                      icon="chevron-double-down"
                      aria-hidden="true"
                    ></b-icon>
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
                    class="btn-action"
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
                <b-col md="12" class="pt-2">
                  <TacheProgressBar
                    class="ml-2"
                    :model="item.attributes"
                    class-progress="mb-0"
                    :show-date="false"
                    :show-end-date="true"
                  ></TacheProgressBar>
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
                  >
                    <div
                      v-html="
                        textDisplayHljs(item.attributes.description.processed)
                      "
                    ></div>
                  </div>
                </b-card-text>
              </b-card-body>
            </b-collapse>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import config from "../request";
  import TacheProgressBar from "../components/TacheProgressBar.vue";
  import TimeAgo from "javascript-time-ago";
  import fr from "javascript-time-ago/locale/fr";
  import hljs from "highlight.js";

  TimeAgo.addDefaultLocale(fr);
  export default {
    name: "AccordionEntities",
    components: {
      titreInfos: () => import("../components/TitreInfos.vue"),
      TacheProgressBar: TacheProgressBar,
      countsubTaches: () => import("../components/CountsubTaches.vue")
    },
    props: {
      configEntityTypeId: {
        type: [String, Number],
        required: true
      },
      configEntityId: {
        type: [String, Number],
        required: true
      },
      entities: {
        type: [Array],
        required: true
      }
    },
    data() {
      return {
        idBase: "accd-item-" + Math.random().toString(36)
      };
    },
    computed: {
      entities_groups() {
        var groupe_taches = config.initGroupeStatus();
        if (this.entities) {
          this.entities.forEach((item) => {
            if (item.attributes.status_execution) {
              groupe_taches[item.attributes.status_execution].items.push(item);
            } else {
              groupe_taches.undefined.items.push(item);
            }
          });
        }
        return groupe_taches;
      }
    },
    mounted() {
      //
    },
    methods: {
      timeAgoText(string_date) {
        const date = new Date(string_date);
        const timeAgo = new TimeAgo();
        return timeAgo.format(date);
      },
      getDateInfrench(string_date) {
        const date = new Date(string_date);
        if (date) {
          let month = parseInt(date.getMonth()) + 1;
          return (
            ("0" + date.getDate()).slice(-2) +
            "-" +
            ("0" + month).slice(-2) +
            "-" +
            date.getFullYear() +
            " " +
            ("0" + date.getHours()).slice(-2) +
            ":" +
            ("0" + date.getMinutes()).slice(-2)
          );
        }
      },
      /**
       * --
       */
      editEntity(attributes) {
        this.$emit("editEntity", attributes);
      },
      getStatusAccordionAndLoadEntity(item, event) {
        item.accordionOpen = !item.accordionOpen;

        if (event.target && item.accordionOpen && !item.is_loadded) {
          item.is_loadded = true;
          if (item.links.self.href) {
            this.$store
              .dispatch("storeProject/LaodEntityByUrl", {
                url: item.links.self.href
              })
              .then((resp) => {
                if (resp.data.attributes) {
                  item.attributes = resp.data.attributes;
                }
              })
              .catch(() => {
                item.is_loadded = false;
              });
          }
        }
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
      getUserName(relationships) {
        if (relationships.user_id.data.meta.drupal_internal__target_id) {
          const id = relationships.user_id.data.meta.drupal_internal__target_id;
          return config.getUserName(id);
        }
      },
      /**
       * Permet de recuperer l'etat de la classe du header en function du status.
       * @param {*} item
       */
      getdynamicHeaderClassByStatus(item, group_id) {
        var variant_header = "bg-light";
        switch (group_id) {
          case "running":
            variant_header = "bg-gradient-vert-sombre text-white";
            break;
          case "validate":
            variant_header = "bg-gradient-vert-sombre2 text-white";
            break;
          case "end":
            variant_header = "bg-gradient-gray-dark text-white";
            break;
        }
        if (item.attributes.private) {
          variant_header += " border-right border-danger";
        }
        return variant_header;
      },
      /**
       * On parcout le texte et on remplace les balises.
       * @param {*} description
       */
      textDisplayHljs(description) {
        var newDiv = document.createElement("div");
        newDiv.innerHTML = description;
        newDiv.querySelectorAll("pre code").forEach((block) => {
          hljs.highlightBlock(block);
        });
        return newDiv.outerHTML;
      }
    }
  };
</script>
<style lang="scss">
  .list-entities {
    .badge {
      font-size: 78%;
    }
    .card-header a {
      color: inherit;
    }
  }
</style>
