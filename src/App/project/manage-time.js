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

  /**
   * à mettre plustot dans le champs date.
   * @param {*} DateTimeStamp
   */
  getDateForDrupal(date = null, add_minutes = 0) {
    add_minutes = parseInt(add_minutes);
    if (!date) var date = new Date();
    if (add_minutes) {
      date.setMinutes(date.getMinutes() + add_minutes);
    }
    let month = parseInt(date.getMonth()) + 1;
    const date_string = {
      date:
        date.getFullYear() +
        "-" +
        ("0" + month).slice(-2) +
        "-" +
        date.getDate(),
      hour:
        ("0" + date.getHours()).slice(-2) +
        ":" +
        ("0" + date.getMinutes()).slice(-2) +
        ":" +
        ("0" + date.getSeconds()).slice(-2),
    };
    return date_string.date + "T" + date_string.hour;
  },
};
