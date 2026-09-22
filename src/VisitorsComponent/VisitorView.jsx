
import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import "./VisitorView.css";

const BASE_URL =
  "http://localhost/kkblossom/api.php/Adminapi/AdminVisitors";

const VisitorView = () => {
  const [visitors, setVisitors] = useState([]);
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ================= LOAD DATA =================
  const loadData = async () => {
    setLoading(true);

    try {
      const res = await axios.get(BASE_URL);
      setVisitors(res.data.data || []);
    } catch (error) {
      console.log("API ERROR:", error.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // ================= EXIT =================
  const handleExit = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await axios.post(`${BASE_URL}/deleteVisitor/${id}`);
      loadData();
    } catch (error) {
      console.log("EXIT ERROR:", error.message);
    }
  };

  // ================= SEARCH =================
  const filteredData = visitors.filter(
    (item) =>
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.phone?.toLowerCase().includes(search.toLowerCase()) ||
      item.address?.toLowerCase().includes(search.toLowerCase())
  );

  // ================= COLUMNS =================
  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Address",
      selector: (row) => row.address,
    },
    {
      name: "Purpose",
      selector: (row) => row.purpose,
    },
    {
      name: "Contact",
      selector: (row) => row.phone,
    },
    {
      name: "Whom To Meet",
      selector: (row) => row.whom_to_meet,
    },
    {
      name: "Entered At",
      selector: (row) => row.created_at,
    },
    {
      name: "Exit At",
      selector: (row) => row.exit_at || "-",
    },
    {
      name: "Action",
      cell: (row) =>
        !row.exit_at ? (
          <button
            className="visitor-exit-btn"
            onClick={() => handleExit(row.id)}
          >
            Exit
          </button>
        ) : (
          <span className="visitor-done">Done</span>
        ),
    },
  ];

  return (
    <div className="visitor-view-page">

      {/* ================= TOP BAR ================= */}
      <div className="visitor-top-bar">

        {/* LEFT */}
        <div className="visitor-entries">
          <span>Show</span>

          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>

          <span>entries</span>
        </div>

        {/* RIGHT */}
        <div className="visitor-search">
          <label>Search:</label>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search visitors..."
          />
        </div>
      </div>

      {/* ================= NEW VISITOR BUTTON ================= */}
      <div className="visitor-action-bar">
        <button
          className="new-visitor-btn"
          onClick={() =>
            navigate("/dashboard/VisitorsComponent/VisitorAdd")
          }
        >
          + New Visitor
        </button>
      </div>

      {/* ================= DATA TABLE ================= */}
      <div className="visitor-table-wrapper">
        <DataTable
          columns={columns}
          data={filteredData}
          progressPending={loading}
          pagination
          paginationPerPage={perPage}
          highlightOnHover
          striped
          responsive
          fixedHeader
          fixedHeaderScrollHeight="500px"
          customStyles={customStyles}
        />
      </div>
    </div>
  );
};

// ================= TABLE STYLES =================
const customStyles = {
  table: {
    style: {
      width: "100%",
    },
  },

  headRow: {
    style: {
      backgroundColor: "#2C56BB",
      minHeight: "46px",
      borderBottom: "none",
    },
  },

  headCells: {
    style: {
      color: "#ffffff",
      fontSize: "12px",
      fontWeight: "600",
      textTransform: "uppercase",
      paddingLeft: "12px",
      paddingRight: "12px",
    },
  },

  rows: {
    style: {
      minHeight: "48px",
      fontSize: "13px",
      color: "#333333",
    },
  },

  cells: {
    style: {
      paddingLeft: "12px",
      paddingRight: "12px",
    },
  },

  pagination: {
    style: {
      minHeight: "52px",
      borderTop: "1px solid #e5e8ed",
    },
  },
};

export default VisitorView;
