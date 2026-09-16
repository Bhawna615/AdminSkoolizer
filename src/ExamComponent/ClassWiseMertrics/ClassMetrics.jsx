import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const BASE_URL = "http://localhost/kkblossom/api.php/Adminapi/AdminExam";

const ClassMetrics = () => {
  const location = useLocation();
  const className = location.state?.className;

  const [metrics, setMetrics] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentMetrics, setStudentMetrics] = useState({}); // ✅ object

  useEffect(() => {
    if (className) {
      axios
        .get(`${BASE_URL}/getClassWiseMetrics/${className}`)
        .then((res) => {
          setMetrics(res.data.metrics || []);
          setStudents(res.data.students || []);
          setStudentMetrics(res.data.studentMetrics || {}); // ✅ object
        })
        .catch((err) => console.log(err));
    }
  }, [className]);

  const exportCSV = () => {
    let csv = [];
    let rows = document.querySelectorAll("table tr");

    rows.forEach((row) => {
      let cols = row.querySelectorAll("td, th");
      let rowData = [];

      cols.forEach((col) => rowData.push(col.innerText));
      csv.push(rowData.join(","));
    });

    let blob = new Blob([csv.join("\n")], { type: "text/csv" });
    let link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = `Class_${className}_Metrics.csv`;
    link.click();
  };

  // ✅ Convert object → array (important)
  const allStudentMetrics = Object.values(studentMetrics);

  return (
    <div className="col-md-12 innerview">
      <table className="table table-responsive table-bordered">
        
        {/* HEADER */}
        <thead className="dataTableHead">
          <tr>
            <th style={{color:"#fff"}}>Roll No.</th>
            <th style={{color:"#fff"}}>Name</th>

            {metrics.map((metric) => (
              <th key={metric.metric_id} style={{color:"#fff"}}>
                {metric.metric_name}
              </th>
            ))}
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="dataTableBody">
          {students.map((student) => (
            <tr key={student.id} >
              <td>{student.Rollno}</td>
              <td>{student.Name}</td>

              {metrics.map((metric) => (
                <td key={metric.metric_id}>
                  {allStudentMetrics.map((group) =>
                    group.map((sm, index) => {
                      if (
                        sm.student_id === student.id &&
                        sm.metric_id === metric.metric_id
                      ) {
                        return <span key={index}>{sm.mark}</span>;
                      }
                      return null;
                    })
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <button
        style={{
          background: "#f95555",
          color: "white",
          border: "none",
          padding: "5px 25px",
        }}
        onClick={exportCSV}
      >
        Export to CSV
      </button>
    </div>
  );
};

export default ClassMetrics;