import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./EditTeacher.css";

const BASE_URL =
"http://localhost/kkblossom/api.php/Adminapi/AdminTeacher/";

const EditTeacher = () => {
const { id } = useParams();
const navigate = useNavigate();

const [teacher, setTeacher] = useState({
name: "",
post: "",
contact: "",
class: "",
email: "",
dob: "",
doj: "",
});

const [image, setImage] = useState(null);
const [classes, setClasses] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
fetchTeacher();
fetchClasses();
}, []);

// ================= GET TEACHER =================

const fetchTeacher = async () => {
try {
const res = await axios.get(BASE_URL + "getTeacher/" + id);


  console.log(res.data);

  const data = res.data;

  setTeacher({
    name: data.Teachername || "",
    post: data.Post || "",
    contact: data.Contact || "",
    class: data.Classteacher || "",
    email: data.Email || "",
    dob: data.Dob || "",
    doj: data.Doj || "",
  });
} catch (error) {
  console.log(error);
}


};

// ================= GET CLASSES =================

const fetchClasses = async () => {
try {
const res = await axios.get(
BASE_URL + "getClasses"
);


  setClasses(res.data);
} catch (error) {
  console.log(error);
}


};

// ================= INPUT CHANGE =================

const handleChange = (e) => {
setTeacher({
...teacher,
[e.target.name]: e.target.value,
});
};

// ================= IMAGE CHANGE =================

const handleImageChange = (e) => {
if (e.target.files && e.target.files[0]) {
setImage(e.target.files[0]);
}
};

// ================= UPDATE TEACHER =================

