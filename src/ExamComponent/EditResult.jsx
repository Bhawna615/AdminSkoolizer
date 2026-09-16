
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./EditResult.css";

const EditResult = () => {
  const { examCode } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const BASE_URL =
    "http://localhost/kkblossom/api.php/Adminapi/AdminExam/";

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

        const res = await axios.get(
          `${BASE_URL}loadResult/${examCode}`
        );

        console.log("Edit Result Response:", res.data);

        setResult(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching result:", err);
        setError("Unable to load examination marks.");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [examCode]);

  const handleInputChange = (index, value) => {
    // Allow only numbers and decimal values
    if (value !== "" && !/^\d*\.?\d*$/.test(value)) {
      return;
    }

    const updatedResult = [...result];
    updatedResult[index].Marksobtained = value;
    setResult(updatedResult);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formSubmitting) return;

    try {
      setFormSubmitting(true);

      const formData = new FormData();

      formData.append("code", examCode);

      result.forEach((r) => {
        formData.append("rollno[]", r.Rollno);
        formData.append("name[]", r.Name);
        formData.append("marks[]", r.Marksobtained || 0);
      });

      const res = await axios.post(
        `${BASE_URL}saveMarks`,
        formData
      );

      alert(
        res.data?.message ||
          "Marks updated successfully!"
      );

      // Go to View Result page
      navigate(
        `/dashboard/ExamComponent/view-result/${examCode}`
      );

    } catch (err) {
      console.error("Error updating marks:", err);

      alert(
        err.response?.data?.message ||
          "Failed to update marks."
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  const filteredResults = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return result;

    return result.filter((row) => {
      const name = String(row.Name || "").toLowerCase();
      const rollNo = String(row.Rollno || "").toLowerCase();

      return (
        name.includes(query) ||
        rollNo.includes(query)
      );
    });
  }, [result, search]);

  const enteredCount = useMemo(() => {
    return result.filter(
      (row) =>
        row.Marksobtained !== "" &&
        row.Marksobtained !== null &&
        row.Marksobtained !== undefined
    ).length;
  }, [result]);

  const pendingCount = result.length - enteredCount;

  const totalMarks = useMemo(() => {
    return result.reduce((total, row) => {
      const marks = Number(row.Marksobtained);

      return total + (isNaN(marks) ? 0 : marks);
    }, 0);
  }, [result]);

  const averageMarks = result.length
    ? (totalMarks / result.length).toFixed(2)
    : "0.00";

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="edit-result-page">
        <div className="edit-result-loading">
          <div className="edit-loading-icon">
            <i className="bi bi-pencil-square"></i>
          </div>

          <div className="edit-spinner"></div>

          <h3>Loading Marks</h3>

          <p>
            Please wait while we load the examination results...
          </p>
        </div>
      </div>
    );
  }

  if (error || !result.length) {
    return (
      <div className="edit-result-page">
        <div className="edit-result-empty-page">
          <div className="edit-empty-icon">
            <i
              className={
                error
                  ? "bi bi-exclamation-triangle-fill"
                  : "bi bi-clipboard-x"
              }
            ></i>
          </div>

          <h2>
            {error
              ? "Unable to Load Results"
              : "No Results Found"}
          </h2>

          <p>
            {error ||
              "No examination results were found for this exam."}
          </p>

          <button
            type="button"
            className="edit-back-button-large"
            onClick={handleBack}
          >
            <i className="bi bi-arrow-left"></i>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const examDetails = result[0];

  return (
    <div className="edit-result-page">
      <div className="edit-result-container">

        {/* HEADER */}
        <div className="edit-result-header">
          <div className="edit-header-left">

            <button
              type="button"
              className="edit-back-button"
              onClick={handleBack}
              title="Go Back"
            >
              <i className="bi bi-arrow-left"></i>
            </button>

            <div className="edit-header-icon">
              <i className="bi bi-pencil-square"></i>
            </div>

            <div className="edit-header-content">
              <span className="edit-eyebrow">
                EXAM MANAGEMENT
              </span>

              <h1>Edit Examination Results</h1>

              <p>
                Update and save student examination marks
              </p>
            </div>
          </div>

          <div className="edit-exam-code">
            <span>EXAM CODE</span>
            <strong>{examCode}</strong>
          </div>
        </div>

        {/* EXAM INFORMATION */}
        <div className="edit-exam-card">

          <div className="edit-exam-main">
            <div className="edit-exam-icon">
              <i className="bi bi-journal-check"></i>
            </div>

            <div>
              <span className="edit-label">
                Examination
              </span>

              <h2>
                {examDetails?.Examtype || "Examination"}
              </h2>

              <p>
                Update marks for the selected examination
              </p>
            </div>
          </div>

          <div className="edit-exam-details">

            <div className="edit-detail-item">
              <div className="edit-detail-icon">
                <i className="bi bi-mortarboard-fill"></i>
              </div>

              <div>
                <span>Class</span>

                <strong>
                  {examDetails?.Class || "-"}
                </strong>
              </div>
            </div>

            <div className="edit-detail-item">
              <div className="edit-detail-icon">
                <i className="bi bi-upc-scan"></i>
              </div>

              <div>
                <span>Exam Code</span>
                <strong>{examCode}</strong>
              </div>
            </div>

            <div className="edit-detail-item">
              <div className="edit-detail-icon">
                <i className="bi bi-people-fill"></i>
              </div>

              <div>
                <span>Students</span>
                <strong>{result.length}</strong>
              </div>
            </div>

          </div>
        </div>

        {/* STATS */}
        <div className="edit-stat-grid">

          <div className="edit-stat-card">
            <div className="edit-stat-icon students">
              <i className="bi bi-people-fill"></i>
            </div>

            <div>
              <span>Total Students</span>
              <strong>{result.length}</strong>
            </div>
          </div>

          <div className="edit-stat-card">
            <div className="edit-stat-icon entered">
              <i className="bi bi-check-circle-fill"></i>
            </div>

            <div>
              <span>Marks Entered</span>
              <strong>{enteredCount}</strong>
            </div>
          </div>

          <div className="edit-stat-card">
            <div className="edit-stat-icon pending">
              <i className="bi bi-clock-fill"></i>
            </div>

            <div>
              <span>Pending</span>
              <strong>{pendingCount}</strong>
            </div>
          </div>

          <div className="edit-stat-card">
            <div className="edit-stat-icon average">
              <i className="bi bi-graph-up-arrow"></i>
            </div>

            <div>
              <span>Average Marks</span>
              <strong>{averageMarks}</strong>
            </div>
          </div>

        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>

          <div className="edit-table-card">

            {/* TABLE HEADER */}
            <div className="edit-table-header">

              <div className="edit-table-title">

                <div className="edit-title-icon">
                  <i className="bi bi-table"></i>
                </div>

                <div>
                  <h2>Student Marks</h2>

                  <p>
                    Edit marks for each student below
                  </p>
                </div>

              </div>

              <div className="edit-search-box">

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
                    onClick={() => setSearch("")}
                    title="Clear search"
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}

              </div>

            </div>

            {/* TABLE */}
            <div className="edit-table-wrapper">

              <table className="edit-result-table">

                <thead>
                  <tr>
                    <th className="edit-number-column">
                      #
                    </th>

                    <th>
                      Roll No.
                    </th>

                    <th>
                      Student Name
                    </th>

                    <th className="edit-marks-column">
                      Marks
                    </th>

                    <th className="edit-status-column">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {filteredResults.length > 0 ? (

                    filteredResults.map((row) => {

                      const originalIndex =
                        result.findIndex(
                          (item) =>
                            item === row
                        );

                      const hasMarks =
                        row.Marksobtained !== "" &&
                        row.Marksobtained !== null &&
                        row.Marksobtained !== undefined;

                      return (
                        <tr key={row.Rollno}>

                          {/* NUMBER */}
                          <td className="edit-number-cell">
                            {originalIndex + 1}
                          </td>

                          {/* ROLL NUMBER */}
                          <td>

                            <span className="edit-roll-badge">
                              <i className="bi bi-person-badge"></i>
                              {row.Rollno}
                            </span>

                            <input
                              type="hidden"
                              name="rollno[]"
                              value={row.Rollno}
                              readOnly
                            />

                          </td>

                          {/* NAME */}
                          <td>

                            <div className="edit-student">

                              <div className="edit-student-avatar">
                                {String(
                                  row.Name || "S"
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div className="edit-student-info">

                                <strong>
                                  {row.Name}
                                </strong>

                                <span>
                                  Student
                                </span>

                              </div>

                            </div>

                            <input
                              type="hidden"
                              name="name[]"
                              value={row.Name}
                              readOnly
                            />

                          </td>

                          {/* MARKS */}
                          <td className="edit-marks-cell">

                            <div className="marks-input-wrapper">

                              <i className="bi bi-pencil-fill"></i>

                              <input
                                type="text"
                                inputMode="decimal"
                                name="marks[]"
                                value={
                                  row.Marksobtained ?? ""
                                }
                                placeholder="Enter marks"
                                onChange={(e) =>
                                  handleInputChange(
                                    originalIndex,
                                    e.target.value
                                  )
                                }
                              />

                            </div>

                          </td>

                          {/* STATUS */}
                          <td>

                            <span
                              className={
                                hasMarks
                                  ? "edit-status entered"
                                  : "edit-status pending"
                              }
                            >

                              <i
                                className={
                                  hasMarks
                                    ? "bi bi-check-circle-fill"
                                    : "bi bi-clock-fill"
                                }
                              ></i>

                              {hasMarks
                                ? "Entered"
                                : "Pending"}

                            </span>

                          </td>

                        </tr>
                      );
                    })

                  ) : (

                    <tr>

                      <td
                        colSpan="5"
                        className="edit-no-results"
                      >

                        <div className="edit-no-results-icon">
                          <i className="bi bi-search"></i>
                        </div>

                        <h3>
                          No Students Found
                        </h3>

                        <p>
                          No student matches your search.
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            setSearch("")
                          }
                        >
                          Clear Search
                        </button>

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

            {/* FOOTER */}
            <div className="edit-table-footer">

              <div className="edit-footer-info">

                <div className="edit-footer-icon">
                  <i className="bi bi-info-circle-fill"></i>
                </div>

                <div>

                  <strong>
                    {filteredResults.length} of{" "}
                    {result.length} students
                  </strong>

                  <span>
                    displayed in the table
                  </span>

                </div>

              </div>

              <div className="edit-footer-actions">

                <button
                  type="button"
                  className="edit-cancel-button"
                  onClick={handleBack}
                  disabled={formSubmitting}
                >
                  <i className="bi bi-x-circle"></i>
                  Cancel
                </button>

                <button
                  type="submit"
                  className="edit-update-button"
                  disabled={formSubmitting}
                >

                  {formSubmitting ? (
                    <>
                      <span className="button-spinner"></span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2-circle"></i>
                      Update Marks
                    </>
                  )}

                </button>

              </div>

            </div>

          </div>

        </form>

        {/* INFORMATION BOX */}
        <div className="edit-info-box">

          <div className="edit-info-icon">
            <i className="bi bi-shield-check"></i>
          </div>

          <div>

            <strong>
              Marks Update Information
            </strong>

            <p>
              Review all student marks carefully before
              clicking <b>Update Marks</b>. Empty marks will
              be submitted as 0, and the updated results will
              be saved for this examination.
            </p>

          </div>

        </div>

      </div>
    </div>
  );
};

export default EditResult;
