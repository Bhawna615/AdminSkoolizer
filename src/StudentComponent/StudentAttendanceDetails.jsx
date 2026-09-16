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
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost/kkblossom/api.php/Adminapi/AdminStudentAttendance/studentAttendance/${id}`
        );

        if (res.data.status) {
          setInfo(res.data.info);

          setAttendance({
            totalDays: res.data.attendance[0],
            presentDays: res.data.attendance[1],
            absentDates: res.data.attendance[2] || [],
          });
        } else {
          setError(res.data.message || "Unable to fetch attendance data");
        }
      } catch (err) {
        console.error(err);
        setError("Server Error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="student-attendance-loading">
        <div className="student-attendance-loader"></div>
        <p>Loading Attendance Details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-attendance-error">
        {error}
      </div>
    );
  }

  if (!info || !attendance) {
    return (
      <div className="student-attendance-empty">
        No Attendance Data Available
      </div>
    );
  }

  const percent =
    attendance.totalDays !== 0
      ? Math.floor(
          (attendance.presentDays / attendance.totalDays) * 100
        )
      : 0;

  const imageUrl = info.image
    ? `http://localhost/kkblossom/assets/images/students/${info.image}`
    : `http://localhost/kkblossom/assets/icons/user.svg`;

  return (
    <div className="student-attendance-page">
      <div className="student-attendance-container">

        {/* ================= STUDENT PROFILE ================= */}

        <div className="student-attendance-profile">

          <div className="student-attendance-image-section">
            <div className="student-attendance-image-wrapper">
              <img
                src={imageUrl}
                alt="student"
                className="student-attendance-image"
              />
            </div>
          </div>

          <div className="student-attendance-info-section">
            <h2 className="student-attendance-student-name">
              {info.Name}
            </h2>

            <div className="student-attendance-info-grid">

              <div className="student-attendance-info-item">
                <span className="student-attendance-label">
                  Class
                </span>

                <span className="student-attendance-value">
                  {info.Class}
                </span>
              </div>

              <div className="student-attendance-info-item">
                <span className="student-attendance-label">
                  Roll Number
                </span>

                <span className="student-attendance-value">
                  {info.Rollno}
                </span>
              </div>

            </div>
          </div>

        </div>


        {/* ================= ATTENDANCE DETAILS ================= */}

        <div className="student-attendance-details-section">

          <div className="student-attendance-heading-wrapper">
            <h2 className="student-attendance-heading">
              Attendance Details
            </h2>

            <div className="student-attendance-heading-line"></div>
          </div>


          {/* ================= ATTENDANCE CARDS ================= */}

          <div className="student-attendance-stats">

            <div className="student-attendance-stat-card">

              <p className="student-attendance-stat-label">
                Present Days
              </p>

              <h2 className="student-attendance-stat-number">
                {attendance.presentDays}
              </h2>

            </div>


            <div className="student-attendance-stat-card">

              <p className="student-attendance-stat-label">
                Total Working Days
              </p>

              <h2 className="student-attendance-stat-number">
                {attendance.totalDays}
              </h2>

            </div>


            <div className="student-attendance-stat-card student-attendance-percentage-card">

              <p className="student-attendance-stat-label">
                Attendance Percentage
              </p>

              <h2 className="student-attendance-stat-number">
                {percent}%
              </h2>

            </div>

          </div>


          {/* ================= SUMMARY ================= */}

          <div className="student-attendance-summary">

            <p className="student-attendance-summary-text">
              <span className="student-attendance-summary-number">
                {attendance.presentDays}
              </span>

              <span>
                out of
              </span>

              <span className="student-attendance-summary-number">
                {attendance.totalDays}
              </span>

              <span>
                days present
              </span>
            </p>

          </div>


          {/* ================= ABSENT DATES ================= */}

          <div className="student-attendance-absent-section">

            <h3 className="student-attendance-absent-heading">
              Absent Dates
            </h3>

            {attendance.absentDates.length > 0 ? (

              <div className="student-attendance-absent-list">

                {attendance.absentDates.map((item, index) => {

                  const formattedDate = new Date(
                    item.Date
                  ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  });

                  return (
                    <div
                      key={index}
                      className="student-attendance-absent-item"
                    >

                      <span className="student-attendance-date-icon">
                        📅
                      </span>

                      <span className="student-attendance-date">
                        {formattedDate}
                      </span>

                    </div>
                  );
                })}

              </div>

            ) : (

              <div className="student-attendance-no-absence">
                🎉 No absences recorded
              </div>

            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default StudentAttendanceDetails;