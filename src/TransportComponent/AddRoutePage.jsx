import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddRoutePage.css";

const AddRoutePage = () => {
  const [name, setName] = useState("");
  const [total, setTotal] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const addRoute = async () => {
    if (!name.trim() || !total) {
      alert("Please enter route name and total passengers.");
      return;
    }

    try {
      setLoading(true);

      await fetch(
        "http://localhost/kkblossom/api.php/Adminapi/AdminTransport/insertRoute",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            total,
          }),
        }
      );

      navigate("/dashboard/TransportComponent/RoutesPages");
    } catch (error) {
      console.error("Error adding route:", error);
      alert("Something went wrong while adding the route.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-route-page">

      {/* ================= HEADER ================= */}
      <div className="add-route-header">

        <div className="add-route-header-left">

          <div className="add-route-main-icon">
            <i className="las la-bus"></i>
          </div>

          <div>
            <span className="add-route-eyebrow">
              TRANSPORT MANAGEMENT
            </span>

            <h1>Add New Route</h1>

            <p>
              Create a new school transportation route
            </p>
          </div>

        </div>

        <button
          type="button"
          className="add-route-back-btn"
          onClick={() =>
            navigate("/dashboard/TransportComponent/RoutesPages")
          }
        >
          <i className="las la-arrow-left"></i>
          Back to Routes
        </button>

      </div>


      {/* ================= MAIN CONTENT ================= */}
      <div className="add-route-content">

        {/* LEFT INFORMATION CARD */}
        <div className="route-information-card">

          <div className="route-info-top">

            <div className="route-info-large-icon">
              <i className="las la-route"></i>
            </div>

            <span>NEW TRANSPORT ROUTE</span>

            <h2>
              Set Up Your Route
            </h2>

            <p>
              Add the basic details of the school transport
              route. These details will be available in your
              transport management system.
            </p>

          </div>


          <div className="route-info-divider"></div>


          <div className="route-info-list">

            <div className="route-info-item">

              <div className="route-info-item-icon">
                <i className="las la-map-marker"></i>
              </div>

              <div>
                <strong>Route Name</strong>
                <span>
                  Give your route a clear and recognizable name.
                </span>
              </div>

            </div>


            <div className="route-info-item">

              <div className="route-info-item-icon">
                <i className="las la-users"></i>
              </div>

              <div>
                <strong>Passenger Count</strong>
                <span>
                  Specify the total passengers assigned to this route.
                </span>
              </div>

            </div>


            <div className="route-info-item">

              <div className="route-info-item-icon">
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


          <div className="route-info-footer">

            <i className="las la-lightbulb"></i>

            <p>
              Tip: Use short and meaningful route names so
              drivers and administrators can identify them easily.
            </p>

          </div>

        </div>


        {/* RIGHT FORM CARD */}
        <div className="add-route-form-card">

          <div className="form-card-header">

            <div>
              <span>ROUTE DETAILS</span>

              <h2>
                Create Route
              </h2>

              <p>
                Enter the information below to create a new route.
              </p>
            </div>

            <div className="form-header-icon">
              <i className="las la-edit"></i>
            </div>

          </div>


          <form
            onSubmit={(e) => {
              e.preventDefault();
              addRoute();
            }}
          >

            {/* Route Name */}
            <div className="route-form-group">

              <label htmlFor="route-name">
                Route Name
                <b>*</b>
              </label>

              <div className="route-input-wrapper">

                <div className="route-input-icon">
                  <i className="las la-road"></i>
                </div>

                <input
                  id="route-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter route name"
                  required
                />

              </div>

              <small>
                Example: Shimla Main Route
              </small>

            </div>


            {/* Total Passengers */}
            <div className="route-form-group">

              <label htmlFor="route-passengers">
                Total Passengers
                <b>*</b>
              </label>

              <div className="route-input-wrapper">

                <div className="route-input-icon">
                  <i className="las la-users"></i>
                </div>

                <input
                  id="route-passengers"
                  type="number"
                  min="0"
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


            {/* Preview */}
            <div className="route-preview">

              <div className="preview-icon">
                <i className="las la-bus"></i>
              </div>

              <div className="preview-content">

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


            {/* Actions */}
            <div className="route-form-actions">

              <button
                type="button"
                className="route-cancel-btn"
                onClick={() =>
                  navigate("/dashboard/TransportComponent/RoutesPages")
                }
              >
                <i className="las la-times"></i>
                Cancel
              </button>


              <button
                type="submit"
                className="route-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="las la-spinner route-spinner"></i>
                    Creating...
                  </>
                ) : (
                  <>
                    <i className="las la-plus"></i>
                    Add Route
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

export default AddRoutePage;