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
    deccalage_pause: 0, // le temps restant de la pause encours.
  },
  /**
   * Permet d'avoir des programmes pouvant aller sur 2 ans.
   * - une année = 52 semaine, soit 260 jours ouvres (en retirant samedi et dimanche.)
   * - une année contient en moyenne 11 jours feriees, en moyenne 249 jours de travaille.
   */
  max_day_add: 498, // 249*2
  // Recupere la configuration de l'utilisateur.
  getUserConf() {
    return store.state.userConfig;
  },
  // Permet de convertir les minutes en une durée assez lisible par l'utilisateur.
  convertTimeMinuteToRead(minutes) {
    var string = "";
    const mn = parseInt(minutes);
    if (mn) {
      const h = mn / 60;
      if (h >= this.getUserConf().duration_work_day) {
        const workinkDay = Math.floor(h / this.getUserConf().duration_work_day);
        string += workinkDay + " jour";
        if (workinkDay > 1) string += "s";
      }
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
   * Permet d'effectuer les calculs de date, en tenant compte de la durée de travail definie, des pauses des journées.
   * @param {*} DateTimeStamp
   */
  getDateForDrupal(date = null, add_minutes = 0) {
    return new Promise((resolv) => {
      add_minutes = parseInt(add_minutes);

      if (!date) date = new Date();
      if (add_minutes) {
        this.addtime(date, add_minutes).then((date) => {
          const date_string = this.formatDate(date);
          console.log("getDateForDrupal : ", date_string);
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
    const time_toLeaveNextBreack = await this.timeToLeaveBeforeNextBreak(date);
    console.log("time_toLeaveNextBreack : ", time_toLeaveNextBreack);
    // si le temps definit est <= au prochain break.
    if (add_minutes <= time_toLeaveNextBreack) {
      date.setMinutes(date.getMinutes() + add_minutes);
      return date;
    }
    // Le nombre de jour à ajouter.
    const nbre_days = Math.floor(
      add_minutes / (this.getUserConf().duration_work_day * 60)
    );
    var time_ToLeave = add_minutes;
    console.log(" nbre_days : ", nbre_days, "\n time_ToLeave : ", time_ToLeave);
    if (nbre_days > 0) {
      // temps restant, par rapport au nombre de jour.
      time_ToLeave = add_minutes % this.getUserConf().duration_work_day;
      var index = 1;
      var day = 1;
      while (index <= this.max_day_add && day <= nbre_days) {
        ++index;
        date.setDate(date.getDate() + 1);
        if (this.getUserConf().work_days[date.getDay()]) {
          ++day;
        }
      }
    }
    //
    const loopTimeAdd = (ToLeave, date) => {
      return new Promise((resolv2, reject2) => {
        this.timeToLeaveBeforeNextBreak(date)
          .then((toLeaveNextBreack) => {
            console.log(
              "loopTimeAdd : ",
              toLeaveNextBreack,
              "\n ToLeave : ",
              ToLeave
            );

            if (toLeaveNextBreack > 0 && toLeaveNextBreack >= ToLeave) {
              date.setMinutes(date.getMinutes() + ToLeave);
              resolv2(date);
            }
            //
            else {
              /**
               * On distingue plusieurs cas :
               * 1 - toLeaveNextBreack =0 ( i.e on est en pause )
               */
              // le temps restant avant le prochain breack n'est pas suffisant.
              //  on ajoute cela au temps present.
              if (toLeaveNextBreack > 0) {
                date.setMinutes(date.getMinutes() + toLeaveNextBreack);
                ToLeave = ToLeave - toLeaveNextBreack;
              }
              // on ajoute s'il existe la prochaine pause.
              const duration_pause = this.getDurationTimeNextPause(date);
              if (duration_pause) {
                date.setMinutes(date.getMinutes() + duration_pause);
                console.log(
                  "date second phase ",
                  date,
                  "\n duration_pause : ",
                  duration_pause
                );
                // une foix la pause ajoutée, on reprend la processus.
                resolv2(loopTimeAdd(ToLeave, date));
              } else {
                console.log("ERROR de logique: calcul du temps");
                resolv2(date);
              }
            }
          })
          .catch((er) => {
            reject2(er);
          });
      });
    };
    return loopTimeAdd(time_ToLeave, date);
  },

  /**
   * Permet de determiner si l'heure donnée est valide ou pas.
   *  ( ne doit pas etre en pause, et ne doit pas etre inferieur ou superieur à plage d'heure valid ).
   * @param {Date} date
   */
  TimeIsValid(date) {
    // Pour le moment, on va ignorer cette logique. car compliqué à bien mettre cela en place et pas tres utile.
    return true;
    if (this.isValidDay(date) && this.isPause(date)) {
      return true;
    } else return false;
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
      const pauses = this.getUserConf().pauses;
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
        // pauses.every((pause, index) => {
        //   console.log("pause : ", pause);
        /**
         * on peut etre dans une pause, ou pas.
         * La prochaine pause doit etre > à l'heure actuelle.
         * si on n'est pas dans une pause, le calcul est simple.
         * si on est dans une pause, on retoune le temps avant la prochaine pause si elle est definit.
         */
        //   // cas pause
        //   if (h >= pause[0] && h < pause[1]) {
        //     const next_pause = pauses[index + 1];
        //     if (next_pause) {
        //       resolv(HourToMn(pause[1] - next_pause[0]));
        //       // break;
        //       return true;
        //     }
        //     // si c'est la derniere pause.
        //     else {
        //       resolv(0);
        //       // break;
        //       return true;
        //     }
        //   }
        //   // si c'est pas la pause.
        //   else if (pause[0] > h && h >= day_duration[0]) {
        //     resolv(HourToMn(pause[0] - h));
        //     // break;
        //     return true;
        //   }
        //   // dernier passage
        //   else if (index == pauses.length - 1) {
        //     if (day_duration[1] > h) {
        //       resolv(HourToMn(day_duration[1] - h));
        //       // break;
        //       return true;
        //     } else {
        //       resolv(0);
        //       // break;
        //       return true;
        //     }
        //   }
        //   // On retourne false, pour passer à l'etape suivante.
        //   else return false;
        // });
      }
      //
      else resolv(0);
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
    const pauses = this.getUserConf().pauses;
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
   * @param {Date} date
   */
  async timeToLeaveForday(date = null) {
    var timeDay = 0;
    if (!date) date = new Date();
    const day_duration = this.getUserConf().day_duration;
    // heure actuel.
    const h = date.getHours() + date.getMinutes() / 60;
    // si on est deja en dehors de la plage de jour.
    if (h >= day_duration[1]) return 0;
    // si la jounée de travail n'a pas encore commencé.
    if (h <= day_duration[0]) return this.getUserConf().duration_work_day;
    //
    const pauses = this.getUserConf().pauses;
    if (pauses)
      pauses.forEach((pause, index) => {
        // cas pause
        if (h >= pause[0] && h < pause[1]) {
          // rien
        } else if (pause[0] > h) {
          /**
           * Dans le but d'eviter d'ajouter trop de temps, on va verifier si une precedante pause existe.
           */
          const pre_pause = pauses[index - 1];
          if (pre_pause) {
            // si l'heure de debut de la precedante est > à l'heure actuel, on utilise les plages.
            if (pre_pause[0] > h) {
              timeDay += pause[0] - pre_pause[1];
            } else timeDay += pause[0] - h;
          } else timeDay += pause[0] - h;
        }
        if (index == pauses.length - 1) {
          timeDay += day_duration[1] - pause[1];
        }
      });
    else {
      if (day_duration[0] >= h) timeDay = day_duration[1] - h;
      else {
        timeDay = this.getUserConf().duration_work_day;
      }
    }
    return timeDay;
  },
  formatDate(date_ob, format = "drupal") {
    let month = parseInt(date_ob.getMonth()) + 1;
    const constDateObj = {
      year: date_ob.getFullYear(),
      month: ("0" + month).slice(-2),
      date: ("0" + date_ob.getDate()).slice(-2),
      hour: ("0" + date_ob.getHours()).slice(-2),
      minutes: ("0" + date_ob.getMinutes()).slice(-2),
      seconds: ("0" + date_ob.getSeconds()).slice(-2),
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
          constDateObj.seconds,
      };
    else return constDateObj;
  },
};
