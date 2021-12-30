<template>
  <div
    class="backdrop"
    @click.self="$emit('clickOutside')"
    v-on:click.self="confirmation = false"
  >
    <form class="window" id="modal" v-if="!confirmation">
      <h1>Reservation Form</h1>
      <label for="fname">First name:</label><br />
      <input type="text" id="fname" name="fname" /><br />
      <label for="lname">Last name:</label><br />
      <input type="text" id="lname" name="lname" /><br />
      Route(s): {{ firstPlanet }}{{ summaryRoute }},<br />
      Total Quoted Price: {{ totalCost }} €,<br />
      Total Quoted Travel Time: {{ msToTime(totalTravelTime) }},<br />
      Transportation Company Name(s): {{ companyNames }}<br />
      <button type="button" @click="sendReservation">Finalize</button>
    </form>
    <form class="window" id="confirmationModal" v-if="confirmation">
      <h1>{{finalMessage}}</h1>
    </form>
  </div>
</template>

<script lang="ts">
import { useStore } from "../store";
import { PlanetRoute } from "../interfaces";
import { defineComponent } from "vue";
export default defineComponent({
  name: "ReservationForm",
  data() {
    return {
      firstPlanet: useStore().state.currentPlanet,
      summaryRoute: useStore().state.selectedRoutes.reduce((a: string, b: PlanetRoute) => a + "→" + b.to,""),
      totalCost: Math.round(useStore().state.selectedRoutes.reduce((a: number, b: PlanetRoute) => a + b.cost,0)),
      totalTravelTime: useStore().state.selectedRoutes.reduce((a: number, b: PlanetRoute) => a + b.duration,0) as number,
      companyNames: this.getCompanyNames() as string[],
      confirmation: false,
      finalMessage: "",
      store: useStore(),
    };
  },
  methods: {
    handleConfirmationModal() {
      this.confirmation=true;
      let confirmationModal = document.querySelector("#confirmationModal")
      if (confirmationModal?.getAttribute("disabled")) {
        confirmationModal.removeAttribute("disabled")
      }
      else if (confirmationModal!==null){
      confirmationModal.setAttribute("disabled", "disabled")
      }
    },
    getCompanyNames() {
      let names: string[] = [];
      useStore().state.selectedRoutes.forEach((route) => {
        if (!names.includes(route.provider)) {
          names.push(route.provider);
        }
      });
      return names;
    },
    msToTime(duration: number) {
      let hours: number | string = Math.floor(duration / (1000 * 60 * 60));
      let minutes: number | string = Math.floor((duration / (1000 * 60)) % 60);
      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;

      return hours + "h " + minutes + " min";
    },
    async sendReservation() {
        const url = "http://localhost:4040/reservationpost";
        let x = "";
        const options = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify({
            first: (document.querySelector("#fname") as HTMLInputElement).value,
            last: (document.querySelector("#lname") as HTMLInputElement).value,
            routes: this.store.state.selectedRoutes,
            totalPrice: this.totalCost,
            totalTravelTime: this.totalTravelTime,
            companyNames: this.companyNames,
            priceListID: this.store.state.priceListID
          }),
        };
        let res = await (await fetch(url, options)).text();
        if (res==="200") {
          this.finalMessage = "Flight booked successfully!"
        }
        else {
          this.finalMessage = "Outdated pricelist, please refresh!"
        }
        this.handleConfirmationModal()
    },
  },
});
</script>

<style scoped>
.backdrop {
  top: 0;
  position: fixed;
  background: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
}
.window {
  width: 30rem;
  padding: 1.5rem;
  margin: 7rem auto;
  background: white;
  border-radius: 0.6rem;
}
h1 {
  margin: 0;
  margin-bottom: 1rem;
}
button {
  padding: 0.3rem;
}
</style>