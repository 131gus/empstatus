<template>
  <v-container class="pt-0" style="max-width: 1000px">
    <emp-status />
  </v-container>
</template>

<script>
// @ is an alias to /src
import EmpStatus from "@/components/EmpStatus.vue";

export default {
  name: "HomeView",
  components: {
    EmpStatus,
  },
};
</script>
