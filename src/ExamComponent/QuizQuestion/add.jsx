
import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./Add.css";

import {
  FaClipboardList,
  FaPlus,
  FaSave,
  FaArrowLeft,
  FaQuestionCircle,
  FaListUl,
  FaCheckCircle,
} from "react-icons/fa";

function Add() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    question: "",
    options: "",
    correct_option: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  const submit = (e) => {
    e.preventDefault();

    if (!form.question.trim()) {
      alert("Please enter the question.");
      return;
    }

    if (!form.options.trim()) {
      alert("Please enter the options.");
      return;
    }

    if (!form.correct_option.trim()) {
      alert("Please enter the correct option.");
      return;
    }

    setLoading(true);

    axios
      .post(
        "http://localhost/kkblossom/api.php/Adminapi/AdminExam/quizQuestionInsert",
        {
          ...form,
          quiz_id: quizId,
        }
      )
      .then((res) => {
        console.log("ADD QUESTION RESPONSE:", res.data);

        window.location.href = `/Dashboard/ExamComponent/QuizQuestion/view/${quizId}`;
      })
      .catch((err) => {
        console.error("Error adding question:", err);
        alert("Failed to add question.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="add-question-page">

      {/* PAGE HEADER */}
      <div className="add-question-header">

        <div className="add-question-title">

          <div className="add-question-icon">
            <FaClipboardList />
          </div>

          <div>
            <h2>Add Quiz Question</h2>
            <p>Create a new question for this quiz</p>
          </div>

        </div>

        <button
          type="button"
          className="back-btn"
          onClick={() =>
            navigate(
              `/Dashboard/ExamComponent/QuizQuestion/view/${quizId}`
            )
          }
        >
          <FaArrowLeft />
          <span>Back to Questions</span>
        </button>

      </div>

      {/* FORM CARD */}
      <div className="add-question-card">

        <div className="card-header">

          <div className="card-header-icon">
            <FaPlus />
          </div>

          <div>
            <h3>Question Details</h3>
            <p>Enter the question and answer options below</p>
          </div>

        </div>

        <form onSubmit={submit}>

          <div className="form-grid">

            {/* QUESTION */}
            <div className="form-group question-group">

              <label>
                <FaQuestionCircle />
                Question
                <span className="required">*</span>
              </label>

              <textarea
                className="input-box question-input"
                placeholder="Enter your question here..."
                value={form.question}
                onChange={(e) =>
                  handleChange("question", e.target.value)
                }
              />

              <span className="field-hint">
                Write a clear and concise question.
              </span>

            </div>


            {/* OPTIONS */}
            <div className="form-group">

              <label>
                <FaListUl />
                Options
                <span className="required">*</span>
              </label>

              <textarea
                className="input-box options-input"
                placeholder={`Enter options in JSON format, for example:

["Option A", "Option B", "Option C", "Option D"]`}
                value={form.options}
                onChange={(e) =>
                  handleChange("options", e.target.value)
                }
              />

              <span className="field-hint">
                Enter the options in the format expected by your backend.
              </span>

            </div>


            {/* CORRECT OPTION */}
            <div className="form-group correct-option-group">

              <label>
                <FaCheckCircle />
                Correct Option
                <span className="required">*</span>
              </label>

              <input
                className="input-box"
                type="text"
                placeholder="Enter correct option"
                value={form.correct_option}
                onChange={(e) =>
                  handleChange(
                    "correct_option",
                    e.target.value
                  )
                }
              />

              <span className="field-hint">
                Enter the exact correct option.
              </span>

            </div>

          </div>


          {/* FORM FOOTER */}
          <div className="form-footer">

            <button
              type="button"
              className="cancel-btn"
              onClick={() =>
                navigate(
                  `/Dashboard/ExamComponent/QuizQuestion/view/${quizId}`
                )
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="button-loader"></span>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave />
                  Add Question
                </>
              )}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default Add;
