import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import DataTable from "react-data-table-component";
import "./ViewEmployee.css";

const API = "http://localhost/kkblossom/api.php/Adminapi/AdminEmployee/";

export default function ViewEmployee() {
  const [employees, setEmployees] = useState([]);
  const [showMsg, setShowMsg] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (location.state?.message) {
      setShowMsg(true);

      const timer = setTimeout(() => {
        setShowMsg(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const loadData = () => {
    axios
      .get(API)
      .then((res) => {
        setEmployees(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const deleteEmployee = (id) => {
    if (window.confirm("Are you sure?")) {
      axios
        .get(API + "delete/" + id)
        .then(() => {
          loadData();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const columns = [
    {
      name: "Employee Name",
      selector: (row) => row.empname,
      sortable: true,
      grow: 2,
      cell: (row) => (
        <div className="employee-name-cell">
          <div className="employee-avatar">
            <i className="bi bi-person-fill"></i>
          </div>

          <span>{row.empname}</span>
        </div>
      ),
    },
    {
      name: "Post / Designation",
      selector: (row) => row.Post,
      sortable: true,
      grow: 1.5,
      cell: (row) => (
        <div className="employee-post-cell">
          <i className="bi bi-briefcase"></i>
          <span>{row.Post}</span>
        </div>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <button
          className="employee-delete-btn"
          onClick={() => deleteEmployee(row.id)}
          title="Delete Employee"
        >
          <i className="bi bi-trash3"></i>
          <span>Delete</span>
        </button>
      ),
      width: "140px",
      center: true,
    },
  ];

  const customStyles = {
    table: {
      style: {
        backgroundColor: "#ffffff",
      },
    },

    headRow: {
      style: {
        minHeight: "52px",
        backgroundColor: "#faf9ff",
        borderBottom: "1px solid #ece9f4",
      },
    },

    headCells: {
      style: {
        color: "#70687e",
        fontSize: "11px",
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: "0.4px",
        paddingLeft: "18px",
        paddingRight: "18px",
      },
    },

    rows: {
      style: {
        minHeight: "68px",
        color: "#484151",
        fontSize: "12px",
        borderBottom: "1px solid #f0edf5",
      },

      highlightOnHoverStyle: {
        backgroundColor: "#faf9ff",
        transitionDuration: "0.15s",
        outline: "none",
      },
    },

    cells: {
      style: {
        paddingLeft: "18px",
        paddingRight: "18px",
      },
    },

    pagination: {
      style: {
        minHeight: "60px",
        borderTop: "1px solid #ece9f4",
        backgroundColor: "#ffffff",
        color: "#777084",
        fontSize: "11px",
      },
    },

    noData: {
      style: {
        minHeight: "180px",
        color: "#9891a5",
        fontSize: "12px",
      },
    },
  };

  return (
    <div className="employee-page">

      {/* SUCCESS MESSAGE */}
      {location.state?.message && showMsg && (
        <div className="employee-success-message">
          <div className="employee-success-icon">
            <i className="bi bi-check-lg"></i>
          </div>

          <div className="employee-success-content">
            <strong>Success</strong>
            <span>{location.state.message}</span>
          </div>

          <button
            className="employee-success-close"
            onClick={() => setShowMsg(false)}
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
      )}

      {/* PAGE HEADER */}
      <div className="employee-page-header">

        <div className="employee-header-left">

          <div className="employee-header-icon">
            <i className="bi bi-people-fill"></i>
          </div>

          <div>
            <h2>Employees</h2>
            <p>Manage school employees and their designations</p>
          </div>

        </div>

        <div className="employee-total-card">
          <span>Total Employees</span>
          <strong>{employees.length}</strong>
        </div>

      </div>

      {/* MAIN CARD */}
      <div className="employee-table-card">

        {/* CARD HEADER */}
        <div className="employee-table-header">

          <div className="employee-table-title">

            <div className="employee-title-icon">
              <i className="bi bi-person-vcard"></i>
            </div>

            <div>
              <h3>Employee List</h3>
              <p>View and manage all employees</p>
            </div>

          </div>

          <button
            className="employee-add-btn"
            onClick={() =>
              navigate("/dashboard/EmployeeComponent/AddEmployee")
            }
          >
            <i className="bi bi-plus-lg"></i>
            <span>Add Employee</span>
          </button>

        </div>

        {/* TABLE */}
        <div className="employee-table-wrapper">

          <DataTable
            columns={columns}
            data={employees}
            pagination
            highlightOnHover
            striped
            responsive
            customStyles={customStyles}
            persistTableHead
            noDataComponent={
              <div className="employee-empty-state">

                <div className="employee-empty-icon">
                  <i className="bi bi-person-x"></i>
                </div>

                <strong>No Employees Found</strong>

                <span>
                  No employee records are currently available.
                </span>

                <button
                  className="employee-empty-add-btn"
                  onClick={() =>
                    navigate("/dashboard/EmployeeComponent/AddEmployee")
                  }
                >
                  <i className="bi bi-plus-lg"></i>
                  Add Employee
                </button>

              </div>
            }
          />

        </div>

      </div>

    </div>
  );
}