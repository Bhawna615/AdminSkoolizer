import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useNavigate, useLocation } from "react-router-dom";
import "./AdminViewPayment.css";

const API = "http://localhost/kkblossom/api.php/Adminapi/AdminPanelFee/";

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

  // ✅ MONTH LIST
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
    axios.get(API + "getClasses").then((res) => {
      setClasses(res.data || []);
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
              session: sessionParam, // 👈 ADD
            }
          : sessionParam
            ? { session: sessionParam } // 👈 only session filter
            : {},
      });

      setPayments(res.data.data || []);
    } catch (err) {
      console.error(err);
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
      const diff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
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
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "payments.csv";
    link.click();
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    { name: "ID", selector: (row) => row.feeid, sortable: true },
    { name: "Txn ID", selector: (row) => row.razorpay_order_id },
    { name: "EasePay", selector: (row) => row.easepay_id },
    { name: "Student", selector: (row) => row.studentname },
    { name: "Class", selector: (row) => row.class },
    { name: "Adm No", selector: (row) => row.admission_number },
    { name: "Adm Fee", selector: (row) => row.admission_fee },
    { name: "Annual", selector: (row) => row.annual_fee },
    { name: "Tuition", selector: (row) => row.tuition_fee },
    { name: "Transport", selector: (row) => row.transport_fee },
    { name: "Amount", selector: (row) => row.amount },
    { name: "Last Date", selector: (row) => row.lastdate },
    { name: "Period", selector: (row) => row.period },
    {
      name: "Status",
      cell: (row) => (row.status ? "Paid" : "Pending"),
    },
    { name: "Mode", selector: (row) => row.payment_mode },
    {
      name: "Late Fee",
      cell: (row) => calculateLateFee(row),
    },
    { name: "Paid", selector: (row) => row.amount_paid },
    { name: "Paid On", selector: (row) => row.paidondate },
    { name: "Session", selector: (row) => row.session },
    { name: "Remarks", selector: (row) => row.remarks },

    {
      name: "Actions",
      cell: (row) => (
        <div style={{ display: "flex", gap: "8px" }}>
          {row.status == 1 || row.status === true ? (
            <>
              {/* ✅ PAID */}
              <button onClick={() => handleReceipt(row.feeid)}>🧾</button>
              <button onClick={() => handleEditPaid(row.feeid)}>✏️</button>
            </>
          ) : (
            <>
              {/* ✅ PENDING */}
              <button
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
    },
  ];

  return (
    <div className="container">
      {/* FILTER */}
      <div className="filter-bar">
        <label className="filter-toggle">
          Enable Filter
          <input
            type="checkbox"
            checked={filters.enabled}
            onChange={(e) =>
              setFilters({ ...filters, enabled: e.target.checked })
            }
          />
        </label>

        <select
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
        >
          <option>{new Date().getFullYear()}</option>
          <option>{new Date().getFullYear() - 1}</option>
        </select>

        {/* ✅ UPDATED MONTH DROPDOWN */}
        <select
          value={filters.month}
          onChange={(e) => setFilters({ ...filters, month: e.target.value })}
        >
          <option value="">Select Month</option>
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        {/* CLASS */}
        <select
          value={filters.class}
          onChange={(e) => setFilters({ ...filters, class: e.target.value })}
        >
          <option value="">Select Class</option>
          {classes.map((c, i) => (
            <option key={i} value={c.Classname}>
              {c.Classname}
            </option>
          ))}
        </select>
      </div>

      <button onClick={exportCSV}>Export CSV</button>

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
      />
    </div>
  );
}
