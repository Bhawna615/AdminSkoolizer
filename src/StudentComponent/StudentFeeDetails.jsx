import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./StudentFeeDetails.css";

const StudentFeeDetails = () => {
const { id } = useParams();

const [student, setStudent] = useState(null);
const [details, setDetails] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
if (id && !isNaN(id)) {
fetchFeeDetails(id);
} else {
setError("Invalid Student ID");
setLoading(false);
}
}, [id]);

const fetchFeeDetails = async (studentId) => {
try {
setLoading(true);
setError("");


  const formData = new FormData();
  formData.append("id", studentId);

  const response = await axios.post(
    "http://localhost/kkblossom/api.php/Adminapi/AdminFee/getFeeDetails",
    formData
  );

  if (response.data?.status) {
    setStudent(response.data.info || null);
    setDetails(response.data.details || []);
  } else {
    setStudent(null);
    setDetails([]);
    setError(response.data?.message || "No data found.");
  }
} catch (err) {
  console.error("API Error:", err);
  setError("Server Error. Please check backend.");
  setStudent(null);
  setDetails([]);
} finally {
  setLoading(false);
}


};

const formatDate = (value) => {
if (!value) return "N/A";


const timestamp = Date.parse(value);

if (isNaN(timestamp)) return "N/A";

return new Date(timestamp).toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

};

if (loading) {
return ( <div className="student-fee-loading">
Loading... </div>
);
}

if (error) {
return ( <div className="student-fee-error">
{error} </div>
);
}

if (!student) {
return ( <div className="student-fee-not-found">
No student found </div>
);
}

return ( <div className="student-fee-container">

```
  <div className="student-fee-card">

    {/* Top Student Section */}
    <div className="student-fee-top">

      <div className="student-fee-image-box">
        <img
          src={
            student.image
              ? `http://localhost/kkblossom/assets/images/students/${student.image}`
              : "http://localhost/kkblossom/assets/icons/user.svg"
          }
          alt="Student"
        />
      </div>

      <div className="student-fee-info-box">

        <h2 className="student-fee-name">
          {student.Name || "N/A"}
        </h2>

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


    {/* Fee Details Section */}
    <div className="student-fee-section">

      {details.length === 0 ? (

        <div className="student-fee-no-details">
          Nothing to show.
        </div>

      ) : (

        <>
          <h2 className="student-fee-section-title">
            Fee Details
          </h2>

          <div className="student-fee-grid">

            {details.map((fee, idx) => (

              <div
                key={idx}
                className="student-fee-box"
              >

                <div className="student-fee-period">
                  {fee.period || "N/A"}
                </div>

                <div className="student-fee-row">

                  <span className="student-fee-label">
                    Status
                  </span>

                  <span
                    className={`student-fee-status ${
                      String(fee.status).toLowerCase() === "paid"
                        ? "student-fee-status-paid"
                        : "student-fee-status-pending"
                    }`}
                  >
                    {fee.status || "N/A"}
                  </span>

                </div>

                <div className="student-fee-row">

                  <span className="student-fee-label">
                    Last Date
                  </span>

                  <span className="student-fee-value">
                    {formatDate(fee.lastdate)}
                  </span>

                </div>

                {fee.paidondate && (

                  <div className="student-fee-row">

                    <span className="student-fee-label">
                      Paid On
                    </span>

                    <span className="student-fee-value">
                      {formatDate(fee.paidondate)}
                    </span>

                  </div>

                )}

              </div>

            ))}

          </div>
        </>

      )}

    </div>

  </div>

</div>


);
};

export default StudentFeeDetails;
