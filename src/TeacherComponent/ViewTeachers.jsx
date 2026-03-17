import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewTeachers.css";
import { useNavigate } from "react-router-dom";
const BASE_URL = "http://localhost/kkblossom/api.php/Adminapi/AdminTeacher/";

const ViewTeachers = () => {

  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [entryCount, setEntryCount] = useState(10);
  const [message, setMessage] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(BASE_URL + "getTeachers");
      setTeachers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTeacher = async (id) => {

    if (!window.confirm("Are you sure?")) return;

    try {

      const res = await axios.get(BASE_URL + "deleteTeacher/" + id);

      if (res.data.status === "success") {
        setMessage("Teacher deleted successfully");
        fetchTeachers();
      }

    } catch (error) {
      console.error(error);
    }
  };

  const filteredTeachers = teachers.filter((t) =>
    t.Teachername?.toLowerCase().includes(search.toLowerCase())
  );

  // pagination logic
  const totalPages = Math.ceil(filteredTeachers.length / entryCount);
  const startIndex = (currentPage - 1) * entryCount;
  const endIndex = startIndex + entryCount;

  const paginatedTeachers = filteredTeachers.slice(startIndex, endIndex);

  return (

    <div className="teacher-page">

      {message && (
        <div className="success-box">
          ✓ {message}
        </div>
      )}

      {/* top controls */}

      <div className="table-controls">

        <div>
          Show
          <select
            value={entryCount}
            onChange={(e) => {
              setEntryCount(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          entries
        </div>

        <div>
          Search:
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

      {/* table */}

      <table className="teacher-table">

        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>POST</th>
            <th>CLASS INCHARGE OF</th>
            <th>EMAIL/USERNAME</th>
            <th>DATE OF JOINING</th>
            <th>ACTIONS</th>
          </tr>
        </thead>

        <tbody>

          {paginatedTeachers.map((row) => (

            <tr key={row.id}>

              <td>{row.id}</td>
              <td>{row.Teachername}</td>
              <td>{row.Post}</td>
              <td>{row.Classteacher}</td>
              <td>{row.Email}</td>
              <td>{row.Doj}</td>

              <td className="action-cell">

                <div className="action-wrapper">

                  <span
                    className="three-dots"
                    onClick={() =>
                      setOpenMenu(openMenu === row.id ? null : row.id)
                    }
                  >
                    ⋮
                  </span>

                  {openMenu === row.id && (

                    <div className="action-dropdown">

                      <div onClick={() => deleteTeacher(row.id)}>
                        Delete
                      </div>

                      <div onClick={() => navigate(`/dashboard/TeacherComponent/AddTeacherToFormer/${row.id}`)}>
  Leave
</div>

                      <div onClick={()=> navigate(`/dashboard/TeacherComponent/GenerateExperienceCertificate/${row.id}`)}>
                        Experrience Certificates
                      </div>

                      <div onClick={()=>navigate(`/dashboard/TeacherComponent/create-credentials/${row.id}`)}>
                        Create Cerdentials
                      </div>

                    </div>

                  )}

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      {/* pagination */}

      <div className="pagination">

        Showing {startIndex + 1} to {Math.min(endIndex, filteredTeachers.length)} of {filteredTeachers.length} entries

        <div className="pages">

          <span
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          >
            Prev
          </span>

          {[...Array(totalPages)].map((_, i) => (
            <span
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </span>
          ))}

          <span
            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
          >
            Next
          </span>

        </div>

      </div>

    </div>

  );

};

export default ViewTeachers;