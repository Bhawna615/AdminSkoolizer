import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./CreateCredentials.css";

const BASE_URL = "http://localhost/kkblossom/api.php/Adminapi/";

const CreateCredentials = () => {
const { id } = useParams();
const navigate = useNavigate();

const [student, setStudent] = useState(null);
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

// Fetch student data
useEffect(() => {
if (!id) {
setError("Invalid student ID");
setLoading(false);
return;
}


axios
  .get(`${BASE_URL}AdminStudent/view/${id}`)
  .then((res) => {
    console.log("API Response:", res.data);

    if (!res.data) {
      setError("No data received from server");
    } else if (Array.isArray(res.data) && res.data.length > 0) {
      setStudent(res.data[0]);
    } else if (typeof res.data === "object") {
      setStudent(res.data);
    } else {
      setError("Student not found");
    }

    setLoading(false);
  })
  .catch((err) => {
    console.error("API Error:", err);
    setError("Failed to fetch student data");
    setLoading(false);
  });


}, [id]);

// Submit credentials
const handleSubmit = async (e) => {
e.preventDefault();


if (!password) {
  return;
}

try {
  await axios.post(
    `${BASE_URL}AdminStudent/storeCredentials`,
    {
      id: id,
      password: password,
    }
  );

  navigate(`/dashboard/StudentComponent/ViewStudentProfile/${id}`, {
    state: {
      successMessage: "Credentials generated successfully"
    }
  });

} catch (error) {
  console.error("Store Error:", error);
  setError("Failed to generate credentials");
}


};

// Loading State
if (loading) {
return ( <div className="student-cred-loading"> <div className="student-cred-loading-card"> <div className="student-cred-loader"></div> <p>Loading student data...</p> </div> </div>
);
}

// Error State
if (error) {
return ( <div className="student-cred-error-page"> <div className="student-cred-error-box"> <h3>Something went wrong</h3> <p>{error}</p> </div> </div>
);
}

return ( <div className="student-cred-container">


  <div className="student-cred-card">

    {/* Header */}
    <div className="student-cred-header">

      <div className="student-cred-header-content">
        <h2>Generate Credentials</h2>
        <p>Create login credentials for the student</p>
      </div>

      <div className="student-cred-header-icon">
        🔐
      </div>

    </div>


    {/* Form */}
    {student && (
      <form
        onSubmit={handleSubmit}
        className="student-cred-form"
      >

        {/* Admission Number */}
        <div className="student-cred-group">

          <label className="student-cred-label">
            Admission Number
          </label>

          <input
            type="text"
            className="student-cred-input student-cred-disabled-input"
            value={student.Admno || ""}
            disabled
          />

        </div>


        {/* Password */}
        <div className="student-cred-group">

          <label className="student-cred-label">
            Create Password
          </label>

          <input
            type="password"
            className="student-cred-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />

        </div>


        {/* Button */}
        <div className="student-cred-button-area">

          <button
            type="submit"
            className="student-cred-button"
          >
            Generate Credentials
          </button>

        </div>

      </form>
    )}

  </div>

</div>


);
};

export default CreateCredentials;
