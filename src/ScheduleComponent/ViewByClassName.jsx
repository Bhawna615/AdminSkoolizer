
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./ViewByClassName.css";

const ViewByClassName = () => {
    const { className } = useParams();
    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");
    const [entries, setEntries] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeAction, setActiveAction] = useState(null);

    const [sortField, setSortField] = useState("");
    const [sortDirection, setSortDirection] = useState("asc");

    // DELETE CONFIRMATION POPUP STATES
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState("");
    const [deleteMessageType, setDeleteMessageType] = useState("confirm");

    const API_BASE =
        "http://localhost/kkblossom/api.php/Adminapi/";

    // =====================================================
    // FETCH STUDENTS
    // =====================================================
    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await axios.get(
                API_BASE + "AdminStudent/display"
            );

            console.log("Students Response:", res.data);

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

    // =====================================================
    // OPEN DELETE CONFIRMATION POPUP
    // =====================================================
    const handleDelete = (student) => {
        setSelectedStudent(student);
        setDeleteMessageType("confirm");
        setDeleteMessage(
            `Are you sure you want to delete ${
                student?.Name || "this student"
            }? This action cannot be undone.`
        );
        setShowDeleteConfirmation(true);
        setActiveAction(null);
    };

    // =====================================================
    // CONFIRM AND DELETE STUDENT
    // =====================================================
    const confirmDeleteStudent = async () => {
        if (!selectedStudent?.id) {
            setDeleteMessageType("error");
            setDeleteMessage(
                "Unable to identify the selected student."
            );
            return;
        }

        try {
            setDeleteLoading(true);

            const response = await axios.delete(
                `${API_BASE}AdminStudent/delete/${selectedStudent.id}`
            );

            console.log("Delete Response:", response.data);

            if (response.data.status) {
                // Keep the popup open and show success
                setDeleteMessageType("success");
                setDeleteMessage("Student deleted successfully.");
                setSelectedStudent(null);

                // Refresh the student list
                await fetchStudents();
            } else {
                setDeleteMessageType("error");
                setDeleteMessage(
                    "Failed to delete student. Please try again."
                );
            }
        } catch (error) {
            console.error("Delete Error:", error);

            setDeleteMessageType("error");
            setDeleteMessage(
                "Failed to delete student. Please try again."
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    // =====================================================
    // CLOSE DELETE POPUP
    // =====================================================
    const closeDeletePopup = () => {
        if (deleteLoading) return;

        setShowDeleteConfirmation(false);
        setSelectedStudent(null);
    };

    // =====================================================
    // FILTER + SEARCH + SORT
    // =====================================================
    const filteredStudents = useMemo(() => {
        let data = Array.isArray(students)
            ? [...students]
            : [];

        // CLASS FILTER
        if (className) {
            data = data.filter(
                (student) =>
                    String(student?.Class || "")
                        .trim()
                        .toLowerCase() ===
                    String(className)
                        .trim()
                        .toLowerCase()
            );
        }

        // SEARCH
        if (search.trim()) {
            const searchValue = search
                .trim()
                .toLowerCase();

            data = data.filter(
                (student) =>
                    String(student?.Name || "")
                        .toLowerCase()
                        .includes(searchValue) ||
                    String(student?.Rollno || "")
                        .toLowerCase()
                        .includes(searchValue)
            );
        }

        // SORT
        if (sortField) {
            data.sort((a, b) => {
                let valueA = a?.[sortField] ?? "";
                let valueB = b?.[sortField] ?? "";

                if (sortField === "Rollno") {
                    valueA = Number(valueA) || 0;
                    valueB = Number(valueB) || 0;

                    return sortDirection === "asc"
                        ? valueA - valueB
                        : valueB - valueA;
                }

                valueA = String(valueA).toLowerCase();
                valueB = String(valueB).toLowerCase();

                return sortDirection === "asc"
                    ? valueA.localeCompare(valueB)
                    : valueB.localeCompare(valueA);
            });
        } else {
            data.sort((a, b) =>
                (a?.Name || "").localeCompare(
                    b?.Name || "",
                    undefined,
                    {
                        sensitivity: "base",
                    }
                )
            );
        }

        return data;
    }, [
        students,
        className,
        search,
        sortField,
        sortDirection,
    ]);

    // =====================================================
    // PAGINATION
    // =====================================================
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

    // =====================================================
    // SORT
    // =====================================================
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(
                sortDirection === "asc"
                    ? "desc"
                    : "asc"
            );
        } else {
            setSortField(field);
            setSortDirection("asc");
        }

        setCurrentPage(1);
    };

    // =====================================================
    // PAGE CHANGE
    // =====================================================
    const changePage = (page) => {
        if (
            page >= 1 &&
            page <= totalPages
        ) {
            setCurrentPage(page);
        }
    };

    // =====================================================
    // CLOSE ACTION MENU
    // =====================================================
    useEffect(() => {
        const handleOutsideClick = () => {
            setActiveAction(null);
        };

        if (activeAction !== null) {
            document.addEventListener(
                "click",
                handleOutsideClick
            );
        }

        return () => {
            document.removeEventListener(
                "click",
                handleOutsideClick
            );
        };
    }, [activeAction]);

    return (
        <div className="vbc-page">

            {/* =================================================
                PAGE HEADER
            ================================================= */}
            <div className="vbc-header">

                <div className="vbc-header-left">

                    <div className="vbc-header-icon">
                        <i className="las la-user-graduate"></i>
                    </div>

                    <div>
                        <span className="vbc-eyebrow">
                            STUDENT MANAGEMENT
                        </span>

                        <h1>Class Students</h1>

                        <p>
                            View and manage students enrolled in{" "}
                            <strong>
                                {className || "this class"}
                            </strong>
                        </p>
                    </div>

                </div>

                <button
                    type="button"
                    className="vbc-back-btn"
                    onClick={() => navigate(-1)}
                >
                    <i className="las la-arrow-left"></i>
                    Back
                </button>

            </div>

            {/* =================================================
                SUMMARY CARDS
            ================================================= */}
            <div className="vbc-summary-grid">

                <div className="vbc-summary-card">

                    <div className="vbc-summary-icon purple">
                        <i className="las la-users"></i>
                    </div>

                    <div className="vbc-summary-content">
                        <span>TOTAL STUDENTS</span>
                        <strong>
                            {filteredStudents.length}
                        </strong>
                    </div>

                    <div className="vbc-summary-decoration">
                        <i className="las la-user-graduate"></i>
                    </div>

                </div>

                <div className="vbc-summary-card">

                    <div className="vbc-summary-icon blue">
                        <i className="las la-school"></i>
                    </div>

                    <div className="vbc-summary-content">
                        <span>CLASS</span>
                        <strong>
                            {className || "All"}
                        </strong>
                    </div>

                    <div className="vbc-summary-decoration">
                        <i className="las la-book-open"></i>
                    </div>

                </div>

                <div className="vbc-summary-card">

                    <div className="vbc-summary-icon green">
                        <i className="las la-check-circle"></i>
                    </div>

                    <div className="vbc-summary-content">
                        <span>DISPLAYING</span>
                        <strong>
                            {paginatedStudents.length}
                        </strong>
                    </div>

                    <div className="vbc-summary-decoration">
                        <i className="las la-list"></i>
                    </div>

                </div>

            </div>

            {/* =================================================
                MAIN CONTENT CARD
            ================================================= */}
            <div className="vbc-main-card">

                {/* CARD HEADER */}
                <div className="vbc-card-header">

                    <div className="vbc-card-title">

                        <div className="vbc-title-icon">
                            <i className="las la-address-book"></i>
                        </div>

                        <div>
                            <h2>Student Directory</h2>

                            <p>
                                {filteredStudents.length} student
                                {filteredStudents.length !== 1
                                    ? "s"
                                    : ""}{" "}
                                found in this class
                            </p>
                        </div>

                    </div>

                    <div className="vbc-class-badge">
                        <i className="las la-graduation-cap"></i>
                        {className || "All Classes"}
                    </div>

                </div>

                {/* =================================================
                    TOOLBAR
                ================================================= */}
                <div className="vbc-toolbar">

                    <div className="vbc-show-control">

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
                            <option value={100}>100</option>
                        </select>

                        <span>entries</span>

                    </div>

                    <div className="vbc-search-wrapper">

                        <i className="las la-search"></i>

                        <input
                            id="vbc-search"
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Search student name or roll number..."
                        />

                        {search && (
                            <button
                                type="button"
                                className="vbc-clear-search"
                                onClick={() => {
                                    setSearch("");
                                    setCurrentPage(1);
                                }}
                            >
                                <i className="las la-times"></i>
                            </button>
                        )}

                    </div>

                </div>

                {/* =================================================
                    TABLE
                ================================================= */}
                <div className="vbc-table-container">

                    <table className="vbc-table">

                        <thead>

                            <tr>

                                {/* ROLL NO */}
                                <th
                                    className="vbc-roll-column"
                                    onClick={() =>
                                        handleSort("Rollno")
                                    }
                                >
                                    <div className="vbc-th-content">

                                        <span>ROLL NO.</span>

                                        <span className="vbc-sort-icons">

                                            <i
                                                className={`las la-angle-up ${
                                                    sortField === "Rollno" &&
                                                    sortDirection === "asc"
                                                        ? "vbc-sort-active"
                                                        : ""
                                                }`}
                                            ></i>

                                            <i
                                                className={`las la-angle-down ${
                                                    sortField === "Rollno" &&
                                                    sortDirection === "desc"
                                                        ? "vbc-sort-active"
                                                        : ""
                                                }`}
                                            ></i>

                                        </span>

                                    </div>
                                </th>

                                {/* NAME */}
                                <th
                                    className="vbc-name-column"
                                    onClick={() =>
                                        handleSort("Name")
                                    }
                                >
                                    <div className="vbc-th-content">

                                        <span>STUDENT NAME</span>

                                        <span className="vbc-sort-icons">

                                            <i
                                                className={`las la-angle-up ${
                                                    sortField === "Name" &&
                                                    sortDirection === "asc"
                                                        ? "vbc-sort-active"
                                                        : ""
                                                }`}
                                            ></i>

                                            <i
                                                className={`las la-angle-down ${
                                                    sortField === "Name" &&
                                                    sortDirection === "desc"
                                                        ? "vbc-sort-active"
                                                        : ""
                                                }`}
                                            ></i>

                                        </span>

                                    </div>
                                </th>

                                {/* CLASS */}
                                <th className="vbc-class-column">

                                    <div className="vbc-th-content">

                                        <span>CLASS</span>

                                        <i className="las la-school"></i>

                                    </div>

                                </th>

                                {/* ACTIONS */}
                                <th className="vbc-actions-column">

                                    <div className="vbc-th-content">
                                        <span>ACTIONS</span>
                                    </div>

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {paginatedStudents.length > 0 ? (

                                paginatedStudents.map((row, index) => (

                                    <tr key={row.id}>

                                        {/* ROLL */}
                                        <td>

                                            <div className="vbc-roll-wrapper">

                                                <span className="vbc-roll-number">
                                                    {row.Rollno}
                                                </span>

                                            </div>

                                        </td>

                                        {/* NAME */}
                                        <td className="vbc-student-name">

                                            <div className="vbc-student-wrapper">

                                                <div className="vbc-student-avatar">

                                                    {String(
                                                        row.Name || "S"
                                                    )
                                                        .charAt(0)
                                                        .toUpperCase()}

                                                </div>

                                                <div className="vbc-student-details">

                                                    <strong>
                                                        {row.Name}
                                                    </strong>

                                                    <span>
                                                        Student
                                                    </span>

                                                </div>

                                            </div>

                                        </td>

                                        {/* CLASS */}
                                        <td>

                                            <span className="vbc-class-pill">

                                                <i className="las la-graduation-cap"></i>

                                                {row.Class}

                                            </span>

                                        </td>

                                        {/* ACTIONS */}
                                        <td className="vbc-action-cell">

                                            <button
                                                type="button"
                                                className={`vbc-action-button ${
                                                    activeAction === row.id
                                                        ? "active"
                                                        : ""
                                                }`}
                                                onClick={(e) => {
                                                    e.stopPropagation();

                                                    setActiveAction(
                                                        activeAction === row.id
                                                            ? null
                                                            : row.id
                                                    );
                                                }}
                                            >

                                                <i className="las la-ellipsis-v"></i>

                                            </button>

                                            {activeAction === row.id && (

                                                <div
                                                    className="vbc-action-dropdown"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >

                                                    <div className="vbc-menu-heading">
                                                        <span>STUDENT ACTIONS</span>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/StudentComponent/report/${row.id}`
                                                            )
                                                        }
                                                    >
                                                        <i className="las la-file-alt"></i>
                                                        <span>Exam Report</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/dashboard/StudentComponent/StudentAttendenceDetails/${row.id}`
                                                            )
                                                        }
                                                    >
                                                        <i className="las la-calendar-check"></i>
                                                        <span>Attendance</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/dashboard/StudentComponent/GenerateTC/${row.id}`
                                                            )
                                                        }
                                                    >
                                                        <i className="las la-file-signature"></i>
                                                        <span>
                                                            Transfer Certificate
                                                        </span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/dashboard/StudentComponent/StudentTransportDetails/${row.id}`
                                                            )
                                                        }
                                                    >
                                                        <i className="las la-bus"></i>
                                                        <span>Transport</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/dashboard/StudentComponent/StudentExamDetails/${row.id}`
                                                            )
                                                        }
                                                    >
                                                        <i className="las la-book"></i>
                                                        <span>Exams</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/dashboard/StudentComponent/StudentFeeDetails/${row.id}`
                                                            )
                                                        }
                                                    >
                                                        <i className="las la-wallet"></i>
                                                        <span>Fee</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/dashboard/StudentComponent/StudentMessages/${row.id}`
                                                            )
                                                        }
                                                    >
                                                        <i className="las la-envelope"></i>
                                                        <span>Messages</span>
                                                    </button>

                                                    <div className="vbc-menu-divider"></div>

                                                    <button
                                                        type="button"
                                                        className="vbc-delete-option"
                                                        onClick={() =>
                                                            handleDelete(row)
                                                        }
                                                    >
                                                        <i className="las la-trash-alt"></i>
                                                        <span>
                                                            Delete Student
                                                        </span>
                                                    </button>

                                                </div>

                                            )}

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="4"
                                        className="vbc-no-data"
                                    >

                                        <div className="vbc-empty-state">

                                            <div className="vbc-empty-icon">
                                                <i className="las la-user-slash"></i>
                                            </div>

                                            <h3>No Students Found</h3>

                                            <p>
                                                {search
                                                    ? "Try changing your search term."
                                                    : "There are no students available for this class."}
                                            </p>

                                            {search && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSearch("");
                                                        setCurrentPage(1);
                                                    }}
                                                >
                                                    Clear Search
                                                </button>
                                            )}

                                        </div>

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

                {/* =================================================
                    PAGINATION
                ================================================= */}
                <div className="vbc-pagination">

                    <div className="vbc-pagination-info">

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
                        <strong>
                            {filteredStudents.length}
                        </strong>{" "}
                        students

                    </div>

                    <div className="vbc-page-buttons">

                        <button
                            type="button"
                            className="vbc-prev-next"
                            disabled={currentPage === 1}
                            onClick={() =>
                                changePage(currentPage - 1)
                            }
                        >
                            <i className="las la-angle-left"></i>
                            Previous
                        </button>

                        {Array.from(
                            {
                                length: totalPages,
                            },
                            (_, index) => index + 1
                        ).map((page) => (

                            <button
                                type="button"
                                key={page}
                                className={
                                    currentPage === page
                                        ? "vbc-page-active"
                                        : ""
                                }
                                onClick={() =>
                                    changePage(page)
                                }
                            >
                                {page}
                            </button>

                        ))}

                        <button
                            type="button"
                            className="vbc-prev-next"
                            disabled={
                                currentPage === totalPages ||
                                totalPages === 0
                            }
                            onClick={() =>
                                changePage(currentPage + 1)
                            }
                        >
                            Next
                            <i className="las la-angle-right"></i>
                        </button>

                    </div>

                </div>

            </div>

            {/* =================================================
                DELETE CONFIRMATION / SUCCESS / ERROR POPUP
            ================================================= */}
            {showDeleteConfirmation && (
                <div
                    className="vbc-delete-modal-overlay"
                    onClick={closeDeletePopup}
                >
                    <div
                        className="vbc-delete-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="vbc-delete-modal-title"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className={`vbc-delete-modal-icon ${deleteMessageType}`}
                        >
                            <i
                                className={
                                    deleteMessageType === "success"
                                        ? "las la-check-circle"
                                        : deleteMessageType === "error"
                                        ? "las la-exclamation-circle"
                                        : "las la-user-times"
                                }
                            ></i>
                        </div>

                        <h3 id="vbc-delete-modal-title">
                            {deleteMessageType === "success"
                                ? "Deletion Successful"
                                : deleteMessageType === "error"
                                ? "Unable to Delete"
                                : "Confirm Student Deletion"}
                        </h3>

                        <p>{deleteMessage}</p>

                        <div className="vbc-delete-modal-actions">

                            {deleteMessageType === "confirm" && (
                                <button
                                    type="button"
                                    className="vbc-delete-cancel-btn"
                                    onClick={closeDeletePopup}
                                    disabled={deleteLoading}
                                >
                                    Cancel
                                </button>
                            )}

                            <button
                                type="button"
                                className={`vbc-delete-confirm-btn ${deleteMessageType}`}
                                onClick={() => {
                                    if (deleteMessageType === "confirm") {
                                        confirmDeleteStudent();
                                    } else {
                                        closeDeletePopup();
                                    }
                                }}
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? (
                                    <>
                                        <span className="vbc-delete-spinner"></span>
                                        Deleting...
                                    </>
                                ) : deleteMessageType === "confirm" ? (
                                    <>
                                        <i className="las la-trash-alt"></i>
                                        Confirm Delete
                                    </>
                                ) : deleteMessageType === "success" ? (
                                    "Done"
                                ) : (
                                    "OK"
                                )}
                            </button>

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ViewByClassName;
