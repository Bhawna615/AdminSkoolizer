
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  FaChartPie,
  FaUsers,
  FaBookOpen,
  FaTrophy,
  FaChartLine
} from "react-icons/fa";
import "./ClassWiseReport.css";

const BASE_URL =
  "http://localhost/kkblossom/api.php/Adminapi/AdminExam";

const ClassWiseReport = () => {
  const location = useLocation();

  const className = location.state?.class;
  const examType = location.state?.exam;

  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // PERFORMANCE CATEGORIES
  // =========================================================

  const performanceCategories = [
    {
      name: "Good",
      range: "75% and above",
      color: "#16a085",
      min: 75,
      max: 100
    },
    {
      name: "Average",
      range: "50% - 74%",
      color: "#7657e8",
      min: 50,
      max: 74.99
    },
    {
      name: "Needs Improvement",
      range: "35% - 49%",
      color: "#f0a34a",
      min: 35,
      max: 49.99
    },
    {
      name: "Poor",
      range: "Below 35%",
      color: "#e35d6a",
      min: 0,
      max: 34.99
    }
  ];

  // =========================================================
  // FETCH CLASS REPORT
  // =========================================================

  useEffect(() => {
    if (className && examType) {
      fetchReport();
    } else {
      setLoading(false);
      setError("Class or examination details are missing.");
    }
  }, [className, examType]);

  const fetchReport = async () => {
    setLoading(true);
    setError("");

    try {
      console.log("SENDING TO API:", {
        class: className,
        exam: examType
      });

      const res = await axios.post(
        `${BASE_URL}/generateClassWiseReport`,
        {
          class: className,
          exam: examType
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      console.log("FULL DATA:", res.data);

      if (!res.data.status) {
        setStudents([]);
        setExams([]);
        setResults([]);
        setError("Unable to generate class report.");
        return;
      }

      setStudents(res.data.data?.students || []);
      setExams(res.data.data?.exams || []);
      setResults(res.data.data?.results || []);

    } catch (error) {
      console.log("API ERROR:", error);

      setStudents([]);
      setExams([]);
      setResults([]);
      setError("Failed to load class report. Please try again.");

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // GET MARK
  // =========================================================

  const getMark = (studentRoll, examId) => {
    const result = results.find(
      (x) =>
        String(x.Rollno) === String(studentRoll) &&
        String(x.Examcode) === String(examId)
    );

    return result ? result.Marksobtained : "-";
  };

  // =========================================================
  // CALCULATE INDIVIDUAL STUDENT PERCENTAGE
  // =========================================================

  const getStudentPercentage = (student) => {
    let total = 0;
    let max = 0;

    exams.forEach((exam) => {
      const mark = getMark(student.Rollno, exam.id);

      const obtained =
        mark !== "-" &&
        mark !== null &&
        mark !== "" &&
        Number.isFinite(Number(mark))
          ? Number(mark)
          : 0;

      total += obtained;
      max += Number(exam.Maxmarks) || 0;
    });

    return max > 0 ? (total / max) * 100 : 0;
  };

  // =========================================================
  // CLASS-WISE SUBJECT PERFORMANCE
  // =========================================================

  const subjectPerformance = exams.map((exam) => {
    const maxMarks = Number(exam.Maxmarks) || 0;

    const studentPercentages = students.map((student) => {
      const mark = getMark(student.Rollno, exam.id);

      const obtained =
        mark !== "-" &&
        mark !== null &&
        mark !== "" &&
        Number.isFinite(Number(mark))
          ? Number(mark)
          : 0;

      return maxMarks > 0
        ? (obtained / maxMarks) * 100
        : 0;
    });

    const total = studentPercentages.reduce(
      (sum, value) => sum + value,
      0
    );

    const average =
      studentPercentages.length > 0
        ? total / studentPercentages.length
        : 0;

    const highest =
      studentPercentages.length > 0
        ? Math.max(...studentPercentages)
        : 0;

    const lowest =
      studentPercentages.length > 0
        ? Math.min(...studentPercentages)
        : 0;

    return {
      subject: exam.Subject,
      maxMarks,
      average: Number(average.toFixed(2)),
      highest: Number(highest.toFixed(2)),
      lowest: Number(lowest.toFixed(2))
    };
  });

  // =========================================================
  // OVERALL CLASS STATISTICS
  // =========================================================

  const overallAverage =
    subjectPerformance.length > 0
      ? (
          subjectPerformance.reduce(
            (sum, item) => sum + item.average,
            0
          ) / subjectPerformance.length
        ).toFixed(1)
      : "0.0";

  const overallHighest =
    subjectPerformance.length > 0
      ? Math.max(
          ...subjectPerformance.map((item) => item.highest)
        ).toFixed(1)
      : "0.0";

  const overallLowest =
    subjectPerformance.length > 0
      ? Math.min(
          ...subjectPerformance.map((item) => item.lowest)
        ).toFixed(1)
      : "0.0";

  // =========================================================
  // CALCULATE STUDENT PERFORMANCE DISTRIBUTION
  // =========================================================

  const performanceDistribution = performanceCategories.map(
    (category) => {
      const categoryStudents = students.filter((student) => {
        const percentage = getStudentPercentage(student);

        return (
          percentage >= category.min &&
          percentage <= category.max
        );
      });

      const count = categoryStudents.length;

      const percentage =
        students.length > 0
          ? (count / students.length) * 100
          : 0;

      return {
        ...category,
        count,
        percentage: Number(percentage.toFixed(1))
      };
    }
  );

  // =========================================================
  // PIE CHART CONFIGURATION
  // =========================================================

  const pieSize = 280;
  const pieCenter = pieSize / 2;
  const pieRadius = 105;

  // Convert pie chart angle into SVG coordinates

  const getPieCoordinates = (angle) => {
    const radians = (angle * Math.PI) / 180;

    return {
      x: pieCenter + pieRadius * Math.cos(radians),
      y: pieCenter + pieRadius * Math.sin(radians)
    };
  };

  // Create individual pie chart slices

  const getPieSlicePath = (startAngle, endAngle) => {
    const start = getPieCoordinates(startAngle);
    const end = getPieCoordinates(endAngle);

    const angleDifference = endAngle - startAngle;
    const largeArcFlag = angleDifference > 180 ? 1 : 0;

    return `
      M ${pieCenter} ${pieCenter}
      L ${start.x} ${start.y}
      A ${pieRadius} ${pieRadius}
      0 ${largeArcFlag} 1
      ${end.x} ${end.y}
      Z
    `;
  };

  let currentPieAngle = -90;

  const pieSlices = performanceDistribution.map((item) => {
    const sliceAngle =
      students.length > 0
        ? (item.count / students.length) * 360
        : 0;

    const startAngle = currentPieAngle;
    const endAngle = currentPieAngle + sliceAngle;

    currentPieAngle = endAngle;

    return {
      ...item,
      startAngle,
      endAngle,
      path: getPieSlicePath(startAngle, endAngle)
    };
  });

  // =========================================================
  // GET STUDENT TOTAL
  // =========================================================

  const getStudentTotal = (student) => {
    let total = 0;
    let max = 0;

    exams.forEach((exam) => {
      const mark = getMark(student.Rollno, exam.id);

      const obtained =
        mark !== "-" &&
        mark !== null &&
        mark !== "" &&
        Number.isFinite(Number(mark))
          ? Number(mark)
          : 0;

      total += obtained;
      max += Number(exam.Maxmarks) || 0;
    });

    return { total, max };
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="class-report-page">

      {/* PAGE HEADER */}

      <div className="class-report-top">

        <div className="class-report-heading">

          <div className="class-report-icon">
            <FaChartLine />
          </div>

          <div>
            <h2>
              Class {className} - {examType} Report
            </h2>

            <p>
              Student performance and examination results
            </p>
          </div>

        </div>

      </div>

      {/* LOADING */}

      {loading ? (

        <div className="class-report-loading">
          <div className="class-report-spinner"></div>
          <p>Generating class performance report...</p>
        </div>

      ) : error ? (

        <div className="class-report-error">
          <i className="bi bi-exclamation-circle"></i>
          <span>{error}</span>
        </div>

      ) : (

        <>

          {/* REPORT INFO */}

          <div className="report-info-row">

            <div className="report-info-card">
              <span className="report-info-label">
                CLASS
              </span>

              <strong>Class {className}</strong>
            </div>

            <div className="report-info-card">
              <span className="report-info-label">
                EXAM TYPE
              </span>

              <strong>{examType}</strong>
            </div>

            <div className="report-info-card">
              <span className="report-info-label">
                STUDENTS
              </span>

              <strong>{students.length}</strong>
            </div>

            <div className="report-info-card">
              <span className="report-info-label">
                SUBJECTS
              </span>

              <strong>{exams.length}</strong>
            </div>

          </div>

          {/* =================================================
              CLASS PERFORMANCE PIE CHART
          ================================================= */}

          <div className="class-performance-chart-card">

            {/* CHART HEADER */}

            <div className="class-performance-chart-header">

              <div className="class-performance-chart-heading">

                <div className="class-performance-chart-icon">
                  <FaChartPie />
                </div>

                <div>
                  <h3>Overall Class Performance</h3>

                  <p>
                    Distribution of students according to their
                    overall examination percentage
                  </p>
                </div>

              </div>

              <div className="class-performance-chart-badge">
                <FaUsers />
                Class Analysis
              </div>

            </div>

            {/* PIE CHART */}

            {students.length > 0 && exams.length > 0 ? (

              <div className="class-pie-chart-container">

                {/* PIE GRAPH */}

                <div className="class-pie-chart-visual">

                  <svg
                    className="class-performance-pie-svg"
                    viewBox={`0 0 ${pieSize} ${pieSize}`}
                    role="img"
                    aria-label="Distribution of students by overall examination performance"
                  >

                    {students.length === 1 ? (

                      <circle
                        cx={pieCenter}
                        cy={pieCenter}
                        r={pieRadius}
                        fill={performanceDistribution.find(
                          (item) => item.count > 0
                        )?.color || "#7657e8"}
                      />

                    ) : (

                      pieSlices.map((slice, index) => {

                        if (slice.count === 0) return null;

                        if (slice.count === students.length) {
                          return (
                            <circle
                              key={index}
                              cx={pieCenter}
                              cy={pieCenter}
                              r={pieRadius}
                              fill={slice.color}
                            />
                          );
                        }

                        return (
                          <path
                            key={index}
                            d={slice.path}
                            fill={slice.color}
                            stroke="#ffffff"
                            strokeWidth="2"
                          >
                            <title>
                              {slice.name}: {slice.count} students
                              ({slice.percentage}%)
                            </title>
                          </path>
                        );
                      })

                    )}

                  </svg>

                  {/* PIE CHART CENTER INFORMATION */}

                  <div className="class-pie-chart-center">

                    <strong>{students.length}</strong>

                    <span>Total Students</span>

                  </div>

                </div>

                {/* PIE CHART LEGEND */}

                <div className="class-pie-chart-legend">

                  <h4>Student Performance</h4>

                  <p>
                    Number of students in each performance category
                  </p>

                  {performanceDistribution.map((item, index) => (

                    <div
                      className="class-pie-legend-item"
                      key={index}
                    >

                      <div className="class-pie-legend-left">

                        <span
                          className="class-pie-legend-color"
                          style={{
                            backgroundColor: item.color
                          }}
                        ></span>

                        <div className="class-pie-legend-info">

                          <strong>{item.name}</strong>

                          <small>{item.range}</small>

                        </div>

                      </div>

                      <div className="class-pie-legend-right">

                        <strong>{item.count}</strong>

                        <span>
                          {item.percentage}%
                        </span>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            ) : (

              <div className="class-performance-empty">

                <FaChartPie />

                <h3>No Performance Data Available</h3>

                <p>
                  Student examination results are required to
                  generate the class performance pie chart.
                </p>

              </div>

            )}

            {/* CLASS PERFORMANCE SUMMARY */}

            <div className="class-performance-summary">

              <div className="class-performance-summary-item">

                <div className="summary-icon average-icon">
                  <FaChartLine />
                </div>

                <div>
                  <span>Overall Class Average</span>
                  <strong>{overallAverage}%</strong>
                </div>

              </div>

              <div className="class-performance-summary-item">

                <div className="summary-icon highest-icon">
                  <FaTrophy />
                </div>

                <div>
                  <span>Highest Subject Score</span>
                  <strong>{overallHighest}%</strong>
                </div>

              </div>

              <div className="class-performance-summary-item">

                <div className="summary-icon lowest-icon">
                  <FaBookOpen />
                </div>

                <div>
                  <span>Lowest Subject Score</span>
                  <strong>{overallLowest}%</strong>
                </div>

              </div>

            </div>

            {/* SUBJECT PERFORMANCE BREAKDOWN */}

            <div className="class-subject-breakdown">

              <h4>Subject Performance Breakdown</h4>

              <div className="class-subject-grid">

                {subjectPerformance.map((item, index) => (

                  <div
                    className="class-subject-item"
                    key={index}
                  >

                    <div className="class-subject-item-top">

                      <strong>{item.subject}</strong>

                      <span>
                        {item.average.toFixed(1)}%
                      </span>

                    </div>

                    <div className="class-subject-progress">

                      <span
                        style={{
                          width: `${Math.max(
                            0,
                            Math.min(item.average, 100)
                          )}%`
                        }}
                      ></span>

                    </div>

                    <div className="class-subject-item-bottom">

                      <span>
                        Highest: {item.highest.toFixed(1)}%
                      </span>

                      <span>
                        Lowest: {item.lowest.toFixed(1)}%
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            </div>

            <p className="class-performance-note">
              <i className="bi bi-info-circle"></i>
              The pie chart shows the number and percentage of
              students in each performance category, based on
              their overall examination percentage. Missing
              examination marks are treated as zero in this report.
            </p>

          </div>

          {/* =================================================
              STUDENT RESULTS TABLE
          ================================================= */}

          <div className="class-report-table-card">

            <div className="report-table-header">

              <div>
                <h3>Student Results</h3>

                <p>
                  Marks obtained in each subject
                </p>
              </div>

            </div>

            <div className="class-report-table-wrapper">

              <table className="class-report-table">

                <thead>

                  <tr>

                    <th className="sticky-roll">
                      ROLL NO
                    </th>

                    <th className="sticky-name">
                      NAME
                    </th>

                    {exams.map((e, i) => (

                      <th key={i} className="subject-header">

                        <span>
                          {e.Subject}
                        </span>

                        <small>
                          Max {e.Maxmarks}
                        </small>

                      </th>

                    ))}

                    <th className="total-header">
                      TOTAL
                    </th>

                    <th className="percentage-header">
                      PERCENTAGE
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {students.length > 0 ? (

                    students.map((s, i) => {

                      const { total, max } =
                        getStudentTotal(s);

                      const percentage =
                        max > 0
                          ? ((total / max) * 100).toFixed(1)
                          : "0.0";

                      return (

                        <tr key={i}>

                          <td className="roll-cell">
                            {s.Rollno}
                          </td>

                          <td className="name-cell">
                            {s.Name}
                          </td>

                          {exams.map((e, j) => {

                            const mark = getMark(
                              s.Rollno,
                              e.id
                            );

                            return (

                              <td
                                key={j}
                                className="marks-cell"
                              >
                                {mark}
                              </td>

                            );

                          })}

                          <td className="total-cell">

                            <strong>{total}</strong>

                            <span>/ {max}</span>

                          </td>

                          <td className="percentage-cell">

                            <span>{percentage}%</span>

                          </td>

                        </tr>

                      );

                    })

                  ) : (

                    <tr>

                      <td
                        colSpan={exams.length + 4}
                        className="no-report-data"
                      >

                        <i className="bi bi-inbox"></i>

                        <span>
                          No student results found
                        </span>

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </>

      )}

    </div>
  );
};

export default ClassWiseReport;
