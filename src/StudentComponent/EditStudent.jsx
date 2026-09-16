import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./EditStudent.css";

const BASE_URL = "http://localhost/kkblossom/api.php/Adminapi/";

const EditStudent = () => {
const { studentId } = useParams();
const navigate = useNavigate();

const [classes, setClasses] = useState([]);
const [image, setImage] = useState(null);
const [loading, setLoading] = useState(true);

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

useEffect(() => {
axios
.get(`${BASE_URL}AdminStudent/edit/${studentId}`)
.then((res) => {
if (!res.data || !res.data.student) {
console.error("Student not found");
setLoading(false);
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
    setLoading(false);
  })
  .catch((err) => {
    console.error("API Error:", err);
    setLoading(false);
  });


}, [studentId]);

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
};

const handleSubmit = async (e) => {
e.preventDefault();

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

  alert(res.data.message);

  if (res.data.status) {
    navigate(
      `/dashboard/StudentComponent/ViewStudentProfile/${studentId}`
    );
  }
} catch (err) {
  console.error("Update Error:", err);
}


};

if (loading) {
return ( <div className="edit-student-loading"> <div className="edit-student-loader"></div> <p>Loading student details...</p> </div>
);
}

return ( <div className="edit-student-page">


  <div className="edit-student-card">

    {/* =====================================
        HEADER
    ====================================== */}

    <div className="edit-student-header">

      <div>
        <h1>Edit Student</h1>
        <p>Update student information and fee details</p>
      </div>

      <div className="edit-student-header-icon">
        ✎
      </div>

    </div>


    {/* =====================================
        FORM
    ====================================== */}

    <form
      onSubmit={handleSubmit}
      className="edit-student-form"
    >

      {/* =====================================
          PERSONAL INFORMATION
      ====================================== */}

      <div className="edit-student-section">

        <div className="edit-student-section-heading">
          <span className="edit-student-section-number">
            01
          </span>

          <div>
            <h2>Personal Information</h2>
            <p>Basic details of the student</p>
          </div>
        </div>

        <div className="edit-student-grid">

          <div className="edit-student-field">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="edit-student-field">
            <label>Class</label>

            <select
              name="class"
              value={formData.class}
              onChange={handleChange}
            >
              <option value="">Select Class</option>

              {classes.map((cls) => (
                <option
                  key={cls.id}
                  value={cls.Classname}
                >
                  {cls.Classname}
                </option>
              ))}
            </select>
          </div>

          <div className="edit-student-field">
            <label>Father's Name</label>
            <input
              type="text"
              name="fname"
              value={formData.fname}
              onChange={handleChange}
            />
          </div>

          <div className="edit-student-field">
            <label>Mother's Name</label>
            <input
              type="text"
              name="mname"
              value={formData.mname}
              onChange={handleChange}
            />
          </div>

          <div className="edit-student-field">
            <label>Guardian's Name</label>
            <input
              type="text"
              name="gname"
              value={formData.gname}
              onChange={handleChange}
            />
          </div>

          <div className="edit-student-field">
            <label>Gender</label>

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="m">Male</option>
              <option value="f">Female</option>
            </select>
          </div>

        </div>

      </div>


      {/* =====================================
          ADMISSION INFORMATION
      ====================================== */}

      <div className="edit-student-section">

        <div className="edit-student-section-heading">

          <span className="edit-student-section-number">
            02
          </span>

          <div>
            <h2>Admission Information</h2>
            <p>Student admission and identification details</p>
          </div>

        </div>

        <div className="edit-student-grid">

          <div className="edit-student-field">
            <label>Admission No.</label>
            <input
              type="text"
              name="admno"
              value={formData.admno}
              onChange={handleChange}
            />
          </div>

          <div className="edit-student-field">
            <label>Roll No.</label>
            <input
              type="number"
              name="rollno"
              value={formData.rollno}
              onChange={handleChange}
            />
          </div>

          <div className="edit-student-field">
            <label>Date of Admission</label>
            <input
              type="date"
              name="date_of_admission"
              value={formData.date_of_admission}
              onChange={handleChange}
            />
          </div>

          <div className="edit-student-field">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>

          <div className="edit-student-field">
            <label>Last School</label>
            <input
              type="text"
              name="lastschool"
              value={formData.lastschool}
              onChange={handleChange}
            />
          </div>

          <div className="edit-student-field">
            <label>Aadhar No.</label>
            <input
              type="text"
              name="aadharno"
              value={formData.aadharno}
              onChange={handleChange}
            />
          </div>

        </div>

      </div>


      {/* =====================================
          CONTACT INFORMATION
      ====================================== */}

      <div className="edit-student-section">

        <div className="edit-student-section-heading">

          <span className="edit-student-section-number">
            03
          </span>

          <div>
            <h2>Contact Information</h2>
            <p>Contact and communication details</p>
          </div>

        </div>

        <div className="edit-student-grid">

          <div className="edit-student-field">
            <label>Contact No.</label>
            <input
              type="number"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
            />
          </div>

          <div className="edit-student-field">
            <label>SMS No.</label>
            <input
              type="number"
              name="smsno"
              value={formData.smsno}
              onChange={handleChange}
            />
          </div>

          <div className="edit-student-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="edit-student-field edit-student-full-field">
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>

        </div>

      </div>


      {/* =====================================
          PHYSICAL INFORMATION
      ====================================== */}

      <div className="edit-student-section">

        <div className="edit-student-section-heading">

          <span className="edit-student-section-number">
            04
          </span>

          <div>
            <h2>Physical Information</h2>
            <p>Student physical and health information</p>
          </div>

        </div>

        <div className="edit-student-grid">

          <div className="edit-student-field">
            <label>Height</label>
            <input
              type="text"
              name="height"
              value={formData.height}
              onChange={handleChange}
              placeholder="Enter height"
            />
          </div>

          <div className="edit-student-field">
            <label>Weight</label>
            <input
              type="text"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="Enter weight"
            />
          </div>

          <div className="edit-student-field">
            <label>Blood Group</label>
            <input
              type="text"
              name="blood_group"
              value={formData.blood_group}
              onChange={handleChange}
              placeholder="e.g. O+"
            />
          </div>

          <div className="edit-student-field">
            <label>Student Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImage(e.target.files[0])
              }
            />
          </div>

        </div>

      </div>


      {/* =====================================
          FEE INFORMATION
      ====================================== */}

      <div className="edit-student-section">

        <div className="edit-student-section-heading">

          <span className="edit-student-section-number">
            05
          </span>

          <div>
            <h2>Fee Information</h2>
            <p>Student fee structure</p>
          </div>

        </div>

        <div className="edit-student-grid">

          <div className="edit-student-field">
            <label>Tuition Fee</label>
            <input
              type="text"
              name="tuition_fee"
              value={formData.tuition_fee}
              onChange={handleChange}
            />
          </div>

          <div className="edit-student-field">
            <label>Admission Fee</label>
            <input
              type="text"
              name="admission_fee"
              value={formData.admission_fee}
              onChange={handleChange}
            />
          </div>

          <div className="edit-student-field">
            <label>Annual Fee</label>
            <input
              type="text"
              name="annual_fee"
              value={formData.annual_fee}
              onChange={handleChange}
            />
          </div>

          <div className="edit-student-field">
            <label>Transport Fee</label>
            <input
              type="text"
              name="transport_fee"
              value={formData.transport_fee}
              onChange={handleChange}
            />
          </div>

        </div>

      </div>


      {/* =====================================
          ACTIONS
      ====================================== */}

      <div className="edit-student-actions">

        <button
          type="button"
          className="edit-student-cancel-btn"
          onClick={() =>
            navigate(
              `/dashboard/StudentComponent/ViewStudentProfile/${studentId}`
            )
          }
        >
          CANCEL
        </button>

        <button
          type="submit"
          className="edit-student-update-btn"
        >
          UPDATE STUDENT
        </button>

      </div>

    </form>

  </div>

</div>


);
};

export default EditStudent;
