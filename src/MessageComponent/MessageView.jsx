import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import "./MessageView.css";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost/kkblossom/api.php/Adminapi/AdminMessage";

const MessageView = () => {
  const [messages, setMessages] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ✅ SAME STRUCTURE AS PAYMENT
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: "",
    class: "",
    enabled: false,
  });

  // ================= LOAD CLASSES =================
  useEffect(() => {
    axios.get(`${BASE_URL}/classes`).then((res) => {
      setClasses(res.data.data || []);
    });
  }, []);

  // ================= FETCH DATA =================
  const fetchMessages = async () => {
    setLoading(true);

    try {
      let res;

      if (filters.enabled) {
        // ✅ FILTER ON
        res = await axios.post(`${BASE_URL}/filter`, {
          year: Number(filters.year),
          month: Number(filters.month),
          class: filters.class,
        });
      } else {
        // ❌ FILTER OFF
        res = await axios.get(`${BASE_URL}/index`);
      }

      setMessages(res.data.data || []);
    } catch (err) {
      console.error("ERROR:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, [filters]);

  // ================= SEARCH =================
  const [search, setSearch] = useState("");

  const filteredData = messages.filter(
    (m) =>
      m.Name?.toLowerCase().includes(search.toLowerCase()) ||
      m.message?.toLowerCase().includes(search.toLowerCase())
  );

  // ================= COLUMNS =================
  const columns = [
    {
      name: "Message ID",
      selector: (row) => row.message_id || row.id,
      sortable: true,
    },
    {
      name: "To",
      selector: (row) => row.Name,
    },
    {
      name: "Class",
      selector: (row) => row.Class,
    },
    {
      name: "Roll No",
      selector: (row) => row.Rollno,
    },
    {
      name: "Message",
      selector: (row) => row.message,
      wrap: true,
    },
    {
      name: "File",
      cell: (row) =>
        row.message_file_url ? (
          <a href={row.message_file_url} target="_blank" rel="noreferrer">
            View File
          </a>
        ) : (
          "-"
        ),
    },
    {
      name: "Date/Time",
      selector: (row) => row.sent_at,
      sortable: true,
    },
  ];

  return (
    <div className="container">

      {/* FILTER BAR SAME AS PAYMENT */}
      <div className="filter-bar">

        <label className="filter-toggle">
          Enable Filter
          <input
            type="checkbox"
            checked={filters.enabled}
            onChange={(e) =>
              setFilters({ ...filters, enabled: e.target.checked })
            }
          />
        </label>

        {/* YEAR */}
        <select
          value={filters.year}
          onChange={(e) =>
            setFilters({ ...filters, year: e.target.value })
          }
        >
          <option>{new Date().getFullYear()}</option>
          <option>{new Date().getFullYear() - 1}</option>
          <option>{new Date().getFullYear() - 2}</option>
        </select>

        {/* MONTH */}
        <select
          value={filters.month}
          onChange={(e) =>
            setFilters({ ...filters, month: e.target.value })
          }
        >
          <option value="">Select Month</option>
          {[
            "January","February","March","April","May","June",
            "July","August","September","October","November","December"
          ].map((m, i) => (
            <option key={i} value={i + 1}>{m}</option>
          ))}
        </select>

        {/* CLASS */}
        <select
          value={filters.class}
          onChange={(e) =>
            setFilters({ ...filters, class: e.target.value })
          }
        >
          <option value="">Select Class</option>
          {classes.map((c, i) => (
            <option key={i} value={c.Classname}>
              {c.Classname}
            </option>
          ))}
        </select>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search..."
        className="search-box"
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* DATATABLE */}
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
      />

      {/* FLOAT BUTTON */}
      <button
        className="fab"
        onClick={() =>
          navigate("/dashboard/MessageComponent/CreateMessage")
        }
      >
        ✎
      </button>
    </div>
  );
};

export default MessageView;