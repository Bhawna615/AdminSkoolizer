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
  const sortedData = [...res.data].sort(
    (a, b) =>
      new Date(b.date_of_birth) -
      new Date(a.date_of_birth)
  );

  setTeachers(sortedData);

  setSuccess("Former teachers loaded successfully");
  setError("");

  // Hide success message after 3 seconds
  setTimeout(() => {
    setSuccess("");
  }, 3000);

} else {
  setTeachers([]);

  setError("No Former Teachers Found");
  setSuccess("");

  // Hide error message after 3 seconds
  setTimeout(() => {
    setError("");
  }, 3000);
}


} catch (err) {
console.error(err);


setError("Failed to load former teachers.");
setSuccess("");

// Hide error message after 3 seconds
setTimeout(() => {
  setError("");
}, 3000);


}
};

/* ================= FILTER ================= */

const filteredTeachers = teachers.filter(
(t) =>
t.name?.toLowerCase().includes(search.toLowerCase()) ||
t.designation?.toLowerCase().includes(search.toLowerCase()) ||
t.contact?.includes(search)
);

/* ================= PAGINATION ================= */

const indexOfLast = currentPage * entries;
const indexOfFirst = indexOfLast - entries;

const currentTeachers =
filteredTeachers.slice(
indexOfFirst,
indexOfLast
);

const totalPages = Math.ceil(
filteredTeachers.length / entries
);

const columns = [
"NAME",
"DESIGNATION",
"DATE OF BIRTH",
"DATE OF JOINING",
"DATE OF LEAVING",
"CONTACT",
];

return ( <div className="former-list-page">


  {/* ================= HEADER ================= */}

  <div className="former-list-header">

    <div>

      <div className="former-list-title-row">

        <div className="former-list-title-icon">
          <i className="bi bi-person-dash-fill"></i>
        </div>

        <div>
          <h2>Former Teachers</h2>

          <p>
            Manage and view teachers who have
            left the organization
          </p>
        </div>

      </div>

    </div>


    <div className="former-list-total-card">

      <div className="former-list-total-icon">
        <i className="bi bi-people-fill"></i>
      </div>

      <div>
        <span>Total Former Teachers</span>

        <strong>
          {teachers.length}
        </strong>
      </div>

    </div>

  </div>


  {/* ================= SUCCESS / ERROR ================= */}

  {success && (

<div className="former-list-success"> <i className="bi bi-check-circle-fill"></i> {success} </div> )}

{error && (

<div className="former-list-error"> <i className="bi bi-exclamation-triangle-fill"></i> {error} </div> )}

    

  


  {/* ================= MAIN CARD ================= */}

  <div className="former-list-card">


    {/* ================= TABLE HEADER ================= */}

    <div className="former-list-card-header">

      <div>

        <h3>
          <i className="bi bi-person-lines-fill"></i>

          Teacher Records
        </h3>

        <p>
          Browse and search former teacher information
        </p>

      </div>

    </div>


    {/* ================= CONTROLS ================= */}

    <div className="former-list-controls">


      {/* SHOW ENTRIES */}

      <div className="former-list-entries">

        <span>Show</span>

        <select
          value={entries}
          onChange={(e) => {
            setEntries(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          {[5, 10, 25, 50, 100].map(
            (num) => (

              <option
                key={num}
                value={num}
              >
                {num}
              </option>

            )
          )}
        </select>

        <span>entries</span>

      </div>


      {/* SEARCH */}

      <div className="former-list-search">

        <i className="bi bi-search"></i>

        <input
          type="text"
          placeholder="Search teacher..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

      </div>

    </div>


    {/* ================= TABLE ================= */}

    <div className="former-list-table-wrapper">

      <table className="former-list-table">

        <thead>

          <tr>

            {columns.map((col) => (

              <th key={col}>
                {col}
              </th>

            ))}

          </tr>

        </thead>


        <tbody>

          {currentTeachers.length > 0 ? (

            currentTeachers.map((t, idx) => (

              <tr
                key={t.id || idx}
              >

                <td>

                  <div className="former-list-name">

                    <div className="former-list-avatar">

                      {t.name
                        ? t.name
                            .charAt(0)
                            .toUpperCase()
                        : "T"}

                    </div>

                    <span>
                      {t.name}
                    </span>

                  </div>

                </td>


                <td>

                  <span className="former-list-designation">
                    {t.designation}
                  </span>

                </td>


                <td>

                  <span className="former-list-date">

                    <i className="bi bi-calendar-heart"></i>

                    {t.date_of_birth}

                  </span>

                </td>


                <td>

                  <span className="former-list-date">

                    <i className="bi bi-calendar-check"></i>

                    {t.date_of_joining}

                  </span>

                </td>


                <td>

                  <span className="former-list-leaving-date">

                    <i className="bi bi-calendar-x"></i>

                    {t.date_of_leaving}

                  </span>

                </td>


                <td>

                  <span className="former-list-contact">

                    <i className="bi bi-telephone-fill"></i>

                    {t.contact}

                  </span>

                </td>

              </tr>

            ))

          ) : (

            <tr>

              <td
                colSpan={columns.length}
              >

                <div className="former-list-empty">

                  <div className="former-list-empty-icon">

                    <i className="bi bi-person-x"></i>

                  </div>

                  <h3>
                    No Former Teachers Found
                  </h3>

                  <p>
                    There are currently no former
                    teacher records available.
                  </p>

                </div>

              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>


    {/* ================= PAGINATION ================= */}

    <div className="former-list-pagination">


      {/* SUMMARY */}

      <div className="former-list-pagination-summary">

        Showing{" "}

        <strong>

          {filteredTeachers.length === 0
            ? 0
            : indexOfFirst + 1}

        </strong>

        {" "}to{" "}

        <strong>

          {Math.min(
            indexOfLast,
            filteredTeachers.length
          )}

        </strong>

        {" "}of{" "}

        <strong>
          {filteredTeachers.length}
        </strong>

        {" "}entries

      </div>


      {/* BUTTONS */}

      <div className="former-list-pagination-buttons">


        <button
          className="former-list-page-nav"
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage(
              (prev) => prev - 1
            )
          }
        >

          <i className="bi bi-chevron-left"></i>

          <span>Previous</span>

        </button>


        {[...Array(totalPages)].map(
          (_, idx) => (

            <button
              key={idx}
              className={`former-list-page-number ${
                currentPage === idx + 1
                  ? "former-list-active"
                  : ""
              }`}
              onClick={() =>
                setCurrentPage(idx + 1)
              }
            >

              {idx + 1}

            </button>

          )
        )}


        <button
          className="former-list-page-nav"
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

          <span>Next</span>

          <i className="bi bi-chevron-right"></i>

        </button>

      </div>

    </div>

  </div>

</div>


);
};

export default FormerTeachers;
