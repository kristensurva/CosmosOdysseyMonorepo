/* eslint-disable prefer-const */
import { randomUUID } from "crypto";
import { Pricelist, Route, Provider, Planets, PlanetRoutesWithID, PlanetRoute } from './interfaces';
/** Returns sorted array of routes based on arguments. */
const getFlightRoutes = async (inputFrom: string, inputTo: string, inputSortBy: string, provider = "any", data: Pricelist) => { // encompassing async function
    if (data instanceof Object) {//is this if needed?
        let routes: Array<Route> = []
        data["legs"].forEach((element) => {
            let providersArr: Array<Provider> = []
            element.providers.forEach((element2) => {
                let provider: Provider = {
                    company: element2.company.name,
                    price: element2.price,
                    flightStart: element2.flightStart,
                    flightEnd: element2.flightEnd
                }
                providersArr.push(provider)

            })
            let route: Route = {
                id: element.routeInfo.id,
                from: element.routeInfo.from.name,
                to: element.routeInfo.to.name,
                distance: element.routeInfo.distance,
                providers: providersArr
            }
            routes.push(route)
        })
        let planets: Planets = initPlanetsAndRoutes(routes)
        let paths = DFS(inputFrom, inputTo, planets, provider)
        switch (inputSortBy) {
            case ("Cost"):
                sortForCost(paths)
                break;
            case ("Distance"):
                sortForDistance(paths)
                break;
            case ("Time"):
                sortForDuration(paths)
                break;
        }
        let pathsWithIDs = generateUUIDs(paths)
        return pathsWithIDs
    }

    // --- Sorting Functions ---
    function sortForCost(arr: PlanetRoute[][]) {
        arr.sort((a, b) => a.reduce((x, z: PlanetRoute) => (x + z.distance), 0) - b.reduce((x, z) => (x + z.distance), 0)) // secondary sort
        arr.sort((a, b) => a.reduce((x, z: PlanetRoute) => (x + z.cost), 0) - b.reduce((x, z) => (x + z.cost), 0))
    }

    function sortForDistance(arr: PlanetRoute[][]) {
        arr.sort((a, b) => a.reduce((x, z: PlanetRoute) => (x + z.cost), 0) - b.reduce((x, z) => (x + z.cost), 0)) // secondary sort
        arr.sort((a, b) => a.reduce((x, z: PlanetRoute) => (x + z.distance), 0) - b.reduce((x, z) => (x + z.distance), 0))
    }

    function sortForDuration(arr: PlanetRoute[][]) {
        arr.sort((a, b) => a.reduce((x, z: PlanetRoute) => (x + z.cost), 0) - b.reduce((x, z) => (x + z.cost), 0)) // secondary sort
        arr.sort((a, b) => a.reduce((x, z: PlanetRoute) => (x + z.duration), 0) - b.reduce((x, z) => (x + z.duration), 0))
    } // --- ---
    /** Initialises planets and routes into a form (graph) that is usable in depth first search.*/
    function initPlanetsAndRoutes(routeArray: Route[]) {
        let planets: Planets = {
            Mercury: [],
            Venus: [],
            Earth: [],
            Mars: [],
            Jupiter: [],
            Saturn: [],
            Uranus: [],
            Neptune: []
        }
        // - Fill paths for planets -
        routeArray.forEach((route) => {
            route.providers.forEach((provider) => { // Handling each providers option and making them into routes
                let startDate: Date = new Date(provider.flightStart)
                let endDate: Date = new Date(provider.flightEnd)
                let duration: number = endDate.getTime() - startDate.getTime();
                let planetRoute: PlanetRoute = {
                    to: route.to,
                    distance: route.distance,
                    cost: provider.price,
                    duration: duration,
                    provider: provider.company,
                    flightStart: provider.flightStart,
                    flightEnd: provider.flightEnd
                }
                planets[route.from].push(planetRoute) // Assigning route to planet
            })
        })
        return planets;
    }
    /** Depth First Search - finds all possible paths between planets.*/
    function DFS(from: string, to: string, planets: Planets, filteredProvider: string) {
        let allPaths: Array<Array<PlanetRoute>> = []; // We only add to allPaths when it is relevant
        function DFSRecursion(currentPath: Array<PlanetRoute>) {
            let currentPlanet: string = currentPath[currentPath.length - 1].to
            let currentPlanetRoutes: Array<PlanetRoute> = planets[currentPlanet]
            // -- Base --
            if (currentPlanet === to) { // if current planet is the same as destination planet
                allPaths.push(currentPath)
                return;
            }
            else if (from === currentPlanet /// if current planet is either starting planet...
                || currentPath.slice(0, currentPath.length - 1).some(path => path.to === currentPlanet)) {  // ...or another planet already visited (discounting last path because that is currentplanet)
                return;
            }
            // -- Step --
            let deadEndPlanets: Array<string> = [] // way to track planets that are dead ends so we don't need to visit them more than once
            currentPlanetRoutes.forEach((route => {
                let temp = [...currentPath]
                //                                Making sure the flight doesn't take off before the end of the previous flight
                if (!deadEndPlanets.includes(route.to) && route.flightStart > currentPath[currentPath.length - 1].flightEnd
                    && (route.provider === filteredProvider || filteredProvider === "any")) {
                    temp.push(route)
                    if (DFSRecursion(temp)) {
                        deadEndPlanets.push(route.to) // If the next recursion branch finishes all of its routes, it means that particular planet route leads to a dead end, no reason to keep looking for those.
                    }
                }
            }))
            return true;
        }
        let startingPlanetRoutes = planets[from]
        startingPlanetRoutes.forEach(route => {
            if (route.provider === filteredProvider || filteredProvider === "any") DFSRecursion([route])
        })
        return allPaths
    }

    function generateUUIDs(Routes: Array<Array<PlanetRoute>>) {
        let routesWithID: Array<PlanetRoutesWithID> = [];
        Routes.forEach((Route) => {
            let pathWithId: PlanetRoutesWithID = {
                MultiRoute: Route,
                ID: randomUUID()
            }
            routesWithID.push(pathWithId)
        })
        return routesWithID
    }
}
export { getFlightRoutes }