import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./AddTeacher.css";

const BASE_URL = "http://localhost/kkblossom/api.php/Adminapi/AdminTeacher/";

const AddTeacherToFormer = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [teacher, setTeacher] = useState(null);
  const [dateOfLeaving, setDateOfLeaving] = useState("");

  useEffect(() => {
    fetchTeacher();
  }, [id]);

  const fetchTeacher = async () => {
    try {
      const res = await axios.get(BASE_URL + "getTeacher/" + id);
      console.log(res.data); // check API response
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

  const formData = new FormData();
  formData.append("id", id);
  formData.append("date_of_leaving", dateOfLeaving);

  try {
    const res = await axios.post(BASE_URL + "addToFormer", formData);

    console.log(res.data);

    if (res.data.status === "success") {
      alert("Moved to Former Successfully");
      navigate("/dashboard/TeacherComponent/FormerTeachers");
    } else {
      alert(res.data.message || "Failed to Update");
    }

  } catch (error) {
    console.error(error);
    alert("Server error");
  }
};
  if (!teacher) return <p>Loading...</p>;

  return (
    <div className="form-box">

      <div className="title-bar">
        Add To Former
      </div>

      <form onSubmit={handleSubmit} style={{ padding: "20px" }}>

        <div className="row">

          <div className="col-4">

            {teacher.image ? (
              <img
                src={`http://localhost/kkblossom/assets/images/teachers/${teacher.image}`}
                alt="teacher"
                style={{ width: "150px", marginBottom: "20px" }}
              />
            ) : (
              <img
                src="http://localhost/kkblossom/assets/icons/user-black.svg"
                alt="default"
                style={{ width: "150px", marginBottom: "20px" }}
              />
            )}

          </div>

          <div className="col-8">

            <p className="details">Name</p>
            <p>{teacher.Teachername}</p>

            <p className="details">Post</p>
            <p>{teacher.Post}</p>

            <p className="details">Class</p>
            <p>Class {teacher.Classteacher}</p>

            <p className="details">Contact</p>
            <p>{teacher.Contact}</p>

            <p className="details">Date of Birth</p>
            <p>{teacher.Dob}</p>

            <p className="details">Date of Joining</p>
            <p>{teacher.Doj}</p>

            <p className="details">Email</p>
            <p>{teacher.Email}</p>

            <p className="details">Date of Leaving</p>

            <input
              type="date"
              className="form-input"
              value={dateOfLeaving}
              onChange={(e) => setDateOfLeaving(e.target.value)}
              required
              style={{width: "49%"}}
            />

          </div>

        </div>

        <div className="submit-area">
          <button className="form-submit">
            Add To Former
          </button>
        </div>

      </form>

    </div>
  );
};

export default AddTeacherToFormer;