import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ClassWiseReportSelect.css";

const BASE_URL =
  "http://localhost/kkblossom/api.php/Adminapi/AdminExam";

const ClassWiseReportSelect = () => {
  const [classes, setClasses] = useState([]);
  const [examTypes, setExamTypes] = useState([]);

  const [form, setForm] = useState({
    class: "",
    exam: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
    fetchExamTypes();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/classes`);

      setClasses(res.data);

      if (res.data.length > 0) {
        setForm((prev) => ({
          ...prev,
          class: res.data[0].Classname
        }));
      }
    } catch (err) {
      console.error("Error loading classes:", err);
    }
  };

  const fetchExamTypes = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getExamTypes`);

      setExamTypes(res.data);

      if (res.data.length > 0) {
        setForm((prev) => ({
          ...prev,
          exam: res.data[0].Examtype
        }));
      }
    } catch (err) {
      console.error("Error loading exam types:", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate("/dashboard/ExamComponent/ClassWiseReport", {
      state: {
        class: form.class,
        exam: form.exam
      }
    });
  };

  return (
    <div className="class-report-page">

      {/* PAGE HEADER */}
      <div className="class-report-header">
        <div>
          <h2>Class Wise Report</h2>
          <p>
            Select a class and examination type to view the report.
          </p>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="class-report-card">

        <div className="class-report-card-header">
          <div className="report-icon">
            <i className="bi bi-bar-chart-line"></i>
          </div>

          <div>
            <h3>Generate Report</h3>
            <p>Select the required details below.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="report-form-grid">

            {/* CLASS */}
            <div className="report-form-group">

              <label htmlFor="report-class">
                Class
              </label>

              <select
                id="report-class"
                value={form.class}
                onChange={(e) =>
                  setForm({
                    ...form,
                    class: e.target.value
                  })
                }
              >
                {classes.map((c, i) => (
                  <option
                    key={i}
                    value={c.Classname}
                  >
                    Class {c.Classname}
                  </option>
                ))}
              </select>

            </div>

            {/* EXAM TYPE */}
            <div className="report-form-group">

              <label htmlFor="report-exam">
                Exam Type
              </label>

              <select
                id="report-exam"
                value={form.exam}
                onChange={(e) =>
                  setForm({
                    ...form,
                    exam: e.target.value
                  })
                }
              >
                {examTypes.map((e, i) => (
                  <option
                    key={i}
                    value={e.Examtype}
                  >
                    {e.Examtype}
                  </option>
                ))}
              </select>

            </div>

          </div>

          {/* BUTTON */}
          <div className="report-button-area">

            <button
              type="submit"
              className="generate-report-btn"
            >
              <i className="bi bi-file-earmark-bar-graph"></i>
              Go
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default ClassWiseReportSelect;