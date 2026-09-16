import React, { useEffect, useState } from "react";
import { getClasses } from "../ScheduleComponent/timetableApi";
import { useNavigate } from "react-router-dom";
import "./ViewTimeTable.css";

const ViewTimeTable = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [day, setDay] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // =========================================================
  // LOAD CLASSES
  // =========================================================
  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getClasses();

      console.log("getClasses API response:", res);

      /*
       * Handle different possible API response formats.
       *
       * Format 1:
       * res = [...]
       *
       * Format 2:
       * res.data = [...]
       *
       * Format 3:
       * res.data = {
       *   data: [...]
       * }
       *
       * Format 4:
       * res.data = {
       *   classes: [...]
       * }
       */

      let classData = [];

      // If getClasses() directly returns an array
      if (Array.isArray(res)) {
        classData = res;
      }

      // If Axios response contains array in res.data
      else if (Array.isArray(res?.data)) {
        classData = res.data;
      }

      // If API returns { data: [...] }
      else if (Array.isArray(res?.data?.data)) {
        classData = res.data.data;
      }

      // If API returns { classes: [...] }
      else if (Array.isArray(res?.data?.classes)) {
        classData = res.data.classes;
      }

      // If getClasses() returns { classes: [...] }
      else if (Array.isArray(res?.classes)) {
        classData = res.classes;
      }

      console.log("Classes loaded:", classData);

      setClasses(classData);
    } catch (error) {
      console.error("Error loading classes:", error);

      setClasses([]);
      setError("Unable to load classes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // GO BUTTON
  // =========================================================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedClass || !day) {
      alert("Please select class and day");
      return;
    }

    navigate("/dashboard/ScheduleComponent/TimeTableResult", {
      state: {
        class: selectedClass,
        day: day,
      },
    });
  };

  // =========================================================
  // RETRY
  // =========================================================
  const handleRetry = () => {
    loadClasses();
  };

  return (
    <div className="vtt-page">
      <div className="vtt-container">

        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="vtt-header">

          <div className="vtt-header-icon">
            <i className="bi bi-calendar3"></i>
          </div>

          <div className="vtt-header-content">
            <span className="vtt-eyebrow">
              SCHEDULE MANAGEMENT
            </span>

            <h2 className="vtt-title">
              View Time Table
            </h2>

            <p className="vtt-subtitle">
              Select a class and day to view the timetable
            </p>
          </div>

        </div>

        {/* =====================================================
            MAIN CARD
        ===================================================== */}
        <div className="vtt-card">

          {/* CARD HEADING */}
          <div className="vtt-card-heading">

            <div className="vtt-heading-icon">
              <i className="bi bi-calendar-week"></i>
            </div>

            <div>
              <h3>Select Timetable</h3>

              <p>
                Choose the required class and day
              </p>
            </div>

          </div>

          {/* ===================================================
              ERROR
          =================================================== */}
          {error && (
            <div className="vtt-error-box">

              <div className="vtt-error-icon">
                <i className="bi bi-exclamation-triangle-fill"></i>
              </div>

              <div className="vtt-error-content">
                <strong>
                  Unable to load classes
                </strong>

                <p>
                  {error}
                </p>
              </div>

              <button
                type="button"
                className="vtt-retry-button"
                onClick={handleRetry}
              >
                <i className="bi bi-arrow-clockwise"></i>
                Retry
              </button>

            </div>
          )}

          {/* ===================================================
              FORM
          =================================================== */}
          <form
            onSubmit={handleSubmit}
            className="vtt-form"
          >

            {/* =================================================
                CLASS
            ================================================= */}
            <div className="vtt-field">

              <label htmlFor="vtt-class">

                <i className="bi bi-mortarboard-fill"></i>

                Select Class

              </label>

              <div className="vtt-select-wrapper">

                <select
                  id="vtt-class"
                  value={selectedClass}
                  onChange={(e) =>
                    setSelectedClass(e.target.value)
                  }
                  className="vtt-select"
                  disabled={loading}
                >

                  <option value="">
                    {loading
                      ? "Loading Classes..."
                      : "Select Class"}
                  </option>

                  {!loading &&
                    classes.map((c, index) => {

                      /*
                       * Support common property naming:
                       *
                       * Classname
                       * classname
                       * className
                       */

                      const className =
                        c?.Classname ??
                        c?.classname ??
                        c?.className ??
                        "";

                      const classId =
                        c?.id ??
                        c?.ID ??
                        index;

                      if (!className) {
                        return null;
                      }

                      return (
                        <option
                          key={classId}
                          value={className}
                        >
                          Class {className}
                        </option>
                      );
                    })}

                </select>

                <i className="bi bi-chevron-down vtt-select-arrow"></i>

              </div>

              {/* No classes */}
              {!loading &&
                !error &&
                classes.length === 0 && (
                  <small className="vtt-field-error">
                    No classes available.
                  </small>
                )}

            </div>

            {/* =================================================
                DAY
            ================================================= */}
            <div className="vtt-field">

              <label htmlFor="vtt-day">

                <i className="bi bi-calendar-day-fill"></i>

                Select Day

              </label>

              <div className="vtt-select-wrapper">

                <select
                  id="vtt-day"
                  value={day}
                  onChange={(e) =>
                    setDay(e.target.value)
                  }
                  className="vtt-select"
                >

                  <option value="">
                    Select Day
                  </option>

                  <option value="Monday">
                    Monday
                  </option>

                  <option value="Tuesday">
                    Tuesday
                  </option>

                  <option value="Wednesday">
                    Wednesday
                  </option>

                  <option value="Thursday">
                    Thursday
                  </option>

                  <option value="Friday">
                    Friday
                  </option>

                  <option value="Saturday">
                    Saturday
                  </option>

                </select>

                <i className="bi bi-chevron-down vtt-select-arrow"></i>

              </div>

            </div>

            {/* =================================================
                BUTTON
            ================================================= */}
            <div className="vtt-button-area">

              <button
                type="submit"
                className="vtt-go-button"
                disabled={
                  loading ||
                  classes.length === 0
                }
              >

                <i className="bi bi-eye-fill"></i>

                View Time Table

                <i className="bi bi-arrow-right vtt-button-arrow"></i>

              </button>

            </div>

          </form>

        </div>

        {/* =====================================================
            SELECTED TIMETABLE PREVIEW
        ===================================================== */}
        {(selectedClass || day) && (
          <div className="vtt-selection-card">

            <div className="vtt-selection-header">

              <div className="vtt-selection-header-icon">
                <i className="bi bi-check-circle-fill"></i>
              </div>

              <div>
                <h4>
                  Selected Timetable
                </h4>

                <p>
                  Your selected schedule details
                </p>
              </div>

            </div>

            <div className="vtt-selection-details">

              {/* CLASS */}
              <div className="vtt-selection-item">

                <div className="vtt-selection-icon">
                  <i className="bi bi-mortarboard-fill"></i>
                </div>

                <div className="vtt-selection-text">

                  <span>
                    Class
                  </span>

                  <strong>
                    {selectedClass
                      ? `Class ${selectedClass}`
                      : "Not Selected"}
                  </strong>

                </div>

              </div>

              <div className="vtt-selection-divider"></div>

              {/* DAY */}
              <div className="vtt-selection-item">

                <div className="vtt-selection-icon">
                  <i className="bi bi-calendar-day-fill"></i>
                </div>

                <div className="vtt-selection-text">

                  <span>
                    Day
                  </span>

                  <strong>
                    {day || "Not Selected"}
                  </strong>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* =====================================================
            INFO BOX
        ===================================================== */}
        <div className="vtt-info-box">

          <div className="vtt-info-icon">
            <i className="bi bi-info-circle-fill"></i>
          </div>

          <div className="vtt-info-content">

            <strong>
              How it works
            </strong>

            <p>
              Select a class and day above, then click
              <b> View Time Table </b>
              to see the complete schedule.
            </p>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ViewTimeTable;