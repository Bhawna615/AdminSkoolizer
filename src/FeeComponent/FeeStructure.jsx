
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Fee.css";

const API =
  "http://localhost/kkblossom/api.php/AdminApi/AdminPanelFee/";

export default function FeeStructure() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchFees();
  }, []);

  /* =========================
     FETCH FEE STRUCTURES
  ========================= */
  const fetchFees = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API + "getAllFees");

      setFees(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching fee structures:", error);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     DELETE FEE STRUCTURE
  ========================= */
  const deleteFee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this fee structure?")) {
      return;
    }

    try {
      setDeletingId(id);

      /*
       * Your PHP API is successfully deleting the record,
       * but Axios may receive a response that it treats as
       * a Network Error because of the server/CORS response.
       *
       * Therefore, we handle the request carefully.
       */
      await axios.delete(API + "deleteFee/" + id);

      // Remove immediately from UI
      setFees((prevFees) =>
        prevFees.filter(
          (row) => String(row.feestructureid) !== String(id)
        )
      );

      // Refresh from database
      await fetchFees();

    } catch (error) {
      console.error("Delete request error:", error);

      /*
       * IMPORTANT:
       * If PHP deleted the record but Axios reported
       * Network Error, refresh the list.
       *
       * This checks the actual database state.
       */
      try {
        const res = await axios.get(API + "getAllFees");

        const updatedFees = Array.isArray(res.data)
          ? res.data
          : [];

        setFees(updatedFees);

        const stillExists = updatedFees.some(
          (row) =>
            String(row.feestructureid) === String(id)
        );

        if (!stillExists) {
          console.log("Fee structure deleted successfully.");
        } else {
          alert("Unable to delete the fee structure.");
        }

      } catch (refreshError) {
        console.error(
          "Unable to refresh fee structures:",
          refreshError
        );

        alert(
          "The fee structure may have been deleted, but the list could not be refreshed."
        );
      }

    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fee-structure-page">

      {/* =========================
          HEADER
      ========================= */}
      <div className="fee-structure-header">

        <div className="fee-structure-header-left">

          <div className="fee-structure-header-icon">
            <i className="bi bi-cash-stack"></i>
          </div>

          <div>
            <h2>Fee Structure</h2>
            <p>
              Manage class-wise admission, tuition and annual fees
            </p>
          </div>

        </div>

        <div className="fee-structure-total">

          <div className="fee-structure-total-icon">
            <i className="bi bi-receipt"></i>
          </div>

          <div>
            <span>Total Structures</span>
            <strong>{fees.length}</strong>
          </div>

        </div>

      </div>

      {/* =========================
          MAIN CARD
      ========================= */}
      <div className="fee-structure-card">

        {/* =========================
            CARD HEADER
        ========================= */}
        <div className="fee-structure-card-header">

          <div className="fee-structure-title">

            <div className="fee-structure-title-icon">
              <i className="bi bi-table"></i>
            </div>

            <div>
              <h3>Fee Structure List</h3>
              <p>
                View and manage fee details for all classes
              </p>
            </div>

          </div>

          <button
            type="button"
            className="fee-structure-add-btn"
            onClick={() =>
              (window.location.href =
                "/dashboard/FeeComponent/AddFeeStructure")
            }
          >
            <i className="bi bi-plus-lg"></i>
            <span>Add Structure</span>
          </button>

        </div>

        {/* =========================
            TABLE / LOADING / EMPTY
        ========================= */}
        <div className="fee-structure-table-wrapper">

          {/* LOADING */}
          {loading ? (

            <div className="fee-structure-empty">

              <div className="fee-structure-empty-icon">
                <i className="bi bi-arrow-repeat"></i>
              </div>

              <strong>Loading Fee Structures...</strong>

              <span>
                Please wait while the fee structures are loaded.
              </span>

            </div>

          ) : fees.length === 0 ? (

            /* EMPTY */
            <div className="fee-structure-empty">

              <div className="fee-structure-empty-icon">
                <i className="bi bi-receipt-cutoff"></i>
              </div>

              <strong>No Fee Structures Found</strong>

              <span>
                No fee structure has been added yet.
              </span>

              <button
                type="button"
                className="fee-structure-empty-btn"
                onClick={() =>
                  (window.location.href =
                    "/dashboard/FeeComponent/AddFeeStructure")
                }
              >
                <i className="bi bi-plus-lg"></i>
                Add First Structure
              </button>

            </div>

          ) : (

            /* TABLE */
            <table className="fee-structure-table">

              <thead>
                <tr>
                  <th>Class</th>
                  <th>Admission</th>
                  <th>Tuition</th>
                  <th>Annual</th>
                  <th>Sibling</th>
                  <th className="fee-action-column">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>

                {fees.map((row) => (

                  <tr key={row.feestructureid}>

                    {/* CLASS */}
                    <td>

                      <div className="fee-class-cell">

                        <div className="fee-class-icon">
                          <i className="bi bi-mortarboard-fill"></i>
                        </div>

                        <span>
                          {row.feeclass}
                        </span>

                      </div>

                    </td>

                    {/* ADMISSION */}
                    <td>

                      <div className="fee-amount-cell">

                        <span className="fee-currency">
                          ₹
                        </span>

                        <span>
                          {row.admission_fee}
                        </span>

                      </div>

                    </td>

                    {/* TUITION */}
                    <td>

                      <div className="fee-amount-cell">

                        <span className="fee-currency">
                          ₹
                        </span>

                        <span>
                          {row.tuition_fee}
                        </span>

                      </div>

                    </td>

                    {/* ANNUAL */}
                    <td>

                      <div className="fee-amount-cell">

                        <span className="fee-currency">
                          ₹
                        </span>

                        <span>
                          {row.annual_fee}
                        </span>

                      </div>

                    </td>

                    {/* SIBLING DISCOUNT */}
                    <td>

                      <span className="fee-sibling-badge">
                        {row.sibling_discount}
                      </span>

                    </td>

                    {/* ACTION */}
                    <td className="fee-action-column">

                      <button
                        type="button"
                        className="fee-delete-btn"
                        onClick={() =>
                          deleteFee(row.feestructureid)
                        }
                        disabled={
                          deletingId === row.feestructureid
                        }
                        title="Delete Fee Structure"
                      >

                        {deletingId ===
                        row.feestructureid ? (

                          <>
                            <i className="bi bi-arrow-repeat"></i>
                            <span>Deleting...</span>
                          </>

                        ) : (

                          <>
                            <i className="bi bi-trash3"></i>
                            <span>Delete</span>
                          </>

                        )}

                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

        {/* =========================
            FOOTER
        ========================= */}
        {fees.length > 0 && !loading && (

          <div className="fee-structure-footer">

            <div className="fee-footer-info">

              <i className="bi bi-info-circle"></i>

              <span>
                Showing{" "}
                <strong>{fees.length}</strong>{" "}
                fee structure
                {fees.length !== 1 ? "s" : ""}.
              </span>

            </div>

            <div className="fee-footer-label">

              <i className="bi bi-shield-check"></i>

              Fee Management

            </div>

          </div>

        )}

      </div>

    </div>
  );
}
