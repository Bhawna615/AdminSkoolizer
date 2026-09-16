import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./StationList.css";

const StationList = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterEnabled, setIsFilterEnabled] = useState(false);
  const [selectedType, setSelectedType] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const res = await axios.get(
        "http://localhost/kkblossom/api.php/Adminapi/AdminTransport/getStations"
      );

      setStations(res.data?.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setStations([]);
    } finally {
      setLoading(false);
    }
  };

  const goToAddStudents = (stationId) => {
    navigate("/dashboard/TransportComponent/add-passengers", {
      state: { stationId },
    });
  };

  /* -----------------------------
     Unique station types
  ----------------------------- */
  const stationTypes = useMemo(() => {
    const types = stations
      .map((station) => station.type)
      .filter((type) => type && type.trim() !== "");

    return [...new Set(types)];
  }, [stations]);

  /* -----------------------------
     Filter Stations
  ----------------------------- */
  const filteredStations = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return stations.filter((station) => {
      const stationName = String(station.stationname || "").toLowerCase();
      const stationType = String(station.type || "").toLowerCase();

      const matchesSearch =
        stationName.includes(searchValue) ||
        stationType.includes(searchValue);

      const matchesType =
        !isFilterEnabled ||
        !selectedType ||
        station.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [stations, search, isFilterEnabled, selectedType]);

  /* -----------------------------
     Pagination
  ----------------------------- */
  const totalPages =
    Math.ceil(filteredStations.length / entries) || 1;

  const displayedStations = filteredStations.slice(
    (currentPage - 1) * entries,
    currentPage * entries
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, entries, selectedType, isFilterEnabled]);

  const firstEntry =
    filteredStations.length === 0
      ? 0
      : (currentPage - 1) * entries + 1;

  const lastEntry = Math.min(
    currentPage * entries,
    filteredStations.length
  );

  const goToPrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNext = () => {
    setCurrentPage((prev) =>
      Math.min(prev + 1, totalPages)
    );
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  /* -----------------------------
     Page Numbers
  ----------------------------- */
  const pageNumbers = useMemo(() => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  /* -----------------------------
     Stats
  ----------------------------- */
  const totalStations = stations.length;

  const stationTypesCount = stationTypes.length;

  const totalCharges = stations.reduce((total, station) => {
    const charge = Number(
      String(station.charges || "0").replace(/[^0-9.-]/g, "")
    );

    return total + (isNaN(charge) ? 0 : charge);
  }, 0);

  if (loading) {
    return (
      <div className="station-loading-page">
        <div className="station-loading-spinner">
          <i className="las la-spinner"></i>
        </div>

        <h3>Loading Stations</h3>

        <p>
          Please wait while we fetch the transport stations.
        </p>
      </div>
    );
  }

  return (
    <div className="station-page">

      {/* =========================================
          PAGE HEADER
      ========================================== */}
      <div className="station-page-header">

        <div className="station-title-section">

          <div className="station-title-icon">
            <i className="las la-map-marker-alt"></i>
          </div>

          <div>
            <span className="station-eyebrow">
              TRANSPORT MANAGEMENT
            </span>

            <h1>Transport Stations</h1>

            <p>
              Manage pickup points, station types and
              student transportation.
            </p>
          </div>

        </div>

        <button
          className="station-add-btn"
          onClick={() =>
            navigate(
              "/dashboard/TransportComponent/AddStation"
            )
          }
        >
          <i className="las la-plus"></i>
          Add Station
        </button>

      </div>

      {/* =========================================
          STATISTICS
      ========================================== */}
      <div className="station-stats-grid">

        <div className="station-stat-card">

          <div className="station-stat-icon purple">
            <i className="las la-map-marked-alt"></i>
          </div>

          <div className="station-stat-content">
            <span>Total Stations</span>
            <strong>{totalStations}</strong>
          </div>

          <div className="station-stat-decoration">
            <i className="las la-map-marker"></i>
          </div>

        </div>

        <div className="station-stat-card">

          <div className="station-stat-icon blue">
            <i className="las la-layer-group"></i>
          </div>

          <div className="station-stat-content">
            <span>Station Types</span>
            <strong>{stationTypesCount}</strong>
          </div>

          <div className="station-stat-decoration">
            <i className="las la-tags"></i>
          </div>

        </div>

        <div className="station-stat-card">

          <div className="station-stat-icon green">
            <i className="las la-rupee-sign"></i>
          </div>

          <div className="station-stat-content">
            <span>Total Charges</span>
            <strong>
              ₹{totalCharges.toLocaleString("en-IN")}
            </strong>
          </div>

          <div className="station-stat-decoration">
            <i className="las la-wallet"></i>
          </div>

        </div>

      </div>

      {/* =========================================
          FILTER CARD
      ========================================== */}
      <div className="station-filter-card">

        <div className="station-filter-heading">

          <div className="station-filter-icon">
            <i className="las la-filter"></i>
          </div>

          <div>
            <h3>Station Filters</h3>
            <p>
              Filter stations by their transport type
            </p>
          </div>

        </div>

        <label className="station-toggle-wrapper">

          <input
            type="checkbox"
            checked={isFilterEnabled}
            onChange={() => {
              setIsFilterEnabled((prev) => !prev);

              if (isFilterEnabled) {
                setSelectedType("");
              }
            }}
          />

          <span className="station-toggle"></span>

          <span className="station-toggle-text">
            ENABLE FILTER
          </span>

        </label>

        <div className="station-filter-select-wrapper">

          <label>
            <i className="las la-tags"></i>
            STATION TYPE
          </label>

          <select
            value={selectedType}
            disabled={!isFilterEnabled}
            onChange={(e) =>
              setSelectedType(e.target.value)
            }
            className="station-filter-select"
          >
            <option value="">
              All Station Types
            </option>

            {stationTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

        </div>

        {isFilterEnabled && selectedType && (
          <button
            className="station-clear-filter"
            onClick={() => setSelectedType("")}
          >
            <i className="las la-times"></i>
            Clear Filter
          </button>
        )}

      </div>

      {/* =========================================
          MAIN TABLE CARD
      ========================================== */}
      <div className="station-table-card">

        {/* TABLE HEADER */}
        <div className="station-table-card-header">

          <div>
            <span className="station-table-eyebrow">
              STATION DIRECTORY
            </span>

            <h2>All Transport Stations</h2>

            <p>
              View and manage registered transportation
              pickup stations.
            </p>
          </div>

          <div className="station-count-badge">
            <i className="las la-map-marker"></i>
            {filteredStations.length} Stations
          </div>

        </div>

        {/* TABLE CONTROLS */}
        <div className="station-table-controls">

          <div className="station-show-entries">

            <span>Show</span>

            <select
              value={entries}
              onChange={(e) =>
                setEntries(Number(e.target.value))
              }
            >
              {[10, 25, 50, 100].map((number) => (
                <option
                  key={number}
                  value={number}
                >
                  {number}
                </option>
              ))}
            </select>

            <span>entries</span>

          </div>

          <div className="station-search-wrapper">

            <i className="las la-search"></i>

            <input
              type="text"
              placeholder="Search stations..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                className="station-search-clear"
                onClick={() => setSearch("")}
              >
                <i className="las la-times"></i>
              </button>
            )}

          </div>

        </div>

        {/* =========================================
            TABLE
        ========================================== */}
        {displayedStations.length > 0 ? (
          <div className="station-table-wrapper">

            <table className="station-table">

              <thead>
                <tr>

                  <th>
                    <span>STATION NAME</span>
                    <i className="las la-sort"></i>
                  </th>

                  <th>
                    <span>TYPE</span>
                    <i className="las la-sort"></i>
                  </th>

                  <th>
                    <span>CHARGES</span>
                    <i className="las la-sort-amount-up"></i>
                  </th>

                  <th className="station-action-heading">
                    ACTION
                  </th>

                </tr>
              </thead>

              <tbody>

                {displayedStations.map((station, index) => (

                  <tr key={station.id}>

                    {/* STATION NAME */}
                    <td>

                      <div className="station-name-cell">

                        <div className="station-row-icon">
                          <i className="las la-map-marker-alt"></i>
                        </div>

                        <div>
                          <strong>
                            {station.stationname ||
                              "Unnamed Station"}
                          </strong>

                          <span>
                            Station ID #{station.id}
                          </span>
                        </div>

                      </div>

                    </td>

                    {/* TYPE */}
                    <td>

                      <span className="station-type-badge">

                        <span className="station-type-dot"></span>

                        {station.type ||
                          "General"}

                      </span>

                    </td>

                    {/* CHARGES */}
                    <td>

                      <div className="station-charge">

                        <span className="station-currency">
                          ₹
                        </span>

                        <strong>
                          {station.charges ||
                            "0"}
                        </strong>

                      </div>

                    </td>

                    {/* ACTION */}
                    <td className="station-action-cell">

                      <button
                        className="station-add-student-btn"
                        onClick={() =>
                          goToAddStudents(
                            station.id
                          )
                        }
                      >
                        <i className="las la-user-plus"></i>

                        <span>
                          Add Students
                        </span>

                        <i className="las la-arrow-right station-btn-arrow"></i>

                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        ) : (

          /* =========================================
             EMPTY STATE
          ========================================== */
          <div className="station-empty-state">

            <div className="station-empty-icon">
              <i className="las la-map-marker"></i>
            </div>

            <h3>
              No Stations Found
            </h3>

            <p>
              {search || selectedType
                ? "No stations match your current search or filter."
                : "No transport stations have been added yet."}
            </p>

            {(search || selectedType) && (
              <button
                className="station-reset-btn"
                onClick={() => {
                  setSearch("");
                  setSelectedType("");
                  setIsFilterEnabled(false);
                }}
              >
                <i className="las la-redo"></i>
                Reset Filters
              </button>
            )}

          </div>

        )}

        {/* =========================================
            TABLE FOOTER
        ========================================== */}
        <div className="station-table-footer">

          <div className="station-table-info">

            Showing{" "}
            <strong>{firstEntry}</strong>
            {" "}to{" "}
            <strong>{lastEntry}</strong>
            {" "}of{" "}
            <strong>{filteredStations.length}</strong>
            {" "}entries

          </div>

          <div className="station-pagination">

            <button
              className="station-pagination-prev"
              onClick={goToPrevious}
              disabled={currentPage === 1}
            >
              <i className="las la-angle-left"></i>
              <span>Previous</span>
            </button>

            <div className="station-page-numbers">

              {pageNumbers.map((page, index) => {

                if (page === "...") {
                  return (
                    <span
                      key={`dots-${index}`}
                      className="station-pagination-dots"
                    >
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={page}
                    className={
                      currentPage === page
                        ? "station-page-number active"
                        : "station-page-number"
                    }
                    onClick={() =>
                      goToPage(page)
                    }
                  >
                    {page}
                  </button>
                );
              })}

            </div>

            <button
              className="station-pagination-next"
              onClick={goToNext}
              disabled={
                currentPage === totalPages
              }
            >
              <span>Next</span>
              <i className="las la-angle-right"></i>
            </button>

          </div>

        </div>

      </div>

      {/* FLOATING ADD BUTTON */}
      <button
        className="station-floating-add"
        onClick={() =>
          navigate(
            "/dashboard/TransportComponent/AddStation"
          )
        }
        title="Add Station"
      >
        <i className="las la-plus"></i>
      </button>

    </div>
  );
};

export default StationList;