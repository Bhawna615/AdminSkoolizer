
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CreateQuestionPaper.css";

const BASE_URL =
  "http://localhost/kkblossom/api.php/Adminapi/AdminExam";

const CreateQuestionPaper = () => {
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
        setMessage({
          success:
            "Saved Successfully",
          error: ""
        });

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
      } else {
        setMessage({
          error:
            "Failed to Save",
          success: ""
        });
      }
    } catch (err) {
      console.error(
        "Error creating question paper:",
        err
      );

      setMessage({
        error:
          "Something went wrong",
        success: ""
      });
    }
  };

  return (
    <div className="innerview">

      {/* =====================================================
          MESSAGE
      ===================================================== */}

      <div className="message">

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

      </div>


      {/* =====================================================
          FILTER BAR
      ===================================================== */}

      <div className="filter-bar">

        <label className="admin-view-student-toggle">
  <input
    type="checkbox"
    checked={filter.enabled}
    onChange={handleFilterToggle}
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
