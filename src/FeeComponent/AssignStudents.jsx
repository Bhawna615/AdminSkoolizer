import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import "./Fee.css";

const API = "http://localhost/kkblossom/api.php/AdminApi/AdminPanelFee/";

export default function AssignStudents() {

  const { id } = useParams();
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const res = await axios.get(API + "getStudents");
    setStudents(res.data);
  };

  const toggle = (studentId) => {
    if (selected.includes(studentId)) {
      setSelected(selected.filter(sid => sid !== studentId));
    } else {
      setSelected([...selected, studentId]);
    }
  };

  const submit = async () => {

  console.log("Selected:", selected);
  console.log("Discount ID:", id);

  try {
    await axios.post(API + "assignDiscount", {
      student_ids: selected,
      discount_id: id
    });

    alert("Assigned Successfully");

  } catch (err) {
    console.error("FULL ERROR:", err.response);
  }
};

  // 🔥 DataTable Columns
  const columns = [
    {
      name: "Select",
      cell: (row) => (
        <input
          type="checkbox"
          onChange={() => toggle(row.id)}
        />
      ),
      width: "100px"
    },
    {
      name: "Roll No",
      selector: row => row.Rollno,
      sortable: true
    },
    {
      name: "Name",
      selector: row => row.Name,
      sortable: true
    },
    {
      name: "Class",
      selector: row => row.Class,
      sortable: true
    }
  ];

  return (
    <div className="container">

      <DataTable
        title="Assign Students to Discount"
        columns={columns}
        data={students}
        pagination
        highlightOnHover
        striped
      />

      <button className="assign-btn" onClick={submit}>
        Assign
      </button>

    </div>
  );
}