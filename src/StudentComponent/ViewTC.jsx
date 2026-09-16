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

    axios
      .get(`${API_BASE}/AdminStudent/viewTc/${id}`)
      .then((res) => {
        console.log("TC API Response:", res.data);

        if (res.data.status) {
          setStudent(res.data.details);
        } else {
          console.error("TC Error:", res.data.message);
          setStudent(null);
        }
      })
      .catch((err) => {
        console.error(
          "API Error:",
          err.response?.data || err.message
        );
        setStudent(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="view-tc-status">
        Loading certificate...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="view-tc-status view-tc-error">
        No data found for this student.
      </div>
    );
  }

  const s = student;

  const details = [
    ["1.", "Name of the Pupil", s.name],
    ["2.", "Father's Name", s.father_name],
    ["3.", "Mother's Name", s.mother_name],
    ["4.", "Nationality", s.nationality],
    ["5.", "Category", s.category],
    ["6.", "Date of First Admission", formatDate(s.date_of_admission)],
    ["7.", "Admission No.", s.admission_number],
    ["8.", "Date of Birth", formatDate(s.date_of_birth)],
    ["9.", "Last Class Studied", s.last_class],
    ["10.", "Roll No.", s.roll_no],
    ["11.", "Last School", s.last_school],
    ["12.", "Failed", s.failed_mark],
    ["13.", "Subjects Studied", s.subjects_studied],
    ["14.", "Qualified", s.qualified_mark],
    ["15.", "Dues Date", formatDate(s.dues_date)],
    ["16.", "Fee Concession", s.fee_concession],
    ["17.", "Working Days", s.working_days],
    ["18.", "Present Days", s.present_days],
    ["19.", "NCC", s.ncc],
    ["20.", "Games Played", s.games_played],
    ["21.", "General Conduct", s.general_conduct],
    ["22.", "Application Date", formatDate(s.application_date)],
    ["23.", "Issue Date", formatDate(s.issue_date)],
    ["24.", "Reason", s.reason],
    ["25.", "Remarks", s.remarks],
  ];

  return (
    <div className="view-tc-page">

      {/* =========================================
          PRINT BUTTON
      ========================================= */}
      <div className="view-tc-toolbar">
        <button
          type="button"
          className="view-tc-print-button"
          onClick={handlePrint}
        >
          <span className="view-tc-print-icon">🖨</span>
          Print Certificate
        </button>
      </div>

      {/* =========================================
          A4 CERTIFICATE
      ========================================= */}
      <div className="view-tc-certificate">

        {/* =========================================
            SCHOOL HEADER
        ========================================= */}
        <div className="view-tc-school-header">

          <div className="view-tc-logo-section">
            <img
              src={schoolLogo}
              className="view-tc-school-logo"
              alt="School Logo"
            />
          </div>

          <div className="view-tc-school-details">

            <div className="view-tc-school-name">
              {s.schoolName || "KK BLOSSOMS"}
            </div>

            <div className="view-tc-school-address">
              {s.schoolAddress || "Rabaun, Solan (H.P)"}
            </div>

            <div className="view-tc-school-info">
              Website: www.kkblossomschool.org/
            </div>

            <div className="view-tc-school-info">
              Recognition Number: 16/2022-27
            </div>

            <div className="view-tc-school-info">
              UDISE No: 02090112903
            </div>

          </div>

        </div>

        <div className="view-tc-header-line"></div>

        {/* =========================================
            TITLE
        ========================================= */}
        <div className="view-tc-title-section">

          <h1>
            SCHOOL LEAVING CERTIFICATE
          </h1>

          <div className="view-tc-title-underline"></div>

        </div>

        {/* =========================================
            STUDENT DETAILS
        ========================================= */}
        <div className="view-tc-details">

          {details.map(([number, label, value]) => (
            <div
              className="view-tc-row"
              key={number}
            >
              <div className="view-tc-number">
                {number}
              </div>

              <div className="view-tc-label">
                {label}
              </div>

              <div className="view-tc-value">
                {value || ""}
              </div>
            </div>
          ))}

        </div>

        {/* =========================================
            SIGNATURES
        ========================================= */}
        <div className="view-tc-footer">

          <div className="view-tc-signature">

            <div className="view-tc-signature-space"></div>

            <div className="view-tc-signature-line"></div>

            <strong>
              Signature of Class Teacher
            </strong>

          </div>

          <div className="view-tc-signature">

            <div className="view-tc-signature-space"></div>

            <div className="view-tc-signature-line"></div>

            <strong>
              Accountant Signature With Seal
            </strong>

          </div>

          <div className="view-tc-signature">

            <div className="view-tc-signature-space"></div>

            <div className="view-tc-signature-line"></div>

            <strong>
              Principal Signature With Seal
            </strong>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ViewTC;