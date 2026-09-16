import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ActiveRoutes.css";

const ActiveRoutes = () => {
    const [routes, setRoutes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(
            "http://localhost/kkblossom/api.php/Adminapi/AdminTransport/activeRoutes"
        )
            .then((res) => res.json())
            .then((res) => setRoutes(res.data))
            .catch((err) => console.log(err));
    }, []);

    return (
        <div className="active-routes-page">

            {/* =================================================
                PAGE HEADER
            ================================================= */}
            <div className="ar-header">

                <div className="ar-header-left">

                    <div className="ar-header-icon">
                        <i className="las la-bus"></i>
                    </div>

                    <div>
                        <span className="ar-eyebrow">
                            TRANSPORT MANAGEMENT
                        </span>

                        <h1>Active Routes</h1>

                        <p>
                            Monitor and manage currently active
                            school transport routes
                        </p>
                    </div>

                </div>

                <div className="ar-header-status">
                    <span className="ar-live-dot"></span>
                    Live Routes
                </div>

            </div>


            {/* =================================================
                SUMMARY SECTION
            ================================================= */}
            <div className="ar-summary">

                <div className="ar-summary-card">

                    <div className="ar-summary-icon">
                        <i className="las la-route"></i>
                    </div>

                    <div className="ar-summary-info">

                        <span>ACTIVE ROUTES</span>

                        <strong>
                            {routes.length}
                        </strong>

                    </div>

                    <div className="ar-summary-bg-icon">
                        <i className="las la-map-marked-alt"></i>
                    </div>

                </div>


                <div className="ar-summary-message">

                    <div className="ar-summary-check">
                        <i className="las la-check"></i>
                    </div>

                    <div>
                        <strong>Transport Network</strong>

                        <p>
                            All currently running routes are
                            displayed below.
                        </p>
                    </div>

                </div>

            </div>


            {/* =================================================
                SECTION HEADER
            ================================================= */}
            <div className="ar-section-header">

                <div>

                    <span className="ar-section-label">
                        LIVE TRANSPORT
                    </span>

                    <h2>Currently Active Routes</h2>

                </div>

                <div className="ar-route-count">
                    {routes.length} Active
                </div>

            </div>


            {/* =================================================
                ROUTES
            ================================================= */}
            {routes.length === 0 ? (

                <div className="ar-empty-card">

                    <div className="ar-empty-icon">
                        <i className="las la-bus-alt"></i>
                    </div>

                    <h2>No Routes Are Active</h2>

                    <p>
                        There are currently no active school
                        transport routes.
                    </p>

                </div>

            ) : (

                <div className="ar-route-grid">

                    {routes.map((row, index) => (

                        <div
                            key={row.routeid}
                            className="ar-route-card"
                            onClick={() =>
                                navigate(
                                    `/route/${row.routeid}`
                                )
                            }
                        >

                            {/* TOP STRIP */}
                            <div className="ar-card-top">

                                <div className="ar-route-number">
                                    <span>ROUTE</span>

                                    <strong>
                                        {String(index + 1).padStart(
                                            2,
                                            "0"
                                        )}
                                    </strong>
                                </div>

                                <div className="ar-active-badge">

                                    <span></span>

                                    Active

                                </div>

                            </div>


                            {/* BUS ICON */}
                            <div className="ar-bus-section">

                                <div className="ar-bus-icon">
                                    <i className="las la-bus"></i>
                                </div>

                                <div className="ar-route-main">

                                    <span className="ar-route-label">
                                        ROUTE NAME
                                    </span>

                                    <h3>
                                        {row.routename}
                                    </h3>

                                </div>

                            </div>


                            {/* ROUTE DETAILS */}
                            <div className="ar-route-details">

                                <div className="ar-detail-item">

                                    <div className="ar-detail-icon">
                                        <i className="las la-fingerprint"></i>
                                    </div>

                                    <div>
                                        <span>Route ID</span>

                                        <strong>
                                            #{row.routeid}
                                        </strong>
                                    </div>

                                </div>


                                <div className="ar-detail-item">

                                    <div className="ar-detail-icon">
                                        <i className="las la-clock"></i>
                                    </div>

                                    <div>
                                        <span>Started At</span>

                                        <strong>
                                            {new Date(
                                                row.Startedat
                                            ).toLocaleString()}
                                        </strong>
                                    </div>

                                </div>

                            </div>


                            {/* FOOTER */}
                            <div className="ar-card-footer">

                                <span>
                                    View Route Details
                                </span>

                                <div className="ar-arrow">
                                    <i className="las la-arrow-right"></i>
                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}


        </div>
    );
};

export default ActiveRoutes;