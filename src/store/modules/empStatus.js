import axios from "axios";

// initial state
const empStatus = {
  namespaced: true,
  state: {
    empsData: [],
    empDetailData: "",
  },
  getters: {},
  mutations: {
    setEmpsData(state, empsData) {
      state.empsData = empsData;
    },
    setEmpDetailData(state, empDetailData) {
      state.empDetailData = empDetailData;
    },
  },
  actions: {
    fetchEmpsData(context, date) {
      axios
        .get(
          `https://gw.valti.co.kr/comm_test/func/p_data.php?mode=current2&date=${date}`
        )
        .then((res) => {
          // emps : EmpStatus components에서 배열 데이터 변수
          context.commit("setEmpsData", res.data);
          return true;
        });
    },
    fetchEmpDetailData(context, { empNo, date }) {
      axios
        .post(
          `https://gw.valti.co.kr/comm_test/func/p_data.php?mode=daily_hour&empn=${empNo}&&date=${date}`
        )
        .then((res) => {
          // emps : EmpStatus components에서 배열 데이터 변수
          context.commit("setEmpDetailData", res.data);
          console.log(res.data);
          return true;
        });
    },
  },
};

export default empStatus;
