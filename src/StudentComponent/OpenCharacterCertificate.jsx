
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./OpenCharacterCertificate.css";
import schoolLogo from "../images/school-logo.png";

const OpenCharacterCertificate = () => {
  const { id } = useParams();

  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchCertificate();
    }
  }, [id]);

  const fetchCertificate = async () => {
    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("id", id);

      const res = await axios.post(
        "http://localhost/kkblossom/api.php/Adminapi/AdminStudent/openCharacterCertificate",
        formData
      );

      console.log("Character Certificate Response:", res.data);

      /*
       * Depending on your PHP API, the response may be:
       *
       * 1. Direct object:
       * {
       *   id: 1,
       *   name: "...",
       *   father_name: "..."
       * }
       *
       * OR
       *
       * 2. Wrapped object:
       * {
       *   status: true,
       *   data: {...}
       * }
       */

      let data = res.data;

      if (res.data?.data) {
        data = res.data.data;
      }

      if (res.data?.details) {
        data = res.data.details;
      }

      if (res.data?.certificate) {
        data = res.data.certificate;
      }

      if (
        data &&
        (
          data.name ||
          data.student_id ||
          data.father_name ||
          data.admission_date
        )
      ) {
        setCertificate(data);
      } else {
        setError(
          res.data?.message || "Character certificate data not found."
        );
      }
    } catch (err) {
      console.error("Certificate Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load character certificate."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="open-character-loading">
        <div className="open-character-loader"></div>
        <p>Loading Character Certificate...</p>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="open-character-error">
        <div className="open-character-error-box">
          <i className="bi bi-exclamation-circle-fill"></i>

          <h3>Unable to Load Certificate</h3>

          <p>{error}</p>

          <button onClick={() => window.history.back()}>
            <i className="bi bi-arrow-left"></i>
            Back
          </button>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="open-character-error">
        <div className="open-character-error-box">
          <i className="bi bi-file-earmark-x"></i>

          <h3>Certificate Not Found</h3>

          <p>No character certificate information is available.</p>

          <button onClick={() => window.history.back()}>
            <i className="bi bi-arrow-left"></i>
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="open-character-page">

      {/* =====================================================
          SCREEN TOOLBAR
      ===================================================== */}

      <div className="open-character-toolbar">
        <button
          type="button"
          className="open-character-back-btn"
          onClick={() => window.history.back()}
        >
          <i className="bi bi-arrow-left"></i>
          Back
        </button>

        <button
          type="button"
          className="open-character-print-btn"
          onClick={() => window.print()}
        >
          <i className="bi bi-printer-fill"></i>
          Print Certificate
        </button>
      </div>

      {/* =====================================================
          PRINTABLE A4 CERTIFICATE
      ===================================================== */}

      <div className="open-character-paper">

        {/* TOP BORDER */}
        <div className="open-character-top-line"></div>

        {/* ===================================================
            SCHOOL HEADER
        =================================================== */}

        <div className="open-character-school-header">

          <div className="open-character-logo-wrapper">
            <img
              src={schoolLogo}
              alt="KK Blossoms School Logo"
              className="open-character-logo"
            />
          </div>

          <div className="open-character-school-info">

            <h1>KK BLOSSOMS SCHOOL</h1>

            <p className="open-character-address">
              Rabaun, Solan (H.P.)
            </p>

            <p className="open-character-affiliation">
              C.B.S.E India, Affiliation No. 630180,
              School No. 43169
            </p>

          </div>

        </div>

        {/* ===================================================
            CONTACT INFORMATION
        =================================================== */}

        <div className="open-character-contact">

          <span>
            <i className="bi bi-telephone-fill"></i>
            Phone No. 0177-2844840
          </span>

          <span>
            <i className="bi bi-envelope-fill"></i>
            Email: spips03@gmail.com
          </span>

        </div>

        <div className="open-character-divider"></div>

        {/* ===================================================
            CERTIFICATE TITLE
        =================================================== */}

        <div className="open-character-title-area">

          <h2>CHARACTER CERTIFICATE</h2>

          <h3>TO WHOMSOEVER IT MAY CONCERN</h3>

        </div>

        <div className="open-character-divider"></div>

        {/* ===================================================
            CERTIFICATE NUMBER / DATE
        =================================================== */}

        <div className="open-character-meta">

          <div>
            <strong>Certificate No.:</strong>{" "}
            {certificate.id || certificate.student_id || "-"}
          </div>

          <div>
            <strong>Date:</strong>{" "}
            {certificate.graduation_date || "-"}
          </div>

        </div>

        {/* ===================================================
            CERTIFICATE BODY
        =================================================== */}

        <div className="open-character-body">

          <p>
            This is to certify that{" "}
            <strong>{certificate.name || "-"}</strong>,{" "}
            son/daughter of{" "}
            <strong>{certificate.father_name || "-"}</strong>,{" "}
            was a student of <strong>KK Blossoms School</strong>{" "}
            from{" "}
            <strong>{certificate.admission_date || "-"}</strong>{" "}
            to{" "}
            <strong>{certificate.graduation_date || "-"}</strong>.
          </p>

          <p>
            During this period, the student displayed good
            behaviour, discipline and conduct. The student was
            sincere and regular in academic and co-curricular
            activities.
          </p>

          <p>
            He/She was an active participant in school activities
            and contributed positively to the school community.
            He/She maintained good attendance and punctuality
            throughout the academic period.
          </p>

          <p>
            We further certify that, to the best of our knowledge,
            he/she has not been involved in any disciplinary
            action during his/her stay in the school.
          </p>

          <p>
            We wish him/her every success in future academic and
            professional pursuits.
          </p>

        </div>

        {/* ===================================================
            STUDENT INFORMATION
        =================================================== */}

        <div className="open-character-student-details">

          <div className="open-character-detail-row">

            <div>
              <span>Student Name</span>
              <strong>{certificate.name || "-"}</strong>
            </div>

            <div>
              <span>Roll No.</span>
              <strong>{certificate.roll_no || "-"}</strong>
            </div>

          </div>

          <div className="open-character-detail-row">

            <div>
              <span>Father's Name</span>
              <strong>{certificate.father_name || "-"}</strong>
            </div>

            <div>
              <span>Admission No.</span>
              <strong>{certificate.admission_no || "-"}</strong>
            </div>

          </div>

          <div className="open-character-detail-row">

            <div>
              <span>Class</span>
              <strong>{certificate.class || "-"}</strong>
            </div>

            <div>
              <span>Student ID</span>
              <strong>{certificate.student_id || "-"}</strong>
            </div>

          </div>

        </div>

        {/* ===================================================
            SIGNATURE SECTION
        =================================================== */}

        <div className="open-character-signature-section">

          <div className="open-character-signature-left">

            <div className="open-character-signature-line"></div>

            <strong>Class Teacher</strong>

          </div>

          <div className="open-character-signature-right">

            <div className="open-character-signature-space"></div>

            <strong>Principal</strong>

            <span>KK Blossoms School</span>

          </div>

        </div>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <div className="open-character-footer">

          <span>
            KK Blossoms School, Rabaun, Solan (H.P.)
          </span>

          <span>
            Character Certificate
          </span>

        </div>

        {/* BOTTOM BORDER */}

        <div className="open-character-bottom-line"></div>

      </div>

    </div>
  );
};

export default OpenCharacterCertificate;
