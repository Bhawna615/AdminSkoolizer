
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./StudentAdmission.css";

const StudentAdmission = () => {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(
    "Preparing admission..."
  );

  const [form, setForm] = useState({
    name: "",
    class: "",
    fname: "",
    mname: "",
    gname: "",
    contact: "",
    admno: "",
    smsno: "",
    rollno: "",
    gender: "m",
    height: "",
    weight: "",
    aadharno: "",
    dob: null,
    lastschool: "",
    email: "",
    address: "",
    date_of_admission: null,
    blood_group: "",
    image: null,
  });

  // =====================================================
  // FETCH CLASSES
  // =====================================================

  useEffect(() => {
    axios
      .get(
        "http://localhost/kkblossom/api.php/Adminapi/AdminStudent/classes"
      )
      .then((res) => {
        setClasses(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Error fetching classes:", err);
      });
  }, []);

  // =====================================================
  // FORM INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // =====================================================
  // SUBMIT ADMISSION FORM
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setErrors({});
    setSuccess("");
    setLoading(true);
    setProgress(5);
    setLoadingStep("Preparing student information...");

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      formData.append(
        key,
        form[key] instanceof Date
          ? form[key].toISOString().split("T")[0]
          : form[key] ?? ""
      );
    });

    try {
      const res = await axios.post(
        "http://localhost/kkblossom/api.php/Adminapi/AdminStudent/enroll",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data?.status) {
        setProgress(100);
        setLoadingStep(
          "Student admission completed successfully!"
        );

        setTimeout(() => {
          setLoading(false);

          setSuccess(
            res.data?.message || "Student admission successful!"
          );
        }, 700);

        setTimeout(() => {
          navigate(
            "/dashboard/StudentComponent/AdminViewStudent"
          );
        }, 2500);
      } else {
        setProgress(100);
        setLoadingStep(
          "Please review the admission information."
        );

        setErrors(
          res.data?.errors || {
            submit:
              res.data?.message ||
              "Unable to complete student admission.",
          }
        );

        setTimeout(() => {
          setLoading(false);
        }, 700);
      }
    } catch (err) {
      console.error("Student admission error:", err);

      setProgress(100);
      setLoadingStep("Admission could not be completed.");

      setErrors({
        submit:
          err.response?.data?.message ||
          "Something went wrong. Please try again.",
      });

      setTimeout(() => {
        setLoading(false);
      }, 700);
    }
  };

  // =====================================================
  // LOADER PROGRESS
  // =====================================================

  useEffect(() => {
    if (!loading || progress >= 100) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90;
        return Math.min(prev + 1, 90);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [loading, progress]);

  // =====================================================
  // LOADER STATUS MESSAGES
  // =====================================================

  useEffect(() => {
    if (!loading || progress >= 100) return;

    if (progress < 15) {
      setLoadingStep("Preparing student information...");
    } else if (progress < 35) {
      setLoadingStep("Uploading student details...");
    } else if (progress < 60) {
      setLoadingStep("Validating admission information...");
    } else if (progress < 85) {
      setLoadingStep("Saving student record...");
    } else {
      setLoadingStep("Finalizing admission...");
    }
  }, [loading, progress]);

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="student-admission-page">

      {/* FULL-SCREEN LOADER */}

      {loading && (
        <div
          className="student-admission-loader-overlay"
          role="status"
          aria-live="polite"
          aria-label={`Admission progress ${progress}%`}
        >
          <div className="student-admission-loader-card">

            <div className="student-admission-loader-icon">
              {progress === 100 ? (
                loadingStep.includes("successfully") ? (
                  <i className="bi bi-check-lg"></i>
                ) : (
                  <i className="bi bi-exclamation-circle"></i>
                )
              ) : (
                <i className="bi bi-person-plus-fill"></i>
              )}
            </div>

            <h2>
              {progress === 100
                ? loadingStep.includes("successfully")
                  ? "Admission Completed"
                  : "Processing Finished"
                : "Admitting Student"}
            </h2>

            <p className="student-admission-loader-step">
              {loadingStep}
            </p>

            {/* DONUT PERCENTAGE INDICATOR */}

            <div
              className="student-admission-donut"
              style={{
                "--admission-progress": `${progress * 3.6}deg`,
              }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Admission progress ${progress}%`}
            >
              <div className="student-admission-donut-inner">
                <span className="student-admission-donut-value">
                  {progress}%
                </span>

                <span className="student-admission-donut-label">
                  Complete
                </span>
              </div>
            </div>

            <div className="student-admission-loader-footer">
              <span>
                <i className="bi bi-shield-check"></i>
                {progress === 100
                  ? "Request processing finished"
                  : "Please wait, do not close this page"}
              </span>
            </div>

          </div>
        </div>
      )}

      {/* PAGE HEADER */}

      <div className="student-admission-header">
        <div className="student-admission-header-left">

          <div className="student-admission-header-icon">
            <i className="bi bi-person-plus-fill"></i>
          </div>

          <div>
            <h1>Student Admission</h1>
            <p>
              Register a new student in the school management system
            </p>
          </div>

        </div>

        <div className="student-admission-header-badge">
          <i className="bi bi-mortarboard-fill"></i>
          New Admission
        </div>
      </div>

      {/* SUCCESS POPUP */}

      {success && (
        <div className="student-admission-success">
          <div>

            <div className="student-admission-success-icon">
              <i className="bi bi-check-lg"></i>
            </div>

            <strong>Admission Successful</strong>
            <span>{success}</span>

            <button
              type="button"
              onClick={() => setSuccess("")}
              aria-label="Close success message"
            >
              <i className="bi bi-x-lg"></i>
            </button>

          </div>
        </div>
      )}

      {/* FORM CARD */}

      <div className="student-admission-card">

        <div className="student-admission-card-header">
          <div className="student-admission-card-title">

            <div className="student-admission-card-title-icon">
              <i className="bi bi-person-vcard-fill"></i>
            </div>

            <div>
              <h2>Student Registration Form</h2>
              <p>
                Enter the student's personal and admission details
              </p>
            </div>

          </div>

          <div className="student-admission-required-note">
            <span>*</span> Required fields
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="student-admission-form"
        >

          {/* SECTION 1 - BASIC INFORMATION */}

          <div className="student-admission-section">

            <div className="student-admission-section-heading">
              <div className="student-admission-section-number">
                01
              </div>

              <div>
                <h3>Basic Information</h3>
                <p>Student's personal information</p>
              </div>
            </div>

            <div className="student-admission-grid">

              <div className="student-admission-field">
                <label>
                  Student Name<span>*</span>
                </label>

                <div className="student-admission-input-wrap">
                  <i className="bi bi-person"></i>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    placeholder="Enter student name"
                    onChange={handleChange}
                  />
                </div>

                {errors.name && (
                  <div className="student-admission-error">
                    <i className="bi bi-exclamation-circle"></i>
                    {errors.name}
                  </div>
                )}
              </div>

              <div className="student-admission-field">
                <label>
                  Class<span>*</span>
                </label>

                <div className="student-admission-input-wrap">
                  <i className="bi bi-mortarboard"></i>
                  <select
                    name="class"
                    value={form.class}
                    onChange={handleChange}
                  >
                    <option value="">Select Class</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.Classname}>
                        Class {c.Classname}
                      </option>
                    ))}
                  </select>
                </div>

                {errors.class && (
                  <div className="student-admission-error">
                    <i className="bi bi-exclamation-circle"></i>
                    {errors.class}
                  </div>
                )}
              </div>

              <div className="student-admission-field">
                <label>Gender</label>
                <div className="student-admission-input-wrap">
                  <i className="bi bi-gender-ambiguous"></i>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                  >
                    <option value="m">Male</option>
                    <option value="f">Female</option>
                  </select>
                </div>
              </div>

              <div className="student-admission-field">
                <label>Date of Birth</label>
                <div className="student-admission-datepicker-wrap">
                  <i className="bi bi-calendar3"></i>
                  <DatePicker
                    selected={form.dob}
                    onChange={(date) =>
                      setForm((prev) => ({ ...prev, dob: date }))
                    }
                    dateFormat="dd-MM-yyyy"
                    placeholderText="Select date of birth"
                    className="student-admission-datepicker"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                </div>
              </div>

              <div className="student-admission-field">
                <label>Blood Group</label>
                <div className="student-admission-input-wrap">
                  <i className="bi bi-droplet-fill"></i>
                  <select
                    name="blood_group"
                    value={form.blood_group}
                    onChange={handleChange}
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div className="student-admission-field">
                <label>Student Image</label>
                <div className="student-admission-file-wrap">
                  <i className="bi bi-camera-fill"></i>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 2 - FAMILY INFORMATION */}

          <div className="student-admission-section">

            <div className="student-admission-section-heading">
              <div className="student-admission-section-number">
                02
              </div>

              <div>
                <h3>Family Information</h3>
                <p>Parent and guardian details</p>
              </div>
            </div>

            <div className="student-admission-grid">

              <div className="student-admission-field">
                <label>Father's Name</label>
                <div className="student-admission-input-wrap">
                  <i className="bi bi-person-badge"></i>
                  <input
                    type="text"
                    name="fname"
                    value={form.fname}
                    placeholder="Enter father's name"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="student-admission-field">
                <label>Mother's Name</label>
                <div className="student-admission-input-wrap">
                  <i className="bi bi-person-badge"></i>
                  <input
                    type="text"
                    name="mname"
                    value={form.mname}
                    placeholder="Enter mother's name"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="student-admission-field">
                <label>Guardian's Name</label>
                <div className="student-admission-input-wrap">
                  <i className="bi bi-people"></i>
                  <input
                    type="text"
                    name="gname"
                    value={form.gname}
                    placeholder="Enter guardian's name"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="student-admission-field">
                <label>Contact Number</label>
                <div className="student-admission-input-wrap">
                  <i className="bi bi-telephone"></i>
                  <input
                    type="tel"
                    name="contact"
                    value={form.contact}
                    placeholder="Enter contact number"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="student-admission-field">
                <label>SMS Number</label>
                <div className="student-admission-input-wrap">
                  <i className="bi bi-chat-left-dots"></i>
                  <input
                    type="tel"
                    name="smsno"
                    value={form.smsno}
                    placeholder="Enter SMS number"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="student-admission-field">
                <label>Email Address</label>
                <div className="student-admission-input-wrap">
                  <i className="bi bi-envelope"></i>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    placeholder="Enter email address"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="student-admission-field student-admission-field-full">
                <label>Address</label>
                <div className="student-admission-textarea-wrap">
                  <i className="bi bi-geo-alt"></i>
                  <textarea
                    name="address"
                    value={form.address}
                    placeholder="Enter complete residential address"
                    onChange={handleChange}
                    rows="3"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 3 - ADMISSION INFORMATION */}

          <div className="student-admission-section">

            <div className="student-admission-section-heading">
              <div className="student-admission-section-number">
                03
              </div>

              <div>
                <h3>Admission Information</h3>
                <p>School admission and academic details</p>
              </div>
            </div>

            <div className="student-admission-grid">

              <div className="student-admission-field">
                <label>Admission Number</label>
                <div className="student-admission-input-wrap">
                  <i className="bi bi-hash"></i>
                  <input
                    type="text"
                    name="admno"
                    value={form.admno}
                    placeholder="Enter admission number"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="student-admission-field">
                <label>Roll Number</label>
                <div className="student-admission-input-wrap">
                  <i className="bi bi-list-ol"></i>
                  <input
                    type="text"
                    name="rollno"
                    value={form.rollno}
                    placeholder="Enter roll number"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="student-admission-field">
                <label>Last School</label>
                <div className="student-admission-input-wrap">
                  <i className="bi bi-building"></i>
                  <input
                    type="text"
                    name="lastschool"
                    value={form.lastschool}
                    placeholder="Enter previous school"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="student-admission-field">
                <label>Date of Admission</label>
                <div className="student-admission-datepicker-wrap">
                  <i className="bi bi-calendar-check"></i>
                  <DatePicker
                    selected={form.date_of_admission}
                    onChange={(date) =>
                      setForm((prev) => ({
                        ...prev,
                        date_of_admission: date,
                      }))
                    }
                    dateFormat="dd-MM-yyyy"
                    placeholderText="Select admission date"
                    className="student-admission-datepicker"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                </div>
              </div>

              <div className="student-admission-field">
                <label>Aadhar Number</label>
                <div className="student-admission-input-wrap">
                  <i className="bi bi-credit-card-2-front"></i>
                  <input
                    type="text"
                    name="aadharno"
                    value={form.aadharno}
                    placeholder="Enter Aadhar number"
                    onChange={handleChange}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 4 - PHYSICAL INFORMATION */}

          <div className="student-admission-section">

            <div className="student-admission-section-heading">
              <div className="student-admission-section-number">
                04
              </div>

              <div>
                <h3>Physical Information</h3>
                <p>Student's physical details</p>
              </div>
            </div>

            <div className="student-admission-grid">

              <div className="student-admission-field">
                <label>Height</label>
                <div className="student-admission-input-wrap">
                  <i className="bi bi-arrows-vertical"></i>
                  <input
                    type="text"
                    name="height"
                    value={form.height}
                    placeholder="Enter height"
                    onChange={handleChange}
                  />
                  <span className="student-admission-unit">cm</span>
                </div>
              </div>

              <div className="student-admission-field">
                <label>Weight</label>
                <div className="student-admission-input-wrap">
                  <i className="bi bi-speedometer2"></i>
                  <input
                    type="text"
                    name="weight"
                    value={form.weight}
                    placeholder="Enter weight"
                    onChange={handleChange}
                  />
                  <span className="student-admission-unit">kg</span>
                </div>
              </div>

            </div>
          </div>

          {/* SUBMIT AREA */}

          <div className="student-admission-submit-area">

            <div className="student-admission-submit-info">
              <i className="bi bi-info-circle-fill"></i>
              <span>
                Please verify all information before submitting
                the admission form.
              </span>
            </div>

            <button
              type="submit"
              className="student-admission-submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="bi bi-arrow-repeat student-admission-button-spin"></i>
                  Processing {progress}%
                </>
              ) : (
                <>
                  <i className="bi bi-person-plus-fill"></i>
                  Admit Student
                </>
              )}
            </button>

          </div>

          {/* GENERAL SUBMISSION ERROR */}

          {errors.submit && (
            <div
              className="student-admission-error"
              role="alert"
              style={{
                margin: "0 25px 20px",
                fontSize: "12px",
              }}
            >
              <i className="bi bi-exclamation-circle"></i>
              {errors.submit}
            </div>
          )}

        </form>
      </div>
    </div>
  );
};

export default StudentAdmission;
