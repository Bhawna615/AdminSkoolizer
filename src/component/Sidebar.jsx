import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState("");
  const [activeSubMenu, setActiveSubMenu] = useState("");
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: "la-graduation-cap",
      label: "Students",
      subMenu: [
        { label: "New Admission", icon: "las la-plus-square" },
        { label: "View Students", icon: "la-eye" },
        { label: "List of Students", icon: "las la-list-ol" },
        { label: "Promote Students", icon: "las la-redo" },
        { label: "Metrics", icon: "las la-hospital-symbol" },
        { label: "Sports", icon: "las la-basketball-ball" },
        { label: "SLCs", icon: "las la-basketball-ball" },
        { label: "Character Certificates", icon: "las la-basketball-ball" },
        { label: "Leave Requests", icon: "las la-basketball-ball" },
      ]
    },
    {
      icon: "la-chalkboard-teacher",
      label: "Teachers",
      subMenu: [
        { label: "Add Teacher", icon: "las la-plus-square" },
        { label: "View Teachers", icon: "la-eye" },
        { label: "Former Teachers", icon: "las la-sign-out-alt" },
        { label: "Experience Certificates", icon: "las la-sign-out-alt" },
      ]
    },
    {
      icon: "la-list-alt",
      label: "Attendance",
      subMenu: [
        { label: "Mark Attendance", icon: "las la-check-square" },
        { label: "View Attendance", icon: "la-eye" },
        { label: "Attendance Sheet", icon: "las la-file-alt" },
      ]
    },
    {
      icon: "la-calendar",
      label: "Schedule",
      subMenu: [
        { label: "View Timetable", icon: "las la-eye" },
        { label: "New Time Period", icon: "las la-plus-square" },
        { label: "Classes", icon: "las la-users" },
        { label: "Events", icon: "las la-calendar-check" },
      ]
    },
    {
      icon: "la-bus",
      label: "Transport",
      subMenu: [
        { label: "Active Routes", icon: "las la-spinner" },
        { label: "Routes", icon: "las la-route" },
        { label: "Busses", icon: "las la-bus-alt" },
        { label: "Transport Staff", icon: "las la-user-tie" },
        { label: "Station", icon: "las la-user-tie" },
      ]
    },
    {
      icon: "la-tachometer-alt",
      label: "Exams",
      subMenu: [
        { label: "New Exam", icon: "las la-plus-square" },
        { label: "All Exams", icon: "las la-eye" },
        { label: "Metrics", icon: "las la-hospital-symbol" },
        { label: "Quizzes", icon: "las la-list-ol" },
        { label: "Question Papers", icon: "las la-paperclip" },
        { label: "Classwise Exam Report", icon: "las la-paperclip" },
        { label: "Classwise Metrics", icon: "las la-paperclip" },
        { label: "Custom Report Card", icon: "las la-paperclip" },
      ]
    },
    {
      icon: "la-edit",
      label: "Homework",
      subMenu: [
        { label: "Assign Homework", icon: "las la-list-ul" },
        { label: "View Homework", icon: "la-eye" },
        { label: "Assignment Generator", icon: "las la-cog" },
      ]
    },
    {
      icon: "la-user-tie",
      label: "Employee",
      subMenu: [
        { label: "View Employee", icon: "la-eye" },
        { label: "Employee Attendance", icon: "las la-list-alt" },
        { label: "View Attendance", icon: "las la-users" },
        { label: "Attendance Sheet", icon: "las la-file-alt" },
      ]
    },
    {
      icon: "la-rupee-sign",
      label: "Fee",
      subMenu: [
        { label: "Fee Structure", icon: "las la-project-diagram" },
        { label: "Discounts", icon: "las la-project-diagram" },
        { label: "Create Payments", icon: "las la-plus-square" },
        { label: "View Payments", icon: "las la-file-invoice-dollar" },
        { label: "Pending Payments", icon: "las la-exclamation-circle" },
        { label: "Statistics", icon: "las la-chart-pie" },
      ]
    },
    {
      icon: "la-walking",
      label: "Visitor Management",
      subMenu: [{ label: "Log Book", icon: "las la-book" }]
    },
    {
      icon: "la-sms",
      label: "Messaging",
      subMenu: [
        { label: "In-App Messaging", icon: "las la-mobile" },
        { label: "Inbox Messaging/SMS", icon: "las la-envelope" },
        { label: "View Sent Sms", icon: "las la-paper-plane" },
      ]
    },
    { icon: "la-rss", label: "Posts" },
    {
      icon: "la-info-circle",
      label: "More",
      subMenu: [
        { label: "Terms & Conditions", icon: "las la-file-alt" },
        { label: "Privacy Policy", icon: "las la-user-secret" },
        { label: "Documentation", icon: "las la-book" },
      ]
    },
  ];

  const toggleMenu = (label) => {
    setActiveMenu(activeMenu === label ? "" : label);
  };

  const handleSubMenuClick = (subLabel) => {
    setActiveSubMenu(subLabel);

    switch (subLabel) {
      case "New Admission":
        navigate("/dashboard/StudentComponent/StudentAdmission");
        break;

      case "View Students":
        navigate("/dashboard/StudentComponent/AdminViewStudent");
        break;

      case "List of Students":
        navigate("/dashboard/StudentComponent/AdminListStudent");
        break;

      case "Promote Students":
        navigate("/dashboard/StudentComponent/StudentPromote");
        break;

      case "Metrics":
        navigate("/dashboard/StudentComponent/StudentMetrics");
        break;

      case "Sports":
        navigate("/dashboard/StudentComponent/StudentSports");
        break;

      case "SLCs":
        navigate("/dashboard/StudentComponent/ViewTransferredStudents");
        break;

      case "Character Certificates":
        navigate("/dashboard/StudentComponent/DisplayCharacterCertificates");
        break;

      case "Leave Requests":
        navigate("/dashboard/StudentComponent/DisplayLeaveRequests");
        break;

      case "Add Teacher":
        navigate("/dashboard/TeacherComponent/AddTeachers");
        break;

      case "View Teachers":
        navigate("/dashboard/TeacherComponent/ViewTeachers");
        break;

      case "Former Teachers":
        navigate("/dashboard/TeacherComponent/FormerTeachers");
        break;

      case "Experience Certificates":
        navigate("/dashboard/TeacherComponent/ExperienceCertificate");
        break;

      case "Mark Attendance":
        navigate("/dashboard/AttendanceComponent/MarkAttendance");
        break;

      case "View Attendance":
        navigate("/dashboard/AttendanceComponent/ViewAttendance");
        break;

      case "Attendance Sheet":
        navigate("/dashboard/AttendanceComponent/RollCall");
        break;

      default:
        break;
    }
  };

  return (
    <nav className="sidebar" aria-label="Main Sidebar Navigation">
      {menuItems.map((item, idx) => (
        <div key={idx} className="menu-section">
          <div
            className={`menu-item ${activeMenu === item.label ? "active" : ""}`}
            onClick={() =>
              item.subMenu ? toggleMenu(item.label) : setActiveSubMenu(item.label)
            }
            role="button"
          >
            <i className={`las ${item.icon}`}></i>
            <span>{item.label}</span>
          </div>

          {item.subMenu && activeMenu === item.label && (
            <div className="submenu">
              {item.subMenu.map((subItem, subIdx) => (
                <div
                  key={subIdx}
                  className={`submenu-item ${
                    activeSubMenu === subItem.label ? "active-sub" : ""
                  }`}
                  onClick={() => handleSubMenuClick(subItem.label)}
                >
                  <i className={`las ${subItem.icon}`}></i>
                  <span>{subItem.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Sidebar;