<template>
  <li>
    <h5>{{ origin }}→{{ flight.to }}</h5>
    <p>Provider: {{ flight.provider }}</p>
    <p>Departs: {{ formatStartTimeString }}</p>
    <p>Arrives: {{ formatEndTimeString }}</p>
    <p>Price: {{ flight.cost }} €</p>
    <p>Travel time: {{ msToTime(flight.duration) }}</p>
    <p>Distance: {{ flight.distance }} km</p>
  </li>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "PlanetSingleFlightInstance",
  props: ["flight", "origin"],
  methods: {
    msToTime(duration: number) {
      let hours: number | string = Math.floor(
        (duration / (1000 * 60 * 60))
      );
      let minutes: number | string = Math.floor((duration / (1000 * 60)) % 60);
      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;

      return hours + "h " + minutes + " min";
    },
  },
  computed: {
    formatStartTimeString() {
      let date: Date = new Date(this.flight.flightStart);
      let monthday: string = date.toString().substring(4, 10);
      let time: string = date.toString().substring(16, 21);
      return `${monthday} ${time}`;
    },
    formatEndTimeString() {
      let date: Date = new Date(this.flight.flightEnd);
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
h5 {
  font-size: 1.2rem;
  margin: 0;
}
p {
  font-size: 0.90rem;
  margin: 0.12rem;
}
</style>