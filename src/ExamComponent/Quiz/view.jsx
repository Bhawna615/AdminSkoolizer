
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./QuizView.css";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaTrash,
  FaPlus,
  FaSearch,
  FaClipboardList,
} from "react-icons/fa";

function View() {
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        "http://localhost/kkblossom/api.php/Adminapi/AdminExam/quizList"
      )
      .then((res) => {
        if (Array.isArray(res.data)) {
          setQuizzes(res.data);
        } else if (Array.isArray(res.data.data)) {
          setQuizzes(res.data.data);
        } else if (Array.isArray(res.data.quizzes)) {
          setQuizzes(res.data.quizzes);
        } else {
          setQuizzes([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching quizzes:", error);
        setQuizzes([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const deleteQuiz = (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) {
      return;
    }

    axios
      .get(
        `http://localhost/kkblossom/api.php/Adminapi/AdminExam/quizDelete/${id}`
      )
      .then(() => {
        setQuizzes((prev) => prev.filter((q) => q.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting quiz:", error);
        alert("Unable to delete quiz.");
      });
  };

  const filteredData = quizzes.filter((q) => {
    const text = search.toLowerCase();

    return (
      q.name?.toLowerCase().includes(text) ||
      q.class?.toLowerCase().includes(text) ||
      String(q.id).includes(text)
    );
  });

  const displayedData = filteredData.slice(0, entries);

  return (
    <div className="quiz-page">

      {/* PAGE HEADER */}
      <div className="quiz-title-section">

        <div className="quiz-title-left">
          <div className="quiz-title-icon">
            <FaClipboardList />
          </div>

          <div>
            <h2>Quiz Management</h2>
            <p>Manage and view all quizzes</p>
          </div>
        </div>

        <button
          className="create-btn"
          onClick={() =>
            navigate("/Dashboard/ExamComponent/Quiz/add")
          }
        >
          <FaPlus />
          Create Quiz
        </button>

      </div>

      {/* CARD */}
      <div className="quiz-card">

        {/* TOP CONTROLS */}
        <div className="quiz-header">

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
              placeholder="Search quizzes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

        </div>

        {/* TABLE */}
        <div className="table-wrapper">

          <table className="quiz-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>CLASS</th>
                <th>EXPIRY DATE</th>
                <th className="action-heading">
                  ACTIONS
                </th>
              </tr>
            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td colSpan="5" className="no-data">
                    <div className="loading-container">
                      <div className="loader"></div>
                      Loading quizzes...
                    </div>
                  </td>
                </tr>

              ) : displayedData.length > 0 ? (

                displayedData.map((q) => (

                  <tr key={q.id}>

                    <td>
                      <span className="id-badge">
                        {q.id}
                      </span>
                    </td>

                    <td>
                      <div className="quiz-name">

                        <div className="quiz-small-icon">
                          <FaClipboardList />
                        </div>

                        <span>
                          {q.name || "Untitled Quiz"}
                        </span>

                      </div>
                    </td>

                    <td>
                      <span className="class-badge">
                        {q.class || "N/A"}
                      </span>
                    </td>

                    <td>
                      <span className="expiry-date">
                        {q.expiry_date || "N/A"}
                      </span>
                    </td>

                    {/* ACTION ICONS */}
                    <td className="actions">

                      <button
                        type="button"
                        className="action-btn view-btn"
                        title="View Questions"
                        onClick={() =>
                          navigate(
                            `/Dashboard/ExamComponent/QuizQuestion/view/${q.id}`
                          )
                        }
                      >
                        <FaEye />
                      </button>

                      <button
                        type="button"
                        className="action-btn delete-btn"
                        title="Delete Quiz"
                        onClick={() =>
                          deleteQuiz(q.id)
                        }
                      >
                        <FaTrash />
                      </button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>
                  <td
                    colSpan="5"
                    className="no-data"
                  >
                    <div className="empty-state">

                      <div className="empty-icon">
                        <FaClipboardList />
                      </div>

                      <h3>No Data Found</h3>

                      <p>
                        No quizzes match your search.
                      </p>

                    </div>
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* FOOTER */}
        <div className="quiz-footer">

          <div>
            Showing{" "}
            <strong>
              {displayedData.length > 0 ? 1 : 0}
            </strong>{" "}
            to{" "}
            <strong>
              {displayedData.length}
            </strong>{" "}
            of{" "}
            <strong>
              {filteredData.length}
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
