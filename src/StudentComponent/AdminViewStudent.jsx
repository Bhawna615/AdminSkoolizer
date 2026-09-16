import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminViewStudent.css";

const AdminViewStudent = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClass, setSelectedClass] = useState("");
  const [enableFilter, setEnableFilter] = useState(false);
  const [activeAction, setActiveAction] = useState(null);

  const navigate = useNavigate();

  const API_BASE =
    "http://localhost/kkblossom/api.php/Adminapi/";

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        API_BASE + "AdminStudent/display"
      );

      if (Array.isArray(res.data)) {
        setStudents(res.data);
      } else if (Array.isArray(res.data.data)) {
        setStudents(res.data.data);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      alert("Invalid student ID");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.post(
        `${API_BASE}AdminStudent/delete/${id}`
      );

      if (response.data.status === true) {
        alert("Student deleted successfully");

        setStudents((prev) =>
          prev.filter(
            (student) =>
              String(student.id) !== String(id)
          )
        );

        setActiveAction(null);

        await fetchStudents();
      } else {
        alert(
          response.data.message ||
            "Failed to delete student"
        );
      }
    } catch (error) {
      console.error("Delete Error:", error);

      alert(
        error.response?.data?.message ||
          "Server Error while deleting student"
      );
    }
  };

  const filteredStudents = useMemo(() => {
    let data = Array.isArray(students)
      ? [...students]
      : [];

    if (enableFilter && selectedClass) {
      data = data.filter(
        (student) =>
          student.Class === selectedClass
      );
    }

    if (search.trim()) {
      const searchValue =
        search.toLowerCase().trim();

      data = data.filter(
        (student) =>
          student?.Name?.toLowerCase().includes(
            searchValue
          ) ||
          student?.Rollno
            ?.toString()
            .includes(searchValue) ||
          student?.Admno
            ?.toString()
            .toLowerCase()
            .includes(searchValue)
      );
    }

    data.sort((a, b) =>
      (a?.Name || "").localeCompare(
        b?.Name || "",
        undefined,
        {
          sensitivity: "base",
        }
      )
    );

    return data;
  }, [
    students,
    search,
    selectedClass,
    enableFilter,
  ]);

  const totalPages = Math.ceil(
    filteredStudents.length / entries
  );

  const startIndex =
    (currentPage - 1) * entries;

  const paginatedStudents =
    filteredStudents.slice(
      startIndex,
      startIndex + entries
    );

  const classList = [
    ...new Set(
      students
        .map((student) => student.Class)
        .filter(Boolean)
    ),
  ];

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    let start = Math.max(
      1,
      currentPage - 2
    );

    let end = Math.min(
      totalPages,
      start + maxVisible - 1
    );

    if (end - start < maxVisible - 1) {
      start = Math.max(
        1,
        end - maxVisible + 1
      );
    }

    if (start > 1) {
      pages.push(1);

      if (start > 2) {
        pages.push("...");
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="admin-view-student-page">

      {/* ================= HEADER ================= */}

      <div className="admin-view-student-header">

        <div className="admin-view-student-header-left">

          <div className="admin-view-student-header-icon">
            <i className="bi bi-people-fill"></i>
          </div>

          <div>
            <h1>Students</h1>
            <p>
              Manage and view all registered students
            </p>
          </div>

        </div>

        <div className="admin-view-student-total">

          <span className="admin-view-student-total-icon">
            <i className="bi bi-person-check-fill"></i>
          </span>

          <div>
            <strong>
              {students.length}
            </strong>
            <small>Total Students</small>
          </div>

        </div>

      </div>


      {/* ================= FILTER CARD ================= */}

      <div className="admin-view-student-filter-card">

        <div className="admin-view-student-filter-top">

          <div className="admin-view-student-filter-title">

            <div className="admin-view-student-filter-icon">
              <i className="bi bi-funnel-fill"></i>
            </div>

            <div>
              <h3>Student Filters</h3>
              <p>
                Filter students by class
              </p>
            </div>

          </div>

          <label className="admin-view-student-toggle">

            <input
              type="checkbox"
              checked={enableFilter}
              onChange={() => {
                setEnableFilter(
                  !enableFilter
                );
                setCurrentPage(1);
              }}
            />

            <span className="admin-view-student-toggle-slider"></span>

            <span className="admin-view-student-toggle-text">
              Enable Filter
            </span>

          </label>

        </div>


        <div className="admin-view-student-filter-body">

          <div className="admin-view-student-field">

            <label>
              <i className="bi bi-mortarboard-fill"></i>
              Class
            </label>

            <select
              value={selectedClass}
              disabled={!enableFilter}
              onChange={(e) => {
                setSelectedClass(
                  e.target.value
                );
                setCurrentPage(1);
              }}
            >
              <option value="">
                All Classes
              </option>

              {classList.map((cls) => (
                <option
                  key={cls}
                  value={cls}
                >
                  {cls}
                </option>
              ))}
            </select>

          </div>

          <div className="admin-view-student-filter-info">

            <i className="bi bi-info-circle-fill"></i>

            <span>
              {enableFilter
                ? selectedClass
                  ? `Showing students from ${selectedClass}`
                  : "Select a class to filter students"
                : "Enable the filter to select a class"}
            </span>

          </div>

        </div>

      </div>


      {/* ================= TABLE CARD ================= */}

      <div className="admin-view-student-table-card">

        {/* TABLE TOOLBAR */}

        <div className="admin-view-student-table-toolbar">

          <div className="admin-view-student-entries">

            <span>Show</span>

            <select
              value={entries}
              onChange={(e) => {
                setEntries(
                  Number(e.target.value)
                );
                setCurrentPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>

            <span>entries</span>

          </div>


          <div className="admin-view-student-search">

            <label>
              <i className="bi bi-search"></i>
            </label>

            <input
              type="text"
              placeholder="Search name, roll no or admission no..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCurrentPage(1);
                }}
              >
                <i className="bi bi-x-circle-fill"></i>
              </button>
            )}

          </div>

        </div>


        {/* ================= TABLE ================= */}

        <div className="admin-view-student-table-wrapper">

          <table className="admin-view-student-table">

            <thead>

              <tr>
                <th>
                  <span>ID</span>
                </th>

                <th>
                  <span>ROLL NO.</span>
                </th>

                <th className="admin-view-student-name-column">
                  <span>STUDENT</span>
                </th>

                <th>
                  <span>CLASS</span>
                </th>

                <th>
                  <span>ADMISSION NO.</span>
                </th>

                <th>
                  <span>NOTIFICATIONS</span>
                </th>

                <th className="admin-view-student-action-column">
                  <span>ACTIONS</span>
                </th>
              </tr>

            </thead>


            <tbody>

              {paginatedStudents.length > 0 ? (

                paginatedStudents.map(
                  (row, index) => {

                    const isReceiving =
                      row?.fcm_token !== null &&
                      row?.fcm_token !==
                        undefined &&
                      row?.fcm_token !== "" &&
                      row?.fcm_token !== "0" &&
                      row?.fcm_token !== 0;

                    return (
                      <tr key={row.id}>

                        {/* ID */}

                        <td>
                          <span className="admin-view-student-id">
                            {row.id}
                          </span>
                        </td>


                        {/* ROLL NO */}

                        <td>

                          <span className="admin-view-student-roll">
                            {row.Rollno || "-"}
                          </span>

                        </td>


                        {/* NAME */}

                        <td className="admin-view-student-name-column">

                          <div
                            className="admin-view-student-name-cell"
                            onClick={() =>
                              navigate(
                                `/dashboard/StudentComponent/ViewStudentProfile/${row.id}`
                              )
                            }
                          >

                            <div className="admin-view-student-avatar">
                              {(row.Name || "S")
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div className="admin-view-student-name-info">

                              <strong>
                                {row.Name || "Unknown Student"}
                              </strong>

                              <small>
                                Student ID: {row.id}
                              </small>

                            </div>

                          </div>

                        </td>


                        {/* CLASS */}

                        <td>

                          <span className="admin-view-student-class-badge">
                            <i className="bi bi-bookmark-fill"></i>
                            {row.Class || "-"}
                          </span>

                        </td>


                        {/* ADMISSION */}

                        <td>

                          <span className="admin-view-student-admission">
                            {row.Admno || "-"}
                          </span>

                        </td>


                        {/* NOTIFICATION */}

                        <td>

                          {isReceiving ? (

                            <span className="admin-view-student-notification receiving">
                              <span className="admin-view-student-notification-dot"></span>
                              <i className="bi bi-bell-fill"></i>
                              Receiving
                            </span>

                          ) : (

                            <span className="admin-view-student-notification not-receiving">
                              <span className="admin-view-student-notification-dot"></span>
                              <i className="bi bi-bell-slash-fill"></i>
                              Not Receiving
                            </span>

                          )}

                        </td>


                        {/* ACTIONS */}

                        <td className="admin-view-student-action-column">

                          <div className="admin-view-student-action-wrapper">

                            <button
                              type="button"
                              className={
                                activeAction === row.id
                                  ? "admin-view-student-action-button active"
                                  : "admin-view-student-action-button"
                              }
                              onClick={() =>
                                setActiveAction(
                                  activeAction ===
                                    row.id
                                    ? null
                                    : row.id
                                )
                              }
                              title="Student Actions"
                            >
                              <i className="bi bi-three-dots-vertical"></i>
                            </button>


                            {activeAction === row.id && (

                              <div className="admin-view-student-action-dropdown">

                                <div className="admin-view-student-action-heading">
                                  <i className="bi bi-person-lines-fill"></i>
                                  Student Actions
                                </div>


                                <button
                                  onClick={() =>
                                    navigate(
                                      `/StudentComponent/report/${row.id}`
                                    )
                                  }
                                >
                                  <span className="action-icon purple">
                                    <i className="bi bi-file-earmark-bar-graph-fill"></i>
                                  </span>
                                  Exam Report
                                </button>


                                <button
                                  onClick={() =>
                                    navigate(
                                      `/StudentComponent/ReportCardRouter/${row.id}`
                                    )
                                  }
                                >
                                  <span className="action-icon blue">
                                    <i className="bi bi-file-earmark-text-fill"></i>
                                  </span>
                                  Report Card
                                </button>


                                <button
                                  onClick={() =>
                                    navigate(
                                      `/StudentComponent/ReportRouter/${row.id}`
                                    )
                                  }
                                >
                                  <span className="action-icon violet">
                                    <i className="bi bi-card-checklist"></i>
                                  </span>
                                  Customized Report Card
                                </button>


                                <button
                                  onClick={() =>
                                    navigate(
                                      `/dashboard/StudentComponent/StudentAttendenceDetails/${row.id}`
                                    )
                                  }
                                >
                                  <span className="action-icon green">
                                    <i className="bi bi-calendar-check-fill"></i>
                                  </span>
                                  Attendance
                                </button>


                                <button
                                  onClick={() =>
                                    navigate(
                                      `/dashboard/StudentComponent/GenerateTC/${row.id}`
                                    )
                                  }
                                >
                                  <span className="action-icon orange">
                                    <i className="bi bi-file-earmark-break-fill"></i>
                                  </span>
                                  Transfer Certificate
                                </button>


                                <button
                                  onClick={() =>
                                    navigate(
                                      `/dashboard/StudentComponent/CharacterCertificate/${row.id}`
                                    )
                                  }
                                >
                                  <span className="action-icon teal">
                                    <i className="bi bi-award-fill"></i>
                                  </span>
                                  Character Certificate
                                </button>


                                <button
                                  onClick={() =>
                                    navigate(
                                      `/dashboard/StudentComponent/StudentTransportDetails/${row.id}`
                                    )
                                  }
                                >
                                  <span className="action-icon cyan">
                                    <i className="bi bi-bus-front-fill"></i>
                                  </span>
                                  Transport
                                </button>


                                <button
                                  onClick={() =>
                                    navigate(
                                      `/dashboard/StudentComponent/StudentExamDetails/${row.id}`
                                    )
                                  }
                                >
                                  <span className="action-icon indigo">
                                    <i className="bi bi-journal-check"></i>
                                  </span>
                                  Exams
                                </button>


                                <button
                                  onClick={() =>
                                    navigate(
                                      `/dashboard/StudentComponent/StudentFeeDetails/${row.id}`
                                    )
                                  }
                                >
                                  <span className="action-icon yellow">
                                    <i className="bi bi-cash-stack"></i>
                                  </span>
                                  Fee
                                </button>


                                <button
                                  onClick={() =>
                                    navigate(
                                      `/dashboard/StudentComponent/StudentMessages/${row.id}`
                                    )
                                  }
                                >
                                  <span className="action-icon pink">
                                    <i className="bi bi-chat-left-text-fill"></i>
                                  </span>
                                  Messages
                                </button>


                                <button
                                  onClick={() =>
                                    navigate(
                                      `/dashboard/StudentComponent/CreateCredentials/${row.id}`
                                    )
                                  }
                                >
                                  <span className="action-icon purple">
                                    <i className="bi bi-key-fill"></i>
                                  </span>
                                  Create Credentials
                                </button>


                                <button
                                  onClick={() =>
                                    navigate(
                                      `/dashboard/StudentComponent/CreateStudentPayment/${row.id}`
                                    )
                                  }
                                >
                                  <span className="action-icon green">
                                    <i className="bi bi-credit-card-fill"></i>
                                  </span>
                                  Create Fee Payment
                                </button>


                                <div className="admin-view-student-action-divider"></div>


                                <button
                                  className="admin-view-student-delete-action"
                                  onClick={() =>
                                    handleDelete(row.id)
                                  }
                                >
                                  <span className="action-icon red">
                                    <i className="bi bi-trash-fill"></i>
                                  </span>
                                  Delete Student
                                </button>

                              </div>

                            )}

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    className="admin-view-student-empty"
                  >

                    <div className="admin-view-student-empty-icon">
                      <i className="bi bi-person-x-fill"></i>
                    </div>

                    <h3>
                      No Students Found
                    </h3>

                    <p>
                      Try changing your search or filter criteria.
                    </p>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>


        {/* ================= FOOTER / PAGINATION ================= */}

        <div className="admin-view-student-table-footer">

          <div className="admin-view-student-showing">

            Showing{" "}

            <strong>
              {filteredStudents.length === 0
                ? 0
                : startIndex + 1}
            </strong>

            {" "}to{" "}

            <strong>
              {Math.min(
                startIndex + entries,
                filteredStudents.length
              )}
            </strong>

            {" "}of{" "}

            <strong>
              {filteredStudents.length}
            </strong>

            {" "}entries

          </div>


          <div className="admin-view-student-pagination">

            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() =>
                goToPage(currentPage - 1)
              }
            >
              <i className="bi bi-chevron-left"></i>
              Previous
            </button>


            <div className="admin-view-student-page-numbers">

              {getPageNumbers().map(
                (page, index) =>
                  page === "..." ? (

                    <span
                      key={`dots-${index}`}
                      className="admin-view-student-page-dots"
                    >
                      ...
                    </span>

                  ) : (

                    <button
                      type="button"
                      key={page}
                      className={
                        currentPage === page
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        goToPage(page)
                      }
                    >
                      {page}
                    </button>

                  )
              )}

            </div>


            <button
              type="button"
              disabled={
                currentPage === totalPages ||
                totalPages === 0
              }
              onClick={() =>
                goToPage(currentPage + 1)
              }
            >
              Next
              <i className="bi bi-chevron-right"></i>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminViewStudent;