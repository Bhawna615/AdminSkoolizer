// ViewStudentProfile.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./ViewStudentProfile.css";

const BASE_URL = "http://localhost/kkblossom/api.php/Adminapi/";
const IMAGE_BASE = "http://localhost/kkblossom/assets/images/students/";
const QR_BASE = "http://localhost/kkblossom/assets/images/students/qrcode/";

const ViewStudentProfile = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    axios
      .get(`${BASE_URL}AdminStudent/view/${studentId}`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setStudent(res.data[0]);
        } else {
          setStudent(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch student profile");
      });
  }, [studentId]);

  // ✅ RECEIVE SUCCESS MESSAGE FROM NAVIGATION
  useEffect(() => {
    if (location.state && location.state.successMessage) {
      setSuccessMessage(location.state.successMessage);

      // Auto hide after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }
  }, [location]);

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-GB");
  };

  if (error) return <div className="profile-error">{error}</div>;
  if (!student) return <div className="profile-loading">Loading...</div>;

  return (
    <>
      {/* ✅ SUCCESS MESSAGE DISPLAY */}
      {successMessage && (
        <div
          style={{
            background: "#d4edda",
            color: "#155724",
            padding: "12px",
            margin: "10px",
            borderRadius: "6px",
            textAlign: "center",
            fontWeight: "500"
          }}
        >
          {successMessage}
        </div>
      )}

      <div className="row profile-container">

        {/* LEFT COLUMN */}
        <div className="col-4 profile-col" style={{ display: "flex", flexDirection: "column" }}>
          <img
            src={
              student.image
                ? `${IMAGE_BASE}${student.image}`
                : "http://localhost/kkblossom/assets/icons/user-black.png"
            }
            alt="Student"
            className="profile-img"
          />

          {student.qrcode && (
            <img
              src={`${QR_BASE}${student.qrcode}.png`}
              alt="QR Code"
              className="profile-img"
            />
          )}
        </div>

        {/* MIDDLE COLUMN */}
        <div className="col-4 profile-col">
          <ProfileItem label="Name" value={student.Name} />
          <ProfileItem label="Class" value={student.Class} />
          <ProfileItem label="Roll No." value={student.Rollno} />
          <ProfileItem label="Father's Name" value={student.Fname} />
          <ProfileItem label="Mother's Name" value={student.Mname} />
          <ProfileItem label="Guardian's Name" value={student.Guardianname} />
          <ProfileItem label="Address" value={student.Address} />
          <ProfileItem label="Contact" value={student.Contact} />
          <ProfileItem label="House" value={student.House} />
          <ProfileItem label="Tuition Fee" value={student.tuition_fee} />
          <ProfileItem label="Annual Fee" value={student.annual_fee} />
          <ProfileItem label="Admission Fee" value={student.admission_fee} />
          <ProfileItem label="Transport Fee" value={student.transport_fee} />

          <div className="col-12 text-center mt-4">
            <button
              className="profile-edit-btn"
              onClick={() =>
                navigate(`/dashboard/StudentComponent/EditStudent/${student.id}`)
              }
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-4 profile-col">
          <ProfileItem label="Transport ID" value={student.Passengerid} />
          <ProfileItem label="Admission Number" value={student.Admno} />
          <ProfileItem label="Sms Number" value={student.Smsno} />
          <ProfileItem label="Aadhar Number" value={student.Aadharno} />
          <ProfileItem label="Date of Birth" value={formatDate(student.Dob)} />
          <ProfileItem label="Last School" value={student.Lastschool} />
          <ProfileItem label="Email" value={student.Email} />
          <ProfileItem label="Admission Date" value={formatDate(student.admission_date)} />
          <ProfileItem
            label="Gender"
            value={student.gender === "m" ? "Male" : "Female"}
          />
          <ProfileItem label="Height" value={student.height} />
          <ProfileItem label="Weight" value={student.weight} />
          <ProfileItem label="Blood Group" value={student.blood_group} />
        </div>

      </div>
    </>
  );
};

const ProfileItem = ({ label, value }) => (
  <div className="profile-item">
    <p className="profile-label">{label}</p>
    <p className="profile-value">{value || "-"}</p>
  </div>
);

export default ViewStudentProfile;