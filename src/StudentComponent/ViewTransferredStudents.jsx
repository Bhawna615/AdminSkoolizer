import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaPen,
  FaSearch,
  FaUsers,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";
import "./ViewTransferredStudents.css";

const BASE_URL =
  "http://localhost/kkblossom/api.php/Adminapi/AdminStudent/";

const ViewTransferredStudents = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await axios.get(
        BASE_URL + "displayTransferredStudents"
      );

      setStudents(res.data.students || []);
    } catch (error) {
      console.error("Error fetching students", error);
    }
  };

  /* =========================
     SEARCH
  ========================= */

  const filteredStudents = students.filter((student) =>
    Object.values(student)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  /* =========================
     PAGINATION
  ========================= */

  const totalPages =
    filteredStudents.length > 0
      ? Math.ceil(filteredStudents.length / entries)
      : 1;

  const validCurrentPage = Math.min(currentPage, totalPages);

  const indexOfLast = validCurrentPage * entries;
  const indexOfFirst = indexOfLast - entries;

  const currentStudents = filteredStudents.slice(
    indexOfFirst,
    indexOfLast
  );

  const showingFrom =
    filteredStudents.length === 0 ? 0 : indexOfFirst + 1;

  const showingTo = Math.min(
    indexOfLast,
    filteredStudents.length
  );

  /* =========================
     PAGE CHANGE
  ========================= */

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="view-transferred-students-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="view-transferred-students-header">

        <div className="view-transferred-students-header-left">

          <div className="view-transferred-students-header-icon">
            <FaUsers />
          </div>

          <div>
            <h1>Transferred Students</h1>
            <p>
              View and manage students who have been transferred
            </p>
          </div>

        </div>

        <div className="view-transferred-students-total">
          <span>{students.length}</span>
          <small>Students</small>
        </div>

      </div>


      {/* =====================================================
          TABLE CARD
      ===================================================== */}

      <div className="view-transferred-students-card">

        {/* =================================================
            TABLE TOP CONTROLS
        ================================================= */}

        <div className="view-transferred-students-controls">

          {/* Entries */}

          <div className="view-transferred-students-entries">

            <span>Show</span>

            <select
              value={entries}
              onChange={(e) => {
                setEntries(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>

            <span>entries</span>

          </div>


          {/* Search */}

          <div className="view-transferred-students-search">

            <span className="view-transferred-students-search-label">
              Search
            </span>

            <div className="view-transferred-students-search-box">

              <FaSearch />

              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />

            </div>

          </div>

        </div>


        {/* =================================================
            TABLE
        ================================================= */}

        <div className="view-transferred-students-table-wrapper">

          <table className="view-transferred-students-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Father's Name</th>
                <th>Mother's Name</th>
                <th>Last Class</th>
                <th>Roll No</th>
                <th>Admission No</th>
                <th>Session</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {currentStudents.length > 0 ? (

                currentStudents.map((row) => (

                  <tr key={row.id}>

                    <td>
                      <span className="view-transferred-students-id">
                        {row.id}
                      </span>
                    </td>

                    <td>
                      <div className="view-transferred-students-name">
                        {row.name || "-"}
                      </div>
                    </td>

                    <td>
                      {row.father_name || "-"}
                    </td>

                    <td>
                      {row.mother_name || "-"}
                    </td>

                    <td>
                      <span className="view-transferred-students-class">
                        {row.last_class || "-"}
                      </span>
                    </td>

                    <td>
                      {row.roll_no || "-"}
                    </td>

                    <td>
                      <span className="view-transferred-students-admission">
                        {row.admission_number || "-"}
                      </span>
                    </td>

                    <td>
                      <span className="view-transferred-students-session">
                        {row.session || "-"}
                      </span>
                    </td>

                    {/* ACTIONS */}

                    <td>

                      <div className="view-transferred-students-actions">

                        <button
                          type="button"
                          className="view-transferred-students-view-btn"
                          title="View Transfer Certificate"
                          onClick={() =>
                            navigate(
                              `/StudentComponent/ViewTc/${row.id}`
                            )
                          }
                        >
                          <FaEye />
                        </button>

                        <button
                          type="button"
                          className="view-transferred-students-edit-btn"
                          title="Edit Transfer Certificate"
                          onClick={() =>
                            navigate(
                              `/dashboard/StudentComponent/EditTC/${row.id}`
                            )
                          }
                        >
                          <FaPen />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="9"
                    className="view-transferred-students-no-data"
                  >
                    <div>
                      <FaUsers />
                      <span>
                        No transferred students found
                      </span>
                    </div>
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>


        {/* =================================================
            FOOTER / PAGINATION
        ================================================= */}

        <div className="view-transferred-students-footer">

          <div className="view-transferred-students-showing">

            Showing{" "}
            <strong>{showingFrom}</strong>{" "}
            to{" "}
            <strong>{showingTo}</strong>{" "}
            of{" "}
            <strong>{filteredStudents.length}</strong>{" "}
            entries

          </div>


          <div className="view-transferred-students-pagination">

            <button
              type="button"
              className="view-transferred-students-page-arrow"
              disabled={validCurrentPage === 1}
              onClick={() =>
                changePage(validCurrentPage - 1)
              }
              title="Previous"
            >
              <FaChevronLeft />
            </button>


            {/* Page Numbers */}

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (

              <button
                type="button"
                key={page}
                className={
                  validCurrentPage === page
                    ? "view-transferred-students-page-number active"
                    : "view-transferred-students-page-number"
                }
                onClick={() => changePage(page)}
              >
                {page}
              </button>

            ))}


            <button
              type="button"
              className="view-transferred-students-page-arrow"
              disabled={validCurrentPage === totalPages}
              onClick={() =>
                changePage(validCurrentPage + 1)
              }
              title="Next"
            >
              <FaChevronRight />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ViewTransferredStudents;