<template>
  <li>
    <div>
      <h3>{{ getFirstPlanet }}{{ summaryRoute }}</h3>
      <h3>
        {{ totalCost }}
      </h3>
    </div>
    <p>Total Distance: {{ totalDistance }}</p>
    <p>Total Travel Time: {{msToTime(totalTravelTime)}} </p>
    <p>Departs: {{ formatStartTimeString }}</p>
    <p>Arrives: {{ formatEndTimeString }}</p>
    <button type="button" @click="bookButtonClicked">Book</button>
    <div v-if="selected">
      <p>Flights:</p>
      <ul>
        <PlanetSingleFlightInstance
          v-for="(flight, index) in this.path.MultiRoute"
          :key="index"
          v-bind:flight="flight"
          v-bind:origin="getFromPlanet(index)"
        ></PlanetSingleFlightInstance>
      </ul>
    </div>
  </li>
</template>

<script lang="ts">
import { useStore } from "../store";
import PlanetSingleFlightInstance from "./PlanetSingleFlightInstance.vue";
import { PlanetRoute } from "../interfaces";
import { defineComponent } from "vue";
export default defineComponent({
  name: "PlanetRouteInstance",
  props: ["path", "selected"],
  components: {
    PlanetSingleFlightInstance
  },
  data() {
    return {
      summaryRoute: this.path.MultiRoute.reduce((a: string, b: PlanetRoute) => a + "→" + b.to,""),
      totalCost: Math.round(this.path.MultiRoute.reduce((a: number, b: PlanetRoute) => a + b.cost,0)) + " €",
      totalDistance: this.path.MultiRoute.reduce((a: number, b: PlanetRoute) => a + b.distance, 0) + " km",
      totalTravelTime: this.path.MultiRoute.reduce((a: number, b: PlanetRoute) => a + b.duration, 0),
      startDate: this.path.MultiRoute[0].flightStart,
      endDate: this.path.MultiRoute[this.path.MultiRoute.length - 1].flightEnd,
      showForm: false,
      store: useStore(),
    };
  },
  methods: {
    bookButtonClicked() {
      this.store.commit("setSelectedRoutes", this.path.MultiRoute)
      this.$emit("reservationButtonClicked");
    },
    msToTime(duration: number) {
      let hours: number | string = Math.floor(
        (duration / (1000 * 60 * 60))
      );
      let minutes: number | string = Math.floor((duration / (1000 * 60)) % 60);
      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;

      return hours + "h " + minutes + " min";
    },
    getFromPlanet(index: number): string { // Function to get starting planet
      if (index === 0) {
        return useStore().state.currentPlanet;
      } else {
        return this.path.MultiRoute[index - 1].to;
      }
    }
  },
  computed: {
    getFirstPlanet() {
      return useStore().state.currentPlanet;
    },
    formatStartTimeString() {
      let date: Date = new Date(this.startDate);
      let monthday: string = date.toString().substring(4, 10);
      let time: string = date.toString().substring(16, 21);
      return `${monthday} ${time}`;
    },
    formatEndTimeString() {
      let date: Date = new Date(this.endDate);
      let monthday: string = date.toString().substring(4, 10);
      let time: string = date.toString().substring(16, 21);
      return `${monthday} ${time}`;
    },
  },
});
</script>

<style scoped>
li {
  cursor: pointer;
  border-radius: 0.25rem;
  color: #2c3e50;
  margin-top: 1rem;
  box-shadow: 2px 2px 4px 0 #696969;
  border: 1px solid #eee;
  background-color: white;
  padding: 0.9rem;
}
div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}
h3 {
  margin-top: 0;
  font-weight: 700;
  user-select: none;
  pointer-events: none;
}
p {
  margin: 0;
  font-weight: 500;
  user-select: none;
  pointer-events: none;
}
ul {
  margin: 0 auto;
  padding: 2%;
  list-style-type: none;
  width: 90%;
  align-content: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
button {
  margin: 0.5rem 0.1rem;
  padding: 0.4rem;
  background-color: #71df5e;
  cursor: pointer;
}
button:hover {
  background-color: #6dd45b;
}
</style>