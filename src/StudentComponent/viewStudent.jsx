import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./viewStudent.css";
import { useNavigate } from "react-router-dom";

const ViewStudent = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClass, setSelectedClass] = useState("");
  const [enableFilter, setEnableFilter] = useState(false);
  const [message, setMessage] = useState("");
const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const [activeAction, setActiveAction] = useState(null);

  const API_BASE = "http://localhost/kkblossom/api.php/Adminapi/";

  useEffect(() => {
    fetchStudents();
  }, []);
// ✅ FIXED DELETE FUNCTION (Now accepts id)
 const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure?");
  if (!confirmDelete) return;

  try {
    const response = await axios.delete(`${API_BASE}AdminStudent/delete/${id}`);
    console.log("Delete Response:", response.data);

    if (response.data.status) {
      // ✅ Refresh student list instantly
      fetchStudents();

      // ✅ Show success message
      setMessage("Deleted Successfully");
      setErrorMessage("");

      // ✅ Navigate to ViewStudent page after successful deletion
      navigate("/dashboard/StudentComponent/ViewStudent", {
        state: { successMessage: "Deleted Successfully" },
      });
    } else {
      setErrorMessage("Failed to delete");
      setMessage("");
    }
  } catch (error) {
    console.error("Delete Error:", error);
    setErrorMessage("Failed to delete");
    setMessage("");
  }
};

  const fetchStudents = async () => {
    try {
      const res = await axios.get(API_BASE + "AdminStudent/display");

      if (Array.isArray(res.data)) {
        setStudents(res.data);
      } else if (Array.isArray(res.data.data)) {
        setStudents(res.data.data);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
    }
  };

  const filteredStudents = useMemo(() => {
    let data = Array.isArray(students) ? [...students] : [];

    if (enableFilter && selectedClass) {
      data = data.filter((s) => s.Class === selectedClass);
    }

    if (search) {
      data = data.filter(
        (s) =>
          s?.Name?.toLowerCase().includes(search.toLowerCase()) ||
          s?.Rollno?.toString().includes(search)
      );
    }

    // Alphabetical Sorting
    data.sort((a, b) =>
      (a?.Name || "").localeCompare(b?.Name || "", undefined, {
        sensitivity: "base",
      })
    );

    return data;
  }, [students, search, selectedClass, enableFilter]);

  const totalPages = Math.ceil(filteredStudents.length / entries);
  const startIndex = (currentPage - 1) * entries;
  const paginatedStudents = filteredStudents.slice(
    startIndex,
    startIndex + entries
  );

  return (
    <div className="student-container">

      <div className="filter-bar">
        <label className="filter-enable">
          <input
            type="checkbox"
            checked={enableFilter}
            className="custom-checkbox"
            onChange={() => {
              setEnableFilter(!enableFilter);
              setCurrentPage(1);
            }}
          />{" "}
          ENABLE FILTER
        </label>

        <div className="class-filter">
          <label style={{ display: "block", marginBottom: "10px" }}>
            <i className="las la-filter"></i> CLASS
          </label>

          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Select Class</option>
            {Array.isArray(students) &&
              [...new Set(students.map((s) => s.Class))].map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
          </select>
        </div>
      </div>

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
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>{" "}
          entries
        </div>

        <div>
          Search:{" "}
          <input
          className="search-input"
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <table className="student-table">
        <thead>
          <tr>
            <th>STUDENT ID</th>
            <th>ROLL NO.</th>
            <th>NAME</th>
            <th>CLASS</th>
            <th>ADMISSION NO</th>
            <th>NOTIFICATIONS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {paginatedStudents.length > 0 ? (
            paginatedStudents.map((row) => {

              // ✅ FINAL CORRECT CHECK
              const isReceiving =
                row?.fcm_token !== null &&
                row?.fcm_token !== undefined &&
                row?.fcm_token !== "" &&
                row?.fcm_token !== "0" &&
                row?.fcm_token !== 0;

              return (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.Rollno}</td>
                  <td>{row.Name}</td>
                  <td>{row.Class}</td>
                  <td>{row.Admno}</td>

                  <td>{row.fcm_token ? "Receiving" : "Not Receiving"}</td>


                  <td style={{ position: "relative" }}>
                    <span
                      style={{ cursor: "pointer", fontSize: "20px" }}
                      onClick={() =>
                        setActiveAction(activeAction === row.id ? null : row.id)
                      }
                    >
                      ⋮
                    </span>

                    {activeAction === row.id && (
                      <div className="action-dropdown">
                        <div
                          onClick={() =>
                            navigate(`/StudentComponent/report/${row.id}`)
                          }
                          style={{ cursor: "pointer" }}
                        >
                          Exam Report
                        </div>
                        <div
                          onClick={() =>
                            navigate(`/StudentComponent/ReportCardRouter/${row.id}`)
                          }
                          style={{ cursor: "pointer" }}
                        >Report Card</div>
                       <div
  style={{ cursor: "pointer" }}
  onClick={() => navigate(`/StudentComponent/ReportRouter/${row.id}`)}
>
  Customized Report Card
</div>

                        <div
                        style={{ cursor: "pointer" }}
  onClick={() => navigate(`/dashboard/StudentComponent/AttendenceDetails/${row.id}`)}

                        >Attendance</div>
                        <div style={{ cursor: "pointer" }}
  onClick={() => navigate(`/dashboard/StudentComponent/GenerateTC/${row.id}`)}
>Transfer Certificate</div>
                        <div style={{ cursor: "pointer" }}
  onClick={() => navigate(`/dashboard/StudentComponent/CharacterCertificate/${row.id}`)}>Character Certificate</div>
                        <div style={{ cursor: "pointer" }}
  onClick={() => navigate(`/dashboard/StudentComponent/StudentTransportDetails/${row.id}`)}>Transport</div>
                        <div style={{ cursor: "pointer" }}
  onClick={() => navigate(`/dashboard/StudentComponent/StudentExamDetails/${row.id}`)}>Exams</div>
                        <div style={{ cursor: "pointer" }}
  onClick={() => navigate(`/dashboard/StudentComponent/StudentFeeDetails/${row.id}`)}>Fee</div>
                        <div style={{ cursor: "pointer" }}
  onClick={() => navigate(`/dashboard/StudentComponent/StudentMessages/${row.id}`)}>Messages</div>
                        <div style={{ cursor: "pointer" }}
  onClick={() => navigate(`/dashboard/StudentComponent/CreateCredentials/${row.id}`)}>Create Credentials</div>
                        <div style={{ cursor: "pointer" }}
  onClick={() => navigate(`/dashboard/StudentComponent/CreateStudentPayment/${row.id}`)}>Create Fee Payment</div>
                       <div
                          style={{ cursor: "pointer", color: "red" }}
                          onClick={() => handleDelete(row.id)}  
                        >
                          Delete
                        </div>

                      </div>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No Students Found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <span>
          Showing {filteredStudents.length === 0 ? 0 : startIndex + 1} to{" "}
          {Math.min(startIndex + entries, filteredStudents.length)} of{" "}
          {filteredStudents.length} entries
        </span>

        <div className="page-buttons">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>

          {(() => {
            const pages = [];
            const maxVisible = 5;
            let startPage = Math.max(1, currentPage - 2);
            let endPage = Math.min(totalPages, startPage + maxVisible - 1);

            if (endPage - startPage < maxVisible - 1) {
              startPage = Math.max(1, endPage - maxVisible + 1);
            }

            if (startPage > 1) {
              pages.push(
                <button key={1} onClick={() => setCurrentPage(1)}>
                  1
                </button>
              );

              if (startPage > 2) {
                pages.push(<span key="start-ellipsis">...</span>);
              }
            }

            for (let i = startPage; i <= endPage; i++) {
              pages.push(
                <button
                  key={i}
                  className={currentPage === i ? "active" : ""}
                  onClick={() => setCurrentPage(i)}
                >
                  {i}
                </button>
              );
            }

            if (endPage < totalPages) {
              if (endPage < totalPages - 1) {
                pages.push(<span key="end-ellipsis">...</span>);
              }

              pages.push(
                <button
                  key={totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </button>
              );
            }

            return pages;
          })()}

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>

    </div>
  );
};

export default ViewStudent;
