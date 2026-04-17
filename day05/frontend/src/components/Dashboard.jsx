function Dashboard({ user, setUser }) {

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <div className="flex flex-col items-center justify-center gap-5 h-screen">
            <h1 className="text-xl font-bold capitalize">
                Welcome, {user.username} 👋
            </h1>

            <p className="text-gray-600 text-xs font-semibold">
                User ID: {user._id}
            </p>

            <button
                className="mt-4 bg-red-500 text-white p-2 rounded-lg cursor-pointer"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    );
}

export default Dashboard;