import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import "./HomeworkView.css";

const API = "http://localhost/kkblossom/api.php/Adminapi/Homework";

export default function HomeworkView() {

  const [classes, setClasses] = useState([]);
  const [homework, setHomework] = useState([]);

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [selectedClass, setSelectedClass] = useState("");

  const [filterEnabled, setFilterEnabled] = useState(false);

  // ================= GET CLASSES =================
  useEffect(() => {
    axios
      .get(`${API}/getClasses`)
      .then((res) => {
        const data = res.data.data || [];

        setClasses(data);

        if (data.length > 0) {
          setSelectedClass(data[0].Classname);
        }
      })
      .catch(console.log);
  }, []);

  // ================= FILTER LOGIC =================
  useEffect(() => {

    if (!filterEnabled) {
      loadHomework();
      return;
    }

    if (!selectedClass) return;

    filterHomework();

  }, [year, month, selectedClass, filterEnabled]);

  // ================= LOAD =================
  const loadHomework = async () => {
    try {
      const res = await axios.get(`${API}/display`);
      setHomework(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= FILTER =================
  const filterHomework = async () => {
    try {
      const res = await axios.get(
        `${API}/filter/${year}/${month}/${selectedClass}`
      );

      setHomework(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= DELETE =================
  const deleteHomework = async (id) => {

    if (!window.confirm("Are you sure ?")) return;

    try {
      await axios.get(`${API}/delete/${id}`);

      alert("Deleted Successfully");

      if (filterEnabled) {
        filterHomework();
      } else {
        loadHomework();
      }

    } catch (err) {
      console.log(err);
    }
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    {
      name: "Class",
      selector: (row) => row.Class,
      sortable: true,
      width: "100px",
    },
    {
      name: "Subject",
      selector: (row) => row.Subjectname,
      sortable: true,
      width: "150px",
    },
    {
      name: "Homework",
      selector: (row) => row.Assignment,
      grow: 2,
      wrap: true,
    },
    {
      name: "Date",
      selector: (row) =>
        new Date(row.Date).toLocaleDateString(),
      sortable: true,
      width: "125px",
    },
    {
      name: "File",
      cell: (row) =>
        row.file_url ? (
          <a
            href={row.file_url}
            target="_blank"
            rel="noreferrer"
            className="homework-view-file-btn"
          >
            <i className="bi bi-eye"></i>
            View
          </a>
        ) : (
          <span className="homework-view-no-file">
            <i className="bi bi-dash"></i>
          </span>
        ),
      width: "120px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          className="homework-view-delete-btn"
          onClick={() => deleteHomework(row.id)}
          title="Delete Homework"
        >
          <i className="bi bi-trash3"></i>
        </button>
      ),
      width: "100px",
      center: true,
    },
  ];

  // ================= TABLE STYLES =================
  const customStyles = {
    table: {
      style: {
        backgroundColor: "#ffffff",
      },
    },

    headRow: {
      style: {
        minHeight: "50px",
        backgroundColor: "#faf9ff",
        borderBottom: "1px solid #ece9f4",
      },
    },

    headCells: {
      style: {
        color: "#625a73",
        fontSize: "11px",
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: "0.3px",
        paddingLeft: "16px",
        paddingRight: "16px",
      },
    },

    rows: {
      style: {
        minHeight: "58px",
        color: "#514a61",
        fontSize: "12px",
        borderBottom: "1px solid #f0edf5",
      },

      highlightOnHoverStyle: {
        backgroundColor: "#faf9ff",
        transitionDuration: "0.15s",
        outline: "none",
      },
    },

    cells: {
      style: {
        paddingLeft: "16px",
        paddingRight: "16px",
      },
    },

    pagination: {
      style: {
        minHeight: "58px",
        borderTop: "1px solid #ece9f4",
        backgroundColor: "#ffffff",
        color: "#777084",
        fontSize: "11px",
      },
    },

    noData: {
      style: {
        minHeight: "150px",
        color: "#9891a5",
        fontSize: "12px",
      },
    },
  };

  return (
    <div className="homework-view-page">

      {/* ================= PAGE HEADER ================= */}
      <div className="homework-view-header">

        <div className="homework-view-header-left">

          <div className="homework-view-header-icon">
            <i className="bi bi-journal-check"></i>
          </div>

          <div>
            <h2>Homework</h2>
            <p>View and manage assigned homework</p>
          </div>

        </div>

        <div className="homework-view-total">
          <span>Total</span>
          <strong>{homework.length}</strong>
        </div>

      </div>


      {/* ================= FILTER CARD ================= */}
      <div className="homework-view-filter-card">

        <div className="homework-view-filter-heading">

          <div className="homework-view-filter-heading-icon">
            <i className="bi bi-funnel-fill"></i>
          </div>

          <div>
            <h3>Homework Filter</h3>
            <p>
              Filter homework by year, month and class
            </p>
          </div>

        </div>


        <div className="homework-view-filter-controls">

          {/* TOGGLE */}
          <div className="homework-view-toggle-container">

            <span className="homework-view-toggle-label">
              Enable Filter
            </span>

            <label className="homework-view-switch">

              <input
                type="checkbox"
                checked={filterEnabled}
                onChange={() =>
                  setFilterEnabled((prev) => !prev)
                }
              />

              <span className="homework-view-slider"></span>

            </label>

            <span
              className={`homework-view-toggle-status ${
                filterEnabled ? "active" : ""
              }`}
            >
              {filterEnabled ? "ON" : "OFF"}
            </span>

          </div>


          {/* YEAR */}
          <div className="homework-view-filter-field">

            <label>
              <i className="bi bi-calendar3"></i>
              Year
            </label>

            <div className="homework-view-select-wrapper">

              <select
                value={year}
                onChange={(e) =>
                  setYear(Number(e.target.value))
                }
                disabled={!filterEnabled}
              >
                <option>
                  {new Date().getFullYear()}
                </option>

                <option>
                  {new Date().getFullYear() - 1}
                </option>

                <option>
                  {new Date().getFullYear() - 2}
                </option>
              </select>

              <i className="bi bi-chevron-down"></i>

            </div>

          </div>


          {/* MONTH */}
          <div className="homework-view-filter-field">

            <label>
              <i className="bi bi-calendar-month"></i>
              Month
            </label>

            <div className="homework-view-select-wrapper">

              <select
                value={month}
                onChange={(e) =>
                  setMonth(Number(e.target.value))
                }
                disabled={!filterEnabled}
              >
                {[...Array(12)].map((_, i) => (
                  <option
                    key={i}
                    value={i + 1}
                  >
                    {i + 1}
                  </option>
                ))}
              </select>

              <i className="bi bi-chevron-down"></i>

            </div>

          </div>


          {/* CLASS */}
          <div className="homework-view-filter-field homework-view-class-field">

            <label>
              <i className="bi bi-people-fill"></i>
              Class
            </label>

            <div className="homework-view-select-wrapper">

              <select
                value={selectedClass}
                onChange={(e) =>
                  setSelectedClass(e.target.value)
                }
                disabled={!filterEnabled}
              >

                <option value="">
                  Select Class
                </option>

                {classes.map((c, i) => (
                  <option
                    key={i}
                    value={c.Classname}
                  >
                    Class {c.Classname}
                  </option>
                ))}

              </select>

              <i className="bi bi-chevron-down"></i>

            </div>

          </div>

        </div>

      </div>


      {/* ================= TABLE CARD ================= */}
      <div className="homework-view-table-card">

        <div className="homework-view-table-header">

          <div className="homework-view-table-title">

            <div className="homework-view-table-title-icon">
              <i className="bi bi-list-task"></i>
            </div>

            <div>
              <h3>Assigned Homework</h3>

              <p>
                {filterEnabled
                  ? `Showing filtered homework for Class ${selectedClass || "-"}`
                  : "Showing all assigned homework"}
              </p>
            </div>

          </div>

          <div className="homework-view-record-count">
            <i className="bi bi-file-earmark-text"></i>
            {homework.length} Records
          </div>

        </div>

        <div className="homework-view-table-wrapper">

          <DataTable
            columns={columns}
            data={homework}
            pagination
            highlightOnHover
            responsive
            customStyles={customStyles}
            striped
            persistTableHead
            noDataComponent={
              <div className="homework-view-empty">
                <div className="homework-view-empty-icon">
                  <i className="bi bi-journal-x"></i>
                </div>

                <strong>No Homework Found</strong>

                <span>
                  There is no homework available to display.
                </span>
              </div>
            }
          />

        </div>

      </div>

    </div>
  );
}