import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./DisplayCharacterCertificates.css";

const BASE_URL = "http://localhost/kkblossom/api.php/Adminapi/AdminStudent/";

const DisplayCharacterCertificates = () => {

  const navigate = useNavigate();

  const [certificates, setCertificates] = useState([]);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await axios.get(
        BASE_URL + "displayCharacterCertificates"
      );
      setCertificates(response.data);
    } catch (error) {
      console.error("Error fetching certificates", error);
    }
  };

  const openCertificate = (id) => {
    navigate(`/character-certificate/${id}`);
  };

  // 🔎 Search filter
  const filteredData = certificates.filter((item) =>
    Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  // 📄 Pagination
  const indexOfLast = currentPage * entries;
  const indexOfFirst = indexOfLast - entries;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / entries);

  return (
    <div className="certificate-container">

      {/* Top Controls */}
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
          </select>
          entries
        </div>

        <div>
          Search:
          <input
           style={{border:"1px solid lightgrey",borderRadius:"1px",width:"67%",padding:"5px"}}
            type="text"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

      </div>

      {/* Table */}
      <table className="certificate-table">

        <thead>
          <tr>
            <th>ID</th>
            <th>STUDENT ID</th>
            <th>NAME</th>
            <th>CLASS</th>
            <th>ROLL NO</th>
            <th>FATHER'S NAME</th>
            <th>MOTHER'S NAME</th>
            <th>ADMISSION NO</th>
            <th>ADMISSION DATE</th>
            <th>GRADUATION DATE</th>
            <th>ACTIONS</th>
          </tr>
        </thead>

        <tbody>

          {currentData.map((certificate) => (

            <tr key={certificate.id}>

              <td>{certificate.id}</td>
              <td>{certificate.student_id}</td>
              <td>{certificate.name}</td>
              <td>{certificate.class}</td>
              <td>{certificate.roll_no}</td>
              <td>{certificate.father_name}</td>
              <td>{certificate.mother_name}</td>
              <td>{certificate.admission_no}</td>
              <td>{certificate.admission_date}</td>
              <td>{certificate.graduation_date}</td>

              <td>
                <button
                  className="view-btn"
                  style={{fontSize:"25px"}}
                  onClick={() => openCertificate(certificate.id)}
                >
                  👁
                </button>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

      {/* Pagination */}

      <div className="pagination">

        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>

      </div>

    </div>
  );
};

export default DisplayCharacterCertificates;