const updateTeacher = async (e) => {
e.preventDefault();


setLoading(true);

try {
  const formData = new FormData();

  formData.append("id", id);
  formData.append("name", teacher.name);
  formData.append("post", teacher.post);
  formData.append("contact", teacher.contact);
  formData.append("class", teacher.class);
  formData.append("email", teacher.email);
  formData.append("dob", teacher.dob);
  formData.append("doj", teacher.doj);

  if (image) {
    formData.append("image", image);
  }

  const res = await axios.post(
    BASE_URL + "updateTeacher",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  if (res.data.status === "success") {
    alert("Teacher Updated Successfully");

    navigate(
      "/dashboard/TeacherComponent/ViewTeachers"
    );
  }
} catch (error) {
  console.log(error);
  alert("Something went wrong!");
} finally {
  setLoading(false);
}


};

return ( <div className="edit-teacher-page">


  <div className="edit-teacher-container">

    {/* ================= HEADER ================= */}

    <div className="edit-teacher-header">

      <div className="edit-teacher-header-left">

        <button
          type="button"
          className="edit-teacher-back-btn"
          onClick={() =>
            navigate(
              "/dashboard/TeacherComponent/ViewTeachers"
            )
          }
        >
          <i className="bi bi-arrow-left"></i>
        </button>

        <div>
          <h2>Edit Teacher</h2>
          <p>
            Update teacher information and details
          </p>
        </div>

      </div>

      <div className="edit-teacher-header-badge">

        <i className="bi bi-person-badge-fill"></i>
        Teacher ID #{id}

      </div>

    </div>


    {/* ================= FORM CARD ================= */}

    <div className="edit-teacher-card">

      {/* CARD HEADING */}

      <div className="edit-teacher-card-heading">

        <div className="edit-teacher-heading-icon">
          <i className="bi bi-pencil-square"></i>
        </div>

        <div>
          <h3>Teacher Information</h3>
          <p>
            Modify the details below and save changes
          </p>
        </div>

      </div>


      <form onSubmit={updateTeacher}>

        <div className="edit-teacher-form-grid">


          {/* ================= PERSONAL ================= */}

          <div className="edit-teacher-section">

            <div className="edit-teacher-section-title">

              <i className="bi bi-person-fill"></i>

              <span>Personal Details</span>

            </div>


            <div className="edit-teacher-field">

              <label>
                Teacher Name
              </label>

              <div className="edit-teacher-input-wrapper">

                <i className="bi bi-person"></i>

                <input
                  type="text"
                  name="name"
                  value={teacher.name}
                  onChange={handleChange}
                  placeholder="Enter teacher name"
                  required
                />

              </div>

            </div>


            <div className="edit-teacher-field">

              <label>
                Designation / Post
              </label>

              <div className="edit-teacher-input-wrapper">

                <i className="bi bi-briefcase"></i>

                <input
                  type="text"
                  name="post"
                  value={teacher.post}
                  onChange={handleChange}
                  placeholder="Enter designation"
                  required
                />

              </div>

            </div>


            <div className="edit-teacher-field">

              <label>
                Contact Number
              </label>

              <div className="edit-teacher-input-wrapper">

                <i className="bi bi-telephone"></i>

                <input
                  type="number"
                  name="contact"
                  value={teacher.contact}
                  onChange={handleChange}
                  placeholder="Enter contact number"
                  required
                />

              </div>

            </div>

          </div>


          {/* ================= ACADEMIC ================= */}

          <div className="edit-teacher-section">

            <div className="edit-teacher-section-title">

              <i className="bi bi-mortarboard-fill"></i>

              <span>School Details</span>

            </div>


            <div className="edit-teacher-field">

              <label>
                Class Teacher Of
              </label>

              <div className="edit-teacher-input-wrapper">

                <i className="bi bi-building"></i>

                <select
                  name="class"
                  value={teacher.class}
                  onChange={handleChange}
                >

                  <option value="">
                    Select Class
                  </option>

                  {classes.map((cls) => (

                    <option
                      key={cls.id}
                      value={cls.Classname}
                    >
                      Class {cls.Classname}
                    </option>

                  ))}

                </select>

              </div>

            </div>


            {/* IMAGE UPLOAD */}

            <div className="edit-teacher-field">

              <label>
                Teacher Image
              </label>

              <label
                htmlFor="teacher-image-upload"
                className="edit-teacher-upload-box"
              >

                <input
                  id="teacher-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                <div className="edit-teacher-upload-icon">
                  <i className="bi bi-cloud-arrow-up"></i>
                </div>

                <div className="edit-teacher-upload-content">

                  <strong>
                    {image
                      ? image.name
                      : "Click to upload image"}
                  </strong>

                  <span>
                    PNG, JPG or JPEG
                  </span>

                </div>

              </label>

            </div>


            <div className="edit-teacher-info-note">

              <i className="bi bi-info-circle-fill"></i>

              <span>
                Leave the image empty if you don't want to change it.
              </span>

            </div>

          </div>


          {/* ================= CONTACT ================= */}

          <div className="edit-teacher-section">

            <div className="edit-teacher-section-title">

              <i className="bi bi-envelope-fill"></i>

              <span>Contact & Dates</span>

            </div>


            <div className="edit-teacher-field">

              <label>
                Email Address
              </label>

              <div className="edit-teacher-input-wrapper">

                <i className="bi bi-envelope"></i>

                <input
                  type="email"
                  name="email"
                  value={teacher.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                />

              </div>

            </div>


            <div className="edit-teacher-field">

              <label>
                Date of Birth
              </label>

              <div className="edit-teacher-input-wrapper">

                <i className="bi bi-calendar-heart"></i>

                <input
                  type="date"
                  name="dob"
                  value={teacher.dob}
                  onChange={handleChange}
                />

              </div>

            </div>


            <div className="edit-teacher-field">

              <label>
                Date of Joining
              </label>

              <div className="edit-teacher-input-wrapper">

                <i className="bi bi-calendar-check"></i>

                <input
                  type="date"
                  name="doj"
                  value={teacher.doj}
                  onChange={handleChange}
                />

              </div>

            </div>

          </div>

        </div>


        {/* ================= ACTIONS ================= */}

        <div className="edit-teacher-actions">

          <button
            type="button"
            className="edit-teacher-cancel-btn"
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
            className="edit-teacher-save-btn"
            disabled={loading}
          >

            {loading ? (

              <>
                <span className="edit-teacher-btn-spinner"></span>
                Saving Changes...
              </>

            ) : (

              <>
                <i className="bi bi-check-circle-fill"></i>
                Save Changes
              </>

            )}

          </button>

        </div>

      </form>

    </div>

  </div>

</div>


);
};

export default EditTeacher;
