import { Router } from "express";
import { getDb } from "../store/db";
import { DeviationResponse, InRequest, StatsResponse } from "./types";
import { CryptoCurrency } from "../store/types";

const router = Router();

router.get("/stats", async (req, res) => {
    const { coin }: InRequest = req.body;

    if(!coin || typeof coin !== "string") {
        res.status(400).json("Invalid parameters");
    }

    try {
        const db = getDb();
        const collection = db.collection<CryptoCurrency>(coin);

        const cryptoData = await collection.findOne({}, { sort: { last_updated: -1 }});
        if(!cryptoData) {
            res.status(400).json({message: `Could not find details of ${coin}`});
            return;
        }

        const resp: StatsResponse = {
            price: cryptoData.current_price,
            marketCap: cryptoData.market_cap,
            "24hChange": cryptoData.price_change_24h
        }

        res.json(resp);
    }
    catch(err) {
        console.error("Error while fetching data from database");
        console.log(err);
        res.status(500).json({error: "Error while fetching details from database"});
    }
});

router.get("/deviation", async (req, res) => {
    const { coin }: InRequest = req.body;
    if(!coin || typeof coin !== "string") {
        res.status(400).json({error: "Invalid parameters"});
    }

    try {
        const db = getDb();
        const collection = db.collection<CryptoCurrency>(coin);
        
        const cryptodata: CryptoCurrency[] = await collection
        .find()
        .sort({ last_updated: -1 })
        .limit(100)
        .toArray();

        if(cryptodata.length === 0) {
            res.status(200).json({error: `No data found for ${coin}`});
            return;
        }

        //calculate std deviation
        const prices = cryptodata.map(data => data.current_price);
        const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
        const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
        const deviation = Math.sqrt(variance);

        //send back as response
        const resp: DeviationResponse = { deviation }
        res.json(resp);
    }
    catch(err) {
        console.error("Error while fetching details from the database:");
        console.log(err);
    }
})

export default router;