import { useState } from "react";

function Signup({ setPage }) {
    const API = "http://localhost:5000";

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSignup = async () => {
        if (!username || !password) {
            return setError("All fields are required");
        }

        try {
            const res = await fetch(`${API}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok || data.message !== "Signup successful") {
                setError(data.message || "Signup failed");
                setSuccess("");
                return;
            }

            setSuccess("Account created! Please login.");
            setError("");

            // auto switch to login
            setTimeout(() => {
                setPage("login");
            }, 1000);

        } catch (err) {
            setError("Server error. Try again.");
            console.log("Setting users error", err.message);
        }
    };

    return (
        <div className="p-4 border rounded flex flex-col justify-center items-center gap-5">
            <h2 className="text-2xl font-bold">Signup</h2>

            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}

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
                className="bg-blue-500 text-white p-2 w-full rounded-lg cursor-pointer"
                onClick={handleSignup}
            >
                Signup
            </button>
        </div>
    );
}

export default Signup;