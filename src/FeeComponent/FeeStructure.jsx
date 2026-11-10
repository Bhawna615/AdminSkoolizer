
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./FeeStructure.css";

const API =
  "http://localhost/kkblossom/api.php/AdminApi/AdminPanelFee/";

export default function FeeStructure() {
  const [fees, setFees] = useState([]);
  const [search, setSearch] = useState("");

  // ================= DELETE MESSAGE STATES =================

  const [showMsg, setShowMsg] = useState(false);
  const [messageType, setMessageType] = useState("");
  const [messageText, setMessageText] = useState("");
  const [selectedFeeId, setSelectedFeeId] = useState(null);

  // ================= LOADER STATE =================

  const [deleting, setDeleting] = useState(false);
  const deletingLock = useRef(false);

  // ================= FETCH FEES =================

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const res = await axios.get(API + "getAllFees");
      setFees(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching fees:", error);
    }
  };

  // ================= OPEN DELETE CONFIRMATION =================

  const deleteFee = (id) => {
    if (deletingLock.current) return;

    setSelectedFeeId(id);
    setMessageType("confirm");
    setMessageText(
      "Are you sure you want to delete this fee structure? This action cannot be undone."
    );
    setShowMsg(true);
  };

  // ================= CONFIRM DELETE =================

  const confirmDelete = async () => {
    if (deletingLock.current || selectedFeeId === null || selectedFeeId === undefined) {
      return;
    }

    deletingLock.current = true;
    setDeleting(true);
    setShowMsg(false);

    try {
      const res = await axios.delete(
        API + "deleteFee/" + selectedFeeId
      );

      if (
        res.data &&
        typeof res.data === "object" &&
        res.data.status === false
      ) {
        setMessageType("error");
        setMessageText(
          res.data.message || "Failed to delete fee structure."
        );
      } else {
        setFees((prev) =>
          prev.filter(
            (fee) =>
              String(fee.feestructureid) !== String(selectedFeeId)
          )
        );

        setMessageType("success");
        setMessageText("Fee structure deleted successfully!");
      }

      setShowMsg(true);
    } catch (error) {
      console.error("Error deleting fee:", error);

      setMessageType("error");
      setMessageText(
        error.response?.data?.message ||
          "Something went wrong while deleting the fee structure."
      );

      setShowMsg(true);
    } finally {
      deletingLock.current = false;
      setDeleting(false);
      setSelectedFeeId(null);
    }
  };

  // ================= CLOSE MESSAGE BOX =================

  const closeMessage = () => {
    setShowMsg(false);
    setSelectedFeeId(null);
  };

  // ================= FILTER FEES =================

  const filteredFees = fees.filter((row) =>
    row.feeclass?.toLowerCase().includes(search.toLowerCase())
  );

  // ================= FORMAT CURRENCY =================

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN");
  };

  return (
    <div className="fee-page">

      {/* ================= MESSAGE OVERLAY ================= */}

      {showMsg && (
        <div className="fee-message-overlay">
          <div className="fee-message-modal">

            <div className={`fee-message-icon ${messageType}`}>
              <i
                className={
                  messageType === "confirm"
                    ? "bi bi-trash3"
                    : messageType === "success"
                    ? "bi bi-check-lg"
                    : "bi bi-exclamation-lg"
                }
              ></i>
            </div>

            <div className="fee-message-content">
              <span className="fee-message-eyebrow">
                {messageType === "confirm"
                  ? "PLEASE CONFIRM"
                  : messageType === "success"
                  ? "COMPLETED"
                  : "ACTION FAILED"}
              </span>

              <h2>
                {messageType === "confirm"
                  ? "Delete Fee Structure?"
                  : messageType === "success"
                  ? "Successfully Deleted!"
                  : "Something Went Wrong"}
              </h2>

              <p>{messageText}</p>
            </div>

            {messageType === "confirm" ? (
              <div className="fee-message-actions">

                <button
                  type="button"
                  className="fee-message-cancel-btn"
                  onClick={closeMessage}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="fee-message-delete-btn"
                  onClick={confirmDelete}
                >
                  <i className="bi bi-trash3"></i>
                  Delete
                </button>

              </div>
            ) : (
              <button
                type="button"
                className="fee-message-ok-btn"
                onClick={closeMessage}
              >
                Continue
                <i className="bi bi-arrow-right"></i>
              </button>
            )}

          </div>
        </div>
      )}

      {/* ================= FULL SCREEN LOADER ================= */}

      {deleting && (
        <div className="fee-delete-loading-overlay">
          <div className="fee-delete-loader-content">

            <div className="fee-delete-loader-icon">
              <i className="bi bi-receipt-cutoff"></i>
            </div>

            <div className="fee-delete-spinner"></div>

            <h2>Removing Fee Structure</h2>

            <p>
              Please wait while we update your fee records.
            </p>

            <span>
              Your request is being processed securely.
            </span>

          </div>
        </div>
      )}

      {/* ================= PAGE HEADER ================= */}

      <div className="fee-header">

        <div className="fee-header-left">

          <div className="fee-header-icon">
            <i className="bi bi-wallet2"></i>
          </div>

          <div>
            <div className="fee-breadcrumb">
              <span>Dashboard</span>
              <i className="bi bi-chevron-right"></i>
              <span>Fee Management</span>
            </div>

            <h1>Fee Structure</h1>

            <p>
              Manage class-wise fee details, admission charges and discounts.
            </p>
          </div>

        </div>

        <button
          type="button"
          className="add-fee-btn"
          onClick={() =>
            (window.location.href =
              "/dashboard/FeeComponent/AddFeeStructure")
          }
        >
          <i className="bi bi-plus-lg"></i>
          <span>Add Structure</span>
        </button>

      </div>

      {/* ================= OVERVIEW STRIP ================= */}

      <div className="fee-overview">

        <div className="fee-overview-card">

          <div className="fee-overview-icon purple">
            <i className="bi bi-collection"></i>
          </div>

          <div>
            <span>Total Structures</span>
            <h3>{fees.length}</h3>
            <small>Available fee records</small>
          </div>

        </div>

        <div className="fee-overview-card">

          <div className="fee-overview-icon blue">
            <i className="bi bi-mortarboard"></i>
          </div>

          <div>
            <span>Classes Covered</span>
            <h3>
              {new Set(
                fees.map((fee) => fee.feeclass).filter(Boolean)
              ).size}
            </h3>
            <small>Unique classes configured</small>
          </div>

        </div>

        <div className="fee-overview-card">

          <div className="fee-overview-icon green">
            <i className="bi bi-check-circle"></i>
          </div>

          <div>
            <span>Active Records</span>
            <h3>{fees.length}</h3>
            <small>Configured fee structures</small>
          </div>

        </div>

      </div>

      {/* ================= MAIN TABLE CARD ================= */}

      <div className="fee-card">

        {/* CARD HEADER */}

        <div className="fee-card-top">

          <div className="fee-card-heading">

            <div className="fee-card-heading-icon">
              <i className="bi bi-list-ul"></i>
            </div>

            <div>
              <h2>All Fee Structures</h2>
              <p>
                View and manage fee configurations for each class.
              </p>
            </div>

          </div>

          <div className="fee-card-tools">

            <div className="fee-search">
              <i className="bi bi-search"></i>

              <input
                type="text"
                placeholder="Search by class..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {search && (
                <button
                  type="button"
                  className="fee-search-clear"
                  onClick={() => setSearch("")}
                  title="Clear search"
                >
                  <i className="bi bi-x-circle-fill"></i>
                </button>
              )}
            </div>

          </div>

        </div>

        {/* TABLE */}

        <div className="fee-table-wrapper">

          <table className="fee-table">

            <thead>
              <tr>
                <th>CLASS DETAILS</th>
                <th>ADMISSION FEE</th>
                <th>TUITION FEE</th>
                <th>ANNUAL FEE</th>
                <th>SIBLING DISCOUNT</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>

              {filteredFees.length > 0 ? (
                filteredFees.map((row) => (

                  <tr key={row.feestructureid}>

                    <td>
                      <div className="class-name">

                        <div className="class-icon">
                          {row.feeclass?.charAt(0)?.toUpperCase() || "C"}
                        </div>

                        <div className="class-details">
                          <span>{row.feeclass}</span>
                          <small>Class fee configuration</small>
                        </div>

                      </div>
                    </td>

                    <td>
                      <span className="amount">
                        ₹{formatAmount(row.admission_fee)}
                      </span>
                    </td>

                    <td>
                      <span className="amount">
                        ₹{formatAmount(row.tuition_fee)}
                      </span>
                    </td>

                    <td>
                      <span className="amount">
                        ₹{formatAmount(row.annual_fee)}
                      </span>
                    </td>

                    <td>
                      <span className="discount-badge">
                        <i className="bi bi-tag-fill"></i>
                        ₹{formatAmount(row.sibling_discount)}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() =>
                          deleteFee(row.feestructureid)
                        }
                        title="Delete fee structure"
                        disabled={deleting}
                      >
                        <i className="bi bi-trash3"></i>
                      </button>
                    </td>

                  </tr>

                ))
              ) : (
                <tr>
                  <td colSpan="6">

                    <div className="empty-state">

                      <div className="empty-icon">
                        <i className="bi bi-receipt"></i>
                      </div>

                      <h3>No Fee Structure Found</h3>

                      <p>
                        {search
                          ? "No class matches your search. Try another class name."
                          : "There are no fee structures available yet. Add your first fee structure to get started."}
                      </p>

                      {!search && (
                        <button
                          type="button"
                          className="empty-add-btn"
                          onClick={() =>
                            (window.location.href =
                              "/dashboard/FeeComponent/AddFeeStructure")
                          }
                        >
                          <i className="bi bi-plus-lg"></i>
                          Add Fee Structure
                        </button>
                      )}

                    </div>

                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

        {/* FOOTER */}

        <div className="fee-card-footer">

          <div>
            Showing <strong>{filteredFees.length}</strong> of{" "}
            <strong>{fees.length}</strong> fee structures
          </div>

          <div className="fee-footer-status">
            <span></span>
            Fee management
          </div>

        </div>

      </div>

    </div>
  );
}
