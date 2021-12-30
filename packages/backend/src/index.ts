import express from "express";
import { Pricelist, PricelistWithReservations, Reservation } from "./interfaces";
import { getFlightRoutes } from "./logic";
import fetch from "node-fetch"
const app = express();
const port = 4040; // default port to listen

const priceLists: PricelistWithReservations[] = []

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next()
})
app.use(express.json());
const getJson = async () => {
    const response = await (await fetch('https://cosmos-odyssey.azurewebsites.net/api/v1.0/TravelPrices')).json() as Pricelist;
    const Pricelist: PricelistWithReservations = {
        reservations: [],
        ...response
    } 
    return Pricelist
};

// GET method route
app.get("/routes", async ( req, res ) => {
    const from = req.query.from
    const to = req.query.to
    const sort = req.query.sort
    const provider = req.query.provider
    /** Deconstructuring
     * const {from, to, sort, provider} = req.query;
     */
    let temp;
    if (typeof from === 'string' && typeof to === 'string' && typeof sort === 'string' && from !== 'undefined' && to !== 'undefined' && sort !== 'undefined') {
        if (typeof provider === 'string') {
            temp = await getFlightRoutes(from, to, sort, provider, priceLists[0] as Pricelist)
        }
        else {
            temp = await getFlightRoutes(from, to, sort, "any", priceLists[0] as Pricelist)
        }
        res.send(temp);
    }
    else {
        res.send("Bad request")
    }  
});

app.get("/reservations", async ( req, res ) => {
    res.send(priceLists)
});

app.get("/currentpricelistid", (req, res) => {
    res.send(priceLists[0].id)
})

// POST method route
app.post("/reservationpost", (req, res) => {
    const reservation: Reservation = {
        first: req.body.first,
        last: req.body.last,
        routes: req.body.routes,
        totalPrice: req.body.totalPrice,
        totalTravelTime: req.body.totalTravelTime,
        companyNames: req.body.companyNames,
    }
    if (req.body.priceListID===priceLists[0].id) { // If pricelist in client up to date
        priceLists[0].reservations.push(reservation)
        res.send("200")
    }
    else {
        res.send("400")
    }
    
    
})

async function timeOutFun() {
    if (priceLists.unshift(await getJson()) > 15) 
    { 
        priceLists.pop()
    }
    const timeOutTime: number= new Date(priceLists[0].validUntil).getTime() - (Date.now())
    setTimeout(timeOutFun, timeOutTime)
}

// start the Express server
app.listen( port, async () => {
    timeOutFun()
    console.log( `server started at http://localhost:${ port }` );    
});