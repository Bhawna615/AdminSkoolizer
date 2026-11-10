
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./CreateMessage.css";

const BASE_URL =
  "http://localhost/kkblossom/api.php/Adminapi/AdminMessage";

const CreateMessage = () => {
  const [message, setMessage] = useState("");
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [file, setFile] = useState(null);

  // ================= FILTER STATES =================

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");

  // ================= MESSAGE BOX STATES =================

  const [showMsg, setShowMsg] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState(false);
  const [messageText, setMessageText] = useState("");

  // ================= SENDING STATE =================

  const [sending, setSending] = useState(false);

  // Synchronous lock prevents duplicate API requests
  const sendingLock = useRef(false);

  const navigate = useNavigate();

  // ================= LOAD STUDENTS =================

  const loadRecipients = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/recipients`);

      console.log("RECIPIENTS API RESPONSE:", res.data);

      const recipientData = Array.isArray(res.data.data)
        ? res.data.data
        : [];

      // Normalize roll number because the backend may return
      // Rollno, RollNo, roll_no, rollno, etc.
      const normalizedStudents = recipientData.map((student) => ({
        ...student,

        rollNo:
          student.RollNo ??
          student.Rollno ??
          student.roll_no ??
          student.rollno ??
          student.Roll_Number ??
          student.RollNumber ??
          student.roll_number ??
          student.roll ??
          "",
      }));

      console.log("NORMALIZED STUDENTS:", normalizedStudents);

      setStudents(normalizedStudents);
    } catch (err) {
      console.log("Recipients error:", err);
    }
  };

  useEffect(() => {
    loadRecipients();
  }, []);

  // ================= GET UNIQUE CLASSES =================

  const classes = [
    ...new Set(
      students
        .map((student) => student.Class)
        .filter((cls) => cls)
    ),
  ].sort();

  // ================= FILTER STUDENTS =================

  const filteredStudents = students.filter((student) => {
    const searchText = search.trim().toLowerCase();

    const matchesSearch =
      !searchText ||
      String(student.Name || "")
        .toLowerCase()
        .includes(searchText) ||
      String(student.rollNo || "")
        .toLowerCase()
        .includes(searchText) ||
      String(student.Class || "")
        .toLowerCase()
        .includes(searchText);

    const matchesClass =
      !classFilter || student.Class === classFilter;

    return matchesSearch && matchesClass;
  });

  // ================= GROUP FILTERED STUDENTS BY CLASS =================

  const grouped = filteredStudents.reduce((acc, curr) => {
    const className = curr.Class || "Unassigned";

    if (!acc[className]) {
      acc[className] = [];
    }

    acc[className].push(curr);

    return acc;
  }, {});

  // ================= SELECT SINGLE =================

  const toggleSelect = (id) => {
    if (sendingLock.current) return;

    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  // ================= SELECT ALL =================

  const handleSelectAll = () => {
    if (sendingLock.current) return;

    if (selectAll) {
      setSelected([]);
      setSelectAll(false);
      return;
    }

    setSelected(students.map((s) => s.id));
    setSelectAll(true);
  };

  // ================= SELECT CLASS =================

  const toggleClass = (cls) => {
    if (sendingLock.current) return;

    const classStudents = grouped[cls] || [];
    const classIds = classStudents.map((s) => s.id);

    const allSelected =
      classIds.length > 0 &&
      classIds.every((id) => selected.includes(id));

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

  // ================= KEEP SELECT ALL STATE UPDATED =================

  useEffect(() => {
    if (
      students.length > 0 &&
      selected.length === students.length
    ) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selected, students]);

  // ================= MESSAGE BOX =================

  const handleContinue = () => {
    setShowMsg(false);

    if (messageSuccess) {
      navigate("/dashboard/MessageComponent/MessageView");
    }
  };

  // ================= SEND MESSAGE =================

  const sendMessage = async () => {
    // Immediately block repeated clicks
    if (sendingLock.current) {
      return;
    }

    if (!message.trim()) {
      setMessageSuccess(false);
      setMessageText("Message is required");
      setShowMsg(true);
      return;
    }

    if (selected.length === 0) {
      setMessageSuccess(false);
      setMessageText("Select at least one student");
      setShowMsg(true);
      return;
    }

    // Lock synchronously before starting the API request
    sendingLock.current = true;
    setSending(true);
    setShowMsg(false);
    setMessageText("");

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
          timeout: 120000,
        }
      );

      console.log("FCM RESPONSE:", res.data);

      if (res.data.status) {
        setMessageSuccess(true);
        setMessageText(
          "Message Sent & Push Notification Delivered 🚀"
        );

        setShowMsg(true);

        setMessage("");
        setSelected([]);
        setSelectAll(false);
        setFile(null);
      } else {
        setMessageSuccess(false);
        setMessageText(
          res.data.message || "Failed to send message"
        );
        setShowMsg(true);
      }
    } catch (err) {
      console.error("SEND ERROR:", err);

      setMessageSuccess(false);

      if (err.code === "ECONNABORTED") {
        setMessageText(
          "The request is taking too long. Please check the message status before trying again, to avoid sending it twice."
        );
      } else if (err.response) {
        setMessageText(
          err.response.data?.message ||
            "The server could not send the message. Please try again later."
        );
      } else {
        setMessageText(
          "Unable to connect to the server. Please check your connection and verify the message status before retrying."
        );
      }

      setShowMsg(true);
    } finally {
      sendingLock.current = false;
      setSending(false);
    }
  };

  return (
    <div className="cm-page">

      {/* =========================================
          FULL SCREEN SENDING LOADER
      ========================================= */}

      {sending && (
        <div
          className="cm-loading-overlay"
          role="status"
          aria-live="polite"
          aria-label="Sending message"
        >
          <div className="cm-loader-content">

            <div className="cm-loader-icon">
              <i className="bi bi-send-fill"></i>
            </div>

            <div className="cm-loader-spinner"></div>

            <h2>Sending Message</h2>

            <p>Your message is being processed.</p>

            <span className="cm-loader-subtext">
              Sending notification to {selected.length} recipient
              {selected.length !== 1 ? "s" : ""}.
              Please wait...
            </span>

            <div className="cm-loader-progress">
              <span></span>
            </div>

            <small>
              Please do not close this page or click the send button again.
            </small>

          </div>
        </div>
      )}

      {/* =========================================
          SUCCESS / ERROR MESSAGE BOX
      ========================================= */}

      {showMsg && (
        <div className="cm-message-overlay">

          <div
            className={`cm-message-modal ${
              messageSuccess
                ? "cm-modal-success"
                : "cm-modal-error"
            }`}
            role="alertdialog"
            aria-modal="true"
            aria-live="assertive"
          >

            <div
              className={`cm-modal-icon ${
                messageSuccess ? "success" : "error"
              }`}
            >
              <i
                className={
                  messageSuccess
                    ? "bi bi-check-lg"
                    : "bi bi-x-lg"
                }
              ></i>
            </div>

            <div className="cm-modal-content">
              <h2>
                {messageSuccess ? "Message Sent!" : "Action Required"}
              </h2>

              <p>{messageText}</p>
            </div>

            <button
              type="button"
              className="cm-modal-btn"
              onClick={
                messageSuccess
                  ? handleContinue
                  : () => setShowMsg(false)
              }
            >
              {messageSuccess ? "Continue" : "OK"}
              <i className="bi bi-arrow-right"></i>
            </button>

          </div>
        </div>
      )}

      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <div className="cm-page-header">

        <div className="cm-header-left">
          <div className="cm-header-icon">
            <i className="bi bi-envelope-paper-fill"></i>
          </div>

          <div>
            <div className="cm-breadcrumb">
              Communication <i className="bi bi-chevron-right"></i> Messages
            </div>

            <h1>Create Message</h1>

            <p>
              Compose and deliver messages to students and parents.
            </p>
          </div>
        </div>

        <button
          className="cm-back-btn"
          type="button"
          disabled={sending}
          onClick={() =>
            navigate("/dashboard/MessageComponent/MessageView")
          }
        >
          <i className="bi bi-arrow-left"></i>
          Back to Messages
        </button>

      </div>

      {/* =========================================
          MESSAGE COMPOSE CARD
      ========================================= */}

      <div className="cm-compose-card">

        <div className="cm-section-heading">
          <div className="cm-section-icon">
            <i className="bi bi-chat-square-text-fill"></i>
          </div>

          <div>
            <h2>Compose Message</h2>
            <p>Write your notification and attach a file if needed.</p>
          </div>
        </div>

        <div className="cm-form-group">

          <div className="cm-label-row">
            <label htmlFor="cm-message">
              Your Message <span>*</span>
            </label>

            <span className="cm-required-label">
              Required field
            </span>
          </div>

          <textarea
            id="cm-message"
            value={message}
            disabled={sending}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here..."
          />

          <div className="cm-message-meta">
            <span>
              <i className="bi bi-info-circle"></i>
              This message will be delivered as a notification.
            </span>

            <strong>{message.length} characters</strong>
          </div>

        </div>

        {/* FILE UPLOAD */}

        <div className="cm-form-group cm-file-group">

          <label className="cm-file-label">Attachment</label>

          <label className="cm-file-upload">

            <input
              type="file"
              disabled={sending}
              onChange={(e) =>
                setFile(e.target.files[0] || null)
              }
            />

            <span className="cm-upload-icon">
              <i className="bi bi-cloud-arrow-up-fill"></i>
            </span>

            <span className="cm-upload-content">
              <strong>
                {file ? file.name : "Choose a file to attach"}
              </strong>

              <small>
                {file
                  ? "Your attachment is ready"
                  : "Click to browse your device · Optional"}
              </small>
            </span>

            <span className="cm-browse-btn">
              Browse Files
            </span>

          </label>

          {file && (
            <div className="cm-selected-file">
              <div className="cm-selected-file-info">
                <i className="bi bi-file-earmark-check-fill"></i>
                <span>{file.name}</span>
              </div>

              <button
                type="button"
                disabled={sending}
                onClick={() => setFile(null)}
              >
                <i className="bi bi-trash3"></i>
                Remove
              </button>
            </div>
          )}

        </div>

      </div>

      {/* =========================================
          RECIPIENT SECTION HEADER
      ========================================= */}

      <div className="cm-recipient-heading">

        <div>
          <div className="cm-recipient-title">
            <div className="cm-recipient-title-icon">
              <i className="bi bi-people-fill"></i>
            </div>

            <div>
              <h2>Select Recipients</h2>
              <p>Choose students who should receive this notification.</p>
            </div>
          </div>
        </div>

        <div className="cm-selected-counter">
          <div className="cm-counter-icon">
            <i className="bi bi-person-check-fill"></i>
          </div>

          <div>
            <strong>{selected.length}</strong>
            <span>Selected</span>
          </div>
        </div>

      </div>

      {/* =========================================
          RECIPIENT SEARCH AND FILTER
      ========================================= */}

      <div className="cm-recipient-tools">

        <div className="cm-search-box">
          <i className="bi bi-search"></i>

          <input
            type="text"
            value={search}
            disabled={sending}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, roll number..."
          />

          {search && (
            <button
              type="button"
              disabled={sending}
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </div>

        <div className="cm-class-select">
          <i className="bi bi-mortarboard-fill"></i>

          <select
            value={classFilter}
            disabled={sending}
            onChange={(e) => setClassFilter(e.target.value)}
          >
            <option value="">All Classes</option>

            {classes.map((cls, index) => (
              <option key={index} value={cls}>
                Class {cls}
              </option>
            ))}
          </select>

          <i className="bi bi-chevron-down cm-select-arrow"></i>
        </div>

        {(search || classFilter) && (
          <button
            type="button"
            className="cm-reset-btn"
            disabled={sending}
            onClick={() => {
              setSearch("");
              setClassFilter("");
            }}
          >
            <i className="bi bi-arrow-counterclockwise"></i>
            Reset
          </button>
        )}

      </div>

      {(search || classFilter) && (
        <div className="cm-filter-result">
          <i className="bi bi-funnel"></i>
          Showing <strong>{filteredStudents.length}</strong> of{" "}
          <strong>{students.length}</strong> students
        </div>
      )}

      {/* =========================================
          SELECT ALL STUDENTS
      ========================================= */}

      <div className="cm-select-all-card">

        <label className="cm-check-label">

          <input
            type="checkbox"
            checked={selectAll}
            disabled={sending}
            onChange={handleSelectAll}
          />

          <span className="cm-custom-checkbox"></span>

          <span className="cm-select-all-copy">
            <strong>Select All Students</strong>
            <small>
              Select all {students.length} available students
            </small>
          </span>

        </label>

        <div className="cm-select-all-count">
          {selected.length} / {students.length}
        </div>

      </div>

      {/* =========================================
          CLASS-WISE STUDENT LIST
      ========================================= */}

      <div className="cm-classes-container">

        {Object.keys(grouped).length === 0 ? (

          <div className="cm-empty-state">
            <div className="cm-empty-icon">
              <i className="bi bi-people"></i>
            </div>

            <h3>No Students Found</h3>

            <p>
              Try changing your search keyword or class filter.
            </p>
          </div>

        ) : (

          Object.keys(grouped).map((cls) => {

            const classStudents = grouped[cls];

            const classSelected = classStudents.filter(
              (s) => selected.includes(s.id)
            ).length;

            const allClassSelected =
              classStudents.length > 0 &&
              classStudents.every((s) =>
                selected.includes(s.id)
              );

            return (
              <div key={cls} className="cm-class-card">

                {/* CLASS HEADER */}

                <div className="cm-class-card-header">

                  <label className="cm-check-label cm-class-check">
                    <input
                      type="checkbox"
                      checked={allClassSelected}
                      disabled={sending}
                      onChange={() => toggleClass(cls)}
                    />

                    <span className="cm-custom-checkbox"></span>
                  </label>

                  <div className="cm-class-symbol">
                    <i className="bi bi-mortarboard-fill"></i>
                  </div>

                  <div className="cm-class-details">
                    <h3>Class {cls}</h3>
                    <span>
                      {classStudents.length} students
                    </span>
                  </div>

                  <div className="cm-class-progress">
                    <strong>{classSelected}</strong>
                    <span>/ {classStudents.length} selected</span>
                  </div>

                </div>

                {/* STUDENT TABLE */}

                <div className="cm-student-table-wrapper">

                  <table className="cm-student-table">

                    <thead>
                      <tr>
                        <th className="cm-student-select-col">Select</th>
                        <th className="cm-student-roll-col">Roll No.</th>
                        <th>Student Name</th>
                      </tr>
                    </thead>

                    <tbody>

                      {classStudents.map((s) => {

                        const isSelected = selected.includes(s.id);

                        return (
                          <tr
                            key={s.id}
                            className={
                              isSelected ? "cm-student-row-selected" : ""
                            }
                          >

                            <td>
                              <label className="cm-check-label">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  disabled={sending}
                                  onChange={() => toggleSelect(s.id)}
                                />

                                <span className="cm-custom-checkbox"></span>
                              </label>
                            </td>

                            <td>
                              <span className="cm-roll-number">
                                {s.rollNo !== "" && s.rollNo != null
                                  ? s.rollNo
                                  : "—"}
                              </span>
                            </td>

                            <td>
                              <div className="cm-student-name">
                                <span className="cm-student-avatar">
                                  {s.Name
                                    ?.charAt(0)
                                    ?.toUpperCase()}
                                </span>

                                <span>{s.Name}</span>
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
          })

        )}

      </div>

      {/* =========================================
          SEND MESSAGE FOOTER
      ========================================= */}

      <div className="cm-send-footer">

        <div className="cm-send-summary">
          <div className="cm-send-summary-icon">
            <i className="bi bi-send-check-fill"></i>
          </div>

          <div>
            <strong>
              {selected.length} Recipient
              {selected.length !== 1 ? "s" : ""} Selected
            </strong>

            <span>
              {selected.length > 0
                ? "Your message is ready to be delivered."
                : "Select students to enable sending."}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="cm-send-btn"
          onClick={sendMessage}
          disabled={
            sending ||
            !message.trim() ||
            selected.length === 0
          }
        >
          {sending ? (
            <>
              <span className="cm-button-spinner"></span>
              Sending...
            </>
          ) : (
            <>
              <i className="bi bi-send-fill"></i>
              Send Message
            </>
          )}
        </button>

      </div>

    </div>
  );
};

export default CreateMessage;
