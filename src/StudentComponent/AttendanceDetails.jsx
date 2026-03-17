import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const AttendanceDetails = () => {
  const { id } = useParams();

  const [info, setInfo] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost/kkblossom/api.php/Adminapi/AdminStudentAttendance/studentAttendance/${id}`
        );

        if (res.data.status) {
          setInfo(res.data.info);

          setAttendance({
            totalDays: res.data.attendance[0],
            presentDays: res.data.attendance[1],
            absentDates: res.data.attendance[2] || [],
          });
        } else {
          setError(res.data.message);
        }
      } catch (err) {
        setError("Server Error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div style={{ padding: 30 }}>Loading...</div>;
  if (error) return <div style={{ padding: 30, color: "red" }}>{error}</div>;
  if (!info || !attendance)
    return <div style={{ padding: 30 }}>No Attendance Data</div>;

  const percent =
    attendance.totalDays !== 0
      ? Math.floor(
          (attendance.presentDays / attendance.totalDays) * 100
        )
      : 0;

  const imageUrl = info.image
    ? `http://localhost/kkblossom/assets/images/students/${info.image}`
    : `http://localhost/kkblossom/assets/icons/user.svg`;

  return (
    <div style={{ padding: "30px" }}>
      <div
        style={{
          border: "1px solid #EBEBEC",
          borderRadius: "5px",
        }}
      >
        {/* Top Section */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #EBEBEC",
          }}
        >
          <div
            style={{
              width: "30%",
              background: "#f95555",
              textAlign: "center",
              padding: "20px",
            }}
          >
            <img
              src={imageUrl}
              alt="student"
              style={{
                height: "150px",
                width: "150px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </div>

          <div style={{ width: "70%", padding: "20px", fontSize: "20px" }}>
            <p>{info.Name}</p>
            <p>Class: {info.Class}</p>
            <p>Rollno: {info.Rollno}</p>
          </div>
        </div>

        {/* Attendance Section */}
        <div style={{ padding: "20px" }}>
          <p
            style={{
              fontSize: "30px",
              textAlign: "center",
              textTransform: "uppercase",
              fontWeight: "bold",
            }}
          >
            Attendance Details
          </p>

          <p style={{ fontSize: "25px" }}>
            <span style={{ fontSize: "48px" }}>
              {attendance.presentDays}
            </span>{" "}
            out of{" "}
            <span style={{ fontSize: "48px" }}>
              {attendance.totalDays}
            </span>{" "}
            days
          </p>

          <p style={{ fontSize: "48px", fontWeight: "bold" }}>
            {percent}%
          </p>

          <p style={{ fontSize: "20px" }}>
            Was absent on following dates:
          </p>

          {attendance.absentDates.length > 0 ? (
            attendance.absentDates.map((item, index) => {
              const formattedDate = new Date(
                item.Date
              ).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              });

              return (
                <p key={index} style={{ fontSize: "20px" }}>
                  {formattedDate}
                </p>
              );
            })
          ) : (
            <p>No absences</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceDetails;