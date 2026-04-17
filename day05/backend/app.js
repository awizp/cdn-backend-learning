import express from "express";
import cors from "cors";
import "./utils/loadEnvironment.js";
import authRoutes from "./routes/authRoutes.js";

// mongodb server is slow so using cloudflare dns
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1"]);

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/", authRoutes);

// test route
app.get("/", (req, res) => {
    res.json({ message: "Hello from the server!" });
});

export default app;