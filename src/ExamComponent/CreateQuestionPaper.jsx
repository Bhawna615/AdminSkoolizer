import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CreateQuestionPaper.css";

const BASE_URL = "http://localhost/kkblossom/api.php/Adminapi/AdminExam";

const CreateQuestionPaper = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [createdPapers, setCreatedPapers] = useState([]); // ✅ ADDED

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

  const [message, setMessage] = useState({ success: "", error: "" });

  useEffect(() => {
    fetchClasses();
    loadQuestions();
    loadCreatedPapers(); // ✅ ADDED
  }, []);

  const fetchClasses = async () => {
    const res = await axios.get(`${BASE_URL}/classes`);
    setClasses(res.data);

    if (res.data.length > 0) {
      const first = res.data[0].Classname;

      setFormData((prev) => ({
        ...prev,
        class: first,
        subject: ""
      }));

      setFilter((prev) => ({
        ...prev,
        class: first,
        subject: ""
      }));

      fetchSubjects(first);
    }
  };

  const fetchSubjects = async (className) => {
    const res = await axios.get(
      `${BASE_URL}/getSubjectsByClass/${className}`
    );

    setSubjects(res.data);

    if (res.data.length > 0) {
      const firstSubject = res.data[0].Subjectname;

      setFormData((prev) => ({
        ...prev,
        subject: firstSubject
      }));

      setFilter((prev) => ({
        ...prev,
        subject: firstSubject
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        subject: ""
      }));

      setFilter((prev) => ({
        ...prev,
        subject: ""
      }));
    }
  };

  const loadQuestions = async () => {
    const res = await axios.get(`${BASE_URL}/getQuestions`);
    setQuestions(res.data);
  };

  // ✅ LOAD CREATED PAPERS FROM DB
  const loadCreatedPapers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getQuestionPapers`);
      setCreatedPapers(res.data);
    } catch (err) {
      console.log("Error loading papers");
    }
  };

  const filterQuestions = async () => {
    const res = await axios.get(
      `${BASE_URL}/getFilteredQuestions/${filter.class}/${filter.subject}`
    );
    setQuestions(res.data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (id) => {
    let updated = [...formData.selectedQuestions];

    if (updated.includes(id)) {
      updated = updated.filter((q) => q !== id);
    } else {
      updated.push(id);
    }

    setFormData({ ...formData, selectedQuestions: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      exam: formData.exam,
      subject: formData.subject,
      class: formData.class,
      duration: formData.duration,
      max_marks: formData.max,
      questions: formData.selectedQuestions
    };

    try {
      const res = await axios.post(
        `${BASE_URL}/createQuestionPaper`,
        payload
      );

      if (res.data.status === "success") {
        setMessage({ success: "Saved Successfully", error: "" });

        // ✅ REFRESH FROM DATABASE (REAL DATA)
        loadCreatedPapers();

        loadQuestions();
      } else {
        setMessage({ error: "Failed to Save", success: "" });
      }
    } catch {
      setMessage({ error: "Something went wrong", success: "" });
    }
  };

  return (
    <div className="innerview">

      <div className="message">
        {message.error && <div className="error-bar">{message.error}</div>}
        {message.success && <div className="success-bar">{message.success}</div>}
      </div>

      <button className="float">✏️</button>

      <div className="filter-bar">
        <p>
          <input
            type="checkbox"
            checked={filter.enabled}
            onChange={(e) =>
              setFilter({ ...filter, enabled: e.target.checked })
            }
          /> Enable Filter
        </p>

        <select
          value={filter.class}
          onChange={(e) => {
            const selectedClass = e.target.value;

            setFilter({
              ...filter,
              class: selectedClass,
              subject: ""
            });

            fetchSubjects(selectedClass);
          }}
        >
          {classes.map((c) => (
            <option key={c.Classname}>{c.Classname}</option>
          ))}
        </select>

        <select
          value={filter.subject}
          onChange={(e) =>
            setFilter({ ...filter, subject: e.target.value })
          }
        >
          {subjects.map((s, i) => (
            <option key={i} value={s.Subjectname}>
              {s.Subjectname}
            </option>
          ))}
        </select>

        <button onClick={filterQuestions}>Apply</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">

          <div>
            <p>Exam Name</p>
            <input name="exam" onChange={handleChange} />

            <p>Class</p>
            <select
              name="class"
              value={formData.class}
              onChange={(e) => {
                const selectedClass = e.target.value;

                handleChange(e);

                setFormData((prev) => ({
                  ...prev,
                  subject: ""
                }));

                fetchSubjects(selectedClass);
              }}
            >
              {classes.map((c) => (
                <option key={c.Classname}>{c.Classname}</option>
              ))}
            </select>

            <p>Maximum Marks</p>
            <input name="max" onChange={handleChange} />
          </div>

          <div>
            <p>Subject</p>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
            >
              {subjects.map((s, i) => (
                <option key={i} value={s.Subjectname}>
                  {s.Subjectname}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p>Duration</p>
            <input name="duration" onChange={handleChange} />
            <button type="submit" className="crp_btn">Create</button>
          </div>

        </div>

        

      </form>

      {/* ✅ CREATED PAPERS TABLE */}
      <h3>Created Question Papers</h3>
    {/* TABLE */}
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
          
          {createdPapers.map((p, index) => (
            <tr key={index}>
               <td>
        <input
          type="checkbox"
          checked={formData.selectedQuestions.includes(p.id)}
          onChange={() => handleCheckbox(p.id)}
        />
      </td>
              <td>{p.id}</td>
              <td>{p.content}</td>
              <td>{p.max_marks}</td>
              <td>{p.class}</td>
              <td>{p.subject}</td>
              <td>{p.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default CreateQuestionPaper;