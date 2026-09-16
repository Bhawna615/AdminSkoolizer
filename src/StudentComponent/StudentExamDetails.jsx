import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./StudentExamDetails.css";

const StudentExamDetails = () => {
const { id } = useParams();

const [student, setStudent] = useState(null);
const [exams, setExams] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
if (id) {
fetchExamDetails();
}
}, [id]);

const fetchExamDetails = async () => {
try {
setLoading(true);


  const formData = new FormData();
  formData.append("id", id);

  const res = await axios.post(
    "http://localhost/kkblossom/api.php/Adminapi/AdminStudent/getExamDetails",
    formData
  );

  console.log("Exam API Response:", res.data);

  if (res.data && res.data.status === true) {
    setStudent(res.data.info);

    if (res.data.exams && Array.isArray(res.data.exams)) {
      setExams(res.data.exams);
    } else {
      setExams([]);
    }
  } else {
    setStudent(null);
  }
} catch (error) {
  console.error(error);
  setStudent(null);
  setExams([]);
} finally {
  setLoading(false);
}


};

if (loading) {
return ( <div className="student-exam-loading">
Loading... </div>
);
}

if (!student) {
return ( <div className="student-exam-not-found">
No student found </div>
);
}

return ( <div className="student-exam-container"> <div className="student-exam-card">


    {/* Top Section */}
    <div className="student-exam-top">
      <div className="student-exam-image-box">
        {student.image ? (
          <img
            src={`http://localhost/kkblossom/assets/images/students/${student.image}`}
            alt="Student"
          />
        ) : (
          <img
            src="http://localhost/kkblossom/assets/icons/user.svg"
            alt="Default"
          />
        )}
      </div>

      <div className="student-exam-info-box">
        <h2 className="student-exam-name">
          {student.Name}
        </h2>

        <p>
          <strong>Class:</strong> {student.Class}
        </p>

        <p>
          <strong>Roll No:</strong> {student.Rollno}
        </p>
      </div>
    </div>

    {/* Exam Section */}
    <div className="student-exam-section">

      {exams.length === 0 ? (
        <p className="student-exam-no-data">
          Nothing to show.
        </p>
      ) : (
        <>
          <p className="student-exam-title">
            Exam Details
          </p>

          <div className="student-exam-grid">
            {exams.map((item, index) => {
              const formattedDate = new Date(item.Date)
                .toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric"
                });

              return (
                <div
                  key={index}
                  className="student-exam-box"
                >
                  <p className="student-exam-subject-name">
                    {item.Examname}
                  </p>

                  <p className="student-exam-subject">
                    <span>Subject:</span>
                    {item.Subject}
                  </p>

                  <p className="student-exam-date">
                    <span>Exam Date:</span>
                    {formattedDate}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}

    </div>

  </div>
</div>


);
};

export default StudentExamDetails;
