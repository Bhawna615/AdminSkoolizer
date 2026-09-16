import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./DisplayCharacterCertificates.css";

const BASE_URL =
  "http://localhost/kkblossom/api.php/Adminapi/AdminStudent/";

const DisplayCharacterCertificates = () => {
  const navigate = useNavigate();

  const [certificates, setCertificates] = useState([]);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        BASE_URL + "displayCharacterCertificates"
      );

      setCertificates(response.data || []);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCertificate = (id) => {
    navigate(`/character-certificate/${id}`);
  };

  const filteredData = certificates.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * entries;
  const indexOfFirst = indexOfLast - entries;

  const currentData = filteredData.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / entries)
  );

  const changeEntries = (e) => {
    setEntries(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="dcc-page">

      {/* =========================================
          PAGE HEADER
      ========================================= */}
      <div className="dcc-header">

        <div className="dcc-header-left">

          <div className="dcc-header-icon">
            <i className="bi bi-award-fill"></i>
          </div>

          <div>
            <h1>Character Certificates</h1>

            <p>
              View and print generated student character certificates
            </p>
          </div>

        </div>

        <button
          className="dcc-back-btn"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left"></i>
          Back
        </button>

      </div>

      {/* =========================================
          MAIN CARD
      ========================================= */}
      <div className="dcc-card">

        {/* =========================================
            CARD HEADER
        ========================================= */}
        <div className="dcc-card-header">

          <div>
            <h2>
              <i className="bi bi-file-earmark-medical-fill"></i>
              Certificate Records
            </h2>

            <p>
              Manage and print student character certificates.
            </p>
          </div>

          <div className="dcc-total-badge">
            <i className="bi bi-collection-fill"></i>
            Total: {certificates.length}
          </div>

        </div>

        {/* =========================================
            CONTROLS
        ========================================= */}
        <div className="dcc-controls">

          <div className="dcc-show-control">

            <span>Show</span>

            <select
              value={entries}
              onChange={changeEntries}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>

            <span>entries</span>

          </div>

          <div className="dcc-search-control">

            <label>
              <i className="bi bi-search"></i>
              Search
            </label>

            <div className="dcc-search-box">

              <i className="bi bi-search"></i>

              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search certificates..."
              />

              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCurrentPage(1);
                  }}
                >
                  <i className="bi bi-x-circle-fill"></i>
                </button>
              )}

            </div>

          </div>

        </div>

        {/* =========================================
            TABLE
        ========================================= */}
        <div className="dcc-table-wrapper">

          <table className="dcc-table">

            <thead>
              <tr>
                <th>#</th>
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

              {loading ? (

                <tr>
                  <td
                    colSpan="11"
                    className="dcc-loading"
                  >
                    <div className="dcc-spinner"></div>
                    Loading certificates...
                  </td>
                </tr>

              ) : currentData.length > 0 ? (

                currentData.map((certificate, index) => (

                  <tr key={certificate.id}>

                    <td>
                      {indexOfFirst + index + 1}
                    </td>

                    <td>
                      <span className="dcc-student-id">
                        {certificate.student_id}
                      </span>
                    </td>

                    <td className="dcc-student-name">
                      {certificate.name}
                    </td>

                    <td>
                      {certificate.class}
                    </td>

                    <td>
                      {certificate.roll_no}
                    </td>

                    <td>
                      {certificate.father_name}
                    </td>

                    <td>
                      {certificate.mother_name}
                    </td>

                    <td>
                      {certificate.admission_no}
                    </td>

                    <td>
                      {certificate.admission_date}
                    </td>

                    <td>
                      {certificate.graduation_date}
                    </td>

                    <td>

                      <div className="dcc-actions">

                        <button
                          className="dcc-view-btn"
                          title="View & Print Certificate"
                          onClick={() =>
                            openCertificate(certificate.id)
                          }
                        >
                          <i className="bi bi-eye-fill"></i>
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="11"
                    className="dcc-empty"
                  >

                    <div className="dcc-empty-icon">
                      <i className="bi bi-file-earmark-x"></i>
                    </div>

                    <h3>No Certificates Found</h3>

                    <p>
                      No character certificates match your search.
                    </p>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* =========================================
            TABLE FOOTER
        ========================================= */}
        <div className="dcc-table-footer">

          <div className="dcc-record-info">

            Showing{" "}
            <strong>
              {filteredData.length === 0
                ? 0
                : indexOfFirst + 1}
            </strong>{" "}
            to{" "}
            <strong>
              {Math.min(indexOfLast, filteredData.length)}
            </strong>{" "}
            of{" "}
            <strong>
              {filteredData.length}
            </strong>{" "}
            entries

          </div>

          <div className="dcc-pagination">

            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((prev) => prev - 1)
              }
            >
              <i className="bi bi-chevron-left"></i>
              Previous
            </button>

            <div className="dcc-page-number">
              Page {currentPage} of {totalPages}
            </div>

            <button
              disabled={currentPage >= totalPages}
              onClick={() =>
                setCurrentPage((prev) => prev + 1)
              }
            >
              Next
              <i className="bi bi-chevron-right"></i>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default DisplayCharacterCertificates;