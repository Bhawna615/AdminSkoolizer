
import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Report.css";

import schoolLogo from "../images/school-logo.png";
import userLogo from "../images/user.svg";

const API_BASE = "http://localhost/kkblossom/api.php/Adminapi";

const Report = () => {
  const { id } = useParams();
  const reportRef = useRef(null);
  const printTriggered = useRef(false);

  const [schoolInfo] = useState({
    schoolName: "KK BLOSSOMS SCHOOL",
    schoolAddress: "Rabaun, Solan (H.P)",
  });

  const [student, setStudent] = useState(null);
  const [report, setReport] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchReport = async () => {
      if (!id) {
        setError("Student ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        printTriggered.current = false;

        const response = await axios.get(
          `${API_BASE}/AdminStudent/examReport?student_id=${id}`
        );

        if (cancelled) return;

        const data = response.data?.data || {};

        setStudent(data.student ?? null);
        setReport(Array.isArray(data.report) ? data.report : []);
        setMetrics(Array.isArray(data.metrics) ? data.metrics : []);
      } catch (err) {
        if (cancelled) return;

        console.error("Fetch Error:", err);
        setError("Failed to load the examination report. Please try again.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchReport();

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (loading || error || !student || printTriggered.current) return;

    printTriggered.current = true;

    // Wait for React to render and the school logo to load.
    const frame = requestAnimationFrame(() => {
      const images = reportRef.current?.querySelectorAll("img") || [];
      const pendingImages = Array.from(images).filter(
        (img) => !img.complete
      );

      Promise.all(
        pendingImages.map(
          (img) =>
            new Promise((resolve) => {
              img.addEventListener("load", resolve, { once: true });
              img.addEventListener("error", resolve, { once: true });
            })
        )
      ).then(() => {
        if (reportRef.current) {
          window.print();
        }
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [loading, error, student, report, metrics]);

  const { totalMarks, maxMarks, percentage } = useMemo(() => {
    const total = report.reduce(
      (sum, row) => sum + (parseFloat(row.Marksobtained) || 0),
      0
    );

    const max = report.reduce(
      (sum, row) => sum + (parseFloat(row.Maxmarks) || 0),
      0
    );

    return {
      totalMarks: total,
      maxMarks: max,
      percentage: max ? Math.round((total / max) * 10000) / 100 : 0,
    };
  }, [report]);

  const formatMarks = (value) => {
    const number = Number(value);
    return Number.isFinite(number)
      ? Number.isInteger(number)
        ? number
        : number.toFixed(2)
      : value || 0;
  };

  if (loading) {
    return (
      <div className="report-state">
        <div className="report-state-icon">
          <span className="report-spinner" />
        </div>
        <h2>Preparing Examination Report</h2>
        <p>Please wait while the student results are loaded.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-state">
        <div className="report-state-icon report-error-icon">!</div>
        <h2>Unable to Load Report</h2>
        <p>{error}</p>
        <button
          className="report-action-button"
          onClick={() => window.location.reload()}
          type="button"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!student || Object.keys(student).length === 0) {
    return (
      <div className="report-state">
        <div className="report-state-icon report-error-icon">!</div>
        <h2>No Student Found</h2>
        <p>Student information is not available for this report.</p>
      </div>
    );
  }

  return (
    <main className="report-page">
      <div className="report-toolbar">
        <div className="report-toolbar-info">
          <span className="report-toolbar-icon">✦</span>
          <div>
            <h1>Examination Report</h1>
            <p>Student performance and academic results</p>
          </div>
        </div>

        <button
          className="report-action-button"
          type="button"
          onClick={() => window.print()}
        >
          <span aria-hidden="true">⎙</span>
          Print Report
        </button>
      </div>

      <section className="report-sheet" ref={reportRef}>
        <header className="report-header">
          <div className="report-school-logo-wrap">
            <img
              src={schoolLogo}
              alt="KK Blossoms School Logo"
              className="report-school-logo"
            />
          </div>

          <div className="school-details">
            <p className="report-school-label">OFFICIAL ACADEMIC RECORD</p>
            <h2>{schoolInfo.schoolName}</h2>
            <p className="report-school-address">
              {schoolInfo.schoolAddress}
            </p>
            <span className="report-school-tagline">
              LEARN • GROW • BLOOM
            </span>
          </div>
        </header>

        <div className="report-heading-band">
          <div>
            <span className="report-eyebrow">ACADEMIC SESSION</span>
            <h3>EXAMINATION REPORT</h3>
            <p>Student Assessment &amp; Performance Statement</p>
          </div>
          <div className="report-document-mark">RESULT</div>
        </div>

        <section className="student-card">
          <div className="student-card-heading">
            <span className="student-card-icon">01</span>
            <div>
              <h4>Student Information</h4>
              <p>Personal details of the student</p>
            </div>
          </div>

          <div className="student-section">
            <div className="student-left">
              <div className="student-detail">
                <span className="detail-label">Student Name</span>
                <strong>{student.Name || "—"}</strong>
              </div>

              <div className="student-detail">
                <span className="detail-label">Parent / Guardian</span>
                <strong>
                  {[
                    student.Mname,
                    student.Fname,
                  ]
                    .filter(Boolean)
                    .join(" / ") || "—"}
                </strong>
              </div>

              <div className="student-detail">
                <span className="detail-label">Date of Birth</span>
                <strong>{student.Dob || "—"}</strong>
              </div>
            </div>

            <div className="student-right">
              <div className="student-photo-frame">
                <img
                  src={userLogo}
                  alt="Student profile"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <span className="student-photo-label">STUDENT</span>
            </div>
          </div>
        </section>

        <section className="marks-section">
          <div className="report-section-heading">
            <div className="section-number">02</div>
            <div>
              <h4>Academic Performance</h4>
              <p>Subject-wise examination marks</p>
            </div>
          </div>

          <div className="report-table-wrapper">
            <table className="report-table">
              <thead>
                <tr>
                  <th className="date-column">DATE</th>
                  <th>SUBJECT</th>
                  <th>EXAM TYPE</th>
                  <th className="marks-column">MARKS OBTAINED</th>
                  <th className="marks-column">MAX MARKS</th>
                </tr>
              </thead>

              <tbody>
                {report.length > 0 ? (
                  report.map((row, index) => (
                    <tr key={row.id ?? index}>
                      <td>{row.Date || "—"}</td>
                      <td className="subject-cell">
                        {row.Subject || "—"}
                      </td>
                      <td>{row.Examtype || "—"}</td>
                      <td className="numeric-cell">
                        {formatMarks(row.Marksobtained)}
                      </td>
                      <td className="numeric-cell">
                        {formatMarks(row.Maxmarks)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-report">
                      No examination records are available.
                    </td>
                  </tr>
                )}

                <tr className="total-row">
                  <td colSpan="3">
                    <strong>GRAND TOTAL</strong>
                  </td>
                  <td className="numeric-cell">
                    <strong>{formatMarks(totalMarks)}</strong>
                  </td>
                  <td className="numeric-cell">
                    <strong>{formatMarks(maxMarks)}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="performance-summary">
          <div className="summary-label">
            <span className="summary-icon">%</span>
            <div>
              <span>OVERALL PERFORMANCE</span>
              <p>Calculated from total marks obtained</p>
            </div>
          </div>

          <div className="summary-score">
            <strong>{percentage}%</strong>
            <span>Percentage</span>
          </div>
        </section>

        <footer className="report-footer">
          <div className="report-date-place">
            <p>
              <span>Date:</span>
              <strong>________________</strong>
            </p>
            <p>
              <span>Place:</span>
              <strong>________________</strong>
            </p>
          </div>

          <div className="report-signature">
            <span className="signature-line" />
            <strong>Controller of Examinations</strong>
            <span className="signature-caption">Academic Records</span>
          </div>

          <div className="report-signature">
            <span className="signature-line" />
            <strong>Principal</strong>
            <span className="signature-caption">
              {schoolInfo.schoolName}
            </span>
          </div>
        </footer>

        <div className="report-bottom-strip">
          <span>KK BLOSSOMS SCHOOL</span>
          <span>EXAMINATION REPORT • OFFICIAL COPY</span>
        </div>
      </section>
    </main>
  );
};

export default Report;
