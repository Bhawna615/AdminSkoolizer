import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ isSidebarOpen, closeSidebar }) => {
  /* =========================================
     DROPDOWN OPEN/CLOSE STATE
  ========================================= */
  const [openMenu, setOpenMenu] = useState("");

  /* =========================================
     ACTIVE CLICKED ITEM
     
     Only ONE item can be active at a time.
     
     Examples:
     "Dashboard"
     "Students"
     "New Admission"
     "View Students"
     "Teachers"
     ========================================= */
  const [activeItem, setActiveItem] = useState("");

  const navigate = useNavigate();

  /* =========================================
     MENU ITEMS
  ========================================= */

  const menuItems = [
    {
      label: "Dashboard",
      icon: "las la-home",
      onClick: () => navigate("/dashboard"),
    },

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
        {
          label: "Character Certificates",
          icon: "las la-basketball-ball",
        },
        {
          label: "Leave Requests",
          icon: "las la-basketball-ball",
        },
      ],
    },

    {
      icon: "la-chalkboard-teacher",
      label: "Teachers",
      subMenu: [
        { label: "Add Teacher", icon: "las la-plus-square" },
        { label: "View Teachers", icon: "la-eye" },
        { label: "Former Teachers", icon: "las la-sign-out-alt" },
        {
          label: "Experience Certificates",
          icon: "las la-sign-out-alt",
        },
      ],
    },

    {
      icon: "la-list-alt",
      label: "Attendance",
      subMenu: [
        {
          label: "Mark Attendance",
          icon: "las la-check-square",
        },
        {
          label: "View Attendance",
          icon: "la-eye",
        },
        {
          label: "Attendance Sheet",
          icon: "las la-file-alt",
        },
      ],
    },

    {
      icon: "la-calendar",
      label: "Schedule",
      subMenu: [
        {
          label: "View Timetable",
          icon: "las la-eye",
        },
        {
          label: "New Time Period",
          icon: "las la-plus-square",
        },
        {
          label: "Classes",
          icon: "las la-users",
        },
        {
          label: "Events",
          icon: "las la-calendar-check",
        },
      ],
    },

    {
      icon: "la-bus",
      label: "Transport",
      subMenu: [
        {
          label: "Active Routes",
          icon: "las la-spinner",
        },
        {
          label: "Routes",
          icon: "las la-route",
        },
        {
          label: "Busses",
          icon: "las la-bus-alt",
        },
        {
          label: "Transport Staff",
          icon: "las la-user-tie",
        },
        {
          label: "Station",
          icon: "las la-user-tie",
        },
      ],
    },

    {
      icon: "la-tachometer-alt",
      label: "Exams",
      subMenu: [
        {
          label: "New Exam",
          icon: "las la-plus-square",
        },
        {
          label: "All Exams",
          icon: "las la-eye",
        },
        {
          label: "Metrics",
          icon: "las la-hospital-symbol",
        },
        {
          label: "Quizzes",
          icon: "las la-list-ol",
        },
        {
          label: "Question Papers",
          icon: "las la-paperclip",
        },
        {
          label: "Classwise Exam Report",
          icon: "las la-paperclip",
        },
        {
          label: "Classwise Metrics",
          icon: "las la-paperclip",
        },
        {
          label: "Custom Report Card",
          icon: "las la-paperclip",
        },
      ],
    },

    {
      icon: "la-edit",
      label: "Homework",
      subMenu: [
        {
          label: "Assign Homework",
          icon: "las la-list-ul",
        },
        {
          label: "View Homework",
          icon: "la-eye",
        },
        {
          label: "Assignment Generator",
          icon: "las la-cog",
        },
      ],
    },

    {
      icon: "la-user-tie",
      label: "Employee",
      subMenu: [
        {
          label: "View Employee",
          icon: "la-eye",
        },
        {
          label: "Employee Attendance",
          icon: "las la-list-alt",
        },
        {
          label: "View Employee Attendance",
          icon: "las la-users",
        },
        {
          label: "Employee Attendance Sheet",
          icon: "las la-file-alt",
        },
      ],
    },

    {
      icon: "la-rupee-sign",
      label: "Fee",
      subMenu: [
        {
          label: "Fee Structure",
          icon: "las la-project-diagram",
        },
        {
          label: "Discounts",
          icon: "las la-project-diagram",
        },
        {
          label: "Create Payments",
          icon: "las la-plus-square",
        },
        {
          label: "View Payments",
          icon: "las la-file-invoice-dollar",
        },
        {
          label: "Pending Payments",
          icon: "las la-exclamation-circle",
        },
        {
          label: "Statistics",
          icon: "las la-chart-pie",
        },
      ],
    },

    {
      icon: "la-walking",
      label: "Visitor Management",
      subMenu: [
        {
          label: "Log Book",
          icon: "las la-book",
        },
      ],
    },

    {
      icon: "la-sms",
      label: "Messaging",
      subMenu: [
        {
          label: "In-App Messaging",
          icon: "las la-mobile",
        },
      ],
    },

    {
      icon: "la-rss",
      label: "Posts",
      onClick: () =>
        navigate("/dashboard/PostComponent/PostView"),
    },

    {
      icon: "la-info-circle",
      label: "More",
      subMenu: [
        {
          label: "Terms & Conditions",
          icon: "las la-file-alt",
        },
        {
          label: "Privacy Policy",
          icon: "las la-user-secret",
        },
        {
          label: "Documentation",
          icon: "las la-book",
        },
      ],
    },

    {
      label: "Log Out",
      icon: "las la-sign-out-alt",
      onClick: () => navigate("/"),
    },
  ];

  /* =========================================
     TOGGLE DROPDOWN

     IMPORTANT:
     Opening dropdown and active state
     are now separate.
  ========================================= */

  const toggleMenu = (label) => {
    setOpenMenu((prev) =>
      prev === label ? "" : label
    );

    /*
      Clicking a main tab makes THAT tab active.
      
      Example:
      Click Students
      -> Students becomes purple
      -> Students dropdown opens
    */
    setActiveItem(label);
  };

  /* =========================================
     SUBMENU CLICK
     
     Submenu becomes the ONLY active item.
     
     Parent does NOT remain active.
  ========================================= */

  const handleSubMenuClick = (subLabel) => {
    /* Make clicked submenu active */
    setActiveItem(subLabel);

    switch (subLabel) {
      /* =====================================
         STUDENTS
      ===================================== */

      case "New Admission":
        navigate(
          "/dashboard/StudentComponent/StudentAdmission"
        );
        break;

      case "View Students":
        navigate(
          "/dashboard/StudentComponent/AdminViewStudent"
        );
        break;

      case "List of Students":
        navigate(
          "/dashboard/StudentComponent/AdminListStudent"
        );
        break;

      case "Promote Students":
        navigate(
          "/dashboard/StudentComponent/StudentPromote"
        );
        break;

      case "Metrics":
        navigate(
          "/dashboard/StudentComponent/StudentMetrics"
        );
        break;

      case "Sports":
        navigate(
          "/dashboard/StudentComponent/StudentSports"
        );
        break;

      case "SLCs":
        navigate(
          "/dashboard/StudentComponent/ViewTransferredStudents"
        );
        break;

      case "Character Certificates":
        navigate(
          "/dashboard/StudentComponent/DisplayCharacterCertificates"
        );
        break;

      case "Leave Requests":
        navigate(
          "/dashboard/StudentComponent/StudentLeaveRequest"
        );
        break;

      /* =====================================
         TEACHERS
      ===================================== */

      case "Add Teacher":
        navigate(
          "/dashboard/TeacherComponent/AddTeachers"
        );
        break;

      case "View Teachers":
        navigate(
          "/dashboard/TeacherComponent/ViewTeachers"
        );
        break;

      case "Former Teachers":
        navigate(
          "/dashboard/TeacherComponent/FormerTeachers"
        );
        break;

      case "Experience Certificates":
        navigate(
          "/dashboard/TeacherComponent/ExperienceCertificate"
        );
        break;

      /* =====================================
         ATTENDANCE
      ===================================== */

      case "Mark Attendance":
        navigate(
          "/dashboard/AttendanceComponent/MarkAttendance"
        );
        break;

      case "View Attendance":
        navigate(
          "/dashboard/AttendanceComponent/ViewAttendance"
        );
        break;

      case "Attendance Sheet":
        navigate(
          "/dashboard/AttendanceComponent/AttendanceByMonth"
        );
        break;

      /* =====================================
         SCHEDULE
      ===================================== */

      case "View Timetable":
        navigate(
          "/dashboard/ScheduleComponent/ViewTimetable"
        );
        break;

      case "New Time Period":
        navigate(
          "/dashboard/ScheduleComponent/NewPeriod"
        );
        break;

      case "Classes":
        navigate(
          "/dashboard/ScheduleComponent/ScheduleClass"
        );
        break;

      case "Events":
        navigate(
          "/dashboard/ScheduleComponent/EventList"
        );
        break;

      /* =====================================
         TRANSPORT
      ===================================== */

      case "Active Routes":
        navigate(
          "/dashboard/TransportComponent/ActiveRoutes"
        );
        break;

      case "Routes":
        navigate(
          "/dashboard/TransportComponent/RoutesPages"
        );
        break;

      case "Busses":
        navigate(
          "/dashboard/TransportComponent/BussesPage"
        );
        break;

      case "Transport Staff":
        navigate(
          "/dashboard/TransportComponent/transport-staff"
        );
        break;

      case "Station":
        navigate(
          "/dashboard/TransportComponent/stations"
        );
        break;

      /* =====================================
         EXAMS
      ===================================== */

      case "New Exam":
        navigate(
          "/dashboard/ExamComponent/NewExam"
        );
        break;

      case "All Exams":
        navigate(
          "/dashboard/ExamComponent/SelectClass"
        );
        break;

      case "Quizzes":
        navigate(
          "/dashboard/ExamComponent/Quiz/view"
        );
        break;

      case "Question Papers":
        navigate(
          "/dashboard/ExamComponent/QuestionPapers"
        );
        break;

      case "Classwise Exam Report":
        navigate(
          "/dashboard/ExamComponent/ClassWiseReportSelect"
        );
        break;

      case "Classwise Metrics":
        navigate(
          "/dashboard/ExamComponent/ClassWiseMetrics/SelectClass"
        );
        break;

      case "Custom Report Card":
        navigate(
          "/ExamComponent/CustomReportCard",
          {
            state: { studentId: 10 },
          }
        );
        break;

      /* =====================================
         HOMEWORK
      ===================================== */

      case "Assign Homework":
        navigate(
          "/dashboard/HomeworkComponent/AssignHomework"
        );
        break;

      case "View Homework":
        navigate(
          "/dashboard/HomeworkComponent/HomeworkView"
        );
        break;

      case "Assignment Generator":
        navigate(
          "/dashboard/HomeworkComponent/AssignmentGenerator"
        );
        break;

      /* =====================================
         EMPLOYEE
      ===================================== */

      case "View Employee":
        navigate(
          "/dashboard/EmployeeComponent/ViewEmployee"
        );
        break;

      case "Employee Attendance":
        navigate(
          "/dashboard/EmployeeComponent/EmployeeAttendance"
        );
        break;

      case "View Employee Attendance":
        navigate(
          "/dashboard/EmployeeComponent/ViewEmployeeAttendance"
        );
        break;

      case "Employee Attendance Sheet":
        navigate(
          "/dashboard/EmployeeComponent/EmployeeAttendanceByMonth"
        );
        break;

      /* =====================================
         FEE
      ===================================== */

      case "Fee Structure":
        navigate(
          "/dashboard/FeeComponent/FeeStructure"
        );
        break;

      case "Discounts":
        navigate(
          "/dashboard/FeeComponent/Discounts"
        );
        break;

      case "Create Payments":
        navigate(
          "/dashboard/FeeComponent/CreatePayment"
        );
        break;

      case "View Payments":
        navigate(
          "/dashboard/FeeComponent/SessionSelect"
        );
        break;

      case "Pending Payments":
        navigate(
          "/dashboard/FeeComponent/SelectPendingPaymentsPeriod"
        );
        break;

      case "Statistics":
        navigate(
          "/dashboard/FeeComponent/FeeStatistics"
        );
        break;

      /* =====================================
         VISITOR MANAGEMENT
      ===================================== */

      case "Log Book":
        navigate(
          "/dashboard/VisitorsComponent/VisitorView"
        );
        break;

      /* =====================================
         MESSAGING
      ===================================== */

      case "In-App Messaging":
        navigate(
          "/dashboard/MessageComponent/MessageView"
        );
        break;

      /* =====================================
         MORE
      ===================================== */

      case "Terms & Conditions":
        navigate("/terms");
        break;

      case "Privacy Policy":
        navigate(
          "/dashboard/MoreComponent/PrivacyPolicy"
        );
        break;

      case "Documentation":
        navigate(
          "/dashboard/MoreComponent/Messaging"
        );
        break;

      default:
        break;
    }

    /* =========================================
       CLOSE SIDEBAR ON MOBILE
    ========================================= */

    if (
      window.innerWidth <= 768 &&
      closeSidebar
    ) {
      closeSidebar();
    }
  };

  /* =========================================
     MAIN MENU CLICK
  ========================================= */

  const handleMenuClick = (item) => {
    /*
      If item has submenu:
      - open/close dropdown
      - make parent active ONLY because
        user actually clicked the parent
    */

    if (item.subMenu) {
      toggleMenu(item.label);
    }

    /*
      Normal links such as Posts
      */
    else if (item.onClick) {
      /*
        Make clicked link active
        BEFORE navigation.
      */
      setActiveItem(item.label);

      item.onClick();

      if (
        window.innerWidth <= 768 &&
        closeSidebar
      ) {
        closeSidebar();
      }
    }
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <nav
      className={`sidebar ${
        isSidebarOpen ? "mobile-open" : ""
      }`}
      aria-label="Main Sidebar Navigation"
    >

      {menuItems.map((item, idx) => (
        <div
          key={idx}
          className="menu-section"
        >

          {/* =================================
              MAIN MENU ITEM
          ================================= */}

          <div
            className={`menu-item ${
              activeItem === item.label
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleMenuClick(item)
            }
            role="button"
            tabIndex={0}
          >

            <i
              className={`las ${item.icon}`}
            ></i>

            <span>
              {item.label}
            </span>

            {/* Dropdown arrow */}

            {item.subMenu && (
              <i
                className={`las la-angle-down menu-arrow ${
                  openMenu === item.label
                    ? "rotate"
                    : ""
                }`}
              ></i>
            )}

          </div>


          {/* =================================
              SUBMENU
          ================================= */}

          {item.subMenu &&
            openMenu === item.label && (
              <div className="submenu">

                {item.subMenu.map(
                  (subItem, subIdx) => (
                    <div
                      key={subIdx}
                      className={`submenu-item ${
                        activeItem ===
                        subItem.label
                          ? "active"
                          : ""
                      }`}
                      onClick={(e) => {
                        /*
                          Prevent parent menu
                          click from firing.
                        */
                        e.stopPropagation();

                        handleSubMenuClick(
                          subItem.label
                        );
                      }}
                      role="button"
                      tabIndex={0}
                    >

                      <i
                        className={`las ${subItem.icon}`}
                      ></i>

                      <span>
                        {subItem.label}
                      </span>

                    </div>
                  )
                )}

              </div>
            )}

        </div>
      ))}

    </nav>
  );
};

export default Sidebar;