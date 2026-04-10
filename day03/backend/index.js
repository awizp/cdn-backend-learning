import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import "./utils/loadEnvironment.js";

// atlas DNS resolution is very slow, so we use Cloudflare's DNS instead
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1"]);

const app = express();
app.use(cors());
app.use(express.json());

// mongoDB connection string
const uri = process.env.MONGODB_URI;

// create client
const client = new MongoClient(uri);

let usersCollection;

// connect to db
async function connectDB() {
    try {
        await client.connect();
        const db = client.db("usersDB");
        usersCollection = db.collection("users");

        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

connectDB();

// test route
app.get("/", (req, res) => {
    res.json({ message: "Hello from the server!" });
});

// signup
app.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.json({ message: "All fields are required" });
    }

    const existingUser = await usersCollection.findOne({ username });

    if (existingUser) {
        return res.json({ message: "User already exists" });
    }

    const newUser = {
        username,
        password,
        createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    res.json({
        message: "Signup successful",
        user: { _id: result.insertedId, username }
    });
});

// login
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.json({ message: "All fields are required" });
    }

    const user = await usersCollection.findOne({
        username,
        password,
    });

    if (!user) {
        return res.json({ message: "Invalid credentials" });
    }

    res.json({
        message: "Login successful",
        user: {
            _id: user._id,
            username: user.username
        }
    });
});

// server listening
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});