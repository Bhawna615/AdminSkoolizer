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

        const student = res.data.student; // ✅ FIXED (object)

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
        navigate(`/dashboard/StudentComponent/ViewStudentProfile/${studentId}`);
      }
    } catch (err) {
      console.error("Update Error:", err);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="kk-wrapper">
      <div className="kk-form-box">
        <div className="kk-title-bar">Edit Details</div>

        <form onSubmit={handleSubmit} className="kk-form">
          <div className="kk-columns">

            {/* COLUMN 1 */}
            <div className="kk-column">
              <label>Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} />

              <label>Class</label>
              <select name="class" value={formData.class} onChange={handleChange}>
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.Classname}>
                    {cls.Classname}
                  </option>
                ))}
              </select>

              <label>Father's Name</label>
              <input type="text" name="fname" value={formData.fname} onChange={handleChange} />

              <label>Mother's Name</label>
              <input type="text" name="mname" value={formData.mname} onChange={handleChange} />

              <label>Student Image</label>
              <input type="file" onChange={(e) => setImage(e.target.files[0])} />

              <label>Height</label>
              <input type="text" name="height" value={formData.height} onChange={handleChange} />
            </div>

            {/* COLUMN 2 */}
            <div className="kk-column">
              <label>Guardian's Name</label>
              <input type="text" name="gname" value={formData.gname} onChange={handleChange} />

              <label>Contact No.</label>
              <input type="number" name="contact" value={formData.contact} onChange={handleChange} />

              <label>Admission No.</label>
              <input type="text" name="admno" value={formData.admno} onChange={handleChange} />

              <label>SMS No.</label>
              <input type="number" name="smsno" value={formData.smsno} onChange={handleChange} />

              <label>Roll No</label>
              <input type="number" name="rollno" value={formData.rollno} onChange={handleChange} />

              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select</option>
                <option value="m">Male</option>
                <option value="f">Female</option>
              </select>

              <label>Weight</label>
              <input type="text" name="weight" value={formData.weight} onChange={handleChange} />
            </div>

            {/* COLUMN 3 */}
            <div className="kk-column">
              <label>Aadhar No.</label>
              <input type="text" name="aadharno" value={formData.aadharno} onChange={handleChange} />

              <label>Date of Birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} />

              <label>Last School</label>
              <input type="text" name="lastschool" value={formData.lastschool} onChange={handleChange} />

              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />

              <label>Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} />

              <label>Date of Admission</label>
              <input type="date" name="date_of_admission" value={formData.date_of_admission} onChange={handleChange} />

              <label>Tuition Fee</label>
              <input type="text" name="tuition_fee" value={formData.tuition_fee} onChange={handleChange} />

              <label>Admission Fee</label>
              <input type="text" name="admission_fee" value={formData.admission_fee} onChange={handleChange} />

              <label>Annual Fee</label>
              <input type="text" name="annual_fee" value={formData.annual_fee} onChange={handleChange} />

              <label>Transport Fee</label>
              <input type="text" name="transport_fee" value={formData.transport_fee} onChange={handleChange} />

              <label>Blood Group</label>
              <input type="text" name="blood_group" value={formData.blood_group} onChange={handleChange} />
            </div>

          </div>

          <div className="kk-button-wrapper">
            <button type="submit" className="kk-update-btn">
              UPDATE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudent;