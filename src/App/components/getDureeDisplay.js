import manageTime from "../project/manage-time";
/**
 * Ce fichier permet principalement de temps de fin à afficher.
 */
export default {
  /**
   * # Example 1.
   * Logique de calcul pour l'affichage.
   * un taf de 2h30 , [8h00 -- 10h30]
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
    if (duree && duree.length) {
      const begin = duree[0].value;
      var end;
      if (duree.lenght > 1) {
        const last_duree = duree.slice(-1);
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
  }
};
