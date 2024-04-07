<template>
  <div class="d-inline titre-infos">
    <div class="d-flex flex-wrap">
      <b-badge
        v-if="chiefId"
        class="d-inline-block ml-1 bg-gradient-transparent_02 text-lowercase text-white"
      >
        {{ chiefName }}
      </b-badge>
      <b-badge
        v-for="(name, i) in executants"
        :key="i"
        class="d-inline-block ml-2 bg-gradient-transparent_01 text-lowercase text-white"
      >
        {{ name }}
      </b-badge>
      <b-badge
        v-if="time_execution"
        class="d-inline-block ml-1 bg-gradient-transparent_01 text-lowercase text-white ml-2"
      >
        <b-icon icon="clock-history" variant="light" class="mr-1"></b-icon>
        {{ time_execution }}
      </b-badge>
    </div>
  </div>
</template>

<script>
  import config from "../request";
  import getDureeDisplay from "./getDureeDisplay";
  export default {
    name: "TitreInfos",
    props: {
      item: { type: Object, required: true }
    },
    data() {
      return {
        TimeOfProject: 0,
        timerProgressBar: null
      };
    },
    mounted() {
      this.getTotalTimeOfProject();
    },
    computed: {
      chiefId() {
        if (
          this.item.relationships.project_manager &&
          this.item.relationships.project_manager.data &&
          this.item.relationships.project_manager.data.meta
        ) {
          return this.item.relationships.project_manager.data.meta
            .drupal_internal__target_id;
        } else return null;
      },
      chiefName() {
        return config.getUserName(this.chiefId);
      },
      executants() {
        const items = [];
        if (
          this.item.relationships.executants &&
          this.item.relationships.executants.data
        ) {
          this.item.relationships.executants.data.forEach((item) => {
            let uid = item.meta.drupal_internal__target_id;
            if (uid != this.chiefId) items.push(config.getUserName(uid));
          });
        }
        return items;
      },
      time_execution() {
        if (
          this.item.attributes.duree_execution &&
          this.item.attributes.duree_execution > 0
        ) {
          var time_display = "0h";
          if (this.TimeOfProject > 0)
            time_display = config.convertTimeMinuteToRead(this.TimeOfProject);

          time_display +=
            "/" +
            config.convertTimeMinuteToRead(
              this.item.attributes.duree_execution
            );
          return time_display;
        } else return "null";
      }
    },
    methods: {
      getTotalTimeOfProject() {
        const status_execution = this.item.attributes.status_execution;
        this.TimeOfProject = getDureeDisplay.getTotalTimeOfProject(
          this.item.attributes.duree,
          status_execution
        );
        if (status_execution == "running") {
          clearInterval(this.timerProgressBar);
          this.timerProgressBar = setInterval(() => {
            this.TimeOfProject = getDureeDisplay.getTotalTimeOfProject(
              this.item.attributes.duree,
              status_execution
            );
          }, 120000);
        }
      }
    }
  };
</script>
