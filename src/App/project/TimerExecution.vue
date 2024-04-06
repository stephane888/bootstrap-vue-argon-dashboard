<template>
  <div class="m-0 p-0 custom-drop-taches">
    <b-dropdown :text="' 05/04'" block class="p-0 m-0" variant="transparent">
      <div class="p-0 m-0">...</div>
    </b-dropdown>
  </div>
</template>
<script>
  import { mapState } from "vuex";
  export default {
    name: "TimerExecution",
    mounted() {
      this.loadTimes();
    },
    computed: {
      ...mapState({
        userConfig: (state) => state.userConfig
      })
    },
    methods: {
      loadTimes() {}
    }
  };
</script>
