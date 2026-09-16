import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost/kkblossom/api.php/Adminapi/AdminExam";

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
    const res = await axios.get(`${BASE_URL}/classes`);
    setClasses(res.data);

    if (res.data.length > 0) {
      setForm((prev) => ({ ...prev, class: res.data[0].Classname }));
    }
  };

  const fetchExamTypes = async () => {
    const res = await axios.get(`${BASE_URL}/getExamTypes`);
    setExamTypes(res.data);

    if (res.data.length > 0) {
      setForm((prev) => ({ ...prev, exam: res.data[0].Examtype }));
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
    <div className="innerview">
      <h2>Class Wise Report</h2>

      <form onSubmit={handleSubmit}>
        <div className="col-md-4">

          <p>Class</p>
          <select
            value={form.class}
            onChange={(e) =>
              setForm({ ...form, class: e.target.value })
            }
          >
            {classes.map((c, i) => (
              <option key={i} value={c.Classname}>
                Class {c.Classname}
              </option>
            ))}
          </select>

          <p>Exam Type</p>
          <select
            value={form.exam}
            onChange={(e) =>
              setForm({ ...form, exam: e.target.value })
            }
          >
            {examTypes.map((e, i) => (
              <option key={i} value={e.Examtype}>
                {e.Examtype}
              </option>
            ))}
          </select>

        </div>

        <button type="submit">Go</button>
      </form>
    </div>
  );
};

export default ClassWiseReportSelect;