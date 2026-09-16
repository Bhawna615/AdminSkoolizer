import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getClasses } from "../AttendanceComponent/attendanceSheetApi";

import "./AttendanceByMonth.css";

const AttendanceByMonth = () => {

    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [month, setMonth] = useState("1");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // ================= LOAD CLASSES =================
    useEffect(() => {

        const loadClasses = async () => {

            try {

                setLoading(true);

                const res = await getClasses();

                setClasses(res.data || []);

            } catch (error) {

                console.log("Error loading classes:", error);

                setClasses([]);

            } finally {

                setLoading(false);

            }
        };

        loadClasses();

    }, []);

    // ================= VIEW ATTENDANCE =================
    const handleView = (e) => {

        e.preventDefault();

        if (!selectedClass) {
            return;
        }

        navigate(
            `/AttendanceComponent/AttendanceOutput?class=${encodeURIComponent(
                selectedClass
            )}&month=${month}`
        );
    };

    // ================= MONTHS =================
    const months = Array.from(
        { length: 12 },
        (_, index) => ({
            value: String(index + 1),
            name: new Date(2000, index, 1).toLocaleString(
                "default",
                {
                    month: "long",
                }
            ),
        })
    );

    return (
        <div className="attendance-by-month-page">

            {/* ================= HEADER ================= */}
            <div className="attendance-by-month-header">

                <div className="attendance-by-month-header-left">

                    <div className="attendance-by-month-header-icon">
                        <i className="bi bi-calendar3"></i>
                    </div>

                    <div className="attendance-by-month-header-content">

                        <h2>Attendance By Month</h2>

                        <p>
                            View monthly attendance records for a selected class
                        </p>

                    </div>

                </div>

                <div className="attendance-by-month-header-badge">
                    <i className="bi bi-calendar-check-fill"></i>
                    Monthly Report
                </div>

            </div>


            {/* ================= MAIN CONTENT ================= */}
            <div className="attendance-by-month-content">

                {/* ================= FORM CARD ================= */}
                <div className="attendance-by-month-form-card">

                    {/* CARD HEADER */}
                    <div className="attendance-by-month-card-header">

                        <div className="attendance-by-month-card-icon">
                            <i className="bi bi-bar-chart-fill"></i>
                        </div>

                        <div>

                            <h3>
                                Generate Attendance Report
                            </h3>

                            <p>
                                Select a class and month to view attendance
                            </p>

                        </div>

                    </div>


                    {/* FORM */}
                    <form
                        onSubmit={handleView}
                        className="attendance-by-month-form"
                    >

                        {/* ================= CLASS ================= */}
                        <div className="attendance-by-month-field">

                            <label htmlFor="attendance-by-month-class">

                                <i className="bi bi-mortarboard-fill"></i>

                                Select Class

                            </label>

                            <div className="attendance-by-month-select-wrapper">

                                <select
                                    id="attendance-by-month-class"
                                    className="attendance-by-month-select"
                                    value={selectedClass}
                                    onChange={(e) =>
                                        setSelectedClass(
                                            e.target.value
                                        )
                                    }
                                    required
                                    disabled={loading}
                                >

                                    <option value="">
                                        Select Class
                                    </option>

                                    {classes.map((c, index) => (

                                        <option
                                            key={index}
                                            value={c.Classname}
                                        >
                                            Class {c.Classname}
                                        </option>

                                    ))}

                                </select>

                                <i className="bi bi-chevron-down attendance-by-month-select-arrow"></i>

                            </div>

                        </div>


                        {/* ================= MONTH ================= */}
                        <div className="attendance-by-month-field">

                            <label htmlFor="attendance-by-month-month">

                                <i className="bi bi-calendar-month"></i>

                                Select Month

                            </label>

                            <div className="attendance-by-month-select-wrapper">

                                <select
                                    id="attendance-by-month-month"
                                    className="attendance-by-month-select"
                                    value={month}
                                    onChange={(e) =>
                                        setMonth(e.target.value)
                                    }
                                >

                                    {months.map((item) => (

                                        <option
                                            key={item.value}
                                            value={item.value}
                                        >
                                            {item.name}
                                        </option>

                                    ))}

                                </select>

                                <i className="bi bi-chevron-down attendance-by-month-select-arrow"></i>

                            </div>

                        </div>


                        {/* ================= SELECTED SUMMARY ================= */}
                        <div className="attendance-by-month-summary">

                            <div className="attendance-by-month-summary-icon">
                                <i className="bi bi-info-circle-fill"></i>
                            </div>

                            <div className="attendance-by-month-summary-content">

                                <span>
                                    Report Selection
                                </span>

                                <strong>
                                    {selectedClass
                                        ? `Class ${selectedClass}`
                                        : "No class selected"}
                                </strong>

                                <small>
                                    {
                                        months.find(
                                            (item) =>
                                                item.value === month
                                        )?.name
                                    }
                                </small>

                            </div>

                        </div>


                        {/* ================= BUTTON ================= */}
                        <button
                            type="submit"
                            className="attendance-by-month-submit"
                            disabled={loading || !selectedClass}
                        >

                            <i className="bi bi-eye-fill"></i>

                            <span>
                                View Attendance
                            </span>

                        </button>

                    </form>

                </div>


                {/* ================= SIDE INFORMATION ================= */}
                <div className="attendance-by-month-info-card">

                    <div className="attendance-by-month-info-icon">
                        <i className="bi bi-clipboard-data-fill"></i>
                    </div>

                    <h3>
                        Monthly Attendance
                    </h3>

                    <p>
                        Generate and view the complete attendance report
                        for a particular class and month.
                    </p>


                    <div className="attendance-by-month-info-list">

                        <div className="attendance-by-month-info-item">

                            <div className="attendance-by-month-info-item-icon">
                                <i className="bi bi-people-fill"></i>
                            </div>

                            <div>
                                <strong>
                                    Class Wise
                                </strong>

                                <span>
                                    View attendance for a selected class
                                </span>
                            </div>

                        </div>


                        <div className="attendance-by-month-info-item">

                            <div className="attendance-by-month-info-item-icon">
                                <i className="bi bi-calendar-check-fill"></i>
                            </div>

                            <div>
                                <strong>
                                    Month Wise
                                </strong>

                                <span>
                                    Select any month from the year
                                </span>
                            </div>

                        </div>


                        <div className="attendance-by-month-info-item">

                            <div className="attendance-by-month-info-item-icon">
                                <i className="bi bi-file-earmark-bar-graph-fill"></i>
                            </div>

                            <div>
                                <strong>
                                    Attendance Report
                                </strong>

                                <span>
                                    View detailed monthly attendance
                                </span>
                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* ================= FOOTER NOTE ================= */}
            <div className="attendance-by-month-footer-note">

                <i className="bi bi-shield-check"></i>

                <span>
                    Select the required class and month, then click
                    <strong> View Attendance </strong>
                    to generate the report.
                </span>

            </div>

        </div>
    );
};

export default AttendanceByMonth;