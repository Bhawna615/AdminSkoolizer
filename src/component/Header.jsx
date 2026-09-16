import "./Header.css";
import skoolizerLogo from "../images/image.png";
import schoolLogo from "../images/school-logo.png";
import { useNavigate } from "react-router-dom";

const Header = ({
  toggleSidebar,
  isSidebarOpen
}) => {
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

      {/* LOGO */}
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


      <div className="header-content">

        {/* LEFT SIDE */}
        <div className="header-left-section">

          {/* MOBILE MENU TOGGLE */}
          <button
            className="menu-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
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


        {/* RIGHT SIDE */}
        <div className="header-right-section">

          <button className="header-icon-btn">
            <i className="las la-bell"></i>
            <span className="notification-dot"></span>
          </button>


          <div className="admin-profile">

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

            <div className="admin-info">
              <h4>
                {adminData?.username || "Admin"}
              </h4>

              <span>Administrator</span>
            </div>

            <i className="las la-angle-down profile-arrow"></i>

          </div>


          {/* <button
            className="logout-btn"
            onClick={handleLogout}
            title="Log Out"
          >
            <i className="las la-sign-out-alt"></i>
          </button> */}

        </div>

      </div>
    </header>
  );
};

export default Header;