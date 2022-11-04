<template>
  <v-container class="mt-10" style="max-width: 1000px">
    <v-layout justify-center>
      <v-card-actions>
        <v-btn class="mb-3" @click="prevDate">
          <v-icon>mdi-arrow-left-bold</v-icon>
          <span class="ml-2">{{ beforeDate }}</span>
        </v-btn>

        <v-btn class="mb-3" color="#4aadd6">
          <input type="date" v-model="inputDate" />
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

    <!-- 테이블 행 유저 상세 정보 -->
    <v-dialog v-model="dialogDetail" width="450">
      <v-card>
        <v-card-title>
          <span class="text-h5 ml-2">상세 정보</span>
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
                <v-card class="pl-2 pr-2" outlined>
                  <input
                    v-model="detailInCom"
                    type="datetime-local"
                    style="width: 100%; height: 40px; outline: none"
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
                <v-card class="pl-2 pr-2" outlined>
                  <input
                    v-model="detailOutGo"
                    type="datetime-local"
                    style="width: 100%; height: 40px; outline: none"
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
                    style="width: 100%; height: 40px; outline: none"
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
                    style="width: 100%; height: 40px; outline: none"
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
                    style="width: 100%; height: 40px; outline: none"
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
                <v-card class="pl-2 pr-2" outlined>
                  <input
                    v-model="detailNight"
                    type="number"
                    style="width: 100%; height: 40px; outline: none"
                  />
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
          </v-container>
          <v-card-actions>
            <v-row>
              <v-col cols="6">
                <v-btn
                  outlined
                  color="primary"
                  style="width: 100%"
                  @click="dialogDetail = false"
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

    <v-layout justify-center>
      <v-data-table
        dense
        :headers="headersEmp"
        :items="this.$store.state.empStatus.empsData"
        :options.sync="options"
        :server-items-length="totalEmps"
        :items-per-page="30"
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
  </v-container>
</template>

<script>
import moment from "moment";

