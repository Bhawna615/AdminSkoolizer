
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    FaTrophy,
    FaCalendarAlt,
    FaPlus,
    FaArrowLeft,
    FaCheckCircle,
    FaExclamationCircle
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

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

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

                    setTimeout(() => {
                        navigate(
                            "/dashboard/StudentComponent/StudentSports"
                        );
                    }, 1000);
                } else {
                    setError(
                        res.data.message || "Failed to add sports event"
                    );
                }
            })
            .catch(() => {
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
                ALERTS
            ===================================================== */}

            {error && (
                <div className="student-sports-add-alert student-sports-add-alert-error">
                    <FaExclamationCircle />
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="student-sports-add-alert student-sports-add-alert-success">
                    <FaCheckCircle />
                    <span>{success}</span>
                </div>
            )}


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

        </div>
    );
};

export default SportsAdd;
