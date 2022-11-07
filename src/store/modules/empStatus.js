import axios from "axios";

// initial state
const empStatus = {
  namespaced: true,
  state: {
    empsData: [],
    empDetailData: {},
    timeCalc: {},
  },
  getters: {},
  mutations: {
    setEmpsData(state, empsData) {
      state.empsData = empsData;
    },
    setEmpDetailData(state, empDetailData) {
      state.empDetailData = empDetailData;
    },
    setTimeCalc(state, timeCalc) {
      state.timeCalc = timeCalc;
    },
  },
  actions: {
    // 전체 사원 출퇴근 정보
    async fetchEmpsData(context, date) {
      await axios
        .get(
          `https://gw.valti.co.kr/comm_test/func/p_data.php?mode=current2&date=${date}`
        )
        .then((res) => {
          context.commit("setEmpsData", res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 사원 상세정보
    fetchEmpDetailData(context, { empn, date }) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          axios
            .post(
              `https://gw.valti.co.kr/comm_test/func/p_data.php?mode=daily_hour&empn=${empn}&&date=${date}`
            )
            .then((res) => {
              context.commit("setEmpDetailData", res.data);
              resolve();
            })
            .catch((err) => {
              console.log(err);
              reject();
            });
        }, 100);
      });
    },
    // 사원 상세정보 시간 변경 계산
    async fetchTimeCalc({ commit }, { empn, date, timein, timeout, outing }) {
      let form = new FormData();
      form.append("mode", "calc_only");
      form.append("date", date);
      form.append("timein", timein);
      form.append("timeout", timeout);
      form.append("outing", outing);
      let res = await axios.post(
        `https://gw.valti.co.kr/comm_test/func/p_data.php?mode=calc_only&empn=${empn}&date=${date}&timein=${timein}&timeout=${timeout}&outing=${outing}`,
        form
      );
      commit("setTimeCalc", res.data);
      console.log(res.data);
    },
  },
};

export default empStatus;
