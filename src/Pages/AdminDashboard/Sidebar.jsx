import React from "react";

function Sidebar({ setActiveTab }) {
  return (
    <div className="sidebar">
      <ul>
        <li onClick={() => setActiveTab("dashboard")}>Dashboard</li>
        <li onClick={() => setActiveTab("users")}>Users</li>
        <li onClick={() => setActiveTab("admins")}>Admins</li>
        <li onClick={() => setActiveTab("settings")}>Settings</li>
      </ul>
    </div>
  );
}

export default Sidebar;
