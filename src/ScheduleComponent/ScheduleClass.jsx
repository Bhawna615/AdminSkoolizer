
import React, { useEffect, useState } from "react";
import { getClasses, deleteClass } from "../ScheduleComponent/classApi";
import { useNavigate } from "react-router-dom";
import "./Scheduleclass.css";

const ScheduleClass = () => {
    const [openMenu, setOpenMenu] = useState(null);
    const [classes, setClasses] = useState([]);
    const [strength, setStrength] = useState({});
    const navigate = useNavigate();

    const loadClasses = async () => {
        try {
            const res = await getClasses();

            setClasses(res.data.classes);
            setStrength(res.data.strength);
        } catch (error) {
            console.error("Error loading classes:", error);
            setClasses([]);
            setStrength({});
        }
    };

    useEffect(() => {
        loadClasses();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure ?")) {
            try {
                await deleteClass(id);
                setOpenMenu(null);
                loadClasses();
            } catch (error) {
                console.error("Error deleting class:", error);
            }
        }
    };

    return (
        <div className="sc-page">

            {/* ================= HEADER ================= */}
            <div className="sc-header">

                <div className="sc-header-left">

                    <div className="sc-header-icon">
                        <i className="bi bi-mortarboard-fill"></i>
                    </div>

                    <div>
                        <h2 className="sc-title">
                            Classes
                        </h2>

                        <p className="sc-subtitle">
                            Manage classes and view student strength
                        </p>
                    </div>

                </div>

                <button
                    type="button"
                    className="sc-add-button"
                    onClick={() =>
                        navigate(
                            "/dashboard/ScheduleComponent/AddClass"
                        )
                    }
                >
                    <i className="bi bi-plus-lg"></i>
                    <span>Add Class</span>
                </button>

            </div>


            {/* ================= SUMMARY ================= */}
            <div className="sc-summary">

                <div className="sc-summary-card">

                    <div className="sc-summary-icon">
                        <i className="bi bi-grid-3x3-gap-fill"></i>
                    </div>

                    <div>
                        <span>Total Classes</span>

                        <strong>
                            {classes.length}
                        </strong>
                    </div>

                </div>


                <div className="sc-summary-card">

                    <div className="sc-summary-icon">
                        <i className="bi bi-people-fill"></i>
                    </div>

                    <div>
                        <span>Total Students</span>

                        <strong>
                            {Object.values(strength).reduce(
                                (total, value) =>
                                    total + Number(value || 0),
                                0
                            )}
                        </strong>
                    </div>

                </div>

            </div>


            {/* ================= CLASS CARDS ================= */}
            <div className="sc-container">

                {classes.length > 0 ? (

                    classes.map((row, index) => (

                        <div
                            className="sc-class-card"
                            key={row.id}
                        >

                            <div className="sc-card-accent"></div>

                            <div className="sc-card-content">

                                {/* CARD TOP */}
                                <div className="sc-card-top">

                                    <div className="sc-class-number">
                                        {String(index + 1).padStart(2, "0")}
                                    </div>

                                    <div className="sc-menu-wrapper">

                                        <button
                                            type="button"
                                            className="sc-menu-button"
                                            onClick={() =>
                                                setOpenMenu(
                                                    openMenu === row.id
                                                        ? null
                                                        : row.id
                                                )
                                            }
                                        >
                                            <i className="bi bi-three-dots-vertical"></i>
                                        </button>


                                        {openMenu === row.id && (

                                            <div className="sc-dropdown-menu">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(row.id)
                                                    }
                                                >
                                                    <i className="bi bi-trash3-fill"></i>
                                                    Delete Class
                                                </button>

                                            </div>

                                        )}

                                    </div>

                                </div>


                                {/* CLASS INFORMATION */}
                                <div
                                    className="sc-class-main"
                                    onClick={() =>
                                        navigate(
                                            `/dashboard/ScheduleComponent/ViewByClassName/${row.Classname}`
                                        )
                                    }
                                >

                                    <div className="sc-class-icon">
                                        <i className="bi bi-mortarboard-fill"></i>
                                    </div>

                                    <div>

                                        <span className="sc-class-label">
                                            CLASS
                                        </span>

                                        <h3>
                                            {row.Classname}
                                        </h3>

                                    </div>

                                </div>


                                <div className="sc-card-divider"></div>


                                {/* STRENGTH */}
                                <div className="sc-strength">

                                    <div className="sc-strength-left">

                                        <div className="sc-strength-icon">
                                            <i className="bi bi-people-fill"></i>
                                        </div>

                                        <div>

                                            <span>
                                                Student Strength
                                            </span>

                                            <small>
                                                Currently enrolled
                                            </small>

                                        </div>

                                    </div>


                                    <strong>
                                        {strength[row.Classname] || 0}
                                    </strong>

                                </div>


                                {/* VIEW BUTTON */}
                                <button
                                    type="button"
                                    className="sc-view-button"
                                    onClick={() =>
                                        navigate(
                                            `/dashboard/ScheduleComponent/ViewByClassName/${row.Classname}`
                                        )
                                    }
                                >
                                    <span>
                                        View Timetable
                                    </span>

                                    <i className="bi bi-arrow-right"></i>
                                </button>

                            </div>

                        </div>

                    ))

                ) : (

                    /* ================= EMPTY STATE ================= */
                    <div className="sc-empty">

                        <div className="sc-empty-icon">
                            <i className="bi bi-mortarboard"></i>
                        </div>

                        <h3>
                            No Classes Found
                        </h3>

                        <p>
                            Start by adding your first class to the timetable.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/dashboard/ScheduleComponent/AddClass"
                                )
                            }
                        >
                            <i className="bi bi-plus-lg"></i>
                            <span>Add First Class</span>
                        </button>

                    </div>

                )}

            </div>


            {/* ================= MOBILE FLOATING BUTTON ================= */}
            <button
                type="button"
                className="sc-float-button"
                onClick={() =>
                    navigate(
                        "/dashboard/ScheduleComponent/AddClass"
                    )
                }
            >
                <i className="bi bi-plus-lg"></i>
            </button>

        </div>
    );
};

export default ScheduleClass;
