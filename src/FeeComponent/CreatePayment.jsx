
import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./CreatePayment.css";

const API =
  "http://localhost/kkblossom/api.php/Adminapi/AdminPanelFee/";

export default function CreatePayment() {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filterEnabled, setFilterEnabled] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [form, setForm] = useState({
    period: "",
    lastdate: "",
    session: "2026-2027",
  });

  const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];

  // =========================================================
  // MESSAGE BOX
  // =========================================================

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
  };

  // =========================================================
  // LOAD CLASSES
  // =========================================================

  useEffect(() => {
    axios
      .get(API + "getClasses")
      .then((res) => {
        setClasses(res.data || []);
      })
      .catch((error) => {
        console.error("Error loading classes:", error);
      });
  }, []);

  // =========================================================
  // FETCH STUDENTS
  // =========================================================

  const fetchStudents = () => {
    setLoading(true);

    axios
      .get(API + "getStudents")
      .then((res) => {
        const data = res.data || [];

        setStudents(data);

        const allIds = data
          .filter((s) => {
            const tuition = parseInt(s.tuition_fee) || 0;
            const transport = parseInt(s.transport_fee) || 0;

            return tuition + transport > 0;
          })
          .map((s) => s.id);

        setSelectedIds(allIds);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading students:", error);
        setLoading(false);

        showMessage(
          "Unable to load students. Please try again.",
          "error"
        );
      });
  };

  // =========================================================
  // INITIAL LOAD AND CLASS FILTER
  // =========================================================

  useEffect(() => {
    if (!filterEnabled) {
      fetchStudents();
      return;
    }

    if (!selectedClass) {
      setStudents([]);
      setSelectedIds([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    axios
      .get(
        API +
        "filterStudents/" +
        encodeURIComponent(selectedClass)
      )
      .then((res) => {
        const data = res.data || [];

        setStudents(data);

        const allIds = data
          .filter((s) => {
            const tuition = parseInt(s.tuition_fee) || 0;
            const transport = parseInt(s.transport_fee) || 0;

            return tuition + transport > 0;
          })
          .map((s) => s.id);

        setSelectedIds(allIds);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error filtering students:", error);
        setLoading(false);

        showMessage(
          "Unable to filter students.",
          "error"
        );
      });
  }, [selectedClass, filterEnabled]);

  // =========================================================
  // VALIDATION
  // =========================================================

  const validate = () => {
    const newErrors = {};

    if (!form.period) {
      newErrors.period = "Payment period is required.";
    }

    if (!form.lastdate) {
      newErrors.lastdate = "Last date is required.";
    }

    if (selectedIds.length === 0) {
      newErrors.students = "Please select at least one student.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================================================
  // CHECKBOX
  // =========================================================

  const handleCheckbox = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );

    setErrors((prev) => ({
      ...prev,
      students: ""
    }));
  };

  // =========================================================
  // VISIBLE STUDENTS
  // =========================================================

  const tableData = students.filter((s) => {
    const tuition = parseInt(s.tuition_fee) || 0;
    const transport = parseInt(s.transport_fee) || 0;

    return tuition + transport > 0;
  });

  const visibleIds = tableData.map((s) => s.id);

  // =========================================================
  // SELECT ALL
  // =========================================================

  const handleSelectAll = () => {
    const allVisibleSelected =
      visibleIds.length > 0 &&
      visibleIds.every((id) => selectedIds.includes(id));

    if (allVisibleSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !visibleIds.includes(id))
      );
    } else {
      setSelectedIds((prev) => [
        ...new Set([...prev, ...visibleIds])
      ]);
    }
  };

  // =========================================================
  // FEE SUMMARY
  // =========================================================

  const selectedStudents = tableData.filter((s) =>
    selectedIds.includes(s.id)
  );

  const totalTuition = selectedStudents.reduce(
    (sum, s) => sum + (parseInt(s.tuition_fee) || 0),
    0
  );

  const totalTransport = selectedStudents.reduce(
    (sum, s) => sum + (parseInt(s.transport_fee) || 0),
    0
  );

  const totalAmount = totalTuition + totalTransport;

  // =========================================================
  // SUBMIT PAYMENT
  // =========================================================

  const handleSubmit = () => {
    if (submitting) return;

    if (!validate()) return;

    setSubmitting(true);

    axios
      .post(API + "insertPayment", {
        ids: selectedIds,
        ...form,
      })
      .then((res) => {
        if (res.data.status) {
          showMessage(
            "Payment created successfully!",
            "success"
          );

          setTimeout(() => {
            navigate(
              "/dashboard/FeeComponent/AdminViewPayment"
            );
          }, 2200);
        } else {
          showMessage(
            res.data.message || "Failed to create payment.",
            "error"
          );

          setSubmitting(false);
        }
      })
      .catch((error) => {
        console.error("Error creating payment:", error);

        showMessage(
          "Server error. Please try again.",
          "error"
        );

        setSubmitting(false);
      });
  };

  // =========================================================
  // DATATABLE COLUMNS
  // =========================================================

  const columns = [
    {
      name: (
        <input
          className="cp-checkbox"
          type="checkbox"
          onChange={handleSelectAll}
          checked={
            visibleIds.length > 0 &&
            visibleIds.every((id) => selectedIds.includes(id))
          }
        />
      ),

      cell: (row) => (
        <input
          className="cp-checkbox"
          type="checkbox"
          checked={selectedIds.includes(row.id)}
          onChange={() => handleCheckbox(row.id)}
        />
      ),

      width: "65px",
      center: true,
    },

    {
      name: "ROLL / ADM NO.",
      selector: (row) => row.Admno,
      sortable: true,
      width: "150px",
    },

    {
      name: "STUDENT NAME",
      selector: (row) => row.Name,
      sortable: true,
      grow: 2,
    },

    {
      name: "CLASS",
      selector: (row) => row.Class,
      sortable: true,
      width: "130px",
    },

    {
      name: "TUITION FEE",
      selector: (row) => parseInt(row.tuition_fee) || 0,

      cell: (row) => (
        <span className="cp-fee-value">
          ₹{(parseInt(row.tuition_fee) || 0).toLocaleString("en-IN")}
        </span>
      ),

      width: "145px",
    },

    {
      name: "TRANSPORT",
      selector: (row) => parseInt(row.transport_fee) || 0,

      cell: (row) => (
        <span className="cp-fee-value">
          ₹{(parseInt(row.transport_fee) || 0).toLocaleString("en-IN")}
        </span>
      ),

      width: "145px",
    },

    {
      name: "TOTAL FEE",

      cell: (row) => {
        const tuition = parseInt(row.tuition_fee) || 0;
        const transport = parseInt(row.transport_fee) || 0;

        return (
          <strong className="cp-total-fee">
            ₹{(tuition + transport).toLocaleString("en-IN")}
          </strong>
        );
      },

      width: "145px",
    },
  ];

  // =========================================================
  // DATATABLE CUSTOM DESIGN
  // =========================================================

  const customStyles = {
    table: {
      style: {
        backgroundColor: "#ffffff",
      },
    },

    headRow: {
      style: {
        backgroundColor: "#f7f5ff",
        minHeight: "56px",
        borderBottom: "1px solid #ece8f7",
      },
    },

    headCells: {
      style: {
        color: "#70668d",
        fontSize: "11px",
        fontWeight: "800",
        letterSpacing: "0.6px",
        paddingLeft: "16px",
        paddingRight: "16px",
      },
    },

    rows: {
      style: {
        minHeight: "65px",
        color: "#38334d",
        fontSize: "13px",
        borderBottom: "1px solid #f0edf6",
      },

      highlightOnHoverStyle: {
        backgroundColor: "#faf9ff",
        transition: "0.2s ease",
      },
    },

    cells: {
      style: {
        paddingLeft: "16px",
        paddingRight: "16px",
      },
    },

    pagination: {
      style: {
        borderTop: "1px solid #f0edf6",
        minHeight: "58px",
        color: "#716b83",
        fontSize: "12px",
      },
    },
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="cp-page">

      {/* SUCCESS / ERROR MESSAGE OVERLAY */}

      {message && (
        <div className="cp-message-overlay">
          <div className="cp-message-box">

            <div
              className={`cp-message-icon ${
                messageType === "success"
                  ? "success"
                  : "error"
              }`}
            >
              {messageType === "success" ? (
                <i className="bi bi-check-lg"></i>
              ) : (
                <i className="bi bi-exclamation-lg"></i>
              )}
            </div>

            <h3>
              {messageType === "success"
                ? "Payment Created!"
                : "Something Went Wrong"}
            </h3>

            <p>{message}</p>

            <div className="cp-message-progress">
              <span
                className={
                  messageType === "success"
                    ? "success"
                    : "error"
                }
              />
            </div>

          </div>
        </div>
      )}

      {/* PAGE HEADER */}

      <div className="cp-page-header">

        <div className="cp-heading-left">

          <div className="cp-heading-icon">
            <i className="bi bi-receipt-cutoff"></i>
          </div>

          <div>
            <div className="cp-breadcrumb">
              Dashboard <span>/</span> Fees <span>/</span> Create Payment
            </div>

            <h1>Create Payment</h1>

            <p>Create and assign fee payments to students.</p>
          </div>

        </div>

        <button
          className="cp-back-btn"
          onClick={() =>
            navigate("/dashboard/FeeComponent/AdminViewPayment")
          }
        >
          <i className="bi bi-arrow-left"></i>
          Back to Payments
        </button>

      </div>

      {/* SUMMARY CARDS */}

      <div className="cp-summary-grid">

        <div className="cp-summary-card">

          <div className="cp-summary-icon purple">
            <i className="bi bi-people"></i>
          </div>

          <div>
            <span>Available Students</span>
            <h2>{tableData.length}</h2>
          </div>

        </div>

        <div className="cp-summary-card">

          <div className="cp-summary-icon blue">
            <i className="bi bi-person-check"></i>
          </div>

          <div>
            <span>Selected Students</span>
            <h2>{selectedIds.length}</h2>
          </div>

        </div>

        <div className="cp-summary-card">

          <div className="cp-summary-icon green">
            <i className="bi bi-wallet2"></i>
          </div>

          <div>
            <span>Selected Fee Amount</span>
            <h2>₹{totalAmount.toLocaleString("en-IN")}</h2>
          </div>

        </div>

      </div>

      {/* MAIN CONTENT */}

      <div className="cp-main-card">

        {/* CARD HEADER */}

        <div className="cp-card-header">

          <div className="cp-card-header-icon">
            <i className="bi bi-file-earmark-text"></i>
          </div>

          <div>
            <h2>Payment Configuration</h2>
            <p>Enter payment details and choose the students.</p>
          </div>

          <div className="cp-session-badge">
            <i className="bi bi-calendar3"></i>
            Session 2026–2027
          </div>

        </div>

        {/* STUDENT FILTER */}

        <section className="cp-section">

          <div className="cp-section-heading">

            <div>
              <h3>Student Filter</h3>
              <p>Filter the student list according to their class.</p>
            </div>

            <span className="cp-step-label">01</span>

          </div>

          <div className="cp-filter-panel">

            <div className="cp-filter-toggle-area">

              <div className="cp-filter-symbol">
                <i className="bi bi-funnel"></i>
              </div>

              <div className="cp-filter-toggle-text">
                <strong>Enable Class Filter</strong>
                <span>Show students from a particular class</span>
              </div>

              <label className="cp-switch">

                <input
                  type="checkbox"
                  checked={filterEnabled}
                  onChange={(e) => {
                    setFilterEnabled(e.target.checked);
                    setSelectedClass("");
                  }}
                />

                <span className="cp-switch-slider"></span>

              </label>

            </div>

            <div className="cp-filter-divider"></div>

            <div className="cp-class-select">

              <label>Select Class</label>

              <div className="cp-select-wrapper">

                <i className="bi bi-mortarboard"></i>

                <select
                  value={selectedClass}
                  onChange={(e) =>
                    setSelectedClass(e.target.value)
                  }
                  disabled={!filterEnabled}
                >
                  <option value="">Select a class</option>

                  {classes.map((c, i) => (
                    <option key={i} value={c.Classname}>
                      {c.Classname}
                    </option>
                  ))}

                </select>

                <i className="bi bi-chevron-down cp-select-arrow"></i>

              </div>

            </div>

          </div>

        </section>

        {/* PAYMENT INFORMATION */}

        <section className="cp-section">

          <div className="cp-section-heading">

            <div>
              <h3>Payment Information</h3>
              <p>Specify the payment period and payment deadline.</p>
            </div>

            <span className="cp-step-label">02</span>

          </div>

          <div className="cp-form-grid">

            {/* PAYMENT PERIOD */}

            <div className="cp-form-group">

              <label>
                Payment Period <span>*</span>
              </label>

              <div className="cp-input-wrapper">

                <i className="bi bi-calendar-month"></i>

                <select
                  value={form.period}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      period: e.target.value
                    });

                    setErrors({
                      ...errors,
                      period: ""
                    });
                  }}
                  className={errors.period ? "cp-invalid" : ""}
                >
                  <option value="">Select Payment Month</option>

                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}

                </select>

              </div>

              {errors.period && (
                <span className="cp-error-text">
                  {errors.period}
                </span>
              )}

            </div>

            {/* SESSION */}

            <div className="cp-form-group">

              <label>Academic Session</label>

              <div className="cp-input-wrapper cp-disabled-wrapper">

                <i className="bi bi-calendar-check"></i>

                <input
                  type="text"
                  value={form.session}
                  disabled
                />

                <i className="bi bi-lock cp-lock-icon"></i>

              </div>

              <span className="cp-hint">
                Current academic session
              </span>

            </div>

            {/* LAST DATE */}

            <div className="cp-form-group">

              <label>
                Last Payment Date <span>*</span>
              </label>

              <div className="cp-input-wrapper">

                <i className="bi bi-calendar-event"></i>

                <input
                  type="date"
                  value={form.lastdate}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      lastdate: e.target.value
                    });

                    setErrors({
                      ...errors,
                      lastdate: ""
                    });
                  }}
                  className={errors.lastdate ? "cp-invalid" : ""}
                />

              </div>

              {errors.lastdate && (
                <span className="cp-error-text">
                  {errors.lastdate}
                </span>
              )}

            </div>

          </div>

        </section>

        {/* STUDENT SELECTION */}

        <section className="cp-section cp-student-section">

          <div className="cp-section-heading cp-student-heading">

            <div>
              <h3>Select Students</h3>
              <p>
                Choose the students for whom this payment will be generated.
              </p>
            </div>

            <span className="cp-step-label">03</span>

          </div>

          {/* STUDENT TOOLBAR */}

          <div className="cp-student-toolbar">

            <div className="cp-student-toolbar-left">

              <div className="cp-selected-icon">
                <i className="bi bi-person-check-fill"></i>
              </div>

              <div>
                <strong>
                  {selectedIds.length} Students Selected
                </strong>

                <span>
                  Out of {tableData.length} available students
                </span>
              </div>

            </div>

            <div className="cp-selected-badge">
              {tableData.length > 0
                ? `${Math.round(
                    (selectedIds.filter((id) =>
                      visibleIds.includes(id)
                    ).length / tableData.length) * 100
                  )}% Selected`
                : "0% Selected"}
            </div>

          </div>

          {/* VALIDATION */}

          {errors.students && (
            <div className="cp-student-error">
              <i className="bi bi-exclamation-circle"></i>
              {errors.students}
            </div>
          )}

          {/* LOADING */}

          {loading ? (

            <div className="cp-loading">
              <span className="cp-loader"></span>

              <strong>Loading Students</strong>

              <p>
                Please wait while we fetch student records...
              </p>
            </div>

          ) : tableData.length === 0 ? (

            <div className="cp-empty-state">

              <div className="cp-empty-icon">
                <i className="bi bi-people"></i>
              </div>

              <h3>No Students Found</h3>

              <p>
                {filterEnabled
                  ? "Select a class to display its students."
                  : "There are no students with tuition or transport fees."}
              </p>

            </div>

          ) : (

            <div className="cp-table-container">

              <DataTable
                columns={columns}
                data={tableData}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 25, 50]}
                highlightOnHover
                responsive
                customStyles={customStyles}
                persistTableHead
                noDataComponent="No students available."
              />

            </div>

          )}

          {/* FEE BREAKDOWN */}

          <div className="cp-fee-breakdown">

            <div className="cp-breakdown-item">
              <span>Tuition Fee</span>

              <strong>
                ₹{totalTuition.toLocaleString("en-IN")}
              </strong>
            </div>

            <div className="cp-breakdown-item">
              <span>Transport Fee</span>

              <strong>
                ₹{totalTransport.toLocaleString("en-IN")}
              </strong>
            </div>

            <div className="cp-breakdown-total">
              <span>Total Selected Fee</span>

              <strong>
                ₹{totalAmount.toLocaleString("en-IN")}
              </strong>
            </div>

          </div>

        </section>

        {/* ACTION FOOTER */}

        <div className="cp-action-footer">

          <div className="cp-footer-note">
            <i className="bi bi-shield-check"></i>

            <span>
              Review all details before creating the payment.
            </span>
          </div>

          <div className="cp-action-buttons">

            <button
              type="button"
              className="cp-cancel-btn"
              onClick={() =>
                navigate("/dashboard/FeeComponent/AdminViewPayment")
              }
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="button"
              className="cp-submit-btn"
              onClick={handleSubmit}
              disabled={submitting || loading}
            >
              {submitting ? (
                <>
                  <span className="cp-button-loader"></span>
                  Creating Payment...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle-fill"></i>
                  Create Payment
                </>
              )}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
