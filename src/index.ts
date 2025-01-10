//server starting point
import app from "./app";
import { connectToDb } from "./store/db";
import { scheduleDbUpdates } from "./store/ops";
import dotenv from "dotenv";

const PORT = process.env.PORT || 3000;
dotenv.config();


async function startServer() {
    try {
        //connect to database
        await connectToDb();
        console.log("Database connected");
        //schedule udpates
        scheduleDbUpdates();

        //listen
        app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
    }
    catch(err) {
        console.error("Error in starting the server");
        console.log(err);
    }
}

startServer();