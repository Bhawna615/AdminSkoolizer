
import React, { useMemo } from "react";
import schoolLogo from "../images/school-logo.png";
import "./ReportCard.css";

const SUBJECT_COLUMNS = [
  { key: "periodicTest1", label: "Periodic Test-I", max: 10 },
  { key: "nb1", label: "NB-I", max: 5 },
  { key: "sea1", label: "SEA-I", max: 5 },
  { key: "halfYearly", label: "Half-Yearly", max: 80 },
  { key: "term1Total", label: "Term I Total", max: 100 },
  { key: "periodicTest2", label: "Periodic Test-II", max: 10 },
  { key: "nb2", label: "NB-II", max: 5 },
  { key: "sea2", label: "SEA-II", max: 5 },
  { key: "yearlyExam", label: "Yearly Exam", max: 80 },
  { key: "term2Total", label: "Term II Total", max: 100 },
  { key: "finalTotal", label: "Final Result", max: 100 },
];

const SAMPLE_SUBJECTS = [
  "English",
  "Hindi",
  "Mathematics",
  "Science",
  "Social Studies",
  "Sanskrit",
  "Computer",
];

const safeValue = (value, fallback = "—") =>
  value !== undefined && value !== null && value !== ""
    ? value
    : fallback;

const getSubjectName = (row) =>
  row?.subject ?? row?.Subject ?? row?.name ?? row?.Name ?? "";

const getNumericValue = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const formatNumber = (value) => {
  const number = getNumericValue(value);
  if (number === null) return "—";
  return Number.isInteger(number) ? String(number) : number.toFixed(2);
};

const getSubjectMark = (row, column) => {
  const aliases = {
    periodicTest1: ["periodicTest1", "periodic_test_1", "PT1", "pt1"],
    nb1: ["nb1", "NB1", "notebook1"],
    sea1: ["sea1", "SEA1"],
    halfYearly: ["halfYearly", "half_yearly", "HalfYearly"],
    term1Total: ["term1Total", "term1_total", "total1"],
    periodicTest2: ["periodicTest2", "periodic_test_2", "PT2", "pt2"],
    nb2: ["nb2", "NB2", "notebook2"],
    sea2: ["sea2", "SEA2"],
    yearlyExam: ["yearlyExam", "yearly_exam", "YearlyExam"],
    term2Total: ["term2Total", "term2_total", "total2"],
    finalTotal: ["finalTotal", "final_total", "grandTotal", "grand_total"],
  };

  for (const key of aliases[column.key] || [column.key]) {
    if (row?.[key] !== undefined && row?.[key] !== null && row?.[key] !== "") {
      return row[key];
    }
  }

  return null;
};

const getGrade = (percentage) => {
  if (percentage === null || percentage === undefined || !Number.isFinite(Number(percentage))) {
    return "—";
  }

  const score = Number(percentage);

  if (score >= 91) return "A1";
  if (score >= 81) return "A2";
  if (score >= 71) return "B1";
  if (score >= 61) return "B2";
  if (score >= 51) return "C1";
  if (score >= 41) return "C2";
  if (score >= 33) return "D";
  return "E";
};

