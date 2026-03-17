import React, { useEffect, useState } from "react";
import axios from "axios";
import $ from "jquery";
import "../../node_modules/datatables.net-dt/css/dataTables.dataTables.css";
import { useNavigate } from "react-router-dom";

import "datatables.net";
import "jquery-ui-dist/jquery-ui.css";
import "jquery-ui-dist/jquery-ui";

const API_BASE = "http://localhost/kkblossom/api.php/Adminapi";

const TransferCertificate = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchTransferredStudents = async () => {
    try {
      const res = await axios.get(`${API_BASE}/AdminStudent/displayTransferredStudents`);
      setStudents(res.data.students || []);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to load students" });
    }
  };

  useEffect(() => {
    fetchTransferredStudents();
  }, []);

  // Initialize DataTable safely after students are loaded
  useEffect(() => {
    if (students.length > 0) {
      // Destroy previous instance if it exists
      if ($.fn.DataTable.isDataTable("#table")) {
        $("#table").DataTable().destroy();
      }

      // Initialize DataTable
      $("#table").DataTable({
        order: [[0, "asc"]],
        responsive: true,
      });
    }
  }, [students]);

  return (
    <div className="container">
      {message.text && (
        <div className={message.type === "error" ? "error-bar" : "success-bar"}>
          <i
            className={
              message.type === "error"
                ? "las la-exclamation-triangle"
                : "las la-check-square"
            }
          ></i>
          {message.text}
        </div>
      )}

      <table className="table table-responsive table-bordered" id="table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Father's Name</th>
            <th>Last Class</th>
            <th>Roll No</th>
            <th>Session</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.name}</td>
              <td>{row.father_name}</td>
              <td>{row.last_class}</td>
              <td>{row.roll_no}</td>
              <td>{row.session}</td>
              <td>
                <button
                  className="btn btn-info"
                  onClick={() =>
                    navigate(`/StudentComponent/ViewTC/${row.id}`)
                  }
                >
                  <i className="las la-eye"></i>
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    navigate(`/dashboard/StudentComponent/EditTC/${row.id}`)
                  }
                >
                  <i className="las la-pen"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransferCertificate;
