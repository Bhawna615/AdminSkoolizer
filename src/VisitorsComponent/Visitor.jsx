import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost/kkblossom/api.php/Adminapi/AdminVisitors";

const Visitor = () => {
  const [visitors, setVisitors] = useState([]);
  const [form, setForm] = useState({
    name: "",
    address: "",
    purpose: "",
    phone: ""
  });

  // ✅ Fetch Visitors
  const fetchVisitors = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getVisitors`);
      setVisitors(res.data);
    } catch (err) {
      console.error("Error fetching visitors:", err);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  // ✅ Handle Input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Add Visitor
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/addVisitor`, form);
      alert("Visitor Added Successfully");
      setForm({ name: "", address: "", purpose: "", phone: "" });
      fetchVisitors();
    } catch (err) {
      console.error(err);
      alert("Error adding visitor");
    }
  };

  // ✅ Delete Visitor
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this visitor?")) return;

    try {
      await axios.delete(`${BASE_URL}/deleteVisitor/${id}`);
      fetchVisitors();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>Visitor Log Book</h2>

      {/* ✅ Add Form */}
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="purpose"
          placeholder="Purpose"
          value={form.purpose}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Visitor</button>
      </form>

      {/* ✅ Table */}
      <table border="1" width="100%" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Purpose</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {visitors.map((v) => (
            <tr key={v.id}>
              <td>{v.name}</td>
              <td>{v.address}</td>
              <td>{v.purpose}</td>
              <td>{v.phone}</td>
              <td>
                <button onClick={() => handleDelete(v.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Visitor;