import React from "react";
import schoolLogo from "../images/school-logo.png";
const ReportCard = ({ data }) => {
  const { student, scholastic, coScholastic, attendance, summary } = data || {};

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <img
          src={schoolLogo}
          alt="School Logo"
          className="report-school-logo"
        />
        <div style={styles.headerText}>
          <h1 style={styles.schoolName}>KK BLOSSOMS SCHOOL</h1>
          <p style={styles.subHeader}>Rabaun, Solan (H.P)</p>
          <p style={styles.subHeader}>Website: www.kkblossomschool.org/</p>
          <p style={styles.subHeader}>Recognition Number: 16/2022-27</p>
          <p style={styles.subHeader}>UDISE No: 02090112903</p>
        </div>
      </div>

      {/* Title */}
      <div style={styles.titleBox}>
        Report Card: Academic Session 2024-25
      </div>

      {/* Student Details Grid */}
      <div style={styles.detailsContainer}>
        <table style={styles.infoTable}>
          <tbody>
            <tr>
              <td><strong>STUDENT'S NAME:</strong> {student?.name || "ADITYA"}</td>
              <td><strong>CLASS:</strong> {student?.class || "7"}</td>
              <td><strong>SECTION:</strong> {student?.section || "A"}</td>
            </tr>
            <tr>
              <td><strong>FATHER'S NAME:</strong> {student?.fatherName || "SUMAN KUMAR"}</td>
              <td><strong>MOTHER'S NAME:</strong> {student?.motherName || "PREETI"}</td>
              <td><strong>ROLL NO:</strong> {student?.rollNo || "3"}</td>
            </tr>
            <tr>
              <td><strong>ADM. NO.:</strong> {student?.admNo || "BS-806"}</td>
              <td><strong>D.O.B:</strong> {student?.dob || "26-05-2013"}</td>
              <td><strong>GENDER:</strong> {student?.gender || "M"}</td>
            </tr>
            <tr>
              <td><strong>HEIGHT:</strong> {student?.height || "137 CM"}</td>
              <td><strong>WEIGHT:</strong> {student?.weight || "32 KG"}</td>
              <td><strong>B. GR:</strong> {student?.bloodGroup || "B+"}</td>
            </tr>
          </tbody>
        </table>
        <div style={styles.photoBox}>
          {student?.photo ? (
            <img src={student.photo} alt="Student" style={styles.photo} />
          ) : null}
        </div>
      </div>

      {/* Scholastic Result Table */}
      <table style={styles.dataTable}>
        <thead>
          <tr>
            <th colSpan="12" style={styles.tableHeaderSection}>Scholastic Result</th>
          </tr>
          <tr>
            <th rowspan="2">Subjects</th>
            <th>Periodic Test-I</th>
            <th>NB-I</th>
            <th>SEA-I</th>
            <th>Half-Yearly</th>
            <th>Total</th>
            <th>Periodic Test-II</th>
            <th>NB-II</th>
            <th>SEA-II</th>
            <th>Yearly Exam</th>
            <th>Total</th>
            <th rowspan="2">Total Term 1 (50%) + Term 2 (50%)</th>
          </tr>
          <tr>
            <th>Total-10</th>
            <th>Total-5</th>
            <th>Total-5</th>
            <th>Total-80</th>
            <th>Total-100</th>
            <th>Total-10</th>
            <th>Total-5</th>
            <th>Total-5</th>
            <th>Total-80</th>
            <th>Total-100</th>
          </tr>
        </thead>
        <tbody>
          {/* Sample rows matching screenshot structure */}
          <tr>
            <td>English</td>
            <td>8.8</td>
            <td>4</td>
            <td>4</td>
            <td>60</td>
            <td>38.4</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Hindi</td>
            <td>9.1</td>
            <td>5</td>
            <td>5</td>
            <td>9.55</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Mathematics</td>
            <td>6.8</td>
            <td>4</td>
            <td>4</td>
            <td>0</td>
            <td>7.4</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Science</td>
            <td>6.9</td>
            <td>3</td>
            <td>3</td>
            <td>49</td>
            <td>30.95</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Social Sc.</td>
            <td>6.0</td>
            <td>4</td>
            <td>4</td>
            <td>62</td>
            <td>38</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Sanskrit</td>
            <td>8.8</td>
            <td>5</td>
            <td>5</td>
            <td>0</td>
            <td>9.4</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Computer</td>
            <td>8.9</td>
            <td>8.9</td>
            <td>4</td>
            <td>10.9</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      {/* Grand Total Row */}
      <table style={styles.summaryTable}>
        <tbody>
          <tr>
            <td><strong>Grand Total:</strong> 144.6/272.5</td>
            <td><strong>Percentage:</strong> 53.1%</td>
            <td><strong>Overall Grade:</strong> C1</td>
          </tr>
        </tbody>
      </table>

      {/* Grading Scale Table */}
      <table style={styles.dataTable}>
        <thead>
          <tr>
            <th colSpan="8" style={styles.tableHeaderSection}>Grading Scale</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Mark Range</strong></td>
            <td>100 - 91</td>
            <td>90 - 81</td>
            <td>80 - 71</td>
            <td>70 - 61</td>
            <td>60 - 51</td>
            <td>50 - 41</td>
            <td>40 - 33</td>
            <td>32 - 0</td>
          </tr>
          <tr>
            <td><strong>Grades</strong></td>
            <td>A1</td>
            <td>A2</td>
            <td>B1</td>
            <td>B2</td>
            <td>C1</td>
            <td>C2</td>
            <td>D</td>
            <td>E</td>
          </tr>
        </tbody>
      </table>

      {/* Co-Scholastic Table */}
      <table style={styles.dataTable}>
        <thead>
          <tr>
            <th colSpan="3" style={styles.tableHeaderSection}>Co Scholastic Result</th>
          </tr>
          <tr>
            <th>Activities</th>
            <th>Term-1</th>
            <th>Term-2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Art/Music</td>
            <td>A</td>
            <td>A</td>
          </tr>
          <tr>
            <td>Health & Physical Education</td>
            <td>A</td>
            <td>A</td>
          </tr>
        </tbody>
      </table>

      {/* Attendance Table */}
      <table style={styles.dataTable}>
        <thead>
          <tr>
            <th colSpan="3" style={styles.tableHeaderSection}>Attendance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Present:</strong> 191</td>
            <td><strong>Total Days:</strong> 199</td>
            <td><strong>Percentage:</strong> 96.0%</td>
          </tr>
        </tbody>
      </table>

      {/* Remarks & Result */}
      <div style={styles.footerSection}>
        <p><strong>Remarks:</strong> Consistent efforts and hopeful attitude paves the way for future.</p>
        <p><strong>Result: Promoted to Class 8</strong></p>
      </div>

      {/* Signatures */}
      <div style={styles.signatureContainer}>
        <div><strong>Teacher's Signature</strong></div>
        <div><strong>Principal's Signature</strong></div>
      </div>
    </div>
  );
};

