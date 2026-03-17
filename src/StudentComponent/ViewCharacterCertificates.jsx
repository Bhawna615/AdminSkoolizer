import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./ViewCharacterCertificates.css";
import { FaEye } from "react-icons/fa";

const ViewCharacterCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [message, setMessage] = useState(null);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchCertificates();

    if (location.state) {
      setMessage(location.state);
      setTimeout(() => setMessage(null), 4000);
    }
  }, []);

  useEffect(() => {
    const filtered = certificates.filter((item) =>
      Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filtered.slice(0, entries));
  }, [search, certificates, entries]);

  const fetchCertificates = async () => {
    try {
      const res = await axios.get(
        "http://localhost/kkblossom/api.php/Adminapi/AdminStudent/displayCharacterCertificates"
      );
      setCertificates(res.data);
      setFilteredData(res.data.slice(0, entries));
    } catch (err) {
      console.error(err);
    }
  };

  const handleView = (id) => {
    navigate(`/character-certificate/${id}`);
  };

  return (
    <div className="main-container">

      {/* Success Message */}
      {message && (
        <div className="success-box">
          ✔ {message.text}
        </div>
      )}

      {/* Top Controls */}
      <div className="table-controls">
        <div>
          Show{" "}
          <select
            value={entries}
            onChange={(e) => setEntries(Number(e.target.value))}
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
            style={{padding:"5px",border:"1px solid black",width:"60%",textAlign:"left"}}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>ID ▲▼</th>
            <th>STUDENT ID ▲▼</th>
            <th>NAME ▲▼</th>
            <th>CLASS ▲▼</th>
            <th>ROLL NO ▲▼</th>
            <th>FATHER'S NAME ▲▼</th>
            <th>MOTHER'S NAME ▲▼</th>
            <th>ADMISSION NO ▲▼</th>
            <th>ADMISSION DATE ▲▼</th>
            <th>GRADUATION DATE ▲▼</th>
            <th>ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((cert) => (
              <tr key={cert.id}>
                <td>{cert.id}</td>
                <td>{cert.student_id}</td>
                <td>{cert.name}</td>
                <td>{cert.class}</td>
                <td>{cert.roll_no}</td>
                <td>{cert.father_name}</td>
                <td>{cert.mother_name}</td>
                <td>{cert.admission_no}</td>
                <td>{cert.admission_date}</td>
                <td>{cert.graduation_date}</td>
                <td>
                  <FaEye
                    className="eye-icon"
                    onClick={() => handleView(cert.id)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="no-data">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Footer */}
      <div className="pagination">
        <span>
          Showing 1 to {filteredData.length} of {certificates.length} entries
        </span>

        <div>
          <button>Previous</button>
          <button className="active-page">1</button>
          <button>Next</button>
        </div>
      </div>
    </div>
  );
};

export default ViewCharacterCertificates;