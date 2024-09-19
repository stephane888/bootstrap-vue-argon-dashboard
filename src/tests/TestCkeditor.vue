<template>
  <div>
    <h2>Ckeditor</h2>
    <textArea namespace-store="" :field="field" :model="model"></textArea>
  </div>
</template>

<script>
export default {
  name: "TestCkeditor",
  components: {
    textArea: () => {
      return import(
        "components_h_vuejs/src/components/fieldsDrupal/TextareaCkeditor.vue"
      );
    },
  },
  data() {
    return {
      field: {
        name: "description",
        label: " Description ",
        description: null,
        cardinality: 1,
        type: "text_textarea",
        weight: 1,
        region: "content",
        settings: {
          rows: 5,
          placeholder: "",
        },
        third_party_settings: [],
        definition_settings: [],
        constraints: [],
      },
      model: {
        id: [],
        uuid: [
          {
            value: "84c4e462-8ab0-4e9a-be9b-5bb56c11af22",
          },
        ],
        vid: [],
        langcode: [
          {
            value: "fr",
          },
        ],
        type: [
          {
            target_id: "creation_des_sites__2022_11_739",
          },
        ],
        revision_created: [
          {
            value: 1671939657,
          },
        ],
        revision_user: [],
        revision_log: [
          {
            value: "",
          },
        ],
        status: [
          {
            value: true,
          },
        ],
        user_id: [
          {
            target_id: "1",
          },
        ],
        name: [
          {
            value: "",
          },
        ],
        type_project: [],
        private: [
          {
            value: false,
          },
        ],
        status_execution: [],
        duree: [],
        executants: [],
        primes: [],
        client: [],
        project_manager: [],
        description: [],
        description_cancel: [],
        created: [
          {
            value: 1671939657,
          },
        ],
        changed: [
          {
            value: 1671939657,
          },
        ],
        revision_translation_affected: [],
        default_langcode: [
          {
            value: true,
          },
        ],
        revision_default: [],
      },
    };
  },
};
</script>
