import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";
import "./AdminDashboard.css";

export default function Customers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = () => {
    axios.get("http://localhost:5000/api/admin/customers")
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching customers:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios.delete(`http://localhost:5000/api/admin/customers/${id}`)
        .then(() => fetchUsers())
        .catch(err => console.error(err));
    }
  };

  const startEdit = (user) => setEditingUser(user);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/api/admin/customers/${editingUser.id}`, editingUser)
      .then(() => {
        setEditingUser(null);
        fetchUsers();
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar />

      <main className="main-content customers-main">
        <h1 className="page-title">Registered Customers</h1>

        {loading ? (
          <p>Loading customers...</p>
        ) : users.length === 0 ? (
          <p>No users found</p>
        ) : (
          <table className="customers-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Number</th>
                <th>Registered At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.number}</td>
                  <td>{user.created_at ? new Date(user.created_at).toLocaleString() : "N/A"}</td>
                  <td>
                    <button onClick={() => startEdit(user)} className="btn btn-edit">Edit</button>
                    <button onClick={() => deleteUser(user.id)} className="btn btn-delete">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Edit Form */}
        {editingUser && (
          <div className="edit-user-form">
            <h2>Edit User</h2>
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                value={editingUser.name}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                placeholder="Name"
                required
                className="input-text"
              />
              <input
                type="email"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                placeholder="Email"
                required
                className="input-text"
              />
              <input
                type="text"
                value={editingUser.number}
                onChange={(e) => setEditingUser({ ...editingUser, number: e.target.value })}
                placeholder="Number"
                required
                className="input-text"
              />
              <div className="form-buttons">
                <button type="submit" className="btn btn-submit">Update</button>
                <button type="button" onClick={() => setEditingUser(null)} className="btn btn-cancel">Cancel</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}