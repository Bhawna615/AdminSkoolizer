import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ExperienceCertificates.css";

const BASE_URL =
  "http://localhost/kkblossom/api.php/Adminapi/AdminTeacher/";

const ExperienceCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [filteredCertificates, setFilteredCertificates] = useState([]);

  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMessage, setShowMessage] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCertificates();

    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const fetchCertificates = () => {
    axios
      .get(BASE_URL + "getExperienceCertificates")
      .then((res) => {
        if (res.data && res.data.status) {

          // Recently added certificates on top
          const sortedData = [...res.data.data].sort(
            (a, b) => Number(b.id) - Number(a.id)
          );

          setCertificates(sortedData);
          setFilteredCertificates(sortedData);
        }
      })
      .catch((error) => {
        console.error("API ERROR:", error);
      });
  };

  // SEARCH
  useEffect(() => {
    const result = certificates.filter((item) =>
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.designation?.toLowerCase().includes(search.toLowerCase())
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

  const totalPages = Math.ceil(
    filteredCertificates.length / entries
  );

  return (
    <div className="experience-list-page">

      {/* ================= PAGE HEADER ================= */}

      <div className="experience-list-header">

        <div className="experience-list-title-section">

          <div className="experience-list-title-icon">
            <i className="bi bi-file-earmark-text-fill"></i>
          </div>

          <div>
            <h2>Experience Certificates</h2>

            <p>
              Manage, view and access generated teacher
              experience certificates
            </p>
          </div>

        </div>


        <div className="experience-list-total-card">

          <div className="experience-list-total-icon">
            <i className="bi bi-award-fill"></i>
          </div>

          <div>
            <span>Total Certificates</span>

            <strong>
              {certificates.length}
            </strong>
          </div>

        </div>

      </div>


      {/* ================= SUCCESS MESSAGE ================= */}

      {showMessage && certificates.length > 0 && (

        <div className="experience-list-success">

          <div className="experience-list-success-icon">
            <i className="bi bi-check-circle-fill"></i>
          </div>

          <div>

            <strong>
              Certificate generated successfully!
            </strong>

            <span>
              Your latest experience certificate is available below.
            </span>

          </div>

          <button
            className="experience-list-close-message"
            onClick={() => setShowMessage(false)}
          >
            <i className="bi bi-x-lg"></i>
          </button>

        </div>

      )}


      {/* ================= MAIN CARD ================= */}

      <div className="experience-list-card">


        {/* CARD HEADER */}

        <div className="experience-list-card-header">

          <div>

            <h3>
              <i className="bi bi-folder2-open"></i>
              Certificate Records
            </h3>

            <p>
              Recently generated certificates appear first
            </p>

          </div>


          <button
            className="experience-list-add-btn"
            onClick={() =>
              navigate("/dashboard/TeacherComponent/ViewTeachers")
            }
          >
            <i className="bi bi-plus-lg"></i>
            Generate Certificate
          </button>

        </div>


        {/* ================= CONTROLS ================= */}

        <div className="experience-list-controls">


          <div className="experience-list-entries">

            <span>Show</span>

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
            </select>

            <span>entries</span>

          </div>


          <div className="experience-list-search">

            <i className="bi bi-search"></i>

            <input
              type="text"
              placeholder="Search certificate..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

        </div>


        {/* ================= TABLE ================= */}

        <div className="experience-list-table-wrapper">

          <table className="experience-list-table">

            <thead>

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

                currentCertificates.map((c, index) => (

                  <tr
                    key={c.id}
                    className={
                      index === 0 &&
                      currentPage === 1 &&
                      !search
                        ? "experience-list-latest-row"
                        : ""
                    }
                  >

                    <td>

                      <span className="experience-list-id">
                        #{c.id}
                      </span>

                    </td>


                    <td>

                      <div className="experience-list-teacher">

                        <div className="experience-list-avatar">

                          {c.name
                            ? c.name.charAt(0).toUpperCase()
                            : "T"}

                        </div>

                        <div>

                          <strong>
                            {c.name}
                          </strong>

                          {index === 0 &&
                            currentPage === 1 &&
                            !search && (

                            <span className="experience-list-new-badge">
                              Latest
                            </span>

                          )}

                        </div>

                      </div>

                    </td>


                    <td>

                      <span className="experience-list-designation">
                        {c.designation}
                      </span>

                    </td>


                    <td>

                      <span className="experience-list-date">

                        <i className="bi bi-calendar-heart"></i>

                        {c.date_of_birth}

                      </span>

                    </td>


                    <td>

                      <span className="experience-list-date">

                        <i className="bi bi-calendar-check"></i>

                        {c.date_of_joining}

                      </span>

                    </td>


                    <td>

                      <span className="experience-list-date">

                        <i className="bi bi-calendar-event"></i>

                        {c.from_date}

                      </span>

                    </td>


                    <td>

                      <span className="experience-list-date">

                        <i className="bi bi-calendar2-check"></i>

                        {c.to_date}

                      </span>

                    </td>


                    <td>

                      <span className="experience-list-classes">

                        <i className="bi bi-book"></i>

                        {c.classes_taught}

                      </span>

                    </td>


                    <td>

                      <button
                        className="experience-list-view-btn"
                        onClick={() =>
                          navigate(
                            `/TeacherComponent/ExperienceCertificateView/${c.id}`
                          )
                        }
                        title="View Certificate"
                      >

                        <i className="bi bi-eye-fill"></i>

                      </button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td colSpan="9">

                    <div className="experience-list-empty">

                      <div className="experience-list-empty-icon">

                        <i className="bi bi-file-earmark-x"></i>

                      </div>

                      <h3>
                        No Certificates Found
                      </h3>

                      <p>
                        There are currently no experience
                        certificates available.
                      </p>

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>


        {/* ================= PAGINATION ================= */}

        <div className="experience-list-pagination">


          <div className="experience-list-pagination-summary">

            Showing

            <strong>
              {" "}
              {filteredCertificates.length === 0
                ? 0
                : indexOfFirst + 1}
            </strong>

            {" "}to{" "}

            <strong>
              {Math.min(
                indexOfLast,
                filteredCertificates.length
              )}
            </strong>

            {" "}of{" "}

            <strong>
              {filteredCertificates.length}
            </strong>

            {" "}entries

          </div>


          <div className="experience-list-pagination-buttons">


            <button
              className="experience-list-page-nav"
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage(
                  (prev) => prev - 1
                )
              }
            >

              <i className="bi bi-chevron-left"></i>

              Previous

            </button>


            {Array.from(
              { length: totalPages },
              (_, index) => (

                <button
                  key={index}
                  className={`experience-list-page-number ${
                    currentPage === index + 1
                      ? "experience-list-active"
                      : ""
                  }`}
                  onClick={() =>
                    setCurrentPage(index + 1)
                  }
                >

                  {index + 1}

                </button>

              )
            )}


            <button
              className="experience-list-page-nav"
              disabled={
                currentPage === totalPages ||
                totalPages === 0
              }
              onClick={() =>
                setCurrentPage(
                  (prev) => prev + 1
                )
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

export default ExperienceCertificates;