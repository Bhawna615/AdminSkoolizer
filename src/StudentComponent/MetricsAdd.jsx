
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import {
  FaChartLine,
  FaUserGraduate,
  FaSchool,
  FaIdBadge,
  FaSave,
  FaCheckCircle,
  FaExclamationCircle
} from "react-icons/fa";
import "./MetricsAdd.css";

const MetricsAdd = () => {
  const BASE_URL =
    "http://localhost/kkblossom/api.php/Adminapi/AdminStudentMetrics";

  const { studentId } = useParams();

  const [student, setStudent] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [marks, setMarks] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ===== AUTO-CLOSE SUCCESS MESSAGE =====
  useEffect(() => {
    if (message && messageType === "success") {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [message, messageType]);

  // ===== LOAD DATA =====
  useEffect(() => {
    axios
      .get(`${BASE_URL}/addData/${studentId}`)
      .then((res) => {
        setStudent(res.data.student);
        setMetrics(res.data.metrics || []);

        const m = {};

        (res.data.metrics || []).forEach((item) => {
          m[item.metric_id] = item.mark ?? "";
        });

        setMarks(m);
      })
      .catch((err) => {
        console.log(err);
        setMessage("Failed to load student metrics");
        setMessageType("error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [studentId]);

  // ===== CHANGE MARK =====
  const handleChange = (id, value) => {
    setMarks((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  // ===== LINE GRAPH DATA =====
  const chartData = metrics
    .map((item) => {
      const value = Number(marks[item.metric_id]);

      return {
        id: item.metric_id,
        name: item.metric_name || `Metric ${item.metric_id}`,
        marks:
          marks[item.metric_id] !== "" &&
          marks[item.metric_id] !== undefined &&
          Number.isFinite(value)
            ? value
            : null
      };
    })
    .filter(
      (item) =>
        item.marks !== null &&
        item.marks >= 0
    );

  // ===== GRAPH DIMENSIONS =====
  const chartWidth = 760;
  const chartHeight = 340;

  const chartPadding = {
    top: 30,
    right: 35,
    bottom: 85,
    left: 65
  };

  const graphWidth =
    chartWidth - chartPadding.left - chartPadding.right;

  const graphHeight =
    chartHeight - chartPadding.top - chartPadding.bottom;

  const maxMark =
    chartData.length > 0
      ? Math.max(...chartData.map((item) => item.marks))
      : 0;

  const yAxisMax =
    maxMark === 0
      ? 10
      : Math.ceil(maxMark / 10) * 10;

  const yAxisTicks = [
    0,
    yAxisMax * 0.25,
    yAxisMax * 0.5,
    yAxisMax * 0.75,
    yAxisMax
  ];

  // ===== CALCULATE GRAPH POINTS =====
  const graphPoints = chartData.map((item, index) => {
    const x =
      chartPadding.left +
      (chartData.length === 1
        ? graphWidth / 2
        : (index / (chartData.length - 1)) * graphWidth);

    const y =
      chartPadding.top +
      graphHeight -
      (item.marks / yAxisMax) * graphHeight;

    return {
      ...item,
      x,
      y
    };
  });

  // ===== LINE PATH =====
  const linePath = graphPoints
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  // ===== AREA PATH =====
  const areaPath =
    graphPoints.length > 1
      ? `${linePath} L ${graphPoints[graphPoints.length - 1].x} ${
          chartPadding.top + graphHeight
        } L ${graphPoints[0].x} ${
          chartPadding.top + graphHeight
        } Z`
      : "";

  // ===== PERFORMANCE SUMMARY =====
  const averageMarks =
    chartData.length > 0
      ? (
          chartData.reduce((sum, item) => sum + item.marks, 0) /
          chartData.length
        ).toFixed(1)
      : "0";

  const highestMarks =
    chartData.length > 0
      ? Math.max(...chartData.map((item) => item.marks))
      : 0;

  const lowestMarks =
    chartData.length > 0
      ? Math.min(...chartData.map((item) => item.marks))
      : 0;

  // ===== SUBMIT =====
  const submit = () => {
    setSaving(true);
    setMessage("");
    setMessageType("");

    const payload = Object.keys(marks).map((id) => ({
      metric_id: id,
      mark: marks[id]
    }));

    axios
      .post(`${BASE_URL}/mark`, {
        studentId: studentId,
        metrics: payload
      })
      .then(() => {
        setMessage("Metrics saved successfully");
        setMessageType("success");
      })
      .catch((err) => {
        console.log(err);
        setMessage("Failed to save metrics");
        setMessageType("error");
      })
      .finally(() => {
        setSaving(false);
      });
  };

  // ===== TABLE COLUMNS =====
  const columns = [
    {
      name: "ID",
      selector: (row) => row.metric_id,
      width: "100px",
      center: true
    },
    {
      name: "METRIC",
      selector: (row) => row.metric_name,
      grow: 2
    },
    {
      name: "ABILITY",
      selector: (row) => row.ability,
      grow: 1.5,
      cell: (row) => (
        <span className="student-metrics-ability-badge">
          {row.ability}
        </span>
      )
    },
    {
      name: "MARK",
      grow: 1.2,
      center: true,
      cell: (row) => (
        <input
          type="text"
          className="student-metrics-mark-input"
          placeholder="Enter mark"
          value={marks[row.metric_id] ?? ""}
          onChange={(e) =>
            handleChange(row.metric_id, e.target.value)
          }
        />
      )
    }
  ];

  // ===== TABLE CUSTOM STYLES =====
  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#5b2c91",
        color: "#ffffff",
        fontSize: "13px",
        fontWeight: "700",
        minHeight: "58px"
      }
    },

    rows: {
      style: {
        minHeight: "68px",
        fontSize: "14px",
        borderBottom: "1px solid #eee"
      },
      highlightOnHoverStyle: {
        backgroundColor: "#f7f0ff",
        borderBottomColor: "#e6d7f5"
      }
    },

    cells: {
      style: {
        paddingLeft: "16px",
        paddingRight: "16px"
      }
    },

    pagination: {
      style: {
        borderTop: "1px solid #eee",
        fontSize: "14px"
      }
    }
  };

  return (
    <div className="student-metrics-page">

      {/* PAGE HEADER */}
      <div className="student-metrics-header">
        <div className="student-metrics-header-icon">
          <FaChartLine />
        </div>

        <div>
          <h1>Student Metrics</h1>
          <p>Evaluate and manage student performance metrics</p>
        </div>
      </div>

      {/* CENTERED SUCCESS / ERROR POPUP */}
      {message && (
        <div className="student-metrics-modal-overlay">

          <div
            className={`student-metrics-modal-popup ${
              messageType === "success"
                ? "student-metrics-modal-success"
                : "student-metrics-modal-error"
            }`}
            role="alertdialog"
            aria-live="assertive"
          >

            <button
              type="button"
              className="student-metrics-modal-close"
              onClick={() => {
                setMessage("");
                setMessageType("");
              }}
              aria-label="Close message"
            >
              <i className="bi bi-x-lg"></i>
            </button>

            <div className="student-metrics-modal-icon">
              {messageType === "success" ? (
                <FaCheckCircle />
              ) : (
                <FaExclamationCircle />
              )}
            </div>

            <h2>
              {messageType === "success"
                ? "Metrics Saved Successfully!"
                : "Action Required"}
            </h2>

            <p>{message}</p>

            {messageType === "success" && (
              <>
                <div className="student-metrics-modal-status">
                  <FaCheckCircle />
                  Student metrics have been updated.
                </div>

                <div className="student-metrics-modal-progress">
                  <span></span>
                </div>
              </>
            )}

            {messageType === "error" && (
              <button
                type="button"
                className="student-metrics-modal-ok"
                onClick={() => {
                  setMessage("");
                  setMessageType("");
                }}
              >
                Okay
              </button>
            )}

          </div>

        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="student-metrics-loading">
          <div className="student-metrics-spinner"></div>
          <p>Loading student metrics...</p>
        </div>
      ) : (
        <>

          {/* STUDENT INFORMATION */}
          {student && (
            <div className="student-metrics-student-card">

              <div className="student-metrics-card-title">
                <div className="student-metrics-card-icon">
                  <FaUserGraduate />
                </div>

                <div>
                  <h2>Student Information</h2>
                  <p>Student academic details</p>
                </div>
              </div>

              <div className="student-metrics-student-details">

                <div className="student-metrics-detail-item">
                  <div className="student-metrics-detail-icon">
                    <FaUserGraduate />
                  </div>

                  <div>
                    <span>Student Name</span>
                    <strong>{student.Name || "-"}</strong>
                  </div>
                </div>

                <div className="student-metrics-detail-item">
                  <div className="student-metrics-detail-icon">
                    <FaSchool />
                  </div>

                  <div>
                    <span>Class</span>
                    <strong>{student.Class || "-"}</strong>
                  </div>
                </div>

                <div className="student-metrics-detail-item">
                  <div className="student-metrics-detail-icon">
                    <FaIdBadge />
                  </div>

                  <div>
                    <span>Roll Number</span>
                    <strong>{student.Rollno || "-"}</strong>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* STUDENT PERFORMANCE LINE GRAPH */}
          <div className="student-metrics-chart-card">

            <div className="student-metrics-chart-header">

              <div className="student-metrics-chart-heading">
                <div className="student-metrics-chart-icon">
                  <FaChartLine />
                </div>

                <div>
                  <h2>Student Performance Trend</h2>
                  <p>
                    Visual representation of student performance
                  </p>
                </div>
              </div>

              <div className="student-metrics-chart-label">
                <span></span>
                Performance Marks
              </div>

            </div>

            {/* GRAPH */}
            <div className="student-metrics-graph-wrapper">

              {graphPoints.length > 0 ? (

                <svg
                  className="student-metrics-line-graph"
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  preserveAspectRatio="xMidYMid meet"
                  role="img"
                  aria-label="Student performance line graph"
                >

                  <defs>
                    <linearGradient
                      id="studentMetricsAreaGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#7657e8"
                        stopOpacity="0.25"
                      />
                      <stop
                        offset="100%"
                        stopColor="#7657e8"
                        stopOpacity="0.02"
                      />
                    </linearGradient>
                  </defs>

                  {/* Y AXIS GRID LINES */}
                  {yAxisTicks.map((tick, index) => {
                    const y =
                      chartPadding.top +
                      graphHeight -
                      (tick / yAxisMax) * graphHeight;

                    return (
                      <g key={index}>

                        <line
                          x1={chartPadding.left}
                          y1={y}
                          x2={chartWidth - chartPadding.right}
                          y2={y}
                          stroke="#ece8f4"
                          strokeWidth="1"
                          strokeDasharray="5 5"
                        />

                        <text
                          x={chartPadding.left - 12}
                          y={y + 4}
                          textAnchor="end"
                          fill="#8c849c"
                          fontSize="12"
                        >
                          {Number(tick.toFixed(1))}
                        </text>

                      </g>
                    );
                  })}

                  {/* X AXIS */}
                  <line
                    x1={chartPadding.left}
                    y1={chartPadding.top + graphHeight}
                    x2={chartWidth - chartPadding.right}
                    y2={chartPadding.top + graphHeight}
                    stroke="#d9d2e5"
                    strokeWidth="1.5"
                  />

                  {/* Y AXIS */}
                  <line
                    x1={chartPadding.left}
                    y1={chartPadding.top}
                    x2={chartPadding.left}
                    y2={chartPadding.top + graphHeight}
                    stroke="#d9d2e5"
                    strokeWidth="1.5"
                  />

                  {/* AREA UNDER LINE */}
                  {graphPoints.length > 1 && (
                    <path
                      d={areaPath}
                      fill="url(#studentMetricsAreaGradient)"
                    />
                  )}

                  {/* PERFORMANCE LINE */}
                  {graphPoints.length > 1 && (
                    <path
                      d={linePath}
                      fill="none"
                      stroke="#7657e8"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* PERFORMANCE POINTS */}
                  {graphPoints.map((point, index) => (
                    <g key={point.id}>

                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="10"
                        fill="#7657e8"
                        opacity="0.12"
                      />

                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="5.5"
                        fill="#7657e8"
                        stroke="#ffffff"
                        strokeWidth="2.5"
                      >
                        <title>
                          {point.name}: {point.marks} marks
                        </title>
                      </circle>

                      {/* MARK VALUE */}
                      <text
                        x={point.x}
                        y={point.y - 17}
                        textAnchor="middle"
                        fill="#5b3ac5"
                        fontSize="12"
                        fontWeight="700"
                      >
                        {point.marks}
                      </text>

                      {/* X AXIS LABEL */}
                      <text
                        x={point.x}
                        y={chartPadding.top + graphHeight + 23}
                        textAnchor="end"
                        transform={`rotate(-25 ${point.x} ${
                          chartPadding.top + graphHeight + 23
                        })`}
                        fill="#716981"
                        fontSize="11"
                      >
                        {point.name.length > 17
                          ? `${point.name.substring(0, 15)}...`
                          : point.name}
                      </text>

                    </g>
                  ))}

                  {/* AXIS TITLES */}
                  <text
                    x="17"
                    y={chartHeight / 2}
                    textAnchor="middle"
                    fill="#716981"
                    fontSize="12"
                    transform={`rotate(-90 17 ${chartHeight / 2})`}
                  >
                    Marks
                  </text>

                  <text
                    x={chartWidth / 2}
                    y={chartHeight - 5}
                    textAnchor="middle"
                    fill="#716981"
                    fontSize="12"
                  >
                    Performance Metrics
                  </text>

                </svg>

              ) : (

                <div className="student-metrics-chart-empty">
                  <FaChartLine />

                  <h3>No Performance Data Available</h3>

                  <p>
                    Enter student marks in the table below to generate
                    the performance graph.
                  </p>
                </div>

              )}

            </div>

            {/* GRAPH SUMMARY */}
            <div className="student-metrics-chart-summary">

              <div className="student-metrics-summary-item">
                <span>Average Marks</span>
                <strong>{averageMarks}</strong>
              </div>

              <div className="student-metrics-summary-item">
                <span>Highest Marks</span>
                <strong>{highestMarks}</strong>
              </div>

              <div className="student-metrics-summary-item">
                <span>Lowest Marks</span>
                <strong>{lowestMarks}</strong>
              </div>

              <div className="student-metrics-summary-item">
                <span>Metrics Evaluated</span>
                <strong>{chartData.length}</strong>
              </div>

            </div>

            <div className="student-metrics-chart-note">
              <i className="bi bi-info-circle"></i>
              The graph updates automatically when marks are entered.
              It currently represents the available performance metrics,
              not individual examination results.
            </div>

          </div>

          {/* METRICS TABLE */}
          <div className="student-metrics-table-card">

            <div className="student-metrics-table-header">
              <div>
                <h2>Performance Metrics</h2>
                <p>Enter marks for each performance category</p>
              </div>

              <div className="student-metrics-count">
                {metrics.length} Metrics
              </div>
            </div>

            <div className="student-metrics-table-wrapper">
              <DataTable
                columns={columns}
                data={metrics}
                pagination
                highlightOnHover
                responsive
                customStyles={customStyles}
                noDataComponent={
                  <div className="student-metrics-no-data">
                    No metrics available
                  </div>
                }
              />
            </div>

            {/* SUBMIT BUTTON */}
            <div className="student-metrics-action-area">
              <button
                className="student-metrics-submit-btn"
                onClick={submit}
                disabled={saving}
              >
                <FaSave />

                {saving ? "Saving Metrics..." : "Save Metrics"}
              </button>
            </div>

          </div>

        </>
      )}

    </div>
  );
};

export default MetricsAdd;
