<template>
    <div>
        <h2>Pricelist {{this.index+1}} {{showIfDated(index)}}</h2>
        ID: {{this.pricelist.id}}<br />
        Valid until: {{this.pricelist.validUntil}}<br />
        Legs: <p>{{this.pricelist.legs}}</p><br />
        Reservations: <div class="reservation" v-for="(reservation, i) in this.pricelist.reservations"  :key="i"> First name: {{reservation.first}} | Last name: {{reservation.last}} | Price: {{reservation.totalPrice}} | Travel time: {{reservation.totalTravelTime}} | Companies: {{reservation.companyNames}}<br/>Routes: {{reservation.routes}}</div>
    </div>
<br />
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    data() {
        return {
            json: "xd"
        }
    },
    props: ["pricelist", "index"],
    methods: {
        showIfDated(index) {
            if (index===0) {
                return ""
            }
            else {
                return "(out of date)"
            }
        }
    }

})
</script>

<style scoped>
* {
  color: black;
  font-size: 1.1rem;
}
h2 {
    font-size:1.5rem;
    margin: 0.5rem 0;
}
p {
    font-size: 0.2rem;
}
div {
    background-color: #8a98a7;
    padding: 0.3rem;
    border-radius: 0.2rem;
}
.reservation {
    background-color: rgb(202, 223, 230);
    border: 2rem;
    margin: 0.5rem;
    padding: 0.2rem;
}
</style>
