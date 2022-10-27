import { users } from "drupal-vuejs";
var formatBasicAuth = function (userName, password) {
  var basicAuthCredential = userName + ":" + password;
  var bace64 = btoa(basicAuthCredential);
  return "Basic " + bace64;
};
export default {
  ...users,
  TestDomain: "http://gestiontaches.kksa",
  baseUrl: "https://gestion-taches-vps.habeuk.com",
  basicAuth: formatBasicAuth("stane", "azabzistany@gmail.com"),
};
