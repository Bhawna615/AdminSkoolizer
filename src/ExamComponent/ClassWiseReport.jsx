import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./ClassWiseReport.css";

const BASE_URL =
  "http://localhost/kkblossom/api.php/Adminapi/AdminExam";

const ClassWiseReport = () => {
  const location = useLocation();

  const className = location.state?.class;
  const examType = location.state?.exam;

  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);

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

  // =========================================================
  // GET MARK
  // =========================================================

  const getMark = (studentRoll, examId) => {
    const r = results.find(
      (x) =>
        x.Rollno === studentRoll &&
        x.Examcode === examId
    );

    return r ? r.Marksobtained : "-";
  };

  return (
    <div className="class-report-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="class-report-top">

        <div className="class-report-heading">

          <div className="class-report-icon">
            <i className="bi bi-bar-chart-line-fill"></i>
          </div>

          <div>
            <h2>
              Class {className} - {examType} Report
            </h2>

            <p>
              Student performance and examination results
            </p>
          </div>

        </div>

      </div>


      {/* =====================================================
          REPORT INFO
      ===================================================== */}

      <div className="report-info-row">

        <div className="report-info-card">

          <span className="report-info-label">
            CLASS
          </span>

          <strong>
            Class {className}
          </strong>

        </div>


        <div className="report-info-card">

          <span className="report-info-label">
            EXAM TYPE
          </span>

          <strong>
            {examType}
          </strong>

        </div>


        <div className="report-info-card">

          <span className="report-info-label">
            STUDENTS
          </span>

          <strong>
            {students.length}
          </strong>

        </div>


        <div className="report-info-card">

          <span className="report-info-label">
            SUBJECTS
          </span>

          <strong>
            {exams.length}
          </strong>

        </div>

      </div>


      {/* =====================================================
          REPORT TABLE
      ===================================================== */}

      <div className="class-report-table-card">

        <div className="report-table-header">

          <div>
            <h3>Student Results</h3>

            <p>
              Marks obtained in each subject
            </p>
          </div>

        </div>


        <div className="class-report-table-wrapper">

          <table className="class-report-table">

            <thead>

              <tr>

                <th className="sticky-roll">
                  ROLL NO
                </th>

                <th className="sticky-name">
                  NAME
                </th>


                {exams.map((e, i) => (

                  <th key={i} className="subject-header">

                    <span>
                      {e.Subject}
                    </span>

                    <small>
                      Max {e.Maxmarks}
                    </small>

                  </th>

                ))}


                <th className="total-header">
                  TOTAL
                </th>

                <th className="percentage-header">
                  PERCENTAGE
                </th>

              </tr>

            </thead>


            <tbody>

              {students.length > 0 ? (

                students.map((s, i) => {

                  let total = 0;
                  let max = 0;

                  return (

                    <tr key={i}>

                      <td className="roll-cell">
                        {s.Rollno}
                      </td>


                      <td className="name-cell">
                        {s.Name}
                      </td>


                      {exams.map((e, j) => {

                        const mark = getMark(
                          s.Rollno,
                          e.id
                        );

                        const num =
                          isNaN(parseInt(mark))
                            ? 0
                            : parseInt(mark);

                        total += num;

                        max += parseInt(
                          e.Maxmarks || 0
                        );

                        return (

                          <td
                            key={j}
                            className="marks-cell"
                          >
                            {mark}
                          </td>

                        );

                      })}


                      <td className="total-cell">

                        <strong>
                          {total}
                        </strong>

                        <span>
                          / {max}
                        </span>

                      </td>


                      <td className="percentage-cell">

                        <span>
                          {max > 0
                            ? (
                                (total / max) *
                                100
                              ).toFixed(1)
                            : 0}
                          %
                        </span>

                      </td>

                    </tr>

                  );

                })

              ) : (

                <tr>

                  <td
                    colSpan={
                      exams.length + 4
                    }
                    className="no-report-data"
                  >

                    <i className="bi bi-inbox"></i>

                    <span>
                      No student results found
                    </span>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default ClassWiseReport;