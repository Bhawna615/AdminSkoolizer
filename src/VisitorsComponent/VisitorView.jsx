import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost/kkblossom/api.php/Adminapi/AdminVisitors";

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
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Address", selector: (row) => row.address },
    { name: "Purpose", selector: (row) => row.purpose },
    { name: "Contact", selector: (row) => row.phone },
    { name: "Whom To Meet", selector: (row) => row.whom_to_meet },
    { name: "Entered At", selector: (row) => row.created_at },
    { name: "Exit At", selector: (row) => row.exit_at || "-" },

    {
      name: "Action",
      cell: (row) =>
        !row.exit_at ? (
          <button
            onClick={() => handleExit(row.id)}
            style={{
              background: "red",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Exit
          </button>
        ) : (
          "Done"
        ),
    },
  ];

  return (
    <div className="container">

      {/* TOP BAR */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        
        {/* LEFT */}
        <div>
          Show{" "}
          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>{" "}
          entries
        </div>

        {/* RIGHT */}
        <div>
          Search:{" "}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: "1px solid grey" }}
          />
        </div>
      </div>

      {/* NEW VISITOR BUTTON */}
      <div style={{ textAlign: "right", marginBottom: 10 }}>
        <button
          style={{
            background: "#2d4cc8",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
          }}
          onClick={() => navigate("/dashboard/VisitorsComponent/VisitorAdd")}
        >
          + New Visitor
        </button>
      </div>

      {/* DATA TABLE */}
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
  );
};

// ================= STYLES =================
const customStyles = {
  headRow: {
    style: {
      backgroundColor: "#2C56BB",
    },
  },
  headCells: {
    style: {
      color: "#fff",
      fontSize: "12px",
      textTransform: "uppercase",
    },
  },
};

export default VisitorView;