<template>
  <v-container class="mt-10 pb-0" style="max-width: 1000px">
    <v-layout justify-center>
      <v-card-actions>
        <v-btn class="mb-3" @click="prevDate">
          <v-icon>mdi-arrow-left-bold</v-icon>
          <span class="ml-2">{{ beforeDate }}</span>
        </v-btn>

        <v-btn class="mb-3" color="#4aadd6">
          <input type="date" v-model="inputDate" />
          <span style="font-weight: bold; padding-bottom: 2px"
            >({{ dayOfWeek }})
          </span>
        </v-btn>

        <v-btn class="mb-3" @click="nextDate">
          <span class="mr-2">{{ afterDate }}</span>
          <v-icon>mdi-arrow-right-bold</v-icon>
        </v-btn>
      </v-card-actions>
    </v-layout>

    <v-layout justify-end>
      <v-chip class="ma-2" label
        >출근 : {{ sumIn() }} / {{ sumTotal() }} 명</v-chip
      >
      <v-chip class="ma-2" label
        ><span>퇴근 : {{ sumOut() }} 명</span
        ><span v-if="inputDate < todayDate" class="mr-2 ml-2">|</span
        ><span v-if="inputDate < todayDate"
          >미입력 : {{ sumIn() - sumOut() }} 명</span
        >
      </v-chip>
    </v-layout>

    <v-layout justify-center>
      <v-data-table
        dense
        :headers="headersEmp"
        :items="this.emps"
        :server-items-length="totalEmps"
        group-by="team"
        hide-default-footer
        class="elevation-1 mb-3"
        style="width: 1000px"
        @click:row="detailView"
      >
        <!-- 헤더 그룹화 -->
        <template v-slot:[`group.header`]="{ items, isOpen, toggle }">
          <th colspan="3">
            <v-icon @click="toggle"
              >{{ isOpen ? "mdi-minus" : "mdi-plus" }}
            </v-icon>
            <v-chip class="ma-2" small>{{ items[0].team }}</v-chip>
          </th>
        </template>

        <template v-slot:[`item.in`]="{ item }">
          <!-- 출근 표시 -->
          <div v-if="item.in">
            <v-icon class="mr-2" color="green"
              >mdi-flip-h mdi-account-plus
            </v-icon>
            <span>{{ item.in.substr(11) }}</span>
          </div>

          <!-- 당일 미출근 표시 -->
          <div v-else-if="!item.in && inputDate == todayDate">
            <v-icon class="mr-2" color="grey"
              >mdi-flip-h mdi-account-plus
            </v-icon>
          </div>

          <!-- 이전일 출근 미입력 표시 -->
          <div v-else-if="!item.in && inputDate < todayDate">
            <v-icon class="mr-2" color="grey"
              >mdi-flip-h mdi-account-remove
            </v-icon>
            <span style="color: grey">미입력</span>
          </div>
        </template>

        <template v-slot:[`item.out`]="{ item }">
          <!-- 퇴근 표시 -->
          <div v-if="afterDate > item.out">
            <v-icon class="mr-2" color="green"
              >mdi-flip-h mdi-account-minus
            </v-icon>
            <span>{{ item.out.substr(11) }}</span>
          </div>

          <!-- 퇴근(다음날) 표시(red) -->
          <div v-else-if="afterDate <= item.out">
            <v-icon class="mr-2" color="green"
              >mdi-flip-h mdi-account-minus
            </v-icon>
            <span style="color: red">{{ item.out.substr(11) }}</span>
          </div>

          <!-- 이전일 퇴근 미입력 표시 -->
          <div v-else-if="!item.out && inputDate < todayDate">
            <v-icon class="mr-2" color="grey"
              >mdi-flip-h mdi-account-remove
            </v-icon>
            <span style="color: grey">미입력</span>
          </div>
        </template>
      </v-data-table>
    </v-layout>
    <v-layout justify-center>
      <v-card-actions>
        <v-btn class="mt-2" width="150px" onClick="history.back();">
          Back
        </v-btn>
      </v-card-actions>
    </v-layout>

    <!-- 테이블 행 유저 상세 정보 모달(dialog)-->
    <v-dialog v-model="dialogDetail" width="450">
      <v-card>
        <v-card-title>
          <span
            v-if="detailErr == 1"
            class="text-h5 mt-2 ml-2"
            style="color: red"
            >상세 정보 (출퇴근 기록 없음)</span
          >
          <span
            v-else-if="detailErr == 2"
            class="text-h5 mt-2 ml-2"
            style="color: red"
            >상세 정보 (퇴근 기록 없음)</span
          >
          <span v-else class="text-h5 mt-2 ml-2">상세 정보</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row no-gutters>
              <v-col cols="4" class="mb-2">
                <v-card class="pa-2" color="grey lighten-3" outlined>
                  <span>소속</span>
                </v-card>
              </v-col>
              <v-col cols="8" class="mb-2">
                <v-card class="pa-2" color="grey lighten-4" outlined>
                  <span>{{ this.detailTeam }}</span>
                </v-card>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="4" class="mb-2">
                <v-card class="pa-2" color="grey lighten-3" outlined>
                  <span>이름</span>
                </v-card>
              </v-col>
              <v-col cols="8">
                <v-card class="pa-2" color="grey lighten-4" outlined>
                  <span>{{ this.detailName }}</span>
                </v-card>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="4" class="mb-2">
                <v-card class="pa-2" color="grey lighten-3" outlined>
                  <span>출근시간</span>
                </v-card>
              </v-col>
              <v-col cols="8" class="mb-2">
                <v-card
                  class="pl-2 pr-2"
                  :class="{ cardOutline: cssInCom }"
                  outlined
                >
                  <input
                    v-model="detailInCom"
                    type="datetime-local"
                    @change="changeInCom"
                    style="width: 100%; height: 39px; outline: none"
                  />
                </v-card>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="4" class="mb-2">
                <v-card class="pa-2" color="grey lighten-3" outlined>
                  <span>퇴근시간</span>
                </v-card>
              </v-col>
              <v-col cols="89" class="mb-2">
                <v-card
                  class="pl-2 pr-2"
                  :class="{ cardOutline: cssOutGo }"
                  outlined
                >
                  <input
                    v-model="detailOutGo"
                    type="datetime-local"
                    @change="changeOutGo"
                    style="width: 100%; height: 39px; outline: none"
                  />
                </v-card>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="4" class="mb-2">
                <v-card class="pa-2" color="grey lighten-3" outlined>
                  <span>총시간</span>
                </v-card>
              </v-col>
              <v-col cols="8">
                <v-card class="pa-2" color="grey lighten-4" outlined>
                  <input v-model="detailTotal" type="number" disabled />
                </v-card>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="4" class="mb-2">
                <v-card class="pa-2" color="grey lighten-3" outlined>
                  <span>소정근로시간</span>
                </v-card>
              </v-col>
              <v-col cols="8">
                <v-card class="pa-2" color="grey lighten-4" outlined>
                  <input v-model="detailSchedule" type="number" disabled />
                </v-card>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="4" class="mb-2">
                <v-card class="pa-2" color="grey lighten-3" outlined>
                  <span>휴게시간</span>
                </v-card>
              </v-col>
              <v-col cols="8">
                <v-card class="pl-2 pr-2" outlined>
                  <input
                    v-model="detailBreak"
                    type="number"
                    step="0.1"
                    min="0"
                    :max="detailMaxBreak"
                    style="width: 100%; height: 39px; outline: none"
                  />
                </v-card>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="4" class="mb-2">
                <v-card class="pa-2" color="grey lighten-3" outlined>
                  <span>외출시간</span>
                </v-card>
              </v-col>
              <v-col cols="8">
                <v-card class="pl-2 pr-2" outlined>
                  <input
                    v-model="detailOuting"
                    type="number"
                    step="0.1"
                    min="0"
                    :max="detailMaxOuting"
                    style="width: 100%; height: 39px; outline: none"
                  />
                </v-card>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="4" class="mb-2">
                <v-card class="pa-2" color="grey lighten-3" outlined>
                  <span>특근승인시간</span>
                </v-card>
              </v-col>
              <v-col cols="8">
                <v-card class="pa-2" color="grey lighten-4" outlined>
                  <input v-model="detailOverAccept" type="number" disabled />
                </v-card>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="4" class="mb-2">
                <v-card class="pa-2" color="grey lighten-3" outlined>
                  <span>특근인정시간</span>
                </v-card>
              </v-col>
              <v-col cols="8">
                <v-card class="pl-2 pr-2" outlined>
                  <input
                    v-model="detailOverTime"
                    type="number"
                    step="0.1"
                    min="0"
                    :max="detailTmp"
                    style="width: 100%; height: 39px; outline: none"
                  />
                </v-card>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="4" class="mb-2">
                <v-card class="pa-2" color="grey lighten-3" outlined>
                  <span>야간근로</span>
                </v-card>
              </v-col>
              <v-col cols="8">
                <v-card class="pa-2" color="grey lighten-4" outlined>
                  <input v-model="detailNight" type="number" disabled />
                </v-card>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="4" class="mb-2">
                <v-card class="pa-2" color="grey lighten-3" outlined>
                  <span>차감시간</span>
                </v-card>
              </v-col>
              <v-col cols="8">
                <v-card class="pa-2" color="grey lighten-4" outlined>
                  <input v-model="detailDeduct" type="number" disabled />
                </v-card>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="4" class="mb-2">
                <v-card class="pa-2" color="grey lighten-3" outlined>
                  <span>근로시간</span>
                </v-card>
              </v-col>
              <v-col cols="8">
                <v-card class="pa-2" color="grey lighten-4" outlined>
                  <input v-model="detailWork" type="number" disabled />
                </v-card>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="12" class="mb-0">
                <v-textarea
                  v-model="detailComment"
                  outlined
                  auto-grow
                  hide-details
                  rows="2"
                  row-height="35"
                  placeholder="의견 작성"
                ></v-textarea>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="12" class="mt-2 mb-0">
                <span v-if="detailModTime"
                  >수정시간 : {{ detailModTime }}
                </span>
                <span v-if="detailModer"> / 관리자 : {{ detailModer }}</span>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <v-row>
              <v-col cols="6">
                <v-btn
                  outlined
                  color="primary"
                  style="width: 100%"
                  @click="empDetailForm"
                >
                  수정
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  outlined
                  style="width: 100%"
                  @click="dialogDetail = false"
                >
                  닫기
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import moment from "moment";

