import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getClasses,
    getTeachers,
    insertPeriod,
} from "../ScheduleComponent/timetableApi";
import "./NewPeriod.css";

const NewPeriod = () => {
    const navigate = useNavigate();

    const [classes, setClasses] = useState([]);
    const [teachers, setTeachers] = useState([]);

    const [form, setForm] = useState({
        class: "",
        teacher: "",
        day: "Monday",
        subjectname: "",
        stime: "",
        etime: "",
    });

    const [message, setMessage] = useState("");

    /* =====================================================
       LOAD CLASSES + TEACHERS
       BACKEND LOGIC KEPT SAME
    ===================================================== */

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const c = await getClasses();
            const t = await getTeachers();

            console.log("CLASSES RESPONSE:", c);
            console.log("TEACHERS RESPONSE:", t);

            const classData = Array.isArray(c?.data)
                ? c.data
                : Array.isArray(c?.data?.data)
                ? c.data.data
                : [];

            const teacherData = Array.isArray(t?.data)
                ? t.data
                : Array.isArray(t?.data?.data)
                ? t.data.data
                : [];

            console.log("FINAL CLASSES:", classData);
            console.log("FINAL TEACHERS:", teacherData);

            setClasses(classData);
            setTeachers(teacherData);

        } catch (err) {
            console.error(
                "Error loading classes/teachers:",
                err
            );

            setClasses([]);
            setTeachers([]);

            setMessage(
                "Unable to load classes or teachers."
            );
        }
    };

    /* =====================================================
       INPUT CHANGE
    ===================================================== */

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

        setMessage("");
    };

    /* =====================================================
       SUBMIT
       BACKEND INSERT LOGIC KEPT SAME
    ===================================================== */

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !form.class ||
            !form.teacher ||
            !form.subjectname ||
            !form.stime ||
            !form.etime
        ) {
            setMessage("Please fill all fields");
            return;
        }

        if (form.etime <= form.stime) {
            setMessage(
                "End time must be later than start time."
            );
            return;
        }

        try {
            const res = await insertPeriod(form);

            console.log("INSERT RESPONSE:", res);

            if (
                res?.data?.status === true ||
                res?.data?.status === 1 ||
                res?.data?.status === "1"
            ) {
                setMessage("Added Successfully ✅");

                setTimeout(() => {
                    navigate(
                        "/dashboard/ScheduleComponent/TimeTableResult",
                        {
                            state: {
                                class: form.class,
                                day: form.day,
                            },
                        }
                    );
                }, 500);

            } else {
                setMessage(
                    res?.data?.message ||
                    "Failed to add ❌"
                );
            }

        } catch (err) {
            console.error(
                "Error inserting period:",
                err
            );

            setMessage(
                err?.response?.data?.message ||
                "Server Error"
            );
        }
    };

    return (
        <div className="np-page">

            <div className="np-container">

                {/* ================= HEADER ================= */}

                <div className="np-header">

                    <div className="np-header-icon">
                        <i className="bi bi-calendar-plus-fill"></i>
                    </div>

                    <div>
                        <h2 className="np-title">
                            Add New Period
                        </h2>

                        <p className="np-subtitle">
                            Create a new timetable period for a class
                        </p>
                    </div>

                </div>


                {/* ================= CARD ================= */}

                <div className="np-card">

                    {/* CARD HEADING */}

                    <div className="np-card-heading">

                        <div className="np-heading-icon">
                            <i className="bi bi-clock-history"></i>
                        </div>

                        <div>
                            <h3>Period Details</h3>

                            <p>
                                Enter the details for the new timetable
                                period
                            </p>
                        </div>

                    </div>


                    {/* ================= MESSAGE ================= */}

                    {message && (
                        <div
                            className={`np-message ${
                                message.includes("Successfully")
                                    ? "np-message-success"
                                    : "np-message-error"
                            }`}
                        >
                            <i
                                className={
                                    message.includes("Successfully")
                                        ? "bi bi-check-circle-fill"
                                        : "bi bi-exclamation-circle-fill"
                                }
                            ></i>

                            {message}
                        </div>
                    )}


                    <form onSubmit={handleSubmit}>

                        {/* ================= BASIC DETAILS ================= */}

                        <div className="np-section-title">

                            <span>01</span>

                            <div>
                                <h4>Basic Information</h4>
                                <p>
                                    Select the class, teacher and day
                                </p>
                            </div>

                        </div>


                        <div className="np-form-grid">

                            {/* ================= CLASS ================= */}

                            <div className="np-field">

                                <label>
                                    <i className="bi bi-mortarboard-fill"></i>
                                    Class
                                </label>

                                <div className="np-select-wrapper">

                                    <select
                                        name="class"
                                        value={form.class}
                                        onChange={handleChange}
                                        className="np-input"
                                    >
                                        <option value="">
                                            Select Class
                                        </option>

                                        {classes.map((c) => (
                                            <option
                                                key={c.id}
                                                value={c.Classname}
                                            >
                                                Class {c.Classname}
                                            </option>
                                        ))}
                                    </select>

                                    <i className="bi bi-chevron-down np-arrow"></i>

                                </div>

                            </div>


                            {/* ================= TEACHER ================= */}

                            <div className="np-field">

                                <label>
                                    <i className="bi bi-person-workspace"></i>
                                    Teacher
                                </label>

                                <div className="np-select-wrapper">

                                    <select
                                        name="teacher"
                                        value={form.teacher}
                                        onChange={handleChange}
                                        className="np-input"
                                    >
                                        <option value="">
                                            Select Teacher
                                        </option>

                                        {teachers.map((t) => (
                                            <option
                                                key={t.id}
                                                value={t.id}
                                            >
                                                {t.Teachername}
                                            </option>
                                        ))}
                                    </select>

                                    <i className="bi bi-chevron-down np-arrow"></i>

                                </div>

                            </div>


                            {/* ================= DAY ================= */}

                            <div className="np-field">

                                <label>
                                    <i className="bi bi-calendar-day-fill"></i>
                                    Day
                                </label>

                                <div className="np-select-wrapper">

                                    <select
                                        name="day"
                                        value={form.day}
                                        onChange={handleChange}
                                        className="np-input"
                                    >
                                        <option value="Monday">
                                            Monday
                                        </option>

                                        <option value="Tuesday">
                                            Tuesday
                                        </option>

                                        <option value="Wednesday">
                                            Wednesday
                                        </option>

                                        <option value="Thursday">
                                            Thursday
                                        </option>

                                        <option value="Friday">
                                            Friday
                                        </option>

                                        <option value="Saturday">
                                            Saturday
                                        </option>

                                    </select>

                                    <i className="bi bi-chevron-down np-arrow"></i>

                                </div>

                            </div>


                            {/* ================= SUBJECT ================= */}

                            <div className="np-field">

                                <label>
                                    <i className="bi bi-book-fill"></i>
                                    Subject Name
                                </label>

                                <div className="np-input-wrapper">

                                    <i className="bi bi-book np-input-icon"></i>

                                    <input
                                        type="text"
                                        name="subjectname"
                                        value={form.subjectname}
                                        onChange={handleChange}
                                        className="np-input np-text-input"
                                        placeholder="Enter subject name"
                                    />

                                </div>

                            </div>

                        </div>


                        {/* ================= TIMING ================= */}

                        <div className="np-section-title np-timing-section">

                            <span>02</span>

                            <div>
                                <h4>Period Timing</h4>
                                <p>
                                    Set the start and end time
                                </p>
                            </div>

                        </div>


                        <div className="np-time-grid">

                            {/* ================= START TIME ================= */}

                            <div className="np-field">

                                <label>
                                    <i className="bi bi-clock-fill"></i>
                                    Start Time
                                </label>

                                <div className="np-input-wrapper">

                                    <i className="bi bi-clock np-input-icon"></i>

                                    <input
                                        type="time"
                                        name="stime"
                                        value={form.stime}
                                        onChange={handleChange}
                                        className="np-input np-text-input"
                                    />

                                </div>

                            </div>


                            {/* ================= ARROW ================= */}

                            <div className="np-time-arrow">
                                <i className="bi bi-arrow-right"></i>
                            </div>


                            {/* ================= END TIME ================= */}

                            <div className="np-field">

                                <label>
                                    <i className="bi bi-clock-fill"></i>
                                    End Time
                                </label>

                                <div className="np-input-wrapper">

                                    <i className="bi bi-clock-history np-input-icon"></i>

                                    <input
                                        type="time"
                                        name="etime"
                                        value={form.etime}
                                        onChange={handleChange}
                                        className="np-input np-text-input"
                                    />

                                </div>

                            </div>

                        </div>


                        {/* ================= PREVIEW ================= */}

                        <div className="np-preview">

                            <div className="np-preview-icon">
                                <i className="bi bi-calendar-check-fill"></i>
                            </div>

                            <div className="np-preview-content">

                                <span>
                                    PERIOD PREVIEW
                                </span>

                                <strong>
                                    {form.subjectname ||
                                        "Subject Name"}
                                </strong>

                                <p>
                                    Class{" "}
                                    {form.class || "--"} •{" "}
                                    {form.day} •{" "}
                                    {form.stime || "--:--"} →{" "}
                                    {form.etime || "--:--"}
                                </p>

                            </div>

                        </div>


                        {/* ================= BUTTONS ================= */}

                        <div className="np-button-area">

                            <button
                                type="button"
                                className="np-cancel-button"
                                onClick={() => navigate(-1)}
                            >
                                <i className="bi bi-arrow-left"></i>
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="np-submit-button"
                            >
                                <i className="bi bi-plus-circle-fill"></i>

                                Add Period

                                <i className="bi bi-arrow-right np-submit-arrow"></i>
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
};

export default NewPeriod;