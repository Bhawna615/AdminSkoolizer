import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./StudentTransportDetails.css";

const StudentTransportDetails = () => {
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [transport, setTransport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      fetchTransportDetails(id);
    } else {
      setError("Invalid Student ID");
      setLoading(false);
    }
  }, [id]);

  const fetchTransportDetails = async (studentId) => {
    try {
      setLoading(true);
      setError("");

      console.log("Student ID:", studentId);

      const response = await axios.get(
        `http://localhost/kkblossom/api.php/Adminapi/AdminTransport/getTransportDetails/${studentId}`
      );

      console.log("Transport API Response:", response.data);

      if (response.data?.status === true) {
        const studentData = response.data.info || null;
        const details = response.data.details || [];

        console.log("Student Data:", studentData);
        console.log("Transport Data:", details);

        setStudent(studentData);

        if (
          Array.isArray(details) &&
          details.length > 0 &&
          details[0].station_id
        ) {
          setTransport(details[0]);
        } else {
          setTransport(null);
        }
      } else {
        setStudent(null);
        setTransport(null);

        setError(
          response.data?.message ||
            "No transport details found."
        );
      }
    } catch (err) {
      console.error("Transport API Error:", err);

      setStudent(null);
      setTransport(null);

      if (err.response) {
        setError(
          err.response.data?.message ||
            "Server Error. Please check the backend."
        );
      } else {
        setError("Unable to connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="loading">
        Loading...
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error) {
    return (
      <div className="error">
        {error}
      </div>
    );
  }

  // =========================================
  // NO STUDENT
  // =========================================

  if (!student) {
    return (
      <div className="no-student">
        No student found.
      </div>
    );
  }

  // =========================================
  // MAIN UI
  // =========================================

  return (
    <div className="transport-container">
      <div className="student-card">

        {/* STUDENT DETAILS */}

        {/* STUDENT DETAILS */}

<div className="transport-student-top">

  <div className="trasport-student-image-box">
    <img
      src={
        student.image
          ? `http://localhost/kkblossom/assets/images/students/${student.image}`
          : "http://localhost/kkblossom/assets/icons/user.svg"
      }
      alt={student.Name || "Student"}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src =
          "http://localhost/kkblossom/assets/icons/user.svg";
      }}
    />
  </div>

  <div className="trasport-student-info-box">

    <h2 className="student-name">
      {student.Name || "N/A"}
    </h2>

    <p>
      <strong>Admission No:</strong>{" "}
      {student.Admno || "N/A"}
    </p>

    <p>
      <strong>Class:</strong>{" "}
      {student.Class || "N/A"}
    </p>

    <p>
      <strong>Roll No:</strong>{" "}
      {student.Rollno || "N/A"}
    </p>

  </div>

</div>

        {/* TRANSPORT DETAILS */}

        <div className="transport-section">

          {!transport ? (

            <p className="no-details">
              No Details Available.
            </p>

          ) : (

            <>
              <h3 className="section-title">
                Transport Details
              </h3>

              <div className="transport-box">

                <div className="transport-row">
                  <span className="transport-label">
                    Route:
                  </span>

                  <span className="transport-value">
                    {transport.routename || "N/A"}
                  </span>
                </div>

                <div className="transport-row">
                  <span className="transport-label">
                    Station:
                  </span>

                  <span className="transport-value">
                    {transport.StationName ||
                      transport.stationname ||
                      "N/A"}
                  </span>
                </div>

                <div className="transport-row">
                  <span className="transport-label">
                    Transport Charges:
                  </span>

                  <span className="transport-value">
                    {transport.charges !== null &&
                    transport.charges !== undefined
                      ? `₹${transport.charges}`
                      : "N/A"}
                  </span>
                </div>

              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};

export default StudentTransportDetails;