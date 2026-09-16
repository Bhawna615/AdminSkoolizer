import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UploadMarks.css";

const UploadMarks = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedClass = location.state?.class || "4-A";
  const code = location.state?.code || "422";
  const examType = location.state?.examType || "Project-II";

  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const BASE_URL =
    "http://localhost/kkblossom/api.php/Adminapi/AdminExam/";

  // =========================================================
  // LOAD STUDENTS
  // =========================================================
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        setError("");

        const fd = new FormData();

        fd.append("class", selectedClass);
        fd.append("code", code);
        fd.append("examType", examType);

        const res = await axios.post(
          BASE_URL + "getMarksForm",
          fd
        );

        const studentData = Array.isArray(res.data?.students)
          ? res.data.students
          : [];

        setStudents(studentData);

        const initMarks = {};

        studentData.forEach((student) => {
          initMarks[student.id] = "";
        });

        setMarks(initMarks);
      } catch (err) {
        console.error("Error loading students:", err);
        setError(
          "Unable to load students. Please check your connection and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [selectedClass, code, examType]);

  // =========================================================
  // HANDLE MARK CHANGE
  // =========================================================
  const handleChange = (studentId, value) => {
    // Allow empty value
    if (value === "") {
      setMarks((prev) => ({
        ...prev,
        [studentId]: "",
      }));
      return;
    }

    // Allow only valid numbers
    const numericValue = Number(value);

    if (numericValue < 0) {
      return;
    }

    setMarks((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  // =========================================================
  // SEARCH
  // =========================================================
  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return students;
    }

    return students.filter((student) => {
      const name = String(student.Name || "").toLowerCase();
      const rollno = String(student.Rollno || "").toLowerCase();

      return (
        name.includes(query) ||
        rollno.includes(query)
      );
    });
  }, [students, search]);

  // =========================================================
  // MARK STATISTICS
  // =========================================================
  const enteredMarksCount = useMemo(() => {
    return students.filter(
      (student) =>
        marks[student.id] !== "" &&
        marks[student.id] !== undefined &&
        marks[student.id] !== null
    ).length;
  }, [students, marks]);

  const remainingCount =
    students.length - enteredMarksCount;

  // =========================================================
  // UPLOAD MARKS
  // =========================================================
  const uploadMarks = async (e) => {
    e.preventDefault();

    if (students.length === 0) {
      alert("No students available.");
      return;
    }

    try {
      setUploading(true);

      const payload = new FormData();

      students.forEach((student) => {
        payload.append("rollno[]", student.Rollno);
        payload.append("name[]", student.Name);
        payload.append("id[]", student.id);
        payload.append(
          "marks[]",
          marks[student.id] || 0
        );
      });

      payload.append("code", code);
      payload.append("class", selectedClass);
      payload.append("examType", examType);

      const res = await axios.post(
        BASE_URL + "uploadMarks",
        payload
      );

      if (res.data.status) {
        alert("Successfully Uploaded!");

        navigate(
          "/dashboard/ExamComponent/view-exams",
          {
            state: {
              class: selectedClass,
              examType: examType,
            },
          }
        );
      } else {
        alert(
          res.data.message ||
            "Failed to Upload!"
        );
      }
    } catch (err) {
      console.error("Upload error:", err);

      alert(
        "Unable to upload marks. Please check your connection and try again."
      );
    } finally {
      setUploading(false);
    }
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
      <div className="upload-marks-page">
        <div className="upload-marks-loading">

          <div className="upload-loading-icon">
            <i className="bi bi-clipboard-data"></i>
          </div>

          <div className="upload-spinner"></div>

          <h3>
            Loading Students
          </h3>

          <p>
            Preparing the marks entry form...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="upload-marks-page">

      <div className="upload-marks-container">

        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="upload-page-header">

          <div className="upload-header-left">

            <button
              type="button"
              className="upload-back-button"
              onClick={handleBack}
              title="Go Back"
            >
              <i className="bi bi-arrow-left"></i>
            </button>

            <div className="upload-header-icon">
              <i className="bi bi-clipboard2-check-fill"></i>
            </div>

            <div className="upload-header-text">

              <span className="upload-eyebrow">
                EXAM MANAGEMENT
              </span>

              <h1>
                Upload Marks
              </h1>

              <p>
                Enter and submit marks for all students
              </p>

            </div>

          </div>

        </div>

        {/* =====================================================
            EXAM INFORMATION
        ===================================================== */}
        <div className="exam-info-card">

          <div className="exam-info-main">

            <div className="exam-info-icon">
              <i className="bi bi-journal-text"></i>
            </div>

            <div>
              <span>
                Examination
              </span>

              <h2>
                {examType}
              </h2>
            </div>

          </div>

          <div className="exam-info-items">

            <div className="exam-info-item">

              <i className="bi bi-mortarboard-fill"></i>

              <div>
                <span>Class</span>
                <strong>
                  {selectedClass}
                </strong>
              </div>

            </div>

            <div className="exam-info-item">

              <i className="bi bi-hash"></i>

              <div>
                <span>Exam Code</span>
                <strong>
                  {code}
                </strong>
              </div>

            </div>

            <div className="exam-info-item">

              <i className="bi bi-people-fill"></i>

              <div>
                <span>Students</span>
                <strong>
                  {students.length}
                </strong>
              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            ERROR
        ===================================================== */}
        {error && (
          <div className="upload-error">

            <div className="upload-error-icon">
              <i className="bi bi-exclamation-triangle-fill"></i>
            </div>

            <div>
              <strong>
                Something went wrong
              </strong>

              <p>
                {error}
              </p>
            </div>

          </div>
        )}

        {/* =====================================================
            STATISTICS
        ===================================================== */}
        <div className="marks-stat-grid">

          <div className="marks-stat-card">

            <div className="marks-stat-icon total">
              <i className="bi bi-people-fill"></i>
            </div>

            <div>
              <span>
                Total Students
              </span>

              <strong>
                {students.length}
              </strong>
            </div>

          </div>

          <div className="marks-stat-card">

            <div className="marks-stat-icon entered">
              <i className="bi bi-check-circle-fill"></i>
            </div>

            <div>
              <span>
                Marks Entered
              </span>

              <strong>
                {enteredMarksCount}
              </strong>
            </div>

          </div>

          <div className="marks-stat-card">

            <div className="marks-stat-icon pending">
              <i className="bi bi-clock-fill"></i>
            </div>

            <div>
              <span>
                Pending
              </span>

              <strong>
                {remainingCount}
              </strong>
            </div>

          </div>

        </div>

        {/* =====================================================
            MAIN CARD
        ===================================================== */}
        <div className="marks-card">

          {/* CARD HEADER */}
          <div className="marks-card-header">

            <div>

              <div className="marks-title-row">

                <div className="marks-title-icon">
                  <i className="bi bi-table"></i>
                </div>

                <div>

                  <h2>
                    Student Marks
                  </h2>

                  <p>
                    Enter marks obtained by each student
                  </p>

                </div>

              </div>

            </div>

            {/* SEARCH */}
            <div className="marks-search">

              <i className="bi bi-search"></i>

              <input
                type="text"
                placeholder="Search student or roll no..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                >
                  <i className="bi bi-x"></i>
                </button>
              )}

            </div>

          </div>

          {/* ===================================================
              TABLE
          =================================================== */}
          <form onSubmit={uploadMarks}>

            <div className="marks-table-wrapper">

              <table className="marks-table">

                <thead>

                  <tr>

                    <th className="serial-column">
                      #
                    </th>

                    <th>
                      Roll No.
                    </th>

                    <th>
                      Student
                    </th>

                    <th className="marks-column">
                      Marks Obtained
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredStudents.length > 0 ? (

                    filteredStudents.map(
                      (student, index) => {

                        const studentMarks =
                          marks[student.id];

                        const hasMarks =
                          studentMarks !== "" &&
                          studentMarks !== undefined &&
                          studentMarks !== null;

                        return (
                          <tr key={student.id}>

                            <td className="serial-cell">
                              {index + 1}
                            </td>

                            {/* ROLL NUMBER */}
                            <td>

                              <span className="roll-badge">
                                {student.Rollno}
                              </span>

                            </td>

                            {/* STUDENT */}
                            <td>

                              <div className="student-info">

                                <div className="student-avatar">
                                  {String(
                                    student.Name || "S"
                                  )
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>

                                <div>

                                  <strong>
                                    {student.Name}
                                  </strong>

                                  <span>
                                    Student
                                  </span>

                                </div>

                              </div>

                            </td>

                            {/* MARKS */}
                            <td className="marks-input-cell">

                              <div
                                className={`marks-input-wrapper ${
                                  hasMarks
                                    ? "has-value"
                                    : ""
                                }`}
                              >

                                <input
                                  type="number"
                                  step="any"
                                  min="0"
                                  value={
                                    studentMarks ?? ""
                                  }
                                  onChange={(e) =>
                                    handleChange(
                                      student.id,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter marks"
                                />

                                <span>
                                  Marks
                                </span>

                              </div>

                              {hasMarks && (
                                <div className="marks-entered">
                                  <i className="bi bi-check-circle-fill"></i>
                                  Entered
                                </div>
                              )}

                            </td>

                          </tr>
                        );
                      }
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan="4"
                        className="empty-marks"
                      >

                        <div className="empty-marks-icon">
                          <i className="bi bi-person-x"></i>
                        </div>

                        <h3>
                          No Students Found
                        </h3>

                        <p>
                          {search
                            ? "No students match your search."
                            : "There are no students available for this examination."}
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

            {/* =================================================
                FOOTER
            ================================================= */}
            <div className="marks-card-footer">

              <div className="marks-footer-summary">

                <div className="footer-summary-icon">
                  <i className="bi bi-pencil-square"></i>
                </div>

                <div>

                  <strong>
                    {enteredMarksCount} of{" "}
                    {students.length}
                  </strong>

                  <span>
                    students have marks entered
                  </span>

                </div>

              </div>

              <div className="marks-footer-actions">

                <button
                  type="button"
                  className="marks-cancel-button"
                  onClick={handleBack}
                  disabled={uploading}
                >
                  <i className="bi bi-x-lg"></i>
                  Cancel
                </button>

                <button
                  type="submit"
                  className="marks-upload-button"
                  disabled={
                    uploading ||
                    students.length === 0
                  }
                >

                  {uploading ? (
                    <>
                      <span className="button-spinner"></span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-cloud-arrow-up-fill"></i>
                      Upload Marks
                    </>
                  )}

                </button>

              </div>

            </div>

          </form>

        </div>

        {/* =====================================================
            INFORMATION
        ===================================================== */}
        <div className="marks-info-box">

          <div className="marks-info-icon">
            <i className="bi bi-info-circle-fill"></i>
          </div>

          <div>

            <strong>
              Marks Entry Information
            </strong>

            <p>
              Enter the marks obtained by each student.
              Students without entered marks will be
              submitted with <b>0 marks</b>.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default UploadMarks;