/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import { PlanetRoutesWithID, PlanetRoute } from './interfaces'

// define your typings for the store state
export interface State {
    currentList: PlanetRoutesWithID | undefined,
    reservations: [],
    currentPlanet: string,
    selectedRoutes: PlanetRoute[],
    priceListID: string,
    reservationsVisited: boolean
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
    state: {
        currentList: undefined,
        reservations: [],
        currentPlanet: "",
        selectedRoutes: [],
        priceListID: "",
        reservationsVisited: false
        
    },
    mutations: {
        reservationVisited(state, value) {
            state.reservationsVisited = value;
        },
        async setCurrentList (state, {from, to, sort, provider}) {
            let temp = await (await fetch(`http://localhost:4040/routes?from=${from}&to=${to}&sort=${sort}&provider=${provider}`)).json()
            temp = temp as PlanetRoutesWithID
            state.currentList = temp;
        },
        setStartingPlanet(state, planet) {
            state.currentPlanet=planet
        },
        setSelectedRoutes(state, routes) {
            state.selectedRoutes = routes
        },
        async updatePriceListID(state) {
            const temp = await (await fetch("http://localhost:4040/currentpricelistid")).text()
            state.priceListID = temp;
        }
    }
  })

// define your own `useStore` composition function
export function useStore () {
    return baseUseStore(key)
  }