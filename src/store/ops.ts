import axios from "axios";
import { getDb } from "./db"
import { APIResponse, CryptoCurrency } from "./types";

const API_URL = "https://api.coingecko.com/api/v3/coins/markets";
const COINS = ["bitcoin", "ethereum", "matic-network"];


export const scheduleDbUpdates = async() => {
    //manually run the first time on starting up the server
    try {
        console.log("Fetching crypto data");
        await updateCryptoData();
        console.log("Database updated succesfully");
    }
    catch(err) {
        console.error("Error while updating DB");
        console.log(err);
    }
    //set 2 hr interval
    setInterval(async() => {
        try {
            // Call the function to fetch and update data
            console.log("Fetching cryptocurrency data...");
            await updateCryptoData();  
            console.log("Crypto data fetched and database updated.");
        } catch (err) {
            console.error("Error while running the fetchCryptoData job:");
            console.log(err);
        }
    }, 7200000);
}

const updateCryptoData = async() => {
    const options = {
        method: "GET",
        url: API_URL,
        params: {
            ids: COINS.join(","),
            vs_currency: "usd",
        },
        headers: {accept: "application/json"}
    };

    try {
        //fetch data from the API
        const res = await axios.request<APIResponse[]>(options);
        
        //update the database
        res.data.map(async (crypto) => {
            const data: CryptoCurrency = {
                id: crypto.id,
                name: crypto.name,
                symbol: crypto.symbol,
                current_price: crypto.current_price,
                market_cap: crypto.market_cap,
                price_change_24h: crypto.price_change_24h,
                last_updated: crypto.last_updated,
            }
            await updateDb(data);
        })
    }
    catch(err) {
        console.error("Error while fetching data from API and updating to database:");
        console.log(err);
    }


}

const updateDb = async (data: CryptoCurrency) => {
    //upsert the data
    const db = getDb();
    const collection = db.collection("cryptocurrencies");

    await collection.updateOne({id: data.id}, {
        $set: {
            name: data.name,
            symbol: data.symbol,
            current_price: data.current_price,
            market_cap: data.market_cap,
            price_change_24h: data.price_change_24h,
            last_updated: data.last_updated
        }
    }, {upsert: true});
}