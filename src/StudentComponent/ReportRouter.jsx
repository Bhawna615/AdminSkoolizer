
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import SpecialReport from "./SpecialReport";
import CustomReport from "./CustomReport";
import "./ReportRouter.css";

const ReportRouter = () => {
  const { id } = useParams();

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchReport = async () => {
      if (!id) {
        setError("Report ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setReportData(null);

        const formData = new FormData();
        formData.append("id", id);

        const response = await axios.post(
          "http://localhost/kkblossom/api.php/Adminapi/AdminReport/customizedReportCard",
          formData,
          { withCredentials: true }
        );

        if (!isMounted) return;

        if (response.data?.status) {
          setReportData(response.data.data);
        } else {
          setError(
            response.data?.message || "Unable to load the student report."
          );
        }
      } catch (err) {
        console.error("API Error:", err);

        if (isMounted) {
          setError("Server error. Please check your connection and try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReport();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="report-router-state report-router-loading">
        <div className="report-router-glow" />

        <div className="report-router-loader-content">
          <div className="report-router-spinner">
            <span />
          </div>

          <div className="report-router-loader-label">
            ACADEMIC RECORDS
          </div>

          <h2>Preparing Student Report</h2>
          <p>Loading academic records and performance details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-router-state">
        <div className="report-router-state-panel">
          <div className="report-router-state-icon report-router-error-icon">
            !
          </div>

          <span className="report-router-state-label">REPORT STATUS</span>
          <h2>Unable to Load Report</h2>
          <p>{error}</p>

          <button
            type="button"
            className="report-router-button"
            onClick={handleRetry}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!reportData || !reportData.student) {
    return (
      <div className="report-router-state">
        <div className="report-router-state-panel">
          <div className="report-router-state-icon">
            <svg
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
              <path d="M14 3v6h5M9 14h6M9 17h6" />
            </svg>
          </div>

          <span className="report-router-state-label">NO RECORD</span>
          <h2>No Report Found</h2>
          <p>
            No student report is available for this record. Please verify the
            student details and try again.
          </p>

          <button
            type="button"
            className="report-router-button"
            onClick={handleRetry}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const ReportComponent =
    reportData.student?.Class === "test" ? SpecialReport : CustomReport;

  return (
    <div className="report-router-page">
      <div className="report-router-toolbar no-print">
        <div className="report-router-toolbar-info">
          <div className="report-router-title-line">
            <div className="report-router-title-icon">
              <svg
                viewBox="0 0 24 24"
                width="23"
                height="23"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
                <path d="M14 3v6h5M9 14h6M9 17h6" />
              </svg>
            </div>

            <div>
              <span className="report-router-eyebrow">
                KK BLOSSOMS SCHOOL
              </span>
              <h1>Student Report Card</h1>
            </div>
          </div>

          <p className="report-router-subtitle">
            Academic performance, student progress and assessment records.
          </p>
        </div>

        <button
          type="button"
          className="report-router-button"
          onClick={handlePrint}
        >
          <svg
            viewBox="0 0 24 24"
            width="19"
            height="19"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M7 8V3h10v5M7 17H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-3" />
            <path d="M7 14h10v7H7zM17 11h.01" />
          </svg>
          <span>Print Report</span>
        </button>
      </div>

      <main className="report-router-document">
        <ReportComponent data={reportData} />
      </main>

      <div className="report-router-print-footer">
        KK BLOSSOMS SCHOOL · Student Academic Report
      </div>
    </div>
  );
};

export default ReportRouter;
