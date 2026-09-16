import React, { useEffect, useState } from "react";
import Header from "../component/Header";
import Sidebar from "../component/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const location = useLocation();
  const isDashboardHome = location.pathname === "/dashboard";

  // MOBILE SIDEBAR STATE
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const [data, setData] = useState({
    students: 0,
    passedOut: 0,
    teachers: 0,
    classes: 0,
    employees: 0,
    activeRoutes: 0,
    absentStudents: 0,
    employeeAbsent: 0,
    examsToday: 0,
    birthdaysToday: 0,
    feePending: 0,
    leaveRequests: 0,
    sponseredStudents: 0,
  });

  useEffect(() => {
    fetch(
      "http://localhost/kkblossom/api.php/AdminApi/AdminCount/totalStudents"
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success") {
          setData((prev) => ({
            ...prev,
            students: result.totalStudents,
            passedOut: result.passedOutStudents,
            teachers: result.totalTeachers,
            classes: result.totalClasses,
            employees: result.totalEmployees,
            activeRoutes: result.totalActiveRoutes,
            absentStudents: result.totalAbsentStudents,
            employeeAbsent: result.totalEmployeeAbsent,
            examsToday: result.totalExamsToday,
            birthdaysToday: result.totalBirthdaysToday,
            feePending: result.totalFeePending,
            leaveRequests: result.totalLeaveRequests,
            sponseredStudents: result.totalSponseredStudents,
          }));
        }
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
      });
  }, []);

  // CLOSE SIDEBAR WHEN ROUTE CHANGES
  useEffect(() => {
    if (window.innerWidth <= 768) {
      closeSidebar();
    }
  }, [location.pathname]);

  const Card = ({ link, icon, title, count, color }) => (
    <a href={link} className="dashboard-card-link">
      <div className="dashboard-stat-card">
        <div className="stat-top">
          <div
            className="stat-icon"
            style={{
              background: color,
            }}
          >
            <i className={`las ${icon}`}></i>
          </div>

          <div className="stat-info">
            <p>{title}</p>
            <h3>{count}</h3>
          </div>
        </div>

        <span className="view-all">View all</span>
      </div>
    </a>
  );

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <Header
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        ></div>
      )}

      <div className="dashboard-layout">

        {/* SIDEBAR */}
        <aside
          className={`dashboard-sidebar ${
            isSidebarOpen ? "sidebar-open" : ""
          }`}
        >
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            closeSidebar={closeSidebar}
          />
        </aside>

        {/* MAIN CONTENT */}
        <main className="dashboard-main">

          {isDashboardHome && (
            <>
              {/* TOP HEADER */}
              <div className="dashboard-heading">
                <div>
                  <h2>Dashboard</h2>
                  <p>Welcome back, Admin</p>
                </div>

                <div className="dashboard-actions">
                  <select>
                    <option>06 May 2025</option>
                  </select>

                  <button>Export Report</button>
                </div>
              </div>

              {/* STATS CARDS */}
              <div className="stats-grid">

                <Card
                  link="/dashboard/StudentComponent/AdminViewStudent"
                  icon="la-user-graduate"
                  title="Students"
                  count={data.students}
                  color="#3478f6"
                />

                <Card
                  link="/dashboard/TeacherComponent/ViewTeachers"
                  icon="la-chalkboard-teacher"
                  title="Teachers"
                  count={data.teachers}
                  color="#27ae8a"
                />

                <Card
                  link="/dashboard/ScheduleComponent/ScheduleClass"
                  icon="la-school"
                  title="Classes"
                  count={data.classes}
                  color="#7b61d9"
                />

                <Card
                  link="/dashboard/EmployeeComponent/ViewEmployee"
                  icon="la-user-tie"
                  title="Employees"
                  count={data.employees}
                  color="#f58a42"
                />

                <Card
                  link="/dashboard/StudentComponent/PassedOutStudent"
                  icon="la-user-check"
                  title="Passed Out Students"
                  count={data.passedOut}
                  color="#ef476f"
                />

                <Card
                  link="/dashboard/StudentComponent/SponseredStudents"
                  icon="la-hand-holding-usd"
                  title="Sponsored Students"
                  count={data.sponseredStudents}
                  color="#f59e0b"
                />

                <Card
                  link="/dashboard/TransportComponent/ActiveRoutes"
                  icon="la-bus"
                  title="Routes Active"
                  count={data.activeRoutes}
                  color="#3b82f6"
                />

                <Card
                  link="/dashboard/ExamComponent/SelectClass"
                  icon="la-clipboard-check"
                  title="Exams Today"
                  count={data.examsToday}
                  color="#6d5dfc"
                />

              </div>

              {/* BOTTOM SECTION */}
              <div className="dashboard-bottom-grid">

                {/* ATTENDANCE */}
                <div className="dashboard-panel attendance-panel">
                  <h3>Attendance Overview</h3>

                  <div className="attendance-content">
                    <div className="donut-chart">
                      <div className="donut-center">
                        <strong>85%</strong>
                        <span>Attendance</span>
                      </div>
                    </div>

                    <div className="attendance-legend">
                      <div>
                        <span className="legend-dot present"></span>
                        <span>Present</span>
                        <b>85%</b>
                      </div>

                      <div>
                        <span className="legend-dot absent"></span>
                        <span>Absent</span>
                        <b>10%</b>
                      </div>

                      <div>
                        <span className="legend-dot leave"></span>
                        <span>Leave</span>
                        <b>5%</b>
                      </div>
                    </div>
                  </div>
                </div>

                {/* STUDENTS OVERVIEW */}
                <div className="dashboard-panel students-overview">
                  <h3>Students Overview</h3>

                  <div className="chart-area">
                    <div className="y-axis">
                      <span>600</span>
                      <span>500</span>
                      <span>400</span>
                      <span>300</span>
                      <span>200</span>
                      <span>100</span>
                    </div>

                    <div className="line-chart">
                      <svg
                        viewBox="0 0 500 250"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <linearGradient
                            id="chartGradient"
                            x1="0"
                            x2="0"
                            y1="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#7c4dff"
                              stopOpacity="0.45"
                            />

                            <stop
                              offset="100%"
                              stopColor="#7c4dff"
                              stopOpacity="0"
                            />
                          </linearGradient>
                        </defs>

                        <path
                          d="
                            M0,210
                            C40,180 50,120 90,140
                            C130,165 140,80 190,90
                            C230,100 240,180 290,150
                            C330,120 340,50 390,80
                            C430,110 450,60 500,30
                            L500,250
                            L0,250 Z
                          "
                          fill="url(#chartGradient)"
                        />

                        <path
                          d="
                            M0,210
                            C40,180 50,120 90,140
                            C130,165 140,80 190,90
                            C230,100 240,180 290,150
                            C330,120 340,50 390,80
                            C430,110 450,60 500,30
                          "
                          fill="none"
                          stroke="#9a6cff"
                          strokeWidth="4"
                        />
                      </svg>

                      <div className="months">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* NOTICE BOARD */}
                <div className="dashboard-panel notice-board">
                  <div className="notice-header">
                    <h3>Notice Board</h3>
                    <span>•••</span>
                  </div>

                  <div className="notice-item">
                    <div className="notice-icon blue">
                      <i className="las la-book"></i>
                    </div>

                    <div>
                      <h4>Annual Sports Day</h4>
                      <p>12 May 2025</p>
                    </div>
                  </div>

                  <div className="notice-item">
                    <div className="notice-icon green">
                      <i className="las la-users"></i>
                    </div>

                    <div>
                      <h4>PTM Meeting</h4>
                      <p>15 May 2025</p>
                    </div>
                  </div>

                  <div className="notice-item">
                    <div className="notice-icon orange">
                      <i className="las la-sun"></i>
                    </div>

                    <div>
                      <h4>Summer Vacation</h4>
                      <p>01 June 2025</p>
                    </div>
                  </div>

                  <a
                    href="/dashboard/NoticeComponent"
                    className="view-notices"
                  >
                    View all notices
                  </a>
                </div>

              </div>
            </>
          )}

          {!isDashboardHome && <Outlet />}

        </main>
      </div>
    </div>
  );
};

export default Dashboard;