
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddStation.css";

const AddStation = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    type: "",
    charges: "",
    routeid: ""
  });

  const [loading, setLoading] = useState(false);

  const [messageModal, setMessageModal] = useState({
    open: false,
    type: "success",
    title: "",
    text: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const closeMessageModal = () => {
    setMessageModal({
      open: false,
      type: "success",
      title: "",
      text: ""
    });
  };

  const handleMessageContinue = () => {
    closeMessageModal();

    if (messageModal.type === "success") {
      navigate("/dashboard/TransportComponent/stations", {
        state: { success: "Station Added Successfully" }
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Log the data before sending it to the API
      console.log("Form data being sent:", form);
      console.log("JSON being sent:", JSON.stringify(form));

      const res = await axios.post(
        "http://localhost/kkblossom/api.php/Adminapi/AdminTransport/addStation",
        form,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          }
        }
      );

      console.log("Add Station API response:", res.data);

      if (res.data.status) {
        setMessageModal({
          open: true,
          type: "success",
          title: "Station Added Successfully!",
          text: "The new station has been added successfully."
        });
      } else {
        setMessageModal({
          open: true,
          type: "error",
          title: "Unable to Add Station",
          text: res.data.message || "Insert failed. Please try again."
        });
      }
    } catch (err) {
      console.error("Add Station API error:", err);
      console.error("API error response:", err.response?.data);
      console.error("API error status:", err.response?.status);

      setMessageModal({
        open: true,
        type: "error",
        title: "Server Error",
        text:
          err.response?.data?.message ||
          "Unable to connect to the server. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-station-page">

      {/* PAGE HEADER */}
      <div className="add-station-header">

        <div className="add-station-header-left">

          <div className="add-station-main-icon">
            <i className="las la-map-marker"></i>
          </div>

          <div>
            <span className="add-station-eyebrow">
              TRANSPORT MANAGEMENT
            </span>

            <h1>Add Station</h1>

            <p>
              Register a new station for your school transport routes
            </p>
          </div>

        </div>

        <button
          type="button"
          className="add-station-back-btn"
          onClick={() => navigate("/stations")}
        >
          <i className="las la-arrow-left"></i>
          Back to Stations
        </button>

      </div>

      {/* MAIN CONTENT */}
      <div className="add-station-content">

        {/* LEFT INFORMATION CARD */}
        <div className="add-station-information-card">

          <div className="add-station-info-top">

            <div className="add-station-info-icon">
              <i className="las la-route"></i>
            </div>

            <span className="add-station-info-label">
              NEW TRANSPORT STATION
            </span>

            <h2>
              Add Your
              <br />
              Station
            </h2>

            <p>
              Organize your school transport network by adding
              stations, defining station types, and assigning
              charges and route IDs.
            </p>

          </div>

          <div className="add-station-info-divider"></div>

          {/* INFORMATION ITEMS */}
          <div className="add-station-info-list">

            <div className="add-station-info-item">

              <div className="add-station-info-item-icon">
                <i className="las la-map-marker"></i>
              </div>

              <div>
                <strong>Station Details</strong>
                <span>
                  Enter the station name and type.
                </span>
              </div>

            </div>

            <div className="add-station-info-item">

              <div className="add-station-info-item-icon">
                <i className="las la-wallet"></i>
              </div>

              <div>
                <strong>Station Charges</strong>
                <span>
                  Set the applicable transport charges.
                </span>
              </div>

            </div>

            <div className="add-station-info-item">

              <div className="add-station-info-item-icon">
                <i className="las la-road"></i>
              </div>

              <div>
                <strong>Route Assignment</strong>
                <span>
                  Enter the route ID associated with the station.
                </span>
              </div>

            </div>

          </div>

          {/* TIP */}
          <div className="add-station-info-tip">

            <div className="add-station-tip-icon">
              <i className="las la-lightbulb"></i>
            </div>

            <div>
              <strong>Quick Tip</strong>

              <p>
                Verify the station details and route ID before
                submitting the form.
              </p>
            </div>

          </div>

        </div>

        {/* RIGHT FORM CARD */}
        <div className="add-station-form-card">

          {/* FORM HEADER */}
          <div className="add-station-form-header">

            <div>
              <span>STATION DETAILS</span>

              <h2>Station Information</h2>

              <p>
                Enter the details below to register this station.
              </p>
            </div>

            <div className="add-station-form-header-icon">
              <i className="las la-edit"></i>
            </div>

          </div>

          <form onSubmit={handleSubmit}>

            {/* NAME + TYPE */}
            <div className="add-station-form-row">

              <div className="add-station-form-group">

                <label htmlFor="station-name">
                  Station Name <b>*</b>
                </label>

                <div className="add-station-input-wrapper">

                  <div className="add-station-input-icon">
                    <i className="las la-map-marker"></i>
                  </div>

                  <input
                    id="station-name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter station name"
                    required
                  />

                </div>

              </div>

              <div className="add-station-form-group">

                <label htmlFor="station-type">
                  Station Type <b>*</b>
                </label>

                <div className="add-station-input-wrapper">

                  <div className="add-station-input-icon">
                    <i className="las la-tags"></i>
                  </div>

                  <input
                    id="station-type"
                    type="text"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    placeholder="Enter station type"
                    required
                  />

                </div>

              </div>

            </div>

            {/* CHARGES + ROUTE ID */}
            <div className="add-station-form-row">

              <div className="add-station-form-group">

                <label htmlFor="station-charges">
                  Charges <b>*</b>
                </label>

                <div className="add-station-input-wrapper">

                  <div className="add-station-input-icon">
                    <i className="las la-rupee-sign"></i>
                  </div>

                  <input
                    id="station-charges"
                    type="number"
                    name="charges"
                    value={form.charges}
                    onChange={handleChange}
                    placeholder="Enter charges"
                    min="0"
                    required
                  />

                </div>

              </div>

              <div className="add-station-form-group">

                <label htmlFor="station-routeid">
                  Route ID <b>*</b>
                </label>

                <div className="add-station-input-wrapper">

                  <div className="add-station-input-icon">
                    <i className="las la-road"></i>
                  </div>

                  <input
                    id="station-routeid"
                    type="text"
                    name="routeid"
                    value={form.routeid}
                    onChange={handleChange}
                    placeholder="Enter route ID"
                    required
                  />

                </div>

              </div>

            </div>

            {/* STATION PREVIEW */}
            <div className="add-station-preview">

              <div className="add-station-preview-icon">
                <i className="las la-map-marked-alt"></i>
              </div>

              <div className="add-station-preview-content">

                <span>STATION PREVIEW</span>

                <strong>
                  {form.name.trim() || "Station Name"}
                </strong>

                <p>
                  <span>
                    <i className="las la-tags"></i>
                    {form.type || "Station Type"}
                  </span>

                  <span>
                    <i className="las la-rupee-sign"></i>
                    {form.charges !== "" ? form.charges : "Charges"}
                  </span>

                  <span>
                    <i className="las la-road"></i>
                    {form.routeid || "Route ID"}
                  </span>
                </p>

              </div>

            </div>

            {/* BUTTONS */}
            <div className="add-station-form-actions">

              <button
                type="button"
                className="add-station-cancel-btn"
                onClick={() => navigate("/stations")}
              >
                <i className="las la-times"></i>
                Cancel
              </button>

              <button
                type="submit"
                className="add-station-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="las la-spinner add-station-spinner"></i>
                    Adding Station...
                  </>
                ) : (
                  <>
                    <i className="las la-plus"></i>
                    Add Station
                  </>
                )}
              </button>

            </div>

          </form>

        </div>

      </div>

      {/* CUSTOM SUCCESS / ERROR MESSAGE MODAL */}
      {messageModal.open && (
        <div className="add-station-message-overlay">

          <div
            className="add-station-message-box"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-station-message-title"
          >

            <div
              className={`add-station-message-icon ${messageModal.type}`}
            >
              {messageModal.type === "success" ? (
                <i className="las la-check"></i>
              ) : (
                <i className="las la-exclamation"></i>
              )}
            </div>

            <h2 id="add-station-message-title">
              {messageModal.title}
            </h2>

            <p>{messageModal.text}</p>

            <div className="add-station-message-actions">

              <button
                type="button"
                className="add-station-message-btn"
                onClick={
                  messageModal.type === "success"
                    ? handleMessageContinue
                    : closeMessageModal
                }
              >
                {messageModal.type === "success" ? "Continue" : "OK"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default AddStation;
