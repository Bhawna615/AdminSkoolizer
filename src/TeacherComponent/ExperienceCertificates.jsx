import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL =
  "http://localhost/kkblossom/api.php/Adminapi/AdminTeacher/";

const ExperienceCertificates = () => {

  const [certificates, setCertificates] = useState([]);
  const [filteredCertificates, setFilteredCertificates] = useState([]);

  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = () => {
    axios
      .get(BASE_URL + "getExperienceCertificates")
      .then((res) => {
        if (res.data && res.data.status) {
          setCertificates(res.data.data);
          setFilteredCertificates(res.data.data);
        }
      })
      .catch((error) => {
        console.error("API ERROR:", error);
      });
  };

  // SEARCH
  useEffect(() => {
    const result = certificates.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredCertificates(result);
    setCurrentPage(1);
  }, [search, certificates]);

  // PAGINATION
  const indexOfLast = currentPage * entries;
  const indexOfFirst = indexOfLast - entries;

  const currentCertificates = filteredCertificates.slice(
    indexOfFirst,
    indexOfLast
  );

  const totalPages = Math.ceil(filteredCertificates.length / entries);

  return (
    <div className="container mt-3">

      <h3>Experience Certificates</h3>

      {/* SUCCESS MESSAGE */}
      <div
        style={{
          border: "1px solid #6fa8dc",
          padding: "20px",
          marginBottom: "20px",
          textAlign: "center",
          color: "#2e6da4",
          fontSize: "20px",
          background: "#f5f9ff"
        }}
      >
        ✓ Certificate generated successfully
      </div>

      {/* TOP CONTROLS */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div>
          Show{" "}
          <select
            value={entries}
            onChange={(e) => {
              setEntries(parseInt(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>{" "}
          entries
        </div>

        <div>
          Search:{" "}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}

      <table className="table table-bordered">

        <thead style={{ background: "#3f63b5", color: "#fff" }}>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>DESIGNATION</th>
            <th>DATE OF BIRTH</th>
            <th>DATE OF JOINING</th>
            <th>FROM DATE</th>
            <th>TO DATE</th>
            <th>CLASSES TAUGHT</th>
            <th>ACTIONS</th>
          </tr>
        </thead>

        <tbody>

          {currentCertificates.length > 0 ? (
            currentCertificates.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.designation}</td>
                <td>{c.date_of_birth}</td>
                <td>{c.date_of_joining}</td>
                <td>{c.from_date}</td>
                <td>{c.to_date}</td>
                <td>{c.classes_taught}</td>

                <td style={{ textAlign: "center" }}>
                  <button
                    style={{
                      border: "none",
                      background: "transparent",
                      fontSize: "18px",
                      cursor: "pointer"
                    }}
                    onClick={() =>
                      navigate(
                        `/TeachrComponent/ExperienceCertificateView/${c.id}`
                      )
                    }
                  >
                    👁
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                No Certificates Found
              </td>
            </tr>
          )}

        </tbody>

      </table>

      {/* BOTTOM INFO + PAGINATION */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >

        <div>
          Showing {indexOfFirst + 1} to{" "}
          {Math.min(indexOfLast, filteredCertificates.length)} of{" "}
          {filteredCertificates.length} entries
        </div>

        <div>

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            style={{ marginRight: "5px" }}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              style={{
                marginRight: "5px",
                background:
                  currentPage === index + 1 ? "#3f63b5" : "#eee",
                color: currentPage === index + 1 ? "#fff" : "#000",
                border: "1px solid #ccc",
                padding: "5px 10px",
              }}
            >
              {index + 1}
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

export default ExperienceCertificates;