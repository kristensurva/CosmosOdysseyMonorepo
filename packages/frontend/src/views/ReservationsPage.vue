<template>
  <ul>
    <DataPiece 
    v-for="(pricelist, index) in reservationsData" :key="pricelist.id"
    v-bind:pricelist="pricelist" v-bind:index="index"
    ></DataPiece>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DataPiece from "../components/DataPiece.vue";
import { PricelistWithReservations } from "../interfaces";
export default defineComponent({
  name: "ReservationsPage",
  data() {
    return {
      reservationsData: {} as PricelistWithReservations,
    };
  },
  components: {
    DataPiece,
  },
  methods: {
    async getData() {
        let data = await (await fetch("http://localhost:4040/reservations")).json() as PricelistWithReservations;
        this.reservationsData = data;
    },
  },
  mounted() {
      this.$nextTick(function () {
          this.getData()
  })
  }
});
</script>
