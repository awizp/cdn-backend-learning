import { useState } from "react";
import { apiRequest } from "../utils/api";

function Login({ setUser }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        if (!username || !password) {
            return setError("Please fill all fields");
        }

        try {
            const { res, data } = await apiRequest("/login", {
                method: "POST",
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok || data.message !== "Login successful") {
                setError(data.message || "Login failed");
                return;
            }

            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);

            setUser(data.user);
            setError("");

        } catch (err) {
            setError("Server error. Try again.");
            console.log(err);
        }
    };

    return (
        <div className="p-4 border rounded flex flex-col gap-5 justify-center items-center">
            <h2 className="text-2xl font-bold">Login</h2>

            {error && <p className="text-red-500">{error}</p>}

            <input
                className="border-2 border-black/50 p-2 m-2 rounded-lg"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
            />

            <input
                className="border-2 border-black/50 p-2 m-2 rounded-lg"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <button
                className="w-full bg-purple-500 text-white p-2 rounded-lg cursor-pointer"
                onClick={handleLogin}
            >
                Login
            </button>
        </div>
    );
}

export default Login;