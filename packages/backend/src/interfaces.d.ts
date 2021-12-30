export interface Pricelist {
    id: string,
    validUntil: string,
    legs: {
        id: string,
        routeInfo: {
            id: string,
            from: {
                id: string,
                name: string,
            },
            to: {
                id: string,
                name: string,
            },
            distance: number,
        },
        providers: {
            id: string,
            company: {
                id: string,
                name: string,
            },
            price: number,
            flightStart: string,
            flightEnd: string,
        }[],
    }[]
}

export interface PricelistWithReservations extends Pricelist {
    reservations: Reservation[]
}//Y

// clean
export interface Route {
    id: string
    from: string
    to: string
    distance: number
    providers: Provider[]
}

export interface Provider {
    company: string
    price: number
    flightStart: string
    flightEnd: string
}

export interface Planets {
    [Mercury : string]: PlanetRoute[]
    [Venus : string]: PlanetRoute[]
    [Earth : string]: PlanetRoute[]
    [Mars : string]: PlanetRoute[]
    [Jupiter : string]: PlanetRoute[]
    [Saturn : string]: PlanetRoute[]
    [Uranus : string]: PlanetRoute[]
    [Neptune : string]: PlanetRoute[]
}

export interface PlanetRoute {
    to: string
    distance: number
    cost: number
    duration: number
    //Misc.
    provider: string
    flightStart: string
    flightEnd: string
}

export interface Reservation {
    first: string
    last: string
    routes: Route[]
    totalPrice: number
    totalTravelTime: string
    companyNames: string[]
}

export interface PlanetRoutesWithID {
    MultiRoute: PlanetRoute[]
    ID: string
}