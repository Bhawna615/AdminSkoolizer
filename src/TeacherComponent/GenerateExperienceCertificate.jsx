import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./GenerateExperienceCertificate.css";

const BASE_URL =
  "http://localhost/kkblossom/api.php/Adminapi/AdminTeacher/";

const GenerateExperienceCertificate = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [designation, setDesignation] = useState("PRINCIPAL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [classesTaught, setClassesTaught] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", id);
    formData.append("designation", designation);
    formData.append("from_date", fromDate);
    formData.append("to_date", toDate);
    formData.append("classes_taught", classesTaught);

    try {
      const res = await axios.post(
        BASE_URL + "generateExperienceCertificate",
        formData
      );

      if (res.data.status) {

        setMessage("Certificate Generated Successfully");

        // reset form
        setFromDate("");
        setToDate("");
        setClassesTaught("");

        setTimeout(() => {
          navigate("/dashboard/TeacherComponent/ExperienceCertificate");
        }, 1000);

      } else {
        setMessage("Failed to generate certificate");
      }

    } catch (error) {
      setMessage("Server error");
      console.error(error);
    }
  };

  return (

    <div className="experience-container">

      <div className="experience-card">

        <div className="experience-header">
          Details
        </div>

        <div className="experience-body">

          {message && <p className="message">{message}</p>}

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Designation</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Classes Taught</label>
              <input
                type="text"
                value={classesTaught}
                onChange={(e) => setClassesTaught(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="submit-area">
              <button type="submit" className="generate-btn">
                Generate
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default GenerateExperienceCertificate;