import { Db, MongoClient } from "mongodb";

let client: MongoClient;
let db:Db;

export const connectToDb = async() => {
    if(!client) {
        client = new MongoClient(process.env.MONGO_URL || "");
        await client.connect();
        db = client.db("koinx");   
        console.log("Database connected");
    }
}

export const getDb = () => {
    if(!db)
        throw new Error("Database not connected. Connect to DB first");
    return db;
}