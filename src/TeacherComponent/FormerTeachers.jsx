import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FormerTeachers.css";

const BASE_URL =
  "http://localhost/kkblossom/api.php/Adminapi/AdminTeacher/formerTeachers";

const FormerTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchFormerTeachers();
  }, []);

  const fetchFormerTeachers = async () => {
    try {
      const res = await axios.get(BASE_URL);

      if (res.data && res.data.length > 0) {
        const sortedData = res.data.sort(
          (a, b) => new Date(b.date_of_birth) - new Date(a.date_of_birth)
        );
        setTeachers(sortedData);
        setSuccess("Moved to Former Successfully");
        setError("");
      } else {
        setTeachers([]);
        setError("No Former Teachers Found");
        setSuccess("");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load former teachers.");
      setSuccess("");
    }
  };

  // Filtered teachers based on search
  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.designation.toLowerCase().includes(search.toLowerCase()) ||
      (t.contact && t.contact.includes(search))
  );

  // Pagination
  const indexOfLast = currentPage * entries;
  const indexOfFirst = indexOfLast - entries;
  const currentTeachers = filteredTeachers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTeachers.length / entries);

  const columns = [
    "NAME",
    "DESIGNATION",
    "DATE OF BIRTH",
    "DATE OF JOINING",
    "DATE OF LEAVING",
    "CONTACT",
  ];

  return (
    <div className="innerview">
      {/* Success / Error Message */}
      {success && (
        <div className="success-bar">
          <i className="las la-check-square"></i> {success}
        </div>
      )}
      {error && (
        <div className="error-bar">
          <i className="las la-exclamation-triangle"></i> {error}
        </div>
      )}

      {/* Controls */}
      <div className="table-controls">
        <div>
          Show{" "}
          <select
            value={entries}
            onChange={(e) => {
              setEntries(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[5, 10, 25, 50, 100].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>{" "}
          entries
        </div>
        <div>
          Search:{" "}
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Table */}
      <table className="former-teachers-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentTeachers.length > 0 ? (
            currentTeachers.map((t, idx) => (
              <tr key={idx}>
                <td>{t.name}</td>
                <td>{t.designation}</td>
                <td>{t.date_of_birth}</td>
                <td>{t.date_of_joining}</td>
                <td>{t.date_of_leaving}</td>
                <td>{t.contact}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center" }}>
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      

      {/* Pagination Buttons */}
      <div className="pagination"style={{display:"flex",justifyContent:"space-between"}}>
        {/* Pagination Summary */}
      <div className="pagination-summary">
        Showing{" "}
        {filteredTeachers.length === 0
          ? 0
          : indexOfFirst + 1}{" "}
        to{" "}
        {indexOfLast > filteredTeachers.length
          ? filteredTeachers.length
          : indexOfLast}{" "}
        of {filteredTeachers.length} entries
      </div>
      <div>
<button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            className={currentPage === idx + 1 ? "active" : ""}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
        
      </div>
    </div>
  );
};

export default FormerTeachers;