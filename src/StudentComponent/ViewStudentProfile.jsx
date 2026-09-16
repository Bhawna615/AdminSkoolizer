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

useEffect(() => {
if (location.state && location.state.successMessage) {
setSuccessMessage(location.state.successMessage);


  const timer = setTimeout(() => {
    setSuccessMessage("");
  }, 3000);

  return () => clearTimeout(timer);
}


}, [location]);

const formatDate = (date) => {
if (!date) return "-";


const parsedDate = new Date(date);

if (isNaN(parsedDate.getTime())) return "-";

return parsedDate.toLocaleDateString("en-GB");


};

if (error) {
return ( <div className="student-profile-error">
{error} </div>
);
}

if (!student) {
return ( <div className="student-profile-loading">
Loading... </div>
);
}

return ( <div className="student-profile-page">


  {/* Success Message */}
  {successMessage && (
    <div className="student-profile-success">
      <span className="student-profile-success-icon">✓</span>
      {successMessage}
    </div>
  )}

  <div className="student-profile-card">

    {/* =====================================
        PROFILE HEADER
    ====================================== */}

    <div className="student-profile-header">

      <div className="student-profile-header-content">

        <div className="student-profile-photo-wrapper">
          <img
            src={
              student.image
                ? `${IMAGE_BASE}${student.image}`
                : "http://localhost/kkblossom/assets/icons/user-black.png"
            }
            alt="Student"
            className="student-profile-photo"
          />
        </div>

        <div className="student-profile-heading">

          <h1>
            {student.Name || "Student Name"}
          </h1>

          <p>
            Student Profile
          </p>

          <div className="student-profile-basic-info">

            <span>
              Class: {student.Class || "-"}
            </span>

            <span>
              Roll No: {student.Rollno || "-"}
            </span>

            <span>
              Admission No: {student.Admno || "-"}
            </span>

          </div>

        </div>

      </div>

      <button
        className="student-profile-edit-btn"
        onClick={() =>
          navigate(
            `/dashboard/StudentComponent/EditStudent/${student.id}`
          )
        }
      >
        Edit Profile
      </button>

    </div>


    {/* =====================================
        PROFILE BODY
    ====================================== */}

    <div className="student-profile-body">

      {/* LEFT COLUMN */}
      <div className="student-profile-column">

        <div className="student-profile-section">

          <h2 className="student-profile-section-title">
            Personal Information
          </h2>

          <ProfileItem
            label="Name"
            value={student.Name}
          />

          <ProfileItem
            label="Date of Birth"
            value={formatDate(student.Dob)}
          />

          <ProfileItem
            label="Gender"
            value={
              student.gender === "m"
                ? "Male"
                : student.gender === "f"
                ? "Female"
                : "-"
            }
          />

          <ProfileItem
            label="Height"
            value={student.height}
          />

          <ProfileItem
            label="Weight"
            value={student.weight}
          />

          <ProfileItem
            label="Blood Group"
            value={student.blood_group}
          />

          <ProfileItem
            label="House"
            value={student.House}
          />

        </div>


        <div className="student-profile-section">

          <h2 className="student-profile-section-title">
            Family Information
          </h2>

          <ProfileItem
            label="Father's Name"
            value={student.Fname}
          />

          <ProfileItem
            label="Mother's Name"
            value={student.Mname}
          />

          <ProfileItem
            label="Guardian's Name"
            value={student.Guardianname}
          />

        </div>

      </div>


      {/* MIDDLE COLUMN */}
      <div className="student-profile-column">

        <div className="student-profile-section">

          <h2 className="student-profile-section-title">
            Contact Information
          </h2>

          <ProfileItem
            label="Address"
            value={student.Address}
          />

          <ProfileItem
            label="Contact"
            value={student.Contact}
          />

          <ProfileItem
            label="SMS Number"
            value={student.Smsno}
          />

          <ProfileItem
            label="Email"
            value={student.Email}
          />

          <ProfileItem
            label="Aadhar Number"
            value={student.Aadharno}
          />

        </div>


        <div className="student-profile-section">

          <h2 className="student-profile-section-title">
            Admission Information
          </h2>

          <ProfileItem
            label="Admission Number"
            value={student.Admno}
          />

          <ProfileItem
            label="Admission Date"
            value={formatDate(student.admission_date)}
          />

          <ProfileItem
            label="Last School"
            value={student.Lastschool}
          />

          <ProfileItem
            label="Transport ID"
            value={student.Passengerid}
          />

        </div>

      </div>


      {/* RIGHT COLUMN */}
      <div className="student-profile-column">

        <div className="student-profile-section">

          <h2 className="student-profile-section-title">
            Fee Information
          </h2>

          <ProfileItem
            label="Tuition Fee"
            value={student.tuition_fee}
          />

          <ProfileItem
            label="Annual Fee"
            value={student.annual_fee}
          />

          <ProfileItem
            label="Admission Fee"
            value={student.admission_fee}
          />

          <ProfileItem
            label="Transport Fee"
            value={student.transport_fee}
          />

        </div>


        {/* QR CODE */}
        {student.qrcode && (
          <div className="student-profile-qr-section">

            <h2 className="student-profile-section-title">
              Student QR Code
            </h2>

            <div className="student-profile-qr-box">

              <img
                src={`${QR_BASE}${student.qrcode}.png`}
                alt="QR Code"
                className="student-profile-qr"
              />

              <p>
                Scan student QR code
              </p>

            </div>

          </div>
        )}

      </div>

    </div>

  </div>

</div>


);
};

const ProfileItem = ({ label, value }) => (

  <div className="student-profile-item">


<p className="student-profile-label">
  {label}
</p>

<p className="student-profile-value">
  {value || "-"}
</p>

  </div>
);

export default ViewStudentProfile;
