<template>
  <div class="m-0 p-0 custom-drop-taches">
    <b-dropdown
      :text="render()"
      block
      class="p-0 m-0"
      variant="transparent"
      right
    >
      <div class="accordion" role="tablist">
        <b-card v-for="(item, k) in userInfosFormat" :key="k" no-body>
          <b-card-header header-tag="header" class="p-2 bg-light" role="tab">
            <b-row>
              <b-col v-b-toggle="'te-' + item.type" class="d-flex">
                <span> {{ item.name_project }} </span>
                <div>
                  <b-badge
                    class="d-inline-block ml-1 bg-gradient-transparent_01 text-lowercase text-white ml-2"
                  >
                    {{ (item.duree / 3600).toFixed(2) }} h
                  </b-badge>
                </div>
              </b-col>
            </b-row>
          </b-card-header>
          <b-collapse
            :id="'te-' + item.type"
            accordion="my-cp-accordion"
            role="tabpanel"
          >
            <b-card-body>
              <div v-for="(element, p) in item.elements" :key="p">
                <div class="d-flex w-100 justify-content-between">
                  <span class="pr-3"> {{ element.name }} </span>
                  <span> {{ (element.duree / 3600).toFixed(2) }} h </span>
                </div>
              </div>
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
    </b-dropdown>
  </div>
</template>
<script>
  import { mapState } from "vuex";
  export default {
    name: "TimerExecution",
    data() {
      return {
        total_time: 0
      };
    },
    mounted() {
      this.loadTimes();
    },
    computed: {
      ...mapState({
        userInfos: (state) => state.userInfos,
        userConfig: (state) => state.userConfig
      }),
      userInfosFormat() {
        var datas = {};
        this.initTime();
        if (
          this.userInfos &&
          this.userInfos.timers_work_day &&
          this.userInfos.timers_work_day.length
        ) {
          this.userInfos.timers_work_day.forEach((userInfo) => {
            if (datas[userInfo.type]) {
              datas[userInfo.type].duree += parseInt(userInfo.duree);
              datas[userInfo.type].elements.push(userInfo);
            } else {
              datas[userInfo.type] = {
                name_project: userInfo.name_project,
                duree: parseInt(userInfo.duree),
                elements: [userInfo],
                type: userInfo.type
              };
            }
            this.addTime(userInfo.duree);
          });
        }
        return datas;
      }
    },
    methods: {
      loadTimes() {
        this.$store.dispatch("userInfos");
      },
      initTime() {
        this.total_time = 0;
      },
      addTime(minutes) {
        console.log("addTime : ", minutes);
        this.total_time += parseInt(minutes);
      },
      render() {
        console.log("userConfig : ", this.userConfig);
        var time = "0";
        if (this.total_time > 0) time = (this.total_time / 3600).toFixed(2);
        return time + "/" + this.userConfig.duration_work_day + " h";
      }
    }
  };
</script>
