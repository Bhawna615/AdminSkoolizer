import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateMessage.css";

const BASE_URL =
  "http://localhost/kkblossom/api.php/Adminapi/AdminMessage";

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
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
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

    const allSelected = classIds.every((id) =>
      selected.includes(id)
    );

    if (allSelected) {
      setSelected((prev) =>
        prev.filter((id) => !classIds.includes(id))
      );
    } else {
      setSelected((prev) => [
        ...new Set([...prev, ...classIds]),
      ]);
    }
  };

  // Send message
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
        alert(
          "Message Sent & Push Notification Delivered 🚀"
        );

        setMessage("");
        setSelected([]);
        setSelectAll(false);
        setFile(null);

        navigate(
          "/dashboard/MessageComponent/MessageView"
        );
      } else {
        alert(res.data.message || "Failed to send");
      }
    } catch (err) {
      console.error("SEND ERROR:", err);
      alert("Failed to send message");
    }
  };

  return (
    <div className="create-message-page">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="create-message-header">
        <div>
          <h1>Create Message</h1>
          <p>
            Compose and send a notification to students
          </p>
        </div>

        <button
          className="back-message-btn"
          onClick={() =>
            navigate(
              "/dashboard/MessageComponent/MessageView"
            )
          }
        >
          ← Back
        </button>
      </div>

      {/* =========================================
          MESSAGE COMPOSE
      ========================================= */}

      <div className="message-compose-card">

        <div className="message-card-heading">
          <div className="message-heading-icon">
            ✉
          </div>

          <div>
            <h2>Compose Message</h2>
            <p>
              Enter your message and attach a file if required.
            </p>
          </div>
        </div>

        <div className="message-form-group">

          <label>
            Message
            <span className="required-star">*</span>
          </label>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here..."
          />

          <div className="message-bottom-info">
            <span>
              This message will be delivered as a notification.
            </span>

            <span>
              {message.length} characters
            </span>
          </div>

        </div>

        <div className="message-form-group file-group">

          <label>Attach File</label>

          <label className="file-upload-box">

            <input
              type="file"
              onChange={(e) =>
                setFile(e.target.files[0] || null)
              }
            />

            <span className="upload-icon">
              ↑
            </span>

            <span className="upload-content">
              <strong>
                {file
                  ? file.name
                  : "Click to choose a file"}
              </strong>

              <small>
                {file
                  ? "File selected successfully"
                  : "Optional attachment"}
              </small>
            </span>

            <span className="browse-text">
              Browse
            </span>

          </label>

          {file && (
            <button
              type="button"
              className="remove-file-btn"
              onClick={() => setFile(null)}
            >
              × Remove attachment
            </button>
          )}

        </div>

      </div>

      {/* =========================================
          RECIPIENT HEADER
      ========================================= */}

      <div className="recipient-header">

        <div>
          <h2>Select Recipients</h2>

          <p>
            Select individual students or an entire class.
          </p>
        </div>

        <div className="recipient-counter">
          <strong>{selected.length}</strong>
          <span>Selected</span>
        </div>

      </div>

      {/* =========================================
          SELECT ALL
      ========================================= */}

      <div className="select-all-card">

        <label className="check-row">

          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
          />

          <span className="custom-checkbox"></span>

          <div className="select-all-text">
            <strong>Select All Students</strong>

            <span>
              Select all {students.length} available students
            </span>
          </div>

        </label>

      </div>

      {/* =========================================
          CLASS LIST
      ========================================= */}

      <div className="classes-container">

        {Object.keys(grouped).map((cls) => {

          const classStudents = grouped[cls];

          const classSelected =
            classStudents.filter((s) =>
              selected.includes(s.id)
            ).length;

          const allClassSelected =
            classStudents.length > 0 &&
            classStudents.every((s) =>
              selected.includes(s.id)
            );

          return (
            <div
              key={cls}
              className="class-section"
            >

              {/* CLASS HEADER */}

              <div className="class-header">

                <label className="class-checkbox">

                  <input
                    type="checkbox"
                    checked={allClassSelected}
                    onChange={() => toggleClass(cls)}
                  />

                  <span className="custom-checkbox"></span>

                </label>

                <div className="class-info">

                  <div className="class-icon">
                    #
                  </div>

                  <div>
                    <h3>Class {cls}</h3>

                    <span>
                      {classStudents.length} Students
                    </span>
                  </div>

                </div>

                <div className="class-selection">

                  <span>
                    {classSelected}
                  </span>

                  /
                  {classStudents.length}

                </div>

              </div>

              {/* STUDENT TABLE */}

              <div className="student-table-wrapper">

                <table className="student-table">

                  <thead>
                    <tr>
                      <th className="select-column">
                        Select
                      </th>

                      <th className="roll-column">
                        Roll No
                      </th>

                      <th>
                        Student Name
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                    {classStudents.map((s) => {

                      const isSelected =
                        selected.includes(s.id);

                      return (
                        <tr
                          key={s.id}
                          className={
                            isSelected
                              ? "student-selected"
                              : ""
                          }
                        >

                          <td>
                            <label className="student-check">

                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() =>
                                  toggleSelect(s.id)
                                }
                              />

                              <span className="custom-checkbox"></span>

                            </label>
                          </td>

                          <td>
                            <span className="roll-number">
                              {s.RollNo}
                            </span>
                          </td>

                          <td>

                            <div className="student-name">

                              <span className="student-avatar">
                                {s.Name
                                  ?.charAt(0)
                                  ?.toUpperCase()}
                              </span>

                              <span>
                                {s.Name}
                              </span>

                            </div>

                          </td>

                        </tr>
                      );
                    })}

                  </tbody>

                </table>

              </div>

            </div>
          );
        })}

      </div>

      {/* =========================================
          BOTTOM SEND BAR
      ========================================= */}

      <div className="send-message-footer">

        <div className="send-summary">

          <div className="summary-icon">
            ✓
          </div>

          <div>
            <strong>
              {selected.length} recipient
              {selected.length !== 1 ? "s" : ""}
            </strong>

            <span>
              {selected.length > 0
                ? "Ready to receive notification"
                : "Select at least one student"}
            </span>
          </div>

        </div>

        <button
          className="send-message-btn"
          onClick={sendMessage}
          disabled={
            !message.trim() ||
            selected.length === 0
          }
        >
          <span>➤</span>
          Send Message
        </button>

      </div>

    </div>
  );
};

export default CreateMessage;