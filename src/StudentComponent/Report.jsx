import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Report.css";

import schoolLogo from "../images/school-logo.png";
import userLogo from "../images/user.svg";

const API_BASE = "http://localhost/kkblossom/api.php/Adminapi";

const Report = () => {
  const { id } = useParams();
  const reportRef = useRef(null);

  const [schoolInfo] = useState({
    schoolName: "KK BLOSSOMS SCHOOL",
    schoolAddress: "Rabaun, Solan (H.P)",
  });

  const [student, setStudent] = useState(null);
  const [report, setReport] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchReport();
    }
  }, [id]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_BASE}/AdminStudent/examReport?student_id=${id}`
      );

      const data = response.data.data || {};

      setStudent(data.student ?? null);
      setReport(Array.isArray(data.report) ? data.report : []);
      setMetrics(Array.isArray(data.metrics) ? data.metrics : []);

      setLoading(false);

      // Wait until React completely renders the report
      setTimeout(() => {
  window.requestAnimationFrame(() => {
    window.print();
  });
}, 2000);

    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to load report");
      setLoading(false);
    }
  };

  const { totalMarks, maxMarks, percentage } = useMemo(() => {
    let total = 0;
    let max = 0;

    report.forEach((row) => {
      total += parseFloat(row.Marksobtained) || 0;
      max += parseFloat(row.Maxmarks) || 0;
    });

    return {
      totalMarks: total,
      maxMarks: max,
      percentage: max
        ? Math.floor((total / max) * 100)
        : 0,
    };
  }, [report]);

  if (loading) {
    return (
      <div className="loading">
        Loading report...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        {error}
      </div>
    );
  }

  if (!student || Object.keys(student).length === 0) {
    return (
      <div className="error">
        No student found
      </div>
    );
  }

  return (
    <div
      className="report-container"
      ref={reportRef}
    >
      {/* HEADER */}
      <div className="report-header">

        <img
          src={schoolLogo}
          alt="School Logo"
          className="report-school-logo"
        />

        <div className="school-details">
          <h2>{schoolInfo.schoolName}</h2>

          <p>
            {schoolInfo.schoolAddress}
          </p>
        </div>

      </div>


      {/* TITLE */}

      <h3 className="report-title">
        EXAMINATION REPORT
      </h3>


      {/* STUDENT INFORMATION */}

      <div className="student-section">

        <div className="student-left">

          <p>
            This is to certify that{" "}
            <strong>
              {student?.Name}
            </strong>
          </p>

          <p>
            Mother's/Father's/Guardian's Name:{" "}
            <strong>
              {student?.Mname} / {student?.Fname}
            </strong>
          </p>

          <p>
            Date of Birth:{" "}
            <strong>
              {student?.Dob}
            </strong>
          </p>

        </div>


        <div className="student-right">

          <img
            src={userLogo}
            alt="Student"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />

        </div>

      </div>


      {/* MARKS TABLE */}

      <table className="report-table">

        <thead>
          <tr>
            <th>DATE</th>
            <th>SUBJECT</th>
            <th>EXAM TYPE</th>
            <th>MARKS OBTAINED</th>
            <th>MAX MARKS</th>
          </tr>
        </thead>

        <tbody>

          {report.map((row, index) => (

            <tr key={index}>

              <td>
                {row.Date || ""}
              </td>

              <td>
                {row.Subject || ""}
              </td>

              <td>
                {row.Examtype || ""}
              </td>

              <td>
                {row.Marksobtained || 0}
              </td>

              <td>
                {row.Maxmarks || 0}
              </td>

            </tr>

          ))}


          <tr className="total-row">

            <td>
              <strong>Total</strong>
            </td>

            <td></td>

            <td></td>

            <td>
              <strong>
                {totalMarks}
              </strong>
            </td>

            <td>
              <strong>
                {maxMarks}
              </strong>
            </td>

          </tr>

        </tbody>

      </table>


      {/* PERCENTAGE */}

      <p className="percentage">

        Percentage: {percentage} %

      </p>


      {/* FOOTER */}

      <div className="report-footer">

        <div className="date-place">

          <p>
            Date: ___________
          </p>

          <p>
            Place: ___________
          </p>

        </div>


        <div className="signature">

          Principal

        </div>


        <div className="signature controller">

          Controller of Examinations

        </div>

      </div>

    </div>
  );
};

export default Report;