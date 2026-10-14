import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./HomeworkDetails.css";

const API = "http://localhost/kkblossom/api.php/Adminapi/Homework";

export default function HomeworkDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  // Class from route state
  const selectedClass = location.state?.selectedClass;

  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState("");
  const [assignment, setAssignment] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // =========================================================
  // MESSAGE BOX
  // =========================================================

  const [messageBox, setMessageBox] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });

  // =========================================================
  // CLOSE MESSAGE BOX
  // =========================================================

  const closeMessageBox = () => {
    setMessageBox({
      show: false,
      type: "",
      title: "",
      message: "",
    });
  };

  // =========================================================
  // REDIRECT IF CLASS IS MISSING
  // =========================================================

  useEffect(() => {
    if (!selectedClass) {
      setMessageBox({
        show: true,
        type: "error",
        title: "Class Not Selected",
        message: "Please select a class before assigning homework.",
      });
    }
  }, [selectedClass]);

  // =========================================================
  // GET SUBJECTS
  // =========================================================

  useEffect(() => {
    if (!selectedClass) return;

    axios
      .post(`${API}/getSubjects`, {
        class: selectedClass,
      })
      .then((res) => {
        const data = res.data.data || [];

        setSubjects(data);

        if (data.length > 0) {
          setSubject(data[0].Subjectname);
        }
      })
      .catch((err) => {
        console.log(err);

        setMessageBox({
          show: true,
          type: "error",
          title: "Failed to Load Subjects",
          message: "Unable to load subjects. Please try again.",
        });
      });
  }, [selectedClass]);

  // =========================================================
  // SUBMIT HOMEWORK
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!subject || !assignment) {
      setMessageBox({
        show: true,
        type: "error",
        title: "Required Fields",
        message: "Please fill all required fields.",
      });

      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("class", selectedClass);
      formData.append("subject", subject);
      formData.append("assignment", assignment);

      if (file) {
        formData.append("file", file);
      }

      const res = await axios.post(
        `${API}/submitHomework`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response:", res.data);

      // =====================================================
      // SUCCESS
      // =====================================================

      if (
        res.data.status === true ||
        res.data.success === true
      ) {
        setLoading(false);

        setAssignment("");
        setFile(null);

        setMessageBox({
          show: true,
          type: "success",
          title: "Homework Added Successfully",
          message:
            res.data.message ||
            "Homework has been assigned successfully.",
        });

        // Navigate after message is displayed
        setTimeout(() => {
          navigate(
            "/dashboard/HomeworkComponent/HomeworkView",
            {
              replace: true,
            }
          );
        }, 1500);
      }

      // =====================================================
      // API FAILURE
      // =====================================================

      else {
        setLoading(false);

        setMessageBox({
          show: true,
          type: "error",
          title: "Failed to Add Homework",
          message:
            res.data.message ||
            "Unable to add homework. Please try again.",
        });
      }

    } catch (error) {
      console.log(error);

      setLoading(false);

      setMessageBox({
        show: true,
        type: "error",
        title: "Server Error",
        message:
          "Something went wrong while adding homework. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="homework-details-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="homework-details-header">

        <div className="homework-details-header-icon">
          <i className="bi bi-journal-plus"></i>
        </div>

        <div>
          <h2>Homework Details</h2>

          <p>
            Create and assign homework to your selected class
          </p>
        </div>

      </div>


      {/* =====================================================
          MAIN CARD
      ===================================================== */}

      <div className="homework-details-card">

        {/* Card Header */}

        <div className="homework-details-card-header">

          <div>
            <h3>Create Homework</h3>

            <p>
              Enter the homework details and optionally attach a file.
            </p>
          </div>

          <div className="homework-details-card-icon">
            <i className="bi bi-pencil-square"></i>
          </div>

        </div>

        <div className="homework-details-divider"></div>


        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="homework-details-form"
        >

          {/* =================================================
              SELECTED CLASS
          ================================================= */}

          <div className="homework-details-class-box">

            <div className="homework-details-class-icon">
              <i className="bi bi-people-fill"></i>
            </div>

            <div className="homework-details-class-content">

              <span>
                Selected Class
              </span>

              <strong>
                Class {selectedClass}
              </strong>

            </div>

            <div className="homework-details-class-check">
              <i className="bi bi-check-circle-fill"></i>
            </div>

          </div>


          {/* =================================================
              SUBJECT
          ================================================= */}

          <div className="homework-details-field">

            <label htmlFor="homework-subject">

              <i className="bi bi-book-fill"></i>

              Subject

            </label>


            <div className="homework-details-input-wrapper">

              <i className="bi bi-book homework-details-input-icon"></i>


              <select
                id="homework-subject"
                value={subject}
                onChange={(e) =>
                  setSubject(e.target.value)
                }
                disabled={subjects.length === 0}
              >

                {subjects.length === 0 ? (

                  <option value="">
                    Loading subjects...
                  </option>

                ) : (

                  subjects.map((s, i) => (

                    <option
                      key={i}
                      value={s.Subjectname}
                    >
                      {s.Subjectname}
                    </option>

                  ))

                )}

              </select>


              <i className="bi bi-chevron-down homework-details-chevron"></i>

            </div>

          </div>


          {/* =================================================
              HOMEWORK
          ================================================= */}

          <div className="homework-details-field">

            <label htmlFor="homework-assignment">

              <i className="bi bi-file-text-fill"></i>

              Homework

            </label>


            <div className="homework-details-textarea-wrapper">

              <textarea
                id="homework-assignment"
                value={assignment}
                onChange={(e) =>
                  setAssignment(e.target.value)
                }
                placeholder="Write the homework instructions here..."
                rows="6"
              />


              <div className="homework-details-textarea-footer">

                <span>

                  <i className="bi bi-info-circle"></i>

                  Enter clear instructions for students

                </span>


                <span>
                  {assignment.length} characters
                </span>

              </div>

            </div>

          </div>


          {/* =================================================
              FILE UPLOAD
          ================================================= */}

          <div className="homework-details-field">

            <label>

              <i className="bi bi-paperclip"></i>

              Attachment

              <span className="homework-details-optional">
                Optional
              </span>

            </label>


            <label
              htmlFor="homework-file"
              className={`homework-details-upload ${
                file ? "has-file" : ""
              }`}
            >

              <input
                id="homework-file"
                type="file"
                onChange={(e) =>
                  setFile(e.target.files[0] || null)
                }
              />


              <div className="homework-details-upload-icon">

                <i
                  className={
                    file
                      ? "bi bi-file-earmark-check-fill"
                      : "bi bi-cloud-arrow-up"
                  }
                ></i>

              </div>


              <div className="homework-details-upload-content">

                {file ? (

                  <>

                    <strong>
                      {file.name}
                    </strong>

                    <span>
                      File selected successfully
                    </span>

                  </>

                ) : (

                  <>

                    <strong>
                      Upload a homework file
                    </strong>

                    <span>
                      Click here to browse your files
                    </span>

                  </>

                )}

              </div>


              {file && (

                <div className="homework-details-file-check">

                  <i className="bi bi-check-lg"></i>

                </div>

              )}

            </label>

          </div>


          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="homework-details-actions">

            <button
              type="button"
              className="homework-details-cancel"
              onClick={() =>
                navigate(
                  "/dashboard/HomeworkComponent/AssignHomework"
                )
              }
              disabled={loading}
            >

              <i className="bi bi-arrow-left"></i>

              Back

            </button>


            <button
              type="submit"
              className="homework-details-submit"
              disabled={
                loading ||
                !subject ||
                !assignment
              }
            >

              {loading ? (

                <>

                  <span className="homework-details-spinner"></span>

                  Submitting...

                </>

              ) : (

                <>

                  <i className="bi bi-check2-circle"></i>

                  Add Homework

                </>

              )}

            </button>

          </div>

        </form>

      </div>


      {/* =====================================================
          BOTTOM INFORMATION
      ===================================================== */}

      <div className="homework-details-info">

        <i className="bi bi-shield-check"></i>

        <span>

          Your homework will be assigned to{" "}

          <strong>
            Class {selectedClass}
          </strong>.

          You can optionally attach a file for students.

        </span>

      </div>


      {/* =====================================================
          MESSAGE BOX
      ===================================================== */}

      {messageBox.show && (

        <div className="homework-details-message-overlay">

          <div
            className={`homework-details-message-box ${
              messageBox.type === "success"
                ? "homework-details-message-success"
                : "homework-details-message-error"
            }`}
          >

            {/* Icon */}

            <div className="homework-details-message-icon">

              {messageBox.type === "success" ? (

                <i className="bi bi-check-lg"></i>

              ) : (

                <i className="bi bi-exclamation-lg"></i>

              )}

            </div>


            {/* Title */}

            <h4>
              {messageBox.title}
            </h4>


            {/* Message */}

            <p>
              {messageBox.message}
            </p>


            {/* OK button only for errors */}

            {messageBox.type === "error" && (

              <button
                type="button"
                className="homework-details-message-button"
                onClick={closeMessageBox}
              >
                OK
              </button>

            )}

          </div>

        </div>

      )}


      {/* =====================================================
          FULL SCREEN LOADER
      ===================================================== */}

      {loading && (

        <div className="homework-details-loader-overlay">

          <div className="homework-details-loader-box">

            <div className="homework-details-loader-spinner">
              <span></span>
            </div>

            <h4>
              Submitting Homework
            </h4>

            <p>
              Please wait while the homework is being uploaded...
            </p>

          </div>

        </div>

      )}

    </div>
  );
}