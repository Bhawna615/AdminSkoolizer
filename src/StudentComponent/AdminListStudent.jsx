import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminListStudent.css";
import { useNavigate } from "react-router-dom";

const AdminListStudent = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [fields, setFields] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [admnoStart, setAdmnoStart] = useState("");
  const [admnoEnd, setAdmnoEnd] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        "http://localhost/kkblossom/api.php/Adminapi/AdminStudent/classes"
      )
      .then((res) => {
        setClasses(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Error fetching classes:", err);
      });
  }, []);

  const handleSelectAll = () => {
    if (!selectAll) {
      setSelectedClasses(classes.map((c) => c.Classname));
    } else {
      setSelectedClasses([]);
    }

    setSelectAll(!selectAll);
  };

  const handleClassChange = (classname) => {
    setSelectedClasses((prev) =>
      prev.includes(classname)
        ? prev.filter((c) => c !== classname)
        : [...prev, classname]
    );
  };

  const handleFieldChange = (e) => {
    setFields({
      ...fields,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      classes: selectedClasses,
      fields,
      admno_start: admnoStart,
      admno_end: admnoEnd,
    };

    axios
      .post(
        "http://localhost/kkblossom/api.php/Adminapi/AdminStudent/listCreate",
        payload
      )
      .then((res) => {
        navigate("/StudentListView", {
          state: res.data.data,
        });
      })
      .catch((err) => {
        console.error("Error creating student list:", err);
      });
  };

  const selectedFieldCount =
    Object.values(fields).filter(Boolean).length;

  return (
    <div className="admin-list-student-page">

      {/* =========================
          PAGE HEADER
      ========================= */}
      <div className="admin-list-student-header">

        <div className="admin-list-student-header-left">

          <div className="admin-list-student-header-icon">
            <i className="bi bi-card-list"></i>
          </div>

          <div>
            <h1>Create Student List</h1>
            <p>
              Generate a customized student list by selecting
              classes and information.
            </p>
          </div>

        </div>

        <div className="admin-list-student-header-badge">
          <i className="bi bi-file-earmark-spreadsheet-fill"></i>
          Student Report
        </div>

      </div>


      {/* =========================
          MAIN CARD
      ========================= */}
      <div className="admin-list-student-card">

        <div className="admin-list-student-card-top">

          <div className="admin-list-student-card-title">

            <div className="admin-list-student-card-title-icon">
              <i className="bi bi-sliders2"></i>
            </div>

            <div>
              <h2>Student List Configuration</h2>
              <p>
                Configure the classes, columns and admission
                range for your report.
              </p>
            </div>

          </div>

          <div className="admin-list-student-required">
            <i className="bi bi-check-circle-fill"></i>
            Customize your report
          </div>

        </div>


        <form onSubmit={handleSubmit}>

          {/* =====================================================
              SECTION 01 - CLASSES
          ===================================================== */}
          <section className="admin-list-student-section">

            <div className="admin-list-student-section-header">

              <div className="admin-list-student-section-heading">

                <div className="admin-list-student-section-number">
                  01
                </div>

                <div>
                  <h3>Select Classes</h3>
                  <p>
                    Choose one or more classes to include in
                    the student list.
                  </p>
                </div>

              </div>


              <label className="admin-list-student-select-all">

                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />

                <span className="admin-list-student-custom-check">
                  <i className="bi bi-check"></i>
                </span>

                <span>Select All</span>

              </label>

            </div>


            <div className="admin-list-student-class-grid">

              {classes.length > 0 ? (
                classes.map((classItem, index) => {

                  const isSelected = selectedClasses.includes(
                    classItem.Classname
                  );

                  return (
                    <label
                      key={classItem.id || index}
                      className={`admin-list-student-class-card ${
                        isSelected
                          ? "admin-list-student-class-selected"
                          : ""
                      }`}
                    >

                      <input
                        type="checkbox"
                        value={classItem.Classname}
                        checked={isSelected}
                        onChange={() =>
                          handleClassChange(
                            classItem.Classname
                          )
                        }
                      />

                      <div className="admin-list-student-class-check">
                        <i className="bi bi-check-lg"></i>
                      </div>

                      <div className="admin-list-student-class-content">

                        <span className="admin-list-student-class-label">
                          CLASS
                        </span>

                        <strong>
                          {classItem.Classname}
                        </strong>

                      </div>

                      <i className="bi bi-mortarboard-fill admin-list-student-class-icon"></i>

                    </label>
                  );
                })
              ) : (
                <div className="admin-list-student-empty-classes">
                  <i className="bi bi-mortarboard"></i>
                  <span>No classes available</span>
                </div>
              )}

            </div>


            <div className="admin-list-student-selection-footer">

              <div className="admin-list-student-selection-count">

                <div className="admin-list-student-selection-count-icon">
                  <i className="bi bi-check2-square"></i>
                </div>

                <div>
                  <strong>
                    {selectedClasses.length}{" "}
                    {selectedClasses.length === 1
                      ? "Class"
                      : "Classes"}
                  </strong>

                  <span>
                    selected for this report
                  </span>
                </div>

              </div>

              {selectedClasses.length > 0 && (
                <div className="admin-list-student-selected-tags">

                  {selectedClasses.map((classname) => (
                    <span key={classname}>
                      {classname}
                    </span>
                  ))}

                </div>
              )}

            </div>

          </section>


          {/* =====================================================
              SECTION 02 - COLUMNS
          ===================================================== */}
          <section className="admin-list-student-section">

            <div className="admin-list-student-section-header">

              <div className="admin-list-student-section-heading">

                <div className="admin-list-student-section-number">
                  02
                </div>

                <div>
                  <h3>Select Columns</h3>
                  <p>
                    Select the information that should appear
                    in the generated list.
                  </p>
                </div>

              </div>

              <div className="admin-list-student-column-count">
                <i className="bi bi-layout-three-columns"></i>
                {selectedFieldCount} optional selected
              </div>

            </div>


            {/* DEFAULT COLUMN */}
            <div className="admin-list-student-default-column">

              <div className="admin-list-student-default-check">
                <i className="bi bi-check-lg"></i>
              </div>

              <div className="admin-list-student-default-info">

                <strong>Student Name</strong>

                <span>
                  Always included in the student list
                </span>

              </div>

              <div className="admin-list-student-default-badge">
                Required
              </div>

            </div>


            {/* OPTIONAL COLUMNS */}
            <div className="admin-list-student-columns-grid">

              <label className="admin-list-student-column-card">
                <input
                  type="checkbox"
                  name="field_roll_no"
                  checked={fields.field_roll_no || false}
                  onChange={handleFieldChange}
                />
                <span className="admin-list-student-column-check">
                  <i className="bi bi-check"></i>
                </span>
                <i className="bi bi-list-ol"></i>
                <span>Roll No.</span>
              </label>


              <label className="admin-list-student-column-card">
                <input
                  type="checkbox"
                  name="field_fname"
                  checked={fields.field_fname || false}
                  onChange={handleFieldChange}
                />
                <span className="admin-list-student-column-check">
                  <i className="bi bi-check"></i>
                </span>
                <i className="bi bi-person-badge"></i>
                <span>Father's Name</span>
              </label>


              <label className="admin-list-student-column-card">
                <input
                  type="checkbox"
                  name="field_mname"
                  checked={fields.field_mname || false}
                  onChange={handleFieldChange}
                />
                <span className="admin-list-student-column-check">
                  <i className="bi bi-check"></i>
                </span>
                <i className="bi bi-person"></i>
                <span>Mother's Name</span>
              </label>


              <label className="admin-list-student-column-card">
                <input
                  type="checkbox"
                  name="field_contact"
                  checked={fields.field_contact || false}
                  onChange={handleFieldChange}
                />
                <span className="admin-list-student-column-check">
                  <i className="bi bi-check"></i>
                </span>
                <i className="bi bi-telephone"></i>
                <span>Contact</span>
              </label>


              <label className="admin-list-student-column-card">
                <input
                  type="checkbox"
                  name="field_admno"
                  checked={fields.field_admno || false}
                  onChange={handleFieldChange}
                />
                <span className="admin-list-student-column-check">
                  <i className="bi bi-check"></i>
                </span>
                <i className="bi bi-hash"></i>
                <span>Admission Number</span>
              </label>


              <label className="admin-list-student-column-card">
                <input
                  type="checkbox"
                  name="field_address"
                  checked={fields.field_address || false}
                  onChange={handleFieldChange}
                />
                <span className="admin-list-student-column-check">
                  <i className="bi bi-check"></i>
                </span>
                <i className="bi bi-geo-alt"></i>
                <span>Address</span>
              </label>


              <label className="admin-list-student-column-card">
                <input
                  type="checkbox"
                  name="field_aadhar"
                  checked={fields.field_aadhar || false}
                  onChange={handleFieldChange}
                />
                <span className="admin-list-student-column-check">
                  <i className="bi bi-check"></i>
                </span>
                <i className="bi bi-credit-card"></i>
                <span>Aadhar Number</span>
              </label>


              <label className="admin-list-student-column-card">
                <input
                  type="checkbox"
                  name="field_dob"
                  checked={fields.field_dob || false}
                  onChange={handleFieldChange}
                />
                <span className="admin-list-student-column-check">
                  <i className="bi bi-check"></i>
                </span>
                <i className="bi bi-calendar3"></i>
                <span>Date of Birth</span>
              </label>


              <label className="admin-list-student-column-card">
                <input
                  type="checkbox"
                  name="field_qrcode"
                  checked={fields.field_qrcode || false}
                  onChange={handleFieldChange}
                />
                <span className="admin-list-student-column-check">
                  <i className="bi bi-check"></i>
                </span>
                <i className="bi bi-qr-code"></i>
                <span>QR Code</span>
              </label>


              <label className="admin-list-student-column-card">
                <input
                  type="checkbox"
                  name="field_admission_date"
                  checked={fields.field_admission_date || false}
                  onChange={handleFieldChange}
                />
                <span className="admin-list-student-column-check">
                  <i className="bi bi-calendar-check"></i>
                </span>
                <i className="bi bi-calendar-event"></i>
                <span>Admission Date</span>
              </label>


              <label className="admin-list-student-column-card">
                <input
                  type="checkbox"
                  name="field_gender"
                  checked={fields.field_gender || false}
                  onChange={handleFieldChange}
                />
                <span className="admin-list-student-column-check">
                  <i className="bi bi-check"></i>
                </span>
                <i className="bi bi-gender-ambiguous"></i>
                <span>Gender</span>
              </label>


              <label className="admin-list-student-column-card">
                <input
                  type="checkbox"
                  name="field_image"
                  checked={fields.field_image || false}
                  onChange={handleFieldChange}
                />
                <span className="admin-list-student-column-check">
                  <i className="bi bi-check"></i>
                </span>
                <i className="bi bi-image"></i>
                <span>Image</span>
              </label>

            </div>

          </section>


          {/* =====================================================
              SECTION 03 - ADMISSION RANGE
          ===================================================== */}
          <section className="admin-list-student-section">

            <div className="admin-list-student-section-header">

              <div className="admin-list-student-section-heading">

                <div className="admin-list-student-section-number">
                  03
                </div>

                <div>
                  <h3>Admission Number Range</h3>
                  <p>
                    Optionally restrict the list using admission
                    numbers.
                  </p>
                </div>

              </div>

              <div className="admin-list-student-range-icon">
                <i className="bi bi-filter"></i>
              </div>

            </div>


            <div className="admin-list-student-range-box">

              <div className="admin-list-student-range-input">

                <label>
                  <i className="bi bi-arrow-down-circle"></i>
                  From
                </label>

                <div className="admin-list-student-input-wrapper">

                  <i className="bi bi-hash"></i>

                  <input
                    type="text"
                    name="admno_start"
                    placeholder="Starting admission number"
                    value={admnoStart}
                    onChange={(e) =>
                      setAdmnoStart(e.target.value)
                    }
                  />

                </div>

              </div>


              <div className="admin-list-student-range-middle">
                <span>
                  <i className="bi bi-arrow-right"></i>
                </span>
              </div>


              <div className="admin-list-student-range-input">

                <label>
                  <i className="bi bi-arrow-up-circle"></i>
                  To
                </label>

                <div className="admin-list-student-input-wrapper">

                  <i className="bi bi-hash"></i>

                  <input
                    type="text"
                    name="admno_end"
                    placeholder="Ending admission number"
                    value={admnoEnd}
                    onChange={(e) =>
                      setAdmnoEnd(e.target.value)
                    }
                  />

                </div>

              </div>

            </div>


            <div className="admin-list-student-range-note">

              <i className="bi bi-info-circle-fill"></i>

              <span>
                Leave both fields empty to include students
                from all admission numbers.
              </span>

            </div>

          </section>


          {/* =====================================================
              FINAL SUMMARY
          ===================================================== */}
          <div className="admin-list-student-summary">

            <div className="admin-list-student-summary-icon">
              <i className="bi bi-file-earmark-check-fill"></i>
            </div>

            <div className="admin-list-student-summary-content">

              <strong>Ready to create your student list?</strong>

              <span>
                {selectedClasses.length > 0
                  ? `${selectedClasses.length} ${
                      selectedClasses.length === 1
                        ? "class"
                        : "classes"
                    } selected`
                  : "No classes selected"}{" "}
                •{" "}
                {selectedFieldCount} optional column
                {selectedFieldCount === 1 ? "" : "s"} selected
              </span>

            </div>

          </div>


          {/* =====================================================
              SUBMIT
          ===================================================== */}
          <div className="admin-list-student-submit-area">

            <div className="admin-list-student-submit-hint">

              <i className="bi bi-lightbulb-fill"></i>

              <span>
                Select at least one class before generating
                the student list.
              </span>

            </div>

            <button
              type="submit"
              className="admin-list-student-create-button"
            >

              <span className="admin-list-student-button-icon">
                <i className="bi bi-file-earmark-plus-fill"></i>
              </span>

              <span>Create Student List</span>

              <i className="bi bi-arrow-right"></i>

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AdminListStudent;