
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./PassedOutStudent.css";

const API_BASE = "http://localhost/kkblossom/api.php/Adminapi/";

const PassedOutStudent = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClass, setSelectedClass] = useState("");
  const [enableFilter, setEnableFilter] = useState(false);

  const [activeAction, setActiveAction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteStudentId, setDeleteStudentId] = useState(null);

  // CUSTOM MESSAGE BOX
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const navigate = useNavigate();

  // =====================================================
  // FETCH PASSED OUT STUDENTS
  // =====================================================

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        `${API_BASE}AdminStudent/displayPassedOut`
      );

      if (Array.isArray(res.data)) {
        setStudents(res.data);
      } else if (Array.isArray(res.data?.data)) {
        setStudents(res.data.data);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error("Error fetching passed out students:", error);
      setStudents([]);
      showMessage(
        "error",
        "Unable to load passed out students. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CUSTOM MESSAGE BOX
  // =====================================================

  const showMessage = (type, text) => {
    setMessageType(type);
    setMessage(text);
  };

  const closeMessage = () => {
    setMessage("");
    setMessageType("");
  };

  // =====================================================
  // DELETE CONFIRMATION
  // =====================================================

  const handleDelete = (id) => {
    setActiveAction(null);
    setDeleteStudentId(id);
  };

  const cancelDelete = () => {
    if (deleting) return;
    setDeleteStudentId(null);
  };

  const confirmDelete = async () => {
    if (!deleteStudentId || deleting) return;

    setDeleting(true);

    try {
      const response = await axios.delete(
        `${API_BASE}AdminStudent/delete/${deleteStudentId}`
      );

      console.log("Delete Response:", response.data);

      if (
        response.data?.status === "success" ||
        response.data?.status === true ||
        response.data?.status === 1
      ) {
        setDeleteStudentId(null);
        setDeleting(false);

        setStudents((prev) =>
          prev.filter(
            (student) =>
              String(student.id) !== String(deleteStudentId)
          )
        );

        setCurrentPage(1);

        showMessage(
          "success",
          "Student has been deleted successfully."
        );

        setTimeout(() => {
          navigate("/dashboard/StudentComponent/ViewStudent", {
            state: {
              successMessage: "Deleted Successfully",
            },
          });
        }, 1800);
      } else {
        setDeleting(false);
        setDeleteStudentId(null);

        showMessage(
          "error",
          response.data?.message || "Failed to delete student."
        );
      }
    } catch (error) {
      console.error("Delete Error:", error);
      console.error("Backend Response:", error.response?.data);

      setDeleting(false);
      setDeleteStudentId(null);

      showMessage(
        "error",
        error.response?.data?.message ||
          "Something went wrong while deleting the student."
      );
    }
  };

  // =====================================================
  // FILTER AND SEARCH
  // =====================================================

  const filteredStudents = useMemo(() => {
    let data = Array.isArray(students) ? [...students] : [];

    if (enableFilter && selectedClass) {
      data = data.filter(
        (student) =>
          String(student.Class || "") === String(selectedClass)
      );
    }

    if (search.trim()) {
      const searchValue = search.trim().toLowerCase();

      data = data.filter(
        (student) =>
          String(student?.Name || "")
            .toLowerCase()
            .includes(searchValue) ||
          String(student?.Rollno || "")
            .toLowerCase()
            .includes(searchValue) ||
          String(student?.Admno || "")
            .toLowerCase()
            .includes(searchValue) ||
          String(student?.id || "")
            .toLowerCase()
            .includes(searchValue)
      );
    }

    // ALPHABETICAL SORTING
    data.sort((a, b) =>
      (a?.Name || "").localeCompare(
        b?.Name || "",
        undefined,
        { sensitivity: "base" }
      )
    );

    return data;
  }, [students, search, selectedClass, enableFilter]);

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.ceil(filteredStudents.length / entries);

  const startIndex = (currentPage - 1) * entries;

  const paginatedStudents = filteredStudents.slice(
    startIndex,
    startIndex + entries
  );

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(
      totalPages,
      startPage + maxVisible - 1
    );

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(
        1,
        endPage - maxVisible + 1
      );
    }

    if (startPage > 1) {
      pages.push(1);

      if (startPage > 2) {
        pages.push("start-ellipsis");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("end-ellipsis");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  // =====================================================
  // UNIQUE CLASSES
  // =====================================================

  const availableClasses = [
    ...new Set(
      students
        .map((student) => student.Class)
        .filter((className) => className !== null && className !== undefined && className !== "")
    ),
  ].sort((a, b) =>
    String(a).localeCompare(String(b), undefined, {
      numeric: true,
      sensitivity: "base",
    })
  );

  // =====================================================
  // STUDENT ACTION NAVIGATION
  // =====================================================

  const handleActionNavigation = (path) => {
    setActiveAction(null);
    navigate(path);
  };

  // =====================================================
  // NOTIFICATION STATUS
  // =====================================================

  const isReceivingNotifications = (student) => {
    return (
      student?.fcm_token !== null &&
      student?.fcm_token !== undefined &&
      student?.fcm_token !== "" &&
      student?.fcm_token !== "0" &&
      student?.fcm_token !== 0
    );
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="passed-out-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="passed-out-header">

        <div className="passed-out-header-left">

          <div className="passed-out-header-icon">
            <i className="bi bi-mortarboard-fill"></i>
          </div>

          <div>
            <h2>Passed Out Students</h2>
            <p>
              View and manage students who have completed their studies
            </p>
          </div>

        </div>

        <div className="passed-out-header-count">
          <span>Total Passed Out</span>
          <strong>{students.length}</strong>
        </div>

      </div>

      {/* =====================================================
          MAIN CONTENT CARD
      ===================================================== */}

      <div className="passed-out-content">

        {/* =====================================================
            FILTER SECTION
        ===================================================== */}

        <div className="passed-out-filter-section">

          <div className="passed-out-filter-top">

            <div className="passed-out-filter-title">
              <div className="passed-out-filter-icon">
                <i className="bi bi-funnel-fill"></i>
              </div>

              <div>
                <h3>Student Filters</h3>
                <p>Filter passed out students by class</p>
              </div>
            </div>

            <label className="passed-out-toggle">

              <input
                type="checkbox"
                checked={enableFilter}
                onChange={() => {
                  setEnableFilter((prev) => !prev);
                  setCurrentPage(1);
                }}
              />

              <span className="passed-out-toggle-slider"></span>

              <span className="passed-out-toggle-label">
                Enable Filter
              </span>

            </label>

          </div>

          <div className="passed-out-filter-controls">

            <div className="passed-out-class-filter">

              <label htmlFor="passedOutClass">
                <i className="bi bi-bookmark-fill"></i>
                Select Class
              </label>

              <select
                id="passedOutClass"
                value={selectedClass}
                disabled={!enableFilter}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Classes</option>

                {availableClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}

              </select>

            </div>

            <div className="passed-out-filter-result">
              <i className="bi bi-people-fill"></i>
              <span>
                {filteredStudents.length} students found
              </span>
            </div>

          </div>

        </div>

        {/* =====================================================
            TABLE TOOLBAR
        ===================================================== */}

        <div className="passed-out-table-toolbar">

          <div className="passed-out-entries">

            <span>Show</span>

            <select
              value={entries}
              onChange={(e) => {
                setEntries(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>

            <span>entries</span>

          </div>

          <div className="passed-out-search">

            <i className="bi bi-search"></i>

            <input
              type="text"
              placeholder="Search by name, roll no. or ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />

            {search && (
              <button
                type="button"
                className="passed-out-search-clear"
                onClick={() => {
                  setSearch("");
                  setCurrentPage(1);
                }}
                title="Clear search"
              >
                <i className="bi bi-x-circle-fill"></i>
              </button>
            )}

          </div>

        </div>

        {/* =====================================================
            STUDENT TABLE
        ===================================================== */}

        <div className="passed-out-table-wrapper">

          <table className="passed-out-table">

            <thead>
              <tr>
                <th>STUDENT ID</th>
                <th>ROLL NO.</th>
                <th>STUDENT NAME</th>
                <th>CLASS</th>
                <th>ADMISSION NO.</th>
                <th>NOTIFICATIONS</th>
                <th className="passed-out-action-heading">
                  ACTIONS
                </th>
              </tr>
            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td colSpan="7">
                    <div className="passed-out-loading">
                      <span className="passed-out-spinner"></span>
                      <p>Loading passed out students...</p>
                    </div>
                  </td>
                </tr>

              ) : paginatedStudents.length > 0 ? (

                paginatedStudents.map((row) => {
                  const isReceiving =
                    isReceivingNotifications(row);

                  return (
                    <tr key={row.id}>

                      <td>
                        <span className="passed-out-id">
                          #{row.id}
                        </span>
                      </td>

                      <td>
                        <span className="passed-out-roll">
                          {row.Rollno || "—"}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="passed-out-student-name"
                          onClick={() =>
                            navigate(
                              `/dashboard/StudentComponent/ViewStudentProfile/${row.id}`
                            )
                          }
                        >
                          <span className="passed-out-student-avatar">
                            {(row.Name || "S")
                              .trim()
                              .charAt(0)
                              .toUpperCase()}
                          </span>

                          <span>{row.Name || "Unnamed Student"}</span>
                        </button>
                      </td>

                      <td>
                        <span className="passed-out-class-badge">
                          {row.Class || "—"}
                        </span>
                      </td>

                      <td>
                        {row.Admno || "—"}
                      </td>

                      <td>
                        <span
                          className={`passed-out-notification-status ${
                            isReceiving
                              ? "notification-active"
                              : "notification-inactive"
                          }`}
                        >
                          <span className="passed-out-status-dot"></span>

                          {isReceiving
                            ? "Receiving"
                            : "Not Receiving"}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td className="passed-out-action-cell">

                        <button
                          type="button"
                          className={`passed-out-action-button ${
                            activeAction === row.id
                              ? "action-active"
                              : ""
                          }`}
                          onClick={() =>
                            setActiveAction(
                              activeAction === row.id
                                ? null
                                : row.id
                            )
                          }
                          title="Student actions"
                        >
                          <i className="bi bi-three-dots-vertical"></i>
                        </button>

                        {activeAction === row.id && (

                          <>
                            <div
                              className="passed-out-dropdown-backdrop"
                              onClick={() => setActiveAction(null)}
                            ></div>

                            <div className="passed-out-action-dropdown">

                              <div className="passed-out-dropdown-heading">
                                Student Actions
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  handleActionNavigation(
                                    `/StudentComponent/report/${row.id}`
                                  )
                                }
                              >
                                <i className="bi bi-file-earmark-bar-graph"></i>
                                Exam Report
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleActionNavigation(
                                    `/StudentComponent/ReportCardRouter/${row.id}`
                                  )
                                }
                              >
                                <i className="bi bi-file-earmark-text"></i>
                                Report Card
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleActionNavigation(
                                    `/StudentComponent/ReportRouter/${row.id}`
                                  )
                                }
                              >
                                <i className="bi bi-file-earmark-richtext"></i>
                                Customized Report Card
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleActionNavigation(
                                    `/dashboard/StudentComponent/StudentAttendenceDetails/${row.id}`
                                  )
                                }
                              >
                                <i className="bi bi-calendar-check"></i>
                                Attendance
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleActionNavigation(
                                    `/dashboard/StudentComponent/GenerateTC/${row.id}`
                                  )
                                }
                              >
                                <i className="bi bi-file-earmark-pdf"></i>
                                Transfer Certificate
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleActionNavigation(
                                    `/dashboard/StudentComponent/CharacterCertificate/${row.id}`
                                  )
                                }
                              >
                                <i className="bi bi-patch-check"></i>
                                Character Certificate
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleActionNavigation(
                                    `/dashboard/StudentComponent/StudentTransportDetails/${row.id}`
                                  )
                                }
                              >
                                <i className="bi bi-bus-front"></i>
                                Transport
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleActionNavigation(
                                    `/dashboard/StudentComponent/StudentExamDetails/${row.id}`
                                  )
                                }
                              >
                                <i className="bi bi-journal-text"></i>
                                Exams
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleActionNavigation(
                                    `/dashboard/StudentComponent/StudentFeeDetails/${row.id}`
                                  )
                                }
                              >
                                <i className="bi bi-currency-rupee"></i>
                                Fee
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleActionNavigation(
                                    `/dashboard/StudentComponent/StudentMessages/${row.id}`
                                  )
                                }
                              >
                                <i className="bi bi-chat-dots"></i>
                                Messages
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleActionNavigation(
                                    `/dashboard/StudentComponent/CreateCredentials/${row.id}`
                                  )
                                }
                              >
                                <i className="bi bi-person-lock"></i>
                                Create Credentials
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleActionNavigation(
                                    `/dashboard/StudentComponent/CreateStudentPayment/${row.id}`
                                  )
                                }
                              >
                                <i className="bi bi-wallet2"></i>
                                Create Fee Payment
                              </button>

                              <div className="passed-out-dropdown-divider"></div>

                              <button
                                type="button"
                                className="passed-out-delete-action"
                                onClick={() => handleDelete(row.id)}
                              >
                                <i className="bi bi-trash3"></i>
                                Delete Student
                              </button>

                            </div>
                          </>
                        )}

                      </td>

                    </tr>
                  );
                })

              ) : (

                <tr>
                  <td colSpan="7">

                    <div className="passed-out-empty">

                      <div className="passed-out-empty-icon">
                        <i className="bi bi-people"></i>
                      </div>

                      <h3>No Students Found</h3>

                      <p>
                        {search || selectedClass
                          ? "Try changing your search or filter criteria."
                          : "There are currently no passed out students to display."}
                      </p>

                      {(search || selectedClass) && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearch("");
                            setSelectedClass("");
                            setEnableFilter(false);
                            setCurrentPage(1);
                          }}
                        >
                          <i className="bi bi-arrow-counterclockwise"></i>
                          Clear Filters
                        </button>
                      )}

                    </div>

                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* =====================================================
            PAGINATION
        ===================================================== */}

        <div className="passed-out-pagination">

          <div className="passed-out-pagination-info">
            Showing{" "}
            <strong>
              {filteredStudents.length === 0
                ? 0
                : startIndex + 1}
            </strong>{" "}
            to{" "}
            <strong>
              {Math.min(
                startIndex + entries,
                filteredStudents.length
              )}
            </strong>{" "}
            of{" "}
            <strong>{filteredStudents.length}</strong>{" "}
            entries
          </div>

          <div className="passed-out-page-buttons">

            <button
              type="button"
              className="passed-out-page-nav"
              disabled={currentPage === 1 || totalPages === 0}
              onClick={() =>
                setCurrentPage((prev) => prev - 1)
              }
            >
              <i className="bi bi-chevron-left"></i>
              Previous
            </button>

            {getVisiblePages().map((page, index) => {

              if (typeof page !== "number") {
                return (
                  <span
                    key={`${page}-${index}`}
                    className="passed-out-page-ellipsis"
                  >
                    ...
                  </span>
                );
              }

              return (
                <button
                  type="button"
                  key={page}
                  className={`passed-out-page-number ${
                    currentPage === page ? "active" : ""
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              );
            })}

            <button
              type="button"
              className="passed-out-page-nav"
              disabled={
                currentPage === totalPages ||
                totalPages === 0
              }
              onClick={() =>
                setCurrentPage((prev) => prev + 1)
              }
            >
              Next
              <i className="bi bi-chevron-right"></i>
            </button>

          </div>

        </div>

      </div>

      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ===================================================== */}

      {deleteStudentId && (

        <div className="passed-out-modal-overlay">

          <div className="passed-out-confirm-modal">

            <div className="passed-out-confirm-icon">
              <i className="bi bi-trash3"></i>
            </div>

            <h3>Delete Student?</h3>

            <p>
              Are you sure you want to permanently delete this
              student? This action cannot be undone.
            </p>

            <div className="passed-out-confirm-actions">

              <button
                type="button"
                className="passed-out-modal-cancel"
                onClick={cancelDelete}
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="passed-out-modal-delete"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <span className="passed-out-button-spinner"></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-trash3"></i>
                    Delete Student
                  </>
                )}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          CUSTOM MESSAGE BOX
      ===================================================== */}

      {message && (

        <div className="passed-out-message-overlay">

          <div
            className={`passed-out-message-box passed-out-message-${messageType}`}
          >

            <div className="passed-out-message-icon">

              {messageType === "success" && (
                <i className="bi bi-check-lg"></i>
              )}

              {messageType === "error" && (
                <i className="bi bi-x-lg"></i>
              )}

              {messageType === "warning" && (
                <i className="bi bi-exclamation-lg"></i>
              )}

            </div>

            <h3>
              {messageType === "success" && "Successfully Updated!"}
              {messageType === "error" && "Something Went Wrong!"}
              {messageType === "warning" && "Required Information"}
            </h3>

            <p>{message}</p>

            <button
              type="button"
              onClick={closeMessage}
            >
              Okay
            </button>

          </div>

        </div>
      )}

    </div>
  );
};

export default PassedOutStudent;
