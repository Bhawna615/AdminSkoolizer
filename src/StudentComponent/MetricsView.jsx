import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaChartLine,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaExclamationCircle
} from "react-icons/fa";
import "./MetricsView.css";

const MetricsView = () => {
  const BASE_URL =
    "http://localhost/kkblossom/api.php/Adminapi/AdminStudentMetrics";

  const [metrics, setMetrics] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const loadMetrics = () => {
    axios
      .get(`${BASE_URL}/getMetrics`)
      .then((res) => {
        setMetrics(res.data || []);
      })
      .catch((err) => {
        console.log(err);
        setMessage("Failed to load metrics");
      });
  };

  useEffect(() => {
    loadMetrics();

    if (location.state?.success) {
      setMessage(location.state.success);

      window.history.replaceState({}, document.title);
    }
  }, []);

  const deleteMetric = (id) => {
    if (window.confirm("Are you sure you want to delete this metric?")) {
      axios
        .get(`${BASE_URL}/delete/${id}`)
        .then(() => {
          loadMetrics();
          setMessage("Metric deleted successfully");

          setTimeout(() => {
            setMessage("");
          }, 3000);
        })
        .catch(() => {
          setMessage("Failed to delete metric");
        });
    }
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => row.metric_id,
      sortable: true,
      width: "90px",
      center: true
    },
    {
      name: "METRIC",
      selector: (row) => row.metric_name,
      sortable: true,
      grow: 2
    },
   {
  name: "ABILITY",
  selector: (row) => row.ability || "-",
  sortable: true,
  grow: 2,
  minWidth: "200px",
  cell: (row) => (
    <span className="student-metrics-view-ability">
      {row.ability || "-"}
    </span>
  )
},
    {
      name: "CLASS",
      selector: (row) => row.metric_class,
      sortable: true,
      grow: 1
    },
    {
  name: "ACTION",
  width: "170px",
  minWidth: "170px",
  center: true,
  cell: (row) => (
    <div className="student-metrics-view-actions">

      <button
        type="button"
        className="student-metrics-view-edit"
        title="Edit Metric"
        onClick={() =>
          navigate(
            `/dashboard/StudentComponent/MetricEdit/${row.metric_id}`
          )
        }
      >
        <FaEdit />
      </button>

      <button
        type="button"
        className="student-metrics-view-delete"
        title="Delete Metric"
        onClick={() => deleteMetric(row.metric_id)}
      >
        <FaTrash />
      </button>

    </div>
  )
},
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#5b2c91",
        color: "#ffffff",
        fontSize: "12px",
        fontWeight: "700",
        textTransform: "uppercase",
        minHeight: "50px"
      }
    },

    rows: {
      style: {
        minHeight: "60px",
        fontSize: "13px",
        color: "#403747",
        borderBottom: "1px solid #eeeaf1"
      },
      highlightOnHoverStyle: {
        backgroundColor: "#faf7fd",
        borderBottomColor: "#e8dff0"
      }
    },

    cells: {
      style: {
        paddingLeft: "14px",
        paddingRight: "14px"
      }
    },

    pagination: {
      style: {
        minHeight: "50px",
        borderTop: "1px solid #eeeaf1",
        fontSize: "12px"
      }
    }
  };

  return (
    <div className="student-metrics-view-page">

      {/* =========================================
          PAGE HEADER
      ========================================= */}
      <div className="student-metrics-view-header">

        <div className="student-metrics-view-header-left">

          <div className="student-metrics-view-header-icon">
            <FaChartLine />
          </div>

          <div>
            <h1>Student Metrics</h1>
            <p>
              Manage student performance metrics
            </p>
          </div>

        </div>

        <button
          className="student-metrics-view-create-btn"
          onClick={() =>
            navigate("/dashboard/StudentComponent/MetricCreate")
          }
        >
          <FaPlus />
          <span>Create Metric</span>
        </button>

      </div>


      {/* =========================================
          MESSAGE
      ========================================= */}
      {message && (
        <div
          className={`student-metrics-view-alert ${
            message.toLowerCase().includes("failed")
              ? "student-metrics-view-alert-error"
              : "student-metrics-view-alert-success"
          }`}
        >
          {message.toLowerCase().includes("failed") ? (
            <FaExclamationCircle />
          ) : (
            <FaCheckCircle />
          )}

          <span>{message}</span>
        </div>
      )}


      {/* =========================================
          TABLE CARD
      ========================================= */}
      <div className="student-metrics-view-card">

        {/* TABLE TOP */}
        <div className="student-metrics-view-card-header">

          <div>
            <h2>Metric List</h2>
            <p>
              View, edit or delete available student metrics
            </p>
          </div>

          <div className="student-metrics-view-total">
            {metrics.length} Metrics
          </div>

        </div>


        {/* TABLE */}
        <div className="student-metrics-view-table">

          <DataTable
            columns={columns}
            data={metrics}
            pagination
            striped
            highlightOnHover
            responsive
            customStyles={customStyles}
            noDataComponent={
              <div className="student-metrics-view-no-data">
                No metrics available
              </div>
            }
          />

        </div>

      </div>

    </div>
  );
};

export default MetricsView;