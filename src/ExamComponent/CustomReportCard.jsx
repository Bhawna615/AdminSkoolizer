import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import schoolLogo from "../images/school-logo.png";
import "./CustomReportCard.css";

const BASE_URL = "http://localhost/kkblossom/api.php/Adminapi/AdminExam";

const CustomReportCard = () => {
  const location = useLocation();
  const studentId = location.state?.studentId;

  const [data, setData] = useState(null);

  useEffect(() => {
    if (studentId) {
      axios
        .get(`${BASE_URL}/getCustomReportCard/${studentId}`)
        .then((res) => {
          setData(res.data);

          // ✅ AUTO PRINT AFTER DATA LOAD
          setTimeout(() => {
            window.print();
          }, 500);
        })
        .catch((err) => console.log(err));
    }
  }, [studentId]);

  if (!data) return <p>Loading...</p>;

  const student = data?.student || {};
  const subjects = data?.subjects || [];

  return (
    <div className="print-container">

      {/* ================= HEADER ================= */}
      <div className="box">
        <div className="header">
          <img src={schoolLogo} alt="logo" className="logo" />

          <div className="school-details">
            <h2>KK BLOSSOMS</h2>
            <p>Housing Board Colony, Sanjauli, Shimla</p>
          </div>
        </div>

        <div className="center bold border-top">
          ANNUAL EXAMINATION
        </div>

        <div className="flex border-top">
          <span>CBSE Affiliation Code: 630180</span>
          <span>School No: 43169</span>
        </div>

        <div className="center bold border-top">
          CLASS {student.Class} ({new Date().getFullYear() - 1}-
          {new Date().getFullYear()})
        </div>
      </div>

      {/* ================= STUDENT PROFILE ================= */}
      <div className="box no-top">
        <div className="section-title">STUDENT PROFILE</div>

        <table className="no-border-table">
          <tbody>
            <tr>
              <td><b>STUDENT NAME:</b></td>
              <td>{student.Name}</td>
              <td><b>DATE OF BIRTH:</b></td>
              <td>{student.Dob}</td>
            </tr>
            <tr>
              <td><b>FATHER NAME:</b></td>
              <td>{student.Fname}</td>
              <td><b>ROLL NO:</b></td>
              <td>{student.Rollno}</td>
            </tr>
            <tr>
              <td><b>MOTHER NAME:</b></td>
              <td>{student.Mname}</td>
              <td><b>AADHAR NO:</b></td>
              <td>{student.Aadharno || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ================= SUBJECT TABLE ================= */}
      <table className="marks-table box table no-top">
        <thead>
          <tr>
            <th>SUBJECTS</th>
            <th>UNIT-2 (30)</th>
            <th>TERM-2 (70)</th>
            <th>TOTAL (100)</th>
            <th>GRADE</th>
          </tr>
        </thead>

        <tbody>
          {subjects.map((sub, i) => (
            <tr key={i}>
              <td>{sub.Subjectname}</td>
              <td><input /></td>
              <td><input /></td>
              <td><input /></td>
              <td><input /></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= CO SCHOLASTIC ================= */}
      <div className="box no-top">
        <div className="section-title">Co Scholastic Areas</div>

        <table className="marks-table table">
          <thead>
            <tr>
              <th>ACTIVITIES</th>
              <th>GRADE</th>
            </tr>
          </thead>

          <tbody>
            {[
              "Personal Hygiene, Discipline, Manners & Etiquettes",
              "Dance",
              "Drawing",
              "Sports",
            ].map((act, i) => (
              <tr key={i}>
                <td>{act}</td>
                <td>A</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= RESULT ================= */}
      <div className="box no-top">
        <table className="table">
          <tbody>
            <tr>
              <td><b>TOTAL MARKS:</b> 330</td>
              <td><b>MARKS OBTAINED:</b> 275</td>
              <td><b>PERCENTAGE:</b> 83.3%</td>
              <td><b>GRADE:</b> A2</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ================= REMARK ================= */}
      <div className="box no-top remark-box">
        <b>Class Teacher's Remark:</b>
      </div>

      {/* ================= PROMOTION ================= */}
      <div className="box no-top remark-box">
        <b>Promoted to:</b>
      </div>

      {/* ================= SIGNATURE ================= */}
      <div className="signatures">
        <span>Class Incharge</span>
        <span>Coordinator</span>
        <span>Examination Incharge</span>
        <span>Principal</span>
      </div>

    </div>
  );
};

export default CustomReportCard;