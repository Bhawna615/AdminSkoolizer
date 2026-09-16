
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./ViewPayments.css";

const BASE_URL =
  "http://localhost/kkblossom/api.php/Adminapi/AdminFee/";

const ViewPayments = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [payments, setPayments] = useState([]);
  const [classes, setClasses] = useState([]);

  const [session, setSession] = useState("2026");
  const [className, setClassName] = useState("NURSERY");
  const [month, setMonth] = useState("March");

  const [enableFilter, setEnableFilter] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [entryCount, setEntryCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  /* SUCCESS MESSAGE */
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMsg(location.state.message);

      const timer = setTimeout(() => {
        setSuccessMsg("");
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  /* SEARCH */
  const filteredData = payments.filter((item) => {
    const searchVal = searchTerm.toLowerCase();

    return (
      item.studentname?.toLowerCase().includes(searchVal) ||
      item.feeid?.toString().includes(searchVal) ||
      item.admission_number?.toLowerCase().includes(searchVal)
    );
  });

  const indexOfLast = currentPage * entryCount;
  const indexOfFirst = indexOfLast - entryCount;

  const displayedData = filteredData.slice(
    indexOfFirst,
    indexOfLast
  );

  const totalPages = Math.ceil(
    filteredData.length / entryCount
  );

  /* INITIAL LOAD */
  useEffect(() => {
    loadClasses();
    loadPayments();
  }, []);

  /* FILTER */
  useEffect(() => {
    if (enableFilter) {
      setCurrentPage(1);
      loadPayments();
    }
  }, [session, className, month, enableFilter]);

  const getSessionValue = (year) => {
    const nextYear = Number(year) + 1;
    return `${year}-${nextYear}`;
  };

  const loadPayments = async () => {
    try {
      let payload = {};

      if (enableFilter) {
        payload = {
          session: getSessionValue(session),
          class: className,
          month: month,
        };
      }

      const res = await axios.post(
        `${BASE_URL}filterBySessionAndClass`,
        payload
      );

      if (res.data && res.data.status) {
        setPayments(res.data.data || []);
      } else {
        setPayments([]);
        setSuccessMsg("No records found");
      }
    } catch (error) {
      console.log(error);
      setPayments([]);
      setSuccessMsg("Error loading data");
    }
  };

  const loadClasses = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}getClasses`
      );

      if (res.data && res.data.status) {
        setClasses(res.data.data || []);
      }
    } catch (error) {
      console.log(error);
      setClasses([]);
    }
  };

  const calculateLateFee = (row) => {
    if (row.status === 1) {
      return row.late_fee_paid || 0;
    }

    if (!row.lastdate) return 0;

    const today = new Date();
    const lastDate = new Date(row.lastdate);

    if (today > lastDate) {
      const diffTime = today - lastDate;
      const diffDays = Math.floor(
        diffTime / (1000 * 60 * 60 * 24)
      );

      return diffDays > 0 ? (diffDays - 1) * 10 : 0;
    }

    return 0;
  };

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

  /* EXPORT CSV */
  const exportToCSV = () => {
    const headers = [
      "PaymentID",
      "Transaction Id",
      "EasePay Id",
      "Student Name",
      "Class",
      "Admission No",
      "Admission Fee",
      "Annual Fee",
      "Tuition Fee",
      "Transport Fee",
      "Amount",
      "Last Date",
      "Period",
      "Status",
      "Payment Mode",
      "Late Fee",
      "Amount Paid",
      "Paid On",
      "Session",
      "Remarks",
    ];

    const rows = displayedData.map((row) => [
      row.feeid,
      row.razorpay_order_id,
      row.easepay_id,
      row.studentname,
      row.class,
      row.admission_number,
      row.admission_fee,
      row.annual_fee,
      row.tuition_fee,
      row.transport_fee,
      row.amount,
      row.lastdate,
      row.period,
      row.status === 1 ? "Paid" : "Pending",
      row.payment_mode,
      calculateLateFee(row),
      row.amount_paid,
      row.paidondate,
      row.session,
      row.remarks,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((e) => e.join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      "payments.csv"
    );

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="vp-page">

      {/* SUCCESS MESSAGE */}
      {successMsg && (
        <div className="vp-success-message">
          <span className="vp-success-icon">✓</span>
          {successMsg}
        </div>
      )}

      {/* PAGE HEADER */}
      <div className="vp-page-header">
        <div>
          <h2 className="vp-page-title">
            Student Payments
          </h2>

          <p className="vp-page-subtitle">
            Manage and view student fee payment records
          </p>
        </div>
      </div>

      {/* FILTER CARD */}
      <div className="vp-filter-card">

        <div className="vp-filter-header">
          <div className="vp-filter-heading">
            <span className="vp-filter-icon">
              <i className="las la-filter"></i>
            </span>

            <div>
              <h3>Payment Filters</h3>
              <p>
                Filter payments by session, month and class
              </p>
            </div>
          </div>

          <label className="vp-switch-label">
            <input
              type="checkbox"
              checked={enableFilter}
              onChange={(e) =>
                setEnableFilter(e.target.checked)
              }
            />

            <span className="vp-switch"></span>

            <span className="vp-switch-text">
              Enable Filter
            </span>
          </label>
        </div>

        <div className="vp-filter-divider"></div>

        <div className="vp-filter-grid">

          {/* YEAR */}
          <div className="vp-filter-group">
            <label>
              <i className="las la-calendar"></i>
              YEAR
            </label>

            <select
              value={session}
              onChange={(e) =>
                setSession(e.target.value)
              }
              disabled={!enableFilter}
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>

          {/* MONTH */}
          <div className="vp-filter-group">
            <label>
              <i className="las la-calendar-alt"></i>
              MONTH
            </label>

            <select
              value={month}
              onChange={(e) =>
                setMonth(e.target.value)
              }
              disabled={!enableFilter}
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* CLASS */}
          <div className="vp-filter-group">
            <label>
              <i className="las la-graduation-cap"></i>
              CLASS
            </label>

            <select
              value={className}
              onChange={(e) =>
                setClassName(e.target.value)
              }
              disabled={!enableFilter}
            >
              <option value="NURSERY">
                NURSERY
              </option>

              {classes.map((c, index) => (
                <option
                  key={index}
                  value={c.Classname}
                >
                  {c.Classname}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* TABLE TOOLBAR */}
      <div className="vp-table-toolbar">

        <div className="vp-entry-control">
          <span>Show</span>

          <select
            value={entryCount}
            onChange={(e) => {
              setEntryCount(
                Number(e.target.value)
              );
              setCurrentPage(1);
            }}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>

          <span>entries</span>
        </div>

        <div className="vp-search-control">
          <label>
            <i className="las la-search"></i>
            Search
          </label>

          <input
            type="text"
            placeholder="Student name, ID or admission no."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>

      </div>

      {/* TABLE */}
      <div className="vp-table-card">

        <div className="vp-table-wrapper">

          <table className="vp-payment-table">

            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Transaction ID</th>
                <th>EasePay ID</th>
                <th>Student Name</th>
                <th>Class</th>
                <th>Admission No.</th>
                <th>Admission Fee</th>
                <th>Annual Fee</th>
                <th>Tuition Fee</th>
                <th>Transport Fee</th>
                <th>Amount</th>
                <th>Last Date</th>
                <th>Period</th>
                <th>Status</th>
                <th>Payment Mode</th>
                <th>Late Fee</th>
                <th>Amount Paid</th>
                <th>Paid On</th>
                <th>Session</th>
                <th>Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {displayedData.length === 0 ? (

                <tr>
                  <td
                    colSpan="21"
                    className="vp-no-records"
                  >
                    <div className="vp-empty-state">
                      <i className="las la-file-invoice"></i>
                      <strong>
                        No Records Found
                      </strong>
                      <span>
                        No payment records match your search.
                      </span>
                    </div>
                  </td>
                </tr>

              ) : (

                displayedData.map((row) => (

                  <tr key={row.feeid}>

                    <td>
                      <span className="vp-payment-id">
                        #{row.feeid}
                      </span>
                    </td>

                    <td>
                      {row.razorpay_order_id || "-"}
                    </td>

                    <td>
                      {row.easepay_id || "-"}
                    </td>

                    <td className="vp-student-name">
                      {row.studentname}
                    </td>

                    <td>
                      <span className="vp-class-badge">
                        {row.class}
                      </span>
                    </td>

                    <td>
                      {row.admission_number}
                    </td>

                    <td>₹{row.admission_fee || 0}</td>

                    <td>₹{row.annual_fee || 0}</td>

                    <td>₹{row.tuition_fee || 0}</td>

                    <td>₹{row.transport_fee || 0}</td>

                    <td className="vp-amount">
                      ₹{row.amount || 0}
                    </td>

                    <td>
                      {row.lastdate || "-"}
                    </td>

                    <td>
                      {row.period || "-"}
                    </td>

                    <td>
                      {row.status === 1 ? (
                        <span className="vp-status vp-paid">
                          Paid
                        </span>
                      ) : (
                        <span className="vp-status vp-pending">
                          Pending
                        </span>
                      )}
                    </td>

                    <td>
                      {row.payment_mode || "-"}
                    </td>

                    <td>
                      ₹{calculateLateFee(row)}
                    </td>

                    <td className="vp-paid-amount">
                      ₹{row.amount_paid || 0}
                    </td>

                    <td>
                      {row.paidondate || "-"}
                    </td>

                    <td>
                      {row.session || "-"}
                    </td>

                    <td>
                      {row.remarks || "-"}
                    </td>

                    {/* ACTIONS */}
                    <td>
                      <div className="vp-action-buttons">

                        {row.status === 1 ? (
                          <>
                            <button
                              className="vp-action-btn vp-receipt-btn"
                              title="Receipt"
                              onClick={() =>
                                navigate(
                                  `/receipt/${row.feeid}`
                                )
                              }
                            >
                              <i className="las la-receipt"></i>
                            </button>

                            <button
                              className="vp-action-btn vp-edit-btn"
                              title="Edit"
                              onClick={() =>
                                navigate(
                                  `/edit-payment/${row.feeid}`
                                )
                              }
                            >
                              <i className="las la-pen"></i>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="vp-action-btn vp-accept-btn"
                              title="Accept Payment"
                              onClick={() =>
                                navigate(
                                  `/dashboard/StudentComponent/AcceptStudentFee/${row.feeid}`
                                )
                              }
                            >
                              <i className="la la-hand-holding-usd"></i>
                            </button>

                            <button
                              className="vp-action-btn vp-edit-btn"
                              title="Edit Payment"
                              onClick={() =>
                                navigate(
                                  `/dashboard/StudentComponent/UpdateStudentFee/${row.feeid}`
                                )
                              }
                            >
                              <i className="la la-pen"></i>
                            </button>
                          </>
                        )}

                      </div>
                    </td>

                  </tr>

                ))
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* PAGINATION */}
      <div className="vp-pagination-section">

        <div className="vp-showing-text">
          Showing{" "}
          <strong>
            {filteredData.length === 0
              ? 0
              : indexOfFirst + 1}
          </strong>{" "}
          to{" "}
          <strong>
            {Math.min(
              indexOfLast,
              filteredData.length
            )}
          </strong>{" "}
          of{" "}
          <strong>
            {filteredData.length}
          </strong>{" "}
          entries
        </div>

        <div className="vp-pagination-buttons">

          <button
            className="vp-page-btn"
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage(currentPage - 1)
            }
          >
            <i className="las la-angle-left"></i>
            Previous
          </button>

          <span className="vp-current-page">
            {currentPage}
          </span>

          <button
            className="vp-page-btn"
            disabled={
              currentPage === totalPages ||
              totalPages === 0
            }
            onClick={() =>
              setCurrentPage(currentPage + 1)
            }
          >
            Next
            <i className="las la-angle-right"></i>
          </button>

        </div>

      </div>

      {/* EXPORT */}
      <div className="vp-export-section">
        <button
          className="vp-export-btn"
          onClick={exportToCSV}
        >
          <i className="las la-file-csv"></i>
          Export to CSV
        </button>
      </div>

    </div>
  );
};

export default ViewPayments;
