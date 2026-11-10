
import React, { useEffect, useState } from "react";
import Header from "../component/Header";
import Sidebar from "../component/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const location = useLocation();
  const isDashboardHome = location.pathname === "/dashboard";

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

  // =====================================================
  // ATTENDANCE DATA
  // =====================================================

  const [attendanceData, setAttendanceData] = useState({
    present: 0,
    absent: 0,
    leave: 0,
    strength: 0,
    presentPercentage: 0,
    absentPercentage: 0,
    leavePercentage: 0,
  });

  const [monthlyAttendance, setMonthlyAttendance] = useState([]);

  // =====================================================
  // MONTHLY FEE COLLECTION DATA
  // =====================================================

  const [monthlyFeeCollection, setMonthlyFeeCollection] = useState([]);

  // =====================================================
  // EVENTS DATA
  // =====================================================

  const [upcomingEvents, setUpcomingEvents] = useState([]);

  // =====================================================
  // LOAD DASHBOARD COUNTS
  // =====================================================

  useEffect(() => {
    fetch(
      "http://localhost/kkblossom/api.php/Adminapi/AdminCount/totalStudents"
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

  // =====================================================
  // LOAD ATTENDANCE DATA
  // =====================================================

  useEffect(() => {
    fetch(
      "http://localhost/kkblossom/api.php/Adminapi/AdminStudentAttendance/attendanceOverview"
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("ATTENDANCE DASHBOARD:", result);

        if (result.status === "success") {
          setAttendanceData({
            present: Number(result.present || 0),
            absent: Number(result.absent || 0),
            leave: Number(result.leave || 0),
            strength: Number(result.strength || 0),

            presentPercentage: Number(
              result.presentPercentage || 0
            ),

            absentPercentage: Number(
              result.absentPercentage || 0
            ),

            leavePercentage: Number(
              result.leavePercentage || 0
            ),
          });

          setMonthlyAttendance(
            Array.isArray(result.monthlyAttendance)
              ? result.monthlyAttendance
              : []
          );
        }
      })
      .catch((error) => {
        console.error(
          "Error fetching attendance dashboard data:",
          error
        );
      });
  }, []);

  // =====================================================
  // LOAD MONTHLY FEE COLLECTION
  // =====================================================

  useEffect(() => {
    fetch(
      "http://localhost/kkblossom/api.php/Adminapi/AdminStudent/monthlyFeeCollection"
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("MONTHLY FEE COLLECTION:", result);

        if (result.status === "success") {
          setMonthlyFeeCollection(
            Array.isArray(result.monthlyFeeCollection)
              ? result.monthlyFeeCollection
              : []
          );
        }
      })
      .catch((error) => {
        console.error(
          "Error fetching monthly fee collection:",
          error
        );
      });
  }, []);

  // =====================================================
  // LOAD UPCOMING EVENTS
  // =====================================================

  useEffect(() => {
    fetch(
      "http://localhost/kkblossom/api.php/Adminapi/AdminStudentAttendance/Events"
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("EVENTS DASHBOARD:", result);

        let events = [];

        // HANDLE API RESPONSE

        if (Array.isArray(result)) {
          events = result;
        } else if (Array.isArray(result.events)) {
          events = result.events;
        } else if (
          result.status === "success" &&
          Array.isArray(result.data)
        ) {
          events = result.data;
        }

        // TODAY'S DATE

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // FILTER UPCOMING EVENTS

        const filteredEvents = events
          .filter((event) => {
            if (!event.date) {
              return false;
            }

            const eventDate = new Date(event.date);

            if (isNaN(eventDate.getTime())) {
              return false;
            }

            eventDate.setHours(0, 0, 0, 0);

            return eventDate >= today;
          })

          // SORT BY NEAREST UPCOMING DATE

          .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);

            return dateA - dateB;
          })

          // ONLY FIRST 3 EVENTS

          .slice(0, 3);

        setUpcomingEvents(filteredEvents);
      })
      .catch((error) => {
        console.error(
          "Error fetching upcoming events:",
          error
        );

        setUpcomingEvents([]);
      });
  }, []);

  // =====================================================
  // MOBILE SIDEBAR
  // =====================================================

  useEffect(() => {
    if (window.innerWidth <= 768) {
      closeSidebar();
    }
  }, [location.pathname]);

  // =====================================================
  // MONTH NAMES
  // =====================================================

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // =====================================================
  // MONTHLY FEE COLLECTION CHART DATA
  // =====================================================

  const chartData = monthlyFeeCollection
    .map((item) => ({
      month: Number(item.month),
      year: Number(item.year),
      collection: Number(item.total_collection || 0),
      paymentCount: Number(item.payment_count || 0),
    }))
    .sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }

      return a.month - b.month;
    });

  // =====================================================
  // CHART VALUES
  // =====================================================

  const chartValues = chartData.map(
    (item) => item.collection
  );

  const maxChartValue =
    chartValues.length > 0
      ? Math.max(...chartValues)
      : 0;

  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  };

  const formatAxisCurrency = (value) => {
    const amount = Number(value || 0);

    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    }

    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }

    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}k`;
    }

    return `₹${amount}`;
  };

  // =====================================================
  // GENERATE SVG LINE
  // =====================================================

  const generateLinePath = () => {
    if (chartData.length === 0) {
      return "";
    }

    if (chartData.length === 1) {
      return "M250,125";
    }

    const width = 500;
    const height = 250;
    const padding = 10;

    const maxValue =
      maxChartValue > 0
        ? maxChartValue
        : 1;

    const points = chartData.map((item, index) => {
      const x =
        (index / (chartData.length - 1)) *
          (width - padding * 2) +
        padding;

      const y =
        height -
        (item.collection / maxValue) *
          (height - padding * 2) -
        padding;

      return {
        x,
        y,
      };
    });

    let path = `M${points[0].x},${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const previous = points[i - 1];
      const current = points[i];

      const controlPoint1X =
        previous.x +
        (current.x - previous.x) / 2;

      const controlPoint2X =
        previous.x +
        (current.x - previous.x) / 2;

      path += `
        C${controlPoint1X},${previous.y}
        ${controlPoint2X},${current.y}
        ${current.x},${current.y}
      `;
    }

    return path;
  };

  const linePath = generateLinePath();

  // =====================================================
  // GENERATE AREA PATH
  // =====================================================

  const generateAreaPath = () => {
    if (!linePath || chartData.length === 0) {
      return "";
    }

    const height = 250;

    const lastPoint =
      chartData.length === 1
        ? 250
        : 490;

    return `
      ${linePath}
      L${lastPoint},${height}
      L10,${height}
      Z
    `;
  };

  const areaPath = generateAreaPath();

  // =====================================================
  // Y AXIS VALUES
  // =====================================================

  const chartYAxis =
    maxChartValue > 0
      ? [
          Math.ceil(maxChartValue),
          Math.ceil(maxChartValue * 0.8),
          Math.ceil(maxChartValue * 0.6),
          Math.ceil(maxChartValue * 0.4),
          Math.ceil(maxChartValue * 0.2),
          0,
        ]
      : [5, 4, 3, 2, 1, 0];

  // =====================================================
  // FORMAT EVENT DATE
  // =====================================================

  const formatEventDate = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
      return dateValue;
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  // =====================================================
  // EVENT ICON
  // =====================================================

  const getEventIcon = (index) => {
    const icons = [
      "bi-calendar-event",
      "bi-bell",
      "bi-calendar-check",
    ];

    return icons[index] || "bi-calendar";
  };

  // =====================================================
  // EVENT COLOR
  // =====================================================

  const getEventColor = (index) => {
    const colors = [
      "blue",
      "green",
      "orange",
    ];

    return colors[index] || "blue";
  };

  // =====================================================
  // CARD
  // =====================================================

  const Card = ({
    link,
    icon,
    title,
    count,
    color,
  }) => (
    <link
      to={link}
      className="dashboard-card-link"
    >
      <div className="dashboard-stat-card">

        <div className="stat-top">

          <div
            className="stat-icon"
            style={{
              background: color,
            }}
          >
            <i className={`bi ${icon}`}></i>
          </div>

          <div className="stat-info">
            <p>{title}</p>
            <h3>{count}</h3>
          </div>

        </div>

        <span className="view-all">
          View all
        </span>

      </div>
    </link>
  );

  return (
    <div className="dashboard-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <Header
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        ></div>
      )}

      <div className="dashboard-layout">

        {/* =====================================================
            SIDEBAR
        ===================================================== */}

        <aside
          className={`dashboard-sidebar ${
            isSidebarOpen
              ? "sidebar-open"
              : ""
          }`}
        >
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            closeSidebar={closeSidebar}
          />
        </aside>

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <main className="dashboard-main">

          {isDashboardHome && (
            <>

              {/* =================================================
                  TOP HEADER
              ================================================= */}

              <div className="dashboard-heading">

                <div>
                  <h2>Dashboard</h2>

                  <p>
                    Welcome back, Admin
                  </p>
                </div>

                <div className="dashboard-actions">

                  <select>
                    <option>
                      06 May 2025
                    </option>
                  </select>

                  <button>
                    Export Report
                  </button>

                </div>

              </div>

              {/* =================================================
                  STATS CARDS
              ================================================= */}

              <div className="stats-grid">

                {/* STUDENTS */}

                <Card
                  link="/dashboard/StudentComponent/AdminViewStudent"
                  icon="bi-mortarboard-fill"
                  title="Students"
                  count={data.students}
                  color="#3478f6"
                />

                {/* TEACHERS */}

                <Card
                  link="/dashboard/TeacherComponent/ViewTeachers"
                  icon="bi-person-workspace"
                  title="Teachers"
                  count={data.teachers}
                  color="#27ae8a"
                />

                {/* CLASSES */}

                <Card
                  link="/dashboard/ScheduleComponent/ScheduleClass"
                  icon="bi-people-fill"
                  title="Classes"
                  count={data.classes}
                  color="#7b61d9"
                />

                {/* EMPLOYEES */}

                <Card
                  link="/dashboard/EmployeeComponent/ViewEmployee"
                  icon="bi-person-badge-fill"
                  title="Employees"
                  count={data.employees}
                  color="#f58a42"
                />

                {/* PASSED OUT STUDENTS */}

                <Card
                  link="/dashboard/StudentComponent/PassedOutStudent"
                  icon="bi-mortarboard"
                  title="Passed Out Students"
                  count={data.passedOut}
                  color="#ef476f"
                />

                {/* SPONSORED STUDENTS */}

                <Card
                  link="/dashboard/StudentComponent/SponseredStudents"
                  icon="bi-heart-fill"
                  title="Sponsored Students"
                  count={data.sponseredStudents}
                  color="#f59e0b"
                />

                {/* ROUTES ACTIVE - NEW */}

                <Card
                  link="/dashboard/TransportComponent/ActiveRoutes"
                  icon="bi-bus-front-fill"
                  title="Routes Active"
                  count={data.activeRoutes}
                  color="#3478f6"
                />

                {/* STUDENTS ABSENT - NEW */}

                <Card
                  link="/dashboard/StudentComponent/AdminViewStudent"
                  icon="bi-exclamation-triangle-fill"
                  title="Students Absent"
                  count={data.absentStudents}
                  color="#ef476f"
                />

                {/* EMPLOYEES ABSENT - NEW */}

                <Card
                  link="/dashboard/EmployeeComponent/ViewEmployee"
                  icon="bi-exclamation-triangle"
                  title="Employees Absent"
                  count={data.employeeAbsent}
                  color="#f59e0b"
                />

                {/* EXAMS TODAY */}

                <Card
                  link="/dashboard/ExamComponent/SelectClass"
                  icon="bi-speedometer2"
                  title="Exams Today"
                  count={data.examsToday}
                  color="#6d5dfc"
                />

                {/* BIRTHDAYS TODAY - NEW */}

                {/* <Card
                  link="/dashboard/StudentComponent/AdminViewStudent"
                  icon="bi-gift-fill"
                  title="Birthdays Today"
                  count={data.birthdaysToday}
                  color="#7b61d9"
                /> */}

                {/* FEE PENDING - NEW */}

                <Card
                  link="/dashboard/FeeComponent/SelectPendingPaymentsPeriod"
                  icon="bi-currency-rupee"
                  title="Fee Pending"
                  count={data.feePending}
                  color="#f59e0b"
                />

                {/* LEAVE REQUESTS */}

                <Card
                  link="/dashboard/StudentComponent/StudentLeaveRequest"
                  icon="bi-calendar-check-fill"
                  title="Leave Requests"
                  count={data.leaveRequests}
                  color="#8b5cf6"
                />

              </div>

              {/* =================================================
                  BOTTOM SECTION
              ================================================= */}

              <div className="dashboard-bottom-grid">

                {/* =================================================
                    ATTENDANCE
                ================================================= */}

                <div className="dashboard-panel attendance-panel">

                  <h3>
                    Attendance Overview
                  </h3>

                  <div className="attendance-content">

                    <div
                      className="donut-chart"
                      style={{
                        background: `conic-gradient(
                          #27ae8a 0% ${attendanceData.presentPercentage}%,
                          #ef476f ${attendanceData.presentPercentage}% ${
                          attendanceData.presentPercentage +
                          attendanceData.absentPercentage
                        }%,
                          #f5a623 ${
                            attendanceData.presentPercentage +
                            attendanceData.absentPercentage
                          }% 100%
                        )`,
                      }}
                    >

                      <div className="donut-center">

                        <strong>
                          {attendanceData.presentPercentage}%
                        </strong>

                        <span>
                          Attendance
                        </span>

                      </div>

                    </div>

                    <div className="attendance-legend">

                      <div>

                        <span className="legend-dot present"></span>

                        <span>
                          Present
                        </span>

                        <b>
                          {attendanceData.presentPercentage}%
                        </b>

                      </div>

                      <div>

                        <span className="legend-dot absent"></span>

                        <span>
                          Absent
                        </span>

                        <b>
                          {attendanceData.absentPercentage}%
                        </b>

                      </div>

                      <div>

                        <span className="legend-dot leave"></span>

                        <span>
                          Leave
                        </span>

                        <b>
                          {attendanceData.leavePercentage}%
                        </b>

                      </div>

                    </div>

                  </div>

                </div>

                {/* =================================================
                    MONTHLY FEE COLLECTION
                ================================================= */}

                <div className="dashboard-panel students-overview">

                  <h3>
                    Monthly Fee Collection Overview
                  </h3>

                  <div className="chart-area">

                    {/* Y AXIS */}

                    <div className="y-axis">

                      {chartYAxis.map(
                        (value, index) => (
                          <span key={index}>
                            {formatAxisCurrency(value)}
                          </span>
                        )
                      )}

                    </div>

                    {/* LINE CHART */}

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

                        {/* AREA */}

                        {areaPath && (
                          <path
                            d={areaPath}
                            fill="url(#chartGradient)"
                          />
                        )}

                        {/* LINE */}

                        {linePath && (
                          <path
                            d={linePath}
                            fill="none"
                            stroke="#9a6cff"
                            strokeWidth="4"
                          />
                        )}

                        {/* DATA POINTS */}

                        {chartData.map(
                          (item, index) => {

                            const width = 500;
                            const height = 250;
                            const padding = 10;

                            const maxValue =
                              maxChartValue > 0
                                ? maxChartValue
                                : 1;

                            const x =
                              chartData.length === 1
                                ? width / 2
                                : (index /
                                    (chartData.length - 1)) *
                                    (width -
                                      padding * 2) +
                                  padding;

                            const y =
                              height -
                              (item.collection /
                                maxValue) *
                                (height -
                                  padding * 2) -
                              padding;

                            return (
                              <circle
                                key={`${item.year}-${item.month}`}
                                cx={x}
                                cy={y}
                                r="5"
                                fill="#9a6cff"
                              />
                            );
                          }
                        )}

                      </svg>

                      {/* X AXIS - MONTHS */}

                      <div className="months">

                        {chartData.length > 0 ? (
                          chartData.map((item, index) => {

                            const showLabel =
                              chartData.length <= 6 ||
                              index === 0 ||
                              index === chartData.length - 1 ||
                              index % Math.ceil(chartData.length / 6) === 0;

                            return (
                              <span
                                key={`${item.year}-${item.month}`}
                                className={
                                  !showLabel
                                    ? "month-label-hidden"
                                    : ""
                                }
                                title={`${monthNames[item.month - 1]} ${item.year}`}
                              >
                                {showLabel
                                  ? `${monthNames[item.month - 1]} '${String(item.year).slice(-2)}`
                                  : ""}
                              </span>
                            );
                          })
                        ) : (
                          <>
                            {[
                              "Jan",
                              "Feb",
                              "Mar",
                              "Apr",
                              "May",
                              "Jun",
                            ].map((month) => (
                              <span key={month}>
                                {month}
                              </span>
                            ))}
                          </>
                        )}

                      </div>

                    </div>

                  </div>

                  {/* CHART DESCRIPTION */}

                  <div
                    style={{
                      marginTop: "10px",
                      fontSize: "12px",
                      color: "#777",
                      textAlign: "center",
                    }}
                  >
                    Monthly fee collection received
                  </div>

                </div>

                {/* =================================================
                    NOTICE BOARD
                ================================================= */}

                <div className="dashboard-panel notice-board">

                  <div className="notice-header">

                    <h3>
                      Notice Board
                    </h3>

                    <span>
                      •••
                    </span>

                  </div>

                  {/* LATEST 3 UPCOMING EVENTS */}

                  {upcomingEvents.length > 0 ? (

                    upcomingEvents.map(
                      (event, index) => (
                        <div
                          className="notice-item"
                          key={event.id}
                        >

                          <div
                            className={`notice-icon ${getEventColor(
                              index
                            )}`}
                          >

                            <i
                              className={`bi ${getEventIcon(index)}`}
                            ></i>

                          </div>

                          <div>

                            <h4>
                              {event.name}
                            </h4>

                            <p>
                              {formatEventDate(event.date)}
                            </p>

                          </div>

                        </div>
                      )
                    )

                  ) : (

                    <div className="notice-empty">

                      <i className="bi bi-calendar-x"></i>

                      <p>
                        No upcoming events
                      </p>

                    </div>

                  )}

                  <link
                    to="/dashboard/ScheduleComponent/EventList"
                    className="view-notices"
                  >
                    View all events
                  </link>

                </div>

              </div>

            </>
          )}

          {!isDashboardHome && (
            <Outlet />
          )}

        </main>

      </div>

    </div>
  );
};

export default Dashboard;
