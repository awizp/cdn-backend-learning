import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "./utils/loadEnvironment.js";

// atlas DNS resolution is very slow, so we use Cloudflare's DNS instead
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1"]);

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

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

// auth middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token required" });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = user;
        next();
    });
}

// test route
app.get("/", (req, res) => {
    res.json({ message: "Hello from the server!" });
});

// sign up
app.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.json({ message: "All fields are required" });
    }

    const existingUser = await usersCollection.findOne({ username });

    if (existingUser) {
        return res.json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        username,
        password: hashedPassword,
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

    const user = await usersCollection.findOne({ username });

    if (!user) {
        return res.json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.json({ message: "Invalid credentials" });
    }

    if (!user) {
        return res.json({ message: "Invalid credentials" });
    }

    // create token
    const token = jwt.sign(
        { userId: user._id, username: user.username },
        JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.json({
        message: "Login successful",
        token,
        user: {
            _id: user._id,
            username: user.username
        }
    });
});

// protected route
app.get("/profile", authenticateToken, async (req, res) => {
    res.json({
        message: "Protected data",
        user: req.user
    });
});

// server port
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});