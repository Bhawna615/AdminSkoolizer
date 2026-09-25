import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SelectClass.css";
const BASE_URL = "http://localhost/kkblossom/api.php/Adminapi/AdminExam";

const SelectClass = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${BASE_URL}/getClasses`)
      .then((res) => setClasses(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedClass) {
      alert("Please select class");
      return;
    }

    // SAME FLOW as earlier (React navigation)
    navigate("/dashboard/ExamComponent/ClassWiseMetrics/ClassMetrics", {
      state: { className: selectedClass },
    });
  };

  return (
    <>
      {/* HEADER (same as PHP) */}
      {/* <Header /> */}

      <div className="col-md-12 innerview">
        <form onSubmit={handleSubmit}>
          <div className="col-md-4">
            <p className="headings">Class</p>

            <select
              name="class"
              className="form-select"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              style={{width:"80%",height:"50px"}}
            >
              <option value="">Select Class</option>

              {classes.map((row, index) => (
                <option key={index} value={row.Classname}>
                  {"Class " + row.Classname}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-12">
            {/* EXACT SAME LOOK as PHP */}
            <input
              type="submit"
              value="Go"
              className="form-submit"
            />
          </div>
        </form>
      </div>

      {/* FOOTER */}
      {/* <Footer /> */}
    </>
  );
};

export default SelectClass;