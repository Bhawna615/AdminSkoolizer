
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./ViewTeachers.css";
import { useNavigate } from "react-router-dom";



const TEACHER_CHART_COLORS = [
  "#70db85", "#F07878", "#72B7E8", "#65C9A7",
  "#F5B66B", "#E98BBE", "#929FF5", "#9BCB78",
  "#F28CA8", "#B995D6", "#F2A98B", "#65BFC3",
  "#C49A78", "#82BCE8", "#E98982", "#B5C879",
  "#E69BCB", "#83C5D5", "#B09AE8", "#79C69A",
  "#E8C85A", "#8FA9CC", "#F28B8B", "#A6CF75",
  "#C58AE8", "#70B5C9", "#F2A653", "#71BFAE",
  "#C19AE8", "#83B987",
];

// Supports common date formats returned by the teacher API.
const getTeacherJoiningDate = (value) => {
  if (!value) return null;

  const input = String(value).trim();
  let date = null;

  // YYYY-MM-DD
  if (/^\d{4}-\d{1,2}-\d{1,2}/.test(input)) {
    date = new Date(input.substring(0, 10) + "T00:00:00");
  }
  // DD/MM/YYYY or DD-MM-YYYY
  else if (/^\d{1,2}[/-]\d{1,2}[/-]\d{4}$/.test(input)) {
    const parts = input.split(/[/-]/);
    date = new Date(
      Number(parts[2]),
      Number(parts[1]) - 1,
      Number(parts[0])
    );
  } else {
    date = new Date(input);
  }

  return date && !Number.isNaN(date.getTime()) ? date : null;
};

const createTeacherPieGradient = (items) => {
  const total = items.reduce((sum, item) => sum + item.value, 0);

  if (!total) return "#eeeaf8";

  let current = 0;
  const segments = items
    .filter((item) => item.value > 0)
    .map((item) => {
      const start = current;
      current += (item.value / total) * 100;
      return `${item.color} ${start}% ${current}%`;
    });

  return `conic-gradient(${segments.join(", ")})`;
};

