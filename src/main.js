import Vue from "vue";
import App from "./App.vue";
import router from "./router";

window.contentful = require('contentful')

const SPACE_ID = "v1p4zot2kex4";
const ACCESS_TOKEN = "64b4844a61eb1451bfc760ba36c03356ba703cc3a69d892dd28862ea9bff8667";

window.client = window.contentful.createClient({
  space: SPACE_ID,
  accessToken: ACCESS_TOKEN
});

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
