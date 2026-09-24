import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useNavigate, useLocation } from "react-router-dom";
import "./AdminViewPayment.css";

const API =
  "http://localhost/kkblossom/api.php/Adminapi/AdminPanelFee/";

export default function AdminViewPayment() {
  const [payments, setPayments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const sessionParam = params.get("session");

  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: "",
    class: "",
    enabled: false,
  });

  const months = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
  ];

  // ================= LOAD CLASSES =================
  useEffect(() => {
    axios
      .get(API + "getClasses")
      .then((res) => {
        setClasses(res.data || []);
      })
      .catch((err) => {
        console.error("Error loading classes:", err);
      });
  }, []);

  // ================= FETCH PAYMENTS =================
  const fetchPayments = async () => {
    setLoading(true);

    try {
      const res = await axios.get(API + "getPayments", {
        params: filters.enabled
          ? {
              year: filters.year,
              month: filters.month,
              class: filters.class,
              session: sessionParam,
            }
          : sessionParam
            ? { session: sessionParam }
            : {},
      });

      setPayments(res.data.data || []);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setPayments([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
  }, [filters, location.state?.refresh]);

  // ================= LATE FEE =================
  const calculateLateFee = (row) => {
    if (row.status) return row.late_fee_paid || 0;

    const today = new Date();
    const lastDate = new Date(row.lastdate);

    if (today > lastDate) {
      const diff = Math.floor(
        (today - lastDate) / (1000 * 60 * 60 * 24),
      );

      return (diff - 1) * 10;
    }

    return 0;
  };

  // ================= ACTIONS =================
  const handleReceipt = (id) => {
    window.open(`/FeeComponent/FeeReceipt/${id}`, "_blank");
  };

  const handleEditPaid = (id) => {
    navigate(`/dashboard/FeeComponent/EditPaidFee/${id}`);
  };

  // ================= CSV =================
  const exportCSV = () => {
    const headers = [
      "ID",
      "Transaction",
      "EasePay",
      "Student",
      "Class",
      "Admission",
      "Admission Fee",
      "Annual Fee",
      "Tuition",
      "Transport",
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

    const rows = payments.map((p) => [
      p.feeid,
      p.razorpay_order_id,
      p.easepay_id,
      p.studentname,
      p.class,
      p.admission_number,
      p.admission_fee,
      p.annual_fee,
      p.tuition_fee,
      p.transport_fee,
      p.amount,
      p.lastdate,
      p.period,
      p.status ? "Paid" : "Pending",
      p.payment_mode,
      calculateLateFee(p),
      p.amount_paid,
      p.paidondate,
      p.session,
      p.remarks,
    ]);

    const csv =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((e) => e.join(","))
        .join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "payments.csv";
    link.click();
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    {
      name: "ID",
      selector: (row) => row.feeid,
      sortable: true,
      width: "70px",
    },
    {
      name: "Txn ID",
      selector: (row) => row.razorpay_order_id,
      width: "150px",
    },
    {
      name: "EasePay",
      selector: (row) => row.easepay_id,
      width: "120px",
    },
    {
      name: "Student",
      selector: (row) => row.studentname,
      sortable: true,
      width: "170px",
    },
    {
      name: "Class",
      selector: (row) => row.class,
      width: "100px",
    },
    {
      name: "Adm No",
      selector: (row) => row.admission_number,
      width: "110px",
    },
    {
      name: "Adm Fee",
      selector: (row) => row.admission_fee,
      width: "100px",
    },
    {
      name: "Annual",
      selector: (row) => row.annual_fee,
      width: "90px",
    },
    {
      name: "Tuition",
      selector: (row) => row.tuition_fee,
      width: "90px",
    },
    {
      name: "Transport",
      selector: (row) => row.transport_fee,
      width: "100px",
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
      sortable: true,
      width: "100px",
    },
    {
      name: "Last Date",
      selector: (row) => row.lastdate,
      width: "120px",
    },
    {
      name: "Period",
      selector: (row) => row.period,
      width: "110px",
    },
    {
      name: "Status",
      cell: (row) => (
        <span
          className={
            row.status
              ? "kk-view-payment-status kk-view-payment-status-paid"
              : "kk-view-payment-status kk-view-payment-status-pending"
          }
        >
          {row.status ? "Paid" : "Pending"}
        </span>
      ),
      width: "110px",
    },
    {
      name: "Mode",
      selector: (row) => row.payment_mode,
      width: "110px",
    },
    {
      name: "Late Fee",
      cell: (row) => (
        <span className="kk-view-payment-late-fee">
          ₹{calculateLateFee(row)}
        </span>
      ),
      width: "100px",
    },
    {
      name: "Paid",
      selector: (row) => row.amount_paid,
      width: "100px",
    },
    {
      name: "Paid On",
      selector: (row) => row.paidondate,
      width: "120px",
    },
    {
      name: "Session",
      selector: (row) => row.session,
      width: "110px",
    },
    {
      name: "Remarks",
      selector: (row) => row.remarks,
      width: "150px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="kk-view-payment-actions">
          {row.status == 1 || row.status === true ? (
            <>
              <button
                className="kk-view-payment-action-btn kk-view-payment-receipt-btn"
                title="View Receipt"
                onClick={() => handleReceipt(row.feeid)}
              >
                🧾
              </button>

              <button
                className="kk-view-payment-action-btn kk-view-payment-edit-btn"
                title="Edit Paid Fee"
                onClick={() => handleEditPaid(row.feeid)}
              >
                ✏️
              </button>
            </>
          ) : (
            <>
              <button
                className="kk-view-payment-action-btn kk-view-payment-pay-btn"
                title="Accept Payment"
                onClick={() =>
                  navigate(
                    `/dashboard/FeeComponent/AcceptPayment/${row.feeid}`,
                    {
                      state: { refresh: Date.now() },
                    },
                  )
                }
              >
                💰
              </button>

              <button
                className="kk-view-payment-action-btn kk-view-payment-edit-btn"
                title="Edit Student Fee"
                onClick={() =>
                  navigate(
                    `/dashboard/FeeComponent/EditStudentFee/${row.feeid}`,
                  )
                }
              >
                ✏️
              </button>
            </>
          )}
        </div>
      ),
      width: "130px",
      center: true,
    },
  ];

  return (
    <div className="kk-view-payment-page">

      {/* ================= HEADER ================= */}
      <div className="kk-view-payment-header">
        <div>
          <h1>View Payments</h1>
          <p>Manage and monitor student fee payments</p>
        </div>

        <div className="kk-view-payment-header-right">
          <div className="kk-view-payment-count">
            <span>Total Payments</span>
            <strong>{payments.length}</strong>
          </div>
        </div>
      </div>

      {/* ================= FILTER CARD ================= */}
      <div className="kk-view-payment-card">

        <div className="kk-view-payment-card-header">
          <div className="kk-view-payment-card-title">
            <div className="kk-view-payment-card-icon">
              <i class="bi bi-search"></i>
            </div>

            <div>
              <h2>Payment Filters</h2>
              <p>Filter payment records by year, month or class</p>
            </div>
          </div>

          {/* FILTER SWITCH */}
          <label className="kk-view-payment-switch-wrapper">
            <span>Enable Filter</span>

            <input
              type="checkbox"
              checked={filters.enabled}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  enabled: e.target.checked,
                })
              }
            />

            <span className="kk-view-payment-switch"></span>
          </label>
        </div>

        <div
          className={`kk-view-payment-filter-content ${
            filters.enabled
              ? "kk-view-payment-filter-active"
              : "kk-view-payment-filter-disabled"
          }`}
        >
          {/* YEAR */}
          <div className="kk-view-payment-form-group">
            <label>Year</label>

            <select
              value={filters.year}
              disabled={!filters.enabled}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  year: e.target.value,
                })
              }
            >
              <option value={new Date().getFullYear()}>
                {new Date().getFullYear()}
              </option>

              <option value={new Date().getFullYear() - 1}>
                {new Date().getFullYear() - 1}
              </option>
            </select>
          </div>

          {/* MONTH */}
          <div className="kk-view-payment-form-group">
            <label>Month</label>

            <select
              value={filters.month}
              disabled={!filters.enabled}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  month: e.target.value,
                })
              }
            >
              <option value="">Select Month</option>

              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* CLASS */}
          <div className="kk-view-payment-form-group">
            <label>Class</label>

            <select
              value={filters.class}
              disabled={!filters.enabled}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  class: e.target.value,
                })
              }
            >
              <option value="">Select Class</option>

              {classes.map((c, i) => (
                <option key={i} value={c.Classname}>
                  {c.Classname}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ================= TABLE CARD ================= */}
      <div className="kk-view-payment-table-card">

        <div className="kk-view-payment-table-header">
          <div>
            <h2>Payment Records</h2>
            <p>
              {payments.length} payment
              {payments.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <button
            className="kk-view-payment-export-btn"
            onClick={exportCSV}
          >
            <span>↓</span>
            Export CSV
          </button>
        </div>

        <div className="kk-view-payment-table-wrapper">
          <DataTable
            columns={columns}
            data={payments}
            progressPending={loading}
            pagination
            highlightOnHover
            striped
            dense
            fixedHeader
            fixedHeaderScrollHeight="500px"
            responsive
            noDataComponent={
              <div className="kk-view-payment-empty">
                <div className="kk-view-payment-empty-icon">
                  📋
                </div>

                <h3>No Payment Records</h3>

                <p>
                  There are no payment records available for the
                  selected filters.
                </p>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}