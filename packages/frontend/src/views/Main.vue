<template>
<div>
  <Form> </Form>
  <PlanetRouteList @reservationButtonClicked="toggleReservationForm(true)"> </PlanetRouteList>
  <ReservationForm v-if="showForm" @clickOutside="toggleReservationForm(false)" @reservationButtonClicked="toggleReservationForm(true)">  </ReservationForm>
</div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue';
import Form from '../components/Form.vue';
import PlanetRouteList from '../components/PlanetRouteList.vue';
import ReservationForm from '../components/ReservationForm.vue';
import { useStore } from '../store';

export default defineComponent({
  name: 'Main',
  components: {
    PlanetRouteList,
    Form,
    ReservationForm
  },
  data() {
    return {
      showForm: false
    } 
  },
  methods: {
    toggleReservationForm(value: boolean) {
      this.showForm = value
      console.log(value)
    }
  },
  mounted() {
    useStore().commit("updatePriceListID")
  }
});
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

#main {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #909090;
  margin-top: 60px;
}
</style>
