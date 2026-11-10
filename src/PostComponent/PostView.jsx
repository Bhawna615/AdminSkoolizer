
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./PostView.css";

const BASE_URL = "http://localhost/kkblossom/api.php/Adminapi/AdminPosts";

const PostView = () => {
    const [posts, setPosts] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [filterEnabled, setFilterEnabled] = useState(false);
    const [search, setSearch] = useState("");

    // MESSAGE
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    // DELETE
    const [selectedPost, setSelectedPost] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

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

    // ================= LOAD POSTS =================

    const loadPosts = async () => {
        try {
            const res = await axios.get(BASE_URL);
            setPosts(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("LOAD ERROR:", error);
            setPosts([]);
            showMessage("Failed to load posts. Please try again.", "error");
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

    // ================= DELETE HANDLERS =================

    const handleDeleteClick = (row) => {
        setSelectedPost(row);
    };

    const confirmDelete = async () => {
        if (!selectedPost || deleteLoading) return;

        try {
            setDeleteLoading(true);

            const res = await axios.get(
                `${BASE_URL}/delete/${selectedPost.id}`
            );

            console.log("DELETE RESPONSE:", res.data);

            setSelectedPost(null);

            showMessage("Post deleted successfully!", "success");

            await loadPosts();

        } catch (error) {
            console.error("DELETE ERROR:", error);

            setSelectedPost(null);

            showMessage(
                error.response?.data?.message ||
                "Failed to delete post. Please try again.",
                "error"
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    // ================= FILTER + SEARCH =================

    const filteredData = useMemo(() => {
        let data = Array.isArray(posts) ? [...posts] : [];

        // YEAR + MONTH FILTER
        if (filterEnabled) {
            data = data.filter((p) => {
                if (!p.created_at) return false;

                const postDate = new Date(
                    String(p.created_at).replace(" ", "T")
                );

                if (isNaN(postDate.getTime())) return false;

                return (
                    postDate.getFullYear() === year &&
                    postDate.getMonth() + 1 === month
                );
            });
        }

        // SEARCH
        if (search.trim()) {
            const searchValue = search.toLowerCase().trim();

            data = data.filter((p) =>
                String(p.recipient_group || "")
                    .toLowerCase()
                    .includes(searchValue) ||

                String(p.text || "")
                    .toLowerCase()
                    .includes(searchValue) ||

                String(p.id || "")
                    .toLowerCase()
                    .includes(searchValue)
            );
        }

        return data;

    }, [posts, year, month, filterEnabled, search]);

    // ================= FORMAT DATE =================

    const formatDate = (date) => {
        if (!date) return "-";

        const parsedDate = new Date(
            String(date).replace(" ", "T")
        );

        if (isNaN(parsedDate.getTime())) return date;

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    // ================= TABLE COLUMNS =================

    const columns = [
        {
            name: "Post ID",
            selector: (row) => row.id,
            sortable: true,
            width: "100px",
            cell: (row) => (
                <span className="pv-id">
                    #{row.id}
                </span>
            )
        },

        {
            name: "Recipient Group",
            selector: (row) => row.recipient_group,
            sortable: true,
            minWidth: "170px",
            cell: (row) => (
                <div className="pv-group-cell">
                    <div className="pv-group-icon">
                        <i className="bi bi-people-fill"></i>
                    </div>

                    <span>
                        {row.recipient_group || "Not specified"}
                    </span>
                </div>
            )
        },

        {
            name: "Post Content",
            selector: (row) => row.text,
            sortable: true,
            wrap: true,
            minWidth: "250px",
            cell: (row) => (
                <div className="pv-content-cell">
                    {row.text || "No text content"}
                </div>
            )
        },

        {
            name: "Attachment",
            cell: (row) => (
                row.url ? (
                    <a
                        href={row.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pv-file-link"
                    >
                        <i className="bi bi-paperclip"></i>
                        View File
                        <i className="bi bi-box-arrow-up-right"></i>
                    </a>
                ) : (
                    <span className="pv-no-file">
                        <i className="bi bi-dash-circle"></i>
                        No File
                    </span>
                )
            ),
            minWidth: "135px"
        },

        {
            name: "Created Date",
            selector: (row) => row.created_at,
            sortable: true,
            minWidth: "145px",
            cell: (row) => (
                <div className="pv-date-cell">
                    <i className="bi bi-calendar3"></i>
                    {formatDate(row.created_at)}
                </div>
            )
        },

        {
            name: "Action",
            button: true,
            width: "95px",
            cell: (row) => (
                <button
                    type="button"
                    className="pv-delete-action"
                    onClick={() => handleDeleteClick(row)}
                    title="Delete Post"
                    aria-label={`Delete post ${row.id}`}
                >
                    <i className="bi bi-trash3"></i>
                </button>
            )
        }
    ];

    // ================= TABLE STYLES =================

    const customStyles = {
        table: {
            style: {
                backgroundColor: "#ffffff",
            }
        },

        headRow: {
            style: {
                backgroundColor: "#f5f2ff",
                minHeight: "55px",
                borderBottom: "1px solid #ebe6f7",
            }
        },

        headCells: {
            style: {
                color: "#62518e",
                fontSize: "11px",
                fontWeight: "750",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                paddingLeft: "16px",
                paddingRight: "16px",
            }
        },

        rows: {
            style: {
                minHeight: "66px",
                fontSize: "12px",
                color: "#514b63",
                backgroundColor: "#ffffff",
                borderBottom: "1px solid #f1eef6",
                transition: "background 0.2s ease",
            },

            highlightOnHoverStyle: {
                backgroundColor: "#faf9ff",
                borderBottomColor: "#e9e3fb",
                outline: "none",
            }
        },

        cells: {
            style: {
                paddingLeft: "16px",
                paddingRight: "16px",
            }
        },

        pagination: {
            style: {
                borderTop: "1px solid #f0edf5",
                minHeight: "60px",
                fontSize: "12px",
                color: "#777187",
            },

            pageButtonsStyle: {
                borderRadius: "7px",
                height: "32px",
                width: "32px",
                padding: "5px",
                margin: "2px",
                cursor: "pointer",
                transition: "0.2s",
                fill: "#7657e8",

                "&:disabled": {
                    cursor: "not-allowed",
                    fill: "#c7c1d4",
                },

                "&:hover:not(:disabled)": {
                    backgroundColor: "#f0ebff",
                }
            }
        }
    };

    return (
        <div className="pv-page">

            {/* ================= HEADER ================= */}

            <div className="pv-header">

                <div className="pv-header-left">

                    <div className="pv-header-icon">
                        <i className="bi bi-megaphone-fill"></i>
                    </div>

                    <div>
                        <h2 className="pv-title">
                            Post Management
                        </h2>

                        <p className="pv-subtitle">
                            Manage announcements, posts and shared attachments
                        </p>
                    </div>

                </div>

                <button
                    type="button"
                    className="pv-create-button"
                    onClick={() =>
                        navigate("/dashboard/PostComponent/CreatePost")
                    }
                >
                    <i className="bi bi-plus-lg"></i>
                    <span>Create New Post</span>
                </button>

            </div>

            {/* ================= SUMMARY CARDS ================= */}

            <div className="pv-summary">

                <div className="pv-summary-card">

                    <div className="pv-summary-icon pv-purple">
                        <i className="bi bi-file-earmark-post-fill"></i>
                    </div>

                    <div className="pv-summary-info">
                        <span>Total Posts</span>
                        <h3>{posts.length}</h3>
                        <small>All published posts</small>
                    </div>

                    <div className="pv-summary-decoration">
                        <i className="bi bi-files"></i>
                    </div>

                </div>

                <div className="pv-summary-card">

                    <div className="pv-summary-icon pv-blue">
                        <i className="bi bi-funnel-fill"></i>
                    </div>

                    <div className="pv-summary-info">
                        <span>Filtered Posts</span>
                        <h3>{filteredData.length}</h3>
                        <small>Matching your search and filters</small>
                    </div>

                    <div className="pv-summary-decoration">
                        <i className="bi bi-filter-circle"></i>
                    </div>

                </div>

                <div className="pv-summary-card">

                    <div className="pv-summary-icon pv-orange">
                        <i className="bi bi-paperclip"></i>
                    </div>

                    <div className="pv-summary-info">
                        <span>Posts with Files</span>
                        <h3>
                            {posts.filter((p) => p.url).length}
                        </h3>
                        <small>Posts with attachments</small>
                    </div>

                    <div className="pv-summary-decoration">
                        <i className="bi bi-folder2-open"></i>
                    </div>

                </div>

            </div>

            {/* ================= TABLE SECTION ================= */}

            <div className="pv-table-card">

                {/* TABLE HEADER */}

                <div className="pv-table-header">

                    <div>
                        <h3>All Posts</h3>
                        <p>
                            View and manage all your school announcements
                        </p>
                    </div>

                    <div className="pv-total-badge">
                        <i className="bi bi-collection-fill"></i>
                        {filteredData.length} Records
                    </div>

                </div>

                {/* FILTER SECTION */}

                <div className="pv-filter-section">

                    <div className="pv-filter-heading">
                        <div className="pv-filter-title">
                            <div className="pv-filter-icon">
                                <i className="bi bi-sliders"></i>
                            </div>

                            <div>
                                <strong>Filter Posts</strong>
                                <span>Filter posts by date</span>
                            </div>
                        </div>

                        <div className="pv-filter-toggle">

                            <span>
                                Enable Date Filter
                            </span>

                            <label className="pv-switch">
                                <input
                                    type="checkbox"
                                    checked={filterEnabled}
                                    onChange={(e) =>
                                        setFilterEnabled(e.target.checked)
                                    }
                                />

                                <span className="pv-switch-slider"></span>
                            </label>

                        </div>
                    </div>

                    <div className="pv-filter-controls">

                        <div className="pv-select-wrapper">

                            <label>
                                <i className="bi bi-calendar3"></i>
                                Select Year
                            </label>

                            <select
                                value={year}
                                disabled={!filterEnabled}
                                onChange={(e) =>
                                    setYear(Number(e.target.value))
                                }
                            >
                                {[0, 1, 2, 3, 4].map((value) => {
                                    const selectedYear =
                                        new Date().getFullYear() - value;

                                    return (
                                        <option
                                            key={selectedYear}
                                            value={selectedYear}
                                        >
                                            {selectedYear}
                                        </option>
                                    );
                                })}
                            </select>

                        </div>

                        <div className="pv-select-wrapper">

                            <label>
                                <i className="bi bi-calendar-month"></i>
                                Select Month
                            </label>

                            <select
                                value={month}
                                disabled={!filterEnabled}
                                onChange={(e) =>
                                    setMonth(Number(e.target.value))
                                }
                            >
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {new Date(2000, i, 1).toLocaleString(
                                            "default",
                                            { month: "long" }
                                        )}
                                    </option>
                                ))}
                            </select>

                        </div>

                        <button
                            type="button"
                            className="pv-reset-button"
                            onClick={() => {
                                setFilterEnabled(false);
                                setYear(new Date().getFullYear());
                                setMonth(new Date().getMonth() + 1);
                                setSearch("");
                            }}
                        >
                            <i className="bi bi-arrow-counterclockwise"></i>
                            Reset Filters
                        </button>

                    </div>

                </div>

                {/* SEARCH */}

                <div className="pv-search-section">

                    <div className="pv-search-box">

                        <i className="bi bi-search"></i>

                        <input
                            type="text"
                            placeholder="Search by post ID, group or content..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                aria-label="Clear search"
                            >
                                <i className="bi bi-x-circle-fill"></i>
                            </button>
                        )}

                    </div>

                    <div className="pv-search-result">
                        Showing <strong>{filteredData.length}</strong> of{" "}
                        <strong>{posts.length}</strong> posts
                    </div>

                </div>

                {/* DATATABLE */}

                <div className="pv-data-table">

                    <DataTable
                        columns={columns}
                        data={filteredData}
                        pagination
                        paginationPerPage={10}
                        paginationRowsPerPageOptions={[10, 25, 50, 100]}
                        highlightOnHover
                        responsive
                        dense={false}
                        customStyles={customStyles}
                        noDataComponent={
                            <div className="pv-no-data">
                                <div className="pv-no-data-icon">
                                    <i className="bi bi-file-earmark-x"></i>
                                </div>

                                <h3>No Posts Found</h3>

                                <p>
                                    No posts match your current search or filter.
                                </p>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch("");
                                        setFilterEnabled(false);
                                    }}
                                >
                                    Clear Search & Filters
                                </button>
                            </div>
                        }
                    />

                </div>

            </div>

            {/* ================= MOBILE FLOATING BUTTON ================= */}

            <button
                type="button"
                className="pv-float-button"
                onClick={() =>
                    navigate("/dashboard/PostComponent/CreatePost")
                }
                aria-label="Create post"
            >
                <i className="bi bi-plus-lg"></i>
            </button>

            {/* ================= DELETE CONFIRMATION ================= */}

            {selectedPost && (

                <div
                    className="pv-modal-overlay"
                    onClick={() => {
                        if (!deleteLoading) setSelectedPost(null);
                    }}
                >

                    <div
                        className="pv-confirm-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="pv-confirm-icon">
                            <i className="bi bi-trash3-fill"></i>
                        </div>

                        <span className="pv-confirm-label">
                            DELETE CONFIRMATION
                        </span>

                        <h3>Delete Post?</h3>

                        <p>
                            Are you sure you want to delete post{" "}
                            <strong>#{selectedPost.id}</strong>?

                            This action cannot be undone.
                        </p>

                        <div className="pv-confirm-actions">

                            <button
                                type="button"
                                className="pv-cancel-button"
                                disabled={deleteLoading}
                                onClick={() => setSelectedPost(null)}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="pv-delete-button"
                                disabled={deleteLoading}
                                onClick={confirmDelete}
                            >
                                {deleteLoading ? (
                                    <>
                                        <span className="pv-button-spinner"></span>
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-trash3-fill"></i>
                                        Delete Post
                                    </>
                                )}
                            </button>

                        </div>

                    </div>

                </div>

            )}

            {/* ================= SUCCESS / ERROR MESSAGE ================= */}

            {message && (

                <div className="pv-message-overlay">

                    <div className={`pv-message-box ${messageType}`}>

                        <div className="pv-message-icon">
                            <i className={`bi ${
                                messageType === "success"
                                    ? "bi-check-lg"
                                    : "bi-exclamation-lg"
                            }`}></i>
                        </div>

                        <div className="pv-message-content">
                            <h3>
                                {messageType === "success"
                                    ? "Success!"
                                    : "Something went wrong"}
                            </h3>

                            <p>{message}</p>
                        </div>

                        <button
                            type="button"
                            className="pv-message-close"
                            onClick={() => {
                                setMessage("");
                                setMessageType("");
                            }}
                            aria-label="Close message"
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
};

export default PostView;
