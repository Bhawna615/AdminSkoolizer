import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./BusesPage.css";

const BusesPage = () => {
  const [buses, setBuses] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const [message, setMessage] = useState(location.state?.success || "");

  // Fetch buses
  const fetchBuses = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost/kkblossom/api.php/Adminapi/AdminTransport/buses"
      );

      const data = await res.json();

      setBuses(data.data || []);
    } catch (error) {
      console.error("Error fetching buses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  // Toggle dropdown
  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Delete bus
  const deleteBus = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this bus?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost/kkblossom/api.php/Adminapi/AdminTransport/deleteBus/${id}`
      );

      const data = await res.json();

      if (data.status) {
        setBuses((prev) => prev.filter((b) => b.id !== id));
        setOpenMenuId(null);
        setMessage("Bus deleted successfully.");

        setTimeout(() => {
          setMessage("");
        }, 3000);
      } else {
        alert("Failed to delete bus.");
      }
    } catch (error) {
      console.error("Error deleting bus:", error);
      alert("Something went wrong while deleting the bus.");
    }
  };

  // Clear success message
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        window.history.replaceState({}, document.title);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  // Calculate total seats
  const totalSeats = buses.reduce(
    (sum, bus) => sum + Number(bus.seats || 0),
    0
  );

  // Calculate total fuel capacity
  const totalFuelCapacity = buses.reduce(
    (sum, bus) => sum + Number(bus.fueltankcapacity || 0),
    0
  );

  return (
    <div className="buses-page">
      {/* ================= HEADER ================= */}
      <div className="buses-header">
        <div className="buses-header-left">
          <div className="buses-main-icon">
            <i className="las la-bus"></i>
          </div>

          <div>
            <span className="buses-eyebrow">
              TRANSPORT MANAGEMENT
            </span>

            <h1>School Buses</h1>

            <p>
              Manage your school's transportation fleet
            </p>
          </div>
        </div>

        <button
          className="buses-add-header-btn"
          onClick={() =>
            navigate("/dashboard/TransportComponent/add-bus")
          }
        >
          <i className="las la-plus"></i>
          Add New Bus
        </button>
      </div>

      {/* ================= SUCCESS MESSAGE ================= */}
      {message && (
        <div className="bus-success-message">
          <div className="success-message-icon">
            <i className="las la-check"></i>
          </div>

          <div>
            <strong>Success</strong>
            <span>{message}</span>
          </div>

          <button onClick={() => setMessage("")}>
            <i className="las la-times"></i>
          </button>
        </div>
      )}

      {/* ================= STATISTICS ================= */}
      <div className="bus-stat-grid">
        <div className="bus-stat-card">
          <div className="bus-stat-icon purple">
            <i className="las la-bus"></i>
          </div>

          <div className="bus-stat-content">
            <span>Total Buses</span>
            <strong>{buses.length}</strong>
            <small>
              <i className="las la-check-circle"></i>
              Fleet registered
            </small>
          </div>
        </div>

        <div className="bus-stat-card">
          <div className="bus-stat-icon blue">
            <i className="las la-users"></i>
          </div>

          <div className="bus-stat-content">
            <span>Total Seats</span>
            <strong>{totalSeats}</strong>
            <small>
              <i className="las la-chair"></i>
              Available capacity
            </small>
          </div>
        </div>

        <div className="bus-stat-card">
          <div className="bus-stat-icon green">
            <i className="las la-gas-pump"></i>
          </div>

          <div className="bus-stat-content">
            <span>Fuel Capacity</span>
            <strong>{totalFuelCapacity} L</strong>
            <small>
              <i className="las la-tint"></i>
              Combined capacity
            </small>
          </div>
        </div>

        <div className="bus-stat-card">
          <div className="bus-stat-icon orange">
            <i className="las la-route"></i>
          </div>

          <div className="bus-stat-content">
            <span>Fleet Status</span>
            <strong>Active</strong>
            <small>
              <i className="las la-circle"></i>
              Transport network
            </small>
          </div>
        </div>
      </div>

      {/* ================= MAIN CARD ================= */}
      <div className="buses-main-card">
        <div className="buses-card-header">
          <div>
            <span className="section-label">
              TRANSPORT FLEET
            </span>

            <h2>Bus Directory</h2>

            <p>
              View and manage all registered school buses.
            </p>
          </div>

          <div className="fleet-count">
            <i className="las la-bus"></i>
            {buses.length} {buses.length === 1 ? "Bus" : "Buses"}
          </div>
        </div>

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="bus-loading">
            <div className="bus-loader">
              <i className="las la-spinner"></i>
            </div>

            <p>Loading buses...</p>
          </div>
        )}

        {/* ================= EMPTY STATE ================= */}
        {!loading && buses.length === 0 && (
          <div className="bus-empty-state">
            <div className="empty-bus-icon">
              <i className="las la-bus"></i>
            </div>

            <h3>No Buses Added Yet</h3>

            <p>
              Your transport fleet is currently empty.
              Add your first school bus to get started.
            </p>

            <button
              onClick={() =>
                navigate("/dashboard/TransportComponent/add-bus")
              }
            >
              <i className="las la-plus"></i>
              Add Your First Bus
            </button>
          </div>
        )}

        {/* ================= BUS GRID ================= */}
        {!loading && buses.length > 0 && (
          <div className="bus-grid">
            {buses.map((b, index) => (
              <div className="bus-card" key={b.id}>
                {/* Card Top */}
                <div className="bus-card-top">
                  <div className="bus-number">
                    BUS {String(index + 1).padStart(2, "0")}
                  </div>

                  <button
                    className="bus-menu-btn"
                    onClick={() => toggleMenu(b.id)}
                    aria-label="Bus options"
                  >
                    <i className="las la-ellipsis-v"></i>
                  </button>

                  {/* Dropdown */}
                  {openMenuId === b.id && (
                    <div className="bus-dropdown">
                      <button
                        onClick={() => deleteBus(b.id)}
                      >
                        <i className="las la-trash"></i>
                        Delete Bus
                      </button>
                    </div>
                  )}
                </div>

                {/* Bus Visual */}
                <div className="bus-visual">
                  <div className="bus-icon-circle">
                    <i className="las la-bus"></i>
                  </div>

                  <div className="bus-status">
                    <span className="status-dot"></span>
                    Active
                  </div>
                </div>

                {/* Bus Name */}
                <div className="bus-title">
                  <h3>{b.busname || "Unnamed Bus"}</h3>

                  <span>
                    <i className="las la-id-card"></i>
                    {b.regno || "Registration not available"}
                  </span>
                </div>

                {/* Divider */}
                <div className="bus-divider"></div>

                {/* Details */}
                <div className="bus-details">
                  <div className="bus-detail">
                    <div className="detail-icon">
                      <i className="las la-car"></i>
                    </div>

                    <div>
                      <span>Model</span>
                      <strong>{b.model || "—"}</strong>
                    </div>
                  </div>

                  <div className="bus-detail">
                    <div className="detail-icon">
                      <i className="las la-users"></i>
                    </div>

                    <div>
                      <span>Seats</span>
                      <strong>{b.seats || "0"}</strong>
                    </div>
                  </div>

                  <div className="bus-detail">
                    <div className="detail-icon">
                      <i className="las la-gas-pump"></i>
                    </div>

                    <div>
                      <span>Fuel Tank</span>
                      <strong>
                        {b.fueltankcapacity || "0"} L
                      </strong>
                    </div>
                  </div>

                  <div className="bus-detail">
                    <div className="detail-icon">
                      <i className="las la-barcode"></i>
                    </div>

                    <div>
                      <span>Bus ID</span>
                      <strong>#{b.id}</strong>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bus-card-footer">
                  <span>
                    <i className="las la-shield-alt"></i>
                    Registered Vehicle
                  </span>

                  <i className="las la-arrow-right"></i>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= FLOATING BUTTON ================= */}
      <button
        className="floating-add-bus"
        onClick={() =>
          navigate("/dashboard/TransportComponent/add-bus")
        }
        title="Add New Bus"
      >
        <i className="las la-plus"></i>
      </button>
    </div>
  );
};

export default BusesPage;