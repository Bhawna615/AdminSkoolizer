
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./FeeStatistics.css";

const API = "http://localhost/kkblossom/api.php/Adminapi/FeeStatistics/";

const MONTHLY_FEE_API =
  "http://localhost/kkblossom/api.php/Adminapi/AdminStudent/monthlyFeeCollection";

export default function FeeStatistics() {
  const navigate = useNavigate();

  const [periods, setPeriods] = useState([]);
  const [monthlyFeeCollection, setMonthlyFeeCollection] = useState([]);

  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [date, setDate] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // =====================================================
  // MONTH NAMES
  // =====================================================

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  // =====================================================
  // LOAD PAYMENT PERIODS
  // =====================================================

  useEffect(() => {
    axios
      .get(API + "getPeriods")
      .then((res) => {
        setPeriods(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Error loading payment periods:", err);
      });
  }, []);

  // =====================================================
  // LOAD MONTHLY FEE COLLECTION
  // =====================================================

  useEffect(() => {
    axios
      .get(MONTHLY_FEE_API)
      .then((res) => {
        console.log("MONTHLY FEE COLLECTION:", res.data);

        const result = res.data;

        if (result.status === "success") {
          setMonthlyFeeCollection(
            Array.isArray(result.monthlyFeeCollection)
              ? result.monthlyFeeCollection
              : []
          );
        } else {
          setMonthlyFeeCollection([]);
        }
      })
      .catch((err) => {
        console.error("Error loading monthly fee collection:", err);
        setMonthlyFeeCollection([]);
      });
  }, []);

  // =====================================================
  // PERIOD GO BUTTON
  // =====================================================

  const handlePeriodGo = () => {
    if (!selectedPeriod) {
      setMessage("Please select a payment period.");
      setMessageType("error");
      return;
    }

    navigate(
      `/dashboard/FeeComponent/DisplayStatistics/${selectedPeriod}`
    );
  };

  // =====================================================
  // DATE GO BUTTON
  // =====================================================

  const handleDateGo = () => {
    if (!date) {
      setMessage("Please select a payment date.");
      setMessageType("error");
      return;
    }

    navigate(`/FeeComponent/ViewPaidPaymentsByDate/${date}`);
  };

  // =====================================================
  // CLOSE MESSAGE
  // =====================================================

  const closeMessage = () => {
    setMessage("");
    setMessageType("");
  };

  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  };

  // =====================================================
  // FORMAT Y AXIS CURRENCY
  // =====================================================

  const formatAxisCurrency = (value) => {
    const amount = Number(value || 0);

    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    }

    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }

    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}k`;
    }

    return `₹${Math.round(amount)}`;
  };

  // =====================================================
  // PREPARE ACTUAL MONTHLY CHART DATA
  // =====================================================

  const chartData = monthlyFeeCollection
    .map((item) => ({
      month: Number(item.month),
      year: Number(item.year),
      collection: Number(item.total_collection || 0),
      paymentCount: Number(item.payment_count || 0),
    }))
    .filter(
      (item) =>
        Number.isFinite(item.month) &&
        item.month >= 1 &&
        item.month <= 12 &&
        Number.isFinite(item.year) &&
        Number.isFinite(item.collection)
    )
    .sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }

      return a.month - b.month;
    });

  // =====================================================
  // CHART DIMENSIONS
  // =====================================================

  const chartWidth = 900;
  const chartHeight = 300;

  const chartLeft = 25;
  const chartRight = 875;
  const chartTop = 25;
  const chartBottom = 255;

  const chartPlotHeight = chartBottom - chartTop;

  // =====================================================
  // CHART SCALE
  // =====================================================

  const chartValues = chartData.map((item) => item.collection);

  const maxChartValue =
    chartValues.length > 0
      ? Math.max(...chartValues)
      : 0;

  const getNiceMax = (value) => {
    if (value <= 0) return 1;

    const magnitude = Math.pow(
      10,
      Math.floor(Math.log10(value))
    );

    const normalized = value / magnitude;

    let niceValue;

    if (normalized <= 1) {
      niceValue = 1;
    } else if (normalized <= 2) {
      niceValue = 2;
    } else if (normalized <= 5) {
      niceValue = 5;
    } else {
      niceValue = 10;
    }

    return niceValue * magnitude;
  };

  const chartScaleMax = getNiceMax(maxChartValue);

  // =====================================================
  // Y AXIS VALUES
  // =====================================================

  const chartYAxis = Array.from(
    { length: 6 },
    (_, index) => chartScaleMax * (5 - index) / 5
  );

  // =====================================================
  // GENERATE CHART POINTS
  // =====================================================

  const chartPoints = chartData.map((item, index) => {
    const x =
      chartData.length === 1
        ? chartWidth / 2
        : chartLeft +
          (index / (chartData.length - 1)) *
            (chartRight - chartLeft);

    const y =
      chartBottom -
      (item.collection / chartScaleMax) * chartPlotHeight;

    return {
      x,
      y,
      ...item,
    };
  });

  // =====================================================
  // GENERATE SMOOTH LINE PATH
  // =====================================================

  const generateLinePath = () => {
    if (chartPoints.length === 0) return "";

    if (chartPoints.length === 1) {
      return `M ${chartPoints[0].x} ${chartPoints[0].y}`;
    }

    let path = `M ${chartPoints[0].x} ${chartPoints[0].y}`;

    for (let i = 1; i < chartPoints.length; i++) {
      const previous = chartPoints[i - 1];
      const current = chartPoints[i];

      const controlPointX =
        previous.x + (current.x - previous.x) / 2;

      path += ` C ${controlPointX} ${previous.y},
        ${controlPointX} ${current.y},
        ${current.x} ${current.y}`;
    }

    return path;
  };

  const linePath = generateLinePath();

  // =====================================================
  // GENERATE GRADIENT AREA PATH
  // =====================================================

  const generateAreaPath = () => {
    if (!linePath || chartPoints.length === 0) return "";

    const firstPoint = chartPoints[0];
    const lastPoint = chartPoints[chartPoints.length - 1];

    return `
      ${linePath}
      L ${lastPoint.x} ${chartBottom}
      L ${firstPoint.x} ${chartBottom}
      Z
    `;
  };

  const areaPath = generateAreaPath();

  // =====================================================
  // MONTH LABEL VISIBILITY
  // =====================================================

  const shouldShowMonthLabel = (index) => {
    return (
      chartData.length <= 8 ||
      index === 0 ||
      index === chartData.length - 1 ||
      index % Math.ceil(chartData.length / 8) === 0
    );
  };

  // =====================================================
  // TOTAL COLLECTION
  // =====================================================

  const totalCollection = chartData.reduce(
    (total, item) => total + item.collection,
    0
  );

  const totalPayments = chartData.reduce(
    (total, item) => total + item.paymentCount,
    0
  );

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="kk-fee-statistics-page">

      {/* MESSAGE OVERLAY */}

      {message && (
        <div className="kk-fee-statistics-message-overlay">
          <div className={`kk-fee-statistics-message-box ${messageType}`}>

            <div className="kk-fee-statistics-message-icon">
              <i
                className={
                  messageType === "success"
                    ? "bi bi-check-circle-fill"
                    : "bi bi-exclamation-circle-fill"
                }
              ></i>
            </div>

            <h3>
              {messageType === "success" ? "Success!" : "Attention!"}
            </h3>

            <p>{message}</p>

            <button
              className="kk-fee-statistics-message-btn"
              onClick={closeMessage}
            >
              Okay
            </button>

          </div>
        </div>
      )}

      {/* PAGE HEADER */}

      <div className="kk-fee-statistics-header">

        <div className="kk-fee-statistics-header-content">

          <div className="kk-fee-statistics-title-icon">
            <i className="bi bi-graph-up-arrow"></i>
          </div>

          <div>
            <h1>Fee Statistics</h1>
            <p>
              Monitor fee collections and view payment statistics
            </p>
          </div>

        </div>

        <div className="kk-fee-statistics-header-tag">
          <i className="bi bi-graph-up-arrow"></i>
          Financial Overview
        </div>

      </div>

      {/* PAYMENT FILTERS */}

      <div className="kk-fee-statistics-section-heading">
        <div>
          <h2>Payment Insights</h2>
          <p>Explore fee records using different filters</p>
        </div>
      </div>

      <div className="kk-fee-statistics-filter-grid">

        {/* PERIOD FILTER */}

        <div className="kk-fee-statistics-filter-card">

          <div className="kk-fee-statistics-filter-top">

            <div className="kk-fee-statistics-filter-icon">
              <i className="bi bi-calendar-range"></i>
            </div>

            <span className="kk-fee-statistics-filter-label">
              ACADEMIC PERIOD
            </span>

          </div>

          <div className="kk-fee-statistics-filter-content">

            <h3>Payment Period</h3>

            <p>
              Select an academic payment period to view detailed
              collection statistics and payment records.
            </p>

            <div className="kk-fee-statistics-control-row">

              <select
                className="kk-fee-statistics-select"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="">Select Period</option>

                {periods.map((p, index) => (
                  <option key={index} value={p.period}>
                    {p.period}
                  </option>
                ))}

              </select>

              <button
                className="kk-fee-statistics-go-btn"
                onClick={handlePeriodGo}
              >
                View
                <i className="bi bi-arrow-right"></i>
              </button>

            </div>

          </div>

        </div>

        {/* DATE FILTER */}

        <div className="kk-fee-statistics-filter-card">

          <div className="kk-fee-statistics-filter-top">

            <div className="kk-fee-statistics-filter-icon date">
              <i className="bi bi-calendar-check"></i>
            </div>

            <span className="kk-fee-statistics-filter-label">
              DAILY COLLECTION
            </span>

          </div>

          <div className="kk-fee-statistics-filter-content">

            <h3>Payment Date</h3>

            <p>
              Select a specific date to view all paid payment
              transactions for that day.
            </p>

            <div className="kk-fee-statistics-control-row">

              <input
                type="date"
                className="kk-fee-statistics-date-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <button
                className="kk-fee-statistics-go-btn"
                onClick={handleDateGo}
              >
                View
                <i className="bi bi-arrow-right"></i>
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* MONTHLY FEE COLLECTION CHART */}

      <div className="kk-fee-statistics-chart-card">

        {/* CHART HEADER */}

        <div className="kk-fee-statistics-chart-header">

          <div className="kk-fee-statistics-chart-title-row">

            <div className="kk-fee-statistics-chart-icon">
              <i className="bi bi-graph-up-arrow"></i>
            </div>

            <div>
              <h2>Monthly Fee Collection Overview</h2>
              <p>
                Actual monthly fee collection received
              </p>
            </div>

          </div>

          <div className="kk-fee-statistics-chart-badge">
            <span></span>
            Monthly Overview
          </div>

        </div>

        <div className="kk-fee-statistics-chart-divider"></div>

        {/* SUMMARY */}

        <div className="kk-fee-statistics-summary">

          <div className="kk-fee-statistics-summary-item">
            <span className="kk-fee-statistics-summary-label">
              Total Collection
            </span>
            <h3>{formatCurrency(totalCollection)}</h3>
          </div>

          <div className="kk-fee-statistics-summary-item">
            <span className="kk-fee-statistics-summary-label">
              Total Payments
            </span>
            <h3>{totalPayments.toLocaleString("en-IN")}</h3>
          </div>

          <div className="kk-fee-statistics-summary-item">
            <span className="kk-fee-statistics-summary-label">
              Months Recorded
            </span>
            <h3>{chartData.length}</h3>
          </div>

        </div>

        {/* LINE GRAPH */}

        {chartData.length > 0 ? (

          <div className="kk-fee-statistics-chart-area">

            {/* Y AXIS */}

            <div className="kk-fee-statistics-y-axis">

              {chartYAxis.map((value, index) => (
                <span key={index}>
                  {formatAxisCurrency(value)}
                </span>
              ))}

            </div>

            {/* GRAPH */}

            <div className="kk-fee-statistics-line-chart">

              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                preserveAspectRatio="none"
                role="img"
                aria-label="Monthly fee collection line graph"
              >

                <defs>

                  <linearGradient
                    id="kkFeeChartGradient"
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#7657e8"
                      stopOpacity="0.25"
                    />

                    <stop
                      offset="75%"
                      stopColor="#7657e8"
                      stopOpacity="0.07"
                    />

                    <stop
                      offset="100%"
                      stopColor="#7657e8"
                      stopOpacity="0"
                    />
                  </linearGradient>

                  <filter
                    id="kkFeeLineShadow"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                  >
                    <feGaussianBlur
                      stdDeviation="3"
                      result="blur"
                    />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                </defs>

                {/* HORIZONTAL GRID LINES */}

                {chartYAxis.map((value, index) => {
                  const y =
                    chartTop +
                    (index / 5) * chartPlotHeight;

                  return (
                    <line
                      key={`grid-${index}`}
                      x1={chartLeft}
                      y1={y}
                      x2={chartRight}
                      y2={y}
                      stroke="#eeeaf6"
                      strokeWidth="1"
                      strokeDasharray={index === 5 ? "0" : "4 6"}
                    />
                  );
                })}

                {/* AREA FILL */}

                {areaPath && (
                  <path
                    d={areaPath}
                    fill="url(#kkFeeChartGradient)"
                  />
                )}

                {/* LINE SHADOW */}

                {linePath && (
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#7657e8"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.10"
                  />
                )}

                {/* MAIN SMOOTH LINE */}

                {linePath && (
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#7657e8"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#kkFeeLineShadow)"
                    className="kk-fee-statistics-main-line"
                  />
                )}

                {/* DATA POINTS */}

                {chartPoints.map((item, index) => (

                  <g key={`${item.year}-${item.month}`}>

                    {/* OUTER POINT */}

                    <circle
                      cx={item.x}
                      cy={item.y}
                      r="10"
                      fill="#7657e8"
                      opacity="0.12"
                    />

                    {/* WHITE BORDER POINT */}

                    <circle
                      cx={item.x}
                      cy={item.y}
                      r="6"
                      fill="#ffffff"
                      stroke="#7657e8"
                      strokeWidth="2.5"
                      className="kk-fee-statistics-data-point"
                    >
                      <title>
                        {monthNames[item.month - 1]} {item.year}
                        {" | "}
                        {formatCurrency(item.collection)}
                        {" | "}
                        {item.paymentCount} payments
                      </title>
                    </circle>

                    {/* CENTER DOT */}

                    <circle
                      cx={item.x}
                      cy={item.y}
                      r="2.3"
                      fill="#7657e8"
                    />

                  </g>

                ))}

              </svg>

              {/* X AXIS MONTH LABELS */}

              <div className="kk-fee-statistics-months">

                {chartData.map((item, index) => {
                  const showLabel = shouldShowMonthLabel(index);

                  return (
                    <span
                      key={`${item.year}-${item.month}`}
                      className={
                        !showLabel
                          ? "kk-fee-statistics-month-hidden"
                          : ""
                      }
                      title={`${monthNames[item.month - 1]} ${item.year}`}
                    >
                      {showLabel
                        ? `${monthNames[item.month - 1]} '${String(
                            item.year
                          ).slice(-2)}`
                        : ""}
                    </span>
                  );
                })}

              </div>

            </div>

          </div>

        ) : (

          <div className="kk-fee-statistics-chart-empty">

            <div className="kk-fee-statistics-empty-icon">
              <i className="bi bi-graph-up"></i>
            </div>

            <h3>No Statistics Available</h3>

            <p>
              Monthly fee collection data will appear here once
              payment records are available.
            </p>

          </div>

        )}

        {/* CHART FOOTER */}

        <div className="kk-fee-statistics-chart-footer">

          <div>
            <i className="bi bi-info-circle"></i>
            <span>
              Based on actual recorded monthly fee transactions
            </span>
          </div>

          <span className="kk-fee-statistics-footer-status">
            <span></span>
            Live Database Data
          </span>

        </div>

      </div>

    </div>
  );
}