// Inline CSS Styles matching the screenshot layout
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    backgroundColor: "#fff",
    color: "#000",
    fontSize: "12px",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: "10px",
  },
  logo: {
    position: "absolute",
    left: "0",
    top: "0",
    height: "120px",
  },
  headerText: {
    textAlign: "center",
  },
  schoolName: {
    margin: "0",
    fontSize: "22px",
    fontWeight: "bold",
  },
  subHeader: {
    margin: "2px 0",
    fontSize: "12px",
  },
  titleBox: {
    border: "1px solid #000",
    textAlign: "center",
    padding: "4px",
    fontWeight: "bold",
    marginBottom: "5px",
    fontSize: "13px",
  },
  detailsContainer: {
    display: "flex",
    border: "1px solid #000",
    marginBottom: "5px",
  },
  infoTable: {
    width: "82%",
    borderCollapse: "collapse",
    borderRight: "1px solid #000",
  },
  photoBox: {
    width: "18%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  photo: {
    maxWidth: "100%",
    maxHeight: "100%",
  },
  dataTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "5px",
    textAlign: "center",
  },
  tableHeaderSection: {
    backgroundColor: "#fff",
    fontWeight: "bold",
    padding: "4px",
  },
  summaryTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "5px",
    textAlign: "center",
    border: "1px solid #000",
    padding: "4px",
  },
  footerSection: {
    marginTop: "15px",
    fontSize: "13px",
    lineHeight: "1.6",
  },
  signatureContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "50px",
    padding: "0 20px",
  },
};

// Global table cell borders
const tableCellStyle = `
  table, th, td {
    border: 1px solid #000;
  }
  th, td {
    padding: 3px 5px;
  }
`;

export default ReportCard;