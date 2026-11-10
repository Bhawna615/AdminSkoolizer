
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./MessageView.css";

const BASE_URL =
  "http://localhost/kkblossom/api.php/Adminapi/AdminMessage";

const MessageView = () => {
  const [messages, setMessages] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ================= FILTER STATE =================

  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: "",
    class: "",
    enabled: false,
  });

  // ================= SEARCH STATE =================

  const [search, setSearch] = useState("");

  // =========================================================
  // LOAD CLASSES
  // =========================================================

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/classes`);
        setClasses(res.data?.data || []);
      } catch (err) {
        console.error("CLASS ERROR:", err);
        setClasses([]);
      }
    };

    loadClasses();
  }, []);

  // =========================================================
  // FETCH MESSAGES
  // =========================================================

  const fetchMessages = async () => {
    setLoading(true);

    try {
      let res;

      if (filters.enabled) {
        const filterData = {
          year: Number(filters.year),
          month: filters.month ? Number(filters.month) : "",
          class: filters.class || "",
        };

        console.log("FILTER DATA:", filterData);

        res = await axios.post(`${BASE_URL}/filter`, filterData);
      } else {
        res = await axios.get(`${BASE_URL}/index`);
      }

      console.log("MESSAGE RESPONSE:", res.data);
      setMessages(res.data?.data || []);
    } catch (err) {
      console.error("MESSAGE FETCH ERROR:", err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FETCH WHEN FILTER CHANGES
  // =========================================================

  useEffect(() => {
    fetchMessages();
  }, [
    filters.enabled,
    filters.year,
    filters.month,
    filters.class,
  ]);

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredData = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return messages;
    }

    return messages.filter((row) => {
      const messageId = String(
        row.message_id ?? row.id ?? ""
      ).toLowerCase();

      const name = String(row.Name ?? "").toLowerCase();

      const className = String(row.Class ?? "").toLowerCase();

      const rollNo = String(
        row.Rollno ?? row.RollNo ?? ""
      ).toLowerCase();

      const message = String(row.message ?? "").toLowerCase();

      const file = String(
        row.message_file_url ?? ""
      ).toLowerCase();

      const dateTime = String(row.sent_at ?? "").toLowerCase();

      return (
        messageId.includes(searchValue) ||
        name.includes(searchValue) ||
        className.includes(searchValue) ||
        rollNo.includes(searchValue) ||
        message.includes(searchValue) ||
        file.includes(searchValue) ||
        dateTime.includes(searchValue)
      );
    });
  }, [messages, search]);

  // =========================================================
  // CLEAR SEARCH
  // =========================================================

  const clearSearch = () => {
    setSearch("");
  };

  // =========================================================
  // COLUMNS
  // =========================================================

  const columns = [
    {
      name: "Message ID",
      selector: (row) => row.message_id ?? row.id ?? "-",
      sortable: true,
      width: "115px",
      cell: (row) => (
        <span className="mv-id">
          #{row.message_id ?? row.id ?? "-"}
        </span>
      ),
    },
    {
      name: "To",
      selector: (row) => row.Name ?? "-",
      sortable: true,
      minWidth: "160px",
      cell: (row) => (
        <div className="mv-recipient">
          <div className="mv-avatar">
            {String(row.Name || "U").charAt(0).toUpperCase()}
          </div>
          <span>{row.Name ?? "-"}</span>
        </div>
      ),
    },
    {
      name: "Class",
      selector: (row) => row.Class ?? "-",
      sortable: true,
      width: "115px",
      cell: (row) => (
        <span className="mv-class-badge">
          {row.Class ?? "-"}
        </span>
      ),
    },
    {
      name: "Roll No",
      selector: (row) => row.Rollno ?? row.RollNo ?? "-",
      sortable: true,
      width: "105px",
    },
    {
      name: "Message",
      selector: (row) => row.message ?? "-",
      wrap: true,
      minWidth: "250px",
      grow: 2,
      cell: (row) => (
        <div className="mv-message-cell" title={row.message || ""}>
          <i className="bi bi-chat-left-text"></i>
          <span>{row.message ?? "-"}</span>
        </div>
      ),
    },
    {
      name: "File",
      cell: (row) =>
        row.message_file_url ? (
          <a
            href={row.message_file_url}
            target="_blank"
            rel="noreferrer"
            className="mv-file-link"
          >
            <i className="bi bi-paperclip"></i>
            View File
          </a>
        ) : (
          <span className="mv-no-file">No file</span>
        ),
      width: "115px",
    },
    {
      name: "Date / Time",
      selector: (row) => row.sent_at ?? "-",
      sortable: true,
      minWidth: "165px",
      cell: (row) => (
        <div className="mv-date-cell">
          <i className="bi bi-calendar3"></i>
          <span>{row.sent_at ?? "-"}</span>
        </div>
      ),
    },
  ];

  // =========================================================
  // DATA TABLE STYLES
  // =========================================================

  const customStyles = {
    table: {
      style: {
        backgroundColor: "#ffffff",
      },
    },
    headRow: {
      style: {
        minHeight: "54px",
        backgroundColor: "#f7f5ff",
        borderBottom: "1px solid #e9e4fb",
      },
    },
    headCells: {
      style: {
        color: "#514477",
        fontSize: "12px",
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: "0.45px",
        paddingLeft: "16px",
        paddingRight: "16px",
      },
    },
    rows: {
      style: {
        minHeight: "66px",
        color: "#4b4560",
        fontSize: "13px",
        borderBottom: "1px solid #f0edf7",
        backgroundColor: "#ffffff",
        transition: "background-color 0.2s ease",
      },
      highlightOnHoverStyle: {
        backgroundColor: "#faf8ff",
        borderBottomColor: "#e8e1fb",
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
        borderTop: "1px solid #eeeaf7",
        color: "#6f6882",
        fontSize: "12px",
      },
      pageButtonsStyle: {
        borderRadius: "7px",
        height: "32px",
        width: "32px",
        padding: "5px",
        margin: "2px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        color: "#6c4ce8",
        fill: "#6c4ce8",
        backgroundColor: "transparent",
        "&:disabled": {
          cursor: "not-allowed",
          color: "#c8c2d8",
          fill: "#c8c2d8",
        },
        "&:hover:not(:disabled)": {
          backgroundColor: "#f0ebff",
        },
        "&:focus": {
          outline: "none",
          backgroundColor: "#f0ebff",
        },
      },
    },
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="mv-page">
      {/* PAGE HEADER */}

      <div className="mv-page-header">
        <div className="mv-heading-left">
          <div className="mv-heading-icon">
            <i className="bi bi-envelope-paper-fill"></i>
          </div>

          <div>
            <h1>Messages</h1>
            <p>View and manage messages sent to students and parents</p>
          </div>
        </div>

        <div className="mv-header-count">
          <i className="bi bi-envelope-check"></i>
          <span>{messages.length} Total Messages</span>
        </div>
      </div>

      {/* FILTER CARD */}

      <div className="mv-filter-card">
        <div className="mv-filter-header">
          <div className="mv-filter-title">
            <div className="mv-filter-icon">
              <i className="bi bi-funnel-fill"></i>
            </div>

            <div>
              <h2>Message Filter</h2>
              <p>Filter messages by year, month and class</p>
            </div>
          </div>

          <label className="mv-filter-toggle">
            <span>Enable Filter</span>

            <input
              type="checkbox"
              checked={filters.enabled}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  enabled: e.target.checked,
                }))
              }
            />

            <span className="mv-toggle-slider"></span>
          </label>
        </div>

        <div className="mv-filter-divider"></div>

        <div className="mv-filter-fields">
          {/* YEAR */}

          <div className="mv-filter-field">
            <label>
              <i className="bi bi-calendar3"></i>
              Year
            </label>

            <div className="mv-select-wrapper">
              <select
                value={filters.year}
                disabled={!filters.enabled}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    year: Number(e.target.value),
                  }))
                }
              >
                <option value={new Date().getFullYear()}>
                  {new Date().getFullYear()}
                </option>

                <option value={new Date().getFullYear() - 1}>
                  {new Date().getFullYear() - 1}
                </option>

                <option value={new Date().getFullYear() - 2}>
                  {new Date().getFullYear() - 2}
                </option>
              </select>

              <i className="bi bi-chevron-down"></i>
            </div>
          </div>

          {/* MONTH */}

          <div className="mv-filter-field">
            <label>
              <i className="bi bi-calendar-month"></i>
              Month
            </label>

            <div className="mv-select-wrapper">
              <select
                value={filters.month}
                disabled={!filters.enabled}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    month: e.target.value,
                  }))
                }
              >
                <option value="">Select Month</option>

                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((monthName, index) => (
                  <option key={index} value={index + 1}>
                    {monthName}
                  </option>
                ))}
              </select>

              <i className="bi bi-chevron-down"></i>
            </div>
          </div>

          {/* CLASS */}

          <div className="mv-filter-field">
            <label>
              <i className="bi bi-mortarboard-fill"></i>
              Class
            </label>

            <div className="mv-select-wrapper">
              <select
                value={filters.class}
                disabled={!filters.enabled}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    class: e.target.value,
                  }))
                }
              >
                <option value="">Select Class</option>

                {classes.map((c, index) => (
                  <option key={index} value={c.Classname}>
                    {c.Classname}
                  </option>
                ))}
              </select>

              <i className="bi bi-chevron-down"></i>
            </div>
          </div>
        </div>

        <div className="mv-filter-info">
          <i className="bi bi-info-circle-fill"></i>
          <span>
            Enable the filter to search messages by year, month and class.
          </span>
        </div>
      </div>

      {/* SEARCH AND RESULTS */}

      <div className="mv-toolbar">
        <div className="mv-toolbar-title">
          <h2>All Messages</h2>
          <p>Browse the messages sent from your school</p>
        </div>

        <div className="mv-search-area">
          <div className="mv-search-wrapper">
            <i className="bi bi-search mv-search-icon"></i>

            <input
              type="text"
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search.length > 0 && (
              <button
                type="button"
                className="mv-search-clear"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            )}
          </div>

          <div className="mv-search-result">
            {search.trim() ? (
              <>
                Showing <strong>{filteredData.length}</strong> of{" "}
                <strong>{messages.length}</strong> messages
              </>
            ) : (
              <>
                <strong>{messages.length}</strong> messages
              </>
            )}
          </div>
        </div>
      </div>

      {/* DATA TABLE */}

      <div className="mv-table-card">
        <DataTable
          columns={columns}
          data={filteredData}
          progressPending={loading}
          pagination
          highlightOnHover
          striped
          dense
          fixedHeader
          fixedHeaderScrollHeight="500px"
          persistTableHead
          customStyles={customStyles}
          noDataComponent={
            <div className="mv-empty-state">
              <div className="mv-empty-icon">
                <i className="bi bi-envelope-open"></i>
              </div>

              <h3>
                {loading
                  ? "Loading messages..."
                  : search.trim()
                  ? "No matching messages"
                  : "No messages found"}
              </h3>

              <p>
                {loading
                  ? "Please wait while messages are being loaded."
                  : search.trim()
                  ? `No messages found for "${search}". Try another search.`
                  : "Messages sent from the school will appear here."}
              </p>
            </div>
          }
        />
      </div>

      {/* FLOATING ACTION BUTTON */}

      <button
        type="button"
        className="mv-fab"
        onClick={() =>
          navigate("/dashboard/MessageComponent/CreateMessage")
        }
        aria-label="Create new message"
        title="Create New Message"
      >
        <i className="bi bi-plus-lg"></i>
        <span>New Message</span>
      </button>
    </div>
  );
};

export default MessageView;
