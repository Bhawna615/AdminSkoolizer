import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ViewTransferredStudents.css";

const BASE_URL = "http://localhost/kkblossom/api.php/Adminapi/AdminStudent/";

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
      const res = await axios.get(BASE_URL + "displayTransferredStudents");
      setStudents(res.data.students);
    } catch (error) {
      console.error("Error fetching students", error);
    }
  };

  const filteredStudents = students.filter((s) =>
    Object.values(s).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * entries;
  const indexOfFirst = indexOfLast - entries;
  const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredStudents.length / entries);

  return (
    <div className="innerview">

      {/* Top Controls */}
      <div className="table-controls">

        <div className="entries-control">
          Show
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
          entries
        </div>

        <div className="search-control">
          Search:
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

      </div>

      {/* Table */}
      <table className="student-table">

        <thead>
          <tr>
            <th>Id</th>
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
                <td>{row.id}</td>
                <td>{row.name}</td>
                <td>{row.father_name}</td>
                <td>{row.mother_name}</td>
                <td>{row.last_class}</td>
                <td>{row.roll_no}</td>
                <td>{row.admission_number}</td>
                <td>{row.session}</td>

                <td className="actions">

                  <button
                    className="action-btn"
                    onClick={() =>
                      navigate(`/StudentComponent/ViewTc/${row.id}`)
                    }
                  >
                    <i class="las la-eye btn-icon"></i>
                  </button>

                  <button
                    className="action-btn"
                    onClick={() =>
                      navigate(`/dashboard/StudentComponent/EditTC/${row.id}`)
                    }
                  >
                   <i class="las la-pen btn-icon"></i>
                  </button>

                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="no-data">
                No transferred students found
              </td>
            </tr>
          )}

        </tbody>
      </table>

      {/* Bottom Pagination */}

      <div className="pagination-container">

        <div>
          Showing {indexOfFirst + 1} to{" "}
          {Math.min(indexOfLast, filteredStudents.length)} of{" "}
          {filteredStudents.length} entries
        </div>

        <div className="pagination">

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active-page" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>

        </div>

      </div>

    </div>
  );
};

export default ViewTransferredStudents;