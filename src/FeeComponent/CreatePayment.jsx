import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import "./CreatePayment.css";
import { useNavigate } from "react-router-dom";

const API = "http://localhost/kkblossom/api.php/Adminapi/AdminPanelFee/";

export default function CreatePayment() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filterEnabled, setFilterEnabled] = useState(false);

  const [errors, setErrors] = useState({}); // ✅ NEW
  const navigate = useNavigate();
  

  const [form, setForm] = useState({
    period: "",
    lastdate: "",
    session: "2026-2027",
  });

  // ================= LOAD CLASSES =================
  useEffect(() => {
    axios.get(API + "getClasses").then((res) => {
      setClasses(res.data || []);
    });
  }, []);

  // ================= INITIAL LOAD =================
  useEffect(() => {
    fetchStudents();
  }, []);

  // ================= FETCH STUDENTS =================
  const fetchStudents = () => {
    setLoading(true);

    axios.get(API + "getStudents").then((res) => {
      const data = res.data || [];

      setStudents(data);

      const allIds = data
        .filter((s) => {
          const t = parseInt(s.tuition_fee) || 0;
          const tr = parseInt(s.transport_fee) || 0;
          return t + tr > 0;
        })
        .map((s) => s.id);

      setSelectedIds(allIds);
      setLoading(false);
    });
  };

  // ================= FILTER =================
  useEffect(() => {
    if (!filterEnabled) {
      fetchStudents();
      return;
    }

    if (!selectedClass) return;

    setLoading(true);

    axios
      .get(API + "filterStudents/" + encodeURIComponent(selectedClass))
      .then((res) => {
        const data = res.data || [];

        setStudents(data);

        const allIds = data
          .filter((s) => {
            const t = parseInt(s.tuition_fee) || 0;
            const tr = parseInt(s.transport_fee) || 0;
            return t + tr > 0;
          })
          .map((s) => s.id);

        setSelectedIds(allIds);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedClass, filterEnabled]);

  // ================= VALIDATION =================
  const validate = () => {
    let newErrors = {};

    if (!form.period) {
      newErrors.period = "Payment Period is required";
    }

    if (!form.lastdate) {
      newErrors.lastdate = "Last Date is required";
    }

    if (selectedIds.length === 0) {
      newErrors.students = "Select at least one student";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ================= CHECKBOX =================
  const handleCheckbox = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // ================= SELECT ALL =================
  const handleSelectAll = () => {
    const visibleIds = students
      .filter((s) => {
        const t = parseInt(s.tuition_fee) || 0;
        const tr = parseInt(s.transport_fee) || 0;
        return t + tr > 0;
      })
      .map((s) => s.id);

    if (selectedIds.length === visibleIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(visibleIds);
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = () => {
  if (!validate()) return;

  axios
    .post(API + "insertPayment", {
      ids: selectedIds,
      ...form,
    })
    .then((res) => {
      if (res.data.status) {
        alert("Payment Added Successfully");

        // ✅ redirect to view page
        navigate("/dashboard/FeeComponent/AdminViewPayment");
      } else {
        alert(res.data.message);
      }
    })
    .catch(() => alert("Server Error"));
};

  // ================= TABLE COLUMNS =================
  const columns = [
    {
      name: (
        <input
          type="checkbox"
          onChange={handleSelectAll}
          checked={
            students.length > 0 &&
            selectedIds.length ===
              students.filter((s) => {
                const t = parseInt(s.tuition_fee) || 0;
                const tr = parseInt(s.transport_fee) || 0;
                return t + tr > 0;
              }).length
          }
        />
      ),
      cell: (row) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.id)}
          onChange={() => handleCheckbox(row.id)}
        />
      ),
      width: "70px",
    },
    {
      name: "Roll",
      selector: (row) => row.Admno,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.Name,
    },
    {
      name: "Class",
      selector: (row) => row.Class,
    },
    {
      name: "Tuition",
      selector: (row) => parseInt(row.tuition_fee) || 0,
    },
    {
      name: "Transport",
      selector: (row) => parseInt(row.transport_fee) || 0,
    },
    {
      name: "Total",
      cell: (row) => {
        const t = parseInt(row.tuition_fee) || 0;
        const tr = parseInt(row.transport_fee) || 0;
        return t + tr;
      },
    },
  ];

  return (
    <div className="container">
      {loading && <p>Loading...</p>}

      {/* FILTER */}
      <div className="filter-bar">
        <label className="filter-toggle">
          Enable Filter
          <input
            type="checkbox"
            checked={filterEnabled}
            onChange={(e) => setFilterEnabled(e.target.checked)}
          />
          
        </label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Select Class</option>
          {classes.map((c, i) => (
            <option key={i} value={c.Classname}>
              {c.Classname}
            </option>
          ))}
        </select>

        
      </div>

      {/* FORM */}
      <div className="payment-form">
        <div className="form-group">
          <label>Payment Period</label>
          <input
            type="number"
            placeholder="Enter Year (e.g. 2026)"
            value={form.period}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 4) {
                setForm({ ...form, period: value });
              }
            }}
          />
          {errors.period && <span className="error">{errors.period}</span>}
        </div>

        <div className="form-group">
          <label>Session</label>
          <input type="text" value={form.session} disabled />
        </div>

        <div className="form-group">
          <label>Last Date</label>
          <input
            type="date"
            value={form.lastdate}
            onChange={(e) => setForm({ ...form, lastdate: e.target.value })}
          />
          {errors.lastdate && <span className="error">{errors.lastdate}</span>}
        </div>
      </div>

      {/* STUDENT ERROR */}
      {errors.students && <p className="error">{errors.students}</p>}

      {/* TABLE */}
      <DataTable
        columns={columns}
        data={students.filter((s) => {
          const t = parseInt(s.tuition_fee) || 0;
          const tr = parseInt(s.transport_fee) || 0;
          return t + tr > 0;
        })}
        pagination
        highlightOnHover
        striped
        responsive
      />

      <button className="submit-btn" onClick={handleSubmit}>
        Create Payment
      </button>
    </div>
  );
}