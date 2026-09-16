
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAttendanceByMonth } from "../AttendanceComponent/attendanceSheetApi";
import schoolLogo from "../images/school-logo.png";
import "./AttendanceOutput.css";

const AttendanceOutput = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const query = new URLSearchParams(location.search);

    const selectedClass = query.get("class") || "";
    const month = query.get("month") || "1";

    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [absents, setAbsents] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const year = new Date().getFullYear();
    const monthNumber = Number(month);

    /* =========================================================
       MONTH NAME
    ========================================================= */

    const monthName = useMemo(() => {
        return new Date(
            year,
            monthNumber - 1,
            1
        ).toLocaleString("default", {
            month: "long",
        });
    }, [year, monthNumber]);

    /* =========================================================
       DAYS IN MONTH
    ========================================================= */

    const daysInMonth = new Date(
        year,
        monthNumber,
        0
    ).getDate();

    /* =========================================================
       LOAD ATTENDANCE DATA
    ========================================================= */

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await getAttendanceByMonth({
                    class: selectedClass,
                    month: month,
                });

                console.log(
                    "ATTENDANCE OUTPUT RESPONSE:",
                    res.data
                );

                setStudents(res.data?.students || []);
                setAttendance(res.data?.attendance || []);
                setAbsents(res.data?.absents || []);
            } catch (err) {
                console.error(
                    "Attendance output error:",
                    err
                );

                setError(
                    "Unable to load attendance report."
                );
            } finally {
                setLoading(false);
            }
        };

        if (selectedClass && month) {
            loadData();
        } else {
            setLoading(false);
            setError(
                "Invalid attendance report selection."
            );
        }
    }, [selectedClass, month]);

    /* =========================================================
       DATE HELPER
    ========================================================= */

    const getDateDay = (dateValue) => {
        if (!dateValue) {
            return null;
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return null;
        }

        return date.getDate();
    };

    /* =========================================================
       GET ATTENDANCE STATUS
    ========================================================= */

    const getStatus = (studentId, day) => {
        /* -----------------------------------------
           ABSENT / LEAVE
        ----------------------------------------- */

        const absentRecord = absents.find((row) => {
            const recordDay = getDateDay(row.Date);

            return (
                Number(recordDay) === Number(day) &&
                String(row.student_id) ===
                    String(studentId)
            );
        });

        if (absentRecord) {
            return Number(absentRecord.onLeave) === 1
                ? "L"
                : "A";
        }

        /* -----------------------------------------
           PRESENT
        ----------------------------------------- */

        const attendanceRecord = attendance.find((row) => {
            const recordDay = getDateDay(row.Date);

            const sameDay =
                Number(recordDay) === Number(day);

            if (
                row.student_id !== undefined &&
                row.student_id !== null
            ) {
                return (
                    sameDay &&
                    String(row.student_id) ===
                        String(studentId)
                );
            }

            return sameDay;
        });

        if (attendanceRecord) {
            return "P";
        }

        return "";
    };

    /* =========================================================
       SUMMARY
    ========================================================= */

    const summary = useMemo(() => {
        let present = 0;
        let absent = 0;
        let leave = 0;

        students.forEach((student) => {
            for (
                let day = 1;
                day <= daysInMonth;
                day++
            ) {
                const status = getStatus(
                    student.id,
                    day
                );

                if (status === "P") {
                    present++;
                }

                if (status === "A") {
                    absent++;
                }

                if (status === "L") {
                    leave++;
                }
            }
        });

        return {
            present,
            absent,
            leave,
        };
    }, [
        students,
        attendance,
        absents,
        daysInMonth,
    ]);

    /* =========================================================
       BACK
    ========================================================= */

    const handleBack = () => {
        navigate(
            "/dashboard/AttendanceComponent/AttendanceByMonth"
        );
    };

    /* =========================================================
       PRINT REPORT
       IMPORTANT:
       Opens a completely separate browser window.
       This avoids Dashboard CSS/layout affecting printing.
    ========================================================= */

    const handlePrint = () => {
        const printWindow = window.open(
            "",
            "_blank",
            "width=1400,height=900"
        );

        if (!printWindow) {
            alert(
                "Please allow pop-ups in your browser to print the report."
            );
            return;
        }

        const logoUrl = new URL(
            schoolLogo,
            window.location.href
        ).href;

        /* -----------------------------------------
           BUILD TABLE HEADER
        ----------------------------------------- */

        const tableHeaders = Array.from(
            { length: daysInMonth },
            (_, index) => {
                const day = index + 1;

                const date = new Date(
                    year,
                    monthNumber - 1,
                    day
                );

                const weekday =
                    date.toLocaleDateString(
                        "en-US",
                        {
                            weekday: "short",
                        }
                    );

                return `
                    <th class="print-day-header">
                        <span>${day}</span>
                        <small>${weekday}</small>
                    </th>
                `;
            }
        ).join("");

        /* -----------------------------------------
           BUILD STUDENT ROWS
        ----------------------------------------- */

        const tableRows = students.length
            ? students
                  .map((student, studentIndex) => {
                      const dayCells = Array.from(
                          {
                              length: daysInMonth,
                          },
                          (_, index) => {
                              const day = index + 1;

                              const status =
                                  getStatus(
                                      student.id,
                                      day
                                  );

                              let statusClass = "";

                              if (status === "P") {
                                  statusClass =
                                      "print-status-present";
                              }

                              if (status === "A") {
                                  statusClass =
                                      "print-status-absent";
                              }

                              if (status === "L") {
                                  statusClass =
                                      "print-status-leave";
                              }

                              return `
                                <td class="print-day-cell ${statusClass}">
                                    ${
                                        status
                                            ? `<span class="print-status-mark">${status}</span>`
                                            : ""
                                    }
                                </td>
                              `;
                          }
                      ).join("");

                      return `
                        <tr>
                            <td class="print-roll-cell">
                                ${
                                    student.Rollno ??
                                    studentIndex + 1
                                }
                            </td>

                            <td class="print-name-cell">
                                ${student.Name || ""}
                            </td>

                            ${dayCells}
                        </tr>
                      `;
                  })
                  .join("")
            : `
                <tr>
                    <td
                        colspan="${daysInMonth + 2}"
                        class="print-empty-cell"
                    >
                        No attendance records found.
                    </td>
                </tr>
            `;

        /* -----------------------------------------
           COMPLETE PRINT HTML
        ----------------------------------------- */

        const printHTML = `
<!DOCTYPE html>

<html>

<head>

    <meta charset="UTF-8" />

    <title>
        Attendance Report - ${selectedClass} - ${monthName} ${year}
    </title>

    <style>

        * {
            box-sizing: border-box;
        }

        html,
        body {
            margin: 0;
            padding: 0;
            width: 100%;
            background: #ffffff;
            font-family: Arial, Helvetica, sans-serif;
            color: #222222;
        }

        body {
            padding: 8mm;
        }

        .print-report {
            width: 100%;
        }

        /* =========================================
           SCHOOL HEADER
        ========================================= */

        .print-school-header {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 18px;
            text-align: center;
            padding-bottom: 10px;
        }

        .print-logo-wrapper {
            width: 75px;
            height: 75px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .print-logo {
            width: 70px;
            height: 70px;
            object-fit: contain;
        }

        .print-school-info h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: 1px;
        }

        .print-school-info p {
            margin: 4px 0;
            font-size: 13px;
            font-weight: 600;
        }

        .print-school-info span {
            font-size: 12px;
            color: #666666;
        }

        .print-header-line {
            height: 3px;
            background: #6f42c1;
            margin: 4px 0 12px;
        }

        /* =========================================
           TITLE
        ========================================= */

        .print-title-section {
            text-align: center;
            margin-bottom: 12px;
        }

        .print-title-section h2 {
            margin: 0;
            font-size: 18px;
            font-weight: 800;
            letter-spacing: 1px;
        }

        .print-title-section p {
            margin: 4px 0 0;
            font-size: 11px;
            color: #666666;
        }

        /* =========================================
           DETAILS
        ========================================= */

        .print-details {
            display: grid;
            grid-template-columns:
                repeat(4, 1fr);
            gap: 7px;
            margin-bottom: 10px;
        }

        .print-detail-box {
            border: 1px solid #d5d5d5;
            border-radius: 4px;
            padding: 6px 8px;
            background: #fafafa;
        }

        .print-detail-box span {
            display: block;
            font-size: 8px;
            font-weight: 700;
            color: #777777;
            letter-spacing: 0.6px;
            margin-bottom: 3px;
        }

        .print-detail-box strong {
            font-size: 11px;
            font-weight: 700;
        }

        /* =========================================
           LEGEND
        ========================================= */

        .print-legend {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 15px;
            margin-bottom: 7px;
            font-size: 9px;
        }

        .print-legend-item {
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .print-legend-status {
            width: 17px;
            height: 17px;
            border: 1px solid #999999;
            border-radius: 3px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 8px;
            font-weight: 800;
        }

        .print-present {
            background: #e8f5e9;
            color: #166534;
        }

        .print-absent {
            background: #ffebee;
            color: #b91c1c;
        }

        .print-leave {
            background: #fff8e1;
            color: #92400e;
        }

        /* =========================================
           TABLE
        ========================================= */

        .print-table-wrapper {
            width: 100%;
            overflow: visible;
        }

        .print-table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }

        .print-table th,
        .print-table td {
            border: 1px solid #777777;
            padding: 0;
            text-align: center;
            vertical-align: middle;
        }

        .print-table thead {
            display: table-header-group;
        }

        .print-table tr {
            page-break-inside: avoid;
            break-inside: avoid;
        }

        .print-roll-header {
            width: 48px;
            font-size: 8px;
            background: #eeeeee;
        }

        .print-name-header {
            width: 145px;
            font-size: 8px;
            background: #eeeeee;
        }

        .print-day-header {
            height: 32px;
            background: #eeeeee;
            font-size: 8px;
            font-weight: 800;
        }

        .print-day-header span {
            display: block;
            font-size: 9px;
            font-weight: 800;
        }

        .print-day-header small {
            display: block;
            margin-top: 1px;
            font-size: 6px;
            color: #666666;
            font-weight: 600;
        }

        .print-roll-cell {
            width: 48px;
            height: 24px;
            font-size: 8px;
            font-weight: 700;
        }

        .print-name-cell {
            width: 145px;
            padding: 0 5px !important;
            text-align: left !important;
            font-size: 8px;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
        }

        .print-day-cell {
            height: 24px;
            font-size: 8px;
        }

        .print-status-mark {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            font-size: 7px;
            font-weight: 800;
        }

        .print-status-present {
            background: #e8f5e9;
        }

        .print-status-present .print-status-mark {
            background: #2e7d32;
            color: #ffffff;
        }

        .print-status-absent {
            background: #ffebee;
        }

        .print-status-absent .print-status-mark {
            background: #c62828;
            color: #ffffff;
        }

        .print-status-leave {
            background: #fff8e1;
        }

        .print-status-leave .print-status-mark {
            background: #f9a825;
            color: #ffffff;
        }

        .print-empty-cell {
            height: 80px;
            font-size: 11px;
            color: #777777;
        }

        /* =========================================
           SUMMARY
        ========================================= */

        .print-summary {
            display: grid;
            grid-template-columns:
                repeat(4, 1fr);
            gap: 8px;
            margin-top: 12px;
        }

        .print-summary-card {
            border: 1px solid #d5d5d5;
            border-radius: 4px;
            padding: 6px 9px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #fafafa;
        }

        .print-summary-card span {
            font-size: 8px;
            color: #666666;
            font-weight: 600;
        }

        .print-summary-card strong {
            font-size: 13px;
            font-weight: 800;
        }

        /* =========================================
           FOOTER
        ========================================= */

        .print-footer {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            border-top: 1px solid #bbbbbb;
            margin-top: 12px;
            padding-top: 7px;
            font-size: 8px;
        }

        .print-footer-left strong {
            display: block;
            font-size: 9px;
        }

        .print-footer-left span {
            display: block;
            margin-top: 2px;
            color: #666666;
        }

        .print-footer-right {
            text-align: right;
        }

        .print-footer-right span {
            display: block;
            color: #777777;
        }

        .print-footer-right strong {
            display: block;
            margin-top: 2px;
        }

        /* =========================================
           PRINT SETTINGS
        ========================================= */

        @page {
            size: A4 landscape;
            margin: 6mm;
        }

        @media print {

            html,
            body {
                width: 100%;
                min-height: 0;
                margin: 0;
                padding: 0;
                background: #ffffff;
            }

            body {
                padding: 0;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .print-report {
                width: 100%;
            }

        }

    </style>

</head>

<body>

    <div class="print-report">

        <!-- SCHOOL HEADER -->

        <div class="print-school-header">

            <div class="print-logo-wrapper">

                <img
                    src="${logoUrl}"
                    class="print-logo"
                    alt="KK Blossoms School Logo"
                />

            </div>

            <div class="print-school-info">

                <h1>
                    KK BLOSSOMS SCHOOL
                </h1>

                <p>
                    Rabaun, Solan (H.P)
                </p>

                <span>
                    Monthly Attendance Report
                </span>

            </div>

        </div>


        <div class="print-header-line"></div>


        <!-- TITLE -->

        <div class="print-title-section">

            <h2>
                ATTENDANCE SHEET
            </h2>

            <p>
                Monthly Student Attendance Register
            </p>

        </div>


        <!-- DETAILS -->

        <div class="print-details">

            <div class="print-detail-box">
                <span>CLASS</span>
                <strong>${selectedClass}</strong>
            </div>

            <div class="print-detail-box">
                <span>MONTH</span>
                <strong>${monthName}</strong>
            </div>

            <div class="print-detail-box">
                <span>YEAR</span>
                <strong>${year}</strong>
            </div>

            <div class="print-detail-box">
                <span>TOTAL STUDENTS</span>
                <strong>${students.length}</strong>
            </div>

        </div>


        <!-- LEGEND -->

        <div class="print-legend">

            <div class="print-legend-item">
                <span class="print-legend-status print-present">
                    P
                </span>
                Present
            </div>

            <div class="print-legend-item">
                <span class="print-legend-status print-absent">
                    A
                </span>
                Absent
            </div>

            <div class="print-legend-item">
                <span class="print-legend-status print-leave">
                    L
                </span>
                Leave
            </div>

        </div>


        <!-- TABLE -->

        <div class="print-table-wrapper">

            <table class="print-table">

                <thead>

                    <tr>

                        <th class="print-roll-header">
                            Roll No.
                        </th>

                        <th class="print-name-header">
                            Student Name
                        </th>

                        ${tableHeaders}

                    </tr>

                </thead>

                <tbody>

                    ${tableRows}

                </tbody>

            </table>

        </div>


        <!-- SUMMARY -->

        <div class="print-summary">

            <div class="print-summary-card">
                <span>Total Students</span>
                <strong>${students.length}</strong>
            </div>

            <div class="print-summary-card">
                <span>Present</span>
                <strong>${summary.present}</strong>
            </div>

            <div class="print-summary-card">
                <span>Absent</span>
                <strong>${summary.absent}</strong>
            </div>

            <div class="print-summary-card">
                <span>On Leave</span>
                <strong>${summary.leave}</strong>
            </div>

        </div>


        <!-- FOOTER -->

        <div class="print-footer">

            <div class="print-footer-left">

                <strong>
                    KK BLOSSOMS SCHOOL
                </strong>

                <span>
                    Rabaun, Solan (H.P)
                </span>

            </div>

            <div class="print-footer-right">

                <span>
                    Generated on
                </span>

                <strong>
                    ${new Date().toLocaleDateString("en-IN")}
                </strong>

            </div>

        </div>

    </div>


    <script>

        window.onload = function () {

            const images =
                document.images;

            if (images.length === 0) {

                setTimeout(function () {
                    window.print();
                }, 500);

                return;
            }

            let loaded = 0;

            const printWhenReady = function () {

                loaded++;

                if (loaded >= images.length) {

                    setTimeout(function () {
                        window.print();
                    }, 500);

                }

            };

            Array.from(images).forEach(function (img) {

                if (img.complete) {

                    printWhenReady();

                } else {

                    img.onload =
                        printWhenReady;

                    img.onerror =
                        printWhenReady;

                }

            });

        };


        window.onafterprint = function () {

            setTimeout(function () {

                window.close();

            }, 300);

        };

    </script>

</body>

</html>
`;

        printWindow.document.open();
        printWindow.document.write(printHTML);
        printWindow.document.close();
    };

    /* =========================================================
       LOADING
    ========================================================= */

    if (loading) {
        return (
            <div className="attendance-output-loading-page">

                <div className="attendance-output-loading-card">

                    <div className="attendance-output-loading-icon">
                        <i className="bi bi-calendar3"></i>
                    </div>

                    <div className="attendance-output-spinner"></div>

                    <h3>
                        Preparing Attendance Report
                    </h3>

                    <p>
                        Please wait while the monthly
                        attendance sheet is being prepared.
                    </p>

                </div>

            </div>
        );
    }

    /* =========================================================
       ERROR
    ========================================================= */

    if (error) {
        return (
            <div className="attendance-output-error-page">

                <div className="attendance-output-error-card">

                    <div className="attendance-output-error-icon">
                        <i className="bi bi-exclamation-triangle-fill"></i>
                    </div>

                    <h3>
                        Attendance Report Error
                    </h3>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        className="attendance-output-back-btn"
                        onClick={handleBack}
                    >
                        <i className="bi bi-arrow-left"></i>
                        Back
                    </button>

                </div>

            </div>
        );
    }

    /* =========================================================
       MAIN REPORT
    ========================================================= */

    return (
        <div className="attendance-output-page">

            {/* TOOLBAR */}

            <div className="attendance-output-toolbar">

                <button
                    type="button"
                    className="attendance-output-toolbar-btn attendance-output-back-action"
                    onClick={handleBack}
                >
                    <i className="bi bi-arrow-left"></i>
                    Back
                </button>

                <button
                    type="button"
                    className="attendance-output-toolbar-btn attendance-output-print-action"
                    onClick={handlePrint}
                >
                    <i className="bi bi-printer-fill"></i>
                    Print Report
                </button>

            </div>


            {/* REPORT PAPER */}

            <div className="attendance-output-paper">

                {/* SCHOOL HEADER */}

                <div className="attendance-output-school-header">

                    <div className="attendance-output-logo-wrapper">

                        <img
                            src={schoolLogo}
                            alt="KK Blossoms School Logo"
                            className="attendance-output-school-logo"
                        />

                    </div>

                    <div className="attendance-output-school-info">

                        <h1>
                            KK BLOSSOMS SCHOOL
                        </h1>

                        <p>
                            Rabaun, Solan (H.P)
                        </p>

                        <span>
                            Monthly Attendance Report
                        </span>

                    </div>

                </div>


                <div className="attendance-output-header-line"></div>


                {/* TITLE */}

                <div className="attendance-output-title-section">

                    <h2>
                        ATTENDANCE SHEET
                    </h2>

                    <p>
                        Monthly Student Attendance Register
                    </p>

                </div>


                {/* DETAILS */}

                <div className="attendance-output-details">

                    <div className="attendance-output-detail-box">

                        <span>
                            CLASS
                        </span>

                        <strong>
                            {selectedClass}
                        </strong>

                    </div>

                    <div className="attendance-output-detail-box">

                        <span>
                            MONTH
                        </span>

                        <strong>
                            {monthName}
                        </strong>

                    </div>

                    <div className="attendance-output-detail-box">

                        <span>
                            YEAR
                        </span>

                        <strong>
                            {year}
                        </strong>

                    </div>

                    <div className="attendance-output-detail-box">

                        <span>
                            TOTAL STUDENTS
                        </span>

                        <strong>
                            {students.length}
                        </strong>

                    </div>

                </div>


                {/* LEGEND */}

                <div className="attendance-output-legend">

                    <div className="attendance-output-legend-item">

                        <span className="attendance-output-status attendance-output-status-present">
                            P
                        </span>

                        Present

                    </div>

                    <div className="attendance-output-legend-item">

                        <span className="attendance-output-status attendance-output-status-absent">
                            A
                        </span>

                        Absent

                    </div>

                    <div className="attendance-output-legend-item">

                        <span className="attendance-output-status attendance-output-status-leave">
                            L
                        </span>

                        Leave

                    </div>

                </div>


                {/* ATTENDANCE TABLE */}

                <div className="attendance-output-table-wrapper">

                    <table className="attendance-output-table">

                        <thead>

                            <tr>

                                <th className="attendance-output-roll-header">
                                    Roll No.
                                </th>

                                <th className="attendance-output-name-header">
                                    Student Name
                                </th>

                                {Array.from(
                                    {
                                        length: daysInMonth,
                                    },
                                    (_, index) => {

                                        const day =
                                            index + 1;

                                        const date =
                                            new Date(
                                                year,
                                                monthNumber - 1,
                                                day
                                            );

                                        const weekday =
                                            date.toLocaleDateString(
                                                "en-US",
                                                {
                                                    weekday:
                                                        "short",
                                                }
                                            );

                                        return (
                                            <th
                                                key={day}
                                                className="attendance-output-day-header"
                                            >
                                                <span>
                                                    {day}
                                                </span>

                                                <small>
                                                    {weekday}
                                                </small>
                                            </th>
                                        );
                                    }
                                )}

                            </tr>

                        </thead>

                        <tbody>

                            {students.length > 0 ? (

                                students.map(
                                    (
                                        student,
                                        studentIndex
                                    ) => (

                                        <tr
                                            key={
                                                student.id ||
                                                studentIndex
                                            }
                                        >

                                            <td className="attendance-output-roll-cell">
                                                {student.Rollno}
                                            </td>

                                            <td className="attendance-output-name-cell">
                                                {student.Name}
                                            </td>

                                            {Array.from(
                                                {
                                                    length:
                                                        daysInMonth,
                                                },
                                                (_, index) => {

                                                    const day =
                                                        index + 1;

                                                    const status =
                                                        getStatus(
                                                            student.id,
                                                            day
                                                        );

                                                    let statusClass =
                                                        "";

                                                    if (
                                                        status ===
                                                        "P"
                                                    ) {
                                                        statusClass =
                                                            "attendance-output-cell-present";
                                                    }

                                                    if (
                                                        status ===
                                                        "A"
                                                    ) {
                                                        statusClass =
                                                            "attendance-output-cell-absent";
                                                    }

                                                    if (
                                                        status ===
                                                        "L"
                                                    ) {
                                                        statusClass =
                                                            "attendance-output-cell-leave";
                                                    }

                                                    return (
                                                        <td
                                                            key={day}
                                                            className={`attendance-output-day-cell ${statusClass}`}
                                                        >

                                                            {status && (

                                                                <span className="attendance-output-cell-mark">
                                                                    {
                                                                        status
                                                                    }
                                                                </span>

                                                            )}

                                                        </td>
                                                    );
                                                }
                                            )}

                                        </tr>

                                    )
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan={
                                            daysInMonth + 2
                                        }
                                        className="attendance-output-empty-cell"
                                    >

                                        <i className="bi bi-people"></i>

                                        No attendance records
                                        found.

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>


                {/* SUMMARY */}

                <div className="attendance-output-summary">

                    <div className="attendance-output-summary-card">

                        <span className="attendance-output-summary-icon attendance-output-summary-total-icon">
                            <i className="bi bi-people-fill"></i>
                        </span>

                        <div>

                            <small>
                                Total Students
                            </small>

                            <strong>
                                {students.length}
                            </strong>

                        </div>

                    </div>

                    <div className="attendance-output-summary-card">

                        <span className="attendance-output-summary-icon attendance-output-summary-present-icon">
                            <i className="bi bi-check-circle-fill"></i>
                        </span>

                        <div>

                            <small>
                                Present
                            </small>

                            <strong>
                                {summary.present}
                            </strong>

                        </div>

                    </div>

                    <div className="attendance-output-summary-card">

                        <span className="attendance-output-summary-icon attendance-output-summary-absent-icon">
                            <i className="bi bi-x-circle-fill"></i>
                        </span>

                        <div>

                            <small>
                                Absent
                            </small>

                            <strong>
                                {summary.absent}
                            </strong>

                        </div>

                    </div>

                    <div className="attendance-output-summary-card">

                        <span className="attendance-output-summary-icon attendance-output-summary-leave-icon">
                            <i className="bi bi-calendar-minus-fill"></i>
                        </span>

                        <div>

                            <small>
                                On Leave
                            </small>

                            <strong>
                                {summary.leave}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* FOOTER */}

                <div className="attendance-output-footer">

                    <div className="attendance-output-footer-left">

                        <strong>
                            KK BLOSSOMS SCHOOL
                        </strong>

                        <span>
                            Rabaun, Solan (H.P)
                        </span>

                    </div>

                    <div className="attendance-output-footer-right">

                        <span>
                            Generated on
                        </span>

                        <strong>
                            {new Date().toLocaleDateString(
                                "en-IN"
                            )}
                        </strong>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default AttendanceOutput;