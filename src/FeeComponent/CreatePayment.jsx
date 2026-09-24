import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import "./CreatePayment.css";
import { useNavigate } from "react-router-dom";

const API =
  "http://localhost/kkblossom/api.php/Adminapi/AdminPanelFee/";

export default function CreatePayment() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filterEnabled, setFilterEnabled] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const [form, setForm] = useState({
    period: "",
    lastdate: "",
    session: "2026-2027",
  });

  // =========================================================
  // MONTHS
  // =========================================================

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

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
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchStudents();
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
            const tuition =
              parseInt(s.tuition_fee) || 0;

            const transport =
              parseInt(s.transport_fee) || 0;

            return tuition + transport > 0;
          })
          .map((s) => s.id);

        setSelectedIds(allIds);
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Error loading students:",
          error
        );

        setLoading(false);
      });
  };

  // =========================================================
  // FILTER STUDENTS
  // =========================================================

  useEffect(() => {
    if (!filterEnabled) {
      fetchStudents();
      return;
    }

    if (!selectedClass) {
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
            const tuition =
              parseInt(s.tuition_fee) || 0;

            const transport =
              parseInt(s.transport_fee) || 0;

            return tuition + transport > 0;
          })
          .map((s) => s.id);

        setSelectedIds(allIds);
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Error filtering students:",
          error
        );

        setLoading(false);
      });
  }, [selectedClass, filterEnabled]);

  // =========================================================
  // VALIDATION
  // =========================================================

  const validate = () => {
    const newErrors = {};

    if (!form.period) {
      newErrors.period =
        "Payment Period is required";
    }

    if (!form.lastdate) {
      newErrors.lastdate =
        "Last Date is required";
    }

    if (selectedIds.length === 0) {
      newErrors.students =
        "Select at least one student";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================================================
  // CHECKBOX
  // =========================================================

  const handleCheckbox = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(
        selectedIds.filter((i) => i !== id)
      );
    } else {
      setSelectedIds([
        ...selectedIds,
        id,
      ]);
    }
  };

  // =========================================================
  // GET VISIBLE IDS
  // =========================================================

  const getVisibleIds = () => {
    return students
      .filter((s) => {
        const tuition =
          parseInt(s.tuition_fee) || 0;

        const transport =
          parseInt(s.transport_fee) || 0;

        return tuition + transport > 0;
      })
      .map((s) => s.id);
  };

  // =========================================================
  // SELECT ALL
  // =========================================================

  const handleSelectAll = () => {
    const visibleIds = getVisibleIds();

    const allVisibleSelected =
      visibleIds.length > 0 &&
      visibleIds.every((id) =>
        selectedIds.includes(id)
      );

    if (allVisibleSelected) {
      setSelectedIds(
        selectedIds.filter(
          (id) => !visibleIds.includes(id)
        )
      );
    } else {
      setSelectedIds([
        ...new Set([
          ...selectedIds,
          ...visibleIds,
        ]),
      ]);
    }
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    axios
      .post(API + "insertPayment", {
        ids: selectedIds,
        ...form,
      })
      .then((res) => {
        if (res.data.status) {
          alert(
            "Payment Added Successfully"
          );

          navigate(
            "/dashboard/FeeComponent/AdminViewPayment"
          );
        } else {
          alert(
            res.data.message ||
              "Failed to add payment"
          );
        }
      })
      .catch((error) => {
        console.error(
          "Error creating payment:",
          error
        );

        alert("Server Error");
      });
  };

  // =========================================================
  // TABLE
  // =========================================================

  const visibleIds = getVisibleIds();

  const columns = [
    {
      name: (
        <input
          className="kk-create-payment-checkbox"
          type="checkbox"
          onChange={handleSelectAll}
          checked={
            visibleIds.length > 0 &&
            visibleIds.every((id) =>
              selectedIds.includes(id)
            )
          }
        />
      ),

      cell: (row) => (
        <input
          className="kk-create-payment-checkbox"
          type="checkbox"
          checked={selectedIds.includes(row.id)}
          onChange={() =>
            handleCheckbox(row.id)
          }
        />
      ),

      width: "70px",
    },

    {
      name: "Roll",
      selector: (row) => row.Admno,
      sortable: true,
    },

    {
      name: "Name",
      selector: (row) => row.Name,
      sortable: true,
    },

    {
      name: "Class",
      selector: (row) => row.Class,
      sortable: true,
    },

    {
      name: "Tuition",

      selector: (row) =>
        parseInt(row.tuition_fee) || 0,

      cell: (row) =>
        `₹${parseInt(row.tuition_fee) || 0}`,
    },

    {
      name: "Transport",

      selector: (row) =>
        parseInt(row.transport_fee) || 0,

      cell: (row) =>
        `₹${parseInt(row.transport_fee) || 0}`,
    },

    {
      name: "Total",

      cell: (row) => {
        const tuition =
          parseInt(row.tuition_fee) || 0;

        const transport =
          parseInt(row.transport_fee) || 0;

        return (
          <strong>
            ₹{tuition + transport}
          </strong>
        );
      },
    },
  ];

  // =========================================================
  // TABLE DATA
  // =========================================================

  const tableData = students.filter((s) => {
    const tuition =
      parseInt(s.tuition_fee) || 0;

    const transport =
      parseInt(s.transport_fee) || 0;

    return tuition + transport > 0;
  });

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="kk-create-payment-page">

      {/* PAGE HEADER */}

      <div className="kk-create-payment-header">
        <div>
          <h1>Create Payment</h1>

          <p>
            Create a new fee payment for selected students
          </p>
        </div>
      </div>

      {/* MAIN CARD */}

      <div className="kk-create-payment-card">

        {/* CARD HEADER */}

        <div className="kk-create-payment-card-header">

          <div className="kk-create-payment-card-icon">
            ₹
          </div>

          <div>
            <h2>Payment Details</h2>

            <p>
              Configure payment information and select
              students for payment.
            </p>
          </div>

        </div>

        {/* FILTER SECTION */}

        <div className="kk-create-payment-filter-section">

          <div className="kk-create-payment-section-title">

            <h3>Student Filter</h3>

            <span>
              Filter students by class if required.
            </span>

          </div>

          <div className="kk-create-payment-filter-row">

            <div className="kk-create-payment-switch-group">

              <span className="kk-create-payment-switch-label">
                Enable Filter
              </span>

              <label className="kk-create-payment-switch">

                <input
                  type="checkbox"
                  checked={filterEnabled}
                  onChange={(e) =>
                    setFilterEnabled(
                      e.target.checked
                    )
                  }
                />

                <span className="kk-create-payment-slider"></span>

              </label>

            </div>

            <div className="kk-create-payment-filter-group">

              {/* <label>Select Class</label> */}

              <select
                value={selectedClass}
                onChange={(e) =>
                  setSelectedClass(
                    e.target.value
                  )
                }
                disabled={!filterEnabled}
              >

                <option value="">
                  Select Class
                </option>

                {classes.map((c, i) => (
                  <option
                    key={i}
                    value={c.Classname}
                  >
                    {c.Classname}
                  </option>
                ))}

              </select>

            </div>

          </div>

        </div>

        {/* PAYMENT INFORMATION */}

        <div className="kk-create-payment-details-section">

          <div className="kk-create-payment-section-title">

            <h3>Payment Information</h3>

            <span>
              Select the payment month and enter the last payment date.
            </span>

          </div>

          <div className="kk-create-payment-form">

            {/* PAYMENT PERIOD */}

            <div className="kk-create-payment-form-group">

              <label>
                Payment Period
                <span className="kk-create-payment-required">
                  *
                </span>
              </label>

              <select
                className="kk-create-payment-period-select"
                value={form.period}
                onChange={(e) =>
                  setForm({
                    ...form,
                    period: e.target.value,
                  })
                }
              >

                <option value="">
                  Select Month
                </option>

                {months.map((month) => (
                  <option
                    key={month}
                    value={month}
                  >
                    {month}
                  </option>
                ))}

              </select>

              {errors.period && (
                <span className="kk-create-payment-error">
                  {errors.period}
                </span>
              )}

            </div>

            {/* SESSION */}

            <div className="kk-create-payment-form-group">

              <label>Session</label>

              <input
                type="text"
                value={form.session}
                disabled
              />

            </div>

            {/* LAST DATE */}

            <div className="kk-create-payment-form-group">

              <label>
                Last Date
                <span className="kk-create-payment-required">
                  *
                </span>
              </label>

              <input
                type="date"
                value={form.lastdate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    lastdate: e.target.value,
                  })
                }
              />

              {errors.lastdate && (
                <span className="kk-create-payment-error">
                  {errors.lastdate}
                </span>
              )}

            </div>

          </div>

        </div>

        {/* STUDENT SECTION */}

        <div className="kk-create-payment-student-section">

          <div className="kk-create-payment-student-header">

            <div className="kk-create-payment-student-title">

              <h3>Select Students</h3>

              <p>
                Students with tuition or transport fees
                are shown below.
              </p>

            </div>

            <div className="kk-create-payment-student-count">
              {selectedIds.length} Selected
            </div>

          </div>

          {errors.students && (
            <div className="kk-create-payment-student-error">
              {errors.students}
            </div>
          )}

          {loading ? (

            <div className="kk-create-payment-loading">

              <span className="kk-create-payment-loader"></span>

              Loading students...

            </div>

          ) : (

            <div className="kk-create-payment-table-wrapper">

              <DataTable
                columns={columns}
                data={tableData}
                pagination
                highlightOnHover
                striped
                responsive
              />

            </div>

          )}

        </div>

        {/* ACTION BAR */}

        <div className="kk-create-payment-action-bar">

          <button
            type="button"
            className="kk-create-payment-cancel-btn"
            onClick={() =>
              navigate(
                "/dashboard/FeeComponent/AdminViewPayment"
              )
            }
          >
            Cancel
          </button>

          <button
            type="button"
            className="kk-create-payment-submit-btn"
            onClick={handleSubmit}
          >
            ✓ Create Payment
          </button>

        </div>

      </div>

    </div>
  );
}