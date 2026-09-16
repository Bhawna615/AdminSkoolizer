import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./AddPassengers.css";

const AddPassengers = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Station ID from URL or navigation state
  const stationId = id || location.state?.stationId;

  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  /* =====================================================
     FETCH STUDENTS
  ===================================================== */
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(
          "http://localhost/kkblossom/api.php/Adminapi/AdminTransport/getStudents"
        );

        if (res.data && Array.isArray(res.data.data)) {
          setStudents(res.data.data);
        } else {
          setStudents([]);
        }
      } catch (err) {
        console.error("Error fetching students:", err);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  /* =====================================================
     SELECT / UNSELECT STUDENT
  ===================================================== */
  const handleCheck = (studentId) => {
    setSelected((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  /* =====================================================
     SELECT ALL
  ===================================================== */
  const filteredStudents = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return students;
    }

    return students.filter((student) => {
      const rollNo = String(student.Rollno || "").toLowerCase();
      const name = String(student.Name || "").toLowerCase();
      const className = String(student.Class || "").toLowerCase();

      return (
        rollNo.includes(searchValue) ||
        name.includes(searchValue) ||
        className.includes(searchValue)
      );
    });
  }, [students, search]);

  const allFilteredSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((student) =>
      selected.includes(student.id)
    );

  const handleSelectAll = () => {
    if (allFilteredSelected) {
      const filteredIds = filteredStudents.map(
        (student) => student.id
      );

      setSelected((prev) =>
        prev.filter((id) => !filteredIds.includes(id))
      );
    } else {
      const filteredIds = filteredStudents.map(
        (student) => student.id
      );

      setSelected((prev) => [
        ...new Set([...prev, ...filteredIds]),
      ]);
    }
  };

  /* =====================================================
     SUBMIT
  ===================================================== */
  const submit = async () => {
    if (!stationId) {
      alert("Station ID is missing from the URL");
      return;
    }

    if (selected.length === 0) {
      alert("Please select at least one student");
      return;
    }

    setSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost/kkblossom/api.php/Adminapi/AdminTransport/addPassengers",
        {
          station_id: stationId,
          student_ids: selected,
        }
      );

      if (response.data.status) {
        alert("Passengers added successfully");
        navigate(-1);
      } else {
        alert(
          "Error: " +
            (response.data.message || "Unable to add passengers")
        );
      }
    } catch (error) {
      console.error("Submission error:", error);

      alert(
        "Failed to add passengers. Check connection to backend."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =====================================================
     BACK
  ===================================================== */
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="add-passengers-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}
      <div className="passenger-page-header">

        <div className="passenger-header-left">

          <button
            className="passenger-back-btn"
            onClick={handleBack}
            title="Go Back"
          >
            <i className="las la-arrow-left"></i>
          </button>

          <div className="passenger-header-icon">
            <i className="las la-user-friends"></i>
          </div>

          <div>
            <span className="passenger-eyebrow">
              TRANSPORT MANAGEMENT
            </span>

            <h1>Add Passengers</h1>

            <p>
              Select students who will use this transport
              station.
            </p>
          </div>

        </div>

        <button
          className="passenger-submit-header"
          onClick={submit}
          disabled={submitting || selected.length === 0}
        >
          {submitting ? (
            <>
              <i className="las la-spinner passenger-spin"></i>
              Adding...
            </>
          ) : (
            <>
              <i className="las la-user-plus"></i>
              Add Selected
            </>
          )}
        </button>

      </div>

      {/* =================================================
          STATION INFO
      ================================================= */}
      <div className="passenger-station-card">

        <div className="passenger-station-icon">
          <i className="las la-map-marker-alt"></i>
        </div>

        <div className="passenger-station-info">
          <span>SELECTING PASSENGERS FOR</span>
          <h2>Transport Station</h2>
          <p>
            Station ID:
            <strong> #{stationId || "Not Available"}</strong>
          </p>
        </div>

        <div className="passenger-selected-summary">

          <div className="passenger-selected-icon">
            <i className="las la-check"></i>
          </div>

          <div>
            <span>SELECTED</span>
            <strong>{selected.length}</strong>
            <small>
              {selected.length === 1
                ? "Student"
                : "Students"}
            </small>
          </div>

        </div>

      </div>

      {/* =================================================
          STAT CARDS
      ================================================= */}
      <div className="passenger-stats">

        <div className="passenger-stat">

          <div className="passenger-stat-icon purple">
            <i className="las la-users"></i>
          </div>

          <div>
            <span>Total Students</span>
            <strong>{students.length}</strong>
          </div>

        </div>

        <div className="passenger-stat">

          <div className="passenger-stat-icon green">
            <i className="las la-user-check"></i>
          </div>

          <div>
            <span>Selected</span>
            <strong>{selected.length}</strong>
          </div>

        </div>

        <div className="passenger-stat">

          <div className="passenger-stat-icon blue">
            <i className="las la-list"></i>
          </div>

          <div>
            <span>Showing</span>
            <strong>{filteredStudents.length}</strong>
          </div>

        </div>

      </div>

      {/* =================================================
          MAIN CARD
      ================================================= */}
      <div className="passenger-main-card">

        {/* CARD HEADER */}
        <div className="passenger-card-header">

          <div>

            <span className="passenger-card-eyebrow">
              STUDENT DIRECTORY
            </span>

            <h2>Select Students</h2>

            <p>
              Choose one or more students to assign them
              to this transport station.
            </p>

          </div>

          <div className="passenger-count-badge">
            <i className="las la-users"></i>
            {students.length} Students
          </div>

        </div>

        {/* =================================================
            TOOLBAR
        ================================================= */}
        <div className="passenger-toolbar">

          <label className="passenger-select-all">

            <input
              type="checkbox"
              checked={allFilteredSelected}
              onChange={handleSelectAll}
              disabled={filteredStudents.length === 0}
            />

            <span className="custom-checkbox">
              <i className="las la-check"></i>
            </span>

            <span>
              Select All
            </span>

          </label>

          <div className="passenger-search">

            <i className="las la-search"></i>

            <input
              type="text"
              placeholder="Search by name, roll no or class..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="passenger-search-clear"
              >
                <i className="las la-times"></i>
              </button>
            )}

          </div>

        </div>

        {/* =================================================
            CONTENT
        ================================================= */}
        {loading ? (

          <div className="passenger-loading">

            <div className="passenger-loader-icon">
              <i className="las la-spinner"></i>
            </div>

            <h3>Loading Students</h3>

            <p>
              Please wait while we fetch the student list.
            </p>

          </div>

        ) : filteredStudents.length === 0 ? (

          <div className="passenger-empty">

            <div className="passenger-empty-icon">
              <i className="las la-user-slash"></i>
            </div>

            <h3>
              No Students Found
            </h3>

            <p>
              {search
                ? "No students match your search."
                : "There are no students available to add."}
            </p>

            {search && (
              <button
                className="passenger-reset-search"
                onClick={() => setSearch("")}
              >
                <i className="las la-redo"></i>
                Clear Search
              </button>
            )}

          </div>

        ) : (

          <div className="passenger-table-wrapper">

            <table className="passenger-table">

              <thead>

                <tr>

                  <th className="passenger-check-column">
                    SELECT
                  </th>

                  <th>
                    ROLL NO
                  </th>

                  <th>
                    STUDENT
                  </th>

                  <th>
                    CLASS
                  </th>

                  <th>
                    STATUS
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredStudents.map((student, index) => {

                  const isSelected =
                    selected.includes(student.id);

                  return (
                    <tr
                      key={student.id}
                      className={
                        isSelected
                          ? "passenger-row-selected"
                          : ""
                      }
                      onClick={() =>
                        handleCheck(student.id)
                      }
                    >

                      {/* CHECKBOX */}
                      <td
                        className="passenger-checkbox-cell"
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                      >

                        <label className="student-checkbox">

                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() =>
                              handleCheck(
                                student.id
                              )
                            }
                          />

                          <span className="custom-checkbox">
                            <i className="las la-check"></i>
                          </span>

                        </label>

                      </td>

                      {/* ROLL NO */}
                      <td>

                        <span className="roll-number">
                          #{student.Rollno || "-"}
                        </span>

                      </td>

                      {/* STUDENT */}
                      <td>

                        <div className="student-info">

                          <div className="student-avatar">
                            {student.Name
                              ? student.Name
                                  .charAt(0)
                                  .toUpperCase()
                              : "S"}
                          </div>

                          <div>

                            <strong>
                              {student.Name ||
                                "Unknown Student"}
                            </strong>

                            <span>
                              Student ID #{student.id}
                            </span>

                          </div>

                        </div>

                      </td>

                      {/* CLASS */}
                      <td>

                        <span className="class-badge">
                          <i className="las la-graduation-cap"></i>
                          {student.Class ||
                            "Not Assigned"}
                        </span>

                      </td>

                      {/* STATUS */}
                      <td>

                        {isSelected ? (
                          <span className="student-status selected">
                            <span></span>
                            Selected
                          </span>
                        ) : (
                          <span className="student-status">
                            <span></span>
                            Available
                          </span>
                        )}

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        )}

        {/* =================================================
            FOOTER
        ================================================= */}
        {!loading && filteredStudents.length > 0 && (
          <div className="passenger-card-footer">

            <div className="passenger-footer-info">

              <i className="las la-info-circle"></i>

              <span>
                <strong>{selected.length}</strong>{" "}
                {selected.length === 1
                  ? "student"
                  : "students"}{" "}
                selected
              </span>

            </div>

            <div className="passenger-footer-actions">

              <button
                className="passenger-cancel-btn"
                onClick={handleBack}
              >
                <i className="las la-times"></i>
                Cancel
              </button>

              <button
                className="passenger-add-btn"
                onClick={submit}
                disabled={
                  submitting ||
                  selected.length === 0
                }
              >
                {submitting ? (
                  <>
                    <i className="las la-spinner passenger-spin"></i>
                    Adding Passengers...
                  </>
                ) : (
                  <>
                    <i className="las la-user-plus"></i>
                    Add {selected.length || ""}{" "}
                    {selected.length === 1
                      ? "Student"
                      : "Students"}
                  </>
                )}
              </button>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default AddPassengers;