import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AddTeacher.css";
import { useNavigate } from "react-router-dom";

const BASE_URL =
  "http://localhost/kkblossom/api.php/Adminapi/AdminTeacher/";

const AddTeacher = () => {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    post: "",
    contact: "",
    class: "",
    email: "",
    dob: "",
    doj: "",
    image: null,
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get(BASE_URL + "getClasses");
      setClasses(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData({
        ...formData,
        image: file,
      });

      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    try {
      const res = await axios.post(
        BASE_URL + "insertTeacher",
        data
      );

      if (res.data.status === "success") {
        setMessage("Teacher added successfully!");

        setTimeout(() => {
          navigate("/dashboard/TeacherComponent/ViewTeachers");
        }, 1000);
      } else {
        setMessage("Unable to add teacher.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-teacher-page">

      <div className="add-teacher-container">

        {/* HEADER */}
        <div className="add-teacher-header">

          <div className="add-teacher-header-content">
            <div className="add-teacher-icon">
              <i className="bi bi-person-plus-fill"></i>
            </div>

            <div>
              <h2>Add New Teacher</h2>
              <p>
                Fill in the teacher information to add a new staff member.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="add-teacher-back-btn"
            onClick={() =>
              navigate("/dashboard/TeacherComponent/ViewTeachers")
            }
          >
            <i className="bi bi-arrow-left"></i>
            Back
          </button>

        </div>

        {/* FORM CARD */}
        <div className="add-teacher-card">

          <form onSubmit={handleSubmit}>

            <div className="add-teacher-section-title">
              <i className="bi bi-person-vcard"></i>
              Personal Information
            </div>

            <div className="add-teacher-grid">

              {/* NAME */}
              <div className="add-teacher-field">
                <label>
                  Teacher Name <span>*</span>
                </label>

                <div className="add-teacher-input-box">
                  <i className="bi bi-person"></i>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter teacher name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* POST */}
              <div className="add-teacher-field">
                <label>
                  Post / Designation <span>*</span>
                </label>

                <div className="add-teacher-input-box">
                  <i className="bi bi-briefcase"></i>

                  <input
                    type="text"
                    name="post"
                    placeholder="Enter designation"
                    value={formData.post}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* CONTACT */}
              <div className="add-teacher-field">
                <label>
                  Contact Number <span>*</span>
                </label>

                <div className="add-teacher-input-box">
                  <i className="bi bi-telephone"></i>

                  <input
                    type="number"
                    name="contact"
                    placeholder="Enter contact number"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="add-teacher-field">
                <label>Email Address</label>

                <div className="add-teacher-input-box">
                  <i className="bi bi-envelope"></i>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* CLASS */}
              <div className="add-teacher-field">
                <label>Class Teacher Of</label>

                <div className="add-teacher-input-box">
                  <i className="bi bi-mortarboard"></i>

                  <select
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select Class
                    </option>

                    {classes.map((c, i) => (
                      <option
                        key={i}
                        value={c.Classname}
                      >
                        Class {c.Classname}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* DOB */}
              <div className="add-teacher-field">
                <label>Date of Birth</label>

                <div className="add-teacher-input-box">
                  <i className="bi bi-calendar-event"></i>

                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* DOJ */}
              <div className="add-teacher-field">
                <label>Date of Joining</label>

                <div className="add-teacher-input-box">
                  <i className="bi bi-calendar-check"></i>

                  <input
                    type="date"
                    name="doj"
                    value={formData.doj}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* IMAGE */}
              <div className="add-teacher-field">
                <label>Teacher Image</label>

                <label className="add-teacher-upload">

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                  />

                  <div className="add-teacher-upload-content">
                    <i className="bi bi-cloud-arrow-up"></i>

                    <div>
                      <strong>Upload Image</strong>
                      <small>
                        JPG, PNG or JPEG supported
                      </small>
                    </div>
                  </div>

                </label>
              </div>

            </div>

            {/* IMAGE PREVIEW */}
            {preview && (
              <div className="add-teacher-preview-section">

                <p>Image Preview</p>

                <div className="add-teacher-preview">
                  <img
                    src={preview}
                    alt="Teacher Preview"
                  />
                </div>

              </div>
            )}

            {/* MESSAGE */}
            {message && (
              <div
                className={`add-teacher-message ${
                  message.includes("success")
                    ? "success"
                    : "error"
                }`}
              >
                <i
                  className={
                    message.includes("success")
                      ? "bi bi-check-circle-fill"
                      : "bi bi-exclamation-circle-fill"
                  }
                ></i>

                {message}
              </div>
            )}

            {/* BUTTONS */}
            <div className="add-teacher-actions">

              <button
                type="button"
                className="add-teacher-cancel-btn"
                onClick={() =>
                  navigate(
                    "/dashboard/TeacherComponent/ViewTeachers"
                  )
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="add-teacher-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="add-teacher-spinner"></span>
                    Adding...
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-plus-fill"></i>
                    Add Teacher
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

export default AddTeacher;