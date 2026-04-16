import express from "express";
import cors from "cors";
import router from "./routes/routes.js";
import { dbConn } from "./db/config.js";

const app = express();

app.use(cors({
    origin: "*",
    methods: ["POST", "GET", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true
}));

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
    const ip = req.ip;

    // console.log(ip)

    return next();
})

app.use('/api', router);

dbConn();

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});