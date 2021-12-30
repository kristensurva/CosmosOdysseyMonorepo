var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import { getFlightRoutes } from "./logic";
import fetch from "node-fetch";
const app = express();
const port = 4040; // default port to listen
const priceLists = [];
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});
app.use(express.json());
const getJson = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (yield fetch('https://cosmos-odyssey.azurewebsites.net/api/v1.0/TravelPrices')).json();
    const Pricelist = Object.assign({ reservations: [] }, response);
    return Pricelist;
});
// GET method route
app.get("/routes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const from = req.query.from;
    const to = req.query.to;
    const sort = req.query.sort;
    const provider = req.query.provider;
    /** Deconstructuring
     * const {from, to, sort, provider} = req.query;
     */
    let temp;
    if (typeof from === 'string' && typeof to === 'string' && typeof sort === 'string' && from !== 'undefined' && to !== 'undefined' && sort !== 'undefined') {
        if (typeof provider === 'string') {
            temp = yield getFlightRoutes(from, to, sort, provider, priceLists[0]);
        }
        else {
            temp = yield getFlightRoutes(from, to, sort, "any", priceLists[0]);
        }
        res.send(temp);
    }
    else {
        res.send("Bad request");
    }
}));
app.get("/reservations", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(priceLists);
}));
app.get("/currentpricelistid", (req, res) => {
    res.send(priceLists[0].id);
});
// POST method route
app.post("/reservationpost", (req, res) => {
    const reservation = {
        first: req.body.first,
        last: req.body.last,
        routes: req.body.routes,
        totalPrice: req.body.totalPrice,
        totalTravelTime: req.body.totalTravelTime,
        companyNames: req.body.companyNames,
    };
    if (req.body.priceListID === priceLists[0].id) { // If pricelist in client up to date
        priceLists[0].reservations.push(reservation);
        res.send("200");
    }
    else {
        res.send("400");
    }
});
function timeOutFun() {
    return __awaiter(this, void 0, void 0, function* () {
        if (priceLists.unshift(yield getJson()) > 15) {
            priceLists.pop();
        }
        const timeOutTime = new Date(priceLists[0].validUntil).getTime() - (Date.now());
        setTimeout(timeOutFun, timeOutTime);
    });
}
// start the Express server
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    timeOutFun();
    console.log(`server started at http://localhost:${port}`);
}));
//# sourceMappingURL=index.js.map