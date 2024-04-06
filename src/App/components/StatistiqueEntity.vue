<template>
  <div class="d-flex font-weight-600 statistiques">
    <span
      v-b-tooltip.hover.bottom="' Total des taches '"
      class="item text-vert-sombre"
    >
      {{ statistiquesFormat.total }}
    </span>
    <span v-b-tooltip.hover.bottom="' Taches validées '" class="item text-teal">
      {{ statistiquesFormat.validate }}
    </span>
    <span
      v-b-tooltip.hover.bottom="' Taches terminées '"
      class="item text-green"
    >
      {{ statistiquesFormat.end }}
    </span>
    <span
      v-b-tooltip.hover.bottom="' Montant brute du projet '"
      class="item text-green"
    >
      {{ statistiquesFormat.montant_total }}
      <i class="fa-solid fa-euro-sign"></i>
    </span>
    <span
      v-if="statistiquesFormat.investissement_total > 0"
      v-b-tooltip.hover.bottom="' Investtissements '"
      class="item text-danger"
    >
      {{ statistiquesFormat.montant_total }}
      <i class="fa-solid fa-euro-sign"></i>
    </span>
    <span
      v-b-tooltip.hover.bottom="' Durée d\'execution prevu / Durée reelle'"
      class="item item-progress text-gray-dark"
      :data_duree_execution_total="statistiquesFormat.duree_execution_total"
      :duree_execution_reelle_total="
        statistiquesFormat.duree_execution_reelle_total
      "
    >
      <b-progress :max="statistiquesFormat.duree_execution_total">
        <b-progress-bar
          :value="statistiquesFormat.duree_execution_reelle_total"
          :variant="statistiquesFormat.progress_bar_variant"
        >
        </b-progress-bar>
        <div class="custom-label">
          {{ statistiquesFormat.duree_execution_string }}
        </div>
      </b-progress>
    </span>
  </div>
</template>
<script>
  import manageTime from "../project/manage-time";
  export default {
    name: "StatistiqueEntity",
    props: {
      statistiques: { type: Object, required: true }
    },
    computed: {
      statistiquesFormat() {
        const datas = this.statistiques;
        //format montant.
        if (datas.montant) {
          let montant_sum = 0;
          let investissement_sum = 0;
          datas.montant.forEach((Element) => {
            if (Element.montants) montant_sum += parseInt(Element.montants);
            if (Element.investissements)
              investissement_sum += parseInt(Element.investissements);
          });
          datas.montant_total = montant_sum;
          datas.investissement_total = investissement_sum;
        }
        // Format des heures.
        if (datas.duree_execution) {
          let duree_execution = 0;
          datas.duree_execution.forEach((Element) => {
            if (Element.duree_executions)
              duree_execution += parseInt(Element.duree_executions);
          });
          datas.duree_execution_total = duree_execution;
          datas.duree_execution_string =
            manageTime.convertTimeMinuteToRead(duree_execution);
          // On determine egalment la durée reelle.
          let duree_execution_reelle = 0;
          datas.duree_execution_reelle.forEach((Element) => {
            if (Element.duree)
              duree_execution_reelle += parseInt(Element.duree);
          });
          datas.duree_execution_reelle_total = duree_execution_reelle;
          datas.percent_progress =
            (duree_execution_reelle / duree_execution) * 100;
          datas.progress_bar_variant = this.progress_bar_variant(
            datas.percent_progress
          );
        }
        return datas;
      }
    },
    methods: {
      progress_bar_variant(percent_progress) {
        if (percent_progress > 100) return "danger";
        if (percent_progress > 85) return "warning";
        if (percent_progress > 70) return "info";
        else return "success";
      }
    }
  };
</script>
