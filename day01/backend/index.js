import express from "express";
import cors from "cors";
import fs from "fs";
import items from "./data.json" with { type: "json" };

const app = express();
app.use(express.json());
app.use(cors());

// helper function to save data
const saveToFile = () => {
    fs.writeFile("./data.json", JSON.stringify(items, null, 2), (err) => {
        if (err) {
            console.error("Error writing file", err);
        } else {
            console.log("Data saved to file");
        }
    });
};

// get method
app.get("/items", (req, res) => {
    res.json(items);
});

// post method
app.post("/items", (req, res) => {
    const newItem = {
        id: Date.now(),
        ...req.body,
    };

    items.push(newItem);
    saveToFile();

    res.status(201).json(newItem);
});

// put method
app.put("/items/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const index = items.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Item not found" });
    }

    items[index] = { ...items[index], ...req.body };

    saveToFile();

    res.json({ message: "Item updated", item: items[index] });
});

// delete 
app.delete("/items/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const index = items.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Item not found" });
    }

    items.splice(index, 1);

    saveToFile();

    res.json({ message: "Item deleted" });
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});