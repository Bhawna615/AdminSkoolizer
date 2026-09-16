import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddStation = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    type: "",
    charges: "",
    routeid: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        // ✅ FIXED API URL
        "http://localhost/kkblossom/api.php/Adminapi/AdminTransport/insertStation",
        form
      );

      if (res.data.status) {
        navigate("/stations", {
          state: { success: "Station Added Successfully" }
        });
      } else {
        alert(res.data.message || "Insert failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div style={containerStyle}>
      <form style={formStyle} onSubmit={handleSubmit}>
        <h2>Add Station</h2>

        <div style={gridStyle}>
          <div>
            <label>Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              style={inputStyle}
              required
            />

            <label>Type</label>
            <input
              name="type"
              value={form.type}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>

          <div>
            <label>Charges</label>
            <input
              name="charges"
              value={form.charges}
              onChange={handleChange}
              style={inputStyle}
              required
            />

            <label>Route ID</label>
            <input
              name="routeid"
              value={form.routeid}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
        </div>

        <button type="submit" style={btnStyle}>
          Add
        </button>
      </form>
    </div>
  );
};

export default AddStation;


// ✅ Styles (FIXED ERROR)
const containerStyle = {
  background: "#f4f4f4",
  minHeight: "100vh",
  padding: "40px"
};

const formStyle = {
  background: "#fff",
  padding: "40px",
  borderRadius: "8px",
  maxWidth: "900px",
  margin: "auto",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "25px"
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  marginBottom: "20px",
  border: "1px solid #ccc",
  borderRadius: "4px"
};

const btnStyle = {
  marginTop: "30px",
  width: "200px",
  padding: "12px",
  background: "#3f51b5",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  fontSize: "16px",
  cursor: "pointer"
};