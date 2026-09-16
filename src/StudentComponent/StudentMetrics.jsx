
import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import "./StudentMetrics.css";
import { useNavigate } from "react-router-dom";

const StudentMetrics = () => {
    const BASE_URL =
        "http://localhost/kkblossom/api.php/Adminapi/AdminStudentMetrics";

    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [filterEnabled, setFilterEnabled] = useState(false);

    const navigate = useNavigate();

    // ================================
    // LOAD CLASSES
    // ================================
    useEffect(() => {
        axios
            .get(`${BASE_URL}/getAllClasses`)
            .then((res) => {
                if (Array.isArray(res.data)) {
                    setClasses(res.data);
                } else {
                    setClasses([]);
                }
            })
            .catch((error) => {
                console.error("Error loading classes:", error);
                setClasses([]);
            });
    }, []);

    // ================================
    // LOAD STUDENTS
    // ================================
    useEffect(() => {
        if (filterEnabled && selectedClass) {
            axios
                .get(`${BASE_URL}/filter/${selectedClass}`)
                .then((res) => {
                    if (Array.isArray(res.data)) {
                        setStudents(res.data);
                    } else {
                        setStudents([]);
                    }
                })
                .catch((error) => {
                    console.error("Error filtering students:", error);
                    setStudents([]);
                });
        } else {
            axios
                .get(`${BASE_URL}/display`)
                .then((res) => {
                    if (Array.isArray(res.data)) {
                        setStudents(res.data);
                    } else {
                        setStudents([]);
                    }
                })
                .catch((error) => {
                    console.error("Error loading students:", error);
                    setStudents([]);
                });
        }
    }, [filterEnabled, selectedClass]);

    // ================================
    // FILTER TOGGLE
    // ================================
    const handleFilterToggle = () => {
        const newValue = !filterEnabled;

        setFilterEnabled(newValue);

        if (!newValue) {
            setSelectedClass("");
        }
    };

    // ================================
    // VIEW METRICS
    // ================================
    const handleViewMetrics = () => {
        if (!filterEnabled) {
            return;
        }

        if (!selectedClass) {
            alert("Please select a class first.");
            return;
        }

        navigate(
            `/dashboard/StudentComponent/MetricsView?class=${encodeURIComponent(
                selectedClass
            )}`
        );
    };

    // ================================
    // ADD / UPDATE METRICS
    // ================================
    const handleMetrics = (id) => {
        navigate(
            `/dashboard/StudentComponent/MetricsAdd/${id}`
        );
    };

    // ================================
    // DATATABLE COLUMNS
    // ================================
    const columns = [
        {
            name: "ID",
            selector: (row) => row.id,
            sortable: true,
            width: "100px",
        },
        {
            name: "NAME",
            selector: (row) => row.Name,
            sortable: true,
            grow: 2,
        },
        {
            name: "CLASS",
            selector: (row) => row.Class,
            sortable: true,
        },
        {
            name: "ROLL NO",
            selector: (row) => row.Rollno,
            sortable: true,
        },
        {
            name: "METRICS",
            cell: (row) => (
                <button
                    type="button"
                    className="student-metrics-action-btn"
                    onClick={() => handleMetrics(row.id)}
                    title="Add / Update Metrics"
                >
                    <i className="las la-pen"></i>
                </button>
            ),
            center: true,
            width: "130px",
        },
    ];

    // ================================
    // DATATABLE STYLES
    // ================================
    const customStyles = {
        table: {
            style: {
                width: "100%",
            },
        },

        headRow: {
            style: {
                backgroundColor: "#6f42c1",
                minHeight: "52px",
                borderBottom: "none",
            },
        },

        headCells: {
            style: {
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "700",
                textTransform: "uppercase",
                paddingLeft: "18px",
                paddingRight: "18px",
            },
        },

        rows: {
            style: {
                minHeight: "58px",
                fontSize: "14px",
                color: "#34303d",
                backgroundColor: "#ffffff",
                borderBottom: "1px solid #eee7f7",
            },

            highlightOnHoverStyle: {
                backgroundColor: "#f7f2ff",
                borderBottomColor: "#e2d5f5",
            },
        },

        cells: {
            style: {
                paddingLeft: "18px",
                paddingRight: "18px",
            },
        },

        pagination: {
            style: {
                borderTop: "1px solid #eee7f7",
                backgroundColor: "#ffffff",
                minHeight: "58px",
                color: "#5f566b",
            },

            pageButtonsStyle: {
                borderRadius: "6px",
                height: "34px",
                width: "34px",
                padding: "0",
                margin: "0 3px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fill: "#6f42c1",
                color: "#6f42c1",
                backgroundColor: "#ffffff",
            },
        },
    };

    const canViewMetrics =
        filterEnabled && selectedClass !== "";

    // ================================
    // UI
    // ================================
    return (
        <div className="student-metrics-page">

            {/* HEADER */}
            <div className="student-metrics-header">

                <div>
                    <h3 className="student-metrics-title">
                        Student Metrics
                    </h3>

                    <p className="student-metrics-subtitle">
                        Manage and view student performance metrics
                    </p>
                </div>

                <button
                    type="button"
                    className={`student-metrics-view-btn ${
                        !canViewMetrics
                            ? "student-metrics-view-btn-disabled"
                            : ""
                    }`}
                    onClick={handleViewMetrics}
                    disabled={!canViewMetrics}
                >
                    <i className="las la-chart-bar"></i>
                    View Metrics
                </button>

            </div>


            {/* FILTER CARD */}
            <div className="student-metrics-filter-card">

                <div className="student-metrics-filter-top">

                    <label className="student-metrics-toggle-wrapper">

    <span className="student-metrics-checkbox-text">
        Enable Filter
    </span>

    <input
        type="checkbox"
        className="student-metrics-toggle-input"
        checked={filterEnabled}
        onChange={handleFilterToggle}
    />

    <span className="student-metrics-toggle">
        <span className="student-metrics-toggle-circle"></span>
    </span>

</label>

                </div>


                <div className="student-metrics-filter-content">

                    <div className="student-metrics-filter-group">

                        <label className="student-metrics-filter-label">
                            <i className="las la-filter"></i>
                            Class
                        </label>

                        <select
                            className="student-metrics-select"
                            value={selectedClass}
                            disabled={!filterEnabled}
                            onChange={(e) =>
                                setSelectedClass(e.target.value)
                            }
                        >

                            <option value="">
                                Select Class
                            </option>

                            {classes.map((cls, index) => (
                                <option
                                    key={cls.id || index}
                                    value={cls.Classname}
                                >
                                    {cls.Classname}
                                </option>
                            ))}

                        </select>

                    </div>


                    <div className="student-metrics-filter-status">

                        {!filterEnabled && (
                            <span className="student-metrics-status-disabled">
                                <i className="las la-info-circle"></i>
                                Enable filter to view class metrics
                            </span>
                        )}

                        {filterEnabled && !selectedClass && (
                            <span className="student-metrics-status-warning">
                                <i className="las la-exclamation-circle"></i>
                                Please select a class
                            </span>
                        )}

                        {canViewMetrics && (
                            <span className="student-metrics-status-success">
                                <i className="las la-check-circle"></i>
                                Class selected: {selectedClass}
                            </span>
                        )}

                    </div>

                </div>

            </div>


            {/* TABLE CARD */}
            <div className="student-metrics-table-card">

                <div className="student-metrics-table-header">

                    <div>

                        <h4 className="student-metrics-table-title">
                            Students
                        </h4>

                        <span className="student-metrics-table-count">
                            {students.length} student
                            {students.length !== 1 ? "s" : ""}
                        </span>

                    </div>

                </div>


                <div className="student-metrics-table-wrapper">

                    <DataTable
                        columns={columns}
                        data={students}
                        pagination
                        highlightOnHover
                        responsive
                        striped
                        customStyles={customStyles}
                        noDataComponent={
                            <div className="student-metrics-no-data">

                                <i className="las la-user-slash"></i>

                                <p>
                                    No Students Found
                                </p>

                            </div>
                        }
                    />

                </div>

            </div>

        </div>
    );
};

export default StudentMetrics;
