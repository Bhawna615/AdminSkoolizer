import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./NewExam.css";

const NewExam = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const BASE_URL =
    "http://localhost/kkblossom/api.php/Adminapi/AdminExam/";

  useEffect(() => {
    axios
      .get(BASE_URL + "getClasses")
      .then((res) => {
        setClasses(res.data || []);
      })
      .catch((err) => {
        console.error("Error fetching classes:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSubmit = () => {
    if (!selectedClass) {
      alert("Select class");
      return;
    }

    navigate("/dashboard/ExamComponent/create-exam", {
      state: { class: selectedClass },
    });
  };

  return (
    <div className="new-exam-page">
      {/* Background Decoration */}
      <div className="exam-bg-shape exam-bg-shape-one"></div>
      <div className="exam-bg-shape exam-bg-shape-two"></div>

      <div className="new-exam-wrapper">
        {/* Header */}
        <div className="new-exam-header">
          <div className="new-exam-header-left">
            <div className="new-exam-icon">
              <i className="las la-file-alt"></i>
            </div>

            <div>
              <span className="new-exam-eyebrow">
                EXAM MANAGEMENT
              </span>

              <h1>Create New Exam</h1>

              <p>
                Select a class to start creating a new examination.
              </p>
            </div>
          </div>

          <button
            className="new-exam-back-btn"
            onClick={() => navigate(-1)}
          >
            <i className="las la-arrow-left"></i>
            <span>Back</span>
          </button>
        </div>

        {/* Main Card */}
        <div className="new-exam-card">
          {/* Left Information Panel */}
          <div className="new-exam-info-panel">
            <div className="info-panel-icon">
              <i className="las la-graduation-cap"></i>
            </div>

            <span className="info-panel-label">
              EXAM SETUP
            </span>

            <h2>
              Start your
              <br />
              examination
            </h2>

            <p>
              Choose the class for which you want to create an
              examination. You can configure subjects, marks,
              duration and other exam details in the next step.
            </p>

            <div className="exam-info-features">
              <div className="exam-info-feature">
                <div className="feature-icon">
                  <i className="las la-users"></i>
                </div>

                <div>
                  <strong>Class Based</strong>
                  <span>Select students by class</span>
                </div>
              </div>

              <div className="exam-info-feature">
                <div className="feature-icon">
                  <i className="las la-book-open"></i>
                </div>

                <div>
                  <strong>Easy Setup</strong>
                  <span>Configure exam details</span>
                </div>
              </div>

              <div className="exam-info-feature">
                <div className="feature-icon">
                  <i className="las la-check-circle"></i>
                </div>

                <div>
                  <strong>Quick Process</strong>
                  <span>Create exams in a few steps</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="new-exam-form-panel">
            <div className="form-panel-heading">
              <span className="form-step">STEP 01</span>

              <h2>Select Class</h2>

              <p>
                Select the class for which you want to create
                the examination.
              </p>
            </div>

            <div className="class-selection-box">
              <div className="selection-label-row">
                <label htmlFor="classSelect">
                  Class
                </label>

                <span className="required-text">
                  Required
                </span>
              </div>

              <div className="select-wrapper">
                <div className="select-icon">
                  <i className="las la-school"></i>
                </div>

                <select
                  id="classSelect"
                  className="exam-select-dropdown"
                  value={selectedClass}
                  onChange={(e) =>
                    setSelectedClass(e.target.value)
                  }
                  disabled={loading}
                >
                  <option value="">
                    {loading
                      ? "Loading classes..."
                      : "Select a class"}
                  </option>

                  {classes.map((c) => (
                    <option
                      key={c.id}
                      value={c.Classname}
                    >
                      Class {c.Classname}
                    </option>
                  ))}
                </select>

                <i className="las la-angle-down select-arrow"></i>
              </div>

              <div className="selection-helper">
                <i className="las la-info-circle"></i>

                <span>
                  Select a class to continue with exam creation.
                </span>
              </div>
            </div>

            {/* Selected Class Preview */}
            <div
              className={`selected-class-preview ${
                selectedClass ? "active" : ""
              }`}
            >
              <div className="selected-class-icon">
                <i className="las la-users"></i>
              </div>

              <div className="selected-class-content">
                <span>SELECTED CLASS</span>

                <strong>
                  {selectedClass
                    ? `Class ${selectedClass}`
                    : "No class selected"}
                </strong>
              </div>

              {selectedClass && (
                <div className="selected-check">
                  <i className="las la-check"></i>
                </div>
              )}
            </div>

            {/* Action */}
            <div className="new-exam-actions">
              <button
                className="exam-cancel-button"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>

              <button
                className="exam-continue-button"
                onClick={handleSubmit}
                disabled={!selectedClass}
              >
                <span>Continue</span>
                <i className="las la-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="new-exam-footer-note">
          <i className="las la-shield-alt"></i>

          <span>
            Make sure you select the correct class before
            continuing.
          </span>
        </div>
      </div>
    </div>
  );
};

export default NewExam;