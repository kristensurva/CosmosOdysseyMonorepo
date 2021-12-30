<template>
  <form>
    <select @change="toSelectChange($event)" id="planet1">
      <option disabled selected value="">-- Flying From --</option>
      <option value="Mercury">Mercury</option>
      <option value="Venus">Venus</option>
      <option value="Earth">Earth</option>
      <option value="Mars">Mars</option>
      <option value="Jupiter">Jupiter</option>
      <option value="Saturn">Saturn</option>
      <option value="Uranus">Uranus</option>
      <option value="Neptune">Neptune</option>
    </select>
    <select @change="toSelectChange($event)" id="planet2">
      <option disabled selected value="">-- Flying To --</option>
      <option value="Mercury">Mercury</option>
      <option value="Venus">Venus</option>
      <option value="Earth">Earth</option>
      <option value="Mars">Mars</option>
      <option value="Jupiter">Jupiter</option>
      <option value="Saturn">Saturn</option>
      <option value="Uranus">Uranus</option>
      <option value="Neptune">Neptune</option>
    </select>
    <select @change="toSelectChange($event)" id="filter">
      <option disabled selected value="">-- Sort By --</option>
      <option value="Cost">Cost</option>
      <option value="Distance">Distance</option>
      <option value="Time">Duration</option>
    </select>
    <select @change="toSelectChange($event)" id="provider">
      <option selected value="any">Any Provider</option>
      <option value="Space Odyssey">Space Odyssey</option>
      <option value="Space Voyager">Space Voyager</option>
      <option value="Space Piper">Space Piper</option>
      <option value="Spacelux">Spacelux</option>
      <option value="Explore Origin">Explore Origin</option>
      <option value="Spacegenix">Spacegenix</option>
      <option value="Galaxy Express">Galaxy Express</option>
      <option value="SpaceX">SpaceX</option>
      <option value="Explore Dynamite">Explore Dynamite</option>
      <option value="Travel Nova">Travel Nova</option>
    </select>
    <button id="dataButton" type="button" disabled v-on:click="callForData()">
      Search
    </button>
  </form>
</template>

<script>
import { useStore } from "../store";
export default {
  name: "Form",
  data() {
    return {
      from: "",
      to: "",
      sort: "",
      provider: "any",
      store: useStore(),
    };
  },
  methods: {
    callForData() {
      this.store.commit("updatePriceListID")
      this.store.commit("reservationVisited", false)
      let _from = this.from;
      let _to = this.to;
      let _sort = this.sort;
      let _provider = this.provider
      this.store.commit("setStartingPlanet", _from)
      this.store.commit("setCurrentList", {
        from: _from,
        to: _to,
        sort: _sort,
        provider: _provider
      });
    },
    toSelectChange(e) { // Function to make search button unclickable till all fields are filled in
      let selectValues = [];
      document.querySelectorAll("select").forEach((m) => {
        selectValues.push(m.value);
      });
      switch (e.target.id) {
        case "planet1":
          this.from = e.target.value;
          if (selectValues[0] === selectValues[1]) {
            // If 1st planet === 2nd planet
            document.querySelector("#planet2").value = "";
            selectValues[1] = ""; // At least one string needs to be empty for the check
            this.to = "";
          }
          break;
        case "planet2":
          this.to = e.target.value;
          if (selectValues[0] === selectValues[1]) {
            document.querySelector("#planet1").value = "";
            selectValues[0] = "";
            this.from = "";
          }
          break;
        case "filter":
          this.sort = e.target.value;
          break;
        case "provider":
          this.provider = e.target.value
          break;
      }
      if (!selectValues.includes("")) {
        document.querySelector("#dataButton").removeAttribute("disabled");
      } else {
        document.querySelector("#dataButton").setAttribute("disabled", "disabled");
      }
    },
  },
};
</script>


<style scoped>
form {
  display: flex;
  align-items: center;
  justify-content: center;
}
select {
  padding: 0.5rem;
  font-size: 1.2rem;
  margin: 0 1rem 0.2rem 0.2rem;
}
button {
  padding: 0.4rem 2rem;
  font-size: 1.2rem;
  margin: 0 1rem 0.2rem 0.2rem;
  background-color: #71df5e;
  cursor: pointer;
}
button:hover {
  background-color: #6dd45b;
}
button[disabled] {
  background-color: #c3c3c3;
  cursor: default;
}
</style>
