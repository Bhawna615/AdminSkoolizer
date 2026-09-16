import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentAbsent.css";
import { useNavigate } from "react-router-dom";

const StudentAbsent = () => {
  const [students, setStudents] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const API_BASE =
    "http://localhost/kkblossom/api.php/Adminapi/StudentAbsent/";

  useEffect(() => {
    fetchAbsents();
  }, []);

  const fetchAbsents = async () => {
    try {
      const res = await axios.get(API_BASE + "loadAbsents");

      if (res.data.status) {
        setStudents(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching absentees:", error);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(students.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleCheckbox = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const sendSms = async () => {
    if (selectedIds.length === 0) {
      alert("Please select students");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      selectedIds.forEach((id) => {
        formData.append("id[]", id);
      });

      const res = await axios.post(
        API_BASE + "sendAbsentSms",
        formData
      );

      if (res.data.status) {

        alert("Message sent successfully");

        navigate(
          "/dashboard/MessageComponent/MessageView",
          {
            state: {
              successMessage: "Message sent successfully",
            },
          }
        );

      } else {

        alert("Failed to send");

      }

    } catch (error) {

      console.error("SMS Error:", error);
      alert("Something went wrong");

    }

    setLoading(false);
  };

  return (
    <div className="absent-container">

      <div className="preview-box">

        <p className="preview-title">Preview</p>

        <p>
          Dear Parent, You are notified that your ward is absent
          from school today. Regards, KK Blossoms
        </p>

      </div>

      <div className="table-wrapper">

        <table className="absent-table">

          <thead>
            <tr>

              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    students.length > 0 &&
                    selectedIds.length === students.length
                  }
                />{" "}
                Select All
              </th>

              <th>Count</th>
              <th>Absentee</th>
              <th>Class</th>
              <th>Roll No.</th>
              <th>Contact</th>

            </tr>
          </thead>

          <tbody>

            {students.length > 0 ? (

              students.map((row, index) => (

                <tr key={row.id}>

                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row.id)}
                      onChange={() => handleCheckbox(row.id)}
                    />
                  </td>

                  <td>{index + 1}</td>
                  <td>{row.Name}</td>
                  <td>{row.Class}</td>
                  <td>{row.Rollno}</td>
                  <td>{row.Smsno}</td>

                </tr>

              ))

            ) : (

              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No Absentees Found
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

      <button
        className="send-btn"
        onClick={sendSms}
        disabled={loading}
      >
        {loading ? "Sending..." : "➤"}
      </button>

    </div>
  );
};

export default StudentAbsent;