import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./Edit.css";

import {
  FaClipboardList,
  FaEdit,
  FaSave,
  FaArrowLeft,
  FaQuestionCircle,
  FaListUl,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";

function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    id: "",
    question: "",
    options: "",
    correct_option: "",
    quiz_id: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // GET QUESTION DATA
  // ==========================================
  useEffect(() => {
    setLoading(true);
    setError("");

    axios
      .get(
        `http://localhost/kkblossom/api.php/Adminapi/AdminExam/quizQuestionGet/${id}`
      )
      .then((res) => {
        console.log("QUESTION GET RESPONSE:", res.data);

        if (res.data?.data) {
          const questionData = res.data.data;

          console.log("QUESTION ID:", questionData.id);
          console.log("QUIZ ID:", questionData.quiz_id);

          setForm({
            id: questionData.id || id,
            question: questionData.question || "",
            options: questionData.options || "",
            correct_option: questionData.correct_option || "",
            quiz_id: questionData.quiz_id || "",
          });
        } else {
          setError("Question data not found.");
        }
      })
      .catch((err) => {
        console.error("Error loading question:", err);

        if (err.response) {
          console.error("SERVER RESPONSE:", err.response.data);
          console.error("STATUS:", err.response.status);
        }

        setError("Failed to load question.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================
  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ==========================================
  // UPDATE QUESTION
  // ==========================================
  const submit = async (e) => {
    e.preventDefault();

    // -------------------------------
    // VALIDATION
    // -------------------------------
    if (!form.id) {
      alert("Question ID is missing.");
      console.error("QUESTION ID IS MISSING:", form);
      return;
    }

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

    setSaving(true);

    // ==========================================
    // DATA BEING SENT TO PHP
    // ==========================================
    const updateData = {
      id: form.id,
      question: form.question,
      options: form.options,
      correct_option: form.correct_option,
      quiz_id: form.quiz_id,
    };

    console.log("=================================");
    console.log("UPDATING QUESTION");
    console.log("=================================");
    console.log("UPDATE DATA:", updateData);
    console.log("QUESTION ID:", form.id);
    console.log("QUIZ ID:", form.quiz_id);

    try {
      const res = await axios.post(
        "http://localhost/kkblossom/api.php/Adminapi/AdminExam/quizQuestionUpdate",
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("UPDATE RESPONSE:", res.data);

      // ==========================================
      // SUCCESS
      // ==========================================
      if (res.data?.status === true) {
        alert("Question updated successfully!");

        if (form.quiz_id) {
          navigate(
            `/Dashboard/ExamComponent/QuizQuestion/view/${form.quiz_id}`
          );
        } else {
          navigate("/Dashboard/ExamComponent/Quiz");
        }
      } else {
        alert(
          res.data?.message ||
            "Question could not be updated."
        );
      }
    } catch (err) {
      console.error("=================================");
      console.error("UPDATE ERROR");
      console.error("=================================");

      console.error(err);

      if (err.response) {
        console.error("STATUS:", err.response.status);
        console.error("SERVER RESPONSE:", err.response.data);

        alert(
          err.response.data?.message ||
            "Server error while updating question."
        );
      } else {
        alert("Unable to connect to the server.");
      }
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // BACK
  // ==========================================
  const goBack = () => {
    if (form.quiz_id) {
      navigate(
        `/Dashboard/ExamComponent/QuizQuestion/view/${form.quiz_id}`
      );
    } else {
      navigate("/Dashboard/ExamComponent/Quiz");
    }
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="edit-question-page">
        <div className="edit-loading-card">
          <div className="edit-loader"></div>

          <h3>Loading Question...</h3>

          <p>
            Please wait while the question details are loaded.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================
  if (error) {
    return (
      <div className="edit-question-page">
        <div className="edit-error-card">
          <div className="error-icon">
            <FaTimes />
          </div>

          <h3>Unable to Load Question</h3>

          <p>{error}</p>

          <button
            type="button"
            className="back-btn"
            onClick={goBack}
          >
            <FaArrowLeft />
            Back to Questions
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================
  return (
    <div className="edit-question-page">

      {/* ================= HEADER ================= */}
      <div className="edit-question-header">

        <div className="edit-title-section">

          <div className="edit-title-icon">
            <FaClipboardList />
          </div>

          <div>
            <h2>Edit Quiz Question</h2>

            <p>
              Update the question and answer details
            </p>
          </div>

        </div>

        <button
          type="button"
          className="back-btn"
          onClick={goBack}
        >
          <FaArrowLeft />

          <span>
            Back to Questions
          </span>
        </button>

      </div>

      {/* ================= MAIN CARD ================= */}
      <div className="edit-question-card">

        {/* ================= CARD HEADER ================= */}
        <div className="edit-card-header">

          <div className="edit-card-header-icon">
            <FaEdit />
          </div>

          <div>
            <h3>
              Question Details
            </h3>

            <p>
              Edit the information below and save your changes.
            </p>
          </div>

        </div>

        {/* ================= FORM ================= */}
        <form onSubmit={submit}>

          <div className="edit-form-grid">

            {/* ================= QUESTION ================= */}
            <div className="edit-form-group question-group">

              <label>
                <FaQuestionCircle />

                Question

                <span className="required">
                  *
                </span>
              </label>

              <textarea
                className="edit-input-box question-input"
                placeholder="Enter your question here..."
                value={form.question}
                onChange={(e) =>
                  handleChange(
                    "question",
                    e.target.value
                  )
                }
              />

              <span className="field-hint">
                Make sure the question is clear and easy to understand.
              </span>

            </div>

            {/* ================= OPTIONS ================= */}
            <div className="edit-form-group options-group">

              <label>
                <FaListUl />

                Options

                <span className="required">
                  *
                </span>
              </label>

              <textarea
                className="edit-input-box options-input"
                placeholder="Enter options..."
                value={form.options}
                onChange={(e) =>
                  handleChange(
                    "options",
                    e.target.value
                  )
                }
              />

              <span className="field-hint">
                Enter the options in the same format used by your quiz.
              </span>

            </div>

            {/* ================= CORRECT OPTION ================= */}
            <div className="edit-form-group correct-option-group">

              <label>
                <FaCheckCircle />

                Correct Option

                <span className="required">
                  *
                </span>
              </label>

              <input
                className="edit-input-box"
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

          {/* ================= FOOTER ================= */}
          <div className="edit-form-footer">

            <button
              type="button"
              className="cancel-btn"
              onClick={goBack}
              disabled={saving}
            >
              <FaTimes />

              Cancel
            </button>

            <button
              type="submit"
              className="update-btn"
              disabled={saving}
            >

              {saving ? (
                <>
                  <span className="update-loader"></span>

                  Updating...
                </>
              ) : (
                <>
                  <FaSave />

                  Update Question
                </>
              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default Edit;