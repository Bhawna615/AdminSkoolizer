import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateQuestionPaper.css";

const BASE_URL =
  "http://localhost/kkblossom/api.php/Adminapi/AdminExam";

const CreateQuestionPaper = () => {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [createdPapers, setCreatedPapers] = useState([]);

  const [formData, setFormData] = useState({
    exam: "",
    class: "",
    subject: "",
    max: "",
    duration: "",
    selectedQuestions: []
  });

  const [filter, setFilter] = useState({
    class: "",
    subject: "",
    enabled: false
  });

  const [message, setMessage] = useState({
    success: "",
    error: ""
  });

  /* =========================================================
     CREATE MESSAGE BOX
  ========================================================= */

  const [showCreateMessage, setShowCreateMessage] =
    useState(false);

  const [createMessageType, setCreateMessageType] =
    useState("");

  const [createMessageText, setCreateMessageText] =
    useState("");

  const [creating, setCreating] =
    useState(false);

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    fetchClasses();
    loadQuestions();
    loadCreatedPapers();
  }, []);

  /* =========================================================
     FETCH CLASSES
  ========================================================= */

  const fetchClasses = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/classes`
      );

      setClasses(res.data);

      if (res.data.length > 0) {
        const firstClass =
          res.data[0].Classname;

        setFormData((prev) => ({
          ...prev,
          class: firstClass,
          subject: ""
        }));

        setFilter((prev) => ({
          ...prev,
          class: firstClass,
          subject: ""
        }));

        fetchSubjects(firstClass);
      }
    } catch (err) {
      console.error(
        "Error loading classes:",
        err
      );
    }
  };

  /* =========================================================
     FETCH SUBJECTS
  ========================================================= */

  const fetchSubjects = async (className) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/getSubjectsByClass/${className}`
      );

      setSubjects(res.data);

      if (res.data.length > 0) {
        const firstSubject =
          res.data[0].Subjectname;

        setFormData((prev) => ({
          ...prev,
          subject: firstSubject
        }));

        setFilter((prev) => ({
          ...prev,
          subject: firstSubject
        }));

        return firstSubject;
      }

      setFormData((prev) => ({
        ...prev,
        subject: ""
      }));

      setFilter((prev) => ({
        ...prev,
        subject: ""
      }));

      return "";
    } catch (err) {
      console.error(
        "Error loading subjects:",
        err
      );

      return "";
    }
  };

  /* =========================================================
     LOAD ALL QUESTIONS
  ========================================================= */

  const loadQuestions = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/getQuestions`
      );

      setQuestions(res.data);
    } catch (err) {
      console.error(
        "Error loading questions:",
        err
      );
    }
  };

  /* =========================================================
     LOAD CREATED PAPERS
  ========================================================= */

  const loadCreatedPapers = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/getQuestionPapers`
      );

      setCreatedPapers(res.data);
    } catch (err) {
      console.error(
        "Error loading papers:",
        err
      );
    }
  };

  /* =========================================================
     FILTER QUESTIONS
  ========================================================= */

  const filterQuestions = async (
    className,
    subjectName
  ) => {
    if (!className || !subjectName) {
      return;
    }

    try {
      const res = await axios.get(
        `${BASE_URL}/getFilteredQuestions/${className}/${subjectName}`
      );

      setQuestions(res.data);
    } catch (err) {
      console.error(
        "Error filtering questions:",
        err
      );
    }
  };

  /* =========================================================
     FILTER TOGGLE
  ========================================================= */

  const handleFilterToggle = async (e) => {
    const enabled =
      e.target.checked;

    setFilter((prev) => ({
      ...prev,
      enabled
    }));

    if (!enabled) {
      // Filter OFF → show all questions
      await loadQuestions();
      return;
    }

    // Filter ON → apply current class + subject
    if (
      filter.class &&
      filter.subject
    ) {
      await filterQuestions(
        filter.class,
        filter.subject
      );
    }
  };

  /* =========================================================
     FILTER CLASS CHANGE
  ========================================================= */

  const handleFilterClassChange = async (e) => {
    const selectedClass =
      e.target.value;

    setFilter((prev) => ({
      ...prev,
      class: selectedClass,
      subject: ""
    }));

    const firstSubject =
      await fetchSubjects(
        selectedClass
      );

    // Automatically filter after class change
    if (
      filter.enabled &&
      firstSubject
    ) {
      await filterQuestions(
        selectedClass,
        firstSubject
      );
    }
  };

  /* =========================================================
     FILTER SUBJECT CHANGE
  ========================================================= */

  const handleFilterSubjectChange = async (
    e
  ) => {
    const selectedSubject =
      e.target.value;

    setFilter((prev) => ({
      ...prev,
      subject: selectedSubject
    }));

    if (
      filter.enabled &&
      filter.class &&
      selectedSubject
    ) {
      await filterQuestions(
        filter.class,
        selectedSubject
      );
    }
  };

  /* =========================================================
     FORM CHANGE
  ========================================================= */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /* =========================================================
     QUESTION CHECKBOX
  ========================================================= */

  const handleCheckbox = (id) => {
    const questionId =
      String(id);

    let updated = [
      ...formData.selectedQuestions
    ];

    if (
      updated.includes(questionId)
    ) {
      updated =
        updated.filter(
          (q) =>
            q !== questionId
        );
    } else {
      updated.push(questionId);
    }

    setFormData({
      ...formData,
      selectedQuestions: updated
    });
  };

  /* =========================================================
     CREATE QUESTION PAPER
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    /*
      Show the same message box first.
      Actual creation happens after clicking Create
      inside the message box.
    */

    setCreateMessageType("confirm");

    setCreateMessageText(
      "Are you sure you want to create this question paper?"
    );

    setShowCreateMessage(true);
  };

  /* =========================================================
     CONFIRM CREATE QUESTION PAPER
  ========================================================= */

  const confirmCreate = async () => {

    if (creating) {
      return;
    }

    setCreating(true);

    const payload = {
      exam: formData.exam,
      subject: formData.subject,
      class: formData.class,
      duration: formData.duration,
      max_marks: formData.max,
      questions:
        formData.selectedQuestions
    };

    try {
      const res = await axios.post(
        `${BASE_URL}/createQuestionPaper`,
        payload
      );

      if (
        res.data.status ===
        "success"
      ) {

        setCreateMessageType(
          "success"
        );

        setCreateMessageText(
          "Saved Successfully"
        );

        await loadCreatedPapers();

        if (filter.enabled) {
          await filterQuestions(
            filter.class,
            filter.subject
          );
        } else {
          await loadQuestions();
        }

        setFormData((prev) => ({
          ...prev,
          selectedQuestions: []
        }));

        setMessage({
          success:
            "Saved Successfully",
          error: ""
        });

        setCreating(false);

        /*
          Show success message first,
          then navigate to Question Papers page.
        */

        setTimeout(() => {
          navigate(
            "/dashboard/ExamComponent/QuestionPapers"
          );
        }, 1000);

      } else {

        setCreateMessageType(
          "error"
        );

        setCreateMessageText(
          "Failed to Save"
        );

        setMessage({
          error:
            "Failed to Save",
          success: ""
        });

        setCreating(false);
      }

    } catch (err) {

      console.error(
        "Error creating question paper:",
        err
      );

      setCreateMessageType(
        "error"
      );

      setCreateMessageText(
        "Something went wrong"
      );

      setMessage({
        error:
          "Something went wrong",
        success: ""
      });

      setCreating(false);
    }
  };

  /* =========================================================
     CLOSE CREATE MESSAGE
  ========================================================= */

  const closeCreateMessage = () => {

    if (creating) {
      return;
    }

    setShowCreateMessage(false);

    setCreateMessageType("");

    setCreateMessageText("");
  };

  return (
    <div className="innerview">

      {/* =====================================================
          CREATE MESSAGE BOX
      ===================================================== */}

      {showCreateMessage && (
        <div className="create-message-overlay">

          <div
            className={`create-message-box ${
              createMessageType === "success"
                ? "create-message-success"
                : createMessageType === "error"
                ? "create-message-error"
                : "create-message-confirm"
            }`}
          >

            {/* ICON */}

            <div className="create-message-icon">

              {createMessageType ===
                "success" && (
                <i className="bi bi-check-lg"></i>
              )}

              {createMessageType ===
                "error" && (
                <i className="bi bi-x-lg"></i>
              )}

              {createMessageType ===
                "confirm" && (
                <i className="bi bi-question-lg"></i>
              )}

            </div>


            {/* TITLE */}

            <h3>

              {createMessageType ===
                "success" &&
                "Success"}

              {createMessageType ===
                "error" &&
                "Error"}

              {createMessageType ===
                "confirm" &&
                "Create Question Paper"}

            </h3>


            {/* MESSAGE */}

            <p>
              {createMessageText}
            </p>


            {/* ACTIONS */}

            {createMessageType ===
              "confirm" ? (

              <div className="create-message-actions">

                <button
                  type="button"
                  className="create-message-cancel-btn"
                  onClick={
                    closeCreateMessage
                  }
                  disabled={creating}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="create-message-confirm-btn"
                  onClick={
                    confirmCreate
                  }
                  disabled={creating}
                >

                  {creating ? (
                    <>
                      <span className="create-message-loader"></span>
                      Creating...
                    </>
                  ) : (
                    "Create"
                  )}

                </button>

              </div>

            ) : (

              <div className="create-message-actions">

                <button
                  type="button"
                  className="create-message-ok-btn"
                  onClick={
                    closeCreateMessage
                  }
                  disabled={creating}
                >
                  OK
                </button>

              </div>

            )}

          </div>

        </div>
      )}


      {/* =====================================================
          MESSAGE
      ===================================================== */}

      {/* <div className="message">

        {message.error && (
          <div className="error-bar">
            {message.error}
          </div>
        )}

        {message.success && (
          <div className="success-bar">
            {message.success}
          </div>
        )}

      </div>  */}


      {/* =====================================================
          FILTER BAR
      ===================================================== */}

      <div className="filter-bar">

        <label className="admin-view-student-toggle">

          <input
            type="checkbox"
            checked={filter.enabled}
            onChange={
              handleFilterToggle
            }
          />

          <span className="admin-view-student-toggle-slider"></span>

          <span className="admin-view-student-toggle-text">
            Enable Filter
          </span>

        </label>


        <select
          value={filter.class}
          disabled={!filter.enabled}
          onChange={
            handleFilterClassChange
          }
          className={
            !filter.enabled
              ? "filter-disabled"
              : ""
          }
        >

          {classes.map((c) => (

            <option
              key={c.Classname}
              value={c.Classname}
            >
              {c.Classname}
            </option>

          ))}

        </select>


        <select
          value={filter.subject}
          disabled={!filter.enabled}
          onChange={
            handleFilterSubjectChange
          }
          className={
            !filter.enabled
              ? "filter-disabled"
              : ""
          }
        >

          {subjects.map(
            (s, i) => (

              <option
                key={i}
                value={s.Subjectname}
              >
                {s.Subjectname}
              </option>

            )
          )}

        </select>

      </div>


      {/* =====================================================
          CREATE QUESTION PAPER
      ===================================================== */}

      <form onSubmit={handleSubmit}>

        <div className="form-grid">

          <div>

            <p>Exam Name</p>

            <input
              name="exam"
              value={
                formData.exam
              }
              onChange={
                handleChange
              }
            />


            <p>Class</p>

            <select
              name="class"
              value={
                formData.class
              }
              onChange={(e) => {

                const selectedClass =
                  e.target.value;

                setFormData(
                  (prev) => ({
                    ...prev,
                    class:
                      selectedClass,
                    subject: ""
                  })
                );

                fetchSubjects(
                  selectedClass
                );

              }}
            >

              {classes.map(
                (c) => (

                  <option
                    key={
                      c.Classname
                    }
                    value={
                      c.Classname
                    }
                  >
                    {
                      c.Classname
                    }
                  </option>

                )
              )}

            </select>


            <p>
              Maximum Marks
            </p>

            <input
              name="max"
              value={
                formData.max
              }
              onChange={
                handleChange
              }
            />

          </div>


          <div>

            <p>Subject</p>

            <select
              name="subject"
              value={
                formData.subject
              }
              onChange={
                handleChange
              }
            >

              {subjects.map(
                (s, i) => (

                  <option
                    key={i}
                    value={
                      s.Subjectname
                    }
                  >
                    {
                      s.Subjectname
                    }
                  </option>

                )
              )}

            </select>

          </div>


          <div>

            <p>Duration</p>

            <input
              name="duration"
              value={
                formData.duration
              }
              onChange={
                handleChange
              }
            />


            <button
              type="submit"
              className="crp_btn"
            >
              Create
            </button>

          </div>

        </div>

      </form>


      {/* =====================================================
          QUESTIONS TABLE
      ===================================================== */}

      <h3>
        Questions
      </h3>


      <table className="custom-table">

        <thead>

          <tr>

            <th>SELECT</th>
            <th>ID</th>
            <th>CONTENT</th>
            <th>WEIGHTAGE</th>
            <th>CLASS</th>
            <th>SUBJECT</th>
            <th>CREATED AT</th>

          </tr>

        </thead>


        <tbody>

          {questions.length > 0 ? (

            questions.map(
              (question, index) => {

                const questionId =
                  String(
                    question.id
                  );

                return (

                  <tr
                    key={
                      question.id ||
                      index
                    }
                  >

                    <td>

                      <input
                        type="checkbox"
                        checked={formData.selectedQuestions.includes(
                          questionId
                        )}
                        onChange={() =>
                          handleCheckbox(
                            questionId
                          )
                        }
                      />

                    </td>


                    <td>
                      {
                        question.id
                      }
                    </td>


                    <td>
                      {
                        question.content
                      }
                    </td>


                    <td>
                      {
                        question.weightage
                      }
                    </td>


                    <td>
                      {
                        question.class
                      }
                    </td>


                    <td>
                      {
                        question.subject
                      }
                    </td>


                    <td>
                      {
                        question.created_at
                      }
                    </td>

                  </tr>

                );
              }
            )

          ) : (

            <tr>

              <td
                colSpan="7"
                style={{
                  textAlign:
                    "center"
                }}
              >
                No questions found.
              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>
  );
};

export default CreateQuestionPaper;