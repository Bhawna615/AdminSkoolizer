
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewTeachers.css";
import { useNavigate } from "react-router-dom";

const BASE_URL =
  "http://localhost/kkblossom/api.php/Adminapi/AdminTeacher/";

const ViewTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [entryCount, setEntryCount] = useState(10);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteTeacherId, setDeleteTeacherId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Automatically close only the success message.
  useEffect(() => {
    if (messageType !== "success" || !message) return;

    const timer = setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [message, messageType]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(BASE_URL + "getTeachers");

      setTeachers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
  };

  const closeMessage = () => {
    setMessage("");
    setMessageType("");
  };

  const confirmDeleteTeacher = (id) => {
    setDeleteTeacherId(id);
    setOpenMenu(null);
  };

  const cancelDeleteTeacher = () => {
    if (deleting) return;
    setDeleteTeacherId(null);
  };

  const deleteTeacher = async () => {
    if (deleteTeacherId === null || deleting) return;

    const id = deleteTeacherId;

    try {
      setDeleting(true);

      const res = await axios.get(
        BASE_URL + "deleteTeacher/" + id
      );

      if (res.data.status === "success") {
        setDeleteTeacherId(null);

        showMessage(
          "Teacher deleted successfully",
          "success"
        );

        await fetchTeachers();
      } else {
        setDeleteTeacherId(null);

        showMessage(
          res.data.message || "Failed to delete teacher.",
          "error"
        );
      }
    } catch (error) {
      console.error(error);

      setDeleteTeacherId(null);

      showMessage(
        error.response?.data?.message ||
          "Unable to delete teacher. Please try again.",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };

  const filteredTeachers = teachers.filter((t) =>
    [
      t.Teachername,
      t.Post,
      t.Classteacher,
      t.Email,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTeachers.length / entryCount)
  );

  const startIndex = (currentPage - 1) * entryCount;

  const endIndex = startIndex + entryCount;

  const paginatedTeachers = filteredTeachers.slice(
    startIndex,
    endIndex
  );

  const getInitials = (name) => {
    if (!name) return "T";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="view-teachers-page">
      <div className="view-teachers-container">

        {/* HEADER */}

        <div className="view-teachers-header">
          <div className="view-teachers-header-left">
            <div className="view-teachers-header-icon">
              <i className="bi bi-people-fill"></i>
            </div>

            <div>
              <h2>Teachers Management</h2>

              <p>
                Manage teacher profiles, credentials and staff information.
              </p>
            </div>
          </div>

          <button
            className="view-teachers-add-btn"
            onClick={() =>
              navigate("/dashboard/TeacherComponent/AddTeachers")
            }
          >
            <i className="bi bi-person-plus-fill"></i>
            Add Teacher
          </button>
        </div>

        {/* STATS */}

        <div className="view-teachers-stats">
          <div className="view-teachers-stat-card">
            <div className="view-teachers-stat-icon">
              <i className="bi bi-person-workspace"></i>
            </div>

            <div>
              <span>Total Teachers</span>
              <h3>{teachers.length}</h3>
            </div>
          </div>

          <div className="view-teachers-stat-card">
            <div className="view-teachers-stat-icon">
              <i className="bi bi-person-check-fill"></i>
            </div>

            <div>
              <span>Showing Results</span>
              <h3>{filteredTeachers.length}</h3>
            </div>
          </div>
        </div>

        {/* TABLE CARD */}

        <div className="view-teachers-card">
          <div className="view-teachers-card-header">
            <div>
              <h3>
                <i className="bi bi-list-ul"></i>
                Teachers List
              </h3>

              <p>
                View and manage all registered teachers
              </p>
            </div>
          </div>

          {/* CONTROLS */}

          <div className="view-teachers-controls">
            <div className="view-teachers-entry-control">
              <span>Show</span>

              <select
                value={entryCount}
                onChange={(e) => {
                  setEntryCount(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>

              <span>entries</span>
            </div>

            <div className="view-teachers-search">
              <i className="bi bi-search"></i>

              <input
                type="text"
                placeholder="Search teacher..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* TABLE */}

          <div className="view-teachers-table-wrapper">
            <table className="view-teachers-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>TEACHER</th>
                  <th>POST</th>
                  <th>CLASS INCHARGE</th>
                  <th>EMAIL / USERNAME</th>
                  <th>DATE OF JOINING</th>
                  <th className="view-teachers-action-heading">
                    ACTIONS
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="view-teachers-loading"
                    >
                      <div className="view-teachers-loader"></div>
                      Loading teachers...
                    </td>
                  </tr>
                ) : paginatedTeachers.length > 0 ? (
                  paginatedTeachers.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <span className="view-teachers-id">
                          #{row.id}
                        </span>
                      </td>

                      {/* TEACHER */}

                      <td>
                        <div
                          className="view-teachers-profile"
                          onClick={() =>
                            navigate(
                              `/dashboard/TeacherComponent/TeacherProfile/${row.id}`
                            )
                          }
                        >
                          <div className="view-teachers-avatar">
                            {getInitials(row.Teachername)}
                          </div>

                          <div>
                            <strong>{row.Teachername}</strong>

                            <small>
                              Teacher ID: {row.id}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="view-teachers-post">
                          {row.Post || "-"}
                        </span>
                      </td>

                      <td>
                        <span className="view-teachers-class">
                          <i className="bi bi-mortarboard"></i>

                          {row.Classteacher
                            ? `Class ${row.Classteacher}`
                            : "Not Assigned"}
                        </span>
                      </td>

                      <td>
                        <span className="view-teachers-email">
                          <i className="bi bi-envelope"></i>
                          {row.Email || "-"}
                        </span>
                      </td>

                      <td>
                        <span className="view-teachers-date">
                          <i className="bi bi-calendar-event"></i>
                          {row.Doj || "-"}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td className="view-teachers-action-cell">
                        <div className="view-teachers-action-wrapper">
                          <button
                            className="view-teachers-action-btn"
                            onClick={() =>
                              setOpenMenu(
                                openMenu === row.id ? null : row.id
                              )
                            }
                          >
                            <i className="bi bi-three-dots-vertical"></i>
                          </button>

                          {openMenu === row.id && (
                            <div className="view-teachers-dropdown">
                              <button
                                onClick={() =>
                                  navigate(
                                    `/dashboard/TeacherComponent/TeacherProfile/${row.id}`
                                  )
                                }
                              >
                                <i className="bi bi-person"></i>
                                View Profile
                              </button>

                              <button
                                onClick={() =>
                                  navigate(
                                    `/dashboard/TeacherComponent/AddTeacherToFormer/${row.id}`
                                  )
                                }
                              >
                                <i className="bi bi-box-arrow-right"></i>
                                Mark as Left
                              </button>

                              <button
                                onClick={() =>
                                  navigate(
                                    `/dashboard/TeacherComponent/GenerateExperienceCertificate/${row.id}`
                                  )
                                }
                              >
                                <i className="bi bi-file-earmark-text"></i>
                                Experience Certificate
                              </button>

                              <button
                                onClick={() =>
                                  navigate(
                                    `/dashboard/TeacherComponent/createTeacherCredentials/${row.id}`
                                  )
                                }
                              >
                                <i className="bi bi-key"></i>
                                Create Credentials
                              </button>

                              <div className="view-teachers-menu-line"></div>

                              <button
                                className="view-teachers-delete"
                                onClick={() =>
                                  confirmDeleteTeacher(row.id)
                                }
                              >
                                <i className="bi bi-trash3"></i>
                                Delete Teacher
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="view-teachers-empty"
                    >
                      <i className="bi bi-people"></i>

                      <h4>No Teachers Found</h4>

                      <p>
                        No teacher records match your search.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}

          {!loading && filteredTeachers.length > 0 && (
            <div className="view-teachers-pagination">
              <div className="view-teachers-pagination-info">
                Showing{" "}
                <strong>{startIndex + 1}</strong>
                {" "}to{" "}
                <strong>
                  {Math.min(endIndex, filteredTeachers.length)}
                </strong>
                {" "}of{" "}
                <strong>{filteredTeachers.length}</strong>
                {" "}entries
              </div>

              <div className="view-teachers-pages">
                <button
                  className="view-teachers-page-btn"
                  disabled={currentPage === 1}
                  onClick={() =>
                    currentPage > 1 &&
                    setCurrentPage(currentPage - 1)
                  }
                >
                  <i className="bi bi-chevron-left"></i>
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`view-teachers-page-number ${
                      currentPage === i + 1 ? "active" : ""
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  className="view-teachers-page-btn"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    currentPage < totalPages &&
                    setCurrentPage(currentPage + 1)
                  }
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CENTERED SUCCESS / ERROR MESSAGE MODAL */}

      {message && (
        <div
          className="view-teachers-modal-overlay"
          onClick={messageType === "error" ? closeMessage : undefined}
        >
          <div
            className={`view-teachers-modal-popup ${
              messageType === "success"
                ? "view-teachers-modal-success"
                : "view-teachers-modal-error"
            }`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-live="polite"
          >
            <button
              className="view-teachers-modal-close"
              onClick={closeMessage}
              aria-label="Close message"
            >
              <i className="bi bi-x-lg"></i>
            </button>

            <div className="view-teachers-modal-icon">
              <i
                className={
                  messageType === "success"
                    ? "bi bi-check-lg"
                    : "bi bi-exclamation-lg"
                }
              ></i>
            </div>

            <h3>
              {messageType === "success"
                ? "Success!"
                : "Something went wrong"}
            </h3>

            <p>{message}</p>

            {messageType === "success" ? (
              <div className="view-teachers-modal-progress">
                <div className="view-teachers-modal-progress-bar"></div>
              </div>
            ) : (
              <button
                className="view-teachers-modal-ok"
                onClick={closeMessage}
              >
                Okay
              </button>
            )}
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}

      {deleteTeacherId !== null && (
        <div
          className="view-teachers-modal-overlay"
          onClick={cancelDeleteTeacher}
        >
          <div
            className="view-teachers-modal-popup view-teachers-modal-confirm"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="view-teachers-delete-title"
          >
            <button
              className="view-teachers-modal-close"
              onClick={cancelDeleteTeacher}
              disabled={deleting}
              aria-label="Close confirmation"
            >
              <i className="bi bi-x-lg"></i>
            </button>

            <div className="view-teachers-modal-icon">
              <i className="bi bi-trash3"></i>
            </div>

            <h3 id="view-teachers-delete-title">
              Delete Teacher?
            </h3>

            <p>
              Are you sure you want to delete this teacher?
              This action cannot be undone.
            </p>

            <div className="view-teachers-modal-actions">
              <button
                className="view-teachers-modal-cancel"
                onClick={cancelDeleteTeacher}
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                className="view-teachers-modal-delete"
                onClick={deleteTeacher}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewTeachers;
