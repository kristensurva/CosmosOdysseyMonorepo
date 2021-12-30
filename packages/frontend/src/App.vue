<template>
<div id="nav">   
    <router-link class="navbutton" to="/">Go to Home</router-link>
    <router-link @click="reservationsVisited(true)" class="navbutton" to="/reservations">Go to Reservations</router-link>
</div>
<router-view></router-view>
</template>

<script>
import { defineComponent } from 'vue'
import { useStore } from './store'
export default defineComponent({
  name: "App",
  data () {
    return {
      store: useStore()
    }
  },
  methods: {
    reservationsVisited(value) {
      this.store.commit("reservationVisited", value)
    }
  } 
})
</script>

<style>
*{
  box-sizing: border-box;
}

html, body{
  padding: 0;
  margin: 0;
  min-width: 100%;
  min-height: 100%;
  background-color: rgb(180, 180, 180);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #737d8a;
  margin-top: 0px;
}
#nav {
  background-color: #6d85a0;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin-bottom: 0.5rem;
}
.navbutton {
  background-color: rgb(187, 234, 246);
  padding: 0.8rem;
  margin: 0;
  font-size: 1.5rem;
}
.navbutton:hover {
  background-color: rgb(171, 212, 223);
}
</style>
