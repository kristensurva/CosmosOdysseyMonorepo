var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/* eslint-disable prefer-const */
import { randomUUID } from "crypto";
/** Returns sorted array of routes based on arguments. */
const getFlightRoutes = (inputFrom, inputTo, inputSortBy, provider = "any", data) => __awaiter(void 0, void 0, void 0, function* () {
    if (data instanceof Object) { //is this if needed?
        let routes = [];
        data["legs"].forEach((element) => {
            let providersArr = [];
            element.providers.forEach((element2) => {
                let provider = {
                    company: element2.company.name,
                    price: element2.price,
                    flightStart: element2.flightStart,
                    flightEnd: element2.flightEnd
                };
                providersArr.push(provider);
            });
            let route = {
                id: element.routeInfo.id,
                from: element.routeInfo.from.name,
                to: element.routeInfo.to.name,
                distance: element.routeInfo.distance,
                providers: providersArr
            };
            routes.push(route);
        });
        let planets = initPlanetsAndRoutes(routes);
        let paths = DFS(inputFrom, inputTo, planets, provider);
        switch (inputSortBy) {
            case ("Cost"):
                sortForCost(paths);
                break;
            case ("Distance"):
                sortForDistance(paths);
                break;
            case ("Time"):
                sortForDuration(paths);
                break;
        }
        let pathsWithIDs = generateUUIDs(paths);
        return pathsWithIDs;
    }
    // --- Sorting Functions ---
    function sortForCost(arr) {
        arr.sort((a, b) => a.reduce((x, z) => (x + z.distance), 0) - b.reduce((x, z) => (x + z.distance), 0)); // secondary sort
        arr.sort((a, b) => a.reduce((x, z) => (x + z.cost), 0) - b.reduce((x, z) => (x + z.cost), 0));
    }
    function sortForDistance(arr) {
        arr.sort((a, b) => a.reduce((x, z) => (x + z.cost), 0) - b.reduce((x, z) => (x + z.cost), 0)); // secondary sort
        arr.sort((a, b) => a.reduce((x, z) => (x + z.distance), 0) - b.reduce((x, z) => (x + z.distance), 0));
    }
    function sortForDuration(arr) {
        arr.sort((a, b) => a.reduce((x, z) => (x + z.cost), 0) - b.reduce((x, z) => (x + z.cost), 0)); // secondary sort
        arr.sort((a, b) => a.reduce((x, z) => (x + z.duration), 0) - b.reduce((x, z) => (x + z.duration), 0));
    } // --- ---
    /** Initialises planets and routes into a form (graph) that is usable in depth first search.*/
    function initPlanetsAndRoutes(routeArray) {
        let planets = {
            Mercury: [],
            Venus: [],
            Earth: [],
            Mars: [],
            Jupiter: [],
            Saturn: [],
            Uranus: [],
            Neptune: []
        };
        // - Fill paths for planets -
        routeArray.forEach((route) => {
            route.providers.forEach((provider) => {
                let startDate = new Date(provider.flightStart);
                let endDate = new Date(provider.flightEnd);
                let duration = endDate.getTime() - startDate.getTime();
                let planetRoute = {
                    to: route.to,
                    distance: route.distance,
                    cost: provider.price,
                    duration: duration,
                    provider: provider.company,
                    flightStart: provider.flightStart,
                    flightEnd: provider.flightEnd
                };
                planets[route.from].push(planetRoute); // Assigning route to planet
            });
        });
        return planets;
    }
    /** Depth First Search - finds all possible paths between planets.*/
    function DFS(from, to, planets, filteredProvider) {
        let allPaths = []; // We only add to allPaths when it is relevant
        function DFSRecursion(currentPath) {
            let currentPlanet = currentPath[currentPath.length - 1].to;
            let currentPlanetRoutes = planets[currentPlanet];
            // -- Base --
            if (currentPlanet === to) { // if current planet is the same as destination planet
                allPaths.push(currentPath);
                return;
            }
            else if (from === currentPlanet /// if current planet is either starting planet...
                || currentPath.slice(0, currentPath.length - 1).some(path => path.to === currentPlanet)) { // ...or another planet already visited (discounting last path because that is currentplanet)
                return;
            }
            // -- Step --
            let deadEndPlanets = []; // way to track planets that are dead ends so we don't need to visit them more than once
            currentPlanetRoutes.forEach((route => {
                let temp = [...currentPath];
                //                                Making sure the flight doesn't take off before the end of the previous flight
                if (!deadEndPlanets.includes(route.to) && route.flightStart > currentPath[currentPath.length - 1].flightEnd
                    && (route.provider === filteredProvider || filteredProvider === "any")) {
                    temp.push(route);
                    if (DFSRecursion(temp)) {
                        deadEndPlanets.push(route.to); // If the next recursion branch finishes all of its routes, it means that particular planet route leads to a dead end, no reason to keep looking for those.
                    }
                }
            }));
            return true;
        }
        let startingPlanetRoutes = planets[from];
        startingPlanetRoutes.forEach(route => {
            if (route.provider === filteredProvider || filteredProvider === "any")
                DFSRecursion([route]);
        });
        return allPaths;
    }
    function generateUUIDs(Routes) {
        let routesWithID = [];
        Routes.forEach((Route) => {
            let pathWithId = {
                MultiRoute: Route,
                ID: randomUUID()
            };
            routesWithID.push(pathWithId);
        });
        return routesWithID;
    }
});
export { getFlightRoutes };
//# sourceMappingURL=logic.js.map