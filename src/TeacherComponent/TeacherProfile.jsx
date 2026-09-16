import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./TeacherProfile.css";

const TeacherProfile = () => {
const { id } = useParams();

const navigate = useNavigate();

const [teacher, setTeacher] = useState(null);

useEffect(() => {
fetchTeacher();
}, []);

const fetchTeacher = async () => {
try {
const response = await axios.get(
`http://localhost/kkblossom/api.php/Adminapi/AdminTeacher/profile/${id}`
);


  setTeacher(response.data.data[0]);
} catch (error) {
  console.log(error);
}


};

const deleteTeacher = async () => {
const confirmDelete = window.confirm(
"Are you sure you want to delete this teacher?"
);


if (!confirmDelete) return;

try {
  const response = await axios.get(
    `http://localhost/kkblossom/api.php/Adminapi/AdminTeacher/delete/${id}`
  );

  if (response.data.status) {
    alert("Teacher Deleted Successfully");

    navigate("/dashboard/TeacherComponent/ViewTeachers");
  }
} catch (error) {
  console.log(error);
}


};

if (!teacher) {
return ( <div className="teacher-profile-loading-page"> <div className="teacher-profile-loader"></div> <p>Loading Teacher Profile...</p> </div>
);
}

const getInitials = (name) => {
if (!name) return "T";


return name
  .split(" ")
  .map((word) => word[0])
  .join("")
  .substring(0, 2)
  .toUpperCase();


};

return ( <div className="teacher-profile-page">


  <div className="teacher-profile-container">

    {/* ================= HEADER ================= */}

    <div className="teacher-profile-header">

      <div className="teacher-profile-header-left">

        <button
          className="teacher-profile-back-btn"
          onClick={() =>
            navigate("/dashboard/TeacherComponent/ViewTeachers")
          }
        >
          <i className="bi bi-arrow-left"></i>
        </button>

        <div>

          <h2>Teacher Profile</h2>

          <p>
            View and manage teacher information
          </p>

        </div>

      </div>


      <div className="teacher-profile-header-actions">

        <button
          className="teacher-profile-edit-btn"
          onClick={() =>
            navigate(
              `/dashboard/TeacherComponent/EditTeacher/${teacher.id}`
            )
          }
        >
          <i className="bi bi-pencil-square"></i>
          Edit Profile
        </button>


        <button
          className="teacher-profile-delete-btn"
          onClick={deleteTeacher}
        >
          <i className="bi bi-trash3"></i>
          Delete
        </button>

      </div>

    </div>


    {/* ================= PROFILE HERO ================= */}

    <div className="teacher-profile-hero">

      <div className="teacher-profile-avatar-wrapper">

        {teacher.image ? (

          <img
            src={`http://localhost/kkblossom/assets/images/teachers/${teacher.image}`}
            alt={teacher.Teachername}
            className="teacher-profile-image"
          />

        ) : (

          <div className="teacher-profile-initials">
            {getInitials(teacher.Teachername)}
          </div>

        )}

        <div className="teacher-profile-online-dot"></div>

      </div>


      <div className="teacher-profile-hero-info">

        <h1>
          {teacher.Teachername}
        </h1>

        <div className="teacher-profile-badges">

          <span className="teacher-profile-post-badge">
            <i className="bi bi-briefcase-fill"></i>
            {teacher.Post || "Teacher"}
          </span>


          {teacher.Classteacher && (

            <span className="teacher-profile-class-badge">
              <i className="bi bi-mortarboard-fill"></i>
              Class {teacher.Classteacher}
            </span>

          )}

        </div>

        <p className="teacher-profile-id">
          <i className="bi bi-person-badge"></i>
          Teacher ID: #{teacher.id}
        </p>

      </div>


      <div className="teacher-profile-hero-decoration">

        <i className="bi bi-mortarboard-fill"></i>

      </div>

    </div>


    {/* ================= MAIN CONTENT ================= */}

    <div className="teacher-profile-content">


      {/* ================= INFORMATION ================= */}

      <div className="teacher-profile-info-card">

        <div className="teacher-profile-card-title">

          <div className="teacher-profile-title-icon">
            <i className="bi bi-person-vcard-fill"></i>
          </div>

          <div>

            <h3>Personal Information</h3>

            <p>
              Basic details and contact information
            </p>

          </div>

        </div>


        <div className="teacher-profile-details-grid">


          <div className="teacher-profile-detail-item">

            <div className="teacher-profile-detail-icon">
              <i className="bi bi-person"></i>
            </div>

            <div>

              <span>Full Name</span>

              <strong>
                {teacher.Teachername || "-"}
              </strong>

            </div>

          </div>


          <div className="teacher-profile-detail-item">

            <div className="teacher-profile-detail-icon">
              <i className="bi bi-briefcase"></i>
            </div>

            <div>

              <span>Designation</span>

              <strong>
                {teacher.Post || "-"}
              </strong>

            </div>

          </div>


          <div className="teacher-profile-detail-item">

            <div className="teacher-profile-detail-icon">
              <i className="bi bi-telephone"></i>
            </div>

            <div>

              <span>Contact Number</span>

              <strong>
                {teacher.Contact || "-"}
              </strong>

            </div>

          </div>


          <div className="teacher-profile-detail-item">

            <div className="teacher-profile-detail-icon">
              <i className="bi bi-envelope"></i>
            </div>

            <div>

              <span>Email Address</span>

              <strong className="teacher-profile-email-text">
                {teacher.Email || "-"}
              </strong>

            </div>

          </div>


          <div className="teacher-profile-detail-item">

            <div className="teacher-profile-detail-icon">
              <i className="bi bi-calendar-heart"></i>
            </div>

            <div>

              <span>Date of Birth</span>

              <strong>
                {teacher.Dob || "-"}
              </strong>

            </div>

          </div>


          <div className="teacher-profile-detail-item">

            <div className="teacher-profile-detail-icon">
              <i className="bi bi-calendar-check"></i>
            </div>

            <div>

              <span>Date of Joining</span>

              <strong>
                {teacher.Doj || "-"}
              </strong>

            </div>

          </div>


          <div className="teacher-profile-detail-item teacher-profile-full-width">

            <div className="teacher-profile-detail-icon">
              <i className="bi bi-mortarboard"></i>
            </div>

            <div>

              <span>Class Incharge</span>

              <strong>
                {teacher.Classteacher
                  ? `Class ${teacher.Classteacher}`
                  : "Not Assigned"}
              </strong>

            </div>

          </div>


        </div>

      </div>


      {/* ================= QR CARD ================= */}

      <div className="teacher-profile-side-section">


        <div className="teacher-profile-qr-card">

          <div className="teacher-profile-qr-header">

            <div className="teacher-profile-title-icon">
              <i className="bi bi-qr-code"></i>
            </div>

            <div>

              <h3>Teacher QR Code</h3>

              <p>
                Scan for teacher identification
              </p>

            </div>

          </div>


          <div className="teacher-profile-qr-box">

            {teacher.qrcode ? (

              <img
                src={`http://localhost/kkblossom/assets/images/teachers/qrcode/${teacher.qrcode}.png`}
                alt="Teacher QR Code"
                className="teacher-profile-qrcode"
              />

            ) : (

              <div className="teacher-profile-no-qr">

                <i className="bi bi-qr-code"></i>

                <span>
                  QR Code Not Available
                </span>

              </div>

            )}

          </div>


          <p className="teacher-profile-qr-note">

            <i className="bi bi-info-circle"></i>

            Use this QR code for quick teacher identification.

          </p>

        </div>


        {/* QUICK ACTIONS */}

        <div className="teacher-profile-quick-actions">

          <h3>Quick Actions</h3>


          <button
            onClick={() =>
              navigate(
                `/dashboard/TeacherComponent/EditTeacher/${teacher.id}`
              )
            }
          >

            <span>
              <i className="bi bi-pencil-square"></i>
            </span>

            Edit Teacher

            <i className="bi bi-chevron-right"></i>

          </button>


          <button
            onClick={() =>
              navigate(
                `/dashboard/TeacherComponent/GenerateExperienceCertificate/${teacher.id}`
              )
            }
          >

            <span>
              <i className="bi bi-file-earmark-text"></i>
            </span>

            Experience Certificate

            <i className="bi bi-chevron-right"></i>

          </button>


          <button
            onClick={() =>
              navigate(
                `/dashboard/TeacherComponent/CreateTeacherCredentials/${teacher.id}`
              )
            }
          >

            <span>
              <i className="bi bi-key"></i>
            </span>

            Create Credentials

            <i className="bi bi-chevron-right"></i>

          </button>


          <button
            className="teacher-profile-quick-delete"
            onClick={deleteTeacher}
          >

            <span>
              <i className="bi bi-trash3"></i>
            </span>

            Delete Teacher

            <i className="bi bi-chevron-right"></i>

          </button>

        </div>


      </div>

    </div>

  </div>

</div>


);
};

export default TeacherProfile;
