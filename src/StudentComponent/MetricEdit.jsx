
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaChartLine
} from "react-icons/fa";
import "./MetricEdit.css";

const MetricEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const BASE_URL =
    "http://localhost/kkblossom/api.php/Adminapi/AdminStudentMetrics";

  const [metric, setMetric] = useState({
    metric_name: "",
    ability: ""
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // =========================================================
  // GET METRIC BY ID
  // =========================================================

  useEffect(() => {
    axios
      .get(`${BASE_URL}/getById/${id}`)
      .then((res) => {
        setMetric({
          metric_name: res.data.metric_name || "",
          ability: res.data.ability || ""
        });

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        alert("Failed to load metric");
      });
  }, [id]);

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setMetric((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // =========================================================
  // UPDATE METRIC
  // =========================================================

  const submit = (e) => {
    e.preventDefault();

    if (!metric.metric_name.trim()) {
      alert("Please enter metric name");
      return;
    }

    if (!metric.ability.trim()) {
      alert("Please enter ability");
      return;
    }

    setUpdating(true);

    const formData = new FormData();

    formData.append("metric_id", id);
    formData.append("metric_name", metric.metric_name);
    formData.append("ability", metric.ability);

    axios
      .post(`${BASE_URL}/update`, formData)
      .then((res) => {
        if (res.data.status === true) {
          navigate("/dashboard/StudentComponent/MetricsView", {
            state: {
              success: "Metric updated successfully"
            }
          });
        } else {
          alert("Update failed");
          setUpdating(false);
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong while updating metric");
        setUpdating(false);
      });
  };

  // =========================================================
  // CANCEL
  // =========================================================

  const cancelEdit = () => {
    navigate("/dashboard/StudentComponent/MetricsView");
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="student-metrics-edit-page">
        <div className="student-metrics-edit-loading">
          <div className="student-metrics-edit-spinner"></div>
          <span>Loading metric...</span>
        </div>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="student-metrics-edit-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="student-metrics-edit-header">

        <div className="student-metrics-edit-header-left">

          <div className="student-metrics-edit-header-icon">
            <FaEdit />
          </div>

          <div>
            <h1>Edit Student Metric</h1>

            <p>
              Update metric name and ability information
            </p>
          </div>

        </div>

        <div className="student-metrics-edit-id">
          Metric ID: <strong>#{id}</strong>
        </div>

      </div>


      {/* =====================================================
          FORM CARD
      ===================================================== */}

      <div className="student-metrics-edit-card">

        {/* CARD HEADER */}

        <div className="student-metrics-edit-card-header">

          <div className="student-metrics-edit-card-title">

            <div className="student-metrics-edit-small-icon">
              <FaChartLine />
            </div>

            <div>
              <h2>Metric Information</h2>

              <p>
                Modify the details of this student performance metric
              </p>
            </div>

          </div>

        </div>


        {/* FORM */}

        <form
          onSubmit={submit}
          className="student-metrics-edit-form"
        >

          {/* =================================================
              METRIC NAME
          ================================================= */}

          <div className="student-metrics-edit-field">

            <label htmlFor="metric_name">
              Metric Name
              <span>*</span>
            </label>

            <input
              id="metric_name"
              name="metric_name"
              type="text"
              value={metric.metric_name}
              onChange={handleChange}
              placeholder="Enter metric name"
              autoComplete="off"
              required
            />

            <small>
              Enter the name of the student performance metric.
            </small>

          </div>


          {/* =================================================
              ABILITY
          ================================================= */}

          <div className="student-metrics-edit-field">

            <label htmlFor="ability">
              Ability
              <span>*</span>
            </label>

            <input
              id="ability"
              name="ability"
              type="text"
              value={metric.ability}
              onChange={handleChange}
              placeholder="Enter ability"
              autoComplete="off"
              required
            />

            <small>
              Enter the ability associated with this metric.
            </small>

          </div>


          {/* =================================================
              ACTION BUTTONS
          ================================================= */}

          <div className="student-metrics-edit-form-actions">

            <button
              type="button"
              className="student-metrics-edit-cancel-btn"
              onClick={cancelEdit}
              disabled={updating}
            >
              <FaTimes />
              <span>Cancel</span>
            </button>

            <button
              type="submit"
              className="student-metrics-edit-update-btn"
              disabled={updating}
            >
              <FaSave />

              <span>
                {updating ? "Updating..." : "Update Metric"}
              </span>
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default MetricEdit;
