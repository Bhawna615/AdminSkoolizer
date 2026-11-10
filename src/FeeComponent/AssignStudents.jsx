
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import "./AssignStudents.css";

const API =
  "http://localhost/kkblossom/api.php/AdminApi/AdminPanelFee/";

export default function AssignStudents() {
  const { id } = useParams();

  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  const [showMsg, setShowMsg] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState(false);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API + "getStudents");
      setStudents(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching students:", error);

      setMessageSuccess(false);
      setMessageText("Unable to load students. Please try again.");
      setShowMsg(true);
    } finally {
      setLoading(false);
    }
  };

  const toggle = (studentId) => {
    if (selected.includes(studentId)) {
      setSelected(selected.filter((sid) => sid !== studentId));
    } else {
      setSelected([...selected, studentId]);
    }
  };

  const filteredStudents = students.filter((student) => {
    const searchText = search.toLowerCase();

    return (
      String(student.Name || "").toLowerCase().includes(searchText) ||
      String(student.Rollno || "").toLowerCase().includes(searchText) ||
      String(student.Class || "").toLowerCase().includes(searchText)
    );
  });

  const allFilteredSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((student) =>
      selected.includes(student.id)
    );

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      const filteredIds = filteredStudents.map((student) => student.id);

      setSelected(
        selected.filter((studentId) => !filteredIds.includes(studentId))
      );
    } else {
      const newSelected = [...selected];

      filteredStudents.forEach((student) => {
        if (!newSelected.includes(student.id)) {
          newSelected.push(student.id);
        }
      });

      setSelected(newSelected);
    }
  };

  const submit = async () => {
    if (submitting || selected.length === 0) return;

    try {
      setSubmitting(true);

      console.log("Selected:", selected);
      console.log("Discount ID:", id);

      const res = await axios.post(API + "assignDiscount", {
        student_ids: selected,
        discount_id: id,
      });

      if (res.data?.status === false) {
        setMessageSuccess(false);
        setMessageText(
          res.data.message || "Unable to assign discount to students."
        );
      } else {
        setMessageSuccess(true);
        setMessageText("Discount assigned successfully to selected students!");
      }

      setShowMsg(true);
    } catch (err) {
      console.error("FULL ERROR:", err.response || err);

      setMessageSuccess(false);
      setMessageText(
        err.response?.data?.message ||
        "Something went wrong while assigning the discount."
      );

      setShowMsg(true);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      name: (
        <div className="assign-select-heading">
          <input
            type="checkbox"
            checked={allFilteredSelected}
            onChange={toggleSelectAll}
            disabled={filteredStudents.length === 0}
          />
          <span>SELECT</span>
        </div>
      ),
      cell: (row) => (
        <input
          type="checkbox"
          className="assign-student-checkbox"
          checked={selected.includes(row.id)}
          onChange={() => toggle(row.id)}
        />
      ),
      width: "115px",
      sortable: false,
    },
    {
      name: "ROLL NUMBER",
      selector: (row) => row.Rollno,
      sortable: true,
      width: "160px",
      cell: (row) => (
        <span className="assign-roll-number">
          {row.Rollno || "N/A"}
        </span>
      ),
    },
    {
      name: "STUDENT NAME",
      selector: (row) => row.Name,
      sortable: true,
      grow: 2,
      cell: (row) => (
        <div className="assign-student-name-cell">
          <div className="assign-student-avatar">
            {row.Name?.charAt(0)?.toUpperCase() || "S"}
          </div>

          <span>{row.Name || "N/A"}</span>
        </div>
      ),
    },
    {
      name: "CLASS",
      selector: (row) => row.Class,
      sortable: true,
      width: "160px",
      cell: (row) => (
        <span className="assign-class-badge">
          {row.Class || "N/A"}
        </span>
      ),
    },
  ];

  const customStyles = {
    table: {
      style: {
        backgroundColor: "#ffffff",
      },
    },
    headRow: {
      style: {
        minHeight: "54px",
        backgroundColor: "#faf9fd",
        borderBottom: "1px solid #eeecf4",
      },
    },
    headCells: {
      style: {
        color: "#89849a",
        fontSize: "10px",
        fontWeight: "750",
        letterSpacing: "0.7px",
        paddingLeft: "20px",
        paddingRight: "20px",
      },
    },
    rows: {
      style: {
        minHeight: "65px",
        color: "#514d62",
        fontSize: "12px",
        borderBottom: "1px solid #f0eff5",
        transition: "background 0.2s ease",
      },
      highlightOnHoverStyle: {
        backgroundColor: "#faf9ff",
        outline: "none",
      },
    },
    cells: {
      style: {
        paddingLeft: "20px",
        paddingRight: "20px",
      },
    },
    pagination: {
      style: {
        minHeight: "56px",
        borderTop: "1px solid #efedf5",
        color: "#858095",
        fontSize: "11px",
      },
    },
  };

  return (
    <div className="assign-students-page">

      {/* PAGE HEADER */}
      <div className="assign-students-header">
        <div>
          <span className="assign-eyebrow">
            FEE MANAGEMENT
          </span>

          <h1>Assign Students</h1>

          <p>
            Select students who should receive this fee discount.
          </p>
        </div>

        <div className="assign-discount-reference">
          <span>DISCOUNT REFERENCE</span>
          <strong>#{id}</strong>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="assign-summary-grid">

        <div className="assign-summary-card">
          <div className="assign-summary-icon total">
            <span>♙</span>
          </div>

          <div>
            <span>Total Students</span>
            <h2>{students.length}</h2>
            <p>Available student records</p>
          </div>
        </div>

        <div className="assign-summary-card selected-summary">
          <div className="assign-summary-icon selected">
            <span>✓</span>
          </div>

          <div>
            <span>Selected Students</span>
            <h2>{selected.length}</h2>
            <p>Students selected for discount</p>
          </div>
        </div>

        <div className="assign-summary-card">
          <div className="assign-summary-icon available">
            <span>+</span>
          </div>

          <div>
            <span>Remaining Students</span>
            <h2>{Math.max(students.length - selected.length, 0)}</h2>
            <p>Not yet selected</p>
          </div>
        </div>

      </div>

      {/* MAIN TABLE CARD */}
      <div className="assign-table-card">

        {/* TABLE HEADER */}
        <div className="assign-table-header">

          <div className="assign-table-title">
            <div className="assign-table-title-icon">
              ♙
            </div>

            <div>
              <h2>Student Directory</h2>
              <p>
                Select one or more students from the list below.
              </p>
            </div>
          </div>

          {/* SEARCH */}
          <div className="assign-search">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="assign-search-icon"
            >
              <circle
                cx="10.8"
                cy="10.8"
                r="6.8"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M16 16L21 21"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>

            <input
              type="text"
              placeholder="Search name, roll no or class..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="assign-clear-search"
              >
                ×
              </button>
            )}
          </div>

        </div>

        {/* SELECTED INFORMATION */}
        <div className="assign-selection-bar">
          <div className="assign-selection-info">
            <span className="assign-selection-check">✓</span>

            <span>
              <strong>{selected.length}</strong> students selected
            </span>
          </div>

          <button
            type="button"
            className="assign-clear-selection"
            onClick={() => setSelected([])}
            disabled={selected.length === 0 || submitting}
          >
            Clear Selection
          </button>
        </div>

        {/* DATA TABLE */}
        <div className="assign-datatable-wrapper">

          {loading ? (
            <div className="assign-table-loading">
              <div className="assign-small-spinner"></div>
              <p>Loading student records...</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredStudents}
              customStyles={customStyles}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 25, 50]}
              highlightOnHover
              striped={false}
              responsive
              persistTableHead
              noDataComponent={
                <div className="assign-empty-state">
                  <div className="assign-empty-icon">
                    ♙
                  </div>

                  <h3>
                    {search
                      ? "No Students Found"
                      : "No Student Records"}
                  </h3>

                  <p>
                    {search
                      ? "Try another name, roll number or class."
                      : "There are currently no students available to assign."}
                  </p>
                </div>
              }
            />
          )}

        </div>

        {/* TABLE FOOTER */}
        <div className="assign-table-footer">
          <span>
            Showing <strong>{filteredStudents.length}</strong> matching records
          </span>

          <span>
            Selected: <strong>{selected.length}</strong>
          </span>
        </div>

      </div>

      {/* BOTTOM ACTION AREA */}
      <div className="assign-bottom-actions">

        <div className="assign-bottom-note">
          <span>i</span>
          <p>
            Selected students will receive the discount associated
            with reference <strong>#{id}</strong>.
          </p>
        </div>

        <button
          type="button"
          className="assign-submit-btn"
          onClick={submit}
          disabled={submitting || selected.length === 0}
        >
          {submitting ? (
            <>
              <span className="assign-button-spinner"></span>
              Assigning...
            </>
          ) : (
            <>
              <span>✓</span>
              Assign to {selected.length} Students
            </>
          )}
        </button>

      </div>

      {/* MESSAGE OVERLAY */}
      {showMsg && (
        <div className="assign-message-overlay">

          <div className="assign-message-modal">

            <div
              className={`assign-message-icon ${
                messageSuccess ? "success" : "error"
              }`}
            >
              {messageSuccess ? "✓" : "!"}
            </div>

            <h2>
              {messageSuccess
                ? "Assignment Successful!"
                : "Assignment Failed"}
            </h2>

            <p>{messageText}</p>

            <button
              type="button"
              className="assign-message-btn"
              onClick={() => setShowMsg(false)}
            >
              Okay
            </button>

          </div>

        </div>
      )}

      {/* LOADING OVERLAY */}
      {submitting && (
        <div className="assign-loading-overlay">

          <div className="assign-loader-ring">
            <span>✓</span>
          </div>

          <h3>Assigning Discount</h3>

          <p>
            Please wait while we update the selected student records...
          </p>

          <div className="assign-loader-progress">
            <span></span>
          </div>

        </div>
      )}

    </div>
  );
}
