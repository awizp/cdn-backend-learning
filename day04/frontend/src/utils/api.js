const API = "http://localhost:5000";

export const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    });

    const data = await res.json();
    return { res, data };
};