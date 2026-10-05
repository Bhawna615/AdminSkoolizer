import "./Header.css";
import skoolizerLogo from "../images/image.png";
import schoolLogo from "../images/school-logo.png";
import { useNavigate } from "react-router-dom";

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();

  const adminData = JSON.parse(
    localStorage.getItem("admin")
  );

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "http://localhost/kkblossom/api.php/Adminapi/AdminAuth/signOut",
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        localStorage.removeItem("admin");
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="skoolizer-header">

      {/* =====================================================
          LOGO
      ====================================================== */}
      <div
        className="header-brand"
        onClick={() => navigate("/dashboard")}
      >
        <img
          src={skoolizerLogo}
          alt="Skoolizer"
          className="skoolizer-logo"
        />
      </div>


      {/* =====================================================
          HEADER CONTENT
      ====================================================== */}
      <div className="header-content">

        {/* ===================================================
            LEFT SECTION
        ==================================================== */}
        <div className="header-left-section">

          {/* SIDEBAR TOGGLE */}
          <button
            type="button"
            className="menu-toggle"
            onClick={toggleSidebar}
            aria-label={
              isSidebarOpen
                ? "Close Sidebar"
                : "Open Sidebar"
            }
            title={
              isSidebarOpen
                ? "Close Sidebar"
                : "Open Sidebar"
            }
          >
            <i
              className={`las ${
                isSidebarOpen
                  ? "la-times"
                  : "la-bars"
              }`}
            ></i>
          </button>


          {/* SEARCH */}
          <div className="header-search">

            <i className="las la-search"></i>

            <input
              type="text"
              placeholder="Search anything..."
            />

          </div>

        </div>


        {/* ===================================================
            RIGHT SECTION
        ==================================================== */}
        <div className="header-right-section">

          {/* NOTIFICATION */}
          <button
            type="button"
            className="header-icon-btn"
            aria-label="Notifications"
          >
            <i className="las la-bell"></i>

            <span className="notification-dot"></span>
          </button>


          {/* ADMIN PROFILE */}
          <div className="admin-profile">

            {/* AVATAR */}
            <div className="admin-avatar">

              {schoolLogo ? (
                <img
                  src={schoolLogo}
                  alt="Admin"
                />
              ) : (
                <i className="las la-user"></i>
              )}

            </div>


            {/* ADMIN INFORMATION */}
            <div className="admin-info">

              <h4>
                {adminData?.username || "Admin"}
              </h4>

              <span>
                Administrator
              </span>

            </div>


            {/* ARROW */}
            <i className="las la-angle-down profile-arrow"></i>

          </div>


          {/* =================================================
              LOGOUT BUTTON
              Currently disabled/commented
          ================================================== */}

          {/*
          <button
            type="button"
            className="logout-btn"
            onClick={handleLogout}
            title="Log Out"
          >
            <i className="las la-sign-out-alt"></i>
          </button>
          */}

        </div>

      </div>

    </header>
  );
};

export default Header;