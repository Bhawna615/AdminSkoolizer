import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./StudentListView.css";
import schoolLogo from "../images/school-logo.png";

const StudentListView = () => {
  const location = useLocation();
  const state = location.state || {};

  const students = state.students || {};
  const fields = state.fields || {};

  const school = {
    name: "KK Blossoms School",
    address: "Rabaun, Solan (H.P)",
  };

  // ==========================================
  // WAIT UNTIL PAGE + IMAGES ARE READY
  // ==========================================
  useEffect(() => {
    if (!state.students || Object.keys(state.students).length === 0) {
      return;
    }

    const handlePrint = async () => {
      // Wait for browser rendering
      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(resolve);
        });
      });

      // Wait for all images
      const images = Array.from(document.images);

      await Promise.all(
        images.map((img) => {
          if (img.complete) {
            return Promise.resolve();
          }

          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

      // Extra delay for React DOM rendering
      setTimeout(() => {
        window.print();
      }, 1000);
    };

    handlePrint();
  }, [state.students]);

  // ==========================================
  // NO DATA
  // ==========================================
  if (!state.students || Object.keys(students).length === 0) {
    return (
      <div className="student-list-empty">
        No student data available.
      </div>
    );
  }

  // ==========================================
  // DATE FORMAT
  // ==========================================
  const formatDate = (date) => {
    if (!date) return "";

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return date;
    }

    return d.toLocaleDateString("en-GB");
  };

  // ==========================================
  // CSV EXPORT
  // ==========================================
  const exportCSV = () => {
    const csv = [];

    const rows = document.querySelectorAll(
      ".student-table tr"
    );

    rows.forEach((row) => {
      const cols = row.querySelectorAll("td, th");

      const rowData = [];

      cols.forEach((col) => {
        rowData.push(
          `"${col.innerText.replace(/"/g, '""')}"`
        );
      });

      csv.push(rowData.join(","));
    });

    const blob = new Blob(
      [csv.join("\n")],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "students.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(link.href);
  };

  // ==========================================
  // MANUAL PRINT
  // ==========================================
  const handleManualPrint = () => {
    window.print();
  };

  return (
    <div className="student-list-page">

      <div className="print-container">

        {/* ================= SCHOOL HEADER ================= */}

        <div className="school-name-container">

          <img
            src={schoolLogo}
            className="school-logo"
            alt="School Logo"
          />

          <h1 className="school-name">
            {school.name}
          </h1>

          <p className="school-address">
            {school.address}
          </p>

        </div>

        {/* ================= STUDENT LIST ================= */}

        {Object.keys(students).map((cls, index) => (

          <div
            key={index}
            className="class-block"
          >

            <h2 className="class-title">
              Class: {cls}
            </h2>

            <div className="table-wrapper">

              <table className="student-table">

                <thead>
                  <tr>

                    {fields.field_roll_no && (
                      <th>Roll No.</th>
                    )}

                    {fields.field_admission_date && (
                      <th>Admission Date</th>
                    )}

                    {fields.field_admno && (
                      <th>Admission No.</th>
                    )}

                    {fields.field_address && (
                      <th>Address</th>
                    )}

                    {fields.field_dob && (
                      <th>Date of Birth</th>
                    )}

                    <th>Name</th>

                    {fields.field_fname && (
                      <th>Father's Name</th>
                    )}

                    {fields.field_mname && (
                      <th>Mother's Name</th>
                    )}

                    {fields.field_gender && (
                      <th>Gender</th>
                    )}

                    {fields.field_contact && (
                      <th>Contact</th>
                    )}

                    {fields.field_aadhar && (
                      <th>Aadhar No.</th>
                    )}

                    {fields.field_qrcode && (
                      <th>QR Code</th>
                    )}

                    {fields.field_image && (
                      <th>Image</th>
                    )}

                  </tr>
                </thead>

                <tbody>

                  {students[cls]?.map((stu, i) => (

                    <tr key={i}>

                      {fields.field_roll_no && (
                        <td>
                          {stu.Rollno || ""}
                        </td>
                      )}

                      {fields.field_admission_date && (
                        <td>
                          {formatDate(
                            stu.admission_date
                          )}
                        </td>
                      )}

                      {fields.field_admno && (
                        <td>
                          {stu.Admno || ""}
                        </td>
                      )}

                      {fields.field_address && (
                        <td>
                          {stu.Address || ""}
                        </td>
                      )}

                      {fields.field_dob && (
                        <td>
                          {formatDate(stu.Dob)}
                        </td>
                      )}

                      <td>
                        {stu.Name || ""}
                      </td>

                      {fields.field_fname && (
                        <td>
                          {stu.Fname || ""}
                        </td>
                      )}

                      {fields.field_mname && (
                        <td>
                          {stu.Mname || ""}
                        </td>
                      )}

                      {fields.field_gender && (
                        <td>
                          {stu.gender || ""}
                        </td>
                      )}

                      {fields.field_contact && (
                        <td>
                          {stu.Contact || ""}
                        </td>
                      )}

                      {fields.field_aadhar && (
                        <td>
                          {stu.Aadharno || ""}
                        </td>
                      )}

                      {fields.field_qrcode && (
                        <td className="image-cell">

                          {stu.qrcode ? (
                            <img
                              src={`http://localhost/kkblossom/assets/images/students/qrcode/${stu.qrcode}.png`}
                              className="icon"
                              alt="QR Code"
                            />
                          ) : (
                            ""
                          )}

                        </td>
                      )}

                      {fields.field_image && (
                        <td className="image-cell">

                          {stu.image ? (
                            <img
                              src={`http://localhost/kkblossom/assets/images/students/${stu.image}`}
                              className="icon"
                              alt="Student"
                            />
                          ) : (
                            ""
                          )}

                        </td>
                      )}

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        ))}

      </div>

      {/* ================= BUTTONS ================= */}

      <div className="student-list-actions no-print">

        <button
          type="button"
          className="print-btn"
          onClick={handleManualPrint}
        >
          Print List
        </button>

        <button
          type="button"
          className="export-btn"
          onClick={exportCSV}
        >
          Export to CSV
        </button>

      </div>

    </div>
  );
};

export default StudentListView;