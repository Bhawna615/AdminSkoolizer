
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./SponseredStudents.css";

const API_BASE = "http://localhost/kkblossom/api.php/Adminapi/";

const SponseredStudents = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClass, setSelectedClass] = useState("");
  const [enableFilter, setEnableFilter] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE}AdminStudent/SponseredDisplay`
      );

      if (Array.isArray(res.data)) {
        setStudents(res.data);
      } else if (Array.isArray(res.data.data)) {
        setStudents(res.data.data);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error("Error fetching sponsored students:", error);
      setStudents([]);
      setMessage({
        type: "error",
        text: "Unable to load sponsored students.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = useMemo(() => {
    let data = Array.isArray(students) ? [...students] : [];

    if (enableFilter && selectedClass) {
      data = data.filter((s) => s.Class === selectedClass);
    }

    if (search.trim()) {
      const searchValue = search.toLowerCase().trim();

      data = data.filter(
        (s) =>
          s?.Name?.toLowerCase().includes(searchValue) ||
          s?.Rollno?.toString().toLowerCase().includes(searchValue) ||
          s?.Admno?.toString().toLowerCase().includes(searchValue) ||
          s?.id?.toString().toLowerCase().includes(searchValue)
      );
    }

    data.sort((a, b) =>
      (a?.Name || "").localeCompare(b?.Name || "", undefined, {
        sensitivity: "base",
      })
    );

    return data;
  }, [students, search, selectedClass, enableFilter]);

  const totalPages = Math.ceil(filteredStudents.length / entries);
  const safePage = Math.min(currentPage, Math.max(totalPages, 1));
  const startIndex = (safePage - 1) * entries;

  const paginatedStudents = filteredStudents.slice(
    startIndex,
    startIndex + entries
  );

  const uniqueClasses = [
    ...new Set(students.map((s) => s.Class).filter(Boolean)),
  ];

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);

      const response = await axios.delete(
        `${API_BASE}AdminStudent/delete/${deleteId}`
      );

      if (response.data.status) {
        setStudents((prev) =>
          prev.filter((student) => student.id !== deleteId)
        );

        setDeleteId(null);
        setActiveAction(null);
        setMessage({
          type: "success",
          text: "Sponsored student deleted successfully.",
        });
      } else {
        setDeleteId(null);
        setMessage({
          type: "error",
          text: "Unable to delete this student. Please try again.",
        });
      }
    } catch (error) {
      console.error("Delete Error:", error);
      setDeleteId(null);
      setMessage({
        type: "error",
        text: "Something went wrong while deleting the student.",
      });
    } finally {
      setDeleting(false);
    }
  };

  const openStudentPage = (path) => {
    setActiveAction(null);
    navigate(path);
  };

  const getStudentActions = (id) => [
    {
      label: "Exam Report",
      icon: "bi-file-earmark-text",
      path: `/StudentComponent/report/${id}`,
    },
    {
      label: "Report Card",
      icon: "bi-card-heading",
      path: `/StudentComponent/ReportCardRouter/${id}`,
    },
    {
      label: "Customized Report Card",
      icon: "bi-file-earmark-richtext",
      path: `/StudentComponent/ReportRouter/${id}`,
    },
    {
      label: "Attendance",
      icon: "bi-calendar-check",
      path: `/dashboard/StudentComponent/StudentAttendenceDetails/${id}`,
    },
    {
      label: "Transfer Certificate",
      icon: "bi-file-earmark-arrow-down",
      path: `/dashboard/StudentComponent/GenerateTC/${id}`,
    },
    {
      label: "Character Certificate",
      icon: "bi-award",
      path: `/dashboard/StudentComponent/CharacterCertificate/${id}`,
    },
    {
      label: "Transport",
      icon: "bi-bus-front",
      path: `/dashboard/StudentComponent/StudentTransportDetails/${id}`,
    },
    {
      label: "Exams",
      icon: "bi-journal-check",
      path: `/dashboard/StudentComponent/StudentExamDetails/${id}`,
    },
    {
      label: "Fee Details",
      icon: "bi-wallet2",
      path: `/dashboard/StudentComponent/StudentFeeDetails/${id}`,
    },
    {
      label: "Messages",
      icon: "bi-chat-left-text",
      path: `/dashboard/StudentComponent/StudentMessages/${id}`,
    },
    {
      label: "Create Credentials",
      icon: "bi-person-lock",
      path: `/dashboard/StudentComponent/CreateCredentials/${id}`,
    },
    {
      label: "Create Fee Payment",
      icon: "bi-cash-coin",
      path: `/dashboard/StudentComponent/CreateStudentPayment/${id}`,
    },
  ];

  return (
    <div className="sponsored-page">
      {/* PAGE HEADER */}
      <div className="sponsored-header">
        <div className="sponsored-header-left">
          <div className="sponsored-header-icon">
            <i className="bi bi-mortarboard-fill"></i>
          </div>

          <div>
            <h2>Sponsored Students</h2>
            <p>Manage and view all sponsored student records</p>
          </div>
        </div>

        <div className="sponsored-header-count">
          <span className="sponsored-count-icon">
            <i className="bi bi-people-fill"></i>
          </span>
          <div>
            <strong>{students.length}</strong>
            <span>Total Students</span>
          </div>
        </div>
      </div>

      <div className="sponsored-content">
        {/* FILTER CARD */}
        <div className="sponsored-filter-card">
          <div className="sponsored-filter-heading">
            <div className="sponsored-section-title">
              <span className="sponsored-section-icon">
                <i className="bi bi-funnel-fill"></i>
              </span>
              <div>
                <h3>Filter Students</h3>
                <p>Filter sponsored students by their class</p>
              </div>
            </div>

            <label className="sponsored-switch">
              <input
                type="checkbox"
                checked={enableFilter}
                onChange={() => {
                  setEnableFilter((prev) => !prev);
                  setCurrentPage(1);
                }}
              />
              <span className="sponsored-switch-slider"></span>
              <span className="sponsored-switch-text">
                Enable filter
              </span>
            </label>
          </div>

          <div className="sponsored-filter-controls">
            <div className="sponsored-class-field">
              <label>
                <i className="bi bi-building"></i>
                Select Class
              </label>

              <select
                value={selectedClass}
                disabled={!enableFilter}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Classes</option>
                {uniqueClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            {enableFilter && selectedClass && (
              <button
                className="sponsored-reset-filter"
                onClick={() => {
                  setSelectedClass("");
                  setCurrentPage(1);
                }}
              >
                <i className="bi bi-x-circle"></i>
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* TABLE CARD */}
        <div className="sponsored-table-card">
          <div className="sponsored-table-heading">
            <div>
              <h3>Student Directory</h3>
              <p>View sponsored student information and records</p>
            </div>

            <div className="sponsored-record-badge">
              <i className="bi bi-person-lines-fill"></i>
              {filteredStudents.length} Records
            </div>
          </div>

          {/* TABLE CONTROLS */}
          <div className="sponsored-table-controls">
            <div className="sponsored-entries-control">
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

            <div className="sponsored-search">
              <i className="bi bi-search"></i>
              <input
                type="text"
                placeholder="Search name, roll no. or admission no..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
              {search && (
                <button
                  type="button"
                  className="sponsored-search-clear"
                  onClick={() => {
                    setSearch("");
                    setCurrentPage(1);
                  }}
                  aria-label="Clear search"
                >
                  <i className="bi bi-x-circle-fill"></i>
                </button>
              )}
            </div>
          </div>

          {/* TABLE */}
          <div className="sponsored-table-wrapper">
            <table className="sponsored-table">
              <thead>
                <tr>
                  <th>STUDENT ID</th>
                  <th>ROLL NO.</th>
                  <th>STUDENT NAME</th>
                  <th>CLASS</th>
                  <th>ADMISSION NO.</th>
                  <th>TUITION FEE</th>
                  <th className="sponsored-action-heading">ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7">
                      <div className="sponsored-loading">
                        <span className="sponsored-spinner"></span>
                        <p>Loading sponsored students...</p>
                      </div>
                    </td>
                  </tr>
                ) : paginatedStudents.length > 0 ? (
                  paginatedStudents.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <span className="sponsored-id">#{row.id}</span>
                      </td>

                      <td>
                        <span className="sponsored-roll">
                          {row.Rollno || "—"}
                        </span>
                      </td>

                      <td>
                        <button
                          className="sponsored-student-name"
                          onClick={() =>
                            openStudentPage(
                              `/dashboard/StudentComponent/ViewStudentProfile/${row.id}`
                            )
                          }
                        >
                          <span className="sponsored-student-avatar">
                            {(row.Name || "S").charAt(0).toUpperCase()}
                          </span>
                          <span>{row.Name || "Unnamed Student"}</span>
                          <i className="bi bi-box-arrow-up-right"></i>
                        </button>
                      </td>

                      <td>
                        <span className="sponsored-class-badge">
                          <i className="bi bi-mortarboard"></i>
                          {row.Class || "—"}
                        </span>
                      </td>

                      <td>{row.Admno || "—"}</td>

                      <td>
                        <span className="sponsored-fee">
                          <i className="bi bi-currency-rupee"></i>
                          {row.tuition_fee ?? "—"}
                        </span>
                      </td>

                      <td className="sponsored-action-cell">
                        <button
                          className={`sponsored-action-button ${
                            activeAction === row.id ? "action-active" : ""
                          }`}
                          onClick={() =>
                            setActiveAction(
                              activeAction === row.id ? null : row.id
                            )
                          }
                          aria-label="Student actions"
                        >
                          <i className="bi bi-three-dots-vertical"></i>
                        </button>

                        {activeAction === row.id && (
                          <>
                            <div
                              className="sponsored-dropdown-backdrop"
                              onClick={() => setActiveAction(null)}
                            ></div>

                            <div className="sponsored-action-dropdown">
                              <div className="sponsored-dropdown-heading">
                                <i className="bi bi-person-gear"></i>
                                Student Actions
                              </div>

                              {getStudentActions(row.id).map((action) => (
                                <button
                                  key={action.label}
                                  className="sponsored-dropdown-item"
                                  onClick={() =>
                                    openStudentPage(action.path)
                                  }
                                >
                                  <i className={`bi ${action.icon}`}></i>
                                  <span>{action.label}</span>
                                  <i className="bi bi-chevron-right sponsored-item-arrow"></i>
                                </button>
                              ))}

                              <div className="sponsored-dropdown-divider"></div>

                              <button
                                className="sponsored-dropdown-item sponsored-delete-action"
                                onClick={() => {
                                  setActiveAction(null);
                                  setDeleteId(row.id);
                                }}
                              >
                                <i className="bi bi-trash3"></i>
                                <span>Delete Student</span>
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">
                      <div className="sponsored-empty">
                        <div className="sponsored-empty-icon">
                          <i className="bi bi-people"></i>
                        </div>
                        <h4>No Sponsored Students Found</h4>
                        <p>
                          {search || selectedClass
                            ? "Try changing your search or filter criteria."
                            : "There are currently no sponsored student records."}
                        </p>
                        {(search || selectedClass) && (
                          <button
                            onClick={() => {
                              setSearch("");
                              setSelectedClass("");
                              setEnableFilter(false);
                              setCurrentPage(1);
                            }}
                          >
                            <i className="bi bi-arrow-counterclockwise"></i>
                            Reset Filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="sponsored-pagination">
            <div className="sponsored-pagination-info">
              Showing{" "}
              <strong>
                {filteredStudents.length === 0 ? 0 : startIndex + 1}
              </strong>{" "}
              to{" "}
              <strong>
                {Math.min(startIndex + entries, filteredStudents.length)}
              </strong>{" "}
              of <strong>{filteredStudents.length}</strong> entries
            </div>

            <div className="sponsored-page-buttons">
              <button
                className="sponsored-page-nav"
                disabled={safePage <= 1 || totalPages === 0}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                <i className="bi bi-chevron-left"></i>
                <span>Previous</span>
              </button>

              {(() => {
                const pages = [];
                const maxVisible = 5;
                let startPage = Math.max(1, safePage - 2);
                let endPage = Math.min(
                  totalPages,
                  startPage + maxVisible - 1
                );

                if (endPage - startPage < maxVisible - 1) {
                  startPage = Math.max(1, endPage - maxVisible + 1);
                }

                if (startPage > 1) {
                  pages.push(
                    <button
                      key={1}
                      className="sponsored-page-number"
                      onClick={() => setCurrentPage(1)}
                    >
                      1
                    </button>
                  );

                  if (startPage > 2) {
                    pages.push(
                      <span key="start-ellipsis" className="sponsored-ellipsis">
                        ...
                      </span>
                    );
                  }
                }

                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      className={`sponsored-page-number ${
                        safePage === i ? "active" : ""
                      }`}
                      onClick={() => setCurrentPage(i)}
                    >
                      {i}
                    </button>
                  );
                }

                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pages.push(
                      <span key="end-ellipsis" className="sponsored-ellipsis">
                        ...
                      </span>
                    );
                  }

                  pages.push(
                    <button
                      key={totalPages}
                      className="sponsored-page-number"
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </button>
                  );
                }

                return pages;
              })()}

              <button
                className="sponsored-page-nav"
                disabled={safePage >= totalPages || totalPages === 0}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
              >
                <span>Next</span>
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteId && (
        <div
          className="sponsored-modal-overlay"
          onClick={() => !deleting && setDeleteId(null)}
        >
          <div
            className="sponsored-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sponsored-confirm-icon">
              <i className="bi bi-trash3"></i>
            </div>

            <h3>Delete Student?</h3>
            <p>
              Are you sure you want to delete this sponsored student? This
              action cannot be undone.
            </p>

            <div className="sponsored-confirm-actions">
              <button
                className="sponsored-modal-cancel"
                disabled={deleting}
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>

              <button
                className="sponsored-modal-delete"
                disabled={deleting}
                onClick={handleDelete}
              >
                {deleting ? (
                  <>
                    <span className="sponsored-button-spinner"></span>
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

      {/* SUCCESS / ERROR MESSAGE */}
      {message && (
        <div
          className="sponsored-message-overlay"
          onClick={() => setMessage(null)}
        >
          <div
            className={`sponsored-message-box ${message.type}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sponsored-message-icon">
              <i
                className={`bi ${
                  message.type === "success"
                    ? "bi-check-lg"
                    : "bi-exclamation-lg"
                }`}
              ></i>
            </div>

            <h3>
              {message.type === "success" ? "Success!" : "Something Went Wrong"}
            </h3>

            <p>{message.text}</p>

            <button onClick={() => setMessage(null)}>
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SponseredStudents;
