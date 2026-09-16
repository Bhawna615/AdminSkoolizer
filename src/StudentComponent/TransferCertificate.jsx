
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./TransferCertificate.css";

const API_BASE =
  "http://localhost/kkblossom/api.php/Adminapi";

const TransferCertificate = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  /* =========================================================
     FETCH TRANSFER CERTIFICATE STUDENTS
  ========================================================= */

  const fetchTransferredStudents = async () => {
    try {
      setLoading(true);
      setMessage({
        type: "",
        text: "",
      });

      const res = await axios.get(
        `${API_BASE}/AdminStudent/displayTransferredStudents`
      );

      console.log(
        "Transferred Students:",
        res.data
      );

      setStudents(res.data?.students || []);
    } catch (err) {
      console.error(
        "Transfer Certificate Fetch Error:",
        err
      );

      setMessage({
        type: "error",
        text: "Failed to load transfer certificates.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransferredStudents();
  }, []);

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredStudents = useMemo(() => {
    const searchText = search
      .toLowerCase()
      .trim();

    if (!searchText) {
      return students;
    }

    return students.filter((student) => {
      return (
        String(student.id || "")
          .toLowerCase()
          .includes(searchText) ||

        String(student.name || "")
          .toLowerCase()
          .includes(searchText) ||

        String(student.father_name || "")
          .toLowerCase()
          .includes(searchText) ||

        String(student.last_class || "")
          .toLowerCase()
          .includes(searchText) ||

        String(student.roll_no || "")
          .toLowerCase()
          .includes(searchText) ||

        String(student.session || "")
          .toLowerCase()
          .includes(searchText)
      );
    });
  }, [students, search]);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages = Math.ceil(
    filteredStudents.length / rowsPerPage
  );

  const startIndex =
    (currentPage - 1) * rowsPerPage;

  const endIndex =
    startIndex + rowsPerPage;

  const currentStudents =
    filteredStudents.slice(
      startIndex,
      endIndex
    );

  /* =========================================================
     RESET PAGE WHEN SEARCH CHANGES
  ========================================================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  /* =========================================================
     PAGE CHANGE
  ========================================================= */

  const goToPage = (page) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);
  };

  /* =========================================================
     PAGE NUMBERS
  ========================================================= */

  const pageNumbers = [];

  for (
    let i = 1;
    i <= totalPages;
    i++
  ) {
    pageNumbers.push(i);
  }

  /* =========================================================
     VIEW TC
  ========================================================= */

  const handleView = (id) => {
    navigate(
      `/StudentComponent/ViewTC/${id}`
    );
  };

  /* =========================================================
     EDIT TC
  ========================================================= */

  const handleEdit = (id) => {
    navigate(
      `/dashboard/StudentComponent/EditTC/${id}`
    );
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="tc-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="tc-page-header">

        <div className="tc-header-left">

          <div className="tc-header-icon">
            <i className="las la-file-alt"></i>
          </div>

          <div className="tc-header-content">

            <h1>
              Transfer Certificates
            </h1>

            <p>
              Manage and view student transfer certificates
            </p>

          </div>

        </div>

        <div className="tc-header-count">

          <div className="tc-count-icon">
            <i className="las la-users"></i>
          </div>

          <div>
            <span>
              Total Certificates
            </span>

            <strong>
              {students.length}
            </strong>
          </div>

        </div>

      </div>


      {/* =====================================================
          MESSAGE
      ===================================================== */}

      {message.text && (
        <div
          className={`tc-message ${
            message.type === "error"
              ? "tc-message-error"
              : "tc-message-success"
          }`}
        >

          <i
            className={
              message.type === "error"
                ? "las la-exclamation-circle"
                : "las la-check-circle"
            }
          ></i>

          <span>
            {message.text}
          </span>

          <button
            type="button"
            onClick={() =>
              setMessage({
                type: "",
                text: "",
              })
            }
          >
            <i className="las la-times"></i>
          </button>

        </div>
      )}


      {/* =====================================================
          MAIN CARD
      ===================================================== */}

      <div className="tc-card">

        {/* ===================================================
            CARD TOP
        =================================================== */}

        <div className="tc-card-top">

          <div className="tc-card-title">

            <div className="tc-title-icon">
              <i className="las la-list"></i>
            </div>

            <div>

              <h2>
                Student Transfer Certificates
              </h2>

              <p>
                View and edit issued transfer certificate records.
              </p>

            </div>

          </div>


          {/* SEARCH */}
          <div className="tc-search-wrapper">

            <i className="las la-search"></i>

            <input
              type="text"
              placeholder="Search student, roll no, class..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                type="button"
                className="tc-search-clear"
                onClick={() => setSearch("")}
              >
                <i className="las la-times"></i>
              </button>
            )}

          </div>

        </div>


        {/* ===================================================
            TABLE
        =================================================== */}

        <div className="tc-table-wrapper">

          {loading ? (

            <div className="tc-loading">

              <div className="tc-loader"></div>

              <h3>
                Loading Transfer Certificates
              </h3>

              <p>
                Please wait while student records are being loaded.
              </p>

            </div>

          ) : filteredStudents.length === 0 ? (

            <div className="tc-empty">

              <div className="tc-empty-icon">
                <i className="las la-file-alt"></i>
              </div>

              <h3>
                No Transfer Certificates Found
              </h3>

              <p>
                {search
                  ? "No records match your search."
                  : "There are currently no transfer certificates available."}
              </p>

              {search && (
                <button
                  type="button"
                  className="tc-clear-search-btn"
                  onClick={() =>
                    setSearch("")
                  }
                >
                  <i className="las la-times"></i>
                  Clear Search
                </button>
              )}

            </div>

          ) : (

            <table className="tc-table">

              <thead>

                <tr>

                  <th className="tc-id-column">
                    #
                  </th>

                  <th>
                    Student
                  </th>

                  <th>
                    Father's Name
                  </th>

                  <th>
                    Last Class
                  </th>

                  <th>
                    Roll No.
                  </th>

                  <th>
                    Session
                  </th>

                  <th className="tc-action-column">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {currentStudents.map(
                  (row, index) => (

                    <tr key={row.id}>

                      {/* SERIAL NUMBER */}

                      <td className="tc-id-cell">

                        <span className="tc-row-number">
                          {startIndex + index + 1}
                        </span>

                      </td>


                      {/* STUDENT */}

                      <td>

                        <div className="tc-student-cell">

                          <div className="tc-student-avatar">
                            {(
                              row.name ||
                              "S"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>

                            <strong>
                              {row.name || "-"}
                            </strong>

                            <span>
                              ID: {row.id || "-"}
                            </span>

                          </div>

                        </div>

                      </td>


                      {/* FATHER */}

                      <td>

                        <span className="tc-text">
                          {row.father_name || "-"}
                        </span>

                      </td>


                      {/* CLASS */}

                      <td>

                        <span className="tc-class-badge">
                          {row.last_class || "-"}
                        </span>

                      </td>


                      {/* ROLL */}

                      <td>

                        <span className="tc-roll">
                          {row.roll_no || "-"}
                        </span>

                      </td>


                      {/* SESSION */}

                      <td>

                        <span className="tc-session">
                          {row.session || "-"}
                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td>

                        <div className="tc-actions">

                          <button
                            type="button"
                            className="tc-action-btn tc-view-btn"
                            title="View Transfer Certificate"
                            onClick={() =>
                              handleView(row.id)
                            }
                          >
                            <i className="las la-eye"></i>
                            <span>View</span>
                          </button>


                          <button
                            type="button"
                            className="tc-action-btn tc-edit-btn"
                            title="Edit Transfer Certificate"
                            onClick={() =>
                              handleEdit(row.id)
                            }
                          >
                            <i className="las la-pen"></i>
                            <span>Edit</span>
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          )}

        </div>


        {/* ===================================================
            CARD FOOTER / PAGINATION
        =================================================== */}

        {!loading &&
          filteredStudents.length > 0 && (

            <div className="tc-card-footer">

              <div className="tc-showing">

                Showing{" "}

                <strong>
                  {startIndex + 1}
                </strong>

                {" "}to{" "}

                <strong>
                  {Math.min(
                    endIndex,
                    filteredStudents.length
                  )}
                </strong>

                {" "}of{" "}

                <strong>
                  {filteredStudents.length}
                </strong>

                {" "}records

              </div>


              {totalPages > 1 && (

                <div className="tc-pagination">

                  {/* PREVIOUS */}

                  <button
                    type="button"
                    className="tc-page-btn tc-prev-btn"
                    disabled={
                      currentPage === 1
                    }
                    onClick={() =>
                      goToPage(
                        currentPage - 1
                      )
                    }
                  >
                    <i className="las la-angle-left"></i>
                  </button>


                  {/* PAGE NUMBERS */}

                  {pageNumbers.map(
                    (page) => (

                      <button
                        key={page}
                        type="button"
                        className={`tc-page-btn ${
                          currentPage === page
                            ? "tc-page-active"
                            : ""
                        }`}
                        onClick={() =>
                          goToPage(page)
                        }
                      >
                        {page}
                      </button>

                    )
                  )}


                  {/* NEXT */}

                  <button
                    type="button"
                    className="tc-page-btn tc-next-btn"
                    disabled={
                      currentPage === totalPages
                    }
                    onClick={() =>
                      goToPage(
                        currentPage + 1
                      )
                    }
                  >
                    <i className="las la-angle-right"></i>
                  </button>

                </div>

              )}

            </div>

          )}

      </div>

    </div>
  );
};

export default TransferCertificate;
