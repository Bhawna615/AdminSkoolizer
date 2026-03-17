import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./CustomReport.css";
import schoolLogo from "../images/school-logo.png";
import userLogo from "../images/user.svg";

const CustomReport = () => {
  const { id: studentId } = useParams(); // Extract studentId from URL
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;

    const fetchReport = async () => {
      try {
        const formData = new FormData();
        formData.append("id", studentId);

        const res = await axios.post(
          "http://localhost/kkblossom/api.php/Adminapi/AdminReport/customizedReportCard",
          formData,
          { withCredentials: true }
        );

        if (res.data.status) {
          setReportData(res.data.data);
          // Auto-print removed
        } else {
          console.error(res.data.message);
        }
      } catch (err) {
        console.error("Error fetching report:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [studentId]);

  if (loading) return <p>Loading report...</p>;
  if (!reportData) return <p>No report found.</p>;

  const { student, subjectsOrder, subjects, metrics, result } = reportData;

  // Attendance calculation
  const present =
    metrics?.find((m) => m.metric_name === "Attendance" && m.ability === "Present")?.mark || "";
  const totalDays =
    metrics?.find((m) => m.metric_name === "Attendance" && m.ability === "Total Days")?.mark || "";
  const attendancePercentage =
    present && totalDays ? ((present / totalDays) * 100).toFixed(1) + "%" : "";

  // Remarks: check reportData first, fallback to student
  const remarks = reportData?.remarks || student?.remarks || "";

  return (
    <div className="col-xs-12">
      {/* SCHOOL HEADER */}
      <div className="row" style={{ display: "flex", padding: 0 }}>
        <div className="col-3">
          <img src={schoolLogo} className="school-logo" alt="School Logo" />
        </div>
        <div className="col-6" style={{ textAlign: "center" }}>
          <p
            className="top-details"
           style={{fontSize: "24px", fontWeight: "900",
             textTransform: "uppercase",padding:"0px",margin:"0px" }}
          >
            KK BLOSSOMS SCHOOL
          </p>
          <p className="top-details"style={{fontSize: "14px",padding:"0px",margin:"0px" }}>Rabaun, Solan (H.P)</p>
          <p className="top-details"style={{fontSize: "14px",padding:"0px",margin:"0px" }}>Website: www.kkblossomschool.org/</p>
          <p className="top-details"style={{fontSize: "14px",padding:"0px",margin:"0px" }}>Recognition Number: 16/2022-27</p>
          <p className="top-details"style={{fontSize: "14px",padding:"0px",margin:"0px" }}>UDISE No: 02090112903</p>
        </div>
      </div>

      {/* STUDENT INFO */}
      <div className="row info-container" style={{ display: "flex", padding: 0 }}>
        <div className="col-10" style={{ padding: 0 }}>
          <table className="table table-responsive" style={{ marginBottom: 0 }}>
  <thead className="report-card-table-head">
    <tr>
      <th colSpan={3} style={{ textAlign: "center", fontSize: "14px", fontWeight: 600 }}>
        Report Card: Academic Session 2024-25
      </th>
    </tr>
  </thead>
  <tbody className="report-card-table-body" style={{textAlign:"left"}}>
    <tr>
      <td className="student-detail">Student's Name: {student?.Name}</td>
      <td className="student-detail">Class: {student?.Class?.charAt(0)}</td>
      <td className="student-detail">Section: {student?.Class?.substring(2)}</td>
    </tr>
    <tr>
      <td className="student-detail">Father's Name: {student?.Fname}</td>
      <td className="student-detail">Mother's Name: {student?.Mname}</td>
      <td className="student-detail">Roll No: {student?.Rollno}</td>
    </tr>
    <tr>
      <td className="student-detail">Adm. No: {student?.Admno}</td>
      <td className="student-detail">D.O.B: {student?.Dob}</td>
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
        <div className="col-2" style={{ padding: 0, textAlign: "right" }}>
            <img src={userLogo} style={{ height: 150, width: 150 }} alt="User" />
        
        </div>
      </div>

      {/* SCHOLASTIC RESULT */}
      <div className="col-xs-12" style={{ padding: 0, marginTop: 5 }}>
        <table className="table table-responsive">
          <thead className="report-card-table-head">
            <tr>
              <th colSpan={12}>Scholastic Result</th>
            </tr>
            <tr>
              <th rowSpan={2} className="table-headings">Subjects</th>
              <th className="table-headings">Periodic Test-II</th>
              <th className="table-headings">NB-II</th>
              <th className="table-headings">SEA-II</th>
              <th className="table-headings">Yearly Exam</th>
              <th className="table-headings">Total</th>
            </tr>
            <tr>
              <th>Total-10</th>
              <th>Total-5</th>
              <th>Total-5</th>
              <th>Total-80</th>
              <th>Total-100</th>
            </tr>
          </thead>
          <tbody className="report-card-table-body">
            {subjectsOrder?.map((subName, idx) =>
              subjects?.filter(s => s.Subject === subName).map((sub, i) => (
                <tr key={`${idx}-${i}`}>
                  <td>{sub.Subject}</td>
                  {[...Array(5)].map((_, j) => (
                    <td key={j}><input type="text" className="report-card-input" /></td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Grand Total */}
        <table className="table table-bordered" style={{ marginBottom: 0 }}>
          <thead className="report-card-table-head">
            <tr>
              <th>Grand Total: <input type="text" className="report-card-input" /></th>
              <th>Percentage: <input type="text" className="report-card-input" /></th>
              <th>Overall Grade: <input type="text" className="report-card-input" /></th>
            </tr>
          </thead>
        </table>

        {/* Co-Scholastic Result */}
        {metrics && (
          <div className="col-xs-12 metrics-box" style={{ padding: 0 }}>
            <table className="table table-responsive" style={{ marginBottom: 0 }}>
              <thead className="report-card-table-head">
                <tr>
                  <th colSpan={3}>Co Scholastic Result</th>
                </tr>
                <tr>
                  <th>Activities</th>
                  <th>Term-1</th>
                  <th>Term-2</th>
                </tr>
              </thead>
              <tbody className="report-card-table-body">
                {["Art/Music", "Health & Physical Education"].map((activity, idx) => (
                  <tr key={idx}>
                    <td>{activity}</td>
                    <td>{metrics.find(m => m.metric_name === "Term-1" && m.ability === activity)?.mark}</td>
                    <td>{metrics.find(m => m.metric_name === "Term-2" && m.ability === activity)?.mark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Attendance */}
        <div className="col-md-12" style={{ padding: 0, marginTop: 25 }}>
          <table className="table table-bordered">
            <thead className="report-card-table-head">
              <tr>
                <th>Present: <input type="text" className="report-card-input" value={present} readOnly /></th>
                <th>Total Days: <input type="text" className="report-card-input" value={totalDays} readOnly /></th>
                <th>Percentage: <input type="text" className="report-card-input" value={attendancePercentage} readOnly /></th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Remarks & Signatures */}
        <p style={{ fontFamily: "Nunito-Semibold", fontWeight: 900, fontSize: 14, marginBottom: 0,padding:"5px 25px" }}>
          <b>Remarks: {remarks}</b>
        </p>
        <p className="signature-container-names"style={{padding:"5px 25px" }}>
          <b>Result: {result}</b>
        </p>
        <div className="row signature-container" style={{ paddingTop: 30 }}>
          <div className="col-6" style={{ textAlign: "left",padding:"5px 25px" }}>
            <p className="signature-container-names"><b>Teacher's Signature</b></p>
          </div>
          <div className="col-6" style={{ textAlign: "right",padding:"5px 25px" }}>
            <p className="signature-container-names"><b>Principal's Signature</b></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomReport;