const ReportCard = ({ data }) => {
  const {
    student = {},
    scholastic = [],
    coScholastic = [],
    attendance = {},
    summary = {},
  } = data || {};

  const subjectRows = useMemo(() => {
    if (Array.isArray(scholastic)) return scholastic;
    if (Array.isArray(scholastic?.subjects)) return scholastic.subjects;
    if (Array.isArray(scholastic?.rows)) return scholastic.rows;
    return [];
  }, [scholastic]);

  const coScholasticRows = Array.isArray(coScholastic)
    ? coScholastic
    : Array.isArray(coScholastic?.activities)
      ? coScholastic.activities
      : [];

  const calculated = useMemo(() => {
    const term1 = subjectRows.reduce((sum, row) => {
      const value = getNumericValue(getSubjectMark(row, SUBJECT_COLUMNS[4]));
      return sum + (value ?? 0);
    }, 0);

    const term2 = subjectRows.reduce((sum, row) => {
      const value = getNumericValue(getSubjectMark(row, SUBJECT_COLUMNS[9]));
      return sum + (value ?? 0);
    }, 0);

    const explicitTotal = getNumericValue(
      summary.totalMarks ?? summary.grandTotal ?? summary.total
    );

    const explicitMaximum = getNumericValue(
      summary.maxMarks ?? summary.maximumMarks ?? summary.maxTotal
    );

    const finalValues = subjectRows
      .map((row) => getNumericValue(getSubjectMark(row, SUBJECT_COLUMNS[10])))
      .filter((value) => value !== null);

    const finalTotal = finalValues.length
      ? finalValues.reduce((sum, value) => sum + value, 0)
      : null;

    const total = explicitTotal ?? finalTotal;
    const maximum = explicitMaximum ?? (finalValues.length ? finalValues.length * 100 : null);

    const percentageFromSummary = getNumericValue(
      summary.percentage ?? summary.percent
    );

    const percentage =
      percentageFromSummary ??
      (total !== null && maximum > 0
        ? Math.round((total / maximum) * 10000) / 100
        : null);

    return {
      term1,
      term2,
      total,
      maximum,
      percentage,
      grade: safeValue(summary.overallGrade ?? summary.grade, getGrade(percentage)),
    };
  }, [subjectRows, summary]);

  const presentDays = getNumericValue(
    attendance.present ?? attendance.Present ?? attendance.presentDays
  );

  const totalDays = getNumericValue(
    attendance.totalDays ?? attendance.total ?? attendance.workingDays
  );

  const attendancePercentage =
    getNumericValue(attendance.percentage ?? attendance.attendancePercentage) ??
    (presentDays !== null && totalDays > 0
      ? Math.round((presentDays / totalDays) * 1000) / 10
      : null);

  const session = safeValue(
    data?.session ?? summary.session ?? summary.academicSession,
    "Academic Session"
  );

  const studentName = safeValue(student.name ?? student.Name);
  const className = safeValue(student.class ?? student.className ?? student.Class);
  const section = safeValue(student.section ?? student.Section);
  const photo = student.photo ?? student.Photo ?? student.photoUrl;

  const handlePrint = () => window.print();

  return (
    <main className="report-card-page">
      <div className="report-card-toolbar">
        <div className="report-card-toolbar-title">
          <span className="report-card-toolbar-icon">✦</span>
          <div>
            <h1>Student Report Card</h1>
            <p>Academic performance and progress overview</p>
          </div>
        </div>

        <button
          type="button"
          className="report-card-print-button"
          onClick={handlePrint}
        >
          <span aria-hidden="true">⎙</span>
          Print Report Card
        </button>
      </div>

      <article className="report-card-sheet">
        <header className="rc-school-header">
          <img
            src={schoolLogo}
            alt="KK Blossoms School logo"
            className="rc-school-logo"
          />

          <div className="rc-school-identity">
            <span className="rc-official-label">OFFICIAL STUDENT RECORD</span>
            <h2>KK BLOSSOMS SCHOOL</h2>
            <p>Rabaun, Solan (H.P)</p>
            <p>www.kkblossomschool.org</p>
            <div className="rc-school-meta">
              <span>Recognition No: 16/2022-27</span>
              <span>UDISE No: 02090112903</span>
            </div>
          </div>
        </header>

        <div className="rc-report-title">
          <div>
            <span>ACADEMIC PERFORMANCE</span>
            <h3>STUDENT REPORT CARD</h3>
            <p>{session}</p>
          </div>
          <div className="rc-session-badge">REPORT CARD</div>
        </div>

        <section className="rc-student-section">
          <div className="rc-section-heading">
            <span>01</span>
            <div>
              <h4>Student Profile</h4>
              <p>Student identification and personal details</p>
            </div>
          </div>

          <div className="rc-student-content">
            <div className="rc-student-grid">
              <div className="rc-student-field">
                <span>Student's Name</span>
                <strong>{studentName}</strong>
              </div>
              <div className="rc-student-field">
                <span>Class / Section</span>
                <strong>{className} / {section}</strong>
              </div>
              <div className="rc-student-field">
                <span>Roll Number</span>
                <strong>{safeValue(student.rollNo ?? student.Rollno ?? student.roll_number)}</strong>
              </div>
              <div className="rc-student-field">
                <span>Admission Number</span>
                <strong>{safeValue(student.admNo ?? student.AdmissionNo ?? student.admissionNumber)}</strong>
              </div>
              <div className="rc-student-field">
                <span>Father's Name</span>
                <strong>{safeValue(student.fatherName ?? student.Fname)}</strong>
              </div>
              <div className="rc-student-field">
                <span>Mother's Name</span>
                <strong>{safeValue(student.motherName ?? student.Mname)}</strong>
              </div>
              <div className="rc-student-field">
                <span>Date of Birth</span>
                <strong>{safeValue(student.dob ?? student.Dob)}</strong>
              </div>
              <div className="rc-student-field">
                <span>Gender</span>
                <strong>{safeValue(student.gender ?? student.Gender)}</strong>
              </div>
              <div className="rc-student-field">
                <span>Height</span>
                <strong>{safeValue(student.height ?? student.Height)}</strong>
              </div>
              <div className="rc-student-field">
                <span>Weight</span>
                <strong>{safeValue(student.weight ?? student.Weight)}</strong>
              </div>
              <div className="rc-student-field">
                <span>Blood Group</span>
                <strong>{safeValue(student.bloodGroup ?? student.BloodGroup)}</strong>
              </div>
            </div>

            <div className="rc-student-photo">
              {photo ? (
                <img src={photo} alt={`${studentName} profile`} />
              ) : (
                <div className="rc-photo-placeholder">
                  <span>STUDENT</span>
                  <small>PHOTO</small>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="rc-results-section">
          <div className="rc-section-heading">
            <span>02</span>
            <div>
              <h4>Scholastic Result</h4>
              <p>Subject-wise assessment across both terms</p>
            </div>
          </div>

          <div className="rc-table-scroll">
            <table className="rc-table rc-scholastic-table">
              <thead>
                <tr>
                  <th rowSpan="2" className="rc-subject-column">Subject</th>
                  <th colSpan="5" className="rc-term-heading">TERM I</th>
                  <th colSpan="5" className="rc-term-heading">TERM II</th>
                  <th rowSpan="2" className="rc-final-column">Final Total</th>
                </tr>
                <tr>
                  {SUBJECT_COLUMNS.slice(0, 5).map((column) => (
                    <th key={column.key}>
                      {column.label}
                      <small>{column.max ? `Max ${column.max}` : ""}</small>
                    </th>
                  ))}
                  {SUBJECT_COLUMNS.slice(5, 10).map((column) => (
                    <th key={column.key}>
                      {column.label}
                      <small>{column.max ? `Max ${column.max}` : ""}</small>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {subjectRows.length > 0 ? (
                  subjectRows.map((row, index) => (
                    <tr key={row.id ?? row.subjectId ?? index}>
                      <td className="rc-subject-name">
                        {safeValue(getSubjectName(row))}
                      </td>
                      {SUBJECT_COLUMNS.slice(0, 10).map((column) => (
                        <td key={column.key}>
                          {formatNumber(getSubjectMark(row, column))}
                        </td>
                      ))}
                      <td className="rc-final-mark">
                        {formatNumber(getSubjectMark(row, SUBJECT_COLUMNS[10]))}
                      </td>
                    </tr>
                  ))
                ) : (
                  SAMPLE_SUBJECTS.map((subject) => (
                    <tr key={subject}>
                      <td className="rc-subject-name">{subject}</td>
                      {SUBJECT_COLUMNS.map((column) => (
                        <td key={column.key}>—</td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {subjectRows.length === 0 && (
            <p className="rc-data-note">
              Subject marks will appear here when scholastic result data is supplied.
            </p>
          )}
        </section>

        <section className="rc-summary-grid">
          <div className="rc-summary-card">
            <span className="rc-summary-icon">Σ</span>
            <div>
              <span>Grand Total</span>
              <strong>
                {calculated.total === null
                  ? "—"
                  : `${formatNumber(calculated.total)}${calculated.maximum !== null ? ` / ${formatNumber(calculated.maximum)}` : ""}`}
              </strong>
            </div>
          </div>

          <div className="rc-summary-card rc-percentage-card">
            <span className="rc-summary-icon">%</span>
            <div>
              <span>Percentage</span>
              <strong>
                {calculated.percentage === null
                  ? "—"
                  : `${calculated.percentage}%`}
              </strong>
            </div>
          </div>

          <div className="rc-summary-card">
            <span className="rc-summary-icon">A+</span>
            <div>
              <span>Overall Grade</span>
              <strong>{calculated.grade}</strong>
            </div>
          </div>
        </section>

        <section className="rc-lower-grid">
          <div className="rc-panel">
            <div className="rc-section-heading">
              <span>03</span>
              <div>
                <h4>Grading Scale</h4>
                <p>Reference for percentage-based grades</p>
              </div>
            </div>

            <table className="rc-table rc-grading-table">
              <thead>
                <tr>
                  <th>Marks (%)</th>
                  <th>Grade</th>
                  <th>Marks (%)</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>91–100</td><td>A1</td><td>51–60</td><td>C1</td></tr>
                <tr><td>81–90</td><td>A2</td><td>41–50</td><td>C2</td></tr>
                <tr><td>71–80</td><td>B1</td><td>33–40</td><td>D</td></tr>
                <tr><td>61–70</td><td>B2</td><td>0–32</td><td>E</td></tr>
              </tbody>
            </table>
          </div>

          <div className="rc-panel">
            <div className="rc-section-heading">
              <span>04</span>
              <div>
                <h4>Co-Scholastic Result</h4>
                <p>Activities and personal development</p>
              </div>
            </div>

            <table className="rc-table">
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Term I</th>
                  <th>Term II</th>
                </tr>
              </thead>
              <tbody>
                {coScholasticRows.length > 0 ? (
                  coScholasticRows.map((row, index) => (
                    <tr key={row.id ?? index}>
                      <td>
                        {safeValue(row.activity ?? row.Activity ?? row.name)}
                      </td>
                      <td>
                        {safeValue(row.term1 ?? row.Term1 ?? row.term_1)}
                      </td>
                      <td>
                        {safeValue(row.term2 ?? row.Term2 ?? row.term_2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="rc-empty-cell">
                      No activity results supplied
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rc-attendance-section">
          <div className="rc-section-heading">
            <span>05</span>
            <div>
              <h4>Attendance</h4>
              <p>Attendance record for the academic session</p>
            </div>
          </div>

          <div className="rc-attendance-grid">
            <div>
              <span>Days Present</span>
              <strong>{safeValue(presentDays, "—")}</strong>
            </div>
            <div>
              <span>Total Working Days</span>
              <strong>{safeValue(totalDays, "—")}</strong>
            </div>
            <div>
              <span>Attendance Percentage</span>
              <strong>
                {attendancePercentage === null
                  ? "—"
                  : `${attendancePercentage}%`}
              </strong>
            </div>
          </div>
        </section>

        <section className="rc-remarks-section">
          <div className="rc-remarks-item">
            <span>Teacher's Remarks</span>
            <p>{safeValue(summary.remarks ?? summary.Remarks, " ")}</p>
          </div>
          <div className="rc-result-item">
            <span>Promotion / Result</span>
            <strong>
              {safeValue(summary.result ?? summary.promotion ?? summary.Result)}
            </strong>
          </div>
        </section>

        <footer className="rc-signatures">
          <div>
            <span className="rc-signature-line" />
            <strong>Class Teacher</strong>
          </div>
          <div>
            <span className="rc-signature-line" />
            <strong>Parent / Guardian</strong>
          </div>
          <div>
            <span className="rc-signature-line" />
            <strong>Principal</strong>
          </div>
        </footer>

        <div className="rc-footer-strip">
          <span>KK BLOSSOMS SCHOOL • RABAUN, SOLAN (H.P)</span>
          <span>STUDENT REPORT CARD</span>
        </div>
      </article>
    </main>
  );
};

export default ReportCard;
