
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    FaTrophy,
    FaCalendarAlt,
    FaPlus,
    FaArrowLeft,
    FaCheckCircle,
    FaExclamationCircle,
    FaTimes
} from "react-icons/fa";
import "./SportsAdd.css";

const SportsAdd = () => {
    const navigate = useNavigate();

    const BASE_URL =
        "http://localhost/kkblossom/api.php/Adminapi/AdminStudentSports";

    const [form, setForm] = useState({
        name: "",
        date: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    // =====================================================
    // AUTO CLOSE SUCCESS MESSAGE AND REDIRECT
    // =====================================================

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                navigate(
                    "/dashboard/StudentComponent/StudentSports"
                );
            }, 2500);

            return () => clearTimeout(timer);
        }
    }, [success, navigate]);

    // =====================================================
    // CLOSE MESSAGE
    // =====================================================

    const closeMessage = () => {
        setError("");
        setSuccess("");
    };

    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // =====================================================
    // SUBMIT FORM
    // =====================================================

    const submit = (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        axios
            .post(`${BASE_URL}/insert`, form)
            .then((res) => {
                if (res.data.status) {
                    setSuccess("Sports event added successfully");
                } else {
                    setError(
                        res.data.message || "Failed to add sports event"
                    );
                }
            })
            .catch((err) => {
                console.log(err);
                setError("Failed to add sports event");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="student-sports-add-page">

            {/* =====================================================
                PAGE HEADER
            ===================================================== */}

            <div className="student-sports-add-header">

                <div className="student-sports-add-header-left">

                    <div className="student-sports-add-header-icon">
                        <FaTrophy />
                    </div>

                    <div>
                        <h1>Add Sports Event</h1>
                        <p>
                            Create a new student sports event
                        </p>
                    </div>

                </div>

                <button
                    type="button"
                    className="student-sports-add-back-btn"
                    onClick={() =>
                        navigate(
                            "/dashboard/StudentComponent/StudentSports"
                        )
                    }
                >
                    <FaArrowLeft />
                    <span>Back</span>
                </button>

            </div>

            {/* =====================================================
                FORM CARD
            ===================================================== */}

            <div className="student-sports-add-card">

                {/* CARD HEADER */}

                <div className="student-sports-add-card-header">

                    <div>
                        <h2>Sports Event Details</h2>
                        <p>
                            Enter the details of the sports event below
                        </p>
                    </div>

                    <div className="student-sports-add-card-icon">
                        <FaTrophy />
                    </div>

                </div>

                {/* FORM */}

                <form
                    onSubmit={submit}
                    className="student-sports-add-form"
                >

                    <div className="student-sports-add-form-grid">

                        {/* NAME */}

                        <div className="student-sports-add-field">

                            <label htmlFor="sports-event-name">
                                Event Name
                                <span>*</span>
                            </label>

                            <div className="student-sports-add-input-wrap">

                                <FaTrophy />

                                <input
                                    id="sports-event-name"
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Enter sports event name"
                                    required
                                />

                            </div>

                        </div>

                        {/* DATE */}

                        <div className="student-sports-add-field">

                            <label htmlFor="sports-event-date">
                                Event Date
                                <span>*</span>
                            </label>

                            <div className="student-sports-add-input-wrap">

                                <FaCalendarAlt />

                                <input
                                    id="sports-event-date"
                                    type="date"
                                    name="date"
                                    value={form.date}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>

                    </div>

                    {/* FORM FOOTER */}

                    <div className="student-sports-add-form-footer">

                        <button
                            type="button"
                            className="student-sports-add-cancel-btn"
                            onClick={() =>
                                navigate(
                                    "/dashboard/StudentComponent/StudentSports"
                                )
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="student-sports-add-submit-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="student-sports-add-spinner"></span>
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <FaPlus />
                                    Add Event
                                </>
                            )}
                        </button>

                    </div>

                </form>

            </div>

            {/* =====================================================
                SUCCESS / ERROR POPUP
            ===================================================== */}

            {(error || success) && (
                <div className="student-sports-add-modal-overlay">

                    <div
                        className={`student-sports-add-modal-popup ${
                            success
                                ? "student-sports-add-modal-success"
                                : "student-sports-add-modal-error"
                        }`}
                        role="alertdialog"
                        aria-modal="true"
                    >

                        <button
                            type="button"
                            className="student-sports-add-modal-close"
                            onClick={closeMessage}
                            aria-label="Close message"
                        >
                            <FaTimes />
                        </button>

                        <div className="student-sports-add-modal-icon">
                            {success ? (
                                <FaCheckCircle />
                            ) : (
                                <FaExclamationCircle />
                            )}
                        </div>

                        <h2>
                            {success
                                ? "Success!"
                                : "Action Required"}
                        </h2>

                        <p>{success || error}</p>

                        {success ? (
                            <>
                                <div className="student-sports-add-modal-status">
                                    Your sports event has been added.
                                </div>

                                <div className="student-sports-add-modal-progress">
                                    <div className="student-sports-add-modal-progress-bar"></div>
                                </div>
                            </>
                        ) : (
                            <button
                                type="button"
                                className="student-sports-add-modal-ok-btn"
                                onClick={closeMessage}
                            >
                                Okay
                            </button>
                        )}

                    </div>

                </div>
            )}

        </div>
    );
};

export default SportsAdd;
