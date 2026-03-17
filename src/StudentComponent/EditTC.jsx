import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditTC = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [message, setMessage] = useState(null);

  // ✅ Convert dd-MM-yyyy to yyyy-MM-dd
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";

    if (dateString.includes("-") && dateString.split("-")[0].length === 4) {
      return dateString;
    }

    const parts = dateString.split("-");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    return "";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost/kkblossom/api.php/Adminapi/AdminStudent/viewTc/${id}`
        );

        if (res.data.status) {
          const data = res.data.details;

          setFormData({
            ...data,
            id: data.id,
            date_of_birth: formatDateForInput(data.date_of_birth),
            date_of_admission: formatDateForInput(data.date_of_admission),
            application_date: formatDateForInput(data.application_date),
            issue_date: formatDateForInput(data.issue_date),
          });

        } else {
          setMessage("Student not found");
        }

      } catch (err) {
        console.log(err);
        setMessage("Server Error");
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
      const res = await axios.post(
        "http://localhost/kkblossom/api.php/Adminapi/AdminStudent/updateTc",
        formData   // ✅ id included
      );

      if (res.data.status) {
        navigate("/dashboard/StudentComponent/TransferCertificate");
      } else {
        setMessage(res.data.message);
      }

    } catch (err) {
      console.log(err);
      setMessage("Server Error");
    }
  };

  if (!formData) return <div style={{ padding: 30 }}>Loading...</div>;

  return (
    <div style={styles.pageContainer}>

      <div style={{ fontSize: "20px", margin: 0, padding: "15px" }}>
        Edit Transfer Certificate
      </div>

      {message && (
        <div style={styles.message}>
          {message}
        </div>
      )}

      <div style={styles.formWrapper}>

        <form onSubmit={handleSubmit}>

          <div style={styles.flexRow}>

            <div style={styles.flexColumn}>
              <Input label="Name" name="name" value={formData.name || ""} onChange={handleChange} />
              <Input label="Father's Name" name="father_name" value={formData.father_name || ""} onChange={handleChange} />
              <Input label="Mother's Name" name="mother_name" value={formData.mother_name || ""} onChange={handleChange} />
              <Input label="Last Class" name="last_class" value={formData.last_class || ""} onChange={handleChange} />
              <Input type="date" label="Date of Birth" name="date_of_birth" value={formData.date_of_birth || ""} onChange={handleChange} />
              <Input label="Roll No" name="roll_no" value={formData.roll_no || ""} onChange={handleChange} />
              <Input label="Category" name="category" value={formData.category || ""} onChange={handleChange} />
              <Input type="date" label="Date of Admission" name="date_of_admission" value={formData.date_of_admission || ""} onChange={handleChange} />
              <Input label="Admission Number" name="admission_number" value={formData.admission_number || ""} onChange={handleChange} />
            </div>

            <div style={styles.flexColumn}>
              <Input label="Subjects Studied" name="subjects_studied" value={formData.subjects_studied || ""} onChange={handleChange} />
              <Input label="Qualified for Promotion" name="qualified_mark" value={formData.qualified_mark || ""} onChange={handleChange} />
              <Input label="Dues Date" name="dues_date" value={formData.dues_date || ""} onChange={handleChange} />
              <Input label="Last School" name="last_school" value={formData.last_school || ""} onChange={handleChange} />
              <Input label="Nationality" name="nationality" value={formData.nationality || ""} onChange={handleChange} />
              <Input label="Session" name="session" value={formData.session || ""} onChange={handleChange} />
              <Input label="Working Days" name="working_days" value={formData.working_days || ""} onChange={handleChange} />
              <Input label="Present Days" name="present_days" value={formData.present_days || ""} onChange={handleChange} />
            </div>

            <div style={styles.flexColumn}>
              <Input type="date" label="Application Date" name="application_date" value={formData.application_date || ""} onChange={handleChange} />
              <Input type="date" label="Issue Date" name="issue_date" value={formData.issue_date || ""} onChange={handleChange} />
              <Input label="Reason" name="reason" value={formData.reason || ""} onChange={handleChange} />
              <Input label="NCC" name="ncc" value={formData.ncc || ""} onChange={handleChange} />
              <Input label="Games Played" name="games_played" value={formData.games_played || ""} onChange={handleChange} />
              <Input label="General Conduct" name="general_conduct" value={formData.general_conduct || ""} onChange={handleChange} />
              <Input label="Remarks" name="remarks" value={formData.remarks || ""} onChange={handleChange} />
            </div>

          </div>

          <div style={{ textAlign: "center", marginTop: 30 }}>
            <button type="submit" style={styles.button}>
              Update
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

const Input = ({ label, type = "text", ...props }) => (
  <div style={{ marginBottom: 15 }}>
    <label style={styles.label}>{label}</label>
    <input type={type} style={styles.input} {...props} />
  </div>
);

const styles = {
  pageContainer: { background: "#f5f7fa", minHeight: "100vh" },
  formWrapper: {
    background: "#ffffff",
    padding: "30px",
    border: "1px solid lightgray",
    boxShadow: "0 0 10px rgba(0,0,0,0.05)",
  },
  flexRow: { display: "flex", gap: "20px" },
  flexColumn: { flex: 1 },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    display: "block",
    marginBottom: "5px",
  },
  input: {
    width: "80%",
    padding: "8px 5px",
    border: "1px solid #ccc",
    borderRadius: "2px",
  },
  button: {
    padding: "10px 25px",
    background: "#1a5dd9",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  message: {
    marginBottom: "20px",
    color: "green",
    fontWeight: "500",
  },
};

export default EditTC;