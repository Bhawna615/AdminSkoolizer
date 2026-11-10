
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

import { Pie } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import "./DisplayStatistics.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const API = "http://localhost/kkblossom/api.php/Adminapi/FeeStatistics/";

export default function DisplayStatistics() {
  const { period } = useParams();

  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD STATISTICS
  // =====================================================

  useEffect(() => {
    setLoading(true);
    setError("");

    axios
      .get(API + "displayStatistics/" + period)
      .then((res) => {
        setSummary(res.data || {});
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading fee statistics:", err);
        setError("Unable to load fee statistics. Please try again.");
        setLoading(false);
      });
  }, [period]);

  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  };

  const formatNumber = (value) => {
    return Number(value || 0).toLocaleString("en-IN");
  };

  // =====================================================
  // PIE CHART DATA - PAID VS PENDING
  // No gaps, no centre hole, no rounded slice edges
  // =====================================================

  const paidAmount = Number(summary.paidAmount || 0);
  const pendingAmount = Number(summary.pendingAmount || 0);

  const feeChartData = {
    labels: ["Total Paid Fee", "Total Pending Fee"],
    datasets: [
      {
        data: [paidAmount, pendingAmount],
        backgroundColor: ["#6C4CE8", "#F4B740"],
        hoverBackgroundColor: ["#5636CF", "#E5A323"],

        // Removes visible gaps between pie slices
        borderWidth: 0,
        spacing: 0,
        borderRadius: 0,
        hoverOffset: 0,
      },
    ],
  };

  // =====================================================
  // PIE CHART DATA - FEE CATEGORY
  // =====================================================

  const typeChartData = {
    labels: [
      "Tuition Fee",
      "Transport Fee",
      "Annual Fee",
      "Admission Fee",
    ],
    datasets: [
      {
        data: [
          Number(summary.totalTuitionFee || 0),
          Number(summary.totalTransportFee || 0),
          Number(summary.totalAnnualFee || 0),
          Number(summary.totalAdmissionFee || 0),
        ],

        backgroundColor: [
          "#6C4CE8",
          "#F4B740",
          "#36A6A0",
          "#E77991",
        ],

        hoverBackgroundColor: [
          "#5636CF",
          "#E5A323",
          "#258C86",
          "#D65E7A",
        ],

        // Removes visible gaps between pie slices
        borderWidth: 0,
        spacing: 0,
        borderRadius: 0,
        hoverOffset: 0,
      },
    ],
  };

  // =====================================================
  // COMMON PIE CHART OPTIONS
  // =====================================================

  const getChartOptions = () => ({
    responsive: true,
    maintainAspectRatio: false,

    // No cutout setting: this remains a complete Pie chart.
    // No border or spacing: slices meet without gaps.

    layout: {
      padding: 8,
    },

    plugins: {
      legend: {
        display: true,
        position: "bottom",

        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 9,
          boxHeight: 9,
          padding: 20,
          color: "#77718C",
          font: {
            size: 11,
            weight: "600",
          },
        },
      },

      tooltip: {
        enabled: true,
        backgroundColor: "#29243E",
        titleColor: "#FFFFFF",
        bodyColor: "#F2EEFF",
        padding: 13,
        cornerRadius: 9,
        displayColors: true,

        callbacks: {
          label: (context) => {
            const value = Number(context.raw || 0);

            const total = context.dataset.data.reduce(
              (sum, item) => sum + Number(item || 0),
              0
            );

            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";

            return ` ${context.label}: ${formatCurrency(value)} (${percentage}%)`;
          },
        },
      },
    },

    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
    },
  });

  // =====================================================
  // SUMMARY CARDS
  // =====================================================

  const summaryCards = [
    {
      title: "Total Fee to be Collected",
      value: formatCurrency(summary.totalFeeAmount),
      icon: "bi-wallet2",
      color: "purple",
      link: `/FeeComponent/PaymentTable/total/${period}`,
      description: "Overall payable fee",
    },
    {
      title: "Total Paid Fee",
      value: formatCurrency(summary.paidAmount),
      icon: "bi-check-circle",
      color: "green",
      link: `/FeeComponent/PaymentTable/paid/${period}`,
      description: "Fee successfully collected",
    },
    {
      title: "Total Pending Fee",
      value: formatCurrency(summary.pendingAmount),
      icon: "bi-clock-history",
      color: "orange",
      link: `/FeeComponent/PaymentTable/pending/${period}`,
      description: "Fee awaiting collection",
    },
    {
      title: "Total Payments",
      value: formatNumber(summary.totalFeeCount),
      icon: "bi-receipt",
      color: "blue",
      link: `/FeeComponent/PaymentTable/total/${period}`,
      description: "All payment records",
    },
    {
      title: "Total Paid Payments",
      value: formatNumber(summary.paidCount),
      icon: "bi-credit-card",
      color: "green",
      link: `/FeeComponent/PaymentTable/paid/${period}`,
      description: "Successfully paid records",
    },
    {
      title: "Total Pending Payments",
      value: formatNumber(summary.pendingCount),
      icon: "bi-hourglass-split",
      color: "orange",
      link: `/FeeComponent/PaymentTable/pending/${period}`,
      description: "Pending payment records",
    },
  ];

  // =====================================================
  // FEE CATEGORY CARDS
  // =====================================================

  const categoryCards = [
    {
      title: "Tuition Fee",
      value: summary.totalTuitionFee,
      icon: "bi-book",
      color: "purple",
    },
    {
      title: "Transport Fee",
      value: summary.totalTransportFee,
      icon: "bi-bus-front",
      color: "blue",
    },
    {
      title: "Annual Fee",
      value: summary.totalAnnualFee,
      icon: "bi-calendar-check",
      color: "orange",
    },
    {
      title: "Admission Fee",
      value: summary.totalAdmissionFee,
      icon: "bi-person-plus",
      color: "green",
    },
    {
      title: "Late Fee",
      value: summary.totalLateFee,
      icon: "bi-alarm",
      color: "pink",
    },
  ];

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {
    return (
      <div className="ds-loading-page">
        <div className="ds-loader"></div>
        <h3>Loading Fee Statistics</h3>
        <p>Please wait while we prepare your financial overview.</p>
      </div>
    );
  }

  // =====================================================
  // ERROR SCREEN
  // =====================================================

  if (error) {
    return (
      <div className="ds-page">
        <div className="ds-error-box">
          <div className="ds-error-icon">
            <i className="bi bi-exclamation-circle"></i>
          </div>

          <h3>Unable to Load Statistics</h3>
          <p>{error}</p>

          <button
            className="ds-retry-btn"
            onClick={() => window.location.reload()}
          >
            <i className="bi bi-arrow-clockwise"></i>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="ds-page">

      {/* HEADER */}

      <div className="ds-header">
        <div className="ds-header-left">
          <div className="ds-header-icon">
            <i className="bi bi-bar-chart-line"></i>
          </div>

          <div>
            <h1>Fee Statistics</h1>
            <p>Complete financial overview of your school</p>
          </div>
        </div>

        <div className="ds-period-badge">
          <i className="bi bi-calendar3"></i>
          <span>{period}</span>
        </div>
      </div>

      {/* FINANCIAL OVERVIEW */}

      <div className="ds-section-heading">
        <div>
          <h2>Financial Overview</h2>
          <p>
            Monitor collected fees, pending amounts and payment records.
          </p>
        </div>
      </div>

      {/* CHART SECTION */}

      <div className="ds-chart-grid">

        {/* PAID VS PENDING */}

        <div className="ds-chart-card">
          <div className="ds-chart-card-header">
            <div className="ds-chart-heading-icon purple">
              <i className="bi bi-pie-chart-fill"></i>
            </div>

            <div>
              <h3>Fee Collection Status</h3>
              <p>Paid and pending fee distribution</p>
            </div>
          </div>

          <div className="ds-chart-divider"></div>

          <div className="ds-chart-content">
            <div className="ds-pie-chart-wrapper">
              <Pie
                data={feeChartData}
                options={getChartOptions()}
              />
            </div>
          </div>

          <div className="ds-chart-bottom-info">
            <div className="ds-chart-info-item">
              <span className="ds-dot purple-dot"></span>
              <div>
                <small>Total Paid</small>
                <strong>{formatCurrency(summary.paidAmount)}</strong>
              </div>
            </div>

            <div className="ds-chart-info-item">
              <span className="ds-dot orange-dot"></span>
              <div>
                <small>Total Pending</small>
                <strong>{formatCurrency(summary.pendingAmount)}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* FEE CATEGORY */}

        <div className="ds-chart-card">
          <div className="ds-chart-card-header">
            <div className="ds-chart-heading-icon blue">
              <i className="bi bi-diagram-3-fill"></i>
            </div>

            <div>
              <h3>Fee Category Distribution</h3>
              <p>Breakdown of different fee components</p>
            </div>
          </div>

          <div className="ds-chart-divider"></div>

          <div className="ds-chart-content">
            <div className="ds-pie-chart-wrapper">
              <Pie
                data={typeChartData}
                options={getChartOptions()}
              />
            </div>
          </div>

          <div className="ds-chart-bottom-info ds-category-info">
            {categoryCards.slice(0, 4).map((item) => (
              <div className="ds-category-legend-item" key={item.title}>
                <span className={`ds-dot ${item.color}-dot`}></span>
                <span>{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PAYMENT STATISTICS */}

      <div className="ds-section-heading ds-card-section-heading">
        <div>
          <h2>Payment Statistics</h2>
          <p>Click any card to view its detailed payment records.</p>
        </div>

        <span className="ds-record-badge">
          <i className="bi bi-grid-3x3-gap"></i>
          6 Overview Cards
        </span>
      </div>

      <div className="ds-summary-grid">
        {summaryCards.map((item) => (
          <Link
            to={item.link}
            className="ds-summary-card"
            key={item.title}
          >
            <div className="ds-summary-card-top">
              <div className={`ds-summary-icon ${item.color}`}>
                <i className={`bi ${item.icon}`}></i>
              </div>

              <div className="ds-summary-arrow">
                <i className="bi bi-arrow-up-right"></i>
              </div>
            </div>

            <div className="ds-summary-card-content">
              <span>{item.title}</span>
              <h3>{item.value}</h3>
              <p>{item.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* FEE CATEGORY DETAILS */}

      <div className="ds-section-heading ds-category-section-heading">
        <div>
          <h2>Fee Components</h2>
          <p>
            Overview of the individual fee categories for this period.
          </p>
        </div>
      </div>

      <div className="ds-category-grid">
        {categoryCards.map((item) => (
          <Link
            to={`/FeeComponent/PaymentTable/total/${period}`}
            className="ds-category-card"
            key={item.title}
          >
            <div className={`ds-category-icon ${item.color}`}>
              <i className={`bi ${item.icon}`}></i>
            </div>

            <div className="ds-category-card-content">
              <span>{item.title}</span>
              <h3>{formatCurrency(item.value)}</h3>
            </div>

            <div className="ds-category-arrow">
              <i className="bi bi-arrow-up-right"></i>
            </div>
          </Link>
        ))}
      </div>

      {/* FOOTER */}

      <div className="ds-footer">
        <div>
          <i className="bi bi-info-circle"></i>
          <span>
            Statistics are based on recorded fee data for {period}.
          </span>
        </div>

        <span className="ds-footer-status">
          <span></span>
          Financial Overview
        </span>
      </div>

    </div>
  );
}
