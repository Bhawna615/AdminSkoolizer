import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./CreateExam.css";

const CreateExam = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedClass = location.state?.class;

  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading...");

  const [form, setForm] = useState({
    subject: "",
    teacher: "",
    type: "Daily Revision Test",
    marks: "",
    date: new Date().toISOString().split("T")[0],
    topic: "",
  });

  const BASE_URL =
    "http://localhost/kkblossom/api.php/Adminapi/AdminExam/";

  useEffect(() => {
    if (!selectedClass) {
      navigate("/");
      return;
    }

    const fd = new FormData();
    fd.append("class", selectedClass);

    axios
      .post(BASE_URL + "getExamDetails", fd)
      .then((res) => {
        if (res.data.status) {
          const subjectsData = res.data.subjects || [];
          const teachersData = res.data.teachers || [];

          setSubjects(subjectsData);
          setTeachers(teachersData);

          if (subjectsData.length > 0) {
            setForm((prev) => ({
              ...prev,
              subject: subjectsData[0].timetableid,
              teacher: subjectsData[0].TeacherId,
            }));
          }
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        console.error("Error fetching exam details:", err);
      });
  }, [selectedClass, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.subject ||
      !form.teacher ||
      !form.marks ||
      !form.date ||
      !form.topic
    ) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setLoadingText("Creating New Exam...");

      const fd = new FormData();
      fd.append("class", selectedClass);

      Object.keys(form).forEach((key) => {
        fd.append(key, form[key]);
      });

      const res = await axios.post(BASE_URL + "submitExam", fd);

      setLoadingText("Sending Notifications...");

      if (res.data.status) {
        alert("Exam Created Successfully");

        navigate("/dashboard/ExamComponent/view-exams", {
          state: {
            class: selectedClass,
            examType: form.type,
          },
        });
      } else {
        alert("Failed to Submit");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred");
    } finally {
      setLoading(false);
    }
  };

  const selectedSubjectData = subjects.find(
    (s) => String(s.timetableid) === String(form.subject)
  );

  const selectedTeacherData = teachers.find(
    (t) => String(t.id) === String(form.teacher)
  );

  return (
    <div className="createExam-page">
      {/* Decorative background */}
      <div className="createExam-bg-circle createExam-bg-circle-one"></div>
      <div className="createExam-bg-circle createExam-bg-circle-two"></div>

      {/* Loader */}
      {loading && (
        <div className="createExam-loader-overlay">
          <div className="createExam-loader-box">
            <div className="createExam-spinner"></div>

            <h3>{loadingText}</h3>

            <p>Please wait while we process your request.</p>

            <div className="createExam-loader-progress">
              <span></span>
            </div>
          </div>
        </div>
      )}

      <div className="createExam-wrapper">

        {/* =========================================
            HEADER
        ========================================= */}
        <div className="createExam-header">
          <div className="createExam-header-left">

            <div className="createExam-header-icon">
              <i className="las la-file-signature"></i>
            </div>

            <div>
              <span className="createExam-eyebrow">
                EXAM MANAGEMENT
              </span>

              <h1>Create New Exam</h1>

              <p>
                Configure examination details for the selected class.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="createExam-back-btn"
            onClick={() => navigate(-1)}
          >
            <i className="las la-arrow-left"></i>
            <span>Back</span>
          </button>
        </div>

        {/* =========================================
            CLASS BANNER
        ========================================= */}
        <div className="createExam-class-banner">

          <div className="createExam-class-icon">
            <i className="las la-school"></i>
          </div>

          <div className="createExam-class-info">
            <span>CREATING EXAMINATION FOR</span>
            <strong>Class {selectedClass}</strong>
          </div>

          <div className="createExam-class-status">
            <i className="las la-check-circle"></i>
            Class Selected
          </div>

        </div>

        {/* =========================================
            MAIN FORM
        ========================================= */}
        <form
          onSubmit={handleSubmit}
          className="createExam-main-card"
        >

          {/* =========================================
              LEFT FORM
          ========================================= */}
          <div className="createExam-form-section">

            <div className="createExam-section-heading">
              <div className="createExam-section-number">
                01
              </div>

              <div>
                <h2>Exam Details</h2>
                <p>
                  Enter the basic information for this examination.
                </p>
              </div>
            </div>

            {/* Subject */}
            <div className="createExam-field">
              <label>
                Subject
                <span>*</span>
              </label>

              <div className="createExam-input-wrapper">
                <i className="las la-book-open"></i>

                <select
                  className="createExam-input"
                  value={form.subject}
                  onChange={(e) => {
                    const selectedSubject = subjects.find(
                      (s) =>
                        String(s.timetableid) ===
                        String(e.target.value)
                    );

                    setForm({
                      ...form,
                      subject: e.target.value,
                      teacher:
                        selectedSubject?.TeacherId || "",
                    });
                  }}
                >
                  {subjects.length === 0 && (
                    <option value="">
                      Loading subjects...
                    </option>
                  )}

                  {subjects.map((s) => {
                    const teacher = teachers.find(
                      (t) =>
                        String(t.id) ===
                        String(s.TeacherId)
                    );

                    return (
                      <option
                        key={s.timetableid}
                        value={s.timetableid}
                      >
                        {s.Subjectname}
                        {teacher
                          ? ` (${teacher.Teachername})`
                          : ""}
                      </option>
                    );
                  })}
                </select>

                <i className="las la-angle-down createExam-select-arrow"></i>
              </div>
            </div>

            {/* Teacher */}
            <div className="createExam-field">
              <label>
                Teacher Name
                <span>*</span>
              </label>

              <div className="createExam-input-wrapper">
                <i className="las la-user-tie"></i>

                <select
                  className="createExam-input"
                  value={form.teacher}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      teacher: e.target.value,
                    })
                  }
                >
                  {teachers.length === 0 && (
                    <option value="">
                      Loading teachers...
                    </option>
                  )}

                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.Teachername}
                    </option>
                  ))}
                </select>

                <i className="las la-angle-down createExam-select-arrow"></i>
              </div>
            </div>

            {/* Exam Type */}
            <div className="createExam-field">
              <label>
                Exam Type
                <span>*</span>
              </label>

              <div className="createExam-input-wrapper">
                <i className="las la-layer-group"></i>

                <select
                  className="createExam-input"
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type: e.target.value,
                    })
                  }
                >
                  <option>Daily Revision Test</option>
                  <option>Monthly Examination</option>
                  <option>Periodic Test-I</option>
                  <option>Periodic Test-II</option>
                  <option>Half-Yearly</option>
                  <option>Final Exam</option>
                </select>

                <i className="las la-angle-down createExam-select-arrow"></i>
              </div>
            </div>

            {/* Marks + Date */}
            <div className="createExam-two-columns">

              <div className="createExam-field">
                <label>
                  Maximum Marks
                  <span>*</span>
                </label>

                <div className="createExam-input-wrapper">
                  <i className="las la-star"></i>

                  <input
                    type="number"
                    min="1"
                    className="createExam-input"
                    placeholder="e.g. 100"
                    value={form.marks}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        marks: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="createExam-field">
                <label>
                  Examination Date
                  <span>*</span>
                </label>

                <div className="createExam-input-wrapper">
                  <i className="las la-calendar"></i>

                  <input
                    type="date"
                    className="createExam-input"
                    value={form.date}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        date: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

            </div>

          </div>

          {/* =========================================
              RIGHT TOPIC SECTION
          ========================================= */}
          <div className="createExam-topic-section">

            <div className="createExam-section-heading">
              <div className="createExam-section-number">
                02
              </div>

              <div>
                <h2>Exam Topic</h2>
                <p>
                  Specify the topic or syllabus covered.
                </p>
              </div>
            </div>

            <div className="createExam-topic-box">

              <div className="createExam-topic-header">
                <label>
                  Topic / Syllabus
                  <span>*</span>
                </label>

                <i className="las la-edit"></i>
              </div>

              <textarea
                className="createExam-textarea"
                placeholder="Enter the topic, chapters or syllabus covered in this examination..."
                value={form.topic}
                onChange={(e) =>
                  setForm({
                    ...form,
                    topic: e.target.value,
                  })
                }
              ></textarea>

              <div className="createExam-topic-helper">
                <i className="las la-info-circle"></i>
                <span>
                  Add the chapters or topics students should prepare
                  for this examination.
                </span>
              </div>

            </div>

            {/* Selected Summary */}
            <div className="createExam-summary">

              <div className="createExam-summary-title">
                <i className="las la-clipboard-check"></i>
                <span>Exam Summary</span>
              </div>

              <div className="createExam-summary-row">
                <span>Class</span>
                <strong>Class {selectedClass}</strong>
              </div>

              <div className="createExam-summary-row">
                <span>Subject</span>
                <strong>
                  {selectedSubjectData?.Subjectname ||
                    "Not selected"}
                </strong>
              </div>

              <div className="createExam-summary-row">
                <span>Teacher</span>
                <strong>
                  {selectedTeacherData?.Teachername ||
                    "Not selected"}
                </strong>
              </div>

              <div className="createExam-summary-row">
                <span>Exam Type</span>
                <strong>{form.type}</strong>
              </div>

              <div className="createExam-summary-row">
                <span>Maximum Marks</span>
                <strong>
                  {form.marks
                    ? `${form.marks} Marks`
                    : "Not entered"}
                </strong>
              </div>

            </div>

          </div>

          {/* =========================================
              FOOTER
          ========================================= */}
          <div className="createExam-form-footer">

            <div className="createExam-required-note">
              <i className="las la-info-circle"></i>

              <span>
                Fields marked with <b>*</b> are required.
              </span>
            </div>

            <div className="createExam-footer-actions">

              <button
                type="button"
                className="createExam-cancel-btn"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="createExam-submit-btn"
              >
                <i className="las la-plus-circle"></i>
                <span>Create Exam</span>
              </button>

            </div>

          </div>

        </form>

      </div>
    </div>
  );
};

export default CreateExam;