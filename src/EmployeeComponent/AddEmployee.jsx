import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddEmployee.css";

const API = "http://localhost/kkblossom/api.php/Adminapi/AdminEmployee/";

export default function AddEmployee() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    post: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    axios
      .post(API + "insert", form)
      .then(() => {
        navigate("/dashboard/EmployeeComponent/ViewEmployee", {
          state: { message: "Employee Added Successfully ✅" }
        });
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to add employee");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="add-employee-page">

      {/* PAGE HEADER */}
      <div className="add-employee-header">

        <div className="add-employee-header-left">

          <div className="add-employee-header-icon">
            <i className="bi bi-person-plus-fill"></i>
          </div>

          <div>
            <h2>Add Employee</h2>
            <p>Add a new employee to the school staff</p>
          </div>

        </div>

        <button
          type="button"
          className="add-employee-back-btn"
          onClick={() =>
            navigate("/dashboard/EmployeeComponent/ViewEmployee")
          }
        >
          <i className="bi bi-arrow-left"></i>
          <span>Back to Employees</span>
        </button>

      </div>

      {/* FORM CARD */}
      <div className="add-employee-card">

        {/* CARD TOP */}
        <div className="add-employee-card-header">

          <div className="add-employee-card-icon">
            <i className="bi bi-person-vcard-fill"></i>
          </div>

          <div>
            <h3>Employee Information</h3>
            <p>Enter the employee's basic details below</p>
          </div>

        </div>

        {/* FORM */}
        <form
          className="add-employee-form"
          onSubmit={handleSubmit}
        >

          {/* NAME */}
          <div className="add-employee-form-group">

            <label htmlFor="employee-name">
              <i className="bi bi-person"></i>
              Employee Name
            </label>

            <div className="add-employee-input-wrapper">

              <i className="bi bi-person-fill"></i>

              <input
                id="employee-name"
                type="text"
                name="name"
                placeholder="Enter employee name"
                value={form.name}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          {/* POST */}
          <div className="add-employee-form-group">

            <label htmlFor="employee-post">
              <i className="bi bi-briefcase"></i>
              Post / Designation
            </label>

            <div className="add-employee-input-wrapper">

              <i className="bi bi-briefcase-fill"></i>

              <input
                id="employee-post"
                type="text"
                name="post"
                placeholder="Enter designation"
                value={form.post}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          {/* BUTTONS */}
          <div className="add-employee-actions">

            <button
              type="button"
              className="add-employee-cancel-btn"
              onClick={() =>
                navigate("/dashboard/EmployeeComponent/ViewEmployee")
              }
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="add-employee-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="add-employee-spinner"></span>
                  Adding...
                </>
              ) : (
                <>
                  <i className="bi bi-person-plus-fill"></i>
                  Add Employee
                </>
              )}
            </button>

          </div>

        </form>

      </div>

      {/* INFORMATION */}
      <div className="add-employee-info">

        <div className="add-employee-info-icon">
          <i className="bi bi-info-circle"></i>
        </div>

        <div>
          <strong>Employee Details</strong>
          <p>
            Make sure the employee name and designation are entered
            correctly before submitting.
          </p>
        </div>

      </div>

    </div>
  );
}