export default {
  data() {
    return {
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

      dialogDetail: false,
      options: {},
      totalEmps: 0,
      emps: [],
      empDetail: [],
      empNo: "",
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
      inputDate: moment().format("YYYY-MM-DD"),
      todayDate: moment().format("YYYY-MM-DD"),
      afterDate: moment(this.inputDate).add(1, "day").format("YYYY-MM-DD"),
      beforeDate: moment(this.inputDate)
        .subtract(1, "day")
        .format("YYYY-MM-DD"),
    };
  },
  watch: {
    inputDate(newVal, oldVal) {
      if (oldVal != newVal) {
        this.inputDate = newVal;
        this.beforeDate = moment(this.inputDate)
          .subtract(1, "day")
          .format("YYYY-MM-DD");
        this.afterDate = moment(this.inputDate)
          .add(1, "day")
          .format("YYYY-MM-DD");
        this.getData(this.inputDate);
      }
    },
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    },
  },
  methods: {
    detailView(row) {
      this.empsDataAxios(row)
        .then(this.detailViewDataAxios())
        .then(this.detailViewDataInput())
        .then(this.dialogDetailOpen());
    },
    empsDataAxios(row) {
      return new Promise((resolve) => {
        // emps 데이터 받아옴
        this.$store.state.empStatus.empsData.map((item, index) => {
          item.selected = item === row;
          this.$set(this.$store.state.empStatus.empsData, index, item);
        });

        // 사원번호, 조직, 이름 입력
        this.empNo = row.empn;
        this.detailTeam = row.team;
        this.detailName = row.name;
        resolve();
      });
    },

    dialogDetailOpen() {
      return new Promise((resolve) => {
        this.dialogDetail = true;
        resolve();
      });
    },

    detailViewDataAxios() {
      return new Promise((resolve) => {
        this.$store.dispatch(`empStatus/fetchEmpDetailData`, {
          empNo: this.empNo,
          date: this.inputDate,
        });
        this.empDetail = this.$store.state.empStatus.empDetailData;
        resolve();
      });
    },

    detailViewDataInput() {
      return new Promise((resolve) => {
        // 출퇴근 시간 입력
        if (!this.empDetail.incomming) {
          this.detailInCom = "";
        } else {
          this.detailInCom = this.empDetail.incomming;
        }

        if (!this.empDetail.outgoing) {
          this.detailOutGo = "";
        } else {
          this.detailOutGo = this.empDetail.outgoing;
        }

        if (!this.empDetail.total) {
          this.detailTotal = "0";
        } else {
          this.detailTotal = this.empDetail.total;
        }

        if (!this.empDetail.schedule) {
          this.detailSchedule = "0";
        } else {
          this.detailSchedule = this.empDetail.schedule;
        }

        if (!this.empDetail.break) {
          this.detailBreak = "0";
        } else {
          this.detailBreak = this.empDetail.break;
        }

        if (!this.empDetail.outing) {
          this.detailOuting = "0";
        } else {
          this.detailOuting = this.empDetail.outing;
        }

        if (!this.empDetail.night) {
          this.detailNight = "0";
        } else {
          this.detailNight = this.empDetail.night;
        }

        if (!this.empDetail.deduct) {
          this.detailDeduct = "0";
        } else {
          this.detailDeduct = this.empDetail.deduct;
        }

        if (!this.empDetail.work) {
          this.detailWork = "0";
        } else {
          this.detailWork = this.empDetail.work;
        }

        if (!this.empDetail.over.accept) {
          this.detailOverAccept = "0";
        } else {
          this.detailOverAccept = this.empDetail.over.accept;
        }

        if (!this.empDetail.over.max) {
          this.detailOverMax = "0";
        } else {
          this.detailOverMax = this.empDetail.over.max;
        }

        if (!this.empDetail.over.deduct) {
          this.detailOverDeduct = "0";
        } else {
          this.detailOverDeduct = this.empDetail.over.deduct;
        }

        if (!this.empDetail.over.time) {
          this.detailOverTime = "0";
        } else {
          this.detailOverTime = this.empDetail.over.time;
        }
        resolve();
      });
    },

    getDataFromApi() {
      this.fakeApiCall().then((data) => {
        this.emps = data.items;
        this.totalEmps = data.total;

        this.getData(this.inputDate);
      });
    },
    /**
     * In a real application this would be a call to fetch() or axios.get()
     */
    fakeApiCall() {
      // eslint-disable-next-line no-unused-vars
      return new Promise((resolve, reject) => {
        const { sortBy, sortDesc, page, itemsPerPage } = this.options;

        let items = this.getEmps();
        const total = items.length;

        if (sortBy.length === 1 && sortDesc.length === 1) {
          items = items.sort((a, b) => {
            const sortA = a[sortBy[0]];
            const sortB = b[sortBy[0]];

            if (sortDesc[0]) {
              if (sortA < sortB) return 1;
              if (sortA > sortB) return -1;
              return 0;
            } else {
              if (sortA < sortB) return -1;
              if (sortA > sortB) return 1;
              return 0;
            }
          });
        }

        if (itemsPerPage > 0) {
          items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);
        }

        resolve({
          items,
          total,
        });
      });
    },
    getEmps() {
      return [
        {
          empn: null,
          name: null,
          team: null,
          outing_o: null,
          outing_i: null,
          in: null,
          out: null,
          in_c: null,
          out_c: null,
          outing: 0,
        },
      ];
    },
    prevDate() {
      this.inputDate = this.beforeDate;
    },
    nextDate() {
      this.inputDate = this.afterDate;
    },
    sumTotal() {
      return this.$store.state.empStatus.empsData.length;
    },
    sumIn() {
      var sum = 0;
      for (let i = 0; i < this.$store.state.empStatus.empsData.length; i++) {
        if (this.$store.state.empStatus.empsData[i].in) {
          sum = sum + 1;
        }
      }
      return sum;
    },
    sumOut() {
      var sum = 0;
      for (let i = 0; i < this.$store.state.empStatus.empsData.length; i++) {
        if (this.$store.state.empStatus.empsData[i].out) {
          sum = sum + 1;
        }
      }
      return sum;
    },
    getData(date) {
      this.$store.dispatch(`empStatus/fetchEmpsData`, date);
      this.emps = this.$store.state.empStatus.empsData;
    },
  },
};
</script>
<style lang="css" scoped>
.v-data-table-header th {
  font-size: 14px !important;
}
</style>
