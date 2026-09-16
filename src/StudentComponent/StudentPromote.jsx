import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentPromote.css";

const StudentPromote = () => {
  const BASE_URL =
    "http://localhost/kkblossom/api.php/Adminapi/AdminStudentPromote";

  const [classes, setClasses] = useState([]);
  const [fromClass, setFromClass] = useState("");
  const [toClass, setToClass] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [checkAll, setCheckAll] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // =====================================================
  // LOAD CLASSES
  // =====================================================
  useEffect(() => {
    axios
      .get(`${BASE_URL}/getAllClassesDetails`)
      .then((res) => {
        setClasses(Array.isArray(res.data) ? res.data : []);

        if (res.data.length > 0) {
          setFromClass(res.data[0].Classname);
          setToClass(res.data[0].Classname);
        }
      })
      .catch((error) => {
        console.error("Error loading classes:", error);
      });
  }, []);

  // =====================================================
  // LOAD STUDENTS BY CLASS
  // =====================================================
  useEffect(() => {
    if (fromClass) {
      axios
        .get(`${BASE_URL}/getByClassJSON/${fromClass}`)
        .then((res) => {
          const data = Array.isArray(res.data) ? res.data : [];

          setStudents(data);

          const ids = data.map((student) => student.id);

          setSelectedIds(ids);
          setCheckAll(data.length > 0);
        })
        .catch((error) => {
          console.error("Error loading students:", error);

          setStudents([]);
          setSelectedIds([]);
          setCheckAll(false);
        });
    }
  }, [fromClass]);

  // =====================================================
  // CHECK ALL
  // =====================================================
  const handleCheckAll = () => {
    if (checkAll) {
      setSelectedIds([]);
      setCheckAll(false);
    } else {
      setSelectedIds(students.map((student) => student.id));
      setCheckAll(true);
    }
  };

  // =====================================================
  // SINGLE CHECKBOX
  // =====================================================
  const handleSingleCheck = (id) => {
    if (selectedIds.includes(id)) {
      const updatedIds = selectedIds.filter((i) => i !== id);

      setSelectedIds(updatedIds);
      setCheckAll(false);
    } else {
      const updatedIds = [...selectedIds, id];

      setSelectedIds(updatedIds);

      if (
        students.length > 0 &&
        updatedIds.length === students.length
      ) {
        setCheckAll(true);
      }
    }
  };

  // =====================================================
  // PROMOTE STUDENTS
  // =====================================================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedIds.length === 0) {
      setMessage({
        type: "error",
        text: "Please select at least one student.",
      });
      return;
    }

    if (!toClass) {
      setMessage({
        type: "error",
        text: "Please select the destination class.",
      });
      return;
    }

    const formData = new FormData();

    formData.append("toClass", toClass);

    selectedIds.forEach((id) => {
      formData.append("ids[]", id);
    });

    axios
      .post(`${BASE_URL}/updateClass`, formData)
      .then((res) => {
        setMessage({
          type: "success",
          text: "Student promotion completed successfully.",
        });

        return axios.get(
          `${BASE_URL}/getByClassJSON/${fromClass}`
        );
      })
      .then((res) => {
        if (res) {
          const data = Array.isArray(res.data)
            ? res.data
            : [];

          setStudents(data);

          const ids = data.map((student) => student.id);

          setSelectedIds(ids);
          setCheckAll(data.length > 0);
        }
      })
      .catch((error) => {
        console.error("Promotion Error:", error);

        setMessage({
          type: "error",
          text: "Failed to promote students.",
        });
      });
  };

  return (
    <div className="student-promote-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}
      <div className="student-promote-header">

        <div className="student-promote-header-left">

          <div className="student-promote-header-icon">
            <i className="bi bi-mortarboard-fill"></i>
          </div>

          <div>
            <h1>Student Promotion</h1>

            <p>
              Promote students from their current class to
              the next academic class.
            </p>
          </div>

        </div>

        <div className="student-promote-header-badge">
          <i className="bi bi-arrow-up-right-circle-fill"></i>
          Academic Promotion
        </div>

      </div>


      {/* =====================================================
          MESSAGE
      ===================================================== */}
      {message.type && (
        <div
          className={`student-promote-message ${
            message.type === "success"
              ? "student-promote-success"
              : "student-promote-error"
          }`}
        >

          <div className="student-promote-message-icon">
            <i
              className={
                message.type === "success"
                  ? "bi bi-check-circle-fill"
                  : "bi bi-exclamation-circle-fill"
              }
            ></i>
          </div>

          <div className="student-promote-message-content">
            <strong>
              {message.type === "success"
                ? "Promotion Successful"
                : "Action Required"}
            </strong>

            <span>{message.text}</span>
          </div>

          <button
            type="button"
            className="student-promote-message-close"
            onClick={() =>
              setMessage({
                type: "",
                text: "",
              })
            }
          >
            <i className="bi bi-x-lg"></i>
          </button>

        </div>
      )}


      <form onSubmit={handleSubmit}>

        {/* =====================================================
            PROMOTION DETAILS
        ===================================================== */}
        <div className="student-promote-selection-card">

          <div className="student-promote-card-header">

            <div className="student-promote-card-title">

              <div className="student-promote-card-title-icon">
                <i className="bi bi-arrow-left-right"></i>
              </div>

              <div>
                <h2>Promotion Details</h2>

                <p>
                  Select the current class and destination
                  class for student promotion.
                </p>
              </div>

            </div>

            <div className="student-promote-step-badge">
              STEP 01
            </div>

          </div>


          <div className="student-promote-selection-grid">

            {/* FROM CLASS */}
            <div className="student-promote-field">

              <label>
                <i className="bi bi-building"></i>
                Current Class
              </label>

              <div className="student-promote-select-wrapper">

                <i className="bi bi-mortarboard"></i>

                <select
                  value={fromClass}
                  onChange={(e) => {
                    setFromClass(e.target.value);

                    setMessage({
                      type: "",
                      text: "",
                    });
                  }}
                >
                  <option value="">
                    Select Current Class
                  </option>

                  {classes.map((cls) => (
                    <option
                      key={cls.id}
                      value={cls.Classname}
                    >
                      {cls.Classname}
                    </option>
                  ))}
                </select>

                <i className="bi bi-chevron-down student-promote-select-arrow"></i>

              </div>

            </div>


            {/* TRANSFER ARROW */}
            <div className="student-promote-transfer">

              <div className="student-promote-transfer-line"></div>

              <div className="student-promote-transfer-icon">
                <i className="bi bi-arrow-right"></i>
              </div>

              <div className="student-promote-transfer-line"></div>

            </div>


            {/* TO CLASS */}
            <div className="student-promote-field">

              <label>
                <i className="bi bi-mortarboard-fill"></i>
                Promote To
              </label>

              <div className="student-promote-select-wrapper">

                <i className="bi bi-graduation-cap"></i>

                <select
                  value={toClass}
                  onChange={(e) =>
                    setToClass(e.target.value)
                  }
                >
                  <option value="">
                    Select Destination Class
                  </option>

                  {classes.map((cls) => (
                    <option
                      key={cls.id}
                      value={cls.Classname}
                    >
                      {cls.Classname}
                    </option>
                  ))}

                  <option value="passed_out">
                    Passed Out
                  </option>
                </select>

                <i className="bi bi-chevron-down student-promote-select-arrow"></i>

              </div>

            </div>

          </div>


          {/* PROMOTION SUMMARY */}
          <div className="student-promote-flow-summary">

            <div className="student-promote-flow-item">

              <span>FROM</span>

              <strong>
                {fromClass || "Not selected"}
              </strong>

            </div>

            <div className="student-promote-flow-arrow">
              <i className="bi bi-arrow-right"></i>
            </div>

            <div className="student-promote-flow-item">

              <span>TO</span>

              <strong>
                {toClass || "Not selected"}
              </strong>

            </div>

          </div>

        </div>


        {/* =====================================================
            STUDENT TABLE
        ===================================================== */}
        <div className="student-promote-table-card">

          {/* TABLE HEADER */}
          <div className="student-promote-table-header">

            <div className="student-promote-table-title">

              <div className="student-promote-table-title-icon">
                <i className="bi bi-people-fill"></i>
              </div>

              <div>
                <h2>Students</h2>

                <p>
                  Students available in{" "}
                  <strong>
                    {fromClass || "selected class"}
                  </strong>
                </p>
              </div>

            </div>


            <div className="student-promote-stat">

              <div className="student-promote-stat-number">
                {students.length}
              </div>

              <div>
                <span>Total Students</span>
                <small>
                  {selectedIds.length} selected
                </small>
              </div>

            </div>

          </div>


          {/* SELECTION BAR */}
          <div className="student-promote-selection-bar">

            <div className="student-promote-selection-status">

              <div className="student-promote-status-dot"></div>

              <span>
                {selectedIds.length} of{" "}
                {students.length} students selected
              </span>

            </div>

            <button
              type="button"
              className="student-promote-select-all-btn"
              onClick={handleCheckAll}
              disabled={students.length === 0}
            >
              <i
                className={
                  checkAll
                    ? "bi bi-check2-square"
                    : "bi bi-square"
                }
              ></i>

              {checkAll
                ? "Unselect All"
                : "Select All"}
            </button>

          </div>


          {/* TABLE */}
          <div className="student-promote-table-wrapper">

            <table className="student-promote-table">

              <thead className="student-promote-table-heading">

                <tr>

                  <th className="student-promote-checkbox-column">

                    <label className="student-promote-table-check">

                      <input
                        type="checkbox"
                        checked={
                          checkAll &&
                          students.length > 0
                        }
                        onChange={handleCheckAll}
                      />

                      <span>
                        <i className="bi bi-check"></i>
                      </span>

                    </label>

                  </th>

                  <th>ID</th>

                  <th>STUDENT</th>

                  <th>CLASS</th>

                  <th>ROLL NO.</th>

                  <th>ADMISSION NO.</th>

                </tr>

              </thead>


              <tbody>

                {students.length > 0 ? (

                  students.map((stu, index) => {

                    const isSelected =
                      selectedIds.includes(stu.id);

                    return (
                      <tr
                        key={stu.id}
                        className={
                          isSelected
                            ? "student-promote-row-selected"
                            : ""
                        }
                      >

                        {/* CHECKBOX */}
                        <td className="student-promote-checkbox-column">

                          <label className="student-promote-table-check">

                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() =>
                                handleSingleCheck(stu.id)
                              }
                            />

                            <span>
                              <i className="bi bi-check"></i>
                            </span>

                          </label>

                        </td>


                        {/* ID */}
                        <td>

                          <span className="student-promote-id">
                            #{stu.id}
                          </span>

                        </td>


                        {/* STUDENT */}
                        <td>

                          <div className="student-promote-name">

                            <div className="student-promote-avatar">
                              {stu.Name
                                ?.charAt(0)
                                ?.toUpperCase() || "S"}
                            </div>

                            <div className="student-promote-name-info">

                              <strong>
                                {stu.Name}
                              </strong>

                              <span>
                                Student
                              </span>

                            </div>

                          </div>

                        </td>


                        {/* CLASS */}
                        <td>

                          <span className="student-promote-class-badge">

                            <i className="bi bi-mortarboard-fill"></i>

                            {stu.Class}

                          </span>

                        </td>


                        {/* ROLL */}
                        <td>

                          <span className="student-promote-number">
                            {stu.Rollno || "—"}
                          </span>

                        </td>


                        {/* ADMISSION */}
                        <td>

                          <span className="student-promote-admission">
                            {stu.Admno || "—"}
                          </span>

                        </td>

                      </tr>
                    );
                  })

                ) : (

                  <tr>

                    <td
                      colSpan="6"
                      className="student-promote-empty"
                    >

                      <div className="student-promote-empty-icon">
                        <i className="bi bi-people"></i>
                      </div>

                      <strong>
                        No Students Found
                      </strong>

                      <span>
                        There are no students available
                        in this class.
                      </span>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>


          {/* TABLE FOOTER */}
          <div className="student-promote-table-footer">

            <div className="student-promote-footer-info">

              <div className="student-promote-footer-icon">
                <i className="bi bi-info-circle-fill"></i>
              </div>

              <div>

                <strong>
                  {selectedIds.length > 0
                    ? `${selectedIds.length} student${
                        selectedIds.length !== 1
                          ? "s"
                          : ""
                      } selected`
                    : "No students selected"}
                </strong>

                <span>
                  {toClass
                    ? `Ready to promote to ${toClass}`
                    : "Select a destination class"}
                </span>

              </div>

            </div>


            <button
              className="student-promote-submit-btn"
              type="submit"
              disabled={selectedIds.length === 0}
            >

              <i className="bi bi-arrow-up-circle-fill"></i>

              <span>Promote Students</span>

              <i className="bi bi-arrow-right"></i>

            </button>

          </div>

        </div>

      </form>

    </div>
  );
};

export default StudentPromote;