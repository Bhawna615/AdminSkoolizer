import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CharacterCertificate.css";

const CharacterCertificate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [admissionDate, setAdmissionDate] = useState(null);
  const [graduationDate, setGraduationDate] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id) {
      setMessage({ type: "error", text: "Student ID is missing." });
      return;
    }

    if (!admissionDate || !graduationDate) {
      setMessage({ type: "error", text: "Please select both dates." });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const payload = {
        student_id: id,
        admission_date: admissionDate.toLocaleDateString("en-GB"),
        graduation_date: graduationDate.toLocaleDateString("en-GB"),
      };

      console.log("Sending Data:", payload);

      const response = await axios.post(
        "http://localhost/kkblossom/api.php/Adminapi/AdminStudent/generateCharacterCertificate",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status) {
        // ✅ Redirect with message to View Page
        navigate("/dashboard/StudentComponent/ViewCharacterCertificates", {
          state: {
            type: "success",
            text: response.data.message,
          },
        });
      } else {
        setMessage({ type: "error", text: response.data.message });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-12">
      {/* MESSAGE BAR */}
      {message.text && (
        <div
          className={
            message.type === "success" ? "success-bar" : "error-bar"
          }
        >
          {message.text}
        </div>
      )}

      <div className="col-12 form-box">
        <div className="col-12 title-bar">
          <p style={{ padding: "10px", margin: 0 }}>Details</p>
        </div>

        <div className="col-12" style={{ padding: "20px" }}>
          <form onSubmit={handleSubmit}>
            <div className="col-4">
              <p className="character-certificate-details">
                Admission Date
              </p>
              <DatePicker
                selected={admissionDate}
                onChange={(date) => setAdmissionDate(date)}
                dateFormat="dd-MM-yyyy"
                placeholderText="dd-mm-yyyy"
                className="form-input"
              />

              <p
                className="character-certificate-details"
                style={{ marginTop: "10px" }}
              >
                Graduation Date
              </p>
              <DatePicker
                selected={graduationDate}
                onChange={(date) => setGraduationDate(date)}
                dateFormat="dd-MM-yyyy"
                placeholderText="dd-mm-yyyy"
                className="form-input"
              />
            </div>

            <div
              className="col-12"
              style={{ textAlign: "center", margin: "20px 0" }}
            >
              <input
                type="submit"
                value={loading ? "Generating..." : "Generate"}
                className="form-submit"
                disabled={loading}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CharacterCertificate;