import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Discount.css";

const API =
  "http://localhost/kkblossom/api.php/AdminApi/AdminPanelFee/";

export default function Discount() {
  const [discounts, setDiscounts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(API + "getDiscounts");
      setDiscounts(res.data);
    } catch (error) {
      console.error("Error fetching discounts:", error);
    }
  };

  const filteredDiscounts = discounts.filter((d) =>
    d.fee_type?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="discount-page">

      {/* PAGE HEADER */}
      <div className="discount-header">
        <div>
          <h1>Discount</h1>
          <p>Manage fee discounts and assign them to students</p>
        </div>

        <button
          className="add-discount-btn"
          onClick={() =>
            (window.location.href =
              "/dashboard/FeeComponent/AddDiscount")
          }
        >
          <span>+</span>
          Add Discount
        </button>
      </div>

      {/* MAIN CARD */}
      <div className="discount-card">

        {/* CARD HEADER */}
        <div className="discount-card-top">

          <div>
            <h2>Discount List</h2>
            <p>
              {discounts.length} discount
              {discounts.length !== 1 ? "s" : ""} available
            </p>
          </div>

          {/* SEARCH */}
          <div className="discount-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search discount..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

        </div>

        {/* TABLE */}
        <div className="discount-table-wrapper">

          <table className="discount-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>FEE TYPE</th>
                <th>AMOUNT</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>

              {filteredDiscounts.length > 0 ? (

                filteredDiscounts.map((d) => (

                  <tr key={d.id}>

                    {/* ID */}
                    <td>
                      <span className="discount-id">
                        #{d.id}
                      </span>
                    </td>

                    {/* FEE TYPE */}
                    <td>
                      <div className="fee-type-cell">

                        <div className="discount-icon">
                          %
                        </div>

                        <span>
                          {d.fee_type}
                        </span>

                      </div>
                    </td>

                    {/* AMOUNT */}
                    <td>
                      <span className="discount-amount">
                        ₹{Number(d.amount || 0).toLocaleString()}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td>
                      <button
                        className="assign-student-btn"
                        onClick={() =>
                          (window.location.href =
                            `/dashboard/FeeComponent/AssignStudents/${d.id}`)
                        }
                      >
                        <span>+</span>
                        Add Students
                      </button>
                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td colSpan="4">

                    <div className="discount-empty">

                      <div className="empty-discount-icon">
                        %
                      </div>

                      <h3>No Discounts Found</h3>

                      <p>
                        {search
                          ? "No discount matches your search."
                          : "Add a discount to get started."}
                      </p>

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* FOOTER */}
        {filteredDiscounts.length > 0 && (
          <div className="discount-footer">
            Showing <strong>{filteredDiscounts.length}</strong>{" "}
            of <strong>{discounts.length}</strong> discounts
          </div>
        )}

      </div>

    </div>
  );
}