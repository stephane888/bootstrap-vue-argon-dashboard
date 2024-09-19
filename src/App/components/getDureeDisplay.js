import manageTime from "../project/manage-time";
/**
 * Ce fichier permet principalement de temps de fin à afficher.
 */
export default {
  /**
   * Permet d'afficher l'heure de debut et l'heure de la fin sur une tache.
   *
   * # Example 1.
   * Logique de calcul pour l'affichage.
   * un taf de 2h30 , [8h00 -- 10h30]
   * BD : [08h00 , 10h30]
   * DS1 : 08h00 -- 10h30 //Display 1,
   * => il travaille de 08h00-09h00
   * BD : [08h00 , 09h00]
   *
   *
   *
   * Pause 1 : 1h00, donc il reprend à 10h00.
   * BD : [10h00 , 11h30] ==> { 11h30 = 09h00 + temps restant (Temps d'execution - temps consommé dans la plage de travail)  } NB: le temps doit etre > 0. ( si < 0 on ne peut plus mettre en pause)
   * DS2 : 08h00 -- 11h30 //Display 2, {heure de fin du precedent + pause} => [10h30 + 1h00]
   *
   *
   * Pause 2 : 30mn
   * DS3 : 08h00 -- 12h00 //Display 3, {heure de fin du precedent + pause} => [11h30 + 30mn]
   * 09h - 10h30
   * # Example 2.
   *
   * un taf de 2h30 , [7h30 -- 10h30]
   * BD : [08h00 , 10h30]
   * DS1 : 08h00 -- 10h30 //Display 1, il travaille de 08h00-09h00
   *
   *
   * Pause 1 : 1h00
   * DS2 : 08h00 -- 11h30 //Display 2, {heure de fin du precedent + pause} => [10h30 + 1h00]
   * BD : [09h00 , 11h30]
   *
   * Pause 2 : 30mn
   * DS3 : 08h00 -- 12h00 //Display 3, {heure de fin du precedent + pause} => [11h30 + 30mn]
   * 09h - 10h30
   * @
   * @param duree est un tableau qui contient les dates
   * [{ value:DateString, end_value:DateString }]
   * @return un object contenant la date de debut et de fin à afficher.
   */
  retrivePlageDuree(duree) {
    console.log("duree : ", duree);
    if (duree && duree.length) {
      const begin = duree[0].value;
      var end;
      if (duree.length > 1) {
        const last_duree = duree.slice(-1);
        end = last_duree[0].end_value;
      } else {
        end = duree[0].end_value;
      }
      return {
        begin: begin,
        end: end
      };
    } else {
      return {
        begin: null,
        end: null
      };
    }
  },

  /**
   * Permet de terminer le temps deja effectuer sur une tache.
   * @return le temps en minute
   */
  getTotalTimeOfProject(duree, status_execution) {
    var totaltime = 0;
    if (duree && duree.length) {
      if (duree.length > 1) {
        const length_duree = duree.length - 2;
        for (let index = 0; index <= length_duree; index++) {
          const dt_begin = new Date(duree[index].value);
          const dt_end = new Date(duree[index].end_value);
          totaltime += manageTime.diff_minutes(dt_end, dt_begin);
        }
      }
      const last_duree = duree.slice(-1);
      if (status_execution == "running") {
        const dt_begin = new Date(last_duree[0].value);
        totaltime += manageTime.diff_minutes(new Date(), dt_begin);
      } else if (status_execution != "new") {
        const dt_begin = new Date(last_duree[0].value);
        const dt_end = new Date(last_duree[0].end_value);
        totaltime += manageTime.diff_minutes(dt_end, dt_begin);
      }
    }
    return totaltime;
  }
};
