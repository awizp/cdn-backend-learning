import express from "express";
import cors from "cors";
import items from "./data.json" with {type: "json"};

const app = express();
app.use(express.json());
app.use(cors());

// get method
app.get("/items", (req, res) => {
    res.json(items);
    res.send(items);
});

// post method
app.post("/items", (req, res) => {
    const newItem = {
        id: Date.now(),
        ...req.body,
    };

    items.push(newItem);
    res.json(newItem);
});

// put method
app.put("/items/:id", (req, res) => {
    const id = Number(req.params.id);

    items = items.map((item) =>
        item.id === id ? { ...item, ...req.body } : item
    );

    res.json({ message: "item updated" });
});

// delete method
app.delete("/items/:id", (req, res) => {
    const id = Number(req.params.id);

    items = items.filter((item) => item.id !== id);

    res.json({ message: "item deleted" });
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});