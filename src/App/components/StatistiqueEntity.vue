<template>
  <div class="d-flex font-weight-600">
    <span
      v-b-tooltip.hover.bottom="' Total des taches '"
      class="text-vert-sombre"
    >
      {{ statistiques.total }}
    </span>
    <span v-b-tooltip.hover.bottom="' Taches validées '" class="px-3 text-teal">
      {{ statistiques.validate }}
    </span>
    <span v-b-tooltip.hover.bottom="' Taches terminées '" class="text-green">
      {{ statistiques.end }}
    </span>
    <span v-b-tooltip.hover.bottom="' Taches terminées '" class="text-green">
      <i class="far fa-user"></i>
      {{ getMontant(entity.statistiques.montant) }}
    </span>
  </div>
</template>
<script>
  export default {
    name: "StatistiqueEntity",
    props: {
      statistiques: { type: Object, required: true }
    }
  };
</script>
