
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./QuestionPaperGenerate.css";
import schoolLogo from "../images/school-logo.png";

const API =
  "http://localhost/kkblossom/api.php/Adminapi/AdminExam/";

const QuestionPaperGenerate = () => {
  const { questionPaperId } = useParams();

  const [questionPaper, setQuestionPaper] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuestionPaper = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${API}generateQuestionPaper/${questionPaperId}`
        );

        console.log("Question Paper Response:", response.data);

        if (response.data.status) {
          setQuestionPaper(response.data.questionPaper);
          setQuestions(response.data.questions || []);
        } else {
          setError(
            response.data.message || "Failed to load question paper"
          );
        }
      } catch (err) {
        console.error("Error loading question paper:", err);
        setError("Unable to load question paper");
      } finally {
        setLoading(false);
      }
    };

    if (questionPaperId) {
      fetchQuestionPaper();
    }
  }, [questionPaperId]);

  /*
   * PRINT
   * Same approach as your Report component:
   * wait for React rendering -> wait 2 seconds -> requestAnimationFrame -> print
   */
  useEffect(() => {
    if (!loading && questionPaper) {
      const timer = setTimeout(() => {
        window.requestAnimationFrame(() => {
          window.print();
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [loading, questionPaper]);

  if (loading) {
    return (
      <div className="qp-loading">
        Loading Question Paper...
      </div>
    );
  }

  if (error) {
    return (
      <div className="qp-error">
        {error}
      </div>
    );
  }

  return (
    <div className="question-paper">

      {/* SCHOOL HEADER */}
      <div className="school-name-container">

        <div className="school-logo-container">
          <img
            src={schoolLogo}
            className="school-logo"
            alt="School Logo"
          />
        </div>

        <p className="school-name">
          KK BLOSSOMS SCHOOL
        </p>

        <p className="school-address">
          Rabaun, Solan, Himachal Pradesh
        </p>

      </div>

      {/* EXAM DETAILS */}
      {questionPaper && (
        <div className="exam-details">

          <div className="exam-details-top">

            <p className="exam-name">
              {questionPaper.exam}
            </p>

            <p className="exam-class">
              Class: {questionPaper.class}
            </p>

            <p className="exam-subject">
              Subject: {questionPaper.subject}
            </p>

          </div>

          <div className="exam-details-bottom">

            <p className="exam-duration">
              Duration: {questionPaper.duration} hours
            </p>

            <p className="exam-max-marks">
              Maximum Marks: {questionPaper.max_marks}
            </p>

          </div>

        </div>
      )}

      {/* GENERAL INSTRUCTIONS */}
      <div className="exam-instructions-container">

        <p className="exam-instructions">

          <strong>General Instructions:</strong>

          <br />

          1. The Question Paper contains three sections.

          <br />

          2. Section A has 24 questions. Attempt any 20 questions.

          <br />

          3. Section B has 24 questions. Attempt any 20 questions.

          <br />

          4. Section C has 12 questions. Attempt any 10 questions.

          <br />

          5. All questions carry equal marks.

          <br />

          6. There is no negative marking.

        </p>

      </div>

      {/* QUESTION PAPER */}
      <div className="exam-paper">

        {/* SECTION A */}
        <div className="exam-section-container">
          <p className="exam-section">
            Section A
          </p>
        </div>

        <p className="section-instruction">
          Answer the following question briefly
        </p>

        {/* QUESTIONS */}
        {questions.length > 0 ? (
          questions.map((question, index) => (
            <p
              className="question"
              key={question.id || index}
            >
              {index + 1}. {question.content}
            </p>
          ))
        ) : (
          <p className="no-questions">
            No questions found.
          </p>
        )}

      </div>

    </div>
  );
};

export default QuestionPaperGenerate;
