import { useState } from "react";

function Login({ setUser }) {
    const API = "http://localhost:5000";

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        if (!username || !password) {
            return setError("Please fill all fields");
        }

        try {
            const res = await fetch(`${API}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok || data.message !== "Login successful") {
                setError(data.message || "Login failed");
                return;
            }

            setError("");
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);

        } catch (err) {
            setError("Server error. Try again.");
            console.log("Fetching user error", err);
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