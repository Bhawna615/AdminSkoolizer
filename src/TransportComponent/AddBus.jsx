import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddBus.css";

const AddBus = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    model: "",
    regno: "",
    seats: "",
    capacity: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost/kkblossom/api.php/Adminapi/AdminTransport/insertBus",
        form
      );

      if (res.data.status) {
        navigate("/dashboard/TransportComponent/BussesPage", {
          state: { success: "Bus Added Successfully" },
        });
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error("Error adding bus:", err);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-bus-page">
      {/* ================= HEADER ================= */}
      <div className="add-bus-header">
        <div className="add-bus-header-left">
          <div className="add-bus-main-icon">
            <i className="las la-bus"></i>
          </div>

          <div>
            <span className="add-bus-eyebrow">
              TRANSPORT MANAGEMENT
            </span>

            <h1>Add New Bus</h1>

            <p>
              Register a new vehicle in your school transport fleet
            </p>
          </div>
        </div>

        <button
          type="button"
          className="add-bus-back-btn"
          onClick={() =>
            navigate("/dashboard/TransportComponent/BussesPage")
          }
        >
          <i className="las la-arrow-left"></i>
          Back to Buses
        </button>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="add-bus-content">
        {/* ================= LEFT INFORMATION ================= */}
        <div className="bus-information-card">
          <div className="bus-info-content">
            <div className="bus-info-icon">
              <i className="las la-bus"></i>
            </div>

            <span className="bus-info-label">
              NEW FLEET VEHICLE
            </span>

            <h2>
              Register Your
              <br />
              School Bus
            </h2>

            <p>
              Add the essential details of your school bus to
              keep your transportation fleet organized and
              up to date.
            </p>
          </div>

          <div className="bus-info-divider"></div>

          {/* Information Items */}
          <div className="bus-info-list">
            <div className="bus-info-item">
              <div className="bus-info-item-icon">
                <i className="las la-id-card"></i>
              </div>

              <div>
                <strong>Vehicle Identity</strong>
                <span>
                  Add the bus name, model and registration number.
                </span>
              </div>
            </div>

            <div className="bus-info-item">
              <div className="bus-info-item-icon">
                <i className="las la-users"></i>
              </div>

              <div>
                <strong>Passenger Capacity</strong>
                <span>
                  Specify the number of seats available in the bus.
                </span>
              </div>
            </div>

            <div className="bus-info-item">
              <div className="bus-info-item-icon">
                <i className="las la-gas-pump"></i>
              </div>

              <div>
                <strong>Fuel Capacity</strong>
                <span>
                  Enter the maximum fuel tank capacity in litres.
                </span>
              </div>
            </div>
          </div>

          {/* Tip */}
          <div className="bus-info-tip">
            <div className="tip-icon">
              <i className="las la-lightbulb"></i>
            </div>

            <div>
              <strong>Quick Tip</strong>

              <p>
                Make sure the registration number matches
                the official vehicle documents.
              </p>
            </div>
          </div>
        </div>

        {/* ================= FORM CARD ================= */}
        <div className="add-bus-form-card">
          <div className="add-bus-form-header">
            <div>
              <span>VEHICLE DETAILS</span>

              <h2>Bus Information</h2>

              <p>
                Enter the details below to register this vehicle.
              </p>
            </div>

            <div className="form-header-icon">
              <i className="las la-edit"></i>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* ================= BUS NAME ================= */}
            <div className="bus-form-group">
              <label htmlFor="bus-name">
                Bus Name
                <b>*</b>
              </label>

              <div className="bus-input-wrapper">
                <div className="bus-input-icon">
                  <i className="las la-bus"></i>
                </div>

                <input
                  id="bus-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter bus name"
                  required
                />
              </div>

              <small>
                Example: School Bus 01
              </small>
            </div>

            {/* ================= MODEL + REGISTRATION ================= */}
            <div className="bus-form-row">
              <div className="bus-form-group">
                <label htmlFor="bus-model">
                  Bus Model
                  <b>*</b>
                </label>

                <div className="bus-input-wrapper">
                  <div className="bus-input-icon">
                    <i className="las la-car"></i>
                  </div>

                  <input
                    id="bus-model"
                    type="text"
                    name="model"
                    value={form.model}
                    onChange={handleChange}
                    placeholder="Enter model"
                    required
                  />
                </div>
              </div>

              <div className="bus-form-group">
                <label htmlFor="bus-regno">
                  Registration No.
                  <b>*</b>
                </label>

                <div className="bus-input-wrapper">
                  <div className="bus-input-icon">
                    <i className="las la-id-card"></i>
                  </div>

                  <input
                    id="bus-regno"
                    type="text"
                    name="regno"
                    value={form.regno}
                    onChange={handleChange}
                    placeholder="Enter registration no."
                    required
                  />
                </div>
              </div>
            </div>

            {/* ================= SEATS + FUEL ================= */}
            <div className="bus-form-row">
              <div className="bus-form-group">
                <label htmlFor="bus-seats">
                  Number of Seats
                  <b>*</b>
                </label>

                <div className="bus-input-wrapper">
                  <div className="bus-input-icon">
                    <i className="las la-users"></i>
                  </div>

                  <input
                    id="bus-seats"
                    type="number"
                    name="seats"
                    min="0"
                    value={form.seats}
                    onChange={handleChange}
                    placeholder="Enter seats"
                    required
                  />
                </div>

                <small>
                  Total passenger seating capacity
                </small>
              </div>

              <div className="bus-form-group">
                <label htmlFor="bus-capacity">
                  Fuel Tank Capacity
                  <b>*</b>
                </label>

                <div className="bus-input-wrapper">
                  <div className="bus-input-icon">
                    <i className="las la-gas-pump"></i>
                  </div>

                  <input
                    id="bus-capacity"
                    type="number"
                    name="capacity"
                    min="0"
                    value={form.capacity}
                    onChange={handleChange}
                    placeholder="Enter capacity"
                    required
                  />
                </div>

                <small>
                  Enter capacity in litres
                </small>
              </div>
            </div>

            {/* ================= PREVIEW ================= */}
            <div className="bus-preview">
              <div className="bus-preview-icon">
                <i className="las la-bus"></i>
              </div>

              <div className="bus-preview-content">
                <span>VEHICLE PREVIEW</span>

                <strong>
                  {form.name.trim() || "Your Bus Name"}
                </strong>

                <p>
                  <span>
                    <i className="las la-car"></i>
                    {form.model || "Model"}
                  </span>

                  <span>
                    <i className="las la-users"></i>
                    {form.seats || "0"} seats
                  </span>

                  <span>
                    <i className="las la-gas-pump"></i>
                    {form.capacity || "0"} L
                  </span>
                </p>
              </div>
            </div>

            {/* ================= ACTIONS ================= */}
            <div className="add-bus-actions">
              <button
                type="button"
                className="bus-cancel-btn"
                onClick={() =>
                  navigate(
                    "/dashboard/TransportComponent/BussesPage"
                  )
                }
              >
                <i className="las la-times"></i>
                Cancel
              </button>

              <button
                type="submit"
                className="bus-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="las la-spinner bus-spinner"></i>
                    Adding Bus...
                  </>
                ) : (
                  <>
                    <i className="las la-plus"></i>
                    Add Bus
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBus;