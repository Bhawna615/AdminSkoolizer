import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./QuestionPapers.css";

const QuestionPapers = () => {
  const [papers, setPapers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(1);
  const [selectedClass, setSelectedClass] = useState("");
  const [filterEnabled, setFilterEnabled] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();

  const BASE_URL =
    "http://localhost/kkblossom/api.php/Adminapi/AdminExam/";

  // ==============================
  // FETCH QUESTION PAPERS
  // ==============================
  const fetchPapers = async () => {
    try {
      const res = await axios.get(BASE_URL + "display");
      setPapers(res.data);
    } catch (err) {
      console.error("Error fetching question papers:", err);
    }
  };

  // ==============================
  // FETCH FILTERED PAPERS
  // ==============================
  const fetchFiltered = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}filter/${year}/${month}/${selectedClass}`
      );

      setPapers(res.data);
    } catch (err) {
      console.error("Error filtering question papers:", err);
    }
  };

  // ==============================
  // INITIAL LOAD
  // ==============================
  useEffect(() => {
    fetchPapers();

    axios
      .get(BASE_URL + "getClasses")
      .then((res) => {
        setClasses(res.data);

        if (res.data.length > 0) {
          setSelectedClass(res.data[0].Classname);
        }
      })
      .catch((err) => {
        console.error("Error fetching classes:", err);
      });
  }, []);

  // ==============================
  // FILTER
  // ==============================
  useEffect(() => {
    if (filterEnabled && selectedClass) {
      fetchFiltered();
    }
  }, [year, month, selectedClass, filterEnabled]);

  // ==============================
  // DELETE QUESTION PAPER
  // ==============================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question paper?")) {
      return;
    }

    try {
      console.log("Deleting question paper ID:", id);

      const res = await axios.get(
        BASE_URL + "quizQuestionDelete/" + id
      );

      console.log("Delete response:", res.data);

      // Remove deleted paper from UI immediately
      setPapers((prevPapers) =>
        prevPapers.filter((paper) => String(paper.id) !== String(id))
      );

      // Show success message
      setShowMessage(true);

      // Hide message after 3 seconds
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);

    } catch (err) {
      console.error("Delete failed:", err);

      alert("Unable to delete question paper.");
    }
  };

  // ==============================
  // VIEW QUESTION PAPER
  // ==============================
  const handleView = (questionPaperId) => {
  navigate(
    `/dashboard/ExamComponent/QuestionPaperGenerate/${questionPaperId}`
  );
};

  return (
    <div className="container">

      {/* ==============================
          SUCCESS MESSAGE
      ============================== */}
      {showMessage && (
        <div className="success-message">
          <i className="bi bi-check-circle-fill"></i>
          Deleted Successfully
        </div>
      )}

      {/* ==============================
          FILTER BOX
      ============================== */}
      <div className="filter-box">

  <label className="filter-toggle">

    <input
      type="checkbox"
      checked={filterEnabled}
      onChange={() => setFilterEnabled(!filterEnabled)}
    />

    <span className="filter-toggle-slider"></span>

    <span className="filter-toggle-text">
      Enable Filter
    </span>

  </label>

  <div className="filter-row">

    {/* YEAR */}
    <div className="filter-group">
      <p className="filter-title">Year</p>

      <select
        value={year}
        onChange={(e) => setYear(e.target.value)}
      >
        <option value={new Date().getFullYear()}>
          {new Date().getFullYear()}
        </option>

        <option value={new Date().getFullYear() - 1}>
          {new Date().getFullYear() - 1}
        </option>

        <option value={new Date().getFullYear() - 2}>
          {new Date().getFullYear() - 2}
        </option>
      </select>
    </div>

    {/* MONTH */}
    <div className="filter-group">
      <p className="filter-title">Month</p>

      <select
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      >
        <option value="1">January</option>
        <option value="2">February</option>
        <option value="3">March</option>
        <option value="4">April</option>
        <option value="5">May</option>
        <option value="6">June</option>
        <option value="7">July</option>
        <option value="8">August</option>
        <option value="9">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>
    </div>

    {/* CLASS */}
    <div className="filter-group">
      <p className="filter-title">Class</p>

      <select
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
      >
        {classes.map((c, i) => (
          <option key={i} value={c.Classname}>
            {c.Classname}
          </option>
        ))}
      </select>
    </div>

  </div>
</div>

      {/* ==============================
          TABLE
      ============================== */}
      <div className="table-container">

        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>CLASS</th>
              <th>SUBJECT</th>
              <th>DURATION</th>
              <th>MAX MARKS</th>
              <th>CREATED AT</th>
              <th>ACTION</th>
            </tr>
          </thead>

          <tbody>

            {papers.length > 0 ? (
              papers.map((p) => (

                <tr key={p.id}>

                  <td>{p.id}</td>

                  <td>{p.class}</td>

                  <td>{p.subject}</td>

                  <td>{p.duration}</td>

                  <td>{p.max_marks}</td>

                  <td>{p.created_at}</td>

                  {/* ACTIONS */}
                  <td className="question-paper-actions">

                    {/* VIEW */}
                    <button
                      type="button"
                      className="action-btn view-btn"
                      title="View Question Paper"
                      onClick={() => handleView(p.id)}
                    >
                      <i className="bi bi-eye"></i>
                    </button>

                    {/* DELETE */}
                    <button
                      type="button"
                      className="action-btn delete-btn"
                      title="Delete Question Paper"
                      onClick={() => handleDelete(p.id)}
                    >
                      <i className="bi bi-trash3"></i>
                    </button>

                  </td>

                </tr>

              ))
            ) : (

              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#999"
                  }}
                >
                  No question papers found
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* ==============================
          FLOATING ADD BUTTON
      ============================== */}
      <button
        className="floating-btn"
        onClick={() =>
          navigate("/dashboard/ExamComponent/CreateQuestionPaper")
        }
      >
        +
      </button>

    </div>
  );
};

export default QuestionPapers;