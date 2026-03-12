import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import "./Attendance.css";
import { editAttendance } from "../AttendanceComponent/attendanceApi";

import {
    getAttendance,
    filterAttendance,
    getClasses,
    getDetails
} from "../AttendanceComponent/attendanceApi";

import { useLocation, useNavigate } from "react-router-dom";

export default function ViewAttendance() {

    const [attendance, setAttendance] = useState([]);
    const [classes, setClasses] = useState([]);

    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(1);
    const [className, setClassName] = useState("");

    const [filterEnabled, setFilterEnabled] = useState(false);
    const [message, setMessage] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    // ================= FLASH MESSAGE =================
    useEffect(() => {
        if (location.state?.message) {
            setMessage(location.state.message);
            setTimeout(() => setMessage(""), 3000);
        }
    }, [location.state]);

    // ================= INITIAL LOAD =================
    useEffect(() => {
        loadAttendance();
        loadClasses();
    }, []);

    const loadAttendance = async () => {
        const res = await getAttendance();
        setAttendance(res.data || []);
    };

    const loadClasses = async () => {
        const res = await getClasses();
        setClasses(res.data || []);
    };

    // ================= FILTER =================
    useEffect(() => {

        if (!filterEnabled) {
            loadAttendance();
            return;
        }

        if (!className) return;

        filterAttendance(year, month, className)
            .then(res => setAttendance(res.data || []))
            .catch(console.log);

    }, [year, month, className, filterEnabled]);

    // ================= ACTIONS =================
    const viewDetails = async (row) => {

        try {

            const res = await getDetails({
                class: row.Class,
                date: row.Date
            });

            // NEW PAGE OPEN
            navigate("/dashboard/AttendanceComponent/AttendanceDetails", {
                state: {
                    students: res.data.students,
                    details: res.data.details,
                    className: row.Class,
                    date: row.Date
                }
            });

        } catch (err) {
            console.log(err);
        }
    };

    const remarkAttendance = async (row) => {

        const confirmDelete = window.confirm(
            "Already marked attendance will be removed. Continue?"
        );

        if (!confirmDelete) return;

        try {

            const res = await editAttendance({
                class: row.Class,
                date: row.Date
            });

            // OPEN EDIT PAGE (React)
            navigate("/dashboard/AttendanceComponent/EditAttendance", {
                state: {
                    students: res.data.students,
                    absentees: res.data.absentees,
                    className: res.data.class,
                    date: res.data.date
                }
            });

        } catch (err) {
            console.log(err);
        }
    };

    // ================= TABLE COLUMNS =================
    const columns = [
        {
            name: "Date",
            selector: row => row.Date,
            sortable: true
        },
        {
            name: "Class",
            selector: row => row.Class,
            sortable: true
        },
        {
            name: "Absent",
            selector: row => row.Absent
        },
        {
            name: "On Leave",
            selector: row => row.onLeave
        },
        {
            name: "Present",
            selector: row => row.Present
        },
        {
            name: "Strength",
            selector: row => row.Strength
        },
        {
            name: "Actions",
            cell: row => (
                <>
                    <button
                        className="dt-action-btn"
                        onClick={() => viewDetails(row)}
                    >
                        👁
                    </button>

                    <button
                        className="dt-action-btn"
                        onClick={() => remarkAttendance(row)}
                    >
                        🔁
                    </button>
                </>
            )
        }
    ];

    // ================= UI =================
    return (
        <div className="col-md-12 innerview">

            {/* SUCCESS MESSAGE */}
            {message && (
                <div className="success-bar">
                    ✔ {message}
                </div>
            )}

            {/* FILTER BAR */}
            <div className="filter-bar">

                <p>
                    <input
                        type="checkbox"
                        checked={filterEnabled}
                        onChange={() => setFilterEnabled(!filterEnabled)}
                    />
                    Enable Filter
                </p>

                {/* YEAR */}
                <select
                    value={year}
                    onChange={e => setYear(Number(e.target.value))}
                >
                    <option>{new Date().getFullYear()}</option>
                    <option>{new Date().getFullYear() - 1}</option>
                    <option>{new Date().getFullYear() - 2}</option>
                </select>

                {/* MONTH */}
                <select
                    value={month}
                    onChange={e => setMonth(Number(e.target.value))}
                >
                    {[...Array(12)].map((_, i) => (
                        <option key={i} value={i + 1}>
                            {i + 1}
                        </option>
                    ))}
                </select>

                {/* CLASS */}
                <select
                    value={className}
                    onChange={e => setClassName(e.target.value)}
                >
                    <option value="">Select Class</option>

                    {classes.map((c, i) => (
                        <option key={i} value={c.Classname}>
                            {c.Classname}
                        </option>
                    ))}
                </select>

            </div>

            {/* ✅ CLEAN REACT DATATABLE */}
            <DataTable
                columns={columns}
                data={attendance}
                pagination
                highlightOnHover
                striped
                responsive
                defaultSortFieldId={1}
            />

        </div>
    );
}