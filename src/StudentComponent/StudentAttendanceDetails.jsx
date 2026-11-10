
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./StudentAttendanceDetails.css";

const StudentAttendanceDetails = () => {
  const { id } = useParams();

  const [info, setInfo] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          `http://localhost/kkblossom/api.php/Adminapi/AdminStudentAttendance/studentAttendance/${id}`
        );

        if (!active) return;

        if (res.data.status) {
          setInfo(res.data.info);

          setAttendance({
            totalDays: Number(res.data.attendance?.[0]) || 0,
            presentDays: Number(res.data.attendance?.[1]) || 0,
            absentDates: Array.isArray(res.data.attendance?.[2])
              ? res.data.attendance[2]
              : [],
          });
        } else {
          setError(
            res.data.message || "Unable to fetch attendance data."
          );
        }
      } catch (err) {
        console.error("Attendance API Error:", err);

        if (active) {
          setError("Server error. Please try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    if (!id) {
      setError("Student ID is missing.");
      setLoading(false);
    } else {
      fetchData();
    }

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="sad-state sad-loading">
        <div className="sad-spinner" />
        <h2>Loading Attendance</h2>
        <p>Fetching the student's attendance records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sad-state">
        <div className="sad-state-icon sad-error-icon">!</div>
        <h2>Unable to Load Attendance</h2>
        <p>{error}</p>
        <button
          className="sad-primary-button"
          onClick={() => window.location.reload()}
          type="button"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!info || !attendance) {
    return (
      <div className="sad-state">
        <div className="sad-state-icon">📋</div>
        <h2>No Attendance Data</h2>
        <p>No attendance records are available for this student.</p>
      </div>
    );
  }

  const totalDays = attendance.totalDays;
  const presentDays = attendance.presentDays;
  const absentCount = Math.max(totalDays - presentDays, 0);

  const percent =
    totalDays > 0
      ? Math.min(
          100,
          Math.floor((presentDays / totalDays) * 100)
        )
      : 0;

  const imageUrl = info.image
    ? `http://localhost/kkblossom/assets/images/students/${info.image}`
    : "http://localhost/kkblossom/assets/icons/user.svg";

  const attendanceStatus =
    percent >= 90
      ? "Excellent"
      : percent >= 75
        ? "Good"
        : percent >= 60
          ? "Needs Improvement"
          : "Low Attendance";

  const formatDate = (dateValue) => {
    if (!dateValue) return "Date unavailable";

    const date = new Date(
      /^\d{4}-\d{2}-\d{2}$/.test(String(dateValue))
        ? `${dateValue}T00:00:00`
        : dateValue
    );

    if (Number.isNaN(date.getTime())) return String(dateValue);

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="sad-page">
      <div className="sad-container">

        {/* PAGE HEADER */}

        <div className="sad-page-header">
          <div className="sad-heading-group">
            <div className="sad-heading-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="3" y="5" width="18" height="16" rx="3" />
                <path d="M16 3v4M8 3v4M3 10h18M8 14h3M8 17h6" />
              </svg>
            </div>

            <div>
              <span className="sad-eyebrow">STUDENT MANAGEMENT</span>
              <h1>Attendance Details</h1>
              <p>Monitor attendance, working days and absences.</p>
            </div>
          </div>

          <div className="sad-record-badge">
            <span className="sad-record-dot" />
            Attendance Record
          </div>
        </div>

        {/* STUDENT PROFILE */}

        <section className="sad-profile-card">
          <div className="sad-profile-accent" />

          <div className="sad-student-avatar">
            <img
              src={imageUrl}
              alt={info.Name || "Student"}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src =
                  "http://localhost/kkblossom/assets/icons/user.svg";
              }}
            />
          </div>

          <div className="sad-profile-content">
            <span className="sad-section-overline">STUDENT PROFILE</span>

            <h2>{info.Name || "Student Name"}</h2>

            <div className="sad-profile-details">
              <div className="sad-profile-detail">
                <span className="sad-detail-label">Class</span>
                <span className="sad-detail-value">
                  {info.Class || "—"}
                </span>
              </div>

              <div className="sad-profile-detail">
                <span className="sad-detail-label">Roll Number</span>
                <span className="sad-detail-value">
                  {info.Rollno ?? "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="sad-profile-attendance">
            <div
              className="sad-mini-ring"
              style={{
                "--attendance-percent": `${percent}%`,
              }}
            >
              <div className="sad-mini-ring-inner">
                <strong>{percent}%</strong>
              </div>
            </div>
            <span>Attendance</span>
          </div>
        </section>

        {/* ATTENDANCE OVERVIEW */}

        <section className="sad-section">
          <div className="sad-section-header">
            <div>
              <span className="sad-section-overline">
                PERFORMANCE OVERVIEW
              </span>
              <h2>Attendance Summary</h2>
            </div>

            <span className="sad-academic-tag">
              <span className="sad-tag-dot" />
              Overall Record
            </span>
          </div>

          <div className="sad-stats-grid">
            <div className="sad-stat-card sad-stat-present">
              <div className="sad-stat-top">
                <div className="sad-stat-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m5 12 4 4L19 6" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
                <span className="sad-stat-chip">Present</span>
              </div>

              <span className="sad-stat-label">Present Days</span>
              <h3>{presentDays}</h3>
              <p>Days attended</p>
            </div>

            <div className="sad-stat-card sad-stat-working">
              <div className="sad-stat-top">
                <div className="sad-stat-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="3" y="4" width="18" height="17" rx="3" />
                    <path d="M16 2v4M8 2v4M3 9h18" />
                  </svg>
                </div>
                <span className="sad-stat-chip">Total</span>
              </div>

              <span className="sad-stat-label">Working Days</span>
              <h3>{totalDays}</h3>
              <p>Total recorded days</p>
            </div>

            <div className="sad-stat-card sad-stat-absent">
              <div className="sad-stat-top">
                <div className="sad-stat-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 9 6 6m0-6-6 6" />
                  </svg>
                </div>
                <span className="sad-stat-chip">Calculated</span>
              </div>

              <span className="sad-stat-label">Days Not Present</span>
              <h3>{absentCount}</h3>
              <p>Working days minus present days</p>
            </div>

            <div className="sad-stat-card sad-stat-percentage">
              <div className="sad-stat-top">
                <div className="sad-stat-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M19 5 5 19M7 7h.01M17 17h.01" />
                    <circle cx="7" cy="7" r="3" />
                    <circle cx="17" cy="17" r="3" />
                  </svg>
                </div>
                <span className="sad-stat-chip">Overall</span>
              </div>

              <span className="sad-stat-label">Attendance Rate</span>
              <h3>{percent}%</h3>
              <p>{attendanceStatus}</p>
            </div>
          </div>
        </section>

        {/* VISUAL ATTENDANCE ANALYSIS */}

        <section className="sad-analysis-card">
          <div className="sad-section-header sad-analysis-header">
            <div>
              <span className="sad-section-overline">
                VISUAL ANALYTICS
              </span>
              <h2>Attendance Performance</h2>
              <p>Present days compared with the total working days.</p>
            </div>
          </div>

          <div className="sad-analysis-content">
            <div className="sad-donut-area">
              <div
                className="sad-donut"
                style={{
                  "--attendance-percent": `${percent}%`,
                }}
                role="img"
                aria-label={`${percent}% attendance`}
              >
                <div className="sad-donut-center">
                  <strong>{percent}%</strong>
                  <span>Attendance</span>
                </div>
              </div>
            </div>

            <div className="sad-analysis-details">
              <div className="sad-analysis-summary">
                <span className="sad-analysis-label">
                  Overall attendance
                </span>
                <strong>{percent}%</strong>
              </div>

              <div className="sad-progress-track">
                <div
                  className="sad-progress-fill"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="sad-legend">
                <div className="sad-legend-row">
                  <span className="sad-legend-name">
                    <span className="sad-legend-dot sad-legend-present" />
                    Present days
                  </span>
                  <strong>{presentDays}</strong>
                </div>

                <div className="sad-legend-row">
                  <span className="sad-legend-name">
                    <span className="sad-legend-dot sad-legend-absent" />
                    Days not present
                  </span>
                  <strong>{absentCount}</strong>
                </div>

                <div className="sad-legend-row">
                  <span className="sad-legend-name">
                    <span className="sad-legend-dot sad-legend-total" />
                    Total working days
                  </span>
                  <strong>{totalDays}</strong>
                </div>
              </div>

              <div className="sad-attendance-note">
                <span className="sad-note-icon">i</span>
                <p>
                  {totalDays === 0
                    ? "No working days have been recorded yet."
                    : `The student attended ${presentDays} out of ${totalDays} recorded working days.`}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ABSENT DATES */}

        <section className="sad-absence-card">
          <div className="sad-section-header">
            <div>
              <span className="sad-section-overline">
                ATTENDANCE HISTORY
              </span>
              <h2>Absent Dates</h2>
              <p>Dates recorded as absent in the attendance system.</p>
            </div>

            <span className="sad-absence-count">
              {attendance.absentDates.length}{" "}
              {attendance.absentDates.length === 1 ? "record" : "records"}
            </span>
          </div>

          {attendance.absentDates.length > 0 ? (
            <div className="sad-absence-list">
              {attendance.absentDates.map((item, index) => (
                <div
                  key={item.id ?? `${item.Date}-${index}`}
                  className="sad-absence-item"
                >
                  <div className="sad-absence-calendar">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <rect x="3" y="5" width="18" height="16" rx="3" />
                      <path d="M16 3v4M8 3v4M3 10h18" />
                    </svg>
                  </div>

                  <div className="sad-absence-date-content">
                    <strong>{formatDate(item.Date)}</strong>
                    <span>Absence recorded</span>
                  </div>

                  <span className="sad-absence-status">
                    Absent
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="sad-no-absence">
              <div className="sad-no-absence-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m7 12 3 3 7-7" />
                </svg>
              </div>

              <h3>No Absences Recorded</h3>
              <p>No absent dates are available in the attendance records.</p>
            </div>
          )}
        </section>

        <footer className="sad-page-footer">
          <span>KK BLOSSOMS SCHOOL</span>
          <span>Student Attendance Management</span>
        </footer>
      </div>
    </div>
  );
};

export default StudentAttendanceDetails;
