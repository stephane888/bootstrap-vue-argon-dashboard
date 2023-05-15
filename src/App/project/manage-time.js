import store from "../../store";
// permet de gerer les fonction en relation avec le temps.
export default {
  // Recuperer le nombre d'heure de travail dans une journée
  getDureeJourTravail() {
    return store.state.userConfig.duree_jour;
  },
  // Permet de convertir les minutes en une durée assez lisible par l'utilisateur.
  convertTimeMinuteToRead(minutes) {
    var string = "";
    const mn = parseInt(minutes);
    if (mn) {
      const h = mn / 60;
      if (h >= this.getDureeJourTravail()) {
        const workinkDay = Math.floor(h / this.getDureeJourTravail());
        string += workinkDay + " jour";
        if (workinkDay > 1) string += "s";
      }
      const mn_restant = h % this.getDureeJourTravail();
      if (mn_restant) {
        string += mn_restant.toFixed(2) + " h";
      } else {
        string += "00 h";
      }
    }
    return string;
  },
};
