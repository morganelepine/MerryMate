import axios from "axios";

// `axios` est déjà configuré une fois pour l'appli entière dans bootstrap.js (importé en tête de app.jsx avant tout le reste) :
// header X-Requested-With, et surtout gestion automatique du cookie XSRF-TOKEN posé par Laravel -> header X-XSRF-TOKEN attendu en retour.
// Comme ESM met en cache le module `axios`, cette même instance déjà configurée est celle qu'on récupère ici.
export default axios;
