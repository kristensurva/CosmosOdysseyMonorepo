<template>
  <ul v-if="!showList">
    <PlanetRouteInstance
      v-for="(path, index) in getCurrentList" :key="path.ID"
      v-bind:path="path"
      v-on:click="handleClick(index)"
      @reservationButtonClicked="reservationButtonClicked()"
      v-bind:selected="index == selected"
    ></PlanetRouteInstance>
  </ul>
</template>


<script lang="ts">
import PlanetRouteInstance from "./PlanetRouteInstance.vue";
import { defineComponent } from "vue";
import { useStore } from "../store";

export default defineComponent({
  name: "PlanetRouteList",
  components: {
    PlanetRouteInstance,
  },
  data() {
    return {
      selected: -1
    };
  },
  methods: {
    handleClick(index: number) {
      if (this.selected === -1 || this.selected !== index) {
        this.selected = index;
      }
    },
    reservationButtonClicked() {
      this.$emit("reservationButtonClicked");
    }
  },
  computed: {
    getCurrentList() {
      return useStore().state.currentList;
    },
    showList() {
      return useStore().state.reservationsVisited
    }
  },
});
</script>

<style scoped>
ul {
  margin: 0 auto;
  padding: 2%;
  list-style-type: none;
  background: #8a98a7;
  width: 60%;
  align-content: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
</style>