import React, { useEffect, useState, useMemo } from "react";
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

  // ================= MESSAGE BOX =================
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const navigate = useNavigate();

  // ================= SHOW MESSAGE =================
  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  // ================= LOAD =================
  const loadPosts = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setPosts(res.data || []);
    } catch (error) {
      console.error("LOAD ERROR:", error);
      showMessage("Failed to load posts ❌", "error");
      setPosts([]);
    }
  };

  // ================= DELETE =================
  const deletePost = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/delete/${id}`);

      console.log("DELETE RESPONSE:", res.data);

      // SUCCESS MESSAGE IN OVERLAY
      showMessage("Post deleted successfully ✅", "success");

      // REFRESH POSTS
      await loadPosts();
    } catch (error) {
      console.error("DELETE ERROR:", error);

      showMessage("Failed to delete post ❌", "error");
    }
  };

  // ================= EFFECT =================
  useEffect(() => {
    loadPosts();
  }, []);

  // ================= FILTER + SEARCH =================
  const filteredData = useMemo(() => {
    let data = Array.isArray(posts) ? [...posts] : [];

    // ================= YEAR + MONTH FILTER =================
    if (filterEnabled) {
      data = data.filter((p) => {
        if (!p.created_at) return false;

        // Replaced space with 'T' for reliable browser date parsing
        const postDate = new Date(p.created_at.replace(" ", "T"));

        const postYear = postDate.getFullYear();
        const postMonth = postDate.getMonth() + 1;

        return postYear === year && postMonth === month;
      });
    }

    // ================= SEARCH =================
    if (search) {
      data = data.filter(
        (p) =>
          p.recipient_group
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          p.text
            ?.toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    return data;
  }, [posts, year, month, filterEnabled, search]);

  // ================= COLUMNS =================
  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },

    {
      name: "Group",
      selector: (row) => row.recipient_group,
    },

    {
      name: "Text",
      selector: (row) => row.text,
      wrap: true,
    },

    {
      name: "File",
      cell: (row) =>
        row.url ? (
          <a
            href={row.url}
            target="_blank"
            rel="noreferrer"
          >
            View
          </a>
        ) : (
          "-"
        ),
    },

    {
      name: "Date",
      selector: (row) => row.created_at,
    },

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

      {/* ================= CREATE BUTTON ================= */}
      <button
        className="fab"
        onClick={() =>
          navigate("/dashboard/PostComponent/CreatePost")
        }
      >
        ✎
      </button>

      {/* ================= FILTER BAR ================= */}
      <div className="filter-bar">

        {/* ================= ENABLE FILTER TOGGLE ================= */}
        <div className="filter-toggle-container">
          <span className="filter-toggle-text">
            Enable Filter
          </span>

          <label className="filter-switch">
            <input
              type="checkbox"
              checked={filterEnabled}
              onChange={(e) =>
                setFilterEnabled(e.target.checked)
              }
            />

            <span className="filter-slider"></span>
          </label>
        </div>

        {/* YEAR */}
        <select
          value={year}
          disabled={!filterEnabled}
          onChange={(e) => {
            setYear(Number(e.target.value));
          }}
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

        {/* MONTH */}
        <select
          value={month}
          disabled={!filterEnabled}
          onChange={(e) => {
            setMonth(Number(e.target.value));
          }}
        >
          {[...Array(12)].map((_, i) => (
            <option
              key={i + 1}
              value={i + 1}
            >
              {new Date(
                2000,
                i,
                1
              ).toLocaleString("default", {
                month: "long",
              })}
            </option>
          ))}
        </select>

      </div>

      {/* ================= SEARCH ================= */}
      <input
        type="text"
        style={{
          backgroundColor: "white",
          width: "30%",
        }}
        placeholder="Search..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      {/* ================= DATATABLE ================= */}
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

      {/* =====================================================
          MESSAGE OVERLAY
      ===================================================== */}
      {message && (
        <div className="post-message-overlay">
          <div
            className={`post-message-box ${messageType}`}
          >
            <div className="post-message-icon">
              {messageType === "success" ? "✓" : "!"}
            </div>

            <div className="post-message-text">
              {message}
            </div>
          </div>
        </div>
      )}

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