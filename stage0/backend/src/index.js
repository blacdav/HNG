import express from "express";
import cors from "cors";
import classify from "./classify.js";

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET"],
    // allowedHeaders: ["Content-Type"],
    credentials: true
}));


// app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/classify", async (req, res) => {
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ error: "Name query parameter is required." });
    }

    if (typeof name !== "string" || name.trim() === "") {
        return res.status(422).json({ error: "Name must be a non-empty string." });
    }

    try {
        const result = await classify(name);

        if (!result) {
            return res.status(200).json({
                status: "error",
                message: "Unable to classify the name."
            });
        }

        if (result.error) {
            return res.json({
                status: "error",
                message: `${result.error}`
            })
        }

        if (!result.gender) {
            return res.json({
                status: "error",
                message: "No prediction available for the provided name"
            })
        }

        return res.status(200).json({
            status: "success",
            data: {
                name: result.name,
                gender: result.gender,
                probability: result.probability,
                sample_size: result.count,
                is_confident: result.probability >= 0.7 && result.count >= 100 ? true : false,
                processed_at: new Date().toISOString()
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Server Failure"
        });
    }
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});