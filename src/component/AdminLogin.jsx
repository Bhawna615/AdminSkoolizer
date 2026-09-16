import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";
import logo from "../images/image.png";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password.trim()) {
      setMessage("Username and password required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost/kkblossom/api.php/Adminapi/AdminAuth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username.trim(),
            password: formData.password.trim(),
          }),
        }
      );

      const text = await response.text();

      // Avoid JSON parsing errors
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON returned from server: " + text);
      }

      console.log("📡 API Response:", data);

      if (data.status === "success") {
        localStorage.setItem("admin", JSON.stringify(data.data));
        navigate("/dashboard");
      } else {
        setMessage(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="login-wrapper">

    {/* ================= LEFT SIDE ================= */}
    


    <div className="login-left ">

      <img
        src={logo}
        alt="Logo"
        className="admin-logo"
        onClick={() => navigate("/")}
      />

      <div className="welcome-section">
        <h2>Welcome Back!</h2>

        <p>
          Login to access your school
          <br />
          management dashboard.
        </p>
      </div>

      <div className="feature-list">

        <div className="feature-item">
          <div className="feature-icon">
            <span className="admin-Icon"><i className="bi bi-shield-fill-check"></i></span>
          </div>

          <div className="feature-text">
            <h4>Secure &amp; Private</h4>
            <p>Your data is safe with us</p>
          </div>
        </div>


        <div className="feature-item">
          <div className="feature-icon">
            <span><i className="bi bi-graph-up"></i></span>
          </div>

          <div className="feature-text">
            <h4>Real Time Analytics</h4>
            <p>Get insights in real time</p>
          </div>
        </div>


        <div className="feature-item">
          <div className="feature-icon">
            <span><i className="bi bi-people-fill"></i></span>
          </div>

          <div className="feature-text">
            <h4>Manage Everything</h4>
            <p>All in one dashboard</p>
          </div>
        </div>

      </div>

    </div>


    {/* ================= LOGIN CARD ================= */}

    <div className="login-card">

      <div className="login-user-icon">
        <span><i class="bi bi-person-fill"></i></span>
      </div>

      <p className="login-title">
        Admin Login
      </p>

      <p className="login-subtitle">
        Please sign in to your account
      </p>


      <form onSubmit={handleSubmit} className="login-Form">

        {/* USERNAME */}

        <div className="input-wrapper">

          <span className="input-icon">
            <i className="bi bi-envelope-fill"></i>
          </span>

          <input
            type="text"
            name="username"
            placeholder="admin@kkblossoms.com"
            value={formData.username}
            onChange={handleChange}
          />

        </div>


        {/* PASSWORD */}

     <div className="input-wrapper">

  <span className="input-icon lock-icon">
    <i className="bi bi-lock-fill"></i>
  </span>

  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="••••••••"
    value={formData.password}
    onChange={handleChange}
  />

  <button
  type="button"
  className="password-eye"
  onClick={() => setShowPassword((prev) => !prev)}
  aria-label={showPassword ? "Hide password" : "Show password"}
>
  <i
    className={`bi ${
      showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
    } eye-icon`}
  ></i>
</button>

</div>


        {/* REMEMBER / FORGOT */}

        <div className="login-options">

          <label className="remember-me">

            <input
              type="checkbox"
              className="remember-checkbox"
            />

            <span>
              Remember me
            </span>

          </label>


          <span
            className="forgot-password"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </span>

        </div>


        {/* ERROR */}

        {message && (
          <div className="invalid-bar">
            {message}
          </div>
        )}


        {/* LOGIN BUTTON */}

        <button
          type="submit"
          disabled={loading}
          className="LogIn-btn"
        >
          {loading ? "Signing In..." : "Log In"}
        </button>

      </form>


      {/* TERMS */}

      <div className="login-terms">

        <p>
          By signing in you agree to our
        </p>

        <span
          onClick={() => navigate("/terms")}
        >
          Terms and Conditions
        </span>

      </div>

    </div>


    {/* FOOTER */}

    <p className="footer">
      © MacMer Web Solutions {new Date().getFullYear()}
    </p>

  </div>
);
};
export default AdminLogin;
