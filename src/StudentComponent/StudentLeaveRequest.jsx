import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import "./StudentLeaveRequest.css";

const StudentLeaveRequest = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const API_BASE =
    "http://localhost/kkblossom/api.php/Adminapi/StudentLeaveRequest/";

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const res = await axios.get(
        API_BASE + "loadLeaveRequests"
      );

      if (res.data.status) {
        setLeaveRequests(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const approveRequest = async (id) => {

    const confirmApprove = window.confirm(
      "Are you sure you want to approve this request?"
    );

    if (!confirmApprove) return;

    setLoading(true);

    try {

      const res = await axios.get(
        API_BASE + "approveLeaveRequest/" + id
      );

      if (res.data.status) {

        alert("Approved Successfully");

        fetchLeaveRequests();

      } else {

        alert("Failed to approve");

      }

    } catch (error) {

      console.error(error);
      alert("Something went wrong");

    }

    setLoading(false);
  };

  const filteredData = useMemo(() => {

    return leaveRequests.filter((item) =>
      item.student_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      item.student_class
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      item.student_roll_no
        ?.toString()
        .includes(search)
    );

  }, [leaveRequests, search]);

  const columns = [

    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      width: "90px",
    },

    {
      name: "Student ID",
      selector: (row) => row.student_id,
      sortable: true,
    },

    {
      name: "Name",
      selector: (row) => row.student_name,
      sortable: true,
    },

    {
      name: "Class",
      selector: (row) => row.student_class,
      sortable: true,
    },

    {
      name: "Roll No",
      selector: (row) => row.student_roll_no,
      sortable: true,
    },

    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
    },

    {
      name: "Reason",
      selector: (row) => row.reason,
      wrap: true,
    },

    {
      name: "Status",
      cell: (row) => (
        <span
          className={
            Number(row.status) === 1
              ? "approved-status"
              : "unapproved-status"
          }
        >
          {Number(row.status) === 1
            ? "Approved"
            : "Unapproved"}
        </span>
      ),
    },

    {
      name: "Actions",
      cell: (row) => (

        Number(row.status) !== 1 ? (

          <button
            className="approve-btn"
            onClick={() =>
              approveRequest(row.id)
            }
            disabled={loading}
          >
            ✓
          </button>

        ) : (

          <span className="approved-text">
            Approved
          </span>

        )

      ),
    },
  ];

 return (
  <div className="leave-container">

    {/* =====================================================
        PAGE HEADER
    ===================================================== */}

    <div className="leave-page-header">

      <div className="leave-header-left">

        <div className="leave-header-icon">
          <i className="bi bi-calendar2-check-fill"></i>
        </div>

        <div className="leave-header-title">
          <h2>Student Leave Requests</h2>
          <p>
            Review and manage student leave applications
          </p>
        </div>

      </div>
       <div className="leave-search-wrapper">

        <i className="bi bi-search leave-search-icon"></i>

        <input
          type="text"
          placeholder="Search student, class or roll no..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

    </div>

    {/* =====================================================
        SEARCH BAR
    ===================================================== */}

    
    {/* =====================================================
        TABLE
    ===================================================== */}

    <div className="leave-table-card">

      {loading && (
        <div className="leave-loading">
          <span className="leave-spinner"></span>
          Processing request...
        </div>
      )}

      {filteredData.length > 0 ? (

        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          striped
          responsive
          persistTableHead
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 25, 50]}
        />

      ) : (

        <div className="leave-empty">

          <div className="leave-empty-icon">
            <i className="bi bi-calendar-x"></i>
          </div>

          <h3>No Leave Requests Found</h3>

          <p>
            {search
              ? "No leave request matches your search."
              : "There are currently no student leave requests."}
          </p>

        </div>

      )}

    </div>

  </div>
);
};

export default StudentLeaveRequest;