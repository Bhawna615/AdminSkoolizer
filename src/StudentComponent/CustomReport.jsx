import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./CustomReport.css";
import schoolLogo from "../images/school-logo.png";
import userLogo from "../images/user.svg";

const CustomReport = () => {
  const { id: studentId } = useParams();
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

        if (res.data?.status) {
          setReportData(res.data.data);
        } else {
          console.error(res.data?.message);
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
    metrics?.find((m) => m.metric_name === "Attendance" && m.ability === "Present")?.mark || "191";
  const totalDays =
    metrics?.find((m) => m.metric_name === "Attendance" && m.ability === "Total Days")?.mark || "199";
  const attendancePercentage =
    present && totalDays ? ((present / totalDays) * 100).toFixed(1) + "%" : "96.0%";

  const remarks =
    reportData?.remarks ||
    student?.remarks ||
    "Recognize your potential and put your best efforts to flourish in life.";

  return (
    <div className="col-xs-12" style={{ padding: "10px", backgroundColor: "#fff" }}>
      {/* SCHOOL HEADER */}
      <div
        className="row"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}
      >
        <div className="col-3" style={{ textAlign: "left" }}>
          <img src={schoolLogo} className="school-logo" alt="School Logo" style={{ height: "100px" }} />
        </div>
        <div className="col-6" style={{ textAlign: "center" }}>
          <p
            className="top-details"
            style={{ fontSize: "22px", fontWeight: "900", textTransform: "uppercase", margin: 0 }}
          >
            KK BLOSSOMS SCHOOL
          </p>
          <p className="top-details" style={{ fontSize: "12px", margin: "2px 0" }}>
            Rabaun, Solan (H.P)
          </p>
          <p className="top-details" style={{ fontSize: "12px", margin: "2px 0" }}>
            Website: www.kkblossomschool.org/
          </p>
          <p className="top-details" style={{ fontSize: "12px", margin: "2px 0" }}>
            Recognition Number: 16/2022-27
          </p>
          <p className="top-details" style={{ fontSize: "12px", margin: "2px 0" }}>
            UDISE No: 02090112903
          </p>
        </div>
        <div className="col-3"></div>
      </div>

      {/* STUDENT INFO TABLE & PHOTO */}
      <div
        className="info-container"
        style={{
          display: "flex",
          flexDirection: "row",
          border: "1px solid #000",
          marginBottom: "5px",
          width: "100%",
          alignItems: "stretch"
        }}
      >
        {/* Left Side: Title Header + Student Details Table */}
        <div style={{ flex: "1", display: "flex", flexDirection: "column", borderRight: "1px solid #000" }}>
          <div
            style={{
              textAlign: "center",
              fontSize: "13px",
              fontWeight: "bold",
              padding: "4px",
              borderBottom: "1px solid #000",
              backgroundColor: "#f8f9fa"
            }}
          >
            Report Card: Academic Session 2024-25
          </div>
          <table className="table table-bordered" style={{ width: "100%", margin: 0, fontSize: "12px", height: "100%" }}>
            <tbody className="report-card-table-body" style={{ textAlign: "left" }}>
              <tr>
                <td><b>STUDENT'S NAME:</b> {student?.Name || "ADITYA"}</td>
                <td><b>CLASS:</b> {student?.Class?.charAt(0) || "7"}</td>
                <td><b>SECTION:</b> {student?.Class?.substring(2) || "A"}</td>
              </tr>
              <tr>
                <td><b>FATHER'S NAME:</b> {student?.Fname || "SUMAN KUMAR"}</td>
                <td><b>MOTHER'S NAME:</b> {student?.Mname || "PREETI"}</td>
                <td><b>ROLL NO:</b> {student?.Rollno || "3"}</td>
              </tr>
              <tr>
                <td><b>ADM. NO.:</b> {student?.Admno || "BS-806"}</td>
                <td><b>D.O.B:</b> {student?.Dob || "26-05-2013"}</td>
                <td><b>GENDER:</b> {student?.gender || "M"}</td>
              </tr>
              <tr>
                <td><b>HEIGHT:</b> {student?.height || "137"} CM</td>
                <td><b>WEIGHT:</b> {student?.weight || "32"} KG</td>
                <td><b>B. GR:</b> {student?.blood_group || "B+"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right Side: Photo Container */}
        <div
          style={{
            width: "150px",
            minWidth: "150px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "5px"
          }}
        >
          <img
            src={student?.photo || userLogo}
            style={{ maxHeight: "120px", maxWidth: "100%", objectFit: "contain" }}
            alt="Student Photo"
          />
        </div>
      </div>

      {/* SCHOLASTIC RESULT */}
      {/* SCHOLASTIC RESULT */}
<div className="col-xs-12" style={{ padding: 0 }}>
  <table
    className="table table-bordered"
    style={{ width: "100%", textAlign: "center",margin:0, fontSize: "11px", marginBottom: "5px" }}
  >
    <thead className="report-card-table-head">
      <tr>
        <th colSpan={6} style={{ fontWeight: "bold", fontSize: "12px" }}>
          Scholastic Result
        </th>
      </tr>
      <tr>
        <th rowSpan={2} style={{ verticalAlign: "middle" }}>
          Subjects
        </th>
        <th>Periodic Test-II</th>
        <th>NB-II</th>
        <th>SEA-II</th>
        <th>Yearly Exam</th>
        <th>Total</th>
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
      {subjects && subjects.length > 0 ? (
        subjects.map((sub, idx) => (
          <tr key={idx}>
            <td style={{ textAlign: "left", paddingLeft: "10px" }}>
              {sub.Subject || sub.subject_name}
            </td>
            <td>{sub?.pt2 || ""}</td>
            <td>{sub?.nb2 || ""}</td>
            <td>{sub?.sea2 || ""}</td>
            <td>{sub?.yearly || ""}</td>
            <td>{sub?.total || ""}</td>
          </tr>
        ))
      ) : (
        ["English", "Hindi", "Mathematics", "Science", "Social Science", "Sanskrit", "Computer"].map(
          (subName, idx) => (
            <tr key={idx}>
              <td style={{ textAlign: "left", paddingLeft: "10px" }}>{subName}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          )
        )
      )}
    </tbody>
  </table>

        {/* GRAND TOTAL */}
        <table
          className="table table-bordered"
          style={{ width: "100%", textAlign: "center",margin:0, fontSize: "12px", marginBottom: "5px" }}
        >
          <tbody>
            <tr>
              <td style={{ width: "33%" }}><b>Grand Total:</b> {reportData?.grandTotal || ""}</td>
              <td style={{ width: "33%" }}><b>Percentage:</b> {reportData?.percentage || ""}</td>
              <td style={{ width: "34%" }}><b>Overall Grade:</b> {reportData?.overallGrade || ""}</td>
            </tr>
          </tbody>
        </table>

        {/* GRADING SCALE */}
        <table
          className="table table-bordered"
          style={{ width: "100%", textAlign: "center",margin:0, fontSize: "11px", marginBottom: "5px" }}
        >
          <thead>
            <tr>
              <th colSpan={9} style={{ fontWeight: "bold", fontSize: "12px" }}>
                Grading Scale
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><b>Mark Range</b></td>
              <td>100 - 91</td>
              <td>90 - 81</td>
              <td>80 - 71</td>
              <td>70 - 61</td>
              <td>60 - 51</td>
              <td>50 - 41</td>
              <td>40 - 33</td>
              <td>32 - 0</td>
            </tr>
            <tr>
              <td><b>Grades</b></td>
              <td>A1</td>
              <td>A2</td>
              <td>B1</td>
              <td>B2</td>
              <td>C1</td>
              <td>C2</td>
              <td>D</td>
              <td>E</td>
            </tr>
          </tbody>
        </table>

        {/* CO-SCHOLASTIC RESULT */}
        {metrics && (
          <table
            className="table table-bordered"
            style={{ width: "100%", textAlign: "center",margin:0, fontSize: "11px", marginBottom: "5px" }}
          >
            <thead className="report-card-table-head">
              <tr>
                <th colSpan={3} style={{ fontWeight: "bold", fontSize: "12px" }}>
                  Co Scholastic Result
                </th>
              </tr>
              <tr>
                <th style={{ width: "50%" }}>Activities</th>
                <th style={{ width: "25%" }}>Term-1</th>
                <th style={{ width: "25%" }}>Term-2</th>
              </tr>
            </thead>
            <tbody className="report-card-table-body">
              {["Art/Music", "Health & Physical Education"].map((activity, idx) => (
                <tr key={idx}>
                  <td style={{ textAlign: "left", paddingLeft: "10px" }}>{activity}</td>
                  <td>
                    {metrics.find((m) => m.metric_name === "Term-1" && m.ability === activity)?.mark || "A"}
                  </td>
                  <td>
                    {metrics.find((m) => m.metric_name === "Term-2" && m.ability === activity)?.mark || "A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ATTENDANCE */}
        <table
          className="table table-bordered"
          style={{ width: "100%", textAlign: "center",margin:0, fontSize: "12px", marginBottom: "10px" }}
        >
          <thead>
            <tr>
              <th colSpan={3} style={{ fontWeight: "bold", fontSize: "12px" }}>
                Attendance
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ width: "33%" }}><b>Present:</b> {present}</td>
              <td style={{ width: "33%" }}><b>Total Days:</b> {totalDays}</td>
              <td style={{ width: "34%" }}><b>Percentage:</b> {attendancePercentage}</td>
            </tr>
          </tbody>
        </table>

        {/* REMARKS & RESULT */}
        <div style={{ marginTop: "10px", fontSize: "13px" }}>
          <p style={{ margin: "2px 0" }}><b>Remarks:</b> {remarks}</p>
          <p style={{ margin: "2px 0" }}><b>Result: {result || "Promoted to Class 8"}</b></p>
        </div>

        {/* SIGNATURES */}
        <div
  className="signature-container"
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: "40px",
    fontSize: "13px"
  }}
>
  <p style={{ margin: 0, textAlign: "left" }}>
    <b>Teacher's Signature</b>
  </p>
  <p style={{ margin: 0, textAlign: "right" }}>
    <b>Principal's Signature</b>
  </p>
</div>
      </div>
    </div>
  );
};

export default CustomReport;