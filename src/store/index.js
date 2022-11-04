import Vue from "vue";
import Vuex from "vuex";
import empStatus from "./modules/empStatus";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    empStatus: empStatus,
  },
});
