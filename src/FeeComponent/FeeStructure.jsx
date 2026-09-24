import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FeeStructure.css";

const API =
  "http://localhost/kkblossom/api.php/AdminApi/AdminPanelFee/";

export default function FeeStructure() {
  const [fees, setFees] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const res = await axios.get(API + "getAllFees");
      setFees(res.data);
    } catch (error) {
      console.error("Error fetching fees:", error);
    }
  };

  const deleteFee = async (id) => {
    if (window.confirm("Are you sure you want to delete this fee structure?")) {
      try {
        await axios.delete(API + "deleteFee/" + id);
        fetchFees();
      } catch (error) {
        console.error("Error deleting fee:", error);
      }
    }
  };

  const filteredFees = fees.filter((row) =>
    row.feeclass?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fee-page">

      {/* Page Header */}
      <div className="fee-header">
        <div>
          <h1>Fee Structure</h1>
          <p>Manage class-wise fee structure and discounts</p>
        </div>

        <button
          className="add-fee-btn"
          onClick={() =>
            (window.location.href =
              "/dashboard/FeeComponent/AddFeeStructure")
          }
        >
          <span>+</span>
          Add Structure
        </button>
      </div>

      {/* Main Card */}
      <div className="fee-card">

        {/* Card Top */}
        <div className="fee-card-top">
          <div>
            <h2>Fee Structures</h2>
            <p>{fees.length} structures available</p>
          </div>

          <div className="fee-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search class..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="fee-table-wrapper">
          <table className="fee-table">

            <thead>
              <tr>
                <th>CLASS</th>
                <th>ADMISSION FEE</th>
                <th>TUITION FEE</th>
                <th>ANNUAL FEE</th>
                <th>SIBLING DISCOUNT</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {filteredFees.length > 0 ? (
                filteredFees.map((row) => (
                  <tr key={row.feestructureid}>

                    <td>
                      <div className="class-name">
                        <div className="class-icon">
                          {row.feeclass?.charAt(0)}
                        </div>

                        <span>{row.feeclass}</span>
                      </div>
                    </td>

                    <td>
                      <span className="amount">
                        ₹{Number(row.admission_fee || 0).toLocaleString()}
                      </span>
                    </td>

                    <td>
                      <span className="amount">
                        ₹{Number(row.tuition_fee || 0).toLocaleString()}
                      </span>
                    </td>

                    <td>
                      <span className="amount">
                        ₹{Number(row.annual_fee || 0).toLocaleString()}
                      </span>
                    </td>

                    <td>
                      <span className="discount-badge">
                        ₹{Number(row.sibling_discount || 0).toLocaleString()}
                      </span>
                    </td>

                    <td>
                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteFee(row.feestructureid)
                        }
                        title="Delete"
                      >
                        🗑
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state">
                      <div className="empty-icon">₹</div>
                      <h3>No Fee Structure Found</h3>
                      <p>
                        {search
                          ? "No class matches your search."
                          : "Add a fee structure to get started."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

        {/* Footer */}
        {filteredFees.length > 0 && (
          <div className="fee-card-footer">
            Showing <strong>{filteredFees.length}</strong> of{" "}
            <strong>{fees.length}</strong> fee structures
          </div>
        )}

      </div>
    </div>
  );
}