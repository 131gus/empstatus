import Vue from "vue";
import VueRouter from "vue-router";
import EmpStatus from "../views/EmpStatusView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "empstatus",
    component: EmpStatus,
  },
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes,
});

export default router;
