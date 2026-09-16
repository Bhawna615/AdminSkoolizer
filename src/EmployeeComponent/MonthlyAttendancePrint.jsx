import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Print.css";
import schoolLogo from "../images/school-logo.png";
import { useParams } from "react-router-dom";

const API = "http://localhost/kkblossom/api.php/Adminapi/AdminEmployee/";

const school = {
  name: "KK Blossoms School",
  address: "Rabaun, Solan (H.P)",
};

export default function MonthlyAttendancePrint() {
  const { month } = useParams();
  const [data, setData] = useState(null);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    axios.get(API + "getMonthlyAttendance/" + month).then((res) => {
      setData(res.data);

      // ✅ AUTO PRINT
      setTimeout(() => {
        window.print();
      }, 500);
    });
  }, []);

  const getDaysInMonth = () => {
    const year = new Date().getFullYear();
    return new Date(year, month, 0).getDate();
  };

  const checkMark = (empId, day) => {
    let isLeave = false;

    data.absents.forEach((row) => {
      const d = new Date(row.Date).getDate();
      if (d === day && row.empid == empId) {
        isLeave = true;
      }
    });

    if (isLeave) return "L";

    let isPresent = false;
    data.attendance.forEach((row) => {
      const d = new Date(row.Date).getDate();
      if (d === day) {
        isPresent = true;
      }
    });

    return isPresent ? "P" : "";
  };

  if (!data) return <h3>Loading...</h3>;

  return (
    <div className="print-container">
      {/* 🔥 SCHOOL HEADER */}
      <div className="school-header">
        <img src={schoolLogo} alt="logo" className="school-logo" />

        <div className="school-info">
          <h2>{school.name}</h2>
          <p>{school.address}</p>
        </div>
      </div>

      {/* TITLE */}
      <h2 className="title">ATTENDANCE SHEET</h2>

      <p className="details">Month: {months[month - 1]}</p>

      <p className="details">Year: {new Date().getFullYear()}</p>

      {/* TABLE */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>

            {[...Array(getDaysInMonth())].map((_, i) => {
              const day = i + 1;
              const date = new Date(new Date().getFullYear(), month - 1, day);

              return (
                <th key={i}>
                  {day} {date.toLocaleDateString("en-US", { weekday: "short" })}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {data.employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.empname}</td>

              {[...Array(getDaysInMonth())].map((_, i) => (
                <td key={i}>{checkMark(emp.id, i + 1)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
