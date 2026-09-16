import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import "./PostView.css";

const BASE_URL = "http://localhost/kkblossom/api.php/Adminapi/AdminPosts";

const PostView = () => {
  const [posts, setPosts] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [filterEnabled, setFilterEnabled] = useState(false);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // ================= LOAD =================
  const loadPosts = async () => {
    const res = await axios.get(BASE_URL);
    setPosts(res.data || []);
  };

  // ================= FILTER =================
  const filterPosts = async () => {
    const res = await axios.get(`${BASE_URL}/filter/${year}/${month}`);
    setPosts(res.data || []);
  };

  // ================= DELETE =================
  const deletePost = async (id) => {
    if (window.confirm("Delete this post?")) {
      await axios.get(`${BASE_URL}/delete/${id}`);
      filterEnabled ? filterPosts() : loadPosts();
    }
  };

  // ================= EFFECT =================
  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (filterEnabled) {
      filterPosts();
    } else {
      loadPosts(); // ✅ IMPORTANT FIX
    }
  }, [year, month, filterEnabled]);

  // ================= SEARCH =================
  const filteredData = posts.filter(
    (p) =>
      p.recipient_group?.toLowerCase().includes(search.toLowerCase()) ||
      p.text?.toLowerCase().includes(search.toLowerCase())
  );

  // ================= COLUMNS =================
  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "Group", selector: (row) => row.recipient_group },
    { name: "Text", selector: (row) => row.text, wrap: true },
    {
      name: "File",
      cell: (row) =>
        row.url ? (
          <a href={row.url} target="_blank" rel="noreferrer">
            View
          </a>
        ) : (
          "-"
        ),
    },
    { name: "Date", selector: (row) => row.created_at },
    {
      name: "Action",
      cell: (row) => (
        <button
          onClick={() => deletePost(row.id)}
          style={{
            background: "#ff4d4f",
            border: "none",
            color: "#fff",
            padding: "6px 10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          🗑
        </button>
      ),
    },
  ];

  return (
    <div className="container">

      {/* CREATE BUTTON */}
      <button
        className="fab"
        onClick={() =>
          navigate("/dashboard/PostComponent/CreatePost")
        }
      >
        ✎
      </button>

      {/* FILTER BAR */}
      <div className="filter-bar">

        <label className="filter-toggle">
          Enable Filter
          <input
            type="checkbox"
            checked={filterEnabled}
            onChange={(e) => setFilterEnabled(e.target.checked)}
          />
        </label>

        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option>{new Date().getFullYear()}</option>
          <option>{new Date().getFullYear() - 1}</option>
          <option>{new Date().getFullYear() - 2}</option>
        </select>

        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", {
                month: "long",
              })}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* DATATABLE */}
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        striped
        responsive
        dense
        customStyles={customStyles}
      />
    </div>
  );
};

// ================= STYLE =================
const customStyles = {
  headRow: {
    style: {
      backgroundColor: "#2d4cc8",
    },
  },
  headCells: {
    style: {
      color: "#fff",
      fontWeight: "600",
      fontSize: "13px",
      textTransform: "uppercase",
    },
  },
  rows: {
    style: {
      fontSize: "13px",
    },
  },
};

export default PostView;