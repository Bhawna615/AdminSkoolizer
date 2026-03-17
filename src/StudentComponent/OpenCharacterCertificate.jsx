import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./OpenCharacterCertificate.css";
import schoolLogo from "../images/school-logo.png";
const OpenCharacterCertificate = () => {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);

  useEffect(() => {
    fetchCertificate();
  }, []);

  const fetchCertificate = async () => {
    try {
      const formData = new FormData();
      formData.append("id", id);

      const res = await axios.post(
        "http://localhost/kkblossom/api.php/Adminapi/AdminStudent/openCharacterCertificate",
        formData
      );

      setCertificate(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!certificate) return <div>Loading...</div>;

  return (
    <div className="certificate-wrapper">

      {/* HEADER */}
      <div className="header-section">
        <div>
 <img
          src={schoolLogo}
          alt="School Logo"
          className="logo"
        />
        </div>
       
<div>
<h2 className="school-name">KK BLOSSOMS SCHOOL</h2>
        <p>Rabaun, Solan (H.P)</p>
        <p>C.B.S.E India, Affiliation No. 630180, School No. 43169</p>
</div>
        
      </div>

      <div className="contact-row">
        <span>Phone No. 0177-2844840</span>
        <span>Email: spips03@gmail.com</span>
      </div>

      <hr />

      {/* TITLE */}
      <h2 className="certificate-title">
        TO WHOMSOEVER IT MAY CONCERN
      </h2>

      <hr />

      {/* BODY */}
      <div className="certificate-body">
        <p>
          This is to certify that <strong>{certificate.name}</strong>, 
          son/daughter of <strong>{certificate.father_name}</strong>, 
          was a student of KK Blossoms School from{" "}
          <strong>{certificate.admission_date}</strong> to{" "}
          <strong>{certificate.graduation_date}</strong>. During this period,
          he/she displayed good behavior and conduct.
        </p>

        <p>
          He/She was an active participant in school activities and has
          contributed significantly to the school community. He/She has
          maintained excellent attendance and punctuality throughout
          his/her academic career at our school.
        </p>

        <p>
          We certify that he/she has never been involved in any disciplinary
          action and has been an exemplary student in terms of academic
          performance as well as conduct.
        </p>

        <p>
          We recommend him/her for any academic or employment opportunities
          that he/she may pursue in the future.
        </p>

        <br />
        <p>Sincerely,</p>
        <br />
        <p><strong>Principal’s Name and Signature</strong></p>
        <p>KK Blossoms School</p>
      </div>

      <div className="print-btn">
        <button onClick={() => window.print()}>
          Print Certificate
        </button>
      </div>

    </div>
  );
};

export default OpenCharacterCertificate;