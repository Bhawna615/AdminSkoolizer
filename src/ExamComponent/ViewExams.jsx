
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./ViewExams.css";

const ViewExams = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedClass = location.state?.class;
  const selectedExamType = location.state?.examType;

  const [exams, setExams] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [search, setSearch] = useState("");

  // ==================================================
  // BASE URL
  // ==================================================
  const BASE_URL =
    "http://localhost/kkblossom/api.php/Adminapi/AdminExam/";

  // ==================================================
  // FETCH EXAMS
  // ==================================================
  const fetchData = async () => {
    if (!selectedClass || !selectedExamType) return;

    try {
      setLoading(true);

      const fd = new FormData();

      fd.append("class", selectedClass);
      fd.append("examType", selectedExamType);

      const res = await axios.post(
        BASE_URL + "getExams",
        fd
      );

      console.log("Get Exams Response:", res.data);

      setExams(res.data?.exams || []);
      setTeachers(res.data?.teachers || []);

    } catch (error) {
      console.error("Error fetching exams:", error);

      alert(
        error.response?.data?.message ||
        "Unable to load exams."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // INITIAL FETCH
  // ==================================================
  useEffect(() => {
    console.log("Class:", selectedClass);
    console.log("ExamType:", selectedExamType);

    if (selectedClass && selectedExamType) {
      fetchData();
    }
  }, [selectedClass, selectedExamType]);

  // ==================================================
  // SEARCH
  // ==================================================
  const filteredExams = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return exams;
    }

    return exams.filter((exam) => {
      return (
        String(exam.Class || "")
          .toLowerCase()
          .includes(query) ||

        String(exam.Examtype || "")
          .toLowerCase()
          .includes(query) ||

        String(exam.Subject || "")
          .toLowerCase()
          .includes(query) ||

        String(exam.Teachername || "")
          .toLowerCase()
          .includes(query) ||

        String(exam.Examname || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [exams, search]);

  // ==================================================
  // UPDATE TEACHER
  // ==================================================
  const updateTeacher = async (examId, teacherId) => {
    try {
      const fd = new FormData();

      fd.append("examId", examId);
      fd.append("teacherId", teacherId);

      const res = await axios.post(
        BASE_URL + "updateExamTeacher",
        fd
      );

      console.log("Teacher Update Response:", res.data);

      if (res.data?.status) {
        alert("Teacher Saved Successfully");
        fetchData();
      } else {
        alert(
          res.data?.message ||
          "Failed to update Teacher"
        );
      }

    } catch (error) {
      console.error("Teacher update error:", error);

      alert(
        error.response?.data?.message ||
        "Server Error"
      );
    }
  };

  // ==================================================
  // DELETE EXAM
  // ==================================================
  const deleteExam = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure? All results of this exam will be deleted!"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(id);

      const fd = new FormData();
      fd.append("id", id);

      const res = await axios.post(
        BASE_URL + "deleteExam",
        fd
      );

      console.log("Delete Response:", res.data);

      if (res.data?.status) {
        alert(
          res.data?.message ||
          "Deleted Successfully"
        );

        fetchData();

      } else {
        alert(
          res.data?.message ||
          "Failed to Delete"
        );
      }

    } catch (error) {
      console.error("Delete error:", error);

      alert(
        error.response?.data?.message ||
        "Server Error"
      );

    } finally {
      setDeletingId(null);
    }
  };

  // ==================================================
  // SAVE RESULT
  // ==================================================
  const handleSaveResult = async (id) => {
    const confirmSave = window.confirm(
      "Are you sure you want to save this result? Once saved, the uploaded result will be finalized."
    );

    if (!confirmSave) {
      return;
    }

    try {
      setSavingId(id);

      const formData = new FormData();

      formData.append("id", id);

      console.log(
        "Saving result for exam ID:",
        id
      );

      const response = await axios.post(
        BASE_URL + "saveResult",
        formData
      );

      console.log(
        "Save Result Response:",
        response.data
      );

      /*
       * Your old CodeIgniter function redirects:
       *
       * redirect(site_url('exam/view'));
       *
       * Therefore Axios may receive HTML instead of JSON.
       *
       * We handle both JSON and successful HTTP response.
       */

      if (
        response.data?.status === true ||
        response.data?.status === 1 ||
        response.status === 200
      ) {
        alert(
          response.data?.message ||
          "Result saved successfully!"
        );

        // Refresh exam list so saved status appears
        await fetchData();

      } else {
        alert(
          response.data?.message ||
          "Failed to save result."
        );
      }

    } catch (error) {
      console.error(
        "Error saving result:",
        error
      );

      console.error(
        "Server Response:",
        error.response?.data
      );

      /*
       * If CodeIgniter redirects after saving,
       * Axios can still receive a 200 response.
       */
      if (
        error.response?.status === 200
      ) {
        alert("Result saved successfully!");
        await fetchData();
      } else {
        alert(
          error.response?.data?.message ||
          "Failed to save result."
        );
      }

    } finally {
      setSavingId(null);
    }
  };

  // ==================================================
  // RESULT STATUS
  // ==================================================
  const getResultStatus = (row) => {
    // Result not uploaded
    if (
      Number(row.Result) === 0 ||
      row.Result == null
    ) {
      return {
        label: "Results Pending",
        className: "result-pending",
      };
    }

    // Result uploaded but not saved
    if (
      Number(row.Result) === 1 &&
      (
        Number(row.saved) === 0 ||
        row.saved == null
      )
    ) {
      return {
        label: "Results Uploaded",
        className: "result-uploaded",
      };
    }

    // Result saved
    if (
      Number(row.Result) === 1 &&
      Number(row.saved) === 1
    ) {
      return {
        label: "Saved",
        className: "result-saved",
      };
    }

    return {
      label: "Pending",
      className: "result-pending",
    };
  };

  // ==================================================
  // BACK
  // ==================================================
  const goBack = () => {
    navigate(-1);
  };

  // ==================================================
  // RENDER
  // ==================================================
  return (
    <div className="viewExams-page">

      {/* ==================================================
          HEADER
      ================================================== */}
      <div className="viewExams-header">

        <div className="viewExams-header-left">

          <button
            type="button"
            className="viewExams-back-btn"
            onClick={goBack}
            title="Go Back"
          >
            <i className="las la-arrow-left"></i>
          </button>

          <div className="viewExams-title-icon">
            <i className="las la-file-alt"></i>
          </div>

          <div>
            <span className="viewExams-eyebrow">
              EXAM MANAGEMENT
            </span>

            <h1>View Exams</h1>

            <p>
              Manage examinations, results and assigned teachers
            </p>
          </div>

        </div>

        <div className="viewExams-header-right">

          <div className="viewExams-class-pill">

            <i className="las la-graduation-cap"></i>

            <div>
              <span>Class</span>

              <strong>
                {selectedClass || "—"}
              </strong>
            </div>

          </div>

          <div className="viewExams-type-pill">

            <i className="las la-clipboard-list"></i>

            <div>
              <span>Exam Type</span>

              <strong>
                {selectedExamType || "—"}
              </strong>
            </div>

          </div>

        </div>

      </div>


      {/* ==================================================
          SUMMARY CARDS
      ================================================== */}
      <div className="viewExams-stats">

        {/* TOTAL EXAMS */}
        <div className="viewExams-stat-card">

          <div className="viewExams-stat-icon">
            <i className="las la-file-alt"></i>
          </div>

          <div>
            <span>Total Exams</span>

            <strong>
              {exams.length}
            </strong>
          </div>

        </div>


        {/* RESULTS UPLOADED */}
        <div className="viewExams-stat-card">

          <div className="viewExams-stat-icon">
            <i className="las la-check-circle"></i>
          </div>

          <div>
            <span>Results Uploaded</span>

            <strong>
              {
                exams.filter(
                  (exam) =>
                    Number(exam.Result) === 1
                ).length
              }
            </strong>
          </div>

        </div>


        {/* RESULTS PENDING */}
        <div className="viewExams-stat-card">

          <div className="viewExams-stat-icon">
            <i className="las la-hourglass-half"></i>
          </div>

          <div>
            <span>Results Pending</span>

            <strong>
              {
                exams.filter(
                  (exam) =>
                    Number(exam.Result) === 0 ||
                    exam.Result == null
                ).length
              }
            </strong>
          </div>

        </div>


        {/* TEACHERS */}
        <div className="viewExams-stat-card">

          <div className="viewExams-stat-icon">
            <i className="las la-users"></i>
          </div>

          <div>
            <span>Teachers</span>

            <strong>
              {teachers.length}
            </strong>
          </div>

        </div>

      </div>


      {/* ==================================================
          MAIN CARD
      ================================================== */}
      <div className="viewExams-main-card">

        {/* ==================================================
            CARD HEADER
        ================================================== */}
        <div className="viewExams-card-header">

          <div>

            <div className="viewExams-section-title">

              <span className="viewExams-section-number">
                01
              </span>

              <div>

                <h2>
                  Scheduled Examinations
                </h2>

                <p>
                  View and manage exams for the selected class
                </p>

              </div>

            </div>

          </div>


          <div className="viewExams-card-tools">

            {/* SEARCH */}
            <div className="viewExams-search">

              <i className="las la-search"></i>

              <input
                type="text"
                placeholder="Search exams..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  title="Clear Search"
                >
                  <i className="las la-times"></i>
                </button>
              )}

            </div>


            {/* REFRESH */}
            <button
              type="button"
              className="viewExams-refresh-btn"
              onClick={fetchData}
              title="Refresh"
              disabled={loading}
            >
              <i
                className={`las la-sync-alt ${
                  loading ? "la-spin" : ""
                }`}
              ></i>
            </button>

          </div>

        </div>


        {/* ==================================================
            FILTER BAR
        ================================================== */}
        <div className="viewExams-filter-bar">

          <div className="viewExams-filter-info">

            <i className="las la-filter"></i>

            <span>
              Showing{" "}
              <strong>
                {filteredExams.length}
              </strong>{" "}
              of{" "}
              <strong>
                {exams.length}
              </strong>{" "}
              exams
            </span>

          </div>


          <div className="viewExams-active-filter">

            <span>Class</span>

            <strong>
              {selectedClass || "—"}
            </strong>

            <span>•</span>

            <span>Type</span>

            <strong>
              {selectedExamType || "—"}
            </strong>

          </div>

        </div>


        {/* ==================================================
            LOADING
        ================================================== */}
        {loading ? (

          <div className="viewExams-loading">

            <div className="viewExams-spinner"></div>

            <h3>
              Loading Exams
            </h3>

            <p>
              Please wait while exam records are loaded.
            </p>

          </div>

        ) : filteredExams.length === 0 ? (

          /* ==================================================
             EMPTY STATE
          ================================================== */
          <div className="viewExams-empty">

            <div className="viewExams-empty-icon">

              <i className="las la-calendar-times"></i>

            </div>

            <h3>
              No Exams Found
            </h3>

            <p>
              {
                search
                  ? "No examinations match your search."
                  : "There are no examinations available for this class and exam type."
              }
            </p>

            {search && (

              <button
                type="button"
                onClick={() => setSearch("")}
                className="viewExams-clear-search"
              >
                Clear Search
              </button>

            )}

          </div>

        ) : (

          /* ==================================================
             TABLE
          ================================================== */
          <div className="viewExams-table-wrapper">

            <table className="viewExams-table">

              <thead>

                <tr>

                  <th className="viewExams-id-column">
                    #
                  </th>

                  <th>
                    <i className="las la-graduation-cap"></i>
                    CLASS
                  </th>

                  <th>
                    <i className="las la-clipboard-list"></i>
                    EXAM TYPE
                  </th>

                  <th>
                    <i className="las la-book"></i>
                    SUBJECT
                  </th>

                  <th>
                    <i className="las la-user-tie"></i>
                    TEACHER
                  </th>

                  <th>
                    <i className="las la-book-open"></i>
                    SYLLABUS
                  </th>

                  <th>
                    <i className="las la-award"></i>
                    MARKS
                  </th>

                  <th>
                    <i className="las la-calendar"></i>
                    DATE
                  </th>

                  <th>
                    STATUS
                  </th>

                  <th className="viewExams-action-column">
                    ACTIONS
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredExams.map(
                  (row, index) => {

                    const resultStatus =
                      getResultStatus(row);

                    return (

                      <tr key={row.id}>

                        {/* NUMBER */}
                        <td>

                          <div className="viewExams-row-number">
                            {String(index + 1).padStart(2, "0")}
                          </div>

                        </td>


                        {/* CLASS */}
                        <td>

                          <span className="viewExams-class-badge">

                            <i className="las la-graduation-cap"></i>

                            {row.Class}

                          </span>

                        </td>


                        {/* EXAM TYPE */}
                        <td>

                          <div className="viewExams-exam-type">

                            <strong>
                              {row.Examtype}
                            </strong>

                          </div>

                        </td>


                        {/* SUBJECT */}
                        <td>

                          <div className="viewExams-subject">

                            <div className="viewExams-subject-icon">

                              <i className="las la-book"></i>

                            </div>

                            <span>
                              {row.Subject}
                            </span>

                          </div>

                        </td>


                        {/* TEACHER */}
                        <td>

                          <div className="viewExams-teacher">

                            <div className="viewExams-teacher-avatar">

                              <i className="las la-user"></i>

                            </div>

                            <div>

                              <strong>
                                {
                                  row.Teachername ||
                                  "Not Assigned"
                                }
                              </strong>

                              {row.TeacherId && (

                                <small>
                                  Teacher #{row.TeacherId}
                                </small>

                              )}

                            </div>

                          </div>

                        </td>


                        {/* SYLLABUS */}
                        <td>

                          <div className="viewExams-syllabus">

                            <i className="las la-file-alt"></i>

                            <span>
                              {row.Examname || "—"}
                            </span>

                          </div>

                        </td>


                        {/* MARKS */}
                        <td>

                          <div className="viewExams-marks">

                            <strong>
                              {row.Maxmarks}
                            </strong>

                            <span>
                              Marks
                            </span>

                          </div>

                        </td>


                        {/* DATE */}
                        <td>

                          <div className="viewExams-date">

                            <i className="las la-calendar-day"></i>

                            <span>
                              {row.Date}
                            </span>

                          </div>

                        </td>


                        {/* STATUS */}
                        <td>

                          <span
                            className={`viewExams-status ${resultStatus.className}`}
                          >

                            <span className="viewExams-status-dot"></span>

                            {resultStatus.label}

                          </span>

                        </td>


                        {/* ACTIONS */}
                        <td>

                          <div className="viewExams-actions">

                            {/* ==================================================
                                CASE 1: RESULT NOT UPLOADED
                            ================================================== */}
                            {(
                              Number(row.Result) === 0 ||
                              row.Result == null
                            ) && (

                              <button
                                type="button"
                                className="viewExams-action-btn upload"
                                title="Upload Results"
                                onClick={() =>
                                  navigate(
                                    `/dashboard/ExamComponent/upload-marks/${row.id}`,
                                    {
                                      state: {
                                        class: row.Class,
                                        code: row.id,
                                        examType: row.Examtype,
                                      },
                                    }
                                  )
                                }
                              >

                                <i className="las la-file-upload"></i>

                              </button>

                            )}


                            {/* ==================================================
                                CASE 2: RESULT UPLOADED BUT NOT SAVED
                            ================================================== */}
                            {Number(row.Result) === 1 &&
                              (
                                Number(row.saved) === 0 ||
                                row.saved == null
                              ) && (

                                <>

                                  {/* VIEW */}
                                  <button
                                    type="button"
                                    className="viewExams-action-btn view"
                                    title="View Results"
                                    onClick={() =>
                                      navigate(
                                        `/dashboard/ExamComponent/view-result/${row.id}`
                                      )
                                    }
                                  >

                                    <i className="las la-eye"></i>

                                  </button>


                                  {/* EDIT */}
                                  <button
                                    type="button"
                                    className="viewExams-action-btn edit"
                                    title="Edit Results"
                                    onClick={() =>
                                      navigate(
                                        `/dashboard/ExamComponent/edit-result/${row.id}`
                                      )
                                    }
                                  >

                                    <i className="las la-pen"></i>

                                  </button>


                                  {/* SAVE */}
                                  <button
                                    type="button"
                                    className="viewExams-action-btn save"
                                    title="Save Results"
                                    disabled={savingId === row.id}
                                    onClick={() =>
                                      handleSaveResult(row.id)
                                    }
                                  >

                                    {savingId === row.id ? (

                                      <i className="las la-spinner la-spin"></i>

                                    ) : (

                                      <i className="las la-save"></i>

                                    )}

                                  </button>

                                </>

                              )}


                            {/* ==================================================
                                CASE 3: RESULT SAVED
                            ================================================== */}
                            {Number(row.Result) === 1 &&
                              Number(row.saved) === 1 && (

                                <button
                                  type="button"
                                  className="viewExams-action-btn view"
                                  title="View Results"
                                  onClick={() =>
                                    navigate(
                                      `/dashboard/ExamComponent/view-result/${row.id}`
                                    )
                                  }
                                >

                                  <i className="las la-eye"></i>

                                </button>

                              )}


                            {/* ==================================================
                                DELETE
                            ================================================== */}
                            <button
                              type="button"
                              className="viewExams-action-btn delete"
                              title="Delete Exam"
                              disabled={
                                deletingId === row.id ||
                                savingId === row.id
                              }
                              onClick={() =>
                                deleteExam(row.id)
                              }
                            >

                              {deletingId === row.id ? (

                                <i className="las la-spinner la-spin"></i>

                              ) : (

                                <i className="las la-trash"></i>

                              )}

                            </button>

                          </div>

                        </td>

                      </tr>

                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}


        {/* ==================================================
            FOOTER
        ================================================== */}
        {!loading &&
          filteredExams.length > 0 && (

            <div className="viewExams-table-footer">

              <div className="viewExams-footer-info">

                <div className="viewExams-footer-icon">

                  <i className="las la-info-circle"></i>

                </div>

                <div>

                  <strong>
                    Exam Management
                  </strong>

                  <span>
                    Use the action buttons to manage results.
                  </span>

                </div>

              </div>


              <div className="viewExams-footer-count">

                <strong>
                  {filteredExams.length}
                </strong>

                <span>
                  {
                    filteredExams.length === 1
                      ? "Examination"
                      : "Examinations"
                  }
                </span>

              </div>

            </div>

          )}

      </div>

    </div>
  );
};

export default ViewExams;