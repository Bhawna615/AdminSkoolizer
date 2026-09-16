import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const BASE_URL = "http://localhost/kkblossom/api.php/Adminapi/AdminExam";

const ClassWiseReport = () => {
  const location = useLocation();

  const className = location.state?.class;
  const examType = location.state?.exam;

  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);

  // ✅ FIXED: dependency added
  useEffect(() => {
  if (className && examType) {
    fetchReport();
  }
}, [className, examType]);

  const fetchReport = async () => {
  try {
    const res = await axios.post(
      `${BASE_URL}/generateClassWiseReport`,
      {
        class: className,
        exam: examType
      }
    );

    console.log("FULL DATA:", res.data);

    setStudents(res.data.data.students);
    setExams(res.data.data.exams);
    setResults(res.data.data.results);

  } catch (error) {
    console.log("API ERROR:", error);
  }
};
  // helper
  const getMark = (studentRoll, examId) => {
    const r = results.find(
      (x) => x.Rollno === studentRoll && x.Examcode === examId
    );
    return r ? r.Marksobtained : "-";
  };

  return (
    <div className="innerview">

      <h2>
        Class {className} - {examType} Report
      </h2>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Name</th>

            {exams.map((e, i) => (
              <th key={i}>
                {e.Subject} ({e.Maxmarks})
              </th>
            ))}

            <th>Total</th>
            <th>Percentage</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s, i) => {
            let total = 0;
            let max = 0;

            return (
              <tr key={i}>
                <td>{s.Rollno}</td>
                <td>{s.Name}</td>

                {exams.map((e, j) => {
                  const mark = getMark(s.Rollno, e.id);

                  const num = isNaN(parseInt(mark)) ? 0 : parseInt(mark);

                  total += num;
                  max += parseInt(e.Maxmarks || 0);

                  return <td key={j}>{mark}</td>;
                })}

                <td>{total} / {max}</td>
                <td>
                  {max > 0 ? ((total / max) * 100).toFixed(1) : 0}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ClassWiseReport;