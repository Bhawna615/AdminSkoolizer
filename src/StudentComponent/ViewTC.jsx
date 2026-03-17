import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ViewTC.css";
import schoolLogo from "../images/school-logo.png";

const API_BASE = "http://localhost/kkblossom/api.php/Adminapi";

const ViewTC = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.error("Student ID missing");
      setLoading(false);
      return;
    }

    console.log("Fetching TC for student ID:", id);

    // ✅ IMPORTANT: Use GET and pass ID in URL
    axios
      .get(`${API_BASE}/AdminStudent/viewTc/${id}`)
      .then((res) => {
        console.log("API response:", res.data);

        if (res.data.status) {
          setStudent(res.data.details); // already single object
        } else {
          console.error("Failed:", res.data.message);
          setStudent(null);
        }
      })
      .catch((err) => {
        console.error("API Error:", err.response?.data || err.message);
        setStudent(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (student) {
      window.print();
    }
  }, [student]);

  if (loading) return <div>Loading...</div>;
  if (!student) return <div>No data found for this student.</div>;

  const s = student;

  return (
    <div className="tc-style">
      <div
        className="school-name-container"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div className="school-logo-container">
          <img
            src={schoolLogo}
            className="school-logo"
            alt="School Logo"
            style={{ width: "100px" }}
          />
        </div>

        <div style={{ marginLeft: "35px" }}>
          <p className="school-name">
            {s.schoolName || "KK BLOSSOMS"}
          </p>
          <p
            className="school-address"
            style={{
              padding: 0,
              margin: 0,
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            {s.schoolAddress || "Rabaun, Solan (H.P)"} <br />
            Website: www.kkblossomschool.org/<br />
            Recognition Number: 16/2022-27<br />
            UDISE No: 02090112903
          </p>
        </div>
      </div>

      <div className="document-title-container">
        <p
          className="document-title"
          style={{
            fontWeight: 900,
            fontSize: "35px",
            textAlign: "center",
          }}
        >
          SCHOOL LEAVING CERTIFICATE
        </p>
      </div>

      <div
        className="document-body-container"
        style={{ padding: "50px" }}
      >
        <p>1. Name of the Pupil: <b>{s.name}</b></p>
        <p>2. Father's Name: <b>{s.father_name}</b></p>
        <p>3. Mother's Name: <b>{s.mother_name}</b></p>
        <p>4. Nationality: <b>{s.nationality}</b></p>
        <p>5. Category: <b>{s.category}</b></p>
        <p>6. Date of first Admission: <b>{s.date_of_admission}</b></p>
        <p>7. Admission No: <b>{s.admission_number}</b></p>
        <p>
          8. Date of Birth:{" "}
          <b>
            {s.date_of_birth
              ? new Date(s.date_of_birth).toLocaleDateString()
              : ""}
          </b>
        </p>
        <p>9. Last Class Studied: <b>{s.last_class}</b></p>
        <p>10. Roll No: <b>{s.roll_no}</b></p>
        <p>11. Last School: <b>{s.last_school}</b></p>
        <p>12. Failed: <b>{s.failed_mark}</b></p>
        <p>13. Subjects Studied: <b>{s.subjects_studied}</b></p>
        <p>14. Qualified: <b>{s.qualified_mark}</b></p>
        <p>15. Dues Date: <b>{s.dues_date}</b></p>
        <p>16. Fee Concession: <b>{s.fee_concession}</b></p>
        <p>17. Working Days: <b>{s.working_days}</b></p>
        <p>18. Present Days: <b>{s.present_days}</b></p>
        <p>19. NCC: <b>{s.ncc}</b></p>
        <p>20. Games Played: <b>{s.games_played}</b></p>
        <p>21. General Conduct: <b>{s.general_conduct}</b></p>
        <p>22. Application Date: <b>{s.application_date}</b></p>
        <p>23. Issue Date: <b>{s.issue_date}</b></p>
        <p>24. Reason: <b>{s.reason}</b></p>
        <p>25. Remarks: <b>{s.remarks}</b></p>
      </div>

      <div
        className="document-signature-container"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div><b>Signature of Class Teacher</b></div>
        <div><b>Accountant Signature With Seal</b></div>
        <div><b>Principal Signature With Seal</b></div>
      </div>
    </div>
  );
};

export default ViewTC;