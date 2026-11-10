import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./EditStudent.css";

const BASE_URL = "http://localhost/kkblossom/api.php/Adminapi/";

const EditStudent = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const messageTimeoutRef = useRef(null);
  const navigationTimeoutRef = useRef(null);
  const mountedRef = useRef(true);

  const [classes, setClasses] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    class: "",
    fname: "",
    mname: "",
    gname: "",
    contact: "",
    admno: "",
    smsno: "",
    rollno: "",
    gender: "",
    weight: "",
    height: "",
    aadharno: "",
    dob: "",
    lastschool: "",
    email: "",
    address: "",
    date_of_admission: "",
    tuition_fee: "",
    admission_fee: "",
    annual_fee: "",
    transport_fee: "",
    blood_group: "",
  });

  const clearMessageTimeout = () => {
    if (messageTimeoutRef.current) {
      window.clearTimeout(messageTimeoutRef.current);
      messageTimeoutRef.current = null;
    }
  };

  const clearNavigationTimeout = () => {
    if (navigationTimeoutRef.current) {
      window.clearTimeout(navigationTimeoutRef.current);
      navigationTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    let isMounted = true;

    const fetchStudent = async () => {
      setLoading(true);

      try {
        const res = await axios.get(
          `${BASE_URL}AdminStudent/edit/${studentId}`
        );

        if (!isMounted) return;

        if (!res.data || !res.data.student) {
          setMessage("Student record could not be found.");
          setMessageType("error");
          return;
        }

        const student = res.data.student;

        setFormData({
          id: student.id || "",
          name: student.Name || "",
          class: student.Class || "",
          fname: student.Fname || "",
          mname: student.Mname || "",
          gname: student.Guardianname || "",
          contact: student.Contact || "",
          admno: student.Admno || "",
          smsno: student.Smsno || "",
          rollno: student.Rollno || "",
          gender: student.gender || "",
          weight: student.weight || "",
          height: student.height || "",
          aadharno: student.Aadharno || "",
          dob: student.Dob ? student.Dob.split(" ")[0] : "",
          lastschool: student.Lastschool || "",
          email: student.Email || "",
          address: student.Address || "",
          date_of_admission: student.admission_date
            ? student.admission_date.split(" ")[0]
            : "",
          tuition_fee: student.tuition_fee || "",
          admission_fee: student.admission_fee || "",
          annual_fee: student.annual_fee || "",
          transport_fee: student.transport_fee || "",
          blood_group: student.blood_group || "",
        });

        setClasses(res.data.classes || []);
      } catch (err) {
        console.error("Student Fetch Error:", err);

        if (isMounted) {
          setMessage("Unable to load student details. Please try again.");
          setMessageType("error");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStudent();

    return () => {
      isMounted = false;
      mountedRef.current = false;

      clearMessageTimeout();
      clearNavigationTimeout();
    };
  }, [studentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Display a message without automatically redirecting.
  const showMessage = (text, type) => {
    clearMessageTimeout();

    setMessage(text);
    setMessageType(type);
  };

  // Navigate immediately when the user clicks OK.
  const closeMessage = () => {
    clearMessageTimeout();
    clearNavigationTimeout();

    const wasSuccessful = messageType === "success";
    const successText = message;

    setMessage("");
    setMessageType("");

    if (wasSuccessful) {
      navigate(
        `/dashboard/StudentComponent/ViewStudentProfile/${studentId}`,
        {
          state: {
            successMessage: successText,
          },
          replace: true,
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (updating) return;

    clearMessageTimeout();
    clearNavigationTimeout();

    setMessage("");
    setMessageType("");
    setUpdating(true);

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    if (image) {
      data.append("image", image);
    }

    try {
      const res = await axios.post(
        `${BASE_URL}AdminStudent/update`,
        data
      );

      if (res.data && res.data.status) {
        const successText =
          res.data.message || "Student updated successfully.";

        showMessage(successText, "success");
      } else {
        showMessage(
          (res.data && res.data.message) ||
            "Unable to update student. Please check the details and try again.",
          "error"
        );
      }
    } catch (err) {
      console.error("Update Error:", err);

      const serverMessage =
        err.response?.data?.message ||
        "Something went wrong while updating the student. Please try again.";

      showMessage(serverMessage, "error");
    } finally {
      if (mountedRef.current) {
        setUpdating(false);
      }
    }
  };

  const handleCancel = () => {
    if (updating) return;

    clearMessageTimeout();
    clearNavigationTimeout();

    navigate(
      `/dashboard/StudentComponent/ViewStudentProfile/${studentId}`
    );
  };

  if (loading) {
    return (
      <div className="edit-student-loading">
        <div className="edit-student-loader"></div>

        <h2>Loading student details</h2>

        <p>
          Please wait while the student record is being loaded...
        </p>
      </div>
    );
  }

  return (
    <div className="edit-student-page">
      <div className="edit-student-container">
        {/* PAGE HEADING */}

        <div className="edit-student-page-heading">
          <div className="edit-student-heading-left">
            <button
              type="button"
              className="edit-student-back-btn"
              onClick={handleCancel}
              disabled={updating}
              aria-label="Go back"
            >
              ←
            </button>

            <div>
              <span className="edit-student-eyebrow">
                STUDENT MANAGEMENT
              </span>

              <h1>Update Student</h1>

              <p>Update the student's existing information</p>
            </div>
          </div>

          <div className="edit-student-record-badge">
            <span className="edit-student-status-dot"></span>
            Editing Record
          </div>
        </div>

        {/* MAIN FORM */}

        <form onSubmit={handleSubmit} className="edit-student-form">
          {/* 01 — PERSONAL INFORMATION */}

          <section className="edit-student-section">
            <div className="edit-student-section-header">
              <div className="edit-student-section-number">01</div>

              <div className="edit-student-section-title">
                <h2>Personal Information</h2>
                <p>Basic student and family details</p>
              </div>
            </div>

            <div className="edit-student-grid">
              <div className="edit-student-field">
                <label htmlFor="name">Student Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter student name"
                />
              </div>

              <div className="edit-student-field">
                <label htmlFor="class">Class</label>
                <select
                  id="class"
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                >
                  <option value="">Select Class</option>

                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.Classname}>
                      {cls.Classname}
                    </option>
                  ))}
                </select>
              </div>

              <div className="edit-student-field">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="m">Male</option>
                  <option value="f">Female</option>
                </select>
              </div>

              <div className="edit-student-field">
                <label htmlFor="fname">Father's Name</label>
                <input
                  id="fname"
                  type="text"
                  name="fname"
                  value={formData.fname}
                  onChange={handleChange}
                  placeholder="Enter father's name"
                />
              </div>

              <div className="edit-student-field">
                <label htmlFor="mname">Mother's Name</label>
                <input
                  id="mname"
                  type="text"
                  name="mname"
                  value={formData.mname}
                  onChange={handleChange}
                  placeholder="Enter mother's name"
                />
              </div>

              <div className="edit-student-field">
                <label htmlFor="gname">Guardian's Name</label>
                <input
                  id="gname"
                  type="text"
                  name="gname"
                  value={formData.gname}
                  onChange={handleChange}
                  placeholder="Enter guardian's name"
                />
              </div>
            </div>
          </section>

          {/* 02 — ADMISSION INFORMATION */}

          <section className="edit-student-section">
            <div className="edit-student-section-header">
              <div className="edit-student-section-number">02</div>

              <div className="edit-student-section-title">
                <h2>Admission Information</h2>
                <p>Admission and student identification details</p>
              </div>
            </div>

            <div className="edit-student-grid">
              <div className="edit-student-field">
                <label htmlFor="admno">Admission No.</label>
                <input
                  id="admno"
                  type="text"
                  name="admno"
                  value={formData.admno}
                  onChange={handleChange}
                  placeholder="Enter admission number"
                />
              </div>

              <div className="edit-student-field">
                <label htmlFor="rollno">Roll No.</label>
                <input
                  id="rollno"
                  type="number"
                  name="rollno"
                  value={formData.rollno}
                  onChange={handleChange}
                  placeholder="Enter roll number"
                />
              </div>

              <div className="edit-student-field">
                <label htmlFor="date_of_admission">
                  Date of Admission
                </label>
                <input
                  id="date_of_admission"
                  type="date"
                  name="date_of_admission"
                  value={formData.date_of_admission}
                  onChange={handleChange}
                />
              </div>

              <div className="edit-student-field">
                <label htmlFor="dob">Date of Birth</label>
                <input
                  id="dob"
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>

              <div className="edit-student-field">
                <label htmlFor="lastschool">Last School</label>
                <input
                  id="lastschool"
                  type="text"
                  name="lastschool"
                  value={formData.lastschool}
                  onChange={handleChange}
                  placeholder="Enter previous school"
                />
              </div>

              <div className="edit-student-field">
                <label htmlFor="aadharno">Aadhar No.</label>
                <input
                  id="aadharno"
                  type="text"
                  name="aadharno"
                  value={formData.aadharno}
                  onChange={handleChange}
                  placeholder="Enter Aadhar number"
                />
              </div>
            </div>
          </section>

          {/* 03 — CONTACT INFORMATION */}

          <section className="edit-student-section">
            <div className="edit-student-section-header">
              <div className="edit-student-section-number">03</div>

              <div className="edit-student-section-title">
                <h2>Contact Information</h2>
                <p>Communication and address details</p>
              </div>
            </div>

            <div className="edit-student-grid">
              <div className="edit-student-field">
                <label htmlFor="contact">Contact No.</label>
                <input
                  id="contact"
                  type="number"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="Enter contact number"
                />
              </div>

              <div className="edit-student-field">
                <label htmlFor="smsno">SMS No.</label>
                <input
                  id="smsno"
                  type="number"
                  name="smsno"
                  value={formData.smsno}
                  onChange={handleChange}
                  placeholder="Enter SMS number"
                />
              </div>

              <div className="edit-student-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                />
              </div>

              <div className="edit-student-field edit-student-full-field">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter complete address"
                />
              </div>
            </div>
          </section>

          {/* 04 — PHYSICAL INFORMATION */}

          <section className="edit-student-section">
            <div className="edit-student-section-header">
              <div className="edit-student-section-number">04</div>

              <div className="edit-student-section-title">
                <h2>Physical Information</h2>
                <p>Student physical information and profile image</p>
              </div>
            </div>

            <div className="edit-student-grid">
              <div className="edit-student-field">
                <label htmlFor="height">Height</label>
                <input
                  id="height"
                  type="text"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="Enter height"
                />
              </div>

              <div className="edit-student-field">
                <label htmlFor="weight">Weight</label>
                <input
                  id="weight"
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="Enter weight"
                />
              </div>

              <div className="edit-student-field">
                <label htmlFor="blood_group">Blood Group</label>
                <input
                  id="blood_group"
                  type="text"
                  name="blood_group"
                  value={formData.blood_group}
                  onChange={handleChange}
                  placeholder="e.g. O+"
                />
              </div>

              <div className="edit-student-field edit-student-image-field">
                <label htmlFor="student-image">Student Image</label>

                <div className="edit-student-file-wrapper">
                  <input
                    id="student-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setImage(e.target.files?.[0] || null)
                    }
                  />

                  <span>
                    {image
                      ? image.name
                      : "Choose a new student image"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 05 — FEE INFORMATION */}

          <section className="edit-student-section">
            <div className="edit-student-section-header">
              <div className="edit-student-section-number">05</div>

              <div className="edit-student-section-title">
                <h2>Fee Information</h2>
                <p>Current student fee structure</p>
              </div>
            </div>

            <div className="edit-student-grid">
              <div className="edit-student-field">
                <label htmlFor="tuition_fee">Tuition Fee</label>

                <div className="edit-student-input-prefix">
                  <span>₹</span>
                  <input
                    id="tuition_fee"
                    type="text"
                    name="tuition_fee"
                    value={formData.tuition_fee}
                    onChange={handleChange}
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              <div className="edit-student-field">
                <label htmlFor="admission_fee">Admission Fee</label>

                <div className="edit-student-input-prefix">
                  <span>₹</span>
                  <input
                    id="admission_fee"
                    type="text"
                    name="admission_fee"
                    value={formData.admission_fee}
                    onChange={handleChange}
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              <div className="edit-student-field">
                <label htmlFor="annual_fee">Annual Fee</label>

                <div className="edit-student-input-prefix">
                  <span>₹</span>
                  <input
                    id="annual_fee"
                    type="text"
                    name="annual_fee"
                    value={formData.annual_fee}
                    onChange={handleChange}
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              <div className="edit-student-field">
                <label htmlFor="transport_fee">Transport Fee</label>

                <div className="edit-student-input-prefix">
                  <span>₹</span>
                  <input
                    id="transport_fee"
                    type="text"
                    name="transport_fee"
                    value={formData.transport_fee}
                    onChange={handleChange}
                    placeholder="Enter amount"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ACTION BUTTONS */}

          <div className="edit-student-actions">
            <button
              type="button"
              className="edit-student-cancel-btn"
              onClick={handleCancel}
              disabled={updating}
            >
              <span>←</span>
              CANCEL
            </button>

            <button
              type="submit"
              className="edit-student-update-btn"
              disabled={updating}
            >
              {updating ? (
                <>
                  <span className="edit-student-button-spinner"></span>
                  UPDATING...
                </>
              ) : (
                <>
                  <span>✓</span>
                  UPDATE STUDENT
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* FULL-SCREEN LOADER DURING UPDATE */}

      {updating && (
        <div
          className="edit-student-update-overlay"
          role="status"
          aria-live="polite"
          aria-label="Updating student details"
        >
          <div className="edit-student-update-loader"></div>

          <h2>Updating Student Details</h2>

          <p>
            Please wait while we securely save the updated student record.
          </p>

          <div className="edit-student-update-progress">
            <span></span>
          </div>
        </div>
      )}

      {/* FULL-SCREEN SUCCESS / ERROR MESSAGE BOX AFTER LOADER */}

      {message && !updating && (
        <div className="edit-student-message-overlay">
          <div
            className={`edit-student-message-box ${
              messageType === "success"
                ? "edit-student-message-success"
                : "edit-student-message-error"
            }`}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="edit-student-message-title"
            aria-describedby="edit-student-message-description"
          >
            <div className="edit-student-message-icon">
              {messageType === "success" ? "✓" : "!"}
            </div>

            <h2 id="edit-student-message-title">
              {messageType === "success"
                ? "Student Updated Successfully"
                : "Update Failed"}
            </h2>

            <p
              id="edit-student-message-description"
              className="edit-student-message-text"
            >
              {message}
            </p>

            <button
              type="button"
              className="edit-student-message-close"
              onClick={closeMessage}
              aria-label="Close message"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditStudent;