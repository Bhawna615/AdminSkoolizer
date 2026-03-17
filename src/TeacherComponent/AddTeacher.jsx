import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AddTeacher.css";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost/kkblossom/api.php/Adminapi/AdminTeacher/";

const AddTeacher = () => {

  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    post: "",
    contact: "",
    class: "",
    email: "",
    dob: "",
    doj: "",
    image: null
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
      [name]: value
    });
  };

  const handleFile = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const res = await axios.post(BASE_URL + "insertTeacher", data);

      if (res.data.status === "success") {

        setTimeout(() => {
          navigate("/dashboard/TeacherComponent/ViewTeachers");
        }, 1000);

      }

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>

      <div className="form-box">

        <div className="title-bar">
          Add Teacher
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "20px" }}>

          <div className="form-row">

            <div className="form-col">

              <p className="details">Teacher Name</p>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <p className="details">Post</p>
              <input
                type="text"
                name="post"
                className="form-input"
                value={formData.post}
                onChange={handleChange}
                required
              />

              <p className="details">Contact</p>
              <input
                type="number"
                name="contact"
                className="form-input"
                value={formData.contact}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-col">

              <p className="details">Class Teacher of</p>
              <select
                name="class"
                className="form-input"
                onChange={handleChange}
              >
                <option value="">Select Class</option>

                {classes.map((c, i) => (
                  <option key={i} value={c.Classname}>
                    Class {c.Classname}
                  </option>
                ))}
              </select>

              <p className="details">Image</p>
              <input
                type="file"
                className="form-input"
                onChange={handleFile}
              />

            </div>

            <div className="form-col">

              <p className="details">Email</p>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
              />

              <p className="details">Date of Birth</p>
              <input
                type="date"
                name="dob"
                className="form-input"
                value={formData.dob}
                onChange={handleChange}
              />

              <p className="details">Date of Joining</p>
              <input
                type="date"
                name="doj"
                className="form-input"
                value={formData.doj}
                onChange={handleChange}
              />

            </div>

          </div>

          <div className="submit-area">
            <button className="form-submit">
              Add Teacher
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};

export default AddTeacher;