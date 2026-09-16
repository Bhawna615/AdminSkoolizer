import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentBirthday.css";
import { useNavigate } from "react-router-dom";

const StudentBirthday = () => {

  const [students, setStudents] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const API_BASE =
    "http://localhost/kkblossom/api.php/Adminapi/StudentBirthday/";

  useEffect(() => {
    fetchBirthdays();
  }, []);

  const fetchBirthdays = async () => {

    try {

      const res = await axios.get(
        API_BASE + "loadBirthdays"
      );

      if (res.data.status) {
        setStudents(res.data.data);
      }

    } catch (error) {

      console.error(error);

    }
  };

  const handleSelectAll = (e) => {

    if (e.target.checked) {

      setSelectedIds(
        students.map((s) => s.id)
      );

    } else {

      setSelectedIds([]);

    }
  };

  const handleCheckbox = (id) => {

    if (selectedIds.includes(id)) {

      setSelectedIds(
        selectedIds.filter((item) => item !== id)
      );

    } else {

      setSelectedIds([...selectedIds, id]);

    }
  };

  const sendBirthdaySms = async () => {

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
        API_BASE + "sendBirthdaySms",
        formData
      );

      if (res.data.status) {

        alert("Message sent successfully");

        navigate(
          "/dashboard/MessageComponent/MessageView",
          {
            state: {
              successMessage:
                "Birthday message sent successfully",
            },
          }
        );

      } else {

        alert("Failed to send");

      }

    } catch (error) {

      console.error(error);
      alert("Something went wrong");

    }

    setLoading(false);
  };

  return (

    <div className="birthday-container">

      <div className="preview-box">

        <p className="preview-title">
          Preview
        </p>

        <p>
          Dear Student, The school wishes
          you a very happy birthday.
          Regards KK Blossoms.
        </p>

      </div>

      <div className="table-wrapper">

        <p className="select-all-text">

          <input
            type="checkbox"
            onChange={handleSelectAll}
            checked={
              students.length > 0 &&
              selectedIds.length === students.length
            }
          />{" "}

          Select All

        </p>

        <table className="birthday-table">

          <thead>

            <tr>

              <th>Select</th>
              <th>Roll No.</th>
              <th>Name</th>
              <th>Contact</th>
              <th>DOB</th>

            </tr>

          </thead>

          <tbody>

            {students.length > 0 ? (

              students.map((row) => (

                <tr key={row.id}>

                  <td>

                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row.id)}
                      onChange={() =>
                        handleCheckbox(row.id)
                      }
                    />

                  </td>

                  <td>{row.Rollno}</td>
                  <td>{row.Name}</td>
                  <td>{row.Smsno}</td>

                  <td>
                    {new Date(row.Dob)
                      .toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="5"
                  style={{ textAlign: "center" }}
                >
                  No Birthdays Today
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      <button
        className="send-btn"
        onClick={sendBirthdaySms}
        disabled={loading}
      >
        {loading ? "Sending..." : "➤"}
      </button>

    </div>
  );
};

export default StudentBirthday;