import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { usersCollection } from "../db/db.js";

const JWT_SECRET = process.env.JWT_SECRET;

// signup
export const signup = async (req, res) => {
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
};


// login
export const login = async (req, res) => {
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
};


// dashboard
export const profile = async (req, res) => {
    res.json({
        message: "Protected data",
        user: req.user
    });
};