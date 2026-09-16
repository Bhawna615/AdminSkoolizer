import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost/kkblossom/api.php/Adminapi/AdminExam";

const ClassWiseMetrics = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [data, setData] = useState(null);

  // Load classes
  useEffect(() => {
    axios.get(`${BASE_URL}/getClasses`)
      .then(res => setClasses(res.data))
      .catch(err => console.log(err));
  }, []);

  // Fetch metrics
  const handleSubmit = () => {
    axios.get(`${BASE_URL}/getClassWiseMetrics/${selectedClass}`)
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  };

  return (
    <div>
      <h2>Classwise Metrics</h2>

      {/* Dropdown */}
      <select onChange={(e) => setSelectedClass(e.target.value)}>
        <option>Select Class</option>
        {classes.map((c, index) => (
          <option key={index} value={c.Classname}>
            Class {c.Classname}
          </option>
        ))}
      </select>

      <button onClick={handleSubmit}>Go</button>

      {/* Table */}
      {data && (
        <>
          <table border="1">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                {data.metrics.map((m) => (
                  <th key={m.metric_id}>{m.metric_name}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.students.map((student) => (
                <tr key={student.id}>
                  <td>{student.Rollno}</td>
                  <td>{student.Name}</td>

                  {data.metrics.map((metric) => {
                    const studentMetricList =
                      data.studentMetrics[student.id] || [];

                    const found = studentMetricList.find(
                      (m) => m.metric_id === metric.metric_id
                    );

                    return (
                      <td key={metric.metric_id}>
                        {found ? found.mark : "-"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={() => exportCSV()}>
            Export CSV
          </button>
        </>
      )}
    </div>
  );
};

export default ClassWiseMetrics;