const TeacherPieChart = ({ title, subtitle, items, total }) => {
  const chartTotal = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="teacher-analytics-chart-card">
      <div className="teacher-analytics-chart-header">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        <span className="teacher-chart-icon">
          <i className="bi bi-pie-chart-fill"></i>
        </span>
      </div>

      <div className="teacher-pie-layout">
        <div
          className="teacher-pie-chart"
          style={{ background: createTeacherPieGradient(items) }}
          role="img"
          aria-label={`${title}: ${total} teachers`}
        >
          <div className="teacher-pie-center">
            <strong>{total}</strong>
            <span>Total</span>
          </div>
        </div>

        <div className="teacher-pie-legend">
          {items.map((item) => {
            const percentage = chartTotal
              ? ((item.value / chartTotal) * 100).toFixed(1)
              : "0.0";

            return (
              <div className="teacher-pie-legend-item" key={item.label}>
                <div className="teacher-pie-legend-left">
                  <span
                    className="teacher-pie-dot"
                    style={{ background: item.color }}
                  ></span>
                  <span className="teacher-pie-legend-label">{item.label}</span>
                </div>
                <div className="teacher-pie-legend-value">
                  <strong>{item.value}</strong>
                  <small>{percentage}%</small>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const TeacherJoiningChart = ({ data }) => {
  const width = 700;
  const height = 270;
  const left = 48;
  const right = 22;
  const top = 24;
  const bottom = 48;
  const maxValue = Math.max(1, ...data.map((item) => item.value));
  const chartHeight = height - top - bottom;
  const chartWidth = width - left - right;

  const points = data.map((item, index) => {
    const x = left + (index / Math.max(data.length - 1, 1)) * chartWidth;
    const y = top + chartHeight - (item.value / maxValue) * chartHeight;
    return { ...item, x, y };
  });

  const linePoints = points.map((point) => `${point.x},${point.y}`).join(" ");
  const areaPoints = [
    `${left},${height - bottom}`,
    linePoints,
    `${width - right},${height - bottom}`,
  ].join(" ");
  const joiningTotal = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="teacher-analytics-chart-card teacher-line-chart-card">
      <div className="teacher-analytics-chart-header">
        <div>
          <h3>Teacher Joining Trend</h3>
          <p>Monthly teacher recruitment overview</p>
        </div>
        <span className="teacher-chart-icon">
          <i className="bi bi-graph-up-arrow"></i>
        </span>
      </div>

      <div className="teacher-line-chart-summary">
        <div>
          <strong>{joiningTotal}</strong>
          <span>New Joinings</span>
        </div>
        <span className="teacher-line-chart-period">Last 6 Months</span>
      </div>

      <div className="teacher-line-chart-wrapper">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="teacher-line-svg"
          role="img"
          aria-label="Monthly teacher joining trend for the last six months"
        >
          {[0, 1, 2, 3].map((step) => {
            const y = top + (chartHeight / 3) * step;
            const value = Math.round((maxValue * (3 - step)) / 3);

            return (
              <g key={step}>
                <line
                  x1={left}
                  y1={y}
                  x2={width - right}
                  y2={y}
                  className="teacher-chart-grid-line"
                />
                <text
                  x={left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="teacher-chart-axis-label"
                >
                  {value}
                </text>
              </g>
            );
          })}

          <polygon points={areaPoints} className="teacher-chart-area" />
          <polyline points={linePoints} className="teacher-chart-line" />

          {points.map((point) => (
            <g key={`${point.label}-${point.year}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r="5"
                className="teacher-chart-point"
              >
                <title>{`${point.label} ${point.year}: ${point.value} joinings`}</title>
              </circle>
              <text
                x={point.x}
                y={height - 17}
                textAnchor="middle"
                className="teacher-chart-month-label"
              >
                {point.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

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


  // All analytics are calculated from the live getTeachers API response.
  const teacherAnalytics = useMemo(() => {

    const assigned = teachers.filter(
      (teacher) =>
        teacher.Classteacher && String(teacher.Classteacher).trim() !== ""
    ).length;

    const assignmentData = [
      { label: "Assigned", value: assigned, color: TEACHER_CHART_COLORS[0] },
      {
        label: "Not Assigned",
        value: teachers.length - assigned,
        color: TEACHER_CHART_COLORS[1],
      },
    ];

    const today = new Date();
    const joiningData = [];

    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(
        today.getFullYear(),
        today.getMonth() - i,
        1
      );
      const month = monthDate.getMonth();
      const year = monthDate.getFullYear();

      const count = teachers.filter((teacher) => {
        const date = getTeacherJoiningDate(teacher.Doj);
        return (
          date &&
          date.getMonth() === month &&
          date.getFullYear() === year
        );
      }).length;

      joiningData.push({
        label: monthDate.toLocaleString("en-US", { month: "short" }),
        year,
        value: count,
      });
    }

    return { assignmentData, joiningData };
  }, [teachers]);

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

        {/* TEACHER ANALYTICS */}
        <div className="teacher-analytics-section">
          <div className="teacher-analytics-heading">
            <div>
              <h3>
                <i className="bi bi-bar-chart-line-fill"></i>
                Teacher Analytics
              </h3>
              <p>
                Insights into teacher distribution and recruitment trends
              </p>
            </div>
          </div>

          {loading ? (
            <div className="teacher-analytics-loading">
              <div className="view-teachers-loader"></div>
              Preparing teacher analytics...
            </div>
          ) : (
            <>
              <div className="teacher-analytics-charts-grid">
                <TeacherPieChart
                  title="Class Assignment"
                  subtitle="Teacher class allocation overview"
                  items={teacherAnalytics.assignmentData}
                  total={teachers.length}
                />

                <TeacherJoiningChart data={teacherAnalytics.joiningData} />
              </div>
            </>
          )}
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
