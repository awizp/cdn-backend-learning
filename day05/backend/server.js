import app from "./app.js";
import { connectDB } from "./db/db.js";
import "./utils/loadEnvironment.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
};

startServer();