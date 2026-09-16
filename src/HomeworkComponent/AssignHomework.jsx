import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AssignHomework.css";

const API =
  "http://localhost/kkblossom/api.php/Adminapi/Homework/getClasses";

export default function AssignHomework() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch classes
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API);

      if (res.data.status) {
        setClasses(res.data.data);

        setSelectedClass(res.data.data[0]?.Classname || "");
      }
    } catch (err) {
      console.error("Error fetching classes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedClass) {
      return;
    }

    navigate("/dashboard/HomeworkComponent/HomeworkDetails", {
      state: {
        selectedClass: selectedClass,
      },
    });
  };

  return (
    <div className="assign-homework-page">

      {/* Page Header */}
      <div className="assign-homework-header">

        <div className="assign-homework-header-icon">
          <i className="bi bi-journal-text"></i>
        </div>

        <div>
          <h2>Assign Homework</h2>
          <p>Select a class to continue</p>
        </div>

      </div>


      {/* Main Card */}
      <div className="assign-homework-card">

        <div className="assign-homework-card-header">

          <div>
            <h3>Homework Assignment</h3>
            <p>
              Choose the class for which you want to assign homework.
            </p>
          </div>

          <div className="assign-homework-card-icon">
            <i className="bi bi-pencil-square"></i>
          </div>

        </div>


        <div className="assign-homework-divider"></div>


        {/* Form */}
        <form onSubmit={handleSubmit} className="assign-homework-form">

          <div className="assign-homework-field">

            <label htmlFor="homework-class">
              <i className="bi bi-mortarboard-fill"></i>
              Class
            </label>

            <div className="assign-homework-select-wrapper">

              <i className="bi bi-people-fill assign-homework-select-icon"></i>

              <select
                id="homework-class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                disabled={loading || classes.length === 0}
              >

                {loading ? (
                  <option value="">
                    Loading classes...
                  </option>
                ) : classes.length === 0 ? (
                  <option value="">
                    No classes available
                  </option>
                ) : (
                  classes.map((row, index) => (
                    <option
                      key={index}
                      value={row.Classname}
                    >
                      Class {row.Classname}
                    </option>
                  ))
                )}

              </select>

              <i className="bi bi-chevron-down assign-homework-chevron"></i>

            </div>

          </div>


          {/* Selected Class Preview */}
          {selectedClass && !loading && (
            <div className="assign-homework-selected">

              <div className="assign-homework-selected-icon">
                <i className="bi bi-check-lg"></i>
              </div>

              <div>
                <span>Selected Class</span>
                <strong>Class {selectedClass}</strong>
              </div>

            </div>
          )}


          {/* Proceed Button */}
          <div className="assign-homework-action">

            <button
              type="submit"
              className="assign-homework-proceed"
              disabled={!selectedClass || loading}
            >

              <span>Proceed</span>

              <i className="bi bi-arrow-right"></i>

            </button>

          </div>

        </form>

      </div>


      {/* Bottom Information */}
      <div className="assign-homework-info">

        <i className="bi bi-info-circle"></i>

        <span>
          Select a class and click <strong>Proceed</strong> to continue
          with the homework assignment.
        </span>

      </div>

    </div>
  );
}