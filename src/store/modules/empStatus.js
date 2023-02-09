import axios from "axios";

const instance = axios.create({
  baseURL: "../func/p_data.php",
});

// initial state
const empStatus = {
  namespaced: true,
  state: {
    empsData: [],
    empDetailData: {},
    timeCalc: {},
    empAuthData: {},
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
    setEmpAuthData(state, empAuthData) {
      state.empAuthData = empAuthData;
    },
  },
  actions: {
    // 전체 사원 출퇴근 정보
    fetchEmpsData({ commit }, date) {
      return new Promise((resolve, reject) => {
        instance
          .get(`?mode=current3&date=${date}`)
          .then((res) => {
            commit("setEmpsData", res.data);
            resolve();
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },

    // 로그인 정보 확인
    fetchLoginEmpAuth({ commit }) {
      return new Promise((resolve, reject) => {
        let form = new FormData();
        form.append("mode", "userdata");
        instance
          .post("", form)
          .then((res) => {
            commit("setEmpAuthData", res.data);
            resolve();
          })
          .catch((err) => {
            console.log(err);
            reject();
          });
      });
    },

    // 사원 상세정보
    fetchEmpDetailData({ commit }, { empn, date }) {
      return new Promise((resolve, reject) => {
        let form = new FormData();
        form.append("mode", "daily_hour");
        form.append("empn", empn);
        form.append("date", date);
        instance
          .post("", form)
          .then((res) => {
            commit("setEmpDetailData", res.data);
            resolve(res.data);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    // 사원 상세정보 시간 변경 계산
    fetchTimeCalc({ commit }, { empn, date, timein, timeout, outing }) {
      return new Promise((resolve, reject) => {
        let form = new FormData();
        form.append("mode", "calc_only");
        form.append("empn", empn);
        form.append("date", date);
        form.append("timein", timein);
        form.append("timeout", timeout);
        form.append("outing", outing);
        instance
          .post("", form)
          .then((res) => {
            commit("setTimeCalc", res.data);
            resolve(res.data);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },

    fetchEmpFormData(
      // eslint-disable-next-line no-unused-vars
      { commit },
      {
        empn,
        date,
        incomming,
        outgoing,
        total,
        schedule,
        break_time,
        outing,
        over_accept,
        overtime,
        night,
        deduct,
        work,
        comment,
        err,
      }
    ) {
      return new Promise((resolve, reject) => {
        let form = new FormData();
        form.append("mode", "obj_update");
        form.append("empn", empn);
        form.append("date", date);
        form.append("incomming", incomming);
        form.append("outgoing", outgoing);
        form.append("total", total);
        form.append("schedule", schedule);
        form.append("break", break_time);
        form.append("outing", outing);
        form.append("over_accept", over_accept);
        form.append("overtime", overtime);
        form.append("night", night);
        form.append("deduct", deduct);
        form.append("work", work);
        form.append("comment", comment);
        form.append("err", err);
        instance
          .post("", form)
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
  },
};

export default empStatus;
