import { useState, useEffect } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login");

  useEffect(() => {
    const fetchUsers = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    fetchUsers();
  }, []);

  if (user) {
    return <Dashboard user={user} setUser={setUser} />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {page === "login" ? (
        <div className="flex flex-col justify-center items-center gap-5">
          <Login setUser={setUser} />
          <button
            onClick={() => setPage("signup")}
            className="text-blue-500 cursor-pointer"
          >
            Go to Signup
          </button>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center gap-5">
          <Signup setPage={setPage} />
          <button
            onClick={() => setPage("login")}
            className="text-blue-500 cursor-pointer"
          >
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
}

export default App;