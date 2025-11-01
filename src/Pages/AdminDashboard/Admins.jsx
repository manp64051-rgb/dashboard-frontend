import React, { useEffect, useState } from "react";
import axios from "axios";

function Admins() {
  const [admins, setAdmins] = useState([]);

  const fetchAdmins = async () => {
    const res = await axios.get("mongodb://localhost:27017/auth-demo/users");
    setAdmins(res.data.filter((u) => u.role === "admin"));
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div>
      <h2>🛡️ Admin List</h2>
      <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "10px" }}>
        <thead>
          <tr>
            <th>Name</th><th>Email</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((a) => (
            <tr key={a._id}>
              <td>{a.name}</td>
              <td>{a.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admins;
