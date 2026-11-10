
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminViewStudent.css";

const AdminViewStudent = () => {
  const [students, setStudents] = useState([]);
  const [feeStudents, setFeeStudents] = useState([]);
  const [paymentRecords, setPaymentRecords] = useState([]);

  const [feeTotals, setFeeTotals] = useState({
    tuition_fee: 0,
    annual_fee: 0,
    admission_fee: 0,
    transport_fee: 0,
    total_fees: 0,
  });

  const [feeLoading, setFeeLoading] = useState(true);
  const [feeError, setFeeError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(true);
  const [paymentError, setPaymentError] = useState("");

  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClass, setSelectedClass] = useState("");
  const [enableFilter, setEnableFilter] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [deleteStudent, setDeleteStudent] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();

  const API_BASE = "http://localhost/kkblossom/api.php/Adminapi/";

  // ================= CHART COLORS =================

  const chartColors = [
    "#A381F9", "#F07878", "#72B7E8", "#65C9A7",
    "#F5B66B", "#E98BBE", "#929FF5", "#9BCB78",
    "#F28CA8", "#B995D6", "#F2A98B", "#65BFC3",
    "#C49A78", "#82BCE8", "#E98982", "#B5C879",
    "#E69BCB", "#83C5D5", "#B09AE8", "#79C69A",
    "#E8C85A", "#8FA9CC", "#F28B8B", "#A6CF75",
    "#C58AE8", "#70B5C9", "#F2A653", "#71BFAE",
    "#C19AE8", "#83B987",
  ];

  useEffect(() => {
    fetchStudents();
    fetchFees();
    fetchPayments();
  }, []);

  // ================= HELPERS =================

  const toAmount = (value) => {
    if (
      value === null ||
      value === undefined ||
      String(value).trim() === ""
    ) {
      return 0;
    }

    // Handles values such as "₹ 1,500"
    const cleaned = String(value).replace(/[₹,\s]/g, "");
    const amount = Number(cleaned);

    return Number.isFinite(amount) && amount >= 0 ? amount : 0;
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  // ================= FETCH STUDENTS =================

  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        API_BASE + "AdminStudent/display"
      );

      const studentData = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      console.log("Student API sample:", studentData[0] || "No students");

      setStudents(studentData);
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
    }
  };

  // ================= FETCH ASSIGNED FEES =================

  const fetchFees = async () => {
    setFeeLoading(true);
    setFeeError("");

    try {
      const res = await axios.get(
        API_BASE + "AdminStudent/getFees"
      );

      console.log("Fee API response:", res.data);

      if (
        res.data?.status !== true ||
        !Array.isArray(res.data?.data)
      ) {
        throw new Error(
          res.data?.message || "Invalid fee API response"
        );
      }

      const normalizedFees = res.data.data.map((student) => {
        const tuition = toAmount(student.tuition_fee);
        const annual = toAmount(student.annual_fee);
        const admission = toAmount(student.admission_fee);
        const transport = toAmount(student.transport_fee);

        const total =
          student.total_fees !== null &&
          student.total_fees !== undefined &&
          String(student.total_fees).trim() !== ""
            ? toAmount(student.total_fees)
            : tuition + annual + admission + transport;

        return {
          ...student,
          tuition_fee: tuition,
          annual_fee: annual,
          admission_fee: admission,
          transport_fee: transport,
          total_fees: total,
        };
      });

      const totals = normalizedFees.reduce(
        (acc, student) => {
          acc.tuition_fee += student.tuition_fee;
          acc.annual_fee += student.annual_fee;
          acc.admission_fee += student.admission_fee;
          acc.transport_fee += student.transport_fee;
          acc.total_fees += student.total_fees;
          return acc;
        },
        {
          tuition_fee: 0,
          annual_fee: 0,
          admission_fee: 0,
          transport_fee: 0,
          total_fees: 0,
        }
      );

      setFeeStudents(normalizedFees);
      setFeeTotals(totals);

      console.log("Normalized fee totals:", totals);
    } catch (error) {
      console.error("Error fetching fee data:", error);

      setFeeStudents([]);
      setFeeTotals({
        tuition_fee: 0,
        annual_fee: 0,
        admission_fee: 0,
        transport_fee: 0,
        total_fees: 0,
      });

      setFeeError(
        error.response?.data?.message ||
          error.message ||
          "Unable to load fee information."
      );
    } finally {
      setFeeLoading(false);
    }
  };

  // ================= FETCH PAYMENT RECORDS =================
  // Existing payment endpoint:
  // AdminPanelFee/getPayments
  //
  // Recognized payment fields include:
  // amount_paid, amount, status, admission_number,
  // studentname, class, payment_mode, session.

  const fetchPayments = async () => {
    setPaymentLoading(true);
    setPaymentError("");

    try {
      const res = await axios.get(
        API_BASE + "AdminPanelFee/getPayments"
      );

      console.log("Payment API response:", res.data);

      const records = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      if (
        res.data?.status === false ||
        res.data?.status === "false"
      ) {
        throw new Error(
          res.data?.message || "Unable to retrieve payment records."
        );
      }

      setPaymentRecords(records);
    } catch (error) {
      console.error("Error fetching payment records:", error);
      setPaymentRecords([]);
      setPaymentError(
        error.response?.data?.message ||
          error.message ||
          "Unable to load payment records."
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  // ================= PAYMENT TOTALS =================
  // Only successful/paid transactions are counted as received.
  // Failed, cancelled, refunded and pending transactions are excluded.

  const paymentAnalytics = useMemo(() => {
    const records = Array.isArray(paymentRecords)
      ? paymentRecords
      : [];

    const successfulStatuses = [
      "paid",
      "success",
      "successful",
      "completed",
      "captured",
      "verified",
    ];

    const excludedStatuses = [
      "failed",
      "failure",
      "cancelled",
      "canceled",
      "refunded",
      "refund",
      "pending",
      "unpaid",
    ];

    let totalPaid = 0;
    let successfulTransactions = 0;
    let pendingTransactions = 0;
    let failedTransactions = 0;

    records.forEach((record) => {
      const status = String(record?.status || "")
        .trim()
        .toLowerCase();

      const amountPaid = toAmount(record?.amount_paid);
      const transactionAmount = toAmount(record?.amount);

      const isExcluded = excludedStatuses.some((item) =>
        status.includes(item)
      );

      const isSuccessful = successfulStatuses.some((item) =>
        status.includes(item)
      );

      if (isExcluded) {
        if (status.includes("pending") || status.includes("unpaid")) {
          pendingTransactions += 1;
        } else {
          failedTransactions += 1;
        }
        return;
      }

      // Prefer amount_paid when supplied.
      // Fall back to amount only for a recognized successful status.
      // If status is missing, count amount_paid only when it is positive.
      if (isSuccessful) {
        totalPaid += amountPaid > 0 ? amountPaid : transactionAmount;
        successfulTransactions += 1;
      } else if (!status && amountPaid > 0) {
        totalPaid += amountPaid;
        successfulTransactions += 1;
      } else if (!status && transactionAmount > 0) {
        // Unknown status: do not assume the transaction was paid.
        pendingTransactions += 1;
      }
    });

    const assignedFees = toAmount(feeTotals.total_fees);
    const pendingFees = Math.max(assignedFees - totalPaid, 0);
    const collectionPercentage =
      assignedFees > 0
        ? Math.min((totalPaid / assignedFees) * 100, 100)
        : 0;

    return {
      assignedFees,
      totalPaid,
      pendingFees,
      successfulTransactions,
      pendingTransactions,
      failedTransactions,
      totalTransactions: records.length,
      collectionPercentage,
    };
  }, [paymentRecords, feeTotals.total_fees]);

  // ================= DELETE STUDENT =================

  const handleDelete = (id) => {
    const student = students.find(
      (student) => String(student.id) === String(id)
    );

    setActiveAction(null);
    setDeleteStatus("");
    setDeleteLoading(false);

    setDeleteStudent({
      id,
      name: student?.Name || "this student",
    });
  };

  const confirmDeleteStudent = async () => {
    if (!deleteStudent?.id || deleteLoading) return;

    setDeleteLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE}AdminStudent/delete/${deleteStudent.id}`
      );

      if (
        response.data.status === true ||
        response.data.status === "true"
      ) {
        setStudents((prev) =>
          prev.filter(
            (student) =>
              String(student.id) !== String(deleteStudent.id)
          )
        );

        setFeeStudents((prev) =>
          prev.filter(
            (student) =>
              String(student.id) !== String(deleteStudent.id)
          )
        );

        setDeleteStatus("success");
        setDeleteLoading(false);

        await Promise.all([
          fetchStudents(),
          fetchFees(),
          fetchPayments(),
        ]);

        setTimeout(() => {
          setDeleteStudent(null);
          setDeleteStatus("");
        }, 2500);
      } else {
        setDeleteStatus("error");
        setDeleteLoading(false);
      }
    } catch (error) {
      console.error("Delete Error:", error);
      setDeleteStatus("error");
      setDeleteLoading(false);
    }
  };

  // ================= CLASS NORMALIZATION =================

  const normalizeClass = (value) => {
    const className = String(value || "").trim();

    if (!className) return "Unassigned";

    const cleaned = className.replace(/^class\s+/i, "").trim();

    const sectionMatch = cleaned.match(
      /^(\d+)\s*[-/ ]\s*[A-Za-z]$/
    );

    if (sectionMatch) return `Class ${sectionMatch[1]}`;

    const numberMatch = cleaned.match(/^(\d+)$/);

    if (numberMatch) return `Class ${numberMatch[1]}`;

    return className;
  };

  // ================= FILTERED TABLE DATA =================

  const filteredStudents = useMemo(() => {
    let data = Array.isArray(students) ? [...students] : [];

    if (enableFilter && selectedClass) {
      data = data.filter(
        (student) => student.Class === selectedClass
      );
    }

    if (search.trim()) {
      const searchValue = search.toLowerCase().trim();

      data = data.filter((student) => {
        const name = String(student?.Name || "").toLowerCase();
        const rollNo = String(student?.Rollno || "").toLowerCase();
        const admissionNo = String(student?.Admno || "").toLowerCase();

        return (
          name.includes(searchValue) ||
          rollNo.includes(searchValue) ||
          admissionNo.includes(searchValue)
        );
      });
    }

    data.sort((a, b) =>
      String(a?.Name || "").localeCompare(
        String(b?.Name || ""),
        undefined,
        { sensitivity: "base" }
      )
    );

    return data;
  }, [students, search, selectedClass, enableFilter]);

  // ================= SCHOOL-WIDE ANALYTICS =================

  const analytics = useMemo(() => {
    const allStudents = Array.isArray(students) ? students : [];
    const totalStudents = allStudents.length;

    const classCounts = allStudents.reduce((acc, student) => {
      const className = normalizeClass(student?.Class);
      acc[className] = (acc[className] || 0) + 1;
      return acc;
    }, {});

    const classDistribution = Object.entries(classCounts)
      .map(([className, count]) => ({
        className,
        count,
        percentage: totalStudents
          ? (count / totalStudents) * 100
          : 0,
      }))
      .sort((a, b) => {
        const aNumber = Number(a.className.match(/\d+/)?.[0]);
        const bNumber = Number(b.className.match(/\d+/)?.[0]);
        const aHasNumber = /\d+/.test(a.className);
        const bHasNumber = /\d+/.test(b.className);

        if (aHasNumber && bHasNumber) return aNumber - bNumber;
        if (aHasNumber) return -1;
        if (bHasNumber) return 1;

        return a.className.localeCompare(b.className);
      });

    let angle = 0;

    const pieSlices = classDistribution.map((item, index) => {
      const startAngle = angle;
      const sliceAngle = totalStudents
        ? (item.count / totalStudents) * 360
        : 0;

      angle += sliceAngle;

      return {
        ...item,
        color: chartColors[index % chartColors.length],
        startAngle,
        endAngle: angle,
      };
    });

    const pieGradient = pieSlices.length
      ? `conic-gradient(${pieSlices
          .map(
            (item) =>
              `${item.color} ${item.startAngle}deg ${item.endAngle}deg`
          )
          .join(", ")})`
      : "#eeeaf8";

    const feeRecords = Array.isArray(feeStudents) ? feeStudents : [];
    const totalFees = feeTotals.total_fees;

    const feeBreakdown = [
      {
        key: "tuition_fee",
        label: "Tuition Fee",
        amount: feeTotals.tuition_fee,
        color: "#6C4CE8",
      },
      {
        key: "annual_fee",
        label: "Annual Fee",
        amount: feeTotals.annual_fee,
        color: "#21B58A",
      },
      {
        key: "admission_fee",
        label: "Admission Fee",
        amount: feeTotals.admission_fee,
        color: "#72B7E8",
      },
      {
        key: "transport_fee",
        label: "Transport Fee",
        amount: feeTotals.transport_fee,
        color: "#F0A44B",
      },
    ];

    const feeBreakdownWithPercentages = feeBreakdown.map((item) => ({
      ...item,
      percentage:
        totalFees > 0 ? (item.amount / totalFees) * 100 : 0,
    }));

    return {
      totalStudents,
      classDistribution,
      classCount: classDistribution.length,
      pieSlices,
      pieGradient,
      hasFeeData: feeRecords.length > 0,
      feeRecordsCount: feeRecords.length,
      totalFees,
      feeBreakdown: feeBreakdownWithPercentages,
    };
  }, [students, feeStudents, feeTotals]);

  // ================= PAGINATION =================

  const totalPages = Math.ceil(filteredStudents.length / entries);
  const startIndex = (currentPage - 1) * entries;

  const paginatedStudents = filteredStudents.slice(
    startIndex,
    startIndex + entries
  );

  const classList = [
    ...new Set(students.map((student) => student.Class).filter(Boolean)),
  ].sort((a, b) => String(a).localeCompare(String(b)));

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  // ================= FEE COMPONENT LINE GRAPH =================

  const feeChart = useMemo(() => {
    const feeItems = analytics.feeBreakdown;
    const maxValue = Math.max(...feeItems.map((item) => item.amount), 1);

    const chartWidth = 560;
    const chartHeight = 250;
    const left = 66;
    const right = 20;
    const top = 24;
    const bottom = 58;

    const plotWidth = chartWidth - left - right;
    const plotHeight = chartHeight - top - bottom;

    const yFor = (value) =>
      top + plotHeight - (value / maxValue) * plotHeight;

    const points = feeItems.map((item, index) => {
      const x =
        left +
        (feeItems.length === 1
          ? plotWidth / 2
          : (index / (feeItems.length - 1)) * plotWidth);

      return { ...item, x, y: yFor(item.amount) };
    });

    const ticks = [0, 0.25, 0.5, 0.75, 1].map((fraction) => ({
      value: maxValue * fraction,
      y: yFor(maxValue * fraction),
    }));

    return {
      chartWidth,
      chartHeight,
      left,
      right,
      top,
      bottom,
      points,
      ticks,
      path: points
        .map(
          (point, index) =>
            `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
        )
        .join(" "),
    };
  }, [analytics.feeBreakdown]);

  return (
    <>
      {/* ================= DELETE POPUP ================= */}

      {deleteStudent && (
        <div className="student-delete-overlay">
          <div className="student-delete-popup">
            {!deleteStatus && (
              <>
                <div className="student-delete-icon">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                </div>

                <h2>Delete Student?</h2>

                <p>
                  Are you sure you want to delete{" "}
                  <strong>{deleteStudent.name}</strong>?
                  This action cannot be undone.
                </p>

                <div className="student-delete-buttons">
                  <button
                    type="button"
                    className="student-delete-cancel"
                    onClick={() => {
                      setDeleteStudent(null);
                      setDeleteStatus("");
                    }}
                    disabled={deleteLoading}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="student-delete-confirm"
                    onClick={confirmDeleteStudent}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </>
            )}

            {deleteStatus === "success" && (
              <>
                <div className="student-delete-success-icon">
                  <i className="bi bi-check-circle-fill"></i>
                </div>
                <h2>Deleted Successfully!</h2>
                <p>Student has been deleted successfully.</p>
                <div className="student-delete-loading"><span></span></div>
                <small>Updating student list...</small>
              </>
            )}

            {deleteStatus === "error" && (
              <>
                <div className="student-delete-error-icon">
                  <i className="bi bi-x-circle-fill"></i>
                </div>
                <h2>Delete Failed</h2>
                <p>Unable to delete the student. Please try again.</p>
                <button
                  type="button"
                  className="student-delete-cancel"
                  onClick={() => {
                    setDeleteStudent(null);
                    setDeleteStatus("");
                    setDeleteLoading(false);
                  }}
                >
                  Okay
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="admin-view-student-page">
        {/* ================= HEADER ================= */}

        <div className="admin-view-student-header">
          <div className="admin-view-student-header-left">
            <div className="admin-view-student-header-icon">
              <i className="bi bi-people-fill"></i>
            </div>
            <div>
              <h1>Students</h1>
              <p>Manage and view all registered students</p>
            </div>
          </div>

          <div className="admin-view-student-total">
            <span className="admin-view-student-total-icon">
              <i className="bi bi-person-check-fill"></i>
            </span>
            <div>
              <strong>{analytics.totalStudents}</strong>
              <small>Total School Strength</small>
            </div>
          </div>
        </div>

        {/* ================= FILTER CARD ================= */}

        <div className="admin-view-student-filter-card">
          <div className="admin-view-student-filter-top">
            <div className="admin-view-student-filter-title">
              <div className="admin-view-student-filter-icon">
                <i className="bi bi-funnel-fill"></i>
              </div>
              <div>
                <h3>Student Filters</h3>
                <p>Filter students by class</p>
              </div>
            </div>

            <label className="admin-view-student-toggle">
              <input
                type="checkbox"
                checked={enableFilter}
                onChange={() => {
                  setEnableFilter(!enableFilter);
                  setCurrentPage(1);
                }}
              />
              <span className="admin-view-student-toggle-slider"></span>
              <span className="admin-view-student-toggle-text">
                Enable Filter
              </span>
            </label>
          </div>

          <div className="admin-view-student-filter-body">
            <div className="admin-view-student-field">
              <label>
                <i className="bi bi-mortarboard-fill"></i>
                Class
              </label>
              <select
                value={selectedClass}
                disabled={!enableFilter}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Classes</option>
                {classList.map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            <div className="admin-view-student-filter-info">
              <i className="bi bi-info-circle-fill"></i>
              <span>
                {enableFilter
                  ? selectedClass
                    ? `Showing students from ${selectedClass}`
                    : "Select a class to filter students"
                  : "Enable the filter to select a class"}
              </span>
            </div>
          </div>
        </div>

        {/* ================= SCHOOL ANALYTICS ================= */}

        <section className="student-analytics-section">
          <div className="student-analytics-header">
            <div className="student-analytics-heading">
              <div className="student-analytics-heading-icon">
                <i className="bi bi-bar-chart-line-fill"></i>
              </div>
              <div>
                <h2>School Analytics</h2>
                <p>
                  Overall student strength and assigned fee amounts across
                  the school
                </p>
              </div>
            </div>
            <div className="student-analytics-live">
              <span></span> Live Data
            </div>
          </div>

          {/* SCHOOL SUMMARY CARDS */}

          <div className="student-analytics-summary-grid">
            <div className="student-analytics-summary-card total">
              <div className="student-analytics-summary-top">
                <div className="student-analytics-summary-icon">
                  <i className="bi bi-people-fill"></i>
                </div>
                <span className="student-analytics-summary-label">
                  Total School Strength
                </span>
              </div>
              <div className="student-analytics-summary-value">
                {analytics.totalStudents.toLocaleString("en-IN")}
              </div>
              <div className="student-analytics-summary-note">
                <i className="bi bi-person-check-fill"></i>
                All registered students
              </div>
            </div>

            <div className="student-analytics-summary-card classes">
              <div className="student-analytics-summary-top">
                <div className="student-analytics-summary-icon">
                  <i className="bi bi-mortarboard-fill"></i>
                </div>
                <span className="student-analytics-summary-label">Classes</span>
              </div>
              <div className="student-analytics-summary-value">
                {analytics.classCount}
              </div>
              <div className="student-analytics-summary-note">
                <i className="bi bi-collection-fill"></i>
                Sections combined by class
              </div>
            </div>

            <div className="student-analytics-summary-card receiving">
              <div className="student-analytics-summary-top">
                <div className="student-analytics-summary-icon">
                  <i className="bi bi-cash-stack"></i>
                </div>
                <span className="student-analytics-summary-label">
                  Total Assigned Fees
                </span>
              </div>
              <div className="student-analytics-summary-value fee-summary-value">
                {feeLoading ? "Loading..." : formatCurrency(analytics.totalFees)}
              </div>
              <div className="student-analytics-summary-note">
                <i className="bi bi-receipt"></i>
                Sum of available fee components
              </div>
            </div>

            <div className="student-analytics-summary-card not-receiving">
              <div className="student-analytics-summary-top">
                <div className="student-analytics-summary-icon">
                  <i className="bi bi-wallet2"></i>
                </div>
                <span className="student-analytics-summary-label">Fee Records</span>
              </div>
              <div className="student-analytics-summary-value fee-summary-value">
                {feeLoading ? "..." : analytics.feeRecordsCount.toLocaleString("en-IN")}
              </div>
              <div className="student-analytics-summary-note">
                <i className="bi bi-people-fill"></i>
                Records returned by the fee API
              </div>
            </div>
          </div>

          {/* ================= PIE AND LINE CHARTS ================= */}

          <div className="student-analytics-charts-grid">
            {/* STUDENT PIE CHART */}

            <div className="student-analytics-chart-card">
              <div className="student-analytics-chart-heading">
                <div>
                  <h3>Student Distribution by Class</h3>
                  <p>Overall school strength with sections combined</p>
                </div>
                <span className="student-analytics-chart-icon">
                  <i className="bi bi-pie-chart-fill"></i>
                </span>
              </div>

              {analytics.totalStudents > 0 ? (
                <>
                  <div className="student-class-pie-layout">
                    <div
                      className="student-class-pie-chart"
                      style={{ background: analytics.pieGradient }}
                      role="img"
                      aria-label="Overall student strength by class"
                    >
                      <div className="student-class-pie-center">
                        <strong>{analytics.totalStudents.toLocaleString("en-IN")}</strong>
                        <span>Total Students</span>
                      </div>
                    </div>

                    <div className="student-class-pie-legend">
                      {analytics.pieSlices.map((item) => (
                        <div
                          className="student-class-pie-legend-item"
                          key={item.className}
                        >
                          <span
                            className="student-class-pie-legend-dot"
                            style={{ backgroundColor: item.color }}
                          ></span>
                          <span
                            className="student-class-pie-legend-name"
                            title={item.className}
                          >
                            {item.className}
                          </span>
                          <strong>{item.count.toLocaleString("en-IN")}</strong>
                          <small>{item.percentage.toFixed(1)}%</small>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="student-analytics-chart-footnote">
                    <i className="bi bi-info-circle"></i>
                    Sections such as 1-A and 1-B are combined into Class 1.
                    Chart totals always represent the entire school.
                  </div>
                </>
              ) : (
                <div className="student-analytics-empty">
                  <i className="bi bi-pie-chart"></i>
                  <p>No student data available to display.</p>
                </div>
              )}
            </div>

            {/* FEE COMPONENT LINE CHART */}

            <div className="student-analytics-chart-card student-fee-insights-card">
              <div className="student-analytics-chart-heading">
                <div>
                  <h3>Fee Components Overview</h3>
                  <p>
                    Compare assigned tuition, annual, admission and transport
                    fees
                  </p>
                </div>
                <span className="student-analytics-chart-icon">
                  <i className="bi bi-graph-up-arrow"></i>
                </span>
              </div>

              {feeLoading ? (
                <div className="student-analytics-empty">
                  <i className="bi bi-arrow-repeat"></i>
                  <p>Loading fee information...</p>
                </div>
              ) : feeError ? (
                <div className="student-analytics-empty">
                  <i className="bi bi-exclamation-circle"></i>
                  <p>Unable to load fee information.</p>
                  <small>{feeError}</small>
                  <button
                    type="button"
                    onClick={fetchFees}
                    style={{
                      marginTop: "12px",
                      padding: "9px 16px",
                      border: "none",
                      borderRadius: "8px",
                      background: "#6C4CE8",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    Retry
                  </button>
                </div>
              ) : !analytics.hasFeeData ? (
                <div className="student-analytics-empty">
                  <i className="bi bi-receipt"></i>
                  <p>No fee records available.</p>
                  <small>
                    Check AdminStudent/getFees and the fee columns returned
                    by your backend.
                  </small>
                </div>
              ) : (
                <>
                  <div className="student-fee-total">
                    <div>
                      <span>Total Assigned Fees</span>
                      <strong>{formatCurrency(analytics.totalFees)}</strong>
                      <small>
                        {analytics.feeRecordsCount} fee record(s) included
                      </small>
                    </div>
                    <div className="student-notification-total-icon">
                      <i className="bi bi-wallet2"></i>
                    </div>
                  </div>

                  <div className="student-fee-line-chart-wrapper">
                    <svg
                      className="student-fee-line-chart"
                      viewBox={`0 0 ${feeChart.chartWidth} ${feeChart.chartHeight}`}
                      role="img"
                      aria-label="Line graph comparing assigned fee components"
                    >
                      {feeChart.ticks.map((tick, index) => (
                        <g key={index}>
                          <line
                            x1={feeChart.left}
                            y1={tick.y}
                            x2={feeChart.chartWidth - feeChart.right}
                            y2={tick.y}
                            stroke="#e9e5f5"
                            strokeWidth="1"
                            strokeDasharray="4 5"
                          />
                          <text
                            x={feeChart.left - 9}
                            y={tick.y + 4}
                            textAnchor="end"
                            fontSize="10"
                            fill="#817b95"
                          >
                            {new Intl.NumberFormat("en-IN", {
                              notation: "compact",
                              maximumFractionDigits: 1,
                            }).format(tick.value)}
                          </text>
                        </g>
                      ))}

                      <line
                        x1={feeChart.left}
                        y1={feeChart.chartHeight - feeChart.bottom}
                        x2={feeChart.chartWidth - feeChart.right}
                        y2={feeChart.chartHeight - feeChart.bottom}
                        stroke="#d9d2eb"
                        strokeWidth="1.2"
                      />

                      <path
                        d={feeChart.path}
                        fill="none"
                        stroke="#6C4CE8"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {feeChart.points.map((point) => (
                        <g key={point.key}>
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r="6"
                            fill={point.color}
                            stroke="#ffffff"
                            strokeWidth="2.5"
                          />
                          <text
                            x={point.x}
                            y={Math.max(point.y - 13, 13)}
                            textAnchor="middle"
                            fontSize="11"
                            fontWeight="700"
                            fill={point.color}
                          >
                            {new Intl.NumberFormat("en-IN", {
                              notation: "compact",
                              maximumFractionDigits: 1,
                            }).format(point.amount)}
                          </text>
                          <text
                            x={point.x}
                            y={feeChart.chartHeight - 27}
                            textAnchor="middle"
                            fontSize="10"
                            fontWeight="600"
                            fill="#57516c"
                          >
                            {point.label === "Admission Fee"
                              ? "Admission"
                              : point.label === "Transport Fee"
                              ? "Transport"
                              : point.label === "Tuition Fee"
                              ? "Tuition"
                              : "Annual"}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>

                  <div className="student-fee-status-legend">
                    {analytics.feeBreakdown.map((item) => (
                      <div key={item.key}>
                        <span
                          className="student-fee-status-dot"
                          style={{ backgroundColor: item.color }}
                        ></span>
                        <span>{item.label}</span>
                        <strong>{formatCurrency(item.amount)}</strong>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ================= NEW FEE PAYMENT SUMMARY ================= */}
          {/* Placed directly BELOW both charts. */}

          <div className="student-payment-summary">
            <div className="student-payment-summary-heading">
              <div>
                <h3>Fee Payment Overview</h3>
                <p>
                  Assigned fees, collected payments and pending school dues
                </p>
              </div>
              <span className="student-payment-summary-icon">
                <i className="bi bi-wallet2"></i>
              </span>
            </div>

            {feeLoading || paymentLoading ? (
              <div className="student-payment-loading">
                <i className="bi bi-arrow-repeat"></i>
                Loading fee payment summary...
              </div>
            ) : (
              <>
                <div className="student-payment-summary-grid">
                  <div className="student-payment-summary-card assigned">
                    <span className="student-payment-summary-card-icon">
                      <i className="bi bi-receipt"></i>
                    </span>
                    <div>
                      <p>Total Assigned Fees</p>
                      <h3>{formatCurrency(paymentAnalytics.assignedFees)}</h3>
                      <small>Fees assigned to students</small>
                    </div>
                  </div>

                  <div className="student-payment-summary-card paid">
                    <span className="student-payment-summary-card-icon">
                      <i className="bi bi-check-circle-fill"></i>
                    </span>
                    <div>
                      <p>Total Fees Paid</p>
                      <h3>
                        {paymentError
                          ? "Unavailable"
                          : formatCurrency(paymentAnalytics.totalPaid)}
                      </h3>
                      <small>
                        {paymentError
                          ? "Payment records could not be loaded"
                          : `${paymentAnalytics.successfulTransactions} successful transaction(s)`}
                      </small>
                    </div>
                  </div>

                  <div className="student-payment-summary-card outstanding">
                    <span className="student-payment-summary-card-icon">
                      <i className="bi bi-hourglass-split"></i>
                    </span>
                    <div>
                      <p>Pending Fees</p>
                      <h3>
                        {paymentError
                          ? "Unavailable"
                          : formatCurrency(paymentAnalytics.pendingFees)}
                      </h3>
                      <small>
                        Assigned fees minus recorded successful payments
                      </small>
                    </div>
                  </div>

                  <div className="student-payment-summary-card transactions">
                    <span className="student-payment-summary-card-icon">
                      <i className="bi bi-credit-card-2-front-fill"></i>
                    </span>
                    <div>
                      <p>Payment Records</p>
                      <h3>
                        {paymentError
                          ? "Unavailable"
                          : paymentAnalytics.totalTransactions.toLocaleString("en-IN")}
                      </h3>
                      <small>
                        {paymentError
                          ? "Check the payment API"
                          : `${paymentAnalytics.pendingTransactions} pending · ${paymentAnalytics.failedTransactions} failed/cancelled`}
                      </small>
                    </div>
                  </div>
                </div>

                {!paymentError && (
                  <div className="student-payment-progress-section">
                    <div className="student-payment-progress-heading">
                      <span>Fee Collection Progress</span>
                      <strong>
                        {paymentAnalytics.collectionPercentage.toFixed(1)}%
                      </strong>
                    </div>
                    <div
                      className="student-payment-progress-track"
                      role="progressbar"
                      aria-valuenow={paymentAnalytics.collectionPercentage}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-label="Fee collection progress"
                    >
                      <div
                        className="student-payment-progress-fill"
                        style={{
                          width: `${paymentAnalytics.collectionPercentage}%`,
                        }}
                      ></div>
                    </div>
                    <div className="student-payment-progress-foot">
                      <span>
                        Collected: {formatCurrency(paymentAnalytics.totalPaid)}
                      </span>
                      <span>
                        Pending: {formatCurrency(paymentAnalytics.pendingFees)}
                      </span>
                    </div>
                  </div>
                )}

                {paymentError && (
                  <div className="student-payment-summary-note error">
                    <i className="bi bi-exclamation-circle-fill"></i>
                    <span>
                      Payment data could not be loaded. {paymentError}
                      {" "}Check that
                      {" "}AdminPanelFee/getPayments returns payment records.
                      Pending dues are not shown as a confirmed figure until
                      the payment data loads successfully.
                    </span>
                    <button type="button" onClick={fetchPayments}>
                      Retry
                    </button>
                  </div>
                )}

                {!paymentError && (
                  <div className="student-payment-summary-note">
                    <i className="bi bi-info-circle-fill"></i>
                    <span>
                      Pending fees are calculated as total assigned fees
                      minus successful payments. This is a school-wide
                      estimate; discounts, refunds, overpayments, duplicate
                      fee assignments or session-specific payments may
                      require additional backend reconciliation.
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* ================= STUDENT TABLE ================= */}

        <div className="admin-view-student-table-card">
          <div className="admin-view-student-table-toolbar">
            <div className="admin-view-student-entries">
              <span>Show</span>
              <select
                value={entries}
                onChange={(e) => {
                  setEntries(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>

            <div className="admin-view-student-search">
              <label><i className="bi bi-search"></i></label>
              <input
                type="text"
                placeholder="Search name, roll no or admission no..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCurrentPage(1);
                  }}
                >
                  <i className="bi bi-x-circle-fill"></i>
                </button>
              )}
            </div>
          </div>

          <div className="admin-view-student-table-wrapper">
            <table className="admin-view-student-table">
              <thead>
                <tr>
                  <th><span>ID</span></th>
                  <th><span>ROLL NO.</span></th>
                  <th className="admin-view-student-name-column">
                    <span>STUDENT</span>
                  </th>
                  <th><span>CLASS</span></th>
                  <th><span>ADMISSION NO.</span></th>
                  <th><span>NOTIFICATIONS</span></th>
                  <th className="admin-view-student-action-column">
                    <span>ACTIONS</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedStudents.length > 0 ? (
                  paginatedStudents.map((row) => {
                    const isReceiving =
                      row?.fcm_token !== null &&
                      row?.fcm_token !== undefined &&
                      String(row.fcm_token).trim() !== "" &&
                      String(row.fcm_token).trim() !== "0";

                    return (
                      <tr key={row.id}>
                        <td>
                          <span className="admin-view-student-id">{row.id}</span>
                        </td>
                        <td>
                          <span className="admin-view-student-roll">
                            {row.Rollno || "-"}
                          </span>
                        </td>
                        <td className="admin-view-student-name-column">
                          <div
                            className="admin-view-student-name-cell"
                            onClick={() =>
                              navigate(
                                `/dashboard/StudentComponent/ViewStudentProfile/${row.id}`
                              )
                            }
                          >
                            <div className="admin-view-student-avatar">
                              {(row.Name || "S").charAt(0).toUpperCase()}
                            </div>
                            <div className="admin-view-student-name-info">
                              <strong>{row.Name || "Unknown Student"}</strong>
                              <small>Student ID: {row.id}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="admin-view-student-class-badge">
                            <i className="bi bi-bookmark-fill"></i>
                            {row.Class || "-"}
                          </span>
                        </td>
                        <td>
                          <span className="admin-view-student-admission">
                            {row.Admno || "-"}
                          </span>
                        </td>
                        <td>
                          {isReceiving ? (
                            <span className="admin-view-student-notification receiving">
                              <span className="admin-view-student-notification-dot"></span>
                              <i className="bi bi-bell-fill"></i>
                              Receiving
                            </span>
                          ) : (
                            <span className="admin-view-student-notification not-receiving">
                              <span className="admin-view-student-notification-dot"></span>
                              <i className="bi bi-bell-slash-fill"></i>
                              Not Receiving
                            </span>
                          )}
                        </td>
                        <td className="admin-view-student-action-column">
                          <div className="admin-view-student-action-wrapper">
                            <button
                              type="button"
                              className={
                                activeAction === row.id
                                  ? "admin-view-student-action-button active"
                                  : "admin-view-student-action-button"
                              }
                              onClick={() =>
                                setActiveAction(
                                  activeAction === row.id ? null : row.id
                                )
                              }
                              title="Student Actions"
                            >
                              <i className="bi bi-three-dots-vertical"></i>
                            </button>

                            {activeAction === row.id && (
                              <div className="admin-view-student-action-dropdown">
                                <div className="admin-view-student-action-heading">
                                  <i className="bi bi-person-lines-fill"></i>
                                  Student Actions
                                </div>

                                <button type="button" onClick={() => navigate(`/StudentComponent/report/${row.id}`)}>
                                  <span className="action-icon purple"><i className="bi bi-file-earmark-bar-graph-fill"></i></span>
                                  Exam Report
                                </button>
                                <button type="button" onClick={() => navigate(`/StudentComponent/ReportCardRouter/${row.id}`)}>
                                  <span className="action-icon blue"><i className="bi bi-file-earmark-text-fill"></i></span>
                                  Report Card
                                </button>
                                <button type="button" onClick={() => navigate(`/StudentComponent/ReportRouter/${row.id}`)}>
                                  <span className="action-icon violet"><i className="bi bi-card-checklist"></i></span>
                                  Customized Report Card
                                </button>
                                <button type="button" onClick={() => navigate(`/dashboard/StudentComponent/StudentAttendenceDetails/${row.id}`)}>
                                  <span className="action-icon green"><i className="bi bi-calendar-check-fill"></i></span>
                                  Attendance
                                </button>
                                <button type="button" onClick={() => navigate(`/dashboard/StudentComponent/GenerateTC/${row.id}`)}>
                                  <span className="action-icon orange"><i className="bi bi-file-earmark-break-fill"></i></span>
                                  Transfer Certificate
                                </button>
                                <button type="button" onClick={() => navigate(`/dashboard/StudentComponent/CharacterCertificate/${row.id}`)}>
                                  <span className="action-icon teal"><i className="bi bi-award-fill"></i></span>
                                  Character Certificate
                                </button>
                                <button type="button" onClick={() => navigate(`/dashboard/StudentComponent/StudentTransportDetails/${row.id}`)}>
                                  <span className="action-icon cyan"><i className="bi bi-bus-front-fill"></i></span>
                                  Transport
                                </button>
                                <button type="button" onClick={() => navigate(`/dashboard/StudentComponent/StudentExamDetails/${row.id}`)}>
                                  <span className="action-icon indigo"><i className="bi bi-journal-check"></i></span>
                                  Exams
                                </button>
                                <button type="button" onClick={() => navigate(`/dashboard/StudentComponent/StudentFeeDetails/${row.id}`)}>
                                  <span className="action-icon yellow"><i className="bi bi-cash-stack"></i></span>
                                  Fee
                                </button>
                                <button type="button" onClick={() => navigate(`/dashboard/StudentComponent/StudentMessages/${row.id}`)}>
                                  <span className="action-icon pink"><i className="bi bi-chat-left-text-fill"></i></span>
                                  Messages
                                </button>
                                <button type="button" onClick={() => navigate(`/dashboard/StudentComponent/CreateCredentials/${row.id}`)}>
                                  <span className="action-icon purple"><i className="bi bi-key-fill"></i></span>
                                  Create Credentials
                                </button>
                                <button type="button" onClick={() => navigate(`/dashboard/StudentComponent/CreateStudentPayment/${row.id}`)}>
                                  <span className="action-icon green"><i className="bi bi-credit-card-fill"></i></span>
                                  Create Fee Payment
                                </button>

                                <div className="admin-view-student-action-divider"></div>

                                <button
                                  type="button"
                                  className="admin-view-student-delete-action"
                                  onClick={() => handleDelete(row.id)}
                                >
                                  <span className="action-icon red">
                                    <i className="bi bi-trash-fill"></i>
                                  </span>
                                  Delete Student
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="admin-view-student-empty">
                      <div className="admin-view-student-empty-icon">
                        <i className="bi bi-person-x-fill"></i>
                      </div>
                      <h3>No Students Found</h3>
                      <p>Try changing your search or filter criteria.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* FOOTER / PAGINATION */}

          <div className="admin-view-student-table-footer">
            <div className="admin-view-student-showing">
              Showing{" "}
              <strong>{filteredStudents.length === 0 ? 0 : startIndex + 1}</strong>
              {" "}to{" "}
              <strong>
                {Math.min(startIndex + entries, filteredStudents.length)}
              </strong>
              {" "}of <strong>{filteredStudents.length}</strong> entries
            </div>

            <div className="admin-view-student-pagination">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
              >
                <i className="bi bi-chevron-left"></i> Previous
              </button>

              <div className="admin-view-student-page-numbers">
                {getPageNumbers().map((page, index) =>
                  page === "..." ? (
                    <span
                      key={`dots-${index}`}
                      className="admin-view-student-page-dots"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      type="button"
                      key={page}
                      className={currentPage === page ? "active" : ""}
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                type="button"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => goToPage(currentPage + 1)}
              >
                Next <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminViewStudent;
