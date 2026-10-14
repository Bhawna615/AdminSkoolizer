
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddRoutePage.css";

const AddRoutePage = () => {
  const [name, setName] = useState("");
  const [total, setTotal] = useState("");
  const [loading, setLoading] = useState(false);

  const [showMessageBox, setShowMessageBox] = useState(false);
  const [messageType, setMessageType] = useState("confirm");
  const [messageText, setMessageText] = useState("");

  const navigate = useNavigate();

  const routesPagePath = "/dashboard/TransportComponent/RoutesPages";

  const addRoute = () => {
    if (!name.trim() || total === "" || Number(total) < 0) {
      setMessageType("error");
      setMessageText(
        "Please enter a valid route name and total passengers."
      );
      setShowMessageBox(true);
      return;
    }

    setMessageType("confirm");
    setMessageText(
      `Are you sure you want to create the route "${name.trim()}" with ${total} passengers?`
    );
    setShowMessageBox(true);
  };

  const confirmAddRoute = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost/kkblossom/api.php/Adminapi/AdminTransport/insertRoute",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            total,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create route.");
      }

      setMessageType("success");
      setMessageText(
        "The new transport route has been created successfully."
      );
    } catch (error) {
      console.error("Error adding route:", error);

      setMessageType("error");
      setMessageText("Something went wrong while adding the route.");
    } finally {
      setLoading(false);
    }
  };

  const closeMessageBox = () => {
    if (loading) return;

    if (messageType === "success") {
      setShowMessageBox(false);
      navigate(routesPagePath);
      return;
    }

    setShowMessageBox(false);
  };

  return (
    <div className="arp-page">
      {/* HEADER */}
      <div className="arp-header">
        <div className="arp-header-left">
          <div className="arp-main-icon">
            <i className="las la-bus"></i>
          </div>

          <div className="arp-header-text">
            <span className="arp-eyebrow">
              TRANSPORT MANAGEMENT
            </span>

            <h1>Add New Route</h1>

            <p>Create a new school transportation route</p>
          </div>
        </div>

        <button
          type="button"
          className="arp-back-btn"
          onClick={() => navigate(routesPagePath)}
        >
          <i className="las la-arrow-left"></i>
          Back to Routes
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="arp-content">
        {/* INFORMATION CARD */}
        <div className="arp-information-card">
          <div className="arp-info-top">
            <div className="arp-info-large-icon">
              <i className="las la-route"></i>
            </div>

            <span>NEW TRANSPORT ROUTE</span>

            <h2>Set Up Your Route</h2>

            <p>
              Add the basic details of the school transport
              route. These details will be available in your
              transport management system.
            </p>
          </div>

          <div className="arp-info-divider"></div>

          <div className="arp-info-list">
            <div className="arp-info-item">
              <div className="arp-info-item-icon">
                <i className="las la-map-marker"></i>
              </div>

              <div>
                <strong>Route Name</strong>
                <span>
                  Give your route a clear and recognizable name.
                </span>
              </div>
            </div>

            <div className="arp-info-item">
              <div className="arp-info-item-icon">
                <i className="las la-users"></i>
              </div>

              <div>
                <strong>Passenger Count</strong>
                <span>
                  Specify the total passengers assigned to this route.
                </span>
              </div>
            </div>

            <div className="arp-info-item">
              <div className="arp-info-item-icon">
                <i className="las la-check-circle"></i>
              </div>

              <div>
                <strong>Ready to Manage</strong>
                <span>
                  Once created, the route will appear in your route directory.
                </span>
              </div>
            </div>
          </div>

          <div className="arp-info-footer">
            <i className="las la-lightbulb"></i>

            <p>
              Tip: Use short and meaningful route names so
              drivers and administrators can identify them easily.
            </p>
          </div>
        </div>

        {/* FORM CARD */}
        <div className="arp-form-card">
          <div className="arp-form-card-header">
            <div>
              <span>ROUTE DETAILS</span>

              <h2>Create Route</h2>

              <p>
                Enter the information below to create a new route.
              </p>
            </div>

            <div className="arp-form-header-icon">
              <i className="las la-edit"></i>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              addRoute();
            }}
          >
            {/* ROUTE NAME */}
            <div className="arp-form-group">
              <label htmlFor="arp-route-name">
                Route Name <b>*</b>
              </label>

              <div className="arp-input-wrapper">
                <div className="arp-input-icon">
                  <i className="las la-road"></i>
                </div>

                <input
                  id="arp-route-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter route name"
                  required
                />
              </div>

              <small>Example: Shimla Main Route</small>
            </div>

            {/* TOTAL PASSENGERS */}
            <div className="arp-form-group">
              <label htmlFor="arp-route-passengers">
                Total Passengers <b>*</b>
              </label>

              <div className="arp-input-wrapper">
                <div className="arp-input-icon">
                  <i className="las la-users"></i>
                </div>

                <input
                  id="arp-route-passengers"
                  type="number"
                  min="0"
                  step="1"
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                  placeholder="Enter total passengers"
                  required
                />
              </div>

              <small>
                Enter the number of passengers assigned to this route.
              </small>
            </div>

            {/* ROUTE PREVIEW */}
            <div className="arp-preview">
              <div className="arp-preview-icon">
                <i className="las la-bus"></i>
              </div>

              <div className="arp-preview-content">
                <span>ROUTE PREVIEW</span>

                <strong>
                  {name.trim() || "Your Route Name"}
                </strong>

                <p>
                  <i className="las la-users"></i>
                  {total || "0"} passengers
                </p>
              </div>
            </div>

            {/* FORM ACTIONS */}
            <div className="arp-form-actions">
              <button
                type="button"
                className="arp-cancel-btn"
                onClick={() => navigate(routesPagePath)}
              >
                <i className="las la-times"></i>
                Cancel
              </button>

              <button
                type="submit"
                className="arp-submit-btn"
                disabled={loading}
              >
                <i className="las la-plus"></i>
                Add Route
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* CUSTOM CONFIRMATION / STATUS MODAL */}
      {showMessageBox && (
        <div
          className="arp-modal-overlay"
          onClick={closeMessageBox}
        >
          <div
            className={`arp-modal arp-modal-${messageType}`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="arp-modal-title"
          >
            <div className="arp-modal-icon">
              <i
                className={
                  messageType === "confirm"
                    ? "las la-question-circle"
                    : messageType === "success"
                    ? "las la-check-circle"
                    : "las la-exclamation-circle"
                }
              ></i>
            </div>

            <h2 id="arp-modal-title">
              {messageType === "confirm"
                ? "Confirm Route"
                : messageType === "success"
                ? "Route Created Successfully"
                : "Unable to Add Route"}
            </h2>

            <p>{messageText}</p>

            <div className="arp-modal-actions">
              {messageType === "confirm" ? (
                <>
                  <button
                    type="button"
                    className="arp-modal-cancel"
                    onClick={closeMessageBox}
                    disabled={loading}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="arp-modal-confirm-btn"
                    onClick={confirmAddRoute}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="arp-modal-spinner"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="las la-plus"></i>
                        Confirm Add
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="arp-modal-confirm"
                  onClick={closeMessageBox}
                  disabled={loading}
                >
                  {messageType === "success" ? "Done" : "OK"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddRoutePage;
