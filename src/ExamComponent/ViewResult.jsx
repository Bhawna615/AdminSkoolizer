import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./ViewResult.css";

const ViewResult = () => {
  // =========================================================
  // ROUTE PARAMETER
  // =========================================================
  const { examCode } = useParams();

  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================
  const [result, setResult] = useState([]);
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const BASE_URL =
    "http://localhost/kkblossom/api.php/Adminapi/AdminExam/";

  // =========================================================
  // FETCH RESULT
  // =========================================================
  useEffect(() => {
    if (!examCode) {
      setLoading(false);
      setError("Exam code is missing.");
      return;
    }

    const fetchResult = async () => {
      try {
        setLoading(true);
        setError("");

        const fd = new FormData();
        fd.append("id", examCode);

        const res = await axios.post(
          BASE_URL + "viewResult",
          fd
        );

        console.log("View Result Response:", res.data);

        if (res.data.status) {
          setResult(
            Array.isArray(res.data.result)
              ? res.data.result
              : []
          );

          setDetails(
            res.data.details || {}
          );
        } else {
          setError(
            res.data.message ||
              "Failed to fetch result"
          );
        }
      } catch (err) {
        console.error(
          "Error fetching result:",
          err
        );

        setError(
          "Server error while fetching result."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [examCode]);

  // =========================================================
  // SEARCH
  // =========================================================
  const filteredResults = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return result;
    }

    return result.filter((row) => {
      const name = String(
        row.Name || ""
      ).toLowerCase();

      const rollNo = String(
        row.Rollno || ""
      ).toLowerCase();

      return (
        name.includes(query) ||
        rollNo.includes(query)
      );
    });
  }, [result, search]);

  // =========================================================
  // RESULT STATISTICS
  // =========================================================
  const totalMarks = useMemo(() => {
    return result.reduce((total, row) => {
      const marks = Number(
        row.Marksobtained
      );

      return total + (isNaN(marks) ? 0 : marks);
    }, 0);
  }, [result]);

  const averageMarks = useMemo(() => {
    if (!result.length) return 0;

    return (
      totalMarks / result.length
    ).toFixed(2);
  }, [totalMarks, result.length]);

  const highestMarks = useMemo(() => {
    if (!result.length) return 0;

    return Math.max(
      ...result.map((row) => {
        const marks = Number(
          row.Marksobtained
        );

        return isNaN(marks) ? 0 : marks;
      })
    );
  }, [result]);

  // =========================================================
  // CSV EXPORT
  // =========================================================
  const exportCSV = () => {
    if (!result.length) return;

    const csvRows = [];

    csvRows.push([
      "Examcode",
      "Rollno",
      "Name",
      "Marks",
    ]);

    result.forEach((row) => {
      csvRows.push([
        row.Examcode,
        row.Rollno,
        `"${String(
          row.Name || ""
        ).replace(/"/g, '""')}"`,
        row.Marksobtained,
      ]);
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvRows
        .map((row) => row.join(","))
        .join("\n");

    const encodedUri =
      encodeURI(csvContent);

    const link =
      document.createElement("a");

    link.href = encodedUri;

    link.download = `${
      details.Examtype || "result"
    }.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  // =========================================================
  // BACK
  // =========================================================
  const handleBack = () => {
    navigate(-1);
  };

  // =========================================================
  // LOADING STATE
  // =========================================================
  if (loading) {
    return (
      <div className="view-result-page">

        <div className="view-result-loading">

          <div className="result-loading-icon">
            <i className="bi bi-bar-chart-fill"></i>
          </div>

          <div className="result-spinner"></div>

          <h3>
            Loading Results
          </h3>

          <p>
            Please wait while we fetch the examination results...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="view-result-page">

      <div className="view-result-container">

        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="result-page-header">

          <div className="result-header-left">

            <button
              type="button"
              className="result-back-button"
              onClick={handleBack}
              title="Go Back"
            >
              <i className="bi bi-arrow-left"></i>
            </button>

            <div className="result-header-icon">
              <i className="bi bi-bar-chart-line-fill"></i>
            </div>

            <div className="result-header-text">

              <span className="result-eyebrow">
                EXAM MANAGEMENT
              </span>

              <h1>
                Examination Results
              </h1>

              <p>
                View and export student examination results
              </p>

            </div>

          </div>

          {result.length > 0 && (
            <button
              type="button"
              className="result-export-top"
              onClick={exportCSV}
            >
              <i className="bi bi-file-earmark-spreadsheet-fill"></i>
              Export CSV
            </button>
          )}

        </div>

        {/* =====================================================
            ERROR
        ===================================================== */}
        {error && (
          <div className="result-error">

            <div className="result-error-icon">
              <i className="bi bi-exclamation-triangle-fill"></i>
            </div>

            <div>
              <strong>
                Unable to load results
              </strong>

              <p>
                {error}
              </p>
            </div>

          </div>
        )}

        {/* =====================================================
            EXAM INFORMATION
        ===================================================== */}
        <div className="result-exam-card">

          <div className="result-exam-main">

            <div className="result-exam-icon">
              <i className="bi bi-journal-check"></i>
            </div>

            <div>

              <span>
                Examination
              </span>

              <h2>
                {details.Examtype ||
                  "Examination"}
              </h2>

            </div>

          </div>

          <div className="result-exam-details">

            <div className="result-detail">

              <i className="bi bi-mortarboard-fill"></i>

              <div>
                <span>
                  Class
                </span>

                <strong>
                  {details.Class || "-"}
                </strong>
              </div>

            </div>

            <div className="result-detail">

              <i className="bi bi-upc-scan"></i>

              <div>
                <span>
                  Exam Code
                </span>

                <strong>
                  {examCode || "-"}
                </strong>
              </div>

            </div>

            <div className="result-detail">

              <i className="bi bi-people-fill"></i>

              <div>
                <span>
                  Students
                </span>

                <strong>
                  {result.length}
                </strong>
              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            STATISTICS
        ===================================================== */}
        <div className="result-stat-grid">

          <div className="result-stat-card">

            <div className="result-stat-icon students">
              <i className="bi bi-people-fill"></i>
            </div>

            <div>
              <span>
                Total Students
              </span>

              <strong>
                {result.length}
              </strong>
            </div>

          </div>

          <div className="result-stat-card">

            <div className="result-stat-icon average">
              <i className="bi bi-graph-up-arrow"></i>
            </div>

            <div>
              <span>
                Average Marks
              </span>

              <strong>
                {averageMarks}
              </strong>
            </div>

          </div>

          <div className="result-stat-card">

            <div className="result-stat-icon highest">
              <i className="bi bi-trophy-fill"></i>
            </div>

            <div>
              <span>
                Highest Marks
              </span>

              <strong>
                {highestMarks}
              </strong>
            </div>

          </div>

        </div>

        {/* =====================================================
            RESULT TABLE CARD
        ===================================================== */}
        <div className="result-table-card">

          {/* TABLE HEADER */}
          <div className="result-table-header">

            <div className="result-title-row">

              <div className="result-title-icon">
                <i className="bi bi-table"></i>
              </div>

              <div>

                <h2>
                  Student Results
                </h2>

                <p>
                  Examination marks and student performance
                </p>

              </div>

            </div>

            {/* SEARCH */}
            <div className="result-search">

              <i className="bi bi-search"></i>

              <input
                type="text"
                placeholder="Search name or roll no..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                >
                  <i className="bi bi-x"></i>
                </button>
              )}

            </div>

          </div>

          {/* ===================================================
              TABLE
          =================================================== */}
          <div className="result-table-wrapper">

            <table className="result-table">

              <thead>

                <tr>

                  <th className="result-number-column">
                    #
                  </th>

                  <th>
                    Exam Code
                  </th>

                  <th>
                    Roll No.
                  </th>

                  <th>
                    Student Name
                  </th>

                  <th className="result-marks-column">
                    Marks Obtained
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredResults.length > 0 ? (

                  filteredResults.map(
                    (row, index) => {

                      const marks =
                        Number(
                          row.Marksobtained
                        );

                      return (
                        <tr key={index}>

                          <td className="result-number-cell">
                            {index + 1}
                          </td>

                          <td>

                            <span className="exam-code-badge">
                              {row.Examcode}
                            </span>

                          </td>

                          <td>

                            <span className="roll-number-badge">
                              {row.Rollno}
                            </span>

                          </td>

                          <td>

                            <div className="result-student">

                              <div className="result-student-avatar">
                                {String(
                                  row.Name || "S"
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div>

                                <strong>
                                  {row.Name}
                                </strong>

                                <span>
                                  Student
                                </span>

                              </div>

                            </div>

                          </td>

                          <td className="result-marks-cell">

                            <span className="marks-badge">
                              {isNaN(marks)
                                ? row.Marksobtained
                                : marks}
                            </span>

                          </td>

                        </tr>
                      );
                    }
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="5"
                      className="result-empty"
                    >

                      <div className="result-empty-icon">
                        <i className="bi bi-clipboard-x"></i>
                      </div>

                      <h3>
                        No Results Found
                      </h3>

                      <p>
                        {search
                          ? "No students match your search."
                          : "No examination results are available."}
                      </p>

                      {search && (
                        <button
                          type="button"
                          onClick={() =>
                            setSearch("")
                          }
                        >
                          Clear Search
                        </button>
                      )}

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

          {/* ===================================================
              FOOTER
          =================================================== */}
          {result.length > 0 && (
            <div className="result-table-footer">

              <div className="result-footer-info">

                <div className="result-footer-icon">
                  <i className="bi bi-check2-circle"></i>
                </div>

                <div>

                  <strong>
                    {filteredResults.length}
                    {" "}
                    of{" "}
                    {result.length}
                  </strong>

                  <span>
                    results displayed
                  </span>

                </div>

              </div>

              <button
                type="button"
                className="result-export-button"
                onClick={exportCSV}
              >
                <i className="bi bi-download"></i>
                Export Results
              </button>

            </div>
          )}

        </div>

        {/* =====================================================
            INFORMATION BOX
        ===================================================== */}
        <div className="result-info-box">

          <div className="result-info-icon">
            <i className="bi bi-info-circle-fill"></i>
          </div>

          <div>

            <strong>
              Result Information
            </strong>

            <p>
              This page displays the marks submitted
              for the selected examination. You can
              search students by name or roll number
              and export the complete result as a CSV file.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ViewResult;