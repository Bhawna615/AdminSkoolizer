import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./AddTeacherToFormer.css";

const BASE_URL =
"http://localhost/kkblossom/api.php/Adminapi/AdminTeacher/";

const AddTeacherToFormer = () => {
const { id } = useParams();
const navigate = useNavigate();

const [teacher, setTeacher] = useState(null);
const [dateOfLeaving, setDateOfLeaving] = useState("");
const [loading, setLoading] = useState(false);

useEffect(() => {
fetchTeacher();
}, [id]);

const fetchTeacher = async () => {
try {
const res = await axios.get(BASE_URL + "getTeacher/" + id);


  console.log(res.data);

  setTeacher(res.data);
} catch (error) {
  console.error(error);
}


};

const handleSubmit = async (e) => {
e.preventDefault();


if (!dateOfLeaving) {
  alert("Please select Date of Leaving");
  return;
}

setLoading(true);

const formData = new FormData();

formData.append("id", id);
formData.append("date_of_leaving", dateOfLeaving);

try {
  const res = await axios.post(
    BASE_URL + "addToFormer",
    formData
  );

  console.log(res.data);

  if (res.data.status === "success") {
    alert("Teacher moved to Former successfully");

    navigate(
      "/dashboard/TeacherComponent/FormerTeachers"
    );
  } else {
    alert(res.data.message || "Failed to Update");
  }
} catch (error) {
  console.error(error);
  alert("Server error");
} finally {
  setLoading(false);
}


};

if (!teacher) {
return ( <div className="former-teacher-loading"> <div className="former-teacher-spinner"></div> <p>Loading teacher details...</p> </div>
);
}

return ( <div className="former-teacher-page">


  <div className="former-teacher-container">

    {/* ================= HEADER ================= */}

    <div className="former-teacher-header">

      <div className="former-teacher-header-left">

        <button
          type="button"
          className="former-teacher-back-btn"
          onClick={() =>
            navigate(
              "/dashboard/TeacherComponent/ViewTeachers"
            )
          }
        >
          <i className="bi bi-arrow-left"></i>
        </button>

        <div>
          <h2>Move Teacher to Former</h2>

          <p>
            Update the teacher's leaving information
          </p>
        </div>

      </div>


      <div className="former-teacher-status">

        <i className="bi bi-person-dash-fill"></i>

        Teacher ID #{id}

      </div>

    </div>


    {/* ================= MAIN CARD ================= */}

    <div className="former-teacher-card">

      {/* WARNING */}

      <div className="former-teacher-warning">

        <div className="former-teacher-warning-icon">
          <i className="bi bi-exclamation-triangle-fill"></i>
        </div>

        <div>
          <strong>
            Move to Former Teachers
          </strong>

          <p>
            After submitting, this teacher will be moved from
            the active teachers list to the former teachers list.
          </p>
        </div>

      </div>


      <form onSubmit={handleSubmit}>

        <div className="former-teacher-content">


          {/* ================= PROFILE ================= */}

          <div className="former-teacher-profile-card">

            <div className="former-teacher-image-box">

              {teacher.image ? (

                <img
                  src={`http://localhost/kkblossom/assets/images/teachers/${teacher.image}`}
                  alt={teacher.Teachername}
                />

              ) : (

                <img
                  src="http://localhost/kkblossom/assets/icons/user-black.svg"
                  alt="Default teacher"
                />

              )}

            </div>


            <h3>
              {teacher.Teachername}
            </h3>

            <span className="former-teacher-post">
              {teacher.Post || "Teacher"}
            </span>


            <div className="former-teacher-profile-id">

              <i className="bi bi-person-badge"></i>

              ID #{teacher.id || id}

            </div>

          </div>


          {/* ================= DETAILS ================= */}

          <div className="former-teacher-details-section">

            <div className="former-teacher-section-heading">

              <div className="former-teacher-heading-icon">

                <i className="bi bi-person-vcard-fill"></i>

              </div>

              <div>

                <h3>Teacher Details</h3>

                <p>
                  Review teacher information before updating status
                </p>

              </div>

            </div>


            <div className="former-teacher-details-grid">


              <div className="former-teacher-detail-item">

                <div className="former-teacher-detail-icon">
                  <i className="bi bi-mortarboard"></i>
                </div>

                <div>

                  <span>Class Teacher</span>

                  <strong>
                    {teacher.Classteacher
                      ? `Class ${teacher.Classteacher}`
                      : "Not Assigned"}
                  </strong>

                </div>

              </div>


              <div className="former-teacher-detail-item">

                <div className="former-teacher-detail-icon">
                  <i className="bi bi-telephone"></i>
                </div>

                <div>

                  <span>Contact</span>

                  <strong>
                    {teacher.Contact || "Not Available"}
                  </strong>

                </div>

              </div>


              <div className="former-teacher-detail-item">

                <div className="former-teacher-detail-icon">
                  <i className="bi bi-envelope"></i>
                </div>

                <div>

                  <span>Email</span>

                  <strong>
                    {teacher.Email || "Not Available"}
                  </strong>

                </div>

              </div>


              <div className="former-teacher-detail-item">

                <div className="former-teacher-detail-icon">
                  <i className="bi bi-calendar-heart"></i>
                </div>

                <div>

                  <span>Date of Birth</span>

                  <strong>
                    {teacher.Dob || "Not Available"}
                  </strong>

                </div>

              </div>


              <div className="former-teacher-detail-item">

                <div className="former-teacher-detail-icon">
                  <i className="bi bi-calendar-check"></i>
                </div>

                <div>

                  <span>Date of Joining</span>

                  <strong>
                    {teacher.Doj || "Not Available"}
                  </strong>

                </div>

              </div>


              <div className="former-teacher-detail-item">

                <div className="former-teacher-detail-icon">
                  <i className="bi bi-briefcase"></i>
                </div>

                <div>

                  <span>Designation</span>

                  <strong>
                    {teacher.Post || "Teacher"}
                  </strong>

                </div>

              </div>

            </div>


            {/* ================= LEAVING DATE ================= */}

            <div className="former-teacher-leaving-box">

              <div className="former-teacher-leaving-top">

                <div className="former-teacher-leaving-icon">

                  <i className="bi bi-calendar-x"></i>

                </div>

                <div>

                  <h4>
                    Date of Leaving
                  </h4>

                  <p>
                    Select the teacher's last working date
                  </p>

                </div>

              </div>


              <div className="former-teacher-date-input">

                <i className="bi bi-calendar3"></i>

                <input
                  type="date"
                  value={dateOfLeaving}
                  onChange={(e) =>
                    setDateOfLeaving(e.target.value)
                  }
                  required
                />

              </div>

            </div>


            {/* ================= ACTIONS ================= */}

            <div className="former-teacher-actions">

              <button
                type="button"
                className="former-teacher-cancel-btn"
                onClick={() =>
                  navigate(
                    "/dashboard/TeacherComponent/ViewTeachers"
                  )
                }
              >

                <i className="bi bi-x-circle"></i>

                Cancel

              </button>


              <button
                type="submit"
                className="former-teacher-submit-btn"
                disabled={loading}
              >

                {loading ? (

                  <>
                    <span className="former-teacher-btn-spinner"></span>
                    Updating...
                  </>

                ) : (

                  <>
                    <i className="bi bi-person-dash-fill"></i>

                    Move to Former

                  </>

                )}

              </button>

            </div>

          </div>

        </div>

      </form>

    </div>

  </div>

</div>


);
};

export default AddTeacherToFormer;
