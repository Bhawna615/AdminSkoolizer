
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./StudentFeeDetails.css";

const StudentFeeDetails = () => {
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH STUDENT FEE DETAILS
  // =====================================================

  const fetchFeeDetails = useCallback(async (studentId) => {
    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("id", studentId);

      const response = await axios.post(
        "http://localhost/kkblossom/api.php/Adminapi/AdminFee/getFeeDetails",
        formData
      );

      console.log("Fee API Response:", response.data);

      if (response.data?.status === true) {
        const studentInfo = Array.isArray(response.data.info)
          ? response.data.info[0]
          : response.data.info;

        setStudent(studentInfo || null);

        setDetails(
          Array.isArray(response.data.details)
            ? response.data.details
            : []
        );

        if (!studentInfo) {
          setError("Student information is not available.");
        }
      } else {
        setStudent(null);
        setDetails([]);
        setError(
          response.data?.message || "No fee details found."
        );
      }
    } catch (err) {
      console.error(
        "Fee API Error:",
        err.response?.data || err.message
      );

      setStudent(null);
      setDetails([]);
      setError("Server Error. Please check backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  // =====================================================
  // LOAD DATA WHEN STUDENT ID CHANGES
  // =====================================================

  useEffect(() => {
    if (id && !isNaN(Number(id)) && Number(id) > 0) {
      fetchFeeDetails(id);
    } else {
      setStudent(null);
      setDetails([]);
      setError("Invalid Student ID");
      setLoading(false);
    }
  }, [id, fetchFeeDetails]);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (value) => {
    if (
      !value ||
      value === "0000-00-00" ||
      value === "0000-00-00 00:00:00"
    ) {
      return "N/A";
    }

    const timestamp = Date.parse(
      String(value).replace(" ", "T")
    );

    if (Number.isNaN(timestamp)) {
      return "N/A";
    }

    return new Date(timestamp).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // =====================================================
  // FEE STATUS
  // =====================================================

  const getFeeStatus = (status) => {
    const normalizedStatus = String(status || "")
      .trim()
      .toLowerCase();

    if (normalizedStatus === "paid") {
      return {
        label: "Paid",
        className: "student-fee-status-paid",
        icon: "bi-check-circle-fill",
      };
    }

    if (
      normalizedStatus === "pending" ||
      normalizedStatus === "unpaid"
    ) {
      return {
        label: status || "Pending",
        className: "student-fee-status-pending",
        icon: "bi-clock-fill",
      };
    }

    if (normalizedStatus === "overdue") {
      return {
        label: "Overdue",
        className: "student-fee-status-overdue",
        icon: "bi-exclamation-circle-fill",
      };
    }

    return {
      label: status || "N/A",
      className: "student-fee-status-other",
      icon: "bi-info-circle-fill",
    };
  };

  // =====================================================
  // FEE SUMMARY + PIE CHART DATA
  // =====================================================

  const feeSummary = useMemo(() => {
    const total = details.length;

    const paid = details.filter(
      (fee) =>
        String(fee.status || "").trim().toLowerCase() === "paid"
    ).length;

    const pending = details.filter((fee) => {
      const status = String(fee.status || "")
        .trim()
        .toLowerCase();

      return (
        status === "pending" ||
        status === "unpaid" ||
        status === "overdue"
      );
    }).length;

    const other = Math.max(total - paid - pending, 0);

    const getPercentage = (value) =>
      total > 0 ? Number(((value / total) * 100).toFixed(1)) : 0;

    return {
      total,
      paid,
      pending,
      other,
      paidPercentage: getPercentage(paid),
      pendingPercentage: getPercentage(pending),
      otherPercentage: getPercentage(other),
    };
  }, [details]);

  // =====================================================
  // PIE CHART GRADIENT
  // =====================================================
// =====================================================
// PIE CHART GRADIENT
// =====================================================

const pieChartBackground = useMemo(() => {
  if (feeSummary.total === 0) {
    return "#e9e5f2";
  }

  const paidEnd = feeSummary.paidPercentage;

  const pendingEnd =
    paidEnd + feeSummary.pendingPercentage;

  return `conic-gradient(
    #44d55f 0% ${paidEnd}%,
    #fdcb66 ${paidEnd}% ${pendingEnd}%,
    #8163d2 ${pendingEnd}% 100%
  )`;
}, [feeSummary]);

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {
    return (
      <div className="student-fee-loading">
        <div className="student-fee-loader"></div>
        <h3>Loading Fee Details</h3>
        <p>Please wait while we fetch student fee records.</p>
      </div>
    );
  }

  // =====================================================
  // ERROR SCREEN
  // =====================================================

  if (error) {
    return (
      <div className="student-fee-state-container">
        <div className="student-fee-state-icon student-fee-error-icon">
          <i className="bi bi-exclamation-triangle-fill"></i>
        </div>

        <h3>Unable to Load Fee Details</h3>

        <p>{error}</p>

        <button
          type="button"
          className="student-fee-retry-btn"
          onClick={() => fetchFeeDetails(id)}
        >
          <i className="bi bi-arrow-clockwise"></i>
          Try Again
        </button>
      </div>
    );
  }

  // =====================================================
  // STUDENT NOT FOUND
  // =====================================================

  if (!student) {
    return (
      <div className="student-fee-state-container">
        <div className="student-fee-state-icon">
          <i className="bi bi-person-x-fill"></i>
        </div>

        <h3>No Student Found</h3>

        <p>Student fee information is not available.</p>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="student-fee-container">

      {/* PAGE HEADER */}
      <div className="student-fee-page-header">
        <div>
          <span className="student-fee-eyebrow">
            STUDENT MANAGEMENT
          </span>

          <h1>Fee Details</h1>

          <p>
            View and track the student's fee payment records.
          </p>
        </div>

        <div className="student-fee-header-icon">
          <i className="bi bi-wallet2"></i>
        </div>
      </div>

      {/* STUDENT PROFILE */}
      <div className="student-fee-profile-card">

        <div className="student-fee-profile-left">

          <div className="student-fee-image-box">
            <img
              src={
                student.image
                  ? `http://localhost/kkblossom/assets/images/students/${student.image}`
                  : "http://localhost/kkblossom/assets/icons/user.svg"
              }
              alt="Student"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "http://localhost/kkblossom/assets/icons/user.svg";
              }}
            />
          </div>

          <div className="student-fee-info-box">

            <span className="student-fee-profile-label">
              STUDENT PROFILE
            </span>

            <h2>{student.Name || "N/A"}</h2>

            <div className="student-fee-profile-details">

              <div className="student-fee-profile-item">
                <i className="bi bi-mortarboard-fill"></i>
                <span>Class</span>
                <strong>{student.Class || "N/A"}</strong>
              </div>

              <div className="student-fee-profile-item">
                <i className="bi bi-person-badge-fill"></i>
                <span>Roll No.</span>
                <strong>{student.Rollno || "N/A"}</strong>
              </div>

            </div>
          </div>

        </div>

        <div className="student-fee-profile-decoration">
          <i className="bi bi-receipt-cutoff"></i>
        </div>

      </div>

      {/* =================================================
          FEE OVERVIEW
      ================================================= */}

      <div className="student-fee-overview">

        <div className="student-fee-section-heading">
          <div>
            <h2>Fee Overview</h2>
            <p>Summary of the student's fee records</p>
          </div>
        </div>

        {/* SOLID PIE CHART */}

        <div className="student-fee-chart-card">

          <div className="student-fee-chart-heading">

            <div>
              <h3>Overall Fee Distribution</h3>
              <p>
                Visual breakdown of student fee records
              </p>
            </div>

            <div className="student-fee-chart-heading-icon">
              <i className="bi bi-pie-chart-fill"></i>
            </div>

          </div>

          <div className="student-fee-chart-content">

            {/* SOLID PIE CHART - NO DONUT */}

            <div
              className="student-fee-pie-chart"
              style={{
                background: pieChartBackground,
              }}
              role="img"
              aria-label={`Fee distribution: ${feeSummary.paid} paid, ${feeSummary.pending} pending, ${feeSummary.other} other records`}
            ></div>

            {/* PIE CHART LEGEND */}

            <div className="student-fee-chart-legend">

              {/* PAID */}

              <div className="student-fee-chart-legend-item">

                <span className="student-fee-chart-dot paid"></span>

                <div>
                  <strong>Paid Fees</strong>
                  <span>
                    {feeSummary.paid} Records
                  </span>
                </div>

                <b>{feeSummary.paidPercentage}%</b>

              </div>

              {/* PENDING */}

              <div className="student-fee-chart-legend-item">

                <span className="student-fee-chart-dot pending"></span>

                <div>
                  <strong>Pending Fees</strong>
                  <span>
                    {feeSummary.pending} Records
                  </span>
                </div>

                <b>{feeSummary.pendingPercentage}%</b>

              </div>

              {/* OTHER */}

              <div className="student-fee-chart-legend-item">

                <span className="student-fee-chart-dot other"></span>

                <div>
                  <strong>Other Records</strong>
                  <span>
                    {feeSummary.other} Records
                  </span>
                </div>

                <b>{feeSummary.otherPercentage}%</b>

              </div>

            </div>

          </div>

          <div className="student-fee-chart-footer">
            <i className="bi bi-info-circle"></i>
            Based on {feeSummary.total} total fee records
          </div>

        </div>

        {/* SUMMARY CARDS */}

        <div className="student-fee-summary-grid">

          {/* TOTAL RECORDS */}

          <div className="student-fee-summary-card student-fee-total-card">

            <div className="student-fee-summary-top">
              <div className="student-fee-summary-icon">
                <i className="bi bi-receipt"></i>
              </div>

              <span className="student-fee-summary-tag">
                All Records
              </span>
            </div>

            <h3>{feeSummary.total}</h3>

            <p>Total Fee Records</p>

          </div>

          {/* PAID */}

          <div className="student-fee-summary-card student-fee-paid-card">

            <div className="student-fee-summary-top">
              <div className="student-fee-summary-icon">
                <i className="bi bi-check-circle-fill"></i>
              </div>

              <span className="student-fee-summary-tag">
                Completed
              </span>
            </div>

            <h3>{feeSummary.paid}</h3>

            <p>Paid Records</p>

          </div>

          {/* PENDING */}

          <div className="student-fee-summary-card student-fee-pending-card">

            <div className="student-fee-summary-top">
              <div className="student-fee-summary-icon">
                <i className="bi bi-clock-history"></i>
              </div>

              <span className="student-fee-summary-tag">
                Attention
              </span>
            </div>

            <h3>{feeSummary.pending}</h3>

            <p>Pending / Unpaid Records</p>

          </div>

        </div>

      </div>

      {/* =================================================
          FEE PAYMENT HISTORY
      ================================================= */}

      <div className="student-fee-section">

        <div className="student-fee-section-heading">

          <div>
            <h2>Fee Payment History</h2>
            <p>
              Complete fee schedule and payment status
            </p>
          </div>

          <span className="student-fee-count">
            <i className="bi bi-journal-text"></i>
            {details.length}{" "}
            {details.length === 1 ? "Record" : "Records"}
          </span>

        </div>

        {details.length === 0 ? (

          <div className="student-fee-no-details">

            <div className="student-fee-empty-icon">
              <i className="bi bi-folder2-open"></i>
            </div>

            <h3>No Fee Records Found</h3>

            <p>
              There are currently no fee records available for this student.
            </p>

          </div>

        ) : (

          <div className="student-fee-grid">

            {details.map((fee, idx) => {
              const statusInfo = getFeeStatus(fee.status);

              return (
                <div
                  key={fee.id || idx}
                  className="student-fee-box"
                >

                  {/* CARD HEADER */}

                  <div className="student-fee-box-header">

                    <div className="student-fee-period-icon">
                      <i className="bi bi-calendar2-check"></i>
                    </div>

                    <span className="student-fee-record-number">
                      RECORD {String(idx + 1).padStart(2, "0")}
                    </span>

                  </div>

                  {/* FEE PERIOD */}

                  <h3 className="student-fee-period">
                    {fee.period || "Fee Period"}
                  </h3>

                  <div className="student-fee-card-divider"></div>

                  {/* STATUS */}

                  <div className="student-fee-row">

                    <span className="student-fee-label">
                      Payment Status
                    </span>

                    <span
                      className={`student-fee-status ${statusInfo.className}`}
                    >
                      <i className={`bi ${statusInfo.icon}`}></i>
                      {statusInfo.label}
                    </span>

                  </div>

                  {/* LAST DATE */}

                  <div className="student-fee-row">

                    <span className="student-fee-label">
                      <i className="bi bi-calendar-event"></i>
                      Last Date
                    </span>

                    <span className="student-fee-value">
                      {formatDate(fee.lastdate)}
                    </span>

                  </div>

                  {/* PAID DATE */}

                  <div className="student-fee-row">

                    <span className="student-fee-label">
                      <i className="bi bi-calendar-check"></i>
                      Paid On
                    </span>

                    <span className="student-fee-value">
                      {fee.paidondate
                        ? formatDate(fee.paidondate)
                        : "Not Paid"}
                    </span>

                  </div>

                  {/* CARD FOOTER */}

                  <div className="student-fee-card-footer">

                    <span>
                      <i className="bi bi-shield-check"></i>
                      Fee Record
                    </span>

                    <span className="student-fee-footer-period">
                      {fee.period || "N/A"}
                    </span>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </div>

    </div>
  );
};

export default StudentFeeDetails;
