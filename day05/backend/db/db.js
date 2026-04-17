import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

let usersCollection;

export const connectDB = async () => {
    try {
        await client.connect();
        const db = client.db("usersDB");
        usersCollection = db.collection("users");

        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};

export { usersCollection };