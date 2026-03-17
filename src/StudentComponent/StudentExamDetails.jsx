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

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!student) return <div>No student found</div>;

  return (
    <div className="exam-container">
      <div className="student-card">

        {/* Top Section */}
        <div className="student-top">
          <div className="student-image-box">
            {student.image ? (
              <img
                src={`http://localhost/kkblossom/assets/images/students/${student.image}`}
                alt="Student"
              />
            ) : (
              <img
                src={`http://localhost/kkblossom/assets/icons/user.svg`}
                alt="Default"
              />
            )}
          </div>

          <div className="student-info-box">
            <h2 className="student-name">{student.Name}</h2>
            <p><strong>Class:</strong> {student.Class}</p>
            <p><strong>Roll No:</strong> {student.Rollno}</p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="exam-section">
          {exams.length === 0 ? (
            <p className="no-data">Nothing to show.</p>
          ) : (
            <>
              <p className="exam-title">Exams Details</p>

              {exams.map((item, index) => {
                const formattedDate = new Date(item.Date)
                  .toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                  });

                return (
                  <div key={index} className="exam-box">
                    <p className="exam-name">{item.Examname}</p>
                    <p>{item.Subject}</p>
                    <p>{formattedDate}</p>
                  </div>
                );
              })}
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default StudentExamDetails;