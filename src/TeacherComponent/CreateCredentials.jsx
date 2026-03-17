import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./AddTeacher.css";

const BASE_URL = "http://localhost/kkblossom/api.php/Adminapi/AdminTeacher/";

const CreateCredentials = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchTeacher();
    }
  }, [id]);

  const fetchTeacher = async () => {
    try {
      const res = await axios.get(BASE_URL + "getTeacher/" + id);

      console.log("Teacher API Response:", res.data);

      if (res.data) {
        setEmail(res.data.Email || "");
      } else {
        setMessage("Teacher data not found");
      }

      setLoading(false);

    } catch (error) {
      console.error("Fetch Error:", error);
      setMessage("Failed to fetch teacher data");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.trim() === "") {
      setMessage("Password cannot be empty");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("email", email);
      formData.append("password", password);

      const res = await axios.post(
        BASE_URL + "storeCredentials",
        formData
      );

      console.log("Store Credentials Response:", res.data);

      if (res.data.status === "success") {
        alert("Credentials Generated Successfully");
        navigate("/dashboard/TeacherComponent/ViewTeachers");
      } else {
        setMessage(res.data.message || "Something went wrong");
      }

    } catch (error) {
      console.error("Submit Error:", error);
      setMessage("Failed to generate credentials");
    }
  };

  if (loading) {
    return <div className="innerview">Loading teacher data...</div>;
  }

  return (
    <div className="innerview">

      {message && (
        <div className="error-bar">
          {message}
        </div>
      )}

      <div className="form-box">

        <div className="title-bar">
          <p style={{ padding: "10px", margin: 0 }}>Details</p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="col-md-4">

            <p className="details">Email</p>
            <input
              type="text"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <p className="details">Password</p>
            <input
              type="text"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

          </div>

          <div
            style={{
              marginTop: "20px",
              textAlign: "center"
            }}
          >
            <button className="form-submit">
              Generate
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};

export default CreateCredentials;