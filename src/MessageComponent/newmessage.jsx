import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateMessage.css";

const BASE_URL = "http://localhost/kkblossom/api.php/Adminapi/AdminMessage";

const CreateMessage = () => {
  const [message, setMessage] = useState("");
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [file, setFile] = useState(null);

  const navigate = useNavigate();

  // Load students
  const loadRecipients = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/recipients`);
      setStudents(res.data.data || []);
    } catch (err) {
      console.log("Recipients error:", err);
    }
  };

  useEffect(() => {
    loadRecipients();
  }, []);

  // Group by class
  const grouped = students.reduce((acc, curr) => {
    if (!acc[curr.Class]) acc[curr.Class] = [];
    acc[curr.Class].push(curr);
    return acc;
  }, {});

  // Select single
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
    } else {
      setSelected(students.map((s) => s.id));
    }
    setSelectAll(!selectAll);
  };

  // Select class
  const toggleClass = (cls) => {
    const classIds = grouped[cls].map((s) => s.id);
    const allSelected = classIds.every((id) => selected.includes(id));

    if (allSelected) {
      setSelected((prev) =>
        prev.filter((id) => !classIds.includes(id))
      );
    } else {
      setSelected((prev) => [...new Set([...prev, ...classIds])]);
    }
  };

  // 🔥 SEND MESSAGE + FCM TRIGGER
  const sendMessage = async () => {
    if (!message.trim()) {
      alert("Message is required");
      return;
    }

    if (selected.length === 0) {
      alert("Select at least one student");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("message", message);

      selected.forEach((id) => {
        formData.append("ids[]", id);
      });

      if (file) {
        formData.append("file", file);
      }

      // 🔥 THIS API SHOULD TRIGGER FCM IN BACKEND
      const res = await axios.post(
        `${BASE_URL}/sendPush`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("FCM RESPONSE:", res.data);

      if (res.data.status) {
        alert("Message Sent & Push Notification Delivered 🚀");

        setMessage("");
        setSelected([]);
        setSelectAll(false);
        setFile(null);

        navigate("/dashboard/MessageComponent/MessageView");
      } else {
        alert(res.data.message || "Failed to send");
      }
    } catch (err) {
      console.error("SEND ERROR:", err);
      alert("Failed to send message");
    }
  };

  return (
    <div className="create-container">

      {/* TOP SECTION */}
      <div className="top-section">
        <div className="messages-box">

          <label>Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write here..."
          />

          <label>Attach File (Optional)</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0] || null)}
          />

        </div>
      </div>

      {/* TITLE */}
      <div className="recipient-title">
        <h2>Select Recipients</h2>
      </div>

      {/* SELECT ALL */}
      <div className="col-1" style={{ display: "flex", gap: "8px" }}>
        <input
          type="checkbox"
          checked={selectAll}
          onChange={handleSelectAll}
        />
        <label>Select All</label>
      </div>

      {/* CLASS WISE LIST */}
      {Object.keys(grouped).map((cls) => (
        <div key={cls} className="class-section">

          <div className="col-1" style={{ display: "flex", gap: "8px" }}>
            <input
              type="checkbox"
              onChange={() => toggleClass(cls)}
              checked={grouped[cls].every((s) =>
                selected.includes(s.id)
              )}
            />
            <span>Class {cls}</span>
          </div>

          <table className="student-table">
            <thead>
              <tr>
                <th>Select</th>
                <th>Roll No</th>
                <th>Name</th>
              </tr>
            </thead>

            <tbody>
              {grouped[cls].map((s) => (
                <tr key={s.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(s.id)}
                      onChange={() => toggleSelect(s.id)}
                    />
                  </td>
                  <td>{s.RollNo}</td>
                  <td>{s.Name}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      ))}

      {/* SEND BUTTON */}
      <button className="send-btn" onClick={sendMessage}>
        ➤
      </button>

    </div>
  );
};

export default CreateMessage;