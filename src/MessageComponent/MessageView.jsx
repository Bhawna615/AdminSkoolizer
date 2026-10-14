import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import "./MessageView.css";
import { useNavigate } from "react-router-dom";

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

      // =====================================================
      // FILTER ENABLED
      // =====================================================

      if (filters.enabled) {
        const filterData = {
          year: Number(filters.year),
          month: filters.month
            ? Number(filters.month)
            : "",
          class: filters.class || "",
        };

        console.log("FILTER DATA:", filterData);

        res = await axios.post(
          `${BASE_URL}/filter`,
          filterData
        );
      }

      // =====================================================
      // FILTER DISABLED
      // =====================================================

      else {
        res = await axios.get(
          `${BASE_URL}/index`
        );
      }

      console.log("MESSAGE RESPONSE:", res.data);

      setMessages(res.data?.data || []);
    } catch (err) {
      console.error(
        "MESSAGE FETCH ERROR:",
        err
      );

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
  //
  // IMPORTANT:
  // Search is LOCAL.
  // It does NOT call the API.
  // It searches all important fields from the table.
  //
  // =========================================================

  const filteredData = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    // If search is empty, show everything
    if (!searchValue) {
      return messages;
    }

    return messages.filter((row) => {
      const messageId = String(
        row.message_id ?? row.id ?? ""
      ).toLowerCase();

      const name = String(
        row.Name ?? ""
      ).toLowerCase();

      const className = String(
        row.Class ?? ""
      ).toLowerCase();

      const rollNo = String(
        row.Rollno ?? row.RollNo ?? ""
      ).toLowerCase();

      const message = String(
        row.message ?? ""
      ).toLowerCase();

      const file = String(
        row.message_file_url ?? ""
      ).toLowerCase();

      const dateTime = String(
        row.sent_at ?? ""
      ).toLowerCase();

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

      selector: (row) =>
        row.message_id ?? row.id ?? "-",

      sortable: true,
    },

    {
      name: "To",

      selector: (row) =>
        row.Name ?? "-",

      sortable: true,
    },

    {
      name: "Class",

      selector: (row) =>
        row.Class ?? "-",

      sortable: true,
    },

    {
      name: "Roll No",

      selector: (row) =>
        row.Rollno ?? row.RollNo ?? "-",

      sortable: true,
    },

    {
      name: "Message",

      selector: (row) =>
        row.message ?? "-",

      wrap: true,
    },

    {
      name: "File",

      cell: (row) =>
        row.message_file_url ? (
          <a
            href={row.message_file_url}
            target="_blank"
            rel="noreferrer"
          >
            View File
          </a>
        ) : (
          "-"
        ),
    },

    {
      name: "Date/Time",

      selector: (row) =>
        row.sent_at ?? "-",

      sortable: true,
    },
  ];

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="container">

      {/* =====================================================
          FILTER CARD
      ===================================================== */}

      <div className="message-filter-card">

        {/* FILTER HEADER */}

        <div className="message-filter-header">

          <div className="message-filter-title-section">

            <div className="message-filter-icon">
              <i className="bi bi-funnel-fill"></i>
            </div>

            <div>

              <h2>
                Message Filter
              </h2>

              <p>
                Filter messages by year, month and class
              </p>

            </div>

          </div>

          {/* ENABLE FILTER TOGGLE */}

          <label className="message-filter-toggle">

            <span>
              Enable Filter
            </span>

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

            <span className="message-toggle-slider"></span>

          </label>

        </div>

        {/* DIVIDER */}

        <div className="message-filter-divider"></div>

        {/* FILTER FIELDS */}

        <div className="message-filter-fields">

          {/* YEAR */}

          <div className="message-filter-field">

            <label>
              <i className="bi bi-calendar3"></i>
              Year
            </label>

            <div className="message-select-wrapper">

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

                <option
                  value={new Date().getFullYear()}
                >
                  {new Date().getFullYear()}
                </option>

                <option
                  value={new Date().getFullYear() - 1}
                >
                  {new Date().getFullYear() - 1}
                </option>

                <option
                  value={new Date().getFullYear() - 2}
                >
                  {new Date().getFullYear() - 2}
                </option>

              </select>

              <i className="bi bi-chevron-down"></i>

            </div>

          </div>

          {/* MONTH */}

          <div className="message-filter-field">

            <label>
              <i className="bi bi-calendar-month"></i>
              Month
            </label>

            <div className="message-select-wrapper">

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

                <option value="">
                  Select Month
                </option>

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
                  <option
                    key={index}
                    value={index + 1}
                  >
                    {monthName}
                  </option>
                ))}

              </select>

              <i className="bi bi-chevron-down"></i>

            </div>

          </div>

          {/* CLASS */}

          <div className="message-filter-field">

            <label>
              <i className="bi bi-mortarboard-fill"></i>
              Class
            </label>

            <div className="message-select-wrapper">

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

                <option value="">
                  Select Class
                </option>

                {classes.map((c, index) => (
                  <option
                    key={index}
                    value={c.Classname}
                  >
                    {c.Classname}
                  </option>
                ))}

              </select>

              <i className="bi bi-chevron-down"></i>

            </div>

          </div>

        </div>

        {/* FILTER INFORMATION */}

        <div className="message-filter-info">

          <div className="message-filter-info-icon">
            <i className="bi bi-info-circle-fill"></i>
          </div>

          <span>
            Enable the filter to search messages by year,
            month and class.
          </span>

        </div>

      </div>

      {/* =====================================================
          SEARCH SECTION
      ===================================================== */}

      <div className="message-search-section">

        <div className="message-search-wrapper">

          <i className="bi bi-search message-search-icon"></i>

          <input
            type="text"
            placeholder="Search messages..."
            className="search-box"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search.length > 0 && (
            <button
              type="button"
              className="message-search-clear"
              onClick={clearSearch}
            >
              <i className="bi bi-x"></i>
            </button>
          )}

        </div>

        <div className="message-search-result">

          {search.trim() ? (
            <>
              Showing{" "}
              <strong>
                {filteredData.length}
              </strong>{" "}
              of{" "}
              <strong>
                {messages.length}
              </strong>{" "}
              messages
            </>
          ) : (
            <>
              <strong>
                {messages.length}
              </strong>{" "}
              messages
            </>
          )}

        </div>

      </div>

      {/* =====================================================
          DATA TABLE
      ===================================================== */}

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
        noDataComponent={
          loading
            ? "Loading messages..."
            : search.trim()
            ? `No messages found for "${search}"`
            : "No messages found"
        }
      />

      {/* =====================================================
          FLOATING ACTION BUTTON
      ===================================================== */}

      <button
        className="fab"
        onClick={() =>
          navigate(
            "/dashboard/MessageComponent/CreateMessage"
          )
        }
      >
        ✎
      </button>

    </div>
  );
};

export default MessageView;