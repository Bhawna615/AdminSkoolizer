import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./TransportStaffPage.css";

const TransportStaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [message, setMessage] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // =========================================
  // FETCH STAFF DATA
  // =========================================
  useEffect(() => {
    fetch(
      "http://localhost/kkblossom/api.php/Adminapi/AdminTransport/getTransportStaff"
    )
      .then((res) => res.json())
      .then((data) => {
        // Supports both:
        // [ ... ]
        // and { data: [ ... ] }
        const staffData = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];

        setStaff(staffData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching staff:", err);

        setLoading(false);

        setMessage({
          type: "error",
          text: "Unable to load transport staff",
        });
      });
  }, []);

  // =========================================
  // SUCCESS MESSAGE AFTER ADDING STAFF
  // =========================================
  useEffect(() => {
    if (location.state?.success) {
      setMessage({
        type: "success",
        text: location.state.success,
      });

      window.history.replaceState({}, document.title);

      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // =========================================
  // DELETE STAFF
  // =========================================
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this staff member?"
    );

    if (!confirmDelete) return;

    fetch(
      `http://localhost/kkblossom/api.php/Adminapi/AdminTransport/deleteTransportStaff/${id}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setMessage({
            type: "success",
            text: "Staff deleted successfully",
          });

          setStaff((prevStaff) =>
            prevStaff.filter((item) => item.id !== id)
          );
        } else {
          setMessage({
            type: "error",
            text: "Failed to delete staff",
          });
        }
      })
      .catch((error) => {
        console.error("Error deleting staff:", error);

        setMessage({
          type: "error",
          text: "Error deleting staff",
        });
      });

    setOpenMenuId(null);
  };

  // =========================================
  // IMAGE ERROR HANDLER
  // =========================================
  const handleImageError = (e) => {
    const image = e.currentTarget;
    const fallback = image.parentElement.querySelector(
      ".staff-account-fallback"
    );

    image.style.display = "none";

    if (fallback) {
      fallback.style.display = "flex";
    }
  };

  return (
    <div className="transport-staff-directory">

      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <div className="staff-directory-header">

        <div className="staff-directory-title">

          <div className="staff-directory-icon">
            <i className="las la-users"></i>
          </div>

          <div>

            <span className="staff-directory-eyebrow">
              TRANSPORT MANAGEMENT
            </span>

            <h1>Transport Staff</h1>

            <p>
              Manage drivers, attendants and other transport personnel
            </p>

          </div>

        </div>

        <button
          className="staff-add-header-btn"
          onClick={() =>
            navigate(
              "/dashboard/TransportComponent/add-transport-staff"
            )
          }
        >
          <i className="las la-user-plus"></i>
          Add Staff
        </button>

      </div>

      {/* =========================================
          SUCCESS / ERROR MESSAGE
      ========================================= */}

      {message && (
        <div
          className={`staff-alert ${
            message.type === "success"
              ? "staff-alert-success"
              : "staff-alert-error"
          }`}
        >

          <div className="staff-alert-icon">

            <i
              className={
                message.type === "success"
                  ? "las la-check"
                  : "las la-exclamation-circle"
              }
            ></i>

          </div>

          <span>{message.text}</span>

          <button onClick={() => setMessage(null)}>
            <i className="las la-times"></i>
          </button>

        </div>
      )}

      {/* =========================================
          STATISTICS
      ========================================= */}

      <div className="staff-stats-grid">

        {/* TOTAL STAFF */}

        <div className="staff-stat-card">

          <div className="staff-stat-icon purple">
            <i className="las la-users"></i>
          </div>

          <div>
            <span>Total Staff</span>
            <strong>{staff.length}</strong>
          </div>

          <div className="staff-stat-arrow">
            <i className="las la-user-friends"></i>
          </div>

        </div>

        {/* TRANSPORT TEAM */}

        <div className="staff-stat-card">

          <div className="staff-stat-icon green">
            <i className="las la-id-badge"></i>
          </div>

          <div>
            <span>Transport Team</span>
            <strong>{staff.length}</strong>
          </div>

          <div className="staff-stat-arrow">
            <i className="las la-check-circle"></i>
          </div>

        </div>

        {/* CONTACT RECORDS */}

        <div className="staff-stat-card">

          <div className="staff-stat-icon blue">
            <i className="las la-phone"></i>
          </div>

          <div>
            <span>Contact Records</span>
            <strong>{staff.length}</strong>
          </div>

          <div className="staff-stat-arrow">
            <i className="las la-address-book"></i>
          </div>

        </div>

      </div>

      {/* =========================================
          STAFF DIRECTORY
      ========================================= */}

      <div className="staff-directory-card">

        {/* DIRECTORY HEADER */}

        <div className="staff-directory-card-header">

          <div>

            <span>TEAM DIRECTORY</span>

            <h2>Transport Staff Members</h2>

            <p>
              All registered members of your school transport team
            </p>

          </div>

          <div className="staff-count-badge">
            {staff.length} Members
          </div>

        </div>

        {/* =========================================
            LOADING
        ========================================= */}

        {loading ? (

          <div className="staff-loading">

            <div className="staff-loader">
              <i className="las la-spinner"></i>
            </div>

            <h3>Loading Staff</h3>

            <p>
              Please wait while we fetch the transport team.
            </p>

          </div>

        ) : staff.length === 0 ? (

          /* =========================================
              EMPTY STATE
          ========================================= */

          <div className="staff-empty-state">

            <div className="staff-empty-icon">
              <i className="las la-user-friends"></i>
            </div>

            <h3>No Transport Staff Added</h3>

            <p>
              Your transport staff directory is currently empty.
              Add your first staff member to get started.
            </p>

            <button
              onClick={() =>
                navigate(
                  "/dashboard/TransportComponent/add-transport-staff"
                )
              }
            >
              <i className="las la-user-plus"></i>
              Add First Staff Member
            </button>

          </div>

        ) : (

          /* =========================================
              STAFF GRID
          ========================================= */

          <div className="staff-grid">

            {staff.map((row, index) => (

              <div
                className="staff-member-card"
                key={row.id}
              >

                {/* =========================================
                    CARD TOP
                ========================================= */}

                <div className="staff-card-top">

                  <span className="staff-number">
                    #{String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="staff-menu-wrapper">

                    <button
                      className="staff-menu-btn"
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === row.id
                            ? null
                            : row.id
                        )
                      }
                    >
                      <i className="las la-ellipsis-v"></i>
                    </button>

                    {/* DELETE MENU */}

                    {openMenuId === row.id && (

                      <div className="staff-dropdown">

                        <button
                          className="staff-delete-option"
                          onClick={() =>
                            handleDelete(row.id)
                          }
                        >
                          <i className="las la-trash-alt"></i>
                          Delete Staff
                        </button>

                      </div>

                    )}

                  </div>

                </div>

                {/* =========================================
                    PROFILE
                ========================================= */}

                <div className="staff-profile-section">

                  <div className="staff-profile-image">

                    {/* =====================================
                        STAFF IMAGE
                    ===================================== */}

                    {row.image && (
                      <img
                        src={`http://localhost/KKBlossomsWebsite/assets/images/transport/${row.image}`}
                        alt={row.drivername || "Staff"}
                        onError={handleImageError}
                      />
                    )}

                    {/* =====================================
                        ACCOUNT ICON FALLBACK
                    ===================================== */}

                    <div
                      className="staff-account-fallback"
                      style={{
                        display: row.image
                          ? "none"
                          : "flex",
                      }}
                    >
                      <i className="las la-user"></i>
                    </div>

                    {/* ONLINE / REGISTERED DOT */}

                    <span className="staff-online-dot"></span>

                  </div>

                  {/* STAFF NAME */}

                  <div className="staff-profile-name">

                    <h3>
                      {row.drivername || "Unknown Staff"}
                    </h3>

                    <span>
                      {row.Post || "Transport Staff"}
                    </span>

                  </div>

                </div>

                {/* =========================================
                    DETAILS
                ========================================= */}

                <div className="staff-details">

                  {/* STAFF ID */}

                  <div className="staff-detail-row">

                    <div className="staff-detail-icon">
                      <i className="las la-id-badge"></i>
                    </div>

                    <div>

                      <span>Staff ID</span>

                      <strong>
                        #{row.id}
                      </strong>

                    </div>

                  </div>

                  {/* ADDRESS */}

                  <div className="staff-detail-row">

                    <div className="staff-detail-icon">
                      <i className="las la-map-marker"></i>
                    </div>

                    <div>

                      <span>Address</span>

                      <strong className="staff-address">
                        {row.Address || "Not provided"}
                      </strong>

                    </div>

                  </div>

                </div>

                {/* =========================================
                    FOOTER
                ========================================= */}

                <div className="staff-card-footer">

                  <div className="staff-status">

                    <span className="staff-status-dot"></span>

                    Registered Staff

                  </div>

                  <div className="staff-card-arrow">

                    <i className="las la-arrow-right"></i>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* =========================================
          FLOATING ADD BUTTON
      ========================================= */}

      <button
        className="staff-floating-add"
        onClick={() =>
          navigate(
            "/dashboard/TransportComponent/add-transport-staff"
          )
        }
        title="Add Transport Staff"
      >
        <i className="las la-plus"></i>
      </button>

    </div>
  );
};

export default TransportStaffPage;