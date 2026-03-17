import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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
      navigate("/dashboard/StudentComponent/TransferCertificate");
    } else {
      setMessage(res.data.message);
    }

  } catch (err) {
    console.log(err);
    setMessage("Server Error");
  }
};

  if (!info) return <div style={{ padding: 30 }}>Loading...</div>;

  return (
    <div style={styles.pageContainer}>
 <div style={{fontSize:"20px",margin:0,padding:"15px"}}>
          Details
        </div>
      {message && (
        <div style={styles.message}>
          {message}
        </div>
      )}

      <div style={styles.formWrapper}>
       

        <form onSubmit={handleSubmit}>

          <div style={styles.flexRow}>

            {/* LEFT COLUMN */}
            <div style={styles.flexColumn}>
              <Input label="Category" name="category" onChange={handleChange} />
              <Input label="Date of Admission" type="date" name="admission_date" onChange={handleChange} />
              <Input label="Class of Admission" name="admission_class" onChange={handleChange} />
              <Input label="Whether failed, if so once/twice in the same class:" name="failed_mark" onChange={handleChange} />
              <Input label="Any fee concession availed of: if so the nature of such concession" name="fee_concession" onChange={handleChange} />
              <Input label="Total no. of working days" name="total_days" value={formData.total_days} onChange={handleChange} />
              <Input label="Total no. of days present" name="present_days" value={formData.present_days} onChange={handleChange} />
              <Input label="Admission Number" name="admission_number" value={formData.admission_number} onChange={handleChange} />
            </div>

            {/* MIDDLE COLUMN */}
            <div style={styles.flexColumn}>
              <Input label="Subjects Studied" name="subjects" onChange={handleChange} />
              <Input label="Whether qualified to admission in higher Class?" name="qualified_mark" onChange={handleChange} />
              <Input label="Date up to which school dues have been paid:" name="dues_date" onChange={handleChange} />
              <Input label="School/board Annual examination last taken with result:" name="last_school" onChange={handleChange} />
              <Input label="Nationality" name="nationality" value={formData.nationality} onChange={handleChange} />
              <Input label="Session" name="session" value={formData.session} onChange={handleChange} />
            </div>

            {/* RIGHT COLUMN */}
            <div style={styles.flexColumn}>
              <Input type="date" label="Date of Application for Transfer Certificate:" name="application_date" onChange={handleChange} />
              <Input type="date" label="Date of issue of Transfer Certificate" name="issue_date" onChange={handleChange} />
              <Input label="Reason of Leaving The School" name="reason" onChange={handleChange} />
              <Input label="Whether NCC cader/Boy Scout/Girl Guide (Details may be given):" name="ncc" onChange={handleChange} />
              <Input label="Games played or extra curricular activities in which the pupil usually took part(mention achievement level there in):" name="games_played" onChange={handleChange} />
              <Input label="General Conduct" name="general_conduct" onChange={handleChange} />
              <Input label="Any Other Remarks" name="remarks" onChange={handleChange} />
            </div>

          </div>

          <div style={{ textAlign: "center", marginTop: 30 }}>
            <button type="submit" style={styles.button}>
              Generate
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
    <input
      type={type}
      style={styles.input}
      {...props}
    />
  </div>
);

const styles = {
  pageContainer: {
    background: "#f5f7fa",
    minHeight: "100vh",
  },
  formWrapper: {
    background: "#ffffff",
    padding: "30px",
    border:"1px solid  lightgray",
    boxShadow: "0 0 10px rgba(0,0,0,0.05)",
  },
  header: {
    fontSize: "22px",
    fontWeight: "600",
    marginBottom: "20px",
  },
  flexRow: {
    display: "flex",
    gap: "20px",
  },
  flexColumn: {
    flex: 1,
  },
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

export default GenerateTC;
