import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./StudentAdmission.css";

const StudentAdmission = () => {
  const [classes, setClasses] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

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

  useEffect(() => {
    axios
      .get(
        "http://localhost/kkblossom/api.php/Adminapi/AdminStudent/classes"
      )
      .then((res) => {
        setClasses(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.error(err));
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

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
        setSuccess(res.data.message);
      } else {
        setErrors(res.data?.errors || {});
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="student-admission-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

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


      {/* =====================================================
          SUCCESS MESSAGE
      ===================================================== */}

      {success && (
        <div className="student-admission-success">
          <div className="student-admission-success-icon">
            <i className="bi bi-check-lg"></i>
          </div>

          <div>
            <strong>Admission Successful</strong>
            <span>{success}</span>
          </div>

          <button
            type="button"
            onClick={() => setSuccess("")}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      )}


      {/* =====================================================
          FORM CARD
      ===================================================== */}

      <div className="student-admission-card">

        {/* CARD HEADER */}

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

          {/* =================================================
              SECTION 1 - BASIC INFORMATION
          ================================================= */}

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

              {/* NAME */}

              <div className="student-admission-field">

                <label>
                  Student Name
                  <span>*</span>
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


              {/* CLASS */}

              <div className="student-admission-field">

                <label>
                  Class
                  <span>*</span>
                </label>

                <div className="student-admission-input-wrap">
                  <i className="bi bi-mortarboard"></i>

                  <select
                    name="class"
                    value={form.class}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select Class
                    </option>

                    {classes.map((c) => (
                      <option
                        key={c.id}
                        value={c.Classname}
                      >
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


              {/* GENDER */}

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


              {/* DOB */}

              <div className="student-admission-field">

                <label>Date of Birth</label>

                <div className="student-admission-datepicker-wrap">

                  <i className="bi bi-calendar3"></i>

                  <DatePicker
                    selected={form.dob}
                    onChange={(date) =>
                      setForm((prev) => ({
                        ...prev,
                        dob: date,
                      }))
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


              {/* BLOOD GROUP */}

              <div className="student-admission-field">

                <label>Blood Group</label>

                <div className="student-admission-input-wrap">
                  <i className="bi bi-droplet-fill"></i>

                  <select
                    name="blood_group"
                    value={form.blood_group}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select Blood Group
                    </option>
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


              {/* STUDENT IMAGE */}

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


          {/* =================================================
              SECTION 2 - FAMILY INFORMATION
          ================================================= */}

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

              {/* FATHER */}

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


              {/* MOTHER */}

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


              {/* GUARDIAN */}

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


              {/* CONTACT */}

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


              {/* SMS NUMBER */}

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


              {/* EMAIL */}

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


              {/* ADDRESS */}

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


          {/* =================================================
              SECTION 3 - ADMISSION INFORMATION
          ================================================= */}

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

              {/* ADMISSION NUMBER */}

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


              {/* ROLL NUMBER */}

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


              {/* LAST SCHOOL */}

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


              {/* DATE OF ADMISSION */}

              <div className="student-admission-field">

                <label>Date of Admission</label>

                <div className="student-admission-datepicker-wrap">

                  <i className="bi bi-calendar-check"></i>

                  <DatePicker
                    selected={
                      form.date_of_admission
                    }
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


              {/* AADHAR */}

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


          {/* =================================================
              SECTION 4 - PHYSICAL INFORMATION
          ================================================= */}

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

              {/* HEIGHT */}

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

                  <span className="student-admission-unit">
                    cm
                  </span>
                </div>

              </div>


              {/* WEIGHT */}

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

                  <span className="student-admission-unit">
                    kg
                  </span>
                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              SUBMIT AREA
          ================================================= */}

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
            >
              <i className="bi bi-person-plus-fill"></i>
              Admit Student
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default StudentAdmission;