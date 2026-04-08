import { useEffect, useState } from "react";

const API = "http://localhost:5000/items";

export default function App() {

  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);

  // get method
  const loadItems = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    const loadItems = async () => {
      const res = await fetch(API);
      const data = await res.json();
      setItems(data);
    };
    loadItems();
  }, []);

  // update method
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input) return;

    if (editId) {
      await fetch(`${API}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: input }),
      });
      setEditId(null);
    } else {
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: input }),
      });
    }

    setInput("");
    loadItems();
  };

  // edit method
  const handleEdit = (item) => {
    setInput(item.name);
    setEditId(item.id);
  };

  // delete method
  const handleDelete = async (id) => {
    if (confirm("Are you sure want to delete?")) {
      await fetch(`${API}/${id}`, { method: "DELETE" });
      loadItems();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-md">

        <h1 className="text-xl font-bold mb-4 text-center">
          Express backend with crud operation
        </h1>

        {/* form */}
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <input
            className="border p-2 flex-1 rounded"
            placeholder="Enter name"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="bg-blue-500 text-white px-4 rounded cursor-pointer">
            {editId ? "Update" : "Add"}
          </button>
        </form>

        {/* list items */}
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center bg-gray-50 p-2 rounded"
            >
              <span>{item.name}</span>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-500 cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}