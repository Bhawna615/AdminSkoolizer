
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./VisitorAdd.css";

const BASE_URL =
  "http://localhost/kkblossom/api.php/Adminapi/AdminVisitors";

const VisitorAdd = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    address: "",
    purpose: "",
    phone: "",
    whom_to_meet: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${BASE_URL}/addVisitor`,
        form,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(res.data);

      if (res.data.status) {
        alert("Visitor Added Successfully ✅");

        navigate("/dashboard/VisitorsComponent/VisitorView");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error while adding visitor");
    }
  };

  return (
    <div className="visitor-add-page">

      <div className="visitor-add-card">

        {/* HEADER */}
        <div className="visitor-add-header">
          <h2>Add New Visitor</h2>
        </div>

        {/* FORM */}
        <form
          className="visitor-add-form"
          onSubmit={handleSubmit}
        >

          <div className="visitor-form-grid">

            {/* NAME */}
            <div className="visitor-form-group">
              <label>Visitor Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter visitor name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* PHONE */}
            <div className="visitor-form-group">
              <label>Phone</label>

              <input
                type="text"
                name="phone"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={handleChange}
                className="visitor-phone-input"
              />
            </div>

            {/* ADDRESS */}
            <div className="visitor-form-group">
              <label>Address</label>

              <input
                type="text"
                name="address"
                placeholder="Enter address"
                value={form.address}
                onChange={handleChange}
              />
            </div>

            {/* PURPOSE */}
            <div className="visitor-form-group">
              <label>Purpose</label>

              <input
                type="text"
                name="purpose"
                placeholder="Enter purpose of visit"
                value={form.purpose}
                onChange={handleChange}
              />
            </div>

            {/* WHOM TO MEET */}
            <div className="visitor-form-group full-width">
              <label>Whom To Meet</label>

              <input
                type="text"
                name="whom_to_meet"
                placeholder="Enter person to meet"
                value={form.whom_to_meet}
                onChange={handleChange}
              />
            </div>

          </div>

          {/* BUTTONS */}
          <div className="visitor-form-actions">

            <button
              type="button"
              className="visitor-cancel-btn"
              onClick={() =>
                navigate(
                  "/dashboard/VisitorsComponent/VisitorView"
                )
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="visitor-submit-btn"
            >
              Add Visitor
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default VisitorAdd;
