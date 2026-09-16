import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SelectClass.css";

const SelectClass = () => {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [examTypes, setExamTypes] = useState([]);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedExam, setSelectedExam] = useState("");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const CLASSES_API =
    "http://localhost/kkblossom/api.php/Adminapi/AdminExam/getClasses";

  const EXAM_TYPES_API =
    "http://localhost/kkblossom/api.php/Adminapi/AdminExam/getExamTypes";

  /* =========================================
     NORMALIZE API RESPONSE
  ========================================= */

  const normalizeArray = (response) => {
    // Direct array
    if (Array.isArray(response)) {
      return response;
    }

    // { data: [...] }
    if (Array.isArray(response?.data)) {
      return response.data;
    }

    // { classes: [...] }
    if (Array.isArray(response?.classes)) {
      return response.classes;
    }

    // { examTypes: [...] }
    if (Array.isArray(response?.examTypes)) {
      return response.examTypes;
    }

    // { result: [...] }
    if (Array.isArray(response?.result)) {
      return response.result;
    }

    return [];
  };

  /* =========================================
     FETCH DATA
  ========================================= */

  const fetchData = async () => {
    try {
      setLoading(true);

      setMessage({
        type: "",
        text: "",
      });

      const [classesRes, examsRes] = await Promise.all([
        axios.get(CLASSES_API),
        axios.get(EXAM_TYPES_API),
      ]);

      console.log("Classes API Response:", classesRes.data);
      console.log("Exam Types API Response:", examsRes.data);

      const classData = normalizeArray(classesRes.data);
      const examData = normalizeArray(examsRes.data);

      console.log("Normalized Classes:", classData);
      console.log("Normalized Exam Types:", examData);

      setClasses(classData);
      setExamTypes(examData);

      if (!classData.length && !examData.length) {
        setMessage({
          type: "error",
          text: "No classes or exam types were returned by the server.",
        });
      } else if (!classData.length) {
        setMessage({
          type: "error",
          text: "No classes were found.",
        });
      } else if (!examData.length) {
        setMessage({
          type: "error",
          text: "No exam types were found.",
        });
      }
    } catch (error) {
      console.error("Error fetching Select Class data:", error);

      setClasses([]);
      setExamTypes([]);

      let errorMessage =
        "Unable to fetch classes or exam types.";

      if (error.response) {
        errorMessage +=
          ` Server returned ${error.response.status}.`;
      } else if (error.request) {
        errorMessage +=
          " Backend server is not responding.";
      } else {
        errorMessage +=
          " Please check your API configuration.";
      }

      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* =========================================
     SUBMIT
  ========================================= */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedClass) {
      setMessage({
        type: "error",
        text: "Please select a class.",
      });
      return;
    }

    if (!selectedExam) {
      setMessage({
        type: "error",
        text: "Please select an exam type.",
      });
      return;
    }

    setMessage({
      type: "",
      text: "",
    });

    navigate("/dashboard/ExamComponent/view-exams", {
      state: {
        class: selectedClass,
        examType: selectedExam,
      },
    });
  };

  /* =========================================
     LOADING SCREEN
  ========================================= */

  if (loading) {
    return (
      <div className="select-class-page">
        <div className="select-loading-card">

          <div className="select-loading-icon">
            <i className="bi bi-mortarboard-fill"></i>
          </div>

          <div className="select-spinner"></div>

          <h2>Loading Examination</h2>

          <p>
            Please wait while we load classes and
            examination types...
          </p>

        </div>
      </div>
    );
  }

  /* =========================================
     MAIN UI
  ========================================= */

  return (
    <div className="select-class-page">

      <div className="select-class-container">

        {/* HEADER */}

        <div className="select-page-header">

          <div className="select-header-icon">
            <i className="bi bi-journal-check"></i>
          </div>

          <div className="select-header-content">

            <span className="select-eyebrow">
              EXAM MANAGEMENT
            </span>

            <h1>Select Examination</h1>

            <p>
              Select a class and examination type to
              view student examination results.
            </p>

          </div>

        </div>

        {/* MESSAGE */}

        {message.type === "error" && (
          <div className="select-message error">

            <div className="select-message-icon">
              <i className="bi bi-exclamation-triangle-fill"></i>
            </div>

            <div className="select-message-content">
              <strong>Something went wrong</strong>
              <span>{message.text}</span>
            </div>

            <button
              type="button"
              className="select-retry-button"
              onClick={fetchData}
            >
              <i className="bi bi-arrow-clockwise"></i>
              Retry
            </button>

          </div>
        )}

        {message.type === "success" && (
          <div className="select-message success">

            <div className="select-message-icon">
              <i className="bi bi-check-circle-fill"></i>
            </div>

            <div className="select-message-content">
              <strong>Success</strong>
              <span>{message.text}</span>
            </div>

          </div>
        )}

        {/* MAIN CARD */}

        <div className="select-main-card">

          {/* CARD HEADER */}

          <div className="select-card-header">

            <div className="select-card-title">

              <div className="select-title-icon">
                <i className="bi bi-funnel-fill"></i>
              </div>

              <div>
                <h2>Choose Examination</h2>
                <p>
                  Select the required class and exam type
                </p>
              </div>

            </div>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="select-form"
          >

            <div className="select-form-grid">

              {/* CLASS */}

              <div className="select-field">

                <label htmlFor="class">
                  <i className="bi bi-mortarboard-fill"></i>
                  Class
                </label>

                <div className="select-input-wrapper">

                  <i className="bi bi-building"></i>

                  <select
                    id="class"
                    name="class"
                    value={selectedClass}
                    onChange={(e) =>
                      setSelectedClass(e.target.value)
                    }
                  >

                    <option value="">
                      Select Class
                    </option>

                    {Array.isArray(classes) &&
                      classes.map((row, index) => {

                        const className =
                          row?.Classname ??
                          row?.classname ??
                          row?.className ??
                          row?.class ??
                          "";

                        return (
                          <option
                            key={
                              row?.id ??
                              row?.ID ??
                              index
                            }
                            value={className}
                          >
                            Class {className}
                          </option>
                        );
                      })}

                  </select>

                  <i className="bi bi-chevron-down select-arrow"></i>

                </div>

                {!classes.length && (
                  <small className="select-field-warning">
                    No classes available
                  </small>
                )}

              </div>

              {/* EXAM TYPE */}

              <div className="select-field">

                <label htmlFor="exam">
                  <i className="bi bi-journal-text"></i>
                  Exam Type
                </label>

                <div className="select-input-wrapper">

                  <i className="bi bi-file-earmark-text"></i>

                  <select
                    id="exam"
                    name="exam"
                    value={selectedExam}
                    onChange={(e) =>
                      setSelectedExam(e.target.value)
                    }
                  >

                    <option value="">
                      Select Exam
                    </option>

                    {Array.isArray(examTypes) &&
                      examTypes.map(
                        (examType, index) => {

                          const examName =
                            examType?.Examtype ??
                            examType?.examtype ??
                            examType?.examType ??
                            examType?.name ??
                            "";

                          return (
                            <option
                              key={
                                examType?.id ??
                                examType?.ID ??
                                index
                              }
                              value={examName}
                            >
                              {examName}
                            </option>
                          );
                        }
                      )}

                  </select>

                  <i className="bi bi-chevron-down select-arrow"></i>

                </div>

                {!examTypes.length && (
                  <small className="select-field-warning">
                    No exam types available
                  </small>
                )}

              </div>

            </div>

            {/* SELECTED PREVIEW */}

            {(selectedClass || selectedExam) && (
              <div className="selection-preview">

                <div className="preview-icon">
                  <i className="bi bi-eye-fill"></i>
                </div>

                <div className="preview-content">

                  <span>Your Selection</span>

                  <strong>
                    {selectedClass
                      ? `Class ${selectedClass}`
                      : "Select Class"}

                    {selectedExam &&
                      ` • ${selectedExam}`}
                  </strong>

                </div>

              </div>
            )}

            {/* ACTIONS */}

            <div className="select-form-footer">

              <div className="select-help">

                <i className="bi bi-info-circle-fill"></i>

                <span>
                  Select both fields to continue
                </span>

              </div>

              <button
                type="submit"
                className="select-submit-button"
                disabled={
                  !selectedClass ||
                  !selectedExam
                }
              >
                <span>View Examinations</span>
                <i className="bi bi-arrow-right"></i>
              </button>

            </div>

          </form>

        </div>

        {/* STATS */}

        <div className="select-stats">

          <div className="select-stat-card">

            <div className="select-stat-icon">
              <i className="bi bi-mortarboard-fill"></i>
            </div>

            <div>
              <span>Available Classes</span>
              <strong>{classes.length}</strong>
            </div>

          </div>

          <div className="select-stat-card">

            <div className="select-stat-icon">
              <i className="bi bi-journal-bookmark-fill"></i>
            </div>

            <div>
              <span>Exam Types</span>
              <strong>{examTypes.length}</strong>
            </div>

          </div>

          <div className="select-stat-card">

            <div className="select-stat-icon">
              <i className="bi bi-shield-check"></i>
            </div>

            <div>
              <span>Exam Management</span>
              <strong>Ready</strong>
            </div>

          </div>

        </div>

        {/* INFORMATION */}

        <div className="select-info-box">

          <div className="select-info-icon">
            <i className="bi bi-lightbulb-fill"></i>
          </div>

          <div>

            <strong>How it works</strong>

            <p>
              Choose your class and examination type,
              then click <b>View Examinations</b> to
              continue to the examination management page.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default SelectClass;