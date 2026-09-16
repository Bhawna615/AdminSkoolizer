import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RoutesPage.css";

const RoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchRoutes = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost/kkblossom/api.php/Adminapi/AdminTransport/routes"
      );

      const data = await res.json();
      setRoutes(data.data || []);
    } catch (error) {
      console.error("Error fetching routes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  // Toggle menu
  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Delete route
  const deleteRoute = async (id) => {
    if (!window.confirm("Are you sure you want to delete this route?")) {
      return;
    }

    try {
      await fetch(
        `http://localhost/kkblossom/api.php/Adminapi/AdminTransport/deleteRoute/${id}`
      );

      setRoutes((prevRoutes) =>
        prevRoutes.filter((r) => r.id !== id)
      );

      setOpenMenuId(null);
    } catch (error) {
      console.error("Error deleting route:", error);
    }
  };

  return (
    <div className="routes-page">

      {/* ================= HEADER ================= */}
      <div className="routes-header">

        <div className="routes-header-left">

          <div className="routes-main-icon">
            <i className="las la-bus"></i>
          </div>

          <div>
            <span className="routes-eyebrow">
              TRANSPORT MANAGEMENT
            </span>

            <h1>Transport Routes</h1>

            <p>
              Manage and monitor all school transportation routes
            </p>
          </div>

        </div>

        <button
          className="add-route-header-btn"
          onClick={() =>
            navigate("/dashboard/TransportComponent/add-route")
          }
        >
          <i className="las la-plus"></i>
          Add New Route
        </button>

      </div>

      {/* ================= SUMMARY ================= */}
      <div className="routes-summary">

        <div className="route-summary-card">

          <div className="route-summary-icon">
            <i className="las la-route"></i>
          </div>

          <div className="route-summary-content">
            <span>TOTAL ROUTES</span>
            <strong>{routes.length}</strong>
            <small>Registered routes</small>
          </div>

          <div className="summary-watermark">
            <i className="las la-road"></i>
          </div>

        </div>


        <div className="route-summary-card">

          <div className="route-summary-icon passengers-icon">
            <i className="las la-users"></i>
          </div>

          <div className="route-summary-content">
            <span>TOTAL PASSENGERS</span>

            <strong>
              {routes.reduce(
                (total, route) =>
                  total + Number(route.Totalpassengers || 0),
                0
              )}
            </strong>

            <small>Across all routes</small>
          </div>

          <div className="summary-watermark">
            <i className="las la-user-friends"></i>
          </div>

        </div>


        <div className="route-info-card">

          <div className="route-info-icon">
            <i className="las la-info-circle"></i>
          </div>

          <div>
            <strong>Transport Network</strong>
            <p>
              All registered school routes are managed from
              this section.
            </p>
          </div>

        </div>

      </div>


      {/* ================= SECTION HEADER ================= */}
      <div className="routes-section-header">

        <div>
          <span className="routes-section-label">
            ROUTE DIRECTORY
          </span>

          <h2>All Transport Routes</h2>

          <p>
            View passenger information and manage your routes.
          </p>
        </div>

        <div className="route-count-badge">
          <i className="las la-route"></i>
          {routes.length} Routes
        </div>

      </div>


      {/* ================= LOADING ================= */}
      {loading ? (

        <div className="routes-empty-state">

          <div className="empty-route-icon loading-icon">
            <i className="las la-spinner"></i>
          </div>

          <h2>Loading Routes...</h2>

          <p>
            Please wait while transport routes are being loaded.
          </p>

        </div>

      ) : routes.length === 0 ? (

        /* ================= EMPTY STATE ================= */
        <div className="routes-empty-state">

          <div className="empty-route-icon">
            <i className="las la-bus"></i>
          </div>

          <h2>No Routes Available</h2>

          <p>
            There are currently no transport routes registered
            in the system.
          </p>

          <button
            className="empty-add-route-btn"
            onClick={() =>
              navigate("/dashboard/TransportComponent/add-route")
            }
          >
            <i className="las la-plus"></i>
            Create First Route
          </button>

        </div>

      ) : (

        /* ================= ROUTE GRID ================= */
        <div className="routes-grid">

          {routes.map((r, index) => (

            <div
              className="route-card"
              key={r.id}
            >

              {/* Purple top section */}
              <div className="route-card-top">

                <div className="route-number-box">
                  <span>ROUTE</span>
                  <strong>
                    {String(index + 1).padStart(2, "0")}
                  </strong>
                </div>

                <div className="route-menu-wrapper">

                  <button
                    className="route-menu-btn"
                    onClick={() => toggleMenu(r.id)}
                    type="button"
                  >
                    <i className="las la-ellipsis-v"></i>
                  </button>

                  {openMenuId === r.id && (

                    <div className="route-dropdown">

                      <button
                        type="button"
                        className="delete-route-btn"
                        onClick={() => deleteRoute(r.id)}
                      >
                        <i className="las la-trash-alt"></i>
                        Delete Route
                      </button>

                    </div>

                  )}

                </div>

              </div>


              {/* Route body */}
              <div className="route-card-body">

                <div className="route-title-row">

                  <div className="route-bus-icon">
                    <i className="las la-bus"></i>
                  </div>

                  <div className="route-title-content">

                    <span>ROUTE NAME</span>

                    <h3>
                      {r.routename}
                    </h3>

                  </div>

                </div>


                {/* Route details */}
                <div className="route-details">

                  <div className="route-detail">

                    <div className="route-detail-icon">
                      <i className="las la-fingerprint"></i>
                    </div>

                    <div>
                      <span>Route ID</span>
                      <strong>#{r.id}</strong>
                    </div>

                  </div>


                  <div className="route-detail">

                    <div className="route-detail-icon">
                      <i className="las la-users"></i>
                    </div>

                    <div>
                      <span>Passengers</span>
                      <strong>
                        {r.Totalpassengers || 0}
                      </strong>
                    </div>

                  </div>

                </div>


                {/* Passenger indicator */}
                <div className="passenger-section">

                  <div className="passenger-header">

                    <span>Passenger Capacity</span>

                    <strong>
                      {r.Totalpassengers || 0}
                    </strong>

                  </div>

                  <div className="passenger-line">
                    <div
                      className="passenger-progress"
                      style={{
                        width: `${Math.min(
                          Number(r.Totalpassengers || 0),
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>

                </div>

              </div>


              {/* Card footer */}
              <div className="route-card-footer">

                <span>
                  Transport Route
                </span>

                <div className="route-status">
                  <span></span>
                  Registered
                </div>

              </div>

            </div>

          ))}

        </div>

      )}


      {/* ================= FLOATING ADD BUTTON ================= */}
      <button
        className="floating-add-route"
        onClick={() =>
          navigate("/dashboard/TransportComponent/add-route")
        }
        title="Add Route"
      >
        <i className="las la-plus"></i>
      </button>

    </div>
  );
};

export default RoutesPage;