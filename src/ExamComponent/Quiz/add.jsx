
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Add.css";

function Add() {
    const [form, setForm] = useState({
        name: "",
        class: "",
        date: ""
    });

    // ================================
    // CLASSES FROM BACKEND
    // ================================
    const [classes, setClasses] = useState([]);
    const [loadingClasses, setLoadingClasses] = useState(true);

    const BASE_URL =
        "http://localhost/kkblossom/api.php/Adminapi/AdminExam/";

    useEffect(() => {
        axios
            .get(BASE_URL + "getClasses")
            .then((res) => {
                console.log("CLASSES RESPONSE:", res.data);

                setClasses(res.data || []);
            })
            .catch((err) => {
                console.error("Error fetching classes:", err);
            })
            .finally(() => {
                setLoadingClasses(false);
            });
    }, []);

    const submit = (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("name", form.name);
        data.append("class", form.class);
        data.append("date", form.date);

        axios
            .post(
                "http://localhost/kkblossom/api.php/Adminapi/AdminExam/quizInsert",
                data
            )
            .then(() => {
                window.location.href = "/ExamComponent/Quiz/quiz";
            });
    };

    return (
        <div className="quiz-add-page">

            {/* Page Header */}
            <div className="quiz-add-header">
                <div>
                    <h2 className="quiz-add-title">
                        Create Quiz
                    </h2>

                    <p className="quiz-add-subtitle">
                        Create a new quiz and configure its basic details
                    </p>
                </div>
            </div>

            {/* Form Card */}
            <div className="quiz-add-card">

                <div className="quiz-add-card-header">

                    <div className="quiz-add-card-icon">
                        <i className="las la-clipboard-list"></i>
                    </div>

                    <div>
                        <h3>Quiz Details</h3>

                        <p>
                            Enter the information required to create this quiz.
                        </p>
                    </div>

                </div>

                <form onSubmit={submit}>

                    <div className="quiz-add-form-grid">

                        {/* Quiz Name */}
                        <div className="quiz-add-form-group">

                            <label>
                                Quiz Name
                                <span>*</span>
                            </label>

                            <div className="quiz-add-input-wrapper">

                                <i className="las la-file-alt"></i>

                                <input
                                    type="text"
                                    value={form.name}
                                    placeholder="Enter quiz name"
                                    required
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            name: e.target.value
                                        })
                                    }
                                />

                            </div>

                        </div>

                        {/* Class */}
                        <div className="quiz-add-form-group">

                            <label>
                                Class
                                <span>*</span>
                            </label>

                            <div className="quiz-add-input-wrapper">

                                <i className="las la-graduation-cap"></i>

                                <select
                                style={{border:"none"}}
                                    value={form.class}
                                    required
                                    disabled={loadingClasses}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            class: e.target.value
                                        })
                                    }
                                >

                                    <option value="">
                                        {loadingClasses
                                            ? "Loading classes..."
                                            : "Select class"}
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

                            </div>

                        </div>

                        {/* Expiry Date */}
                        <div className="quiz-add-form-group">

                            <label>
                                Expiry Date
                                <span>*</span>
                            </label>

                            <div className="quiz-add-input-wrapper">

                                <i className="las la-calendar"></i>

                                <input
                                    type="date"
                                    value={form.date}
                                    required
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            date: e.target.value
                                        })
                                    }
                                />

                            </div>

                        </div>

                    </div>

                    {/* Form Footer */}
                    <div className="quiz-add-form-footer">

                        <button
                            type="button"
                            className="quiz-add-cancel-btn"
                            onClick={() =>
                                (window.location.href =
                                    "/ExamComponent/Quiz/quiz")
                            }
                        >
                            <i className="las la-times"></i>
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="quiz-add-submit-btn"
                        >
                            <i className="las la-plus"></i>
                            Create Quiz
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default Add;
