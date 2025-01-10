import axios from "axios";
import { getDb } from "./db"
import { APIResponse, CryptoCurrency } from "./types";


export const scheduleDbUpdates = () => {
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
        url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,matic-network",
        headers: {accept: "application/json"}
    };

    try {
        //fetch data from the API
        const res = await axios.request<APIResponse>(options);
        
        //update the database
        const data: CryptoCurrency = {
            id: res.data.id,
            name: res.data.name,
            symbol: res.data.symbol,
            current_price: res.data.current_price,
            market_cap: res.data.market_cap,
            price_change_24h: res.data.price_change_24h,
            last_updated: res.data.last_updated,
        }
        await updateDb(data);
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