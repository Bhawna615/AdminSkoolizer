import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Report.css";
import schoolLogo from "../images/school-logo.png";
import userLogo from "../images/user.svg";

const ReportCard = () => {
  const { id: studentId } = useParams();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studentId) {
      setError("Student ID missing in URL");
      setLoading(false);
      return;
    }

    const fetchReport = async () => {
      try {
        const formData = new FormData();
        formData.append("id", studentId);

        const res = await axios.post(
          "http://localhost/kkblossom/api.php/Adminapi/AdminReport/ReportCard",
          formData,
          { withCredentials: true }
        );

        console.log("API RESPONSE:", res.data); // ✅ debug

        if (res.data.status) {
          setReportData(res.data.data);   // ✅ FIXED HERE
        } else {
          setError(res.data.message || "No report found");
        }
      } catch (err) {
        console.error(err);
        setError("Server error while fetching report");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [studentId]);

  if (loading) return <p>Loading report...</p>;

  if (error || !reportData?.student) {
    return (
      <div>
        <p style={{ color: "red" }}>
          {error || "No report found for this student."}
        </p>
        <pre>{JSON.stringify(reportData, null, 2)}</pre>
      </div>
    );
  }

  const {
    student,
    subjects = [],
    marks = [],
    metrics = [],
  } = reportData;

  let grandTotal = 0;
  let totalMaxMarks = 0;

  const percentageValue =
    totalMaxMarks > 0 ? (grandTotal / totalMaxMarks) * 100 : 0;

  return (
    <div className="report-card-container">

      {/* Header */}
      <div className="row header" style={{ padding: "0px 25px", margin: 0 }}>
        <div className="col-3 report-school-logo">
          <img src={schoolLogo} alt="School Logo"  />
        </div>
        <div className="col-9 school-info" style={{ textAlign: "center" }}>
          <p className="school-name">
            {student?.schoolName || "KK BLOSSOMS SCHOOL"}
          </p>
          <p style={{ fontSize: "14px", margin: 0 }}>
            {student?.schoolAddress || "Rabaun, Solan (H.P)"}
          </p>
        </div>
      </div>

      {/* Report Card Title */}
      <table className="table table-bordered" style={{ marginBottom: 0, marginTop: 0 }}>
        <thead className="report-card-table-head">
          <tr>
            <th>Report Card: Academic Session 2024-25</th>
          </tr>
        </thead>
      </table>

      {/* Student Info */}
      <div className="row info-container" style={{ margin: 0 }}>
        <div className="col-10" style={{ padding: 0 }}>
          <table className="table" style={{ marginBottom: "30px", textAlign: "left" }}>
            <tbody className="report-card-table-body">
              <tr>
                <td className="student-detail">Student's Name: {student?.Name}</td>
                <td className="student-detail">Class: {student?.Class?.split("-")[0]}</td>
                <td className="student-detail">Section: {student?.Class?.split("-")[1]}</td>
              </tr>
              <tr>
                <td className="student-detail">Father's Name: {student?.Fname}</td>
                <td className="student-detail">Mother's Name: {student?.Mname}</td>
                <td className="student-detail">Roll No: {student?.Rollno}</td>
              </tr>
              <tr>
                <td className="student-detail">Adm. No: {student?.Admno}</td>
                <td className="student-detail">
                  D.O.B: {student?.Dob ? new Date(student.Dob).toLocaleDateString("en-GB") : "-"}
                </td>
                <td className="student-detail">Gender: {student?.gender}</td>
              </tr>
              <tr>
                <td className="student-detail">Height: {student?.height} cm</td>
                <td className="student-detail">Weight: {student?.weight} Kg</td>
                <td className="student-detail">B.Gr: {student?.blood_group}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="col-2" style={{ padding: 0 }}>
          <img
            src={userLogo}
            className="student-img"
            alt="student"
            style={{ height: "120px", margin: "35px" }}
          />
        </div>
      </div>

      {/* Scholastic Result Table */}
      <table className="table" style={{ marginTop: 0, marginBottom: "30px" }}>
        <thead className="report-card-table-head">
          <tr>
            <th colSpan="12">Scholastic Result</th>
          </tr>

          <tr>
            <th>Subjects</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody className="report-card-table-body">
          {subjects.map((subject, index) => {
            const subjectMarks = marks.filter(
              (m) => m.subject === subject.Subject
            );

            const total = subjectMarks.reduce(
              (sum, m) => sum + Number(m.marksObtained || 0),
              0
            );

            grandTotal += total;
            totalMaxMarks += 100;

            return (
              <tr key={index}>
                <td>{subject.Subject}</td>
                <td>{total}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Grand Total */}
      <table className="table table-bordered">
        <thead className="report-card-table-head">
          <tr>
            <th>
              Grand Total:
              <input
                type="text"
                className="report-card-input"
                value={`${grandTotal}/${totalMaxMarks}`}
                readOnly
              />
            </th>

            <th>
              Percentage:
              <input
                type="text"
                className="report-card-input"
                value={
                  totalMaxMarks > 0
                    ? `${((grandTotal / totalMaxMarks) * 100).toFixed(1)}%`
                    : "0%"
                }
                readOnly
              />
            </th>
          </tr>
        </thead>
      </table>

    </div>
  );
};

export default ReportCard;