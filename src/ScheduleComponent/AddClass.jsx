
import React, { useState } from "react";
import { addClass } from "../ScheduleComponent/classApi";
import { useNavigate } from "react-router-dom";
import "./AddClass.css";

const AddClass = () => {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const className = name.trim();

        if (!className) {
            setMessage("Please enter a class name.");
            setMessageType("error");
            return;
        }

        try {
            setLoading(true);

            await addClass({ name: className });

            setMessage("Class added successfully!");
            setMessageType("success");

            setTimeout(() => {
                navigate("/dashboard/ScheduleComponent/ScheduleClass");
            }, 1800);

        } catch (error) {
            console.error("Error adding class:", error);

            setMessage(
                error.response?.data?.message ||
                "Unable to add class. Please try again."
            );
            setMessageType("error");

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ac-page">

            {/* ================= PAGE HEADER ================= */}
            <div className="ac-header">

                <div className="ac-header-left">

                    <div className="ac-header-icon">
                        <i className="bi bi-mortarboard-fill"></i>
                    </div>

                    <div>
                        <h2 className="ac-title">Add Class</h2>

                        <p className="ac-subtitle">
                            Create a new class for your school timetable
                        </p>
                    </div>

                </div>

                <button
                    type="button"
                    className="ac-back-button"
                    onClick={() =>
                        navigate("/dashboard/ScheduleComponent/ScheduleClass")
                    }
                >
                    <i className="bi bi-arrow-left"></i>
                    <span>Back to Classes</span>
                </button>

            </div>


            {/* ================= MAIN CONTENT ================= */}
            <div className="ac-content">

                <div className="ac-form-card">

                    {/* FORM TOP */}
                    <div className="ac-form-heading">

                        <div className="ac-form-heading-icon">
                            <i className="bi bi-plus-circle-fill"></i>
                        </div>

                        <div>
                            <h3>Create New Class</h3>
                            <p>Enter the class details below</p>
                        </div>

                    </div>


                    <div className="ac-divider"></div>


                    {/* FORM */}
                    <form onSubmit={handleSubmit}>

                        <div className="ac-form-group">

                            <label htmlFor="ac-class-name">
                                Class Name
                                <span className="ac-required">*</span>
                            </label>

                            <div className="ac-input-wrapper">

                                <i className="bi bi-mortarboard ac-input-icon"></i>

                                <input
                                    id="ac-class-name"
                                    type="text"
                                    className="ac-input"
                                    placeholder="e.g. Nursery, LKG, Class 1"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    maxLength={50}
                                    disabled={loading}
                                />

                            </div>

                            <small className="ac-field-hint">
                                <i className="bi bi-info-circle"></i>
                                Enter the class name you want to add.
                            </small>

                        </div>


                        {/* ACTION BUTTONS */}
                        <div className="ac-form-actions">

                            <button
                                type="button"
                                className="ac-cancel-button"
                                onClick={() =>
                                    navigate("/dashboard/ScheduleComponent/ScheduleClass")
                                }
                                disabled={loading}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="ac-submit-button"
                                disabled={loading || !name.trim()}
                            >
                                {loading ? (
                                    <>
                                        <span className="ac-spinner"></span>
                                        Adding Class...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-plus-lg"></i>
                                        Add Class
                                    </>
                                )}
                            </button>

                        </div>

                    </form>

                </div>


                {/* SIDE INFORMATION */}
                <div className="ac-info-card">

                    <div className="ac-info-icon">
                        <i className="bi bi-lightbulb-fill"></i>
                    </div>

                    <h3>Class Management</h3>

                    <p>
                        Add classes to organize your school's academic
                        timetable and manage student records efficiently.
                    </p>

                    <div className="ac-info-divider"></div>

                    <div className="ac-info-point">
                        <i className="bi bi-check-circle-fill"></i>
                        <span>Organize classes easily</span>
                    </div>

                    <div className="ac-info-point">
                        <i className="bi bi-check-circle-fill"></i>
                        <span>View student strength by class</span>
                    </div>

                    <div className="ac-info-point">
                        <i className="bi bi-check-circle-fill"></i>
                        <span>Manage class timetables</span>
                    </div>

                </div>

            </div>


            {/* ================= MESSAGE OVERLAY ================= */}
            {message && (

                <div className="ac-message-overlay">

                    <div className={`ac-message-box ac-message-${messageType}`}>

                        <div className="ac-message-icon">
                            <i
                                className={`bi ${
                                    messageType === "success"
                                        ? "bi-check-circle-fill"
                                        : "bi-exclamation-circle-fill"
                                }`}
                            ></i>
                        </div>

                        <h3>
                            {messageType === "success"
                                ? "Success!"
                                : "Unable to Continue"}
                        </h3>

                        <p>{message}</p>

                        {messageType === "error" && (
                            <button
                                type="button"
                                className="ac-message-close"
                                onClick={() => {
                                    setMessage("");
                                    setMessageType("");
                                }}
                            >
                                Okay
                            </button>
                        )}

                        {messageType === "success" && (
                            <div className="ac-success-progress">
                                <span></span>
                            </div>
                        )}

                    </div>

                </div>

            )}

        </div>
    );
};

export default AddClass;
