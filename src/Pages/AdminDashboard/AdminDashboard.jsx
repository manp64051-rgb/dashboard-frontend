// import React, { useState } from "react";
// import Home from "../Home";
// import TTS from "../TTS";
// import STT from "../STT";
// // import Users from "./Users";
// // import Admins from "./Admins";
// // import Settings from "./Settings";
// import "./AdminDashboard.css"; // ✅ Add styling file

// function AdminDashboard() {
//   const [activeTab, setActiveTab] = useState("dashboard");

//   const renderContent = () => {
//     switch (activeTab) {
//       case "dashboard":
//         return <h1>📊 Welcome to Admin Dashboard</h1>;
//       case "users":
//         return <h1>👥 Users Management (coming soon)</h1>;
//       case "admins":
//         return <h1>🛡️ Admins Panel (coming soon)</h1>;
//       case "settings":
//         return <h1>⚙️ Settings (coming soon)</h1>;
//       case "home":
//         return <Home />;
//       case "tts":
//         return <TTS />;
//       case "stt":
//         return <STT />;
//       default:
//         return <h1>Admin Dashboard</h1>;
//     }
//   };

//   return (
//     <div className="admin-dashboard">
//       <aside className="sidebar">
//         <h2 className="logo">ChatWeb Admin</h2>
//         <ul>
//           <li className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>Dashboard</li>
//           <li className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>Users</li>
//           <li className={activeTab === "admins" ? "active" : ""} onClick={() => setActiveTab("admins")}>Admins</li>
//           <li className={activeTab === "settings" ? "active" : ""} onClick={() => setActiveTab("settings")}>Settings</li>
//           <li className={activeTab === "home" ? "active" : ""} onClick={() => setActiveTab("home")}>Home</li>
//           <li className={activeTab === "tts" ? "active" : ""} onClick={() => setActiveTab("tts")}>TTS</li>
//           <li className={activeTab === "stt" ? "active" : ""} onClick={() => setActiveTab("stt")}>STT</li>
//         </ul>
//       </aside>

//       <main className="content">{renderContent()}</main>
//     </div>
//   );
// }

// export default AdminDashboard;


import React, { useState, useEffect } from "react";
import Home from "../Home";
import TTS from "../TTS";
import STT from "../STT";
import SpeechTranslate from "../SpeechTranslate";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  // Fetch users from backend
  useEffect(() => {
    if (activeTab === "dashboard") fetchUsers();
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleSave = async () => {
    if (!editingUser) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users/${editingUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUser),
      });
      if (res.ok) {
        fetchUsers();
        setEditingUser(null);
      }
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch(`http://localhost:5000/apie/users/${id}`, { method: "DELETE" });
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const renderDashboard = () => (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <h1>Welcome back, <span>Admin 👋</span></h1>
        <p>Here’s an overview of all users in your system.</p>
      </header>

      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? users.map((user) => (
            <tr key={user._id}>
              <td>
                {editingUser?._id === user._id ? (
                  <input
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  />
                ) : (
                  user.name
                )}
              </td>
              <td>
                {editingUser?._id === user._id ? (
                  <input
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editingUser?._id === user._id ? (
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  user.role
                )}
              </td>
              <td>
                {editingUser?._id === user._id ? (
                  <>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => setEditingUser(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(user)}>Edit</button>
                    <button onClick={() => handleDelete(user._id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          )) : (
            <tr><td colSpan="4">No users found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return renderDashboard();
      case "home": return <Home />;
      case "tts": return <TTS />;
      case "stt": return <STT />;
      case "SpeechTranslate": return <SpeechTranslate />;
      default: return <h1>Welcome to Admin Dashboard</h1>;
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li onClick={() => setActiveTab("dashboard")}>Dashboard</li>
          <li onClick={() => setActiveTab("home")}>Home</li>
          <li onClick={() => setActiveTab("tts")}>TTS</li>
          <li onClick={() => setActiveTab("stt")}>STT</li>
          <li onClick={() => setActiveTab("SpeechTranslate")}>Speech Translate</li>
        </ul>
      </aside>
      <main className="content-area">{renderContent()}</main>
    </div>
  );
}

export default AdminDashboard;






