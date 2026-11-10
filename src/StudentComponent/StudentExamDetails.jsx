
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./StudentExamDetails1.css";

const StudentExamDetails = () => {
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH STUDENT EXAM DETAILS
  // =====================================================

  useEffect(() => {
    if (id) {
      fetchExamDetails();
    } else {
      setStudent(null);
      setExams([]);
      setLoading(false);
    }
  }, [id]);

  const fetchExamDetails = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost/kkblossom/api.php/Adminapi/AdminStudent/StudentExamDetails",
        {
          id: id
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      console.log("Exam API Response:", response.data);
      console.log("Student Information:", response.data.info);
      console.log("First Exam:", response.data.exams?.[0]);

      if (response.data && response.data.status === true) {
        const studentInfo = Array.isArray(response.data.info)
          ? response.data.info[0]
          : response.data.info;

        setStudent(studentInfo || null);

        if (Array.isArray(response.data.exams)) {
          setExams(response.data.exams);
        } else {
          setExams([]);
        }
      } else {
        setStudent(null);
        setExams([]);
        console.error("API Error:", response.data.message);
      }

    } catch (error) {
      console.error(
        "Error fetching exam details:",
        error.response?.data || error.message
      );

      setStudent(null);
      setExams([]);

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // ACTUAL MARKS OBTAINED
  // =====================================================

  const getExamMarks = (item) => {
    const value = item.Marksobtained;

    if (
      value === undefined ||
      value === null ||
      value === "" ||
      !Number.isFinite(Number(value))
    ) {
      return null;
    }

    return Number(value);
  };

  // =====================================================
  // MAXIMUM MARKS
  // =====================================================

  const getMaximumMarks = (item) => {
    const value = item.Maxmarks;

    if (
      value === undefined ||
      value === null ||
      value === "" ||
      !Number.isFinite(Number(value)) ||
      Number(value) <= 0
    ) {
      return null;
    }

    return Number(value);
  };

  // =====================================================
  // GET EXAM TITLE
  // =====================================================

  const getExamTitle = (item) => {
    const examName = item.Examname;

    if (
      examName &&
      String(examName).trim() !== "" &&
      String(examName).toLowerCase() !== "na" &&
      String(examName).toLowerCase() !== "n/a"
    ) {
      return examName;
    }

    return item.Examtype || "Examination";
  };

  // =====================================================
  // FORMAT EXAM DATE
  // =====================================================

  const formatDate = (date, uploadedAt) => {
    let validDate = date;

    if (
      !validDate ||
      validDate === "0000-00-00" ||
      validDate === "0000-00-00 00:00:00"
    ) {
      validDate = uploadedAt;
    }

    if (
      !validDate ||
      validDate === "0000-00-00" ||
      validDate === "0000-00-00 00:00:00"
    ) {
      return "Date not available";
    }

    const parsedDate = new Date(
      String(validDate).replace(" ", "T")
    );

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date not available";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // =====================================================
  // GET EXAM TIMESTAMP FOR SORTING
  // =====================================================

  const getExamTimestamp = (item) => {
    const date =
      item.Date &&
      item.Date !== "0000-00-00" &&
      item.Date !== "0000-00-00 00:00:00"
        ? item.Date
        : item.uploaded_at;

    if (!date) return 0;

    const timestamp = new Date(
      String(date).replace(" ", "T")
    ).getTime();

    return Number.isNaN(timestamp) ? 0 : timestamp;
  };

  // =====================================================
  // LATEST FIVE EXAMS HAVING ACTUAL MARKS
  // =====================================================

  const latestFiveMarks = [...exams]
    .filter((item) => getExamMarks(item) !== null)
    .sort(
      (a, b) => getExamTimestamp(b) - getExamTimestamp(a)
    )
    .slice(0, 5)
    .reverse();

  // =====================================================
  // SCALE GRAPH USING MAXIMUM MARKS
  // =====================================================

  const maximumChartValue = Math.max(
    ...latestFiveMarks.map((item) => {
      return (
        getMaximumMarks(item) ||
        getExamMarks(item) ||
        0
      );
    }),
    1
  );

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {
    return (
      <div className="student-exam-loading">
        <div className="student-exam-loader"></div>
        <p>Loading student exam details...</p>
      </div>
    );
  }

  // =====================================================
  // STUDENT NOT FOUND
  // =====================================================

  if (!student) {
    return (
      <div className="student-exam-not-found">
        <div className="student-exam-empty-icon">!</div>
        <h3>No Student Found</h3>
        <p>Student examination details are not available.</p>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="student-exam-container">

      {/* Student Profile */}
      <div className="student-exam-profile-card">
        <div className="student-exam-top">

          <div className="student-exam-image-box">
            {student.image ? (
              <img
                src={`http://localhost/kkblossom/assets/images/students/${student.image}`}
                alt="Student"
              />
            ) : (
              <img
                src="http://localhost/kkblossom/assets/icons/user.svg"
                alt="Default"
              />
            )}
          </div>

          <div className="student-exam-info-box">

            <span className="student-exam-profile-label">
              STUDENT PROFILE
            </span>

            <h2 className="student-exam-name">
              {student.Name}
            </h2>

            <div className="student-exam-profile-details">

              <p>
                <span>Class</span>
                <strong>{student.Class || "N/A"}</strong>
              </p>

              <p>
                <span>Roll No.</span>
                <strong>{student.Rollno || "N/A"}</strong>
              </p>

            </div>
          </div>

          <div className="student-exam-profile-icon">
            <i className="bi bi-mortarboard-fill"></i>
          </div>

        </div>
      </div>

      {/* Examination Overview */}
      <div className="student-exam-overview">

        <div className="student-exam-overview-heading">
          <div>
            <h2>Examination Overview</h2>
            <p>
              Student examination performance at a glance
            </p>
          </div>
        </div>

        <div className="student-exam-chart-grid">

          {/* Tests Attended */}
          <div className="student-exam-chart-card">

            <div className="student-exam-chart-heading">
              <div>
                <h3>Tests Attended</h3>
                <p>Recorded examination details</p>
              </div>

              <div className="student-exam-chart-icon">
                <i className="bi bi-clipboard-check"></i>
              </div>
            </div>

            <div className="student-exam-pie-content">

              <div
                className="student-exam-pie-chart"
                style={{
                  background:
                    exams.length > 0
                      ? "conic-gradient(#7657e8 0deg 360deg)"
                      : "conic-gradient(#e9e5f2 0deg 360deg)",
                }}
              >
                <div className="student-exam-pie-inner">
                  <strong>{exams.length}</strong>
                  <span>Tests</span>
                </div>
              </div>

              <div className="student-exam-pie-legend">

                <div className="student-exam-legend-item">
                  <span className="student-exam-legend-dot"></span>

                  <div>
                    <strong>{exams.length}</strong>
                    <span>Recorded tests</span>
                  </div>
                </div>

                {/* <p>
                  Based on examination records returned by the API.
                </p> */}

              </div>
            </div>
          </div>

          {/* Latest Test Performance */}
          <div className="student-exam-chart-card">

            <div className="student-exam-chart-heading">
              <div>
                <h3>Latest Test Performance</h3>
                <p>
                  Marks obtained in the latest five tests
                </p>
              </div>

              <div className="student-exam-chart-icon">
                <i className="bi bi-bar-chart-fill"></i>
              </div>
            </div>

            {latestFiveMarks.length > 0 ? (

              <div className="student-exam-bar-chart">

                {latestFiveMarks.map((item, index) => {
                  const marks = getExamMarks(item);
                  const maxMarks = getMaximumMarks(item);

                  const barHeight = Math.max(
                    (marks / maximumChartValue) * 100,
                    4
                  );

                  return (
                    <div
                      className="student-exam-bar-item"
                      key={`${item.Examcode}-${index}`}
                    >

                      <div className="student-exam-bar-value">
                        {marks}
                        {maxMarks !== null && `/${maxMarks}`}
                      </div>

                      <div className="student-exam-bar-track">
                        <div
                          className="student-exam-bar"
                          style={{
                            height: `${barHeight}%`,
                          }}
                        ></div>
                      </div>

                      <span className="student-exam-bar-label">
                        {item.Subject || `Test ${index + 1}`}
                      </span>

                    </div>
                  );
                })}

              </div>

            ) : (

              <div className="student-exam-chart-no-data">
                <i className="bi bi-bar-chart"></i>

                <p>Marks data is not available.</p>

                <span>
                  Marks will appear here when provided by the API.
                </span>
              </div>

            )}

          </div>

        </div>
      </div>

      {/* Exam Details */}
      <div className="student-exam-section">

        <div className="student-exam-section-heading">
          <div>
            <h2>Exam Details</h2>
            <p>
              Complete examination records of the student
            </p>
          </div>

          <span className="student-exam-count">
            {exams.length}{" "}
            {exams.length === 1 ? "Exam" : "Exams"}
          </span>
        </div>

        {exams.length === 0 ? (

          <div className="student-exam-no-data">

            <div className="student-exam-no-data-icon">
              <i className="bi bi-folder2-open"></i>
            </div>

            <h3>No Exam Records Found</h3>

            <p>
              There are currently no examination records for this student.
            </p>

          </div>

        ) : (

          <div className="student-exam-grid">

            {exams.map((item, index) => {
              const marks = getExamMarks(item);
              const maxMarks = getMaximumMarks(item);

              return (
                <div
                  key={`${item.Examcode}-${index}`}
                  className="student-exam-box"
                >

                  <div className="student-exam-box-top">

                    <div className="student-exam-box-icon">
                      <i className="bi bi-book-half"></i>
                    </div>

                    <span className="student-exam-number">
                      TEST {index + 1}
                    </span>

                  </div>

                  <h3 className="student-exam-subject-name">
                    {getExamTitle(item)}
                  </h3>

                  <div className="student-exam-detail-row">
                    <span>
                      <i className="bi bi-book"></i>
                      Subject
                    </span>

                    <strong>
                      {item.Subject || "Not available"}
                    </strong>
                  </div>

                  <div className="student-exam-detail-row">
                    <span>
                      <i className="bi bi-calendar-event"></i>
                      Exam Date
                    </span>

                    <strong>
                      {formatDate(item.Date, item.uploaded_at)}
                    </strong>
                  </div>

                  {/* Marks Obtained / Maximum Marks */}
                  <div className="student-exam-marks-row">
                    <span>
                      <i className="bi bi-award-fill"></i>
                      Marks Obtained
                    </span>

                    <strong>
                      {marks !== null ? marks : "--"}
                      {" / "}
                      {maxMarks !== null ? maxMarks : "--"}
                    </strong>
                  </div>

                </div>
              );
            })}

          </div>

        )}

      </div>

    </div>
  );
};

export default StudentExamDetails;
