import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import SpecialReport from "./SpecialReport";
import ReportCard from "./ReportCard";   // ✅ changed here

const ReportCardRouter = () => {          // ✅ renamed component
  const { id } = useParams();

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("id", id);

        const response = await axios.post(
          "http://localhost/kkblossom/api.php/Adminapi/AdminReport/customizedReportCard",
          formData,
          { withCredentials: true }
        );

        if (response.data?.status) {
          setReportData(response.data.data);
        } else {
          setError(response.data?.message || "Invalid response from server");
        }

      } catch (err) {
        console.error("API Error:", err);
        setError("Server Error. Please check backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();

  }, [id]);

  // ✅ Loading State
  if (loading) {
    return <div>Loading Report...</div>;
  }

  // ✅ Error State
  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  // ✅ No Data
  if (!reportData || !reportData.student) {
    return <div>No Report Found</div>;
  }

  // ✅ Same logic
  if (reportData.student?.Class === "test") {
    return <SpecialReport data={reportData} />;
  } else {
    return <ReportCard data={reportData} />;   // ✅ changed here
  }
};

export default ReportCardRouter;
