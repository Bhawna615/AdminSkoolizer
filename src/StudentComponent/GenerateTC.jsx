import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./GenerateTC.css";

const GenerateTC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [info, setInfo] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    category: "",
    admission_date: "",
    admission_class: "",
    failed_mark: "",
    fee_concession: "",
    total_days: "",
    present_days: "",
    admission_number: "",
    subjects: "",
    qualified_mark: "",
    dues_date: "",
    last_school: "",
    nationality: "Indian",
    session: "",
    application_date: "",
    issue_date: "",
    reason: "",
    ncc: "",
    games_played: "",
    general_conduct: "",
    remarks: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost/kkblossom/api.php/Adminapi/AdminStudentAttendance/studentAttendance/${id}`
        );

        if (res.data.status) {
          const student = res.data.info;
          const att = res.data.attendance;

          setInfo(student);
          setAttendance(att);

          const currentYear = new Date().getFullYear();
          const nextYear = currentYear + 1;

          setFormData((prev) => ({
            ...prev,
            total_days: att[0],
            present_days: att[1],
            admission_number: student.Admno,
            session: `${currentYear}-${nextYear}`,
          }));
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        id,
        name: info?.Name,
        father_name: info?.Fname,
        mother_name: info?.Mname,
        last_class: info?.Class,
        date_of_birth: info?.Dob,
        roll_no: info?.Rollno,
        ...formData,
      };

      const res = await axios.post(
        "http://localhost/kkblossom/api.php/Adminapi/AdminStudentAttendance/generateTc",
        payload
      );

      if (res.data.status) {
        navigate(
          "/dashboard/StudentComponent/TransferCertificate"
        );
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      console.error("Generate TC Error:", err);

      console.log(
        "Server Response:",
        err.response?.data
      );

      console.log(
        "Status:",
        err.response?.status
      );

      setMessage(
        err.response?.data?.message ||
          err.message ||
          "Server Error"
      );
    }
  };

  if (!info) {
    return (
      <div className="generate-tc-loading">
        Loading...
      </div>
    );
  }

  return (
    <div className="generate-tc-page">

      {/* HEADER */}
      <div className="generate-tc-header">
        <div>
          <h2>
            <i className="bi bi-file-earmark-text"></i>
            Generate Transfer Certificate
          </h2>

          <p>
            Fill in the details to generate the transfer certificate.
          </p>
        </div>

        <button
          type="button"
          className="generate-tc-back-btn"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left"></i>
          Back
        </button>
      </div>

      {message && (
        <div className="generate-tc-message">
          <i className="bi bi-exclamation-circle"></i>
          {message}
        </div>
      )}

      <div className="generate-tc-card">

        <div className="generate-tc-card-title">
          <i className="bi bi-pencil-square"></i>
          Details
        </div>

        <form onSubmit={handleSubmit}>

          <div className="generate-tc-form-row">

            {/* LEFT COLUMN */}
            <div className="generate-tc-column">

              <Input
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              />

              <Input
                label="Date of Admission"
                type="date"
                name="admission_date"
                value={formData.admission_date}
                onChange={handleChange}
              />

              <Input
                label="Class of Admission"
                name="admission_class"
                value={formData.admission_class}
                onChange={handleChange}
              />

              <Input
                label="Whether failed, if so once/twice in the same class:"
                name="failed_mark"
                value={formData.failed_mark}
                onChange={handleChange}
              />

              <Input
                label="Any fee concession availed of: if so the nature of such concession"
                name="fee_concession"
                value={formData.fee_concession}
                onChange={handleChange}
              />

              <Input
                label="Total no. of working days"
                name="total_days"
                value={formData.total_days}
                onChange={handleChange}
              />

              <Input
                label="Total no. of days present"
                name="present_days"
                value={formData.present_days}
                onChange={handleChange}
              />

              <Input
                label="Admission Number"
                name="admission_number"
                value={formData.admission_number}
                onChange={handleChange}
              />

            </div>

            {/* MIDDLE COLUMN */}
            <div className="generate-tc-column">

              <Input
                label="Subjects Studied"
                name="subjects"
                value={formData.subjects}
                onChange={handleChange}
              />

              <Input
                label="Whether qualified to admission in higher Class?"
                name="qualified_mark"
                value={formData.qualified_mark}
                onChange={handleChange}
              />

              <Input
                label="Date up to which school dues have been paid:"
                name="dues_date"
                value={formData.dues_date}
                onChange={handleChange}
              />

              <Input
                label="School/board Annual examination last taken with result:"
                name="last_school"
                value={formData.last_school}
                onChange={handleChange}
              />

              <Input
                label="Nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
              />

              <Input
                label="Session"
                name="session"
                value={formData.session}
                onChange={handleChange}
              />

            </div>

            {/* RIGHT COLUMN */}
            <div className="generate-tc-column">

              <Input
                type="date"
                label="Date of Application for Transfer Certificate:"
                name="application_date"
                value={formData.application_date}
                onChange={handleChange}
              />

              <Input
                type="date"
                label="Date of issue of Transfer Certificate"
                name="issue_date"
                value={formData.issue_date}
                onChange={handleChange}
              />

              <Input
                label="Reason of Leaving The School"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
              />

              <Input
                label="Whether NCC cader/Boy Scout/Girl Guide (Details may be given):"
                name="ncc"
                value={formData.ncc}
                onChange={handleChange}
              />

              <Input
                label="Games played or extra curricular activities in which the pupil usually took part(mention achievement level there in):"
                name="games_played"
                value={formData.games_played}
                onChange={handleChange}
              />

              <Input
                label="General Conduct"
                name="general_conduct"
                value={formData.general_conduct}
                onChange={handleChange}
              />

              <Input
                label="Any Other Remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
              />

            </div>

          </div>

          <div className="generate-tc-actions">

            <button
              type="button"
              className="generate-tc-cancel-btn"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="generate-tc-button"
            >
              <i className="bi bi-file-earmark-check"></i>
              Generate
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

const Input = ({
  label,
  type = "text",
  ...props
}) => (
  <div className="generate-tc-input-group">

    <label>{label}</label>

    <input
      type={type}
      {...props}
    />

  </div>
);

export default GenerateTC;