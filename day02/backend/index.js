import express from "express";
import cors from "cors";
import fs from "fs";

const usersData = "./users.json";

const app = express();
app.use(cors());
app.use(express.json());

// get users
const getUsers = () => {
    const data = fs.readFile(usersData);
    return JSON.parse(data);
};

// save users
const saveUsers = (users) => {
    fs.writeFile(usersData, JSON.stringify(users));
};

app.get("/", (req, res) => {
    res.json({ message: "Hello from the server!" });
});

// signup API
app.post("/signup", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.json({ message: "All fields are required" });
    }

    const users = getUsers();

    const existingUser = users.find((u) => u.username === username);
    if (existingUser) {
        return res.json({ message: "User already exists" });
    }

    const newUser = {
        id: Date.now(),
        username,
        password,
    };

    users.push(newUser);
    saveUsers(users);

    res.json({ message: "Signup successful", user: newUser });
});

// login API
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.json({ message: "All fields are required" });
    }

    const users = getUsers();

    const user = users.find(
        (u) => u.username === username && u.password === password
    );

    if (!user) {
        return res.json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful", user });
});

app.listen(5000, () => {
    console.log("Server running on port http://localhost:5000");
});