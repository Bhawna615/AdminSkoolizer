import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./SportsEdit.css";

const SportsEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const BASE_URL = "http://localhost/kkblossom/api.php/Adminapi/AdminStudentSports";

    const [form, setForm] = useState({
        name: "",
        date: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ===== Load existing event =====
    useEffect(() => {
        axios.get(`${BASE_URL}/one/${id}`)
            .then(res => {
                if (res.data) {
                    setForm({
                        name: res.data.name || "",
                        date: res.data.date || ""
                    });
                } else {
                    setError("Event not found");
                }
            })
            .catch(() => setError("Failed to load event"));
    }, [id]);

    // ===== Handle Input Change =====
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // ===== Submit Update =====
    const submit = (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        axios.post(`${BASE_URL}/update`, { id, ...form })
            .then(res => {
                if (res.data.status) {
                    setSuccess("Event Updated Successfully");
                    setTimeout(() => navigate("/dashboard/StudentComponent/StudentSports"), 1000);
                } else {
                    setError(res.data.message || "Failed to update event");
                }
            })
            .catch(() => setError("Failed to update event"));
    };

   return (
    <div className="sports-edit-wrapper">

        <div className="sports-edit-container">

            {/* Header */}
            <div className="sports-edit-topbar">
                <div>
                    <h2>
                        <i className="las la-trophy"></i>
                        Edit Sports Event
                    </h2>
                    <p>Update sports event details and save your changes.</p>
                </div>

                <div className="sports-edit-icon">
                    <i className="las la-football-ball"></i>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="sports-edit-error">
                    <i className="las la-exclamation-circle"></i>
                    <span>{error}</span>
                </div>
            )}

            {/* Success Message */}
            {success && (
                <div className="sports-edit-success">
                    <i className="las la-check-circle"></i>
                    <span>{success}</span>
                </div>
            )}

            {/* Form */}
            <form onSubmit={submit} className="sports-edit-form">

                <div className="sports-edit-grid">

                    {/* Event Name */}
                    <div className="sports-edit-field">
                        <label>
                            <i className="las la-running"></i>
                            Event Name
                        </label>

                        <input
                            type="text"
                            className="sports-edit-input"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter event name"
                            required
                        />
                    </div>

                    {/* Event Date */}
                    <div className="sports-edit-field">
                        <label>
                            <i className="las la-calendar"></i>
                            Event Date
                        </label>

                        <input
                            type="date"
                            className="sports-edit-input"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                </div>

                {/* Buttons */}
                <div className="sports-edit-actions">

                    <button
                        type="button"
                        className="sports-edit-cancel"
                        onClick={() =>
                            navigate(
                                "/dashboard/StudentComponent/StudentSports"
                            )
                        }
                    >
                        <i className="las la-times"></i>
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="sports-edit-save"
                    >
                        <i className="las la-save"></i>
                        Save Changes
                    </button>

                </div>

            </form>

        </div>

    </div>
);
};

export default SportsEdit;
