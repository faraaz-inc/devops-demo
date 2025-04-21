import express from "express";
import router from "./api/routes";

const app = express();

app.use(express.json());
app.use("/api/v1", router);

app.get("/", (req, res) => {
    res.json({ "stats endpoint": "/api/v1/stats", "deviation endpoint": "/api/v1/deviation" })
}



export default app;