
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./View.css";

import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaClipboardList,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";

function View() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("QUIZ ID:", quizId);

    setLoading(true);
    setError("");

    axios
      .get(
        `http://localhost/kkblossom/api.php/Adminapi/AdminExam/quizQuestionList/${quizId}`
      )
      .then((res) => {
        console.log("QUESTION API:", res.data);

        if (Array.isArray(res.data.data)) {
          setQuestions(res.data.data);
        } else {
          setQuestions([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load questions.");
        setQuestions([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [quizId]);

  const handleDelete = (id, questionQuizId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return;
    }

    axios
      .get(
        `http://localhost/kkblossom/api.php/Adminapi/AdminExam/quizQuestionDelete/${id}/${questionQuizId}`
      )
      .then((res) => {
        if (res.data.status) {
          alert("Question deleted successfully.");

          setQuestions((prev) =>
            prev.filter((question) => question.id !== id)
          );
        } else {
          alert("Delete failed.");
        }
      })
      .catch((err) => {
        console.error("Delete error:", err);
        alert("Unable to delete question.");
      });
  };

  const filteredQuestions = questions.filter((q) => {
    const searchText = search.toLowerCase();

    return (
      String(q.id || "").toLowerCase().includes(searchText) ||
      String(q.question || "").toLowerCase().includes(searchText) ||
      String(q.correct_option || "")
        .toLowerCase()
        .includes(searchText)
    );
  });

  const displayedQuestions = filteredQuestions.slice(0, entries);

 const formatOptions = (options) => {
  if (!options) return [];

  // Already an array
  if (Array.isArray(options)) {
    return options;
  }

  const value = String(options).trim();

  if (!value) return [];

  // Try JSON first
  try {
    const parsedOptions = JSON.parse(value);

    if (Array.isArray(parsedOptions)) {
      return parsedOptions;
    }
  } catch (error) {
    // Not JSON, continue with normal text format
  }

  // Comma-separated options
  if (value.includes(",")) {
    return value
      .split(",")
      .map((option) => option.trim())
      .filter(Boolean);
  }

  // New-line separated options
  if (value.includes("\n")) {
    return value
      .split(/\r?\n/)
      .map((option) => option.trim())
      .filter(Boolean);
  }

  // Space-separated options
  return value
    .split(/\s+/)
    .map((option) => option.trim())
    .filter(Boolean);
};

  return (
    <div className="question-page">

      {/* PAGE HEADER */}
      <div className="question-title-section">

        <div className="question-title-left">
          <div className="question-title-icon">
            <FaClipboardList />
          </div>

          <div>
            <h2>Quiz Questions</h2>
            <p>Manage questions for this quiz</p>
          </div>
        </div>

        <div className="header-actions">

          <button
            className="back-btn"
            onClick={() =>
              navigate("/Dashboard/ExamComponent/Quiz")
            }
            title="Back to Quizzes"
          >
            <FaArrowLeft />
            <span>Back</span>
          </button>

          <button
            className="add-btn"
            onClick={() =>
              navigate(
                `/Dashboard/ExamComponent/QuizQuestion/add/${quizId}`
              )
            }
          >
            <FaPlus />
            <span>Add Question</span>
          </button>

        </div>
      </div>

      {/* MAIN CARD */}
      <div className="question-card">

        {/* TOP CONTROLS */}
        <div className="question-header">

          <div className="entries-control">
            <span>Show</span>

            <select
              value={entries}
              onChange={(e) =>
                setEntries(Number(e.target.value))
              }
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>

            <span>entries</span>
          </div>

          <div className="search-box">
            <FaSearch className="search-icon" />

            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

        </div>

        {/* ERROR */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* TABLE */}
        <div className="table-wrapper">

          <table className="question-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>QUESTION</th>
                <th>OPTIONS</th>
                <th>CORRECT OPTION</th>
                <th className="action-heading">ACTIONS</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td colSpan="5" className="no-data">

                    <div className="loading-container">
                      <div className="loader"></div>
                      Loading questions...
                    </div>

                  </td>
                </tr>

              ) : displayedQuestions.length > 0 ? (

                displayedQuestions.map((q) => {

                  const options = formatOptions(q.options);

                  return (
                    <tr key={q.id}>

                      {/* ID */}
                      <td>
                        <span className="id-badge">
                          {q.id}
                        </span>
                      </td>

                      {/* QUESTION */}
                      <td>
                        <div className="question-text">
                          {q.question || "No question"}
                        </div>
                      </td>

                      {/* OPTIONS */}
                      <td>
                        <div className="options-container">

                          {options.length > 0 ? (
                            options.map((option, index) => (
                              <div
                                className="option-item"
                                key={index}
                              >
                                <span className="option-label">
                                  {String.fromCharCode(65 + index)}
                                </span>

                                <span>
                                  {option}
                                </span>
                              </div>
                            ))
                          ) : (
                            <span className="no-options">
                              No options
                            </span>
                          )}

                        </div>
                      </td>

                      {/* CORRECT OPTION */}
                      <td>
                        <span className="correct-badge">
                          <FaCheckCircle />
                          {q.correct_option || "N/A"}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td>

                        <div className="actions">

                          {/* EDIT */}
                          <button
                            type="button"
                            className="action-btn edit-btn"
                            title="Edit Question"
                            onClick={() =>
                              navigate(
                                `/Dashboard/ExamComponent/QuizQuestion/edit/${q.id}`
                              )
                            }
                          >
                            <FaEdit />
                          </button>

                          {/* DELETE */}
                          <button
                            type="button"
                            className="action-btn delete-btn"
                            title="Delete Question"
                            onClick={() =>
                              handleDelete(q.id, q.quiz_id)
                            }
                          >
                            <FaTrash />
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })

              ) : (

                <tr>
                  <td colSpan="5" className="no-data">

                    <div className="empty-state">

                      <div className="empty-icon">
                        <FaClipboardList />
                      </div>

                      <h3>No Questions Found</h3>

                      <p>
                        {search
                          ? "No questions match your search."
                          : "No questions have been added to this quiz yet."}
                      </p>

                    </div>

                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* FOOTER */}
        <div className="question-footer">

          <div className="showing-text">
            Showing{" "}
            <strong>
              {displayedQuestions.length > 0 ? 1 : 0}
            </strong>{" "}
            to{" "}
            <strong>
              {displayedQuestions.length}
            </strong>{" "}
            of{" "}
            <strong>
              {filteredQuestions.length}
            </strong>{" "}
            entries
          </div>

          <div className="pagination">

            <button disabled>
              Previous
            </button>

            <button className="active-page">
              1
            </button>

            <button disabled>
              Next
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default View;
