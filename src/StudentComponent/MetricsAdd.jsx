import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import {
FaChartLine,
FaUserGraduate,
FaSchool,
FaIdBadge,
FaSave,
FaCheckCircle,
FaExclamationCircle
} from "react-icons/fa";
import "./MetricsAdd.css";

const MetricsAdd = () => {
const BASE_URL =
"http://localhost/kkblossom/api.php/Adminapi/AdminStudentMetrics";

const { studentId } = useParams();

const [student, setStudent] = useState(null);
const [metrics, setMetrics] = useState([]);
const [marks, setMarks] = useState({});
const [message, setMessage] = useState("");
const [messageType, setMessageType] = useState("");
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);

// ===== LOAD DATA =====
useEffect(() => {
axios
.get(`${BASE_URL}/addData/${studentId}`)
.then((res) => {
setStudent(res.data.student);
setMetrics(res.data.metrics || []);


    const m = {};

    (res.data.metrics || []).forEach((item) => {
      m[item.metric_id] = item.mark ?? "";
    });

    setMarks(m);
  })
  .catch((err) => {
    console.log(err);
    setMessage("Failed to load student metrics");
    setMessageType("error");
  })
  .finally(() => {
    setLoading(false);
  });

}, [studentId]);

// ===== CHANGE MARK =====
const handleChange = (id, value) => {
setMarks((prev) => ({
...prev,
[id]: value
}));
};

// ===== SUBMIT =====
const submit = () => {
setSaving(true);
setMessage("");


const payload = Object.keys(marks).map((id) => ({
  metric_id: id,
  mark: marks[id]
}));

axios
  .post(`${BASE_URL}/mark`, {
    studentId: studentId,
    metrics: payload
  })
  .then(() => {
    setMessage("Metrics saved successfully");
    setMessageType("success");
  })
  .catch(() => {
    setMessage("Failed to save metrics");
    setMessageType("error");
  })
  .finally(() => {
    setSaving(false);

    setTimeout(() => {
      setMessage("");
    }, 4000);
  });

};

// ===== TABLE COLUMNS =====
const columns = [
{
name: "ID",
selector: (row) => row.metric_id,
width: "100px",
center: true
},
{
name: "METRIC",
selector: (row) => row.metric_name,
grow: 2
},
{
name: "ABILITY",
selector: (row) => row.ability,
grow: 1.5,
cell: (row) => ( <span className="student-metrics-ability-badge">
{row.ability} </span>
)
},
{
name: "MARK",
grow: 1.2,
center: true,
cell: (row) => (
<input
type="text"
className="student-metrics-mark-input"
placeholder="Enter mark"
value={marks[row.metric_id] || ""}
onChange={(e) =>
handleChange(row.metric_id, e.target.value)
}
/>
)
}
];

// ===== TABLE CUSTOM STYLES =====
const customStyles = {
headCells: {
style: {
backgroundColor: "#5b2c91",
color: "#ffffff",
fontSize: "13px",
fontWeight: "700",
minHeight: "58px"
}
},

rows: {
  style: {
    minHeight: "68px",
    fontSize: "14px",
    borderBottom: "1px solid #eee"
  },
  highlightOnHoverStyle: {
    backgroundColor: "#f7f0ff",
    borderBottomColor: "#e6d7f5"
  }
},

cells: {
  style: {
    paddingLeft: "16px",
    paddingRight: "16px"
  }
},

pagination: {
  style: {
    borderTop: "1px solid #eee",
    fontSize: "14px"
  }
}


};

return ( <div className="student-metrics-page">

  {/* PAGE HEADER */}
  <div className="student-metrics-header">
    <div className="student-metrics-header-icon">
      <FaChartLine />
    </div>

    <div>
      <h1>Student Metrics</h1>
      <p>Evaluate and manage student performance metrics</p>
    </div>
  </div>

  {/* SUCCESS / ERROR MESSAGE */}
  {message && (
    <div
      className={`student-metrics-alert ${
        messageType === "success"
          ? "student-metrics-success"
          : "student-metrics-error"
      }`}
    >
      {messageType === "success" ? (
        <FaCheckCircle />
      ) : (
        <FaExclamationCircle />
      )}

      <span>{message}</span>
    </div>
  )}

  {/* LOADING */}
  {loading ? (
    <div className="student-metrics-loading">
      <div className="student-metrics-spinner"></div>
      <p>Loading student metrics...</p>
    </div>
  ) : (
    <>
      {/* STUDENT INFORMATION */}
      {student && (
        <div className="student-metrics-student-card">

          <div className="student-metrics-card-title">
            <div className="student-metrics-card-icon">
              <FaUserGraduate />
            </div>

            <div>
              <h2>Student Information</h2>
              <p>Student academic details</p>
            </div>
          </div>

          <div className="student-metrics-student-details">

            <div className="student-metrics-detail-item">
              <div className="student-metrics-detail-icon">
                <FaUserGraduate />
              </div>

              <div>
                <span>Student Name</span>
                <strong>{student.Name || "-"}</strong>
              </div>
            </div>

            <div className="student-metrics-detail-item">
              <div className="student-metrics-detail-icon">
                <FaSchool />
              </div>

              <div>
                <span>Class</span>
                <strong>{student.Class || "-"}</strong>
              </div>
            </div>

            <div className="student-metrics-detail-item">
              <div className="student-metrics-detail-icon">
                <FaIdBadge />
              </div>

              <div>
                <span>Roll Number</span>
                <strong>{student.Rollno || "-"}</strong>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* METRICS TABLE */}
      <div className="student-metrics-table-card">

        <div className="student-metrics-table-header">
          <div>
            <h2>Performance Metrics</h2>
            <p>Enter marks for each performance category</p>
          </div>

          <div className="student-metrics-count">
            {metrics.length} Metrics
          </div>
        </div>

        <div className="student-metrics-table-wrapper">
          <DataTable
            columns={columns}
            data={metrics}
            pagination
            highlightOnHover
            responsive
            customStyles={customStyles}
            noDataComponent={
              <div className="student-metrics-no-data">
                No metrics available
              </div>
            }
          />
        </div>

        {/* SUBMIT BUTTON */}
        <div className="student-metrics-action-area">
          <button
            className="student-metrics-submit-btn"
            onClick={submit}
            disabled={saving}
          >
            <FaSave />

            {saving ? "Saving Metrics..." : "Save Metrics"}
          </button>
        </div>

      </div>
    </>
  )}
</div>

);
};

export default MetricsAdd;
