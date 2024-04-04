import store from "../../store";
// permet de gerer les fonction en relation avec le temps.
export default {
  /**
   * - text :
   * permet principalement d'accelerer la determination des actions.
   * valeurs possible :
   * null => non definie
   * valid => l'heure est valid
   * after => l'heure definie est au dessus de plage de travail.
   * before => l'heure definie est au dessous de la plage de travail.
   * pause => l'heure definie est dans une pause.
   * cancel => Journée desactivée.
   *
   */
  explication_time: {
    text: null,
    max_time: 0, // le temps max en minute avant la prochaine pause ou la fin du journée.
    deccalage_pause: 0 // le temps restant de la pause encours.
  },
  /**
   * Permet d'avoir des programmes pouvant aller sur 2 ans.
   * - une année = 52 semaine, soit 260 jours ouvres (en retirant samedi et dimanche.)
   * - une année contient en moyenne 11 jours feriees, en moyenne 249 jours de travaille.
   */
  max_day_add: 498, // 249*2
  // Recupere la configuration de l'utilisateur.
  getUserConf() {
    const userConfig = store.state.userConfig;
    if (!userConfig || !userConfig.work_days || !userConfig.duration_work_day) {
      throw new Error("Configuration n'ont definit ou paramettre manquant");
    }
    return userConfig;
  },
  /**
   * Permet de convertir les minutes en une durée assez lisible par l'utilisateur.
   * On effectue le cacul en tenant compte de la durée d'une journée de travail.
   * Mais on n'inclut pas la pause.
   * @param {*} minutes
   * @returns
   */
  convertTimeMinuteToRead(minutes) {
    var string = "";
    const mn = parseInt(minutes);
    if (mn) {
      const h = mn / 60;
      // si le temps donnée est superieur à une WD.
      if (h >= this.getUserConf().duration_work_day) {
        const workinkDay = Math.floor(h / this.getUserConf().duration_work_day);
        string += workinkDay + " jr";
        if (workinkDay > 1) string += "s";
      }
      string += " ";
      const mn_restant = h % this.getUserConf().duration_work_day;
      if (mn_restant) {
        string += mn_restant.toFixed(2) + " h";
      } else {
        string += "00 h";
      }
    }
    return string;
  },
  /**
   * --
   */
  getDateToFrench(date_string) {
    const date = new Date(date_string);
    const datObj = this.formatDate(date, "");
    return (
      datObj.hour +
      "h" +
      datObj.minutes +
      " " +
      datObj.date +
      "/" +
      datObj.month
    );
  },

  /**
   * Permet d'effectuer les calculs de date, en tenant compte de la durée de travail definie.
   * @param {*} DateTimeStamp
   */
  getDateForDrupal(date = null, add_minutes = 0) {
    return new Promise((resolv) => {
      add_minutes = parseInt(add_minutes);

      if (!date) date = new Date();
      if (add_minutes) {
        this.addtime(date, add_minutes).then((date) => {
          const date_string = this.formatDate(date);
          resolv(date_string.date + "T" + date_string.hour);
        });
      } else {
        const date_string = this.formatDate(date);
        resolv(date_string.date + "T" + date_string.hour);
      }
    });
  },
  /**
   * Cette fonction ajoute du temps sur l'heure actuel.
   * @param {Date} date
   */
  async addtime(date, add_minutes) {
    // heure debut et de fin.
    const day_duration = this.getUserConf().day_duration;
    const time_ToLeaveDay = await this.timeToLeaveForday(date);
    console.log("time_ToLeaveDay : ", time_ToLeaveDay);
    /**
     * Cas 1 : Le temps definit est inferieur ou egal à la duree de la jounrée restante.
     */
    if (add_minutes <= time_ToLeaveDay) {
      // il faut egalement se rassurer que le calcul se fait dans la plage de temps valide.
      if (date.getHours() < day_duration[0]) {
        date.setHours(day_duration[0], 0, 0);
      }
      date.setMinutes(date.getMinutes() + add_minutes);
      return date;
    }
    /**
     * Cas 2 : Le temps definit est superieur au temps restant de la jounrée.
     * example 1:
     * il est 8h00. La tache fait 730minutes(1jr, 5h10)
     * La tache se termine à 13h10
     */
    if (add_minutes > time_ToLeaveDay) {
      // nombre de jour à ajouter (On retire time_ToLeaveDay pour compter en tenant compte du temps restant sur la journée encours.)
      const minutesOnDay = this.getUserConf().duration_work_day * 60;
      let nombreJours = Math.ceil(
        (add_minutes - time_ToLeaveDay) / minutesOnDay
      );
      let MinutesRestante = 0;
      //if (!nombreJours) nombreJours = 1;
      this.addDays(nombreJours, date);
      // Puisse qu'on passe forcement au jour suivant, on reset l'heure, mn,s.
      date.setHours(day_duration[0], 0, 0);
      // On ajoute les minutes restantes.
      if (add_minutes > minutesOnDay) {
        MinutesRestante = (add_minutes - time_ToLeaveDay) % minutesOnDay;
        // si MinutesRestante=0, alors le temps couvre toute la journée.
        if (MinutesRestante == 0) MinutesRestante = minutesOnDay;
      } else {
        MinutesRestante = add_minutes - time_ToLeaveDay;
      }
      // si MinutesRestante est > à une journée de travail
      console.log(
        "MinutesRestante : ",
        MinutesRestante,
        "\n",
        "nombreJours : ",
        nombreJours
      );
      date.setMinutes(MinutesRestante);
      return date;
    }
  },
  /**
   * Permet d'ajouter les jours tous en tenant compte des WK ( et plustard des jours feriers).
   * @param {*} nbreDays
   */
  addDays(nbreDays = 1, date = null) {
    if (!date) date = new Date();
    var index = 1;
    var day = 1;
    while (index <= this.max_day_add && day <= nbreDays) {
      ++index;
      date.setDate(date.getDate() + 1);
      if (this.getUserConf().work_days.includes(date.getDay())) {
        ++day;
      }
    }
    return date;
  },

  /**
   * Permet de determiner si le jour definie est un jour ouvrable et si nous sommes dans les plages.
   * @param {*} date
   * @returns
   */
  isValidDay(date) {
    const day_duration = this.getUserConf().day_duration;
    const h = date.getHours() + date.getMinutes() / 60;
    if (h >= day_duration[0] && h <= day_duration[1]) {
      return true;
    } else {
      this.explication_time.text = h > day_duration[1] ? "after" : "before";
      return false;
    }
  },
  /**
   *
   * @param Date date
   */
  isPause(date) {
    const pauses = this.getUserConf().pauses;
    const h = date.getHours() + date.getMinutes() / 60;
    pauses.forEach((pause, index) => {
      // cas pause
      if (h >= pause[0] && h < pause[1]) {
        this.explication_time.text = "pause";
        this.explication_time.deccalage_pause = pause[1] - h;
        return true;
      } else if (index == pauses.length - 1) return false;
    });
  },
  /**
   * Temps de travail restant, avant la prochaine pause ou la fin de jounée.
   * @param {Date} date
   */
  async timeToLeaveBeforeNextBreak(date = null) {
    return new Promise((resolv) => {
      if (!date) date = new Date();
      const day_duration = this.getUserConf().day_duration;
      // heure actuel.
      const h = date.getHours() + date.getMinutes() / 60;

      // si le temps n'est pas definit.
      // const pauses = this.getUserConf().pauses;
      // pour l'instant, on ignore les pauses.
      const pauses = [];
      if (pauses.length > 0) {
        //
        const HourToMn = (h) => {
          return Math.floor(h * 60);
        };
        for (const index in pauses) {
          const pause = pauses[index];
          /**
           * on peut etre dans une pause, ou pas.
           * La prochaine pause doit etre > à l'heure actuelle.
           * si on n'est pas dans une pause, le calcul est simple.
           * si on est dans une pause, on retoune le temps avant la prochaine pause si elle est definit.
           */
          // cas pause
          if (h >= pause[0] && h < pause[1]) {
            const next_pause = pauses[index + 1];
            if (next_pause) {
              resolv(HourToMn(pause[1] - next_pause[0]));
              break;
            }
            // si c'est la derniere pause.
            else {
              resolv(0);
              break;
            }
          }
          // si c'est pas la pause.
          else if (pause[0] > h && h >= day_duration[0]) {
            resolv(HourToMn(pause[0] - h));
            // break;
            return true;
          }
          // dernier passage
          else if (index == pauses.length - 1) {
            if (day_duration[1] > h) {
              resolv(HourToMn(day_duration[1] - h));
              break;
            } else {
              resolv(0);
              break;
            }
          }
        }
      } else resolv(0);
    });
  },
  /**
   * Permet de terminer la durée de la prochaine pause d'une journée ou le temps restant de la pause en cours.
   */
  getDurationTimeNextPause(date) {
    // heure actuel.
    const h = date.getHours() + date.getMinutes() / 60;
    const HourToMn = (h) => {
      return Math.floor(h * 60);
    };
    //const pauses = this.getUserConf().pauses;
    // pour l'instant, on ignore les pauses.
    const pauses = [];
    if (pauses) {
      for (const i in pauses) {
        const pause = pauses[i];
        console.log("getDurationTimeNextPause : ", pause);
        // cas pause
        if (h >= pause[0] && h < pause[1]) {
          // on ajoute + 1 car, dans le calcul on ne tient pas compte des secondes.
          return HourToMn(pause[1] - h) + 1;
        } else if (h < pause[0]) {
          return HourToMn(pause[1] - pause[0]);
          break;
        }
        if (i == pauses.length - 1) {
          return 0;
        }
      }
    } else return 0;
  },
  /**
   * Temps de travail restant de la jounée.
   * Retourne le temps de travail restant de la journée en minute.
   * @param {Date} date
   */
  async timeToLeaveForday(date = null) {
    var timeDay = 0;
    if (!date) date = new Date();
    //heure debut et de fin.
    const day_duration = this.getUserConf().day_duration;
    // heure actuel.
    const h = date.getHours() + date.getMinutes() / 60;
    // si on est deja en dehors de la plage de jour.
    if (h >= day_duration[1]) return 0;
    // si la jounée de travail n'a pas encore commencé.
    if (h <= day_duration[0]) return this.getUserConf().duration_work_day * 60;
    const FinJournee = new Date();
    FinJournee.setHours(day_duration[1]);
    FinJournee.setMinutes(0);

    const heureConsommer = date.getHours() - day_duration[0];
    const heureRestant = day_duration[1] - heureConsommer - day_duration[0];
    const minutesConsommer = date.getMinutes();
    console.log(
      "heureConsommer : ",
      heureConsommer,
      "\n",
      "heureRestant : ",
      heureRestant,
      "\n",
      "minutesConsommer : ",
      minutesConsommer
    );
    if (heureRestant > 0) {
      if (minutesConsommer > 0) {
        timeDay = (heureRestant - 1) * 60 + (60 - date.getMinutes());
      } else timeDay = heureRestant * 60 - date.getMinutes();
    } else timeDay = 60 - date.getMinutes();
    return timeDay;
  },
  /**
   * Format un object date en string valid
   * @param {*} date_ob
   * @param {*} format
   * @returns
   */
  formatDate(date_ob, format = "drupal") {
    let month = parseInt(date_ob.getMonth()) + 1;
    const constDateObj = {
      year: date_ob.getFullYear(),
      month: ("0" + month).slice(-2),
      date: ("0" + date_ob.getDate()).slice(-2),
      hour: ("0" + date_ob.getHours()).slice(-2),
      minutes: ("0" + date_ob.getMinutes()).slice(-2),
      seconds: ("0" + date_ob.getSeconds()).slice(-2)
    };
    if (format == "drupal")
      return {
        date:
          constDateObj.year +
          "-" +
          constDateObj.month +
          "-" +
          constDateObj.date,
        hour:
          constDateObj.hour +
          ":" +
          constDateObj.minutes +
          ":" +
          constDateObj.seconds
      };
    else return constDateObj;
  }
};
