import { createApp, markRaw } from "vue";
import App from './App.vue';
import router from './routes/routes.js';
import store from './stores';
import { FontAwesomeIcon } from './plugins/font-awesome';
import './styles/main.css';

const app = createApp(App)
  .use(router)
  .use(store)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");