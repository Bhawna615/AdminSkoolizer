
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./CreateTeacherCredentials.css";

const BASE_URL =
  "http://localhost/kkblossom/api.php/Adminapi/AdminTeacher/";

const CreateTeacherCredentials = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchTeacher();
  }, [id]);

  const fetchTeacher = async () => {
    try {
      setFetching(true);

      const res = await axios.get(
        BASE_URL + "getTeacher/" + id
      );

      if (res.data) {
        setEmail(res.data.Email || "");
      }
    } catch (error) {
      console.log(error);
      setMessage("Failed to fetch teacher email");
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (email.trim() === "" || password.trim() === "") {
      setMessage("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must contain at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("id", id);
      formData.append("email", email);
      formData.append("password", password);

      const res = await axios.post(
        BASE_URL + "storeTeacherCredentials",
        formData
      );

      if (res.data.status === "success") {
        alert("Credentials Generated Successfully");

        navigate(
          "/dashboard/TeacherComponent/ViewTeachers"
        );
      } else {
        setMessage(
          res.data.message || "Failed to generate credentials"
        );
      }
    } catch (error) {
      console.log(error);
      setMessage("Failed to save credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-teacher-credentials-page">

      {/* HEADER */}
      <div className="create-teacher-credentials-header">

        <div className="create-teacher-credentials-header-left">

          <div className="create-teacher-credentials-header-icon">
            <i className="bi bi-person-lock"></i>
          </div>

          <div>
            <h2>Create Teacher Credentials</h2>
            <p>
              Generate login credentials for this teacher
            </p>
          </div>

        </div>

        <div className="create-teacher-credentials-id">
          <span>Teacher ID</span>
          <strong>#{id}</strong>
        </div>

      </div>


      {/* MESSAGE */}
      {message && (
        <div className="create-teacher-credentials-message">

          <i className="bi bi-exclamation-circle-fill"></i>

          <span>{message}</span>

          <button
            type="button"
            onClick={() => setMessage("")}
          >
            <i className="bi bi-x"></i>
          </button>

        </div>
      )}


      {/* CONTENT */}
      <div className="create-teacher-credentials-content">

        {/* FORM CARD */}
        <div className="create-teacher-credentials-card">

          <div className="create-teacher-credentials-card-header">

            <div className="create-teacher-credentials-card-icon">
              <i className="bi bi-person-badge-fill"></i>
            </div>

            <div>
              <h3>Teacher Account</h3>

              <p>
                Create login details for the teacher portal.
              </p>
            </div>

          </div>


          <form
            onSubmit={handleSubmit}
            className="create-teacher-credentials-form"
          >

            {/* EMAIL */}
            <div className="create-teacher-credentials-field">

              <label htmlFor="teacher-email">
                Email Address
                <span>*</span>
              </label>

              <div className="create-teacher-credentials-input">

                <i className="bi bi-envelope-fill"></i>

                <input
                  id="teacher-email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder={
                    fetching
                      ? "Fetching teacher email..."
                      : "Enter teacher email"
                  }
                  disabled={fetching}
                />

                {email && !fetching && (
                  <i className="bi bi-check-circle-fill create-teacher-credentials-success-icon"></i>
                )}

              </div>

              <small>
                Email is fetched automatically from the teacher profile.
              </small>

            </div>


            {/* PASSWORD */}
            <div className="create-teacher-credentials-field">

              <label htmlFor="teacher-password">
                Password
                <span>*</span>
              </label>

              <div className="create-teacher-credentials-input">

                <i className="bi bi-shield-lock-fill"></i>

                <input
                  id="teacher-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter password"
                />

                <button
                  type="button"
                  className="create-teacher-credentials-eye"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  <i
                    className={
                      showPassword
                        ? "bi bi-eye-slash-fill"
                        : "bi bi-eye-fill"
                    }
                  ></i>
                </button>

              </div>

              <small>
                Password must contain at least 6 characters.
              </small>

            </div>


            {/* SECURITY */}
            <div className="create-teacher-credentials-security">

              <div className="create-teacher-credentials-security-icon">
                <i className="bi bi-shield-check"></i>
              </div>

              <div>
                <strong>Secure Credentials</strong>

                <p>
                  These credentials will be used by the teacher
                  to access the teacher portal.
                </p>
              </div>

            </div>


            {/* ACTIONS */}
            <div className="create-teacher-credentials-actions">

              <button
                type="button"
                className="create-teacher-credentials-back"
                onClick={() =>
                  navigate(
                    "/dashboard/TeacherComponent/ViewTeachers"
                  )
                }
              >
                <i className="bi bi-arrow-left"></i>
                Back
              </button>


              <button
                type="submit"
                className="create-teacher-credentials-submit"
                disabled={loading || fetching}
              >

                {loading ? (
                  <>
                    <span className="create-teacher-credentials-spinner"></span>
                    Generating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-check-fill"></i>
                    Generate Credentials
                  </>
                )}

              </button>

            </div>

          </form>

        </div>


        {/* INFORMATION CARD */}
        <div className="create-teacher-credentials-info">

          <div className="create-teacher-credentials-info-icon">
            <i className="bi bi-info-circle-fill"></i>
          </div>

          <h3>Credential Information</h3>

          <p>
            Once generated, the teacher can use these
            credentials to sign in to the teacher portal.
          </p>


          <div className="create-teacher-credentials-info-item">
            <i className="bi bi-check2"></i>
            <span>
              Teacher email is fetched automatically.
            </span>
          </div>


          <div className="create-teacher-credentials-info-item">
            <i className="bi bi-check2"></i>
            <span>
              Password must be at least 6 characters.
            </span>
          </div>


          <div className="create-teacher-credentials-info-item">
            <i className="bi bi-check2"></i>
            <span>
              Credentials are stored for teacher login.
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};

export default CreateTeacherCredentials;