export default {
  data() {
    return {
      cssInCom: false,
      cssOutGo: false,
      week: ["일", "월", "화", "수", "목", "금", "토"],
      dayOfWeek: "",
      empRank: "", // 관리자 등급
      detailName: "", //이름
      detailTeam: "", //소속
      detailInCom: "", //출근시간
      detailOutGo: "", //퇴근시간

      detailTotal: "", //총시간
      detailSchedule: "", //소정근로시간
      detailBreak: "", //휴게시간
      detailOuting: "", //외출시간
      detailNight: "", //야근근로
      detailDeduct: "", //차감시간
      detailWork: "", //근로시간

      detailOverAccept: "", //특근 승인시간
      detailOverMax: "", //특근 초과시간
      detailOverDeduct: "", //특근 차감시간
      detailOverTime: "", //특근 인정시간
      detailComment: "", // 의견
      detailErr: "", // 에러코드
      detailTmp: "", // 특근 최대시간
      detailMaxBreak: "", // 휴게시간 max
      detailMaxOuting: "", // 외출시간 max
      detailModTime: "",
      detailModer: "",

      dialogDetail: false, // 모달 오픈 여부
      empNo: "", // 사원번호
      totalEmps: 0, // 사원데이터 total
      emps: [], // 테이블 행 데이터
      empDetail: [], // 모달 오픈 상세정보 데이터
      timeDataCalc: {}, // 출퇴근 시간으로 계산 데이터

      // 테이블 헤더
      headersEmp: [
        {
          text: "소속",
          align: "start",
          value: "team",
          sortable: false,
        },
        { text: "이름", value: "name", sortable: false, width: "30%" },
        { text: "출근시각", value: "in", sortable: false, width: "35%" },
        { text: "퇴근시각", value: "out", sortable: false, width: "35%" },
      ],

      // 입력, 현재, 다음 이전 날짜
      inputDate: moment().format("YYYY-MM-DD"),
      todayDate: moment().format("YYYY-MM-DD"),
      afterDate: moment(this.inputDate).add(1, "day").format("YYYY-MM-DD"),
      beforeDate: moment(this.inputDate)
        .subtract(1, "day")
        .format("YYYY-MM-DD"),
    };
  },
  watch: {
    // 입력날짜 변경시 이전 다음 날짜 변경 후 emps 데이터 통신
    inputDate(newVal, oldVal) {
      if (oldVal != newVal) {
        this.inputDate = newVal;
        this.beforeDate = moment(this.inputDate)
          .subtract(1, "day")
          .format("YYYY-MM-DD");
        this.afterDate = moment(this.inputDate)
          .add(1, "day")
          .format("YYYY-MM-DD");
        this.getDataFromApi(this.inputDate);

        this.dayOfWeek = this.week[new Date(this.inputDate).getDay()];
      }
    },
    // 휴게, 외출, 야간, 특근인정 변경
    detailBreak() {
      this.changeTimeData();
    },
    detailOuting() {
      this.changeTimeData();
    },
    detailNight() {
      this.changeTimeData();
    },
    detailOverTime() {
      this.changeTimeData();
    },
  },
  // 페이시 시작시 테이블 데이터 통신
  mounted() {
    this.getDataFromApi(this.inputDate);
    this.dayOfWeek = this.week[new Date(this.inputDate).getDay()];
  },
  methods: {
    empDetailForm() {
      this.$store
        .dispatch(`empStatus/fetchEmpFormData`, {
          empn: this.empNo,
          date: this.inputDate,
          incomming: this.detailInCom,
          outgoing: this.detailOutGo,
          total: this.detailTotal,
          schedule: this.detailSchedule,
          break_time: this.detailBreak,
          outing: this.detailOuting,
          over_accept: this.detailOverAccept,
          overtime: this.detailOverTime,
          night: this.detailNight,
          deduct: this.detailDeduct,
          work: this.detailWork,
          comment: this.detailComment,
          err: this.detailErr,
        })
        .then((res) => {
          if (res.err == 0) {
            alert("수정 완료되었습니다.");
            this.getDataFromApi(this.inputDate);
          } else if (res.err > 0) {
            alert("수정 실패하였습니다.");
          }
          this.dialogDetail = false;
        });
    },
    // 출퇴근 시간 변경하면 데이터 통신
    changeInCom() {
      this.newTimeCalc();
    },
    changeOutGo() {
      this.newTimeCalc();
    },

    // 출퇴근 시간 변경 시 통신 후 데이터 입력
    newTimeCalc() {
      this.$store
        .dispatch(`empStatus/fetchTimeCalc`, {
          empn: this.empNo,
          date: this.inputDate,
          timein: this.detailInCom,
          timeout: this.detailOutGo,
          outing: this.detailOuting,
        })
        .then(() => {
          this.timeDataCalc = this.$store.state.empStatus.timeCalc;
        })
        .then(() => {
          this.detailTotal = this.timeDataCalc.total;
          this.detailSchedule = this.timeDataCalc.schedule;
          this.detailBreak = this.timeDataCalc.break;
          this.detailNight = this.timeDataCalc.night;

          this.deductWorkTimeCalc();
        });
    },

    // 초과 근무 시간에 따른 휴게 외출 시간 맥스 값 설정
    changeTimeData() {
      this.detailMaxBreak =
        Number(this.detailTotal) -
        (Number(this.detailOuting) + Number(this.detailOverTime));
      this.detailMaxOuting =
        Number(this.detailTotal) -
        (Number(this.detailBreak) + Number(this.detailOverTime));

      this.detailTmp =
        Math.round(
          (Number(this.detailTotal) -
            (Number(this.detailBreak) +
              Number(this.detailSchedule) +
              Number(this.detailOuting))) *
            100
        ) / 100;

      // 휴게 외출 시간에 따라 특근인정 시간 변동
      if (this.detailTmp >= 0 && this.detailTmp <= this.detailOverTime) {
        this.detailOverTime = this.detailTmp;
      }

      // 차감 시간 계산
      if (this.detailTmp >= this.detailOverTime) {
        this.detailDeduct =
          Math.round(
            (Number(this.detailBreak) +
              Number(this.detailOuting) +
              (Number(this.detailTmp) - Number(this.detailOverTime))) *
              100
          ) / 100;
      } else {
        this.detailDeduct =
          Math.round(
            (Number(this.detailBreak) + Number(this.detailOuting)) * 100
          ) / 100;
      }
      this.detailWork =
        Math.round(
          (Number(this.detailTotal) - Number(this.detailDeduct)) * 100
        ) / 100;
    },

    // 차감, 근로 시간 계산식
    deductWorkTimeCalc() {
      this.detailDeduct =
        Math.round(
          (Number(this.detailBreak) + Number(this.detailOuting)) * 100
        ) / 100;
      this.detailWork =
        Math.round(
          (Number(this.detailTotal) - Number(this.detailDeduct)) * 100
        ) / 100;
    },

    // 사원 상세 정보 받아오고 입력 후 모달 오픈
    detailView(event, { item }) {
      if (this.empRank === 1) {
        console.log("관리자등급만 모달 오픈 가능");
      }
      // row 사원 정보 받아오기
      this.empInfo = Object.assign({}, item);

      this.detailViewDataAxios();
      this.detailComment = "";
    },

    // 사원 상세정보 통신 후 데이터 입력
    detailViewDataInput() {
      this.detailTotal = this.timeDataCalc.total;
      this.detailSchedule = this.timeDataCalc.schedule;
      this.detailBreak = this.timeDataCalc.break;
      this.detailOuting = this.timeDataCalc.outing;
      this.detailOverAccept = this.timeDataCalc.over.accept;
      this.detailOverTime = this.timeDataCalc.over.time;
      this.detailNight = this.timeDataCalc.night;
    },

    // 사원 상세정보 통신
    detailViewDataAxios() {
      this.$store
        .dispatch(`empStatus/fetchEmpDetailData`, {
          empn: this.empInfo.empn,
          date: this.inputDate,
        })
        .then(() => {
          this.empDetail = this.$store.state.empStatus.empDetailData;
          // 사원번호, 조직, 이름 입력
          this.empNo = this.empInfo.empn;
          this.detailTeam = this.empInfo.team;
          this.detailName = this.empInfo.name;
          this.detailErr = this.empDetail.err;
          this.detailInCom = this.empDetail.incomming;
          this.detailOutGo = this.empDetail.outgoing;
          this.detailComment = this.empDetail.comment;
          this.detailModTime = this.empDetail.mod_time;
          this.detailModer = this.empDetail.moder;
        })
        .then(() => {
          // 출퇴근 정보 없음
          if (this.detailErr == 1) {
            this.cssInCom = true;
            this.cssOutGo = true;
            this.detailInCom = this.inputDate + " 09:00:00";
            this.detailOutGo = this.inputDate + " 18:00:00";
            this.$store
              .dispatch(`empStatus/fetchTimeCalc`, {
                empn: this.empNo,
                date: this.inputDate,
                timein: this.detailInCom,
                timeout: this.detailOutGo,
                outing: 0,
              })
              .then(() => {
                this.timeDataCalc = this.$store.state.empStatus.timeCalc;
              })
              .then(() => {
                this.detailViewDataInput();
                this.deductWorkTimeCalc();
              });
          } else if (this.detailErr == 2) {
            // 퇴근 정보 없음
            this.cssInCom = false;
            this.cssOutGo = true;
            this.detailOutGo = this.inputDate + " 18:00:00";
            this.$store
              .dispatch(`empStatus/fetchTimeCalc`, {
                empn: this.empNo,
                date: this.inputDate,
                timein: this.detailInCom,
                timeout: this.detailOutGo,
                outing: 0,
              })
              .then(() => {
                this.timeDataCalc = this.$store.state.empStatus.timeCalc;
              })
              .then(() => {
                this.detailViewDataInput();
                this.deductWorkTimeCalc();
              });
          } else {
            // 출퇴근 정보 있음
            this.cssInCom = false;
            this.cssOutGo = false;
            this.detailInCom = this.empDetail.incomming;
            this.detailOutGo = this.empDetail.outgoing;
            this.detailTotal = this.empDetail.total;
            this.detailSchedule = this.empDetail.schedule;
            this.detailBreak = this.empDetail.break;
            this.detailOuting = this.empDetail.outing;
            this.detailNight = this.empDetail.night;
            this.detailOverAccept = this.empDetail.over.accept;
            this.detailOverMax = this.empDetail.over.max;
            this.detailOverDeduct = this.empDetail.over.deduct;
            this.detailOverTime = this.empDetail.over.time;

            this.deductWorkTimeCalc();
          }
        })
        .then(() => {
          this.dialogDetail = true;
        });
    },

    // fakeApiCall 이후 데이터 emps에 넣음
    getDataFromApi(date) {
      this.fakeApiCall(date).then((data) => {
        this.emps = data.items;
        this.totalEmps = data.total;
      });
    },

    // emps 데이터 통신
    fakeApiCall(date) {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch(`empStatus/fetchEmpsData`, date)
          .then(() => {
            let items = this.$store.state.empStatus.empsData;
            const total = items.length;

            resolve({
              items,
              total,
            });
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    //이전 날짜
    prevDate() {
      this.inputDate = this.beforeDate;
    },
    //다음 날짜
    nextDate() {
      this.inputDate = this.afterDate;
    },
    // 인원 총합계
    sumTotal() {
      return this.emps.length;
    },
    // 출근 인원
    sumIn() {
      var sum = 0;
      for (let i = 0; i < this.emps.length; i++) {
        if (this.emps[i].in) {
          sum = sum + 1;
        }
      }
      return sum;
    },
    // 출근 인원 중 퇴근 인원
    sumOut() {
      var sum = 0;
      for (let i = 0; i < this.emps.length; i++) {
        if (this.emps[i].out) {
          sum = sum + 1;
        }
      }
      return sum;
    },
  },
};
</script>

<style lang="css" scoped>
/* 테이블 헤더 폰트크기 */
.v-data-table::v-deep th {
  font-size: 14px !important;
}

/* 출퇴근 border 색상 변경 */
.cardOutline {
  border: 1px solid red;
}

input[type="date"] {
  padding-left: 25px;
  width: 105px;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  left: 5px;
  position: absolute;
  cursor: pointer;
}
</style>
