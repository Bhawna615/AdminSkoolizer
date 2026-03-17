import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DisplayLeaveRequests.css";

const BASE_URL = "http://localhost/kkblossom/api.php/Adminapi/AdminStudent/";

const DisplayLeaveRequests = () => {

  const [leaveRequests, setLeaveRequests] = useState([]);
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "displayLeaveRequests");

      if (res.data.status) {
        setLeaveRequests(res.data.data);
      }

    } catch (err) {
      console.log(err);
    }
  };

  const approveLeave = async (id) => {

    const confirmBox = window.confirm(
      "Are you sure you want to approve this request?"
    );

    if (!confirmBox) return;

    try {

      const res = await axios.get(
        BASE_URL + "approveLeaveRequest/" + id
      );

      if (res.data.status) {
        setMessage("Approved Successfully");
      } else {
        setMessage("Failed to approve request");
      }

      fetchLeaveRequests();

      setTimeout(() => {
        setMessage("");
      }, 3000);

    } catch (error) {
      setMessage("Server error");
    }
  };

  /* SEARCH */

  const filteredData = leaveRequests.filter((item) =>
    item.student_name.toLowerCase().includes(search.toLowerCase()) ||
    item.student_class.toLowerCase().includes(search.toLowerCase()) ||
    item.reason.toLowerCase().includes(search.toLowerCase())
  );

  /* PAGINATION */

  const indexOfLast = currentPage * entries;
  const indexOfFirst = indexOfLast - entries;

  const currentData = filteredData.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredData.length / entries);

  const changePage = (num) => {
    setCurrentPage(num);
  };

  /* SMART PAGINATION */

  const renderPagination = () => {

    const pages = [];
    const maxVisible = 5;

    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(start + maxVisible - 1, totalPages);

    if (end - start < maxVisible - 1) {
      start = Math.max(end - maxVisible + 1, 1);
    }

    if (start > 1) {
      pages.push(
        <button key={1} onClick={() => changePage(1)}>1</button>
      );

      if (start > 2) pages.push(<span key="dots1">...</span>);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          className={currentPage === i ? "active" : ""}
          onClick={() => changePage(i)}
        >
          {i}
        </button>
      );
    }

    if (end < totalPages) {

      if (end < totalPages - 1)
        pages.push(<span key="dots2">...</span>);

      pages.push(
        <button
          key={totalPages}
          onClick={() => changePage(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (

    <div className="leave-container">

      {message && (
        <div className="success-bar">
          {message}
        </div>
      )}

      {/* CONTROLS */}

      <div className="table-controls">

        <div>
          Show
          <select
            value={entries}
            onChange={(e) => {
              setEntries(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          entries
        </div>

        <div>
          Search:
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

      </div>

      {/* TABLE */}

      <table className="leave-table">

        <thead>
          <tr>
            <th>ID</th>
            <th>STUDENT ID</th>
            <th>NAME</th>
            <th>CLASS</th>
            <th>ROLL NO</th>
            <th>DATE</th>
            <th>REASON</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>

        <tbody>

          {currentData.map((req) => (

            <tr key={req.id}>

              <td>{req.id}</td>
              <td>{req.student_id}</td>
              <td>{req.student_name}</td>
              <td>{req.student_class}</td>
              <td>{req.student_roll_no}</td>
              <td>{req.date}</td>
              <td>{req.reason}</td>

              <td>
                {req.status ? (
                  <span className="approved">Approved</span>
                ) : (
                  <span className="unapproved">Unapproved</span>
                )}
              </td>

              <td>
                {!req.status && (
                  <button
                    className="approve-btn"
                    onClick={() => approveLeave(req.id)}
                  >
                    ✔
                  </button>
                )}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

      {/* INFO */}

      <div className="pagination-info">

        Showing {indexOfFirst + 1} to{" "}
        {Math.min(indexOfLast, filteredData.length)} of{" "}
        {filteredData.length} entries

      </div>

      {/* PAGINATION */}

      <div className="pagination">

        <button
          disabled={currentPage === 1}
          onClick={() => changePage(currentPage - 1)}
        >
          Previous
        </button>

        {renderPagination()}

        <button
          disabled={currentPage === totalPages}
          onClick={() => changePage(currentPage + 1)}
        >
          Next
        </button>

      </div>

    </div>
  );
};

export default DisplayLeaveRequests;