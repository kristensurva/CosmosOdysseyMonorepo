import { createApp} from 'vue'
import App from './App.vue'
import { store, key } from './store'
//Router
import { createRouter, createWebHistory } from "vue-router";
import ReservationsPage from './views/ReservationsPage.vue'
import Main from './views/Main.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Main
    },
    {
        path: '/reservations',
        name: 'Reservations',
        component: ReservationsPage
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})


const app = createApp(App)

app.use(store, key)
app.use(router)
app.mount('#app')