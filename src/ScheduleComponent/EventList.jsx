
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./EventList.css";

import $ from "jquery";
import "datatables.net-dt";
import "datatables.net-dt/css/dataTables.dataTables.min.css";

const EVENT_LIST_API =
  "http://localhost/kkblossom/api.php/Adminapi/ScheduleEvents";

export default function EventList() {
  const [events, setEvents] = useState([]);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [deleteMessageType, setDeleteMessageType] = useState("confirm");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const tableRef = useRef(null);
  const dataTableRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    axios
      .get(EVENT_LIST_API)
      .then((res) => {
        setEvents(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.log("Error fetching events:", err);
      });
  };

  /* ================================
     DATATABLE
  ================================= */

  useEffect(() => {
    if (!tableRef.current || events.length === 0) return;

    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy();
    }

    dataTableRef.current = $(tableRef.current).DataTable({
      order: [[0, "asc"]],
      responsive: true,
      pageLength: 10,
      lengthMenu: [5, 10, 25, 50],

      dom:
        '<"event-dt-controls"<"event-dt-length"l><"event-dt-search"f>>' +
        "rt" +
        '<"event-dt-footer"<"event-dt-info"i><"event-dt-pagination"p>>',

      language: {
        search: "",
        searchPlaceholder: "Search events...",

        lengthMenu: "_MENU_",

        zeroRecords: "No events found",

        info: "Showing _START_ – _END_ of _TOTAL_ events",

        infoEmpty: "No events available",

        paginate: {
          first: "«",
          last: "»",
          next: "→",
          previous: "←",
        },
      },
    });

    return () => {
      if (
        tableRef.current &&
        $.fn.DataTable.isDataTable(tableRef.current)
      ) {
        $(tableRef.current).DataTable().destroy();
      }

      dataTableRef.current = null;
    };
  }, [events]);

  /* ================================
     DELETE EVENT - CUSTOM POPUP
  ================================= */

  const deleteEvent = (id) => {
    setSelectedEventId(id);
    setDeleteMessageType("confirm");
    setDeleteMessage(
      "Are you sure you want to delete this event? This action cannot be undone."
    );
    setShowDeletePopup(true);
  };

  const confirmDeleteEvent = async () => {
    if (!selectedEventId || deleteLoading) return;

    try {
      setDeleteLoading(true);

      const response = await axios.get(
        `${EVENT_LIST_API}/delete/${selectedEventId}`
      );

      if (
        response.data?.status === false ||
        response.data?.success === false
      ) {
        setDeleteMessageType("error");
        setDeleteMessage(
          response.data?.message ||
            "Failed to delete the event. Please try again."
        );
        return;
      }

      if (
        tableRef.current &&
        $.fn.DataTable.isDataTable(tableRef.current)
      ) {
        $(tableRef.current).DataTable().destroy();
      }

      dataTableRef.current = null;

      setDeleteMessageType("success");
      setDeleteMessage("Event deleted successfully.");

      fetchEvents();
    } catch (err) {
      console.log("Error deleting event:", err);

      setDeleteMessageType("error");
      setDeleteMessage(
        err.response?.data?.message ||
          "Failed to delete the event. Please try again."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const closeDeletePopup = () => {
    if (deleteLoading) return;

    setShowDeletePopup(false);
    setSelectedEventId(null);
  };

  return (
    <div className="event-page">

      {/* =====================================
          TOP HEADER
      ====================================== */}

      <div className="event-header">

        <div className="event-header-left">

          <div className="event-header-icon">
            <i className="las la-calendar"></i>
          </div>

          <div>
            <span className="event-header-label">
              SCHOOL MANAGEMENT
            </span>

            <h1>Events</h1>

            <p>
              Create, organize and manage school events
            </p>
          </div>

        </div>

        <button
          className="event-create-btn"
          onClick={() =>
            navigate("/dashboard/ScheduleComponent/AddEvent")
          }
        >
          <i className="las la-plus"></i>

          <span>Create Event</span>
        </button>

      </div>

      {/* =====================================
          STAT CARDS
      ====================================== */}

      <div className="event-stats">

        <div className="event-stat-card">

          <div className="event-stat-icon purple">
            <i className="las la-calendar-check"></i>
          </div>

          <div>
            <span>Total Events</span>
            <strong>{events.length}</strong>
          </div>

        </div>

        <div className="event-stat-card">

          <div className="event-stat-icon blue">
            <i className="las la-clock"></i>
          </div>

          <div>
            <span>Scheduled</span>
            <strong>{events.length}</strong>
          </div>

        </div>

        <div className="event-stat-card">

          <div className="event-stat-icon green">
            <i className="las la-check-circle"></i>
          </div>

          <div>
            <span>Available</span>
            <strong>{events.length}</strong>
          </div>

        </div>

      </div>

      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <div className="event-content-card">

        {/* CARD HEADER */}

        <div className="event-content-header">

          <div>

            <div className="event-section-title">

              <span className="event-title-line"></span>

              <h2>Scheduled Events</h2>

            </div>

            <p>
              View and manage all upcoming school activities
            </p>

          </div>

          <div className="event-count">
            {events.length}
            <span>Events</span>
          </div>

        </div>

        {/* =====================================
            TABLE
        ====================================== */}

        <div className="event-table-wrapper">

          <table
            ref={tableRef}
            className="event-table display"
          >

            <thead>

              <tr>

                <th>ID</th>

                <th>EVENT</th>

                <th>DESCRIPTION</th>

                <th>DATE</th>

                <th>ACTIONS</th>

              </tr>

            </thead>

            <tbody>

              {events.map((event) => (

                <tr key={event.id}>

                  {/* ID */}

                  <td>

                    <span className="event-number">
                      #{event.id}
                    </span>

                  </td>

                  {/* EVENT */}

                  <td>

                    <a
                      href={`/EventParticipation/view/${event.id}`}
                      className="event-name"
                    >

                      <span className="event-calendar-icon">
                        <i className="las la-calendar-alt"></i>
                      </span>

                      <span>

                        <strong>
                          {event.name}
                        </strong>

                        <small>
                          School Event
                        </small>

                      </span>

                    </a>

                  </td>

                  {/* DESCRIPTION */}

                  <td>

                    <div className="event-description">

                      {event.description || (
                        <span className="no-description">
                          No description available
                        </span>
                      )}

                    </div>

                  </td>

                  {/* DATE */}

                  <td>

                    <div className="event-date">

                      <span className="event-date-icon">
                        <i className="las la-calendar-day"></i>
                      </span>

                      <span>
                        {event.date}
                      </span>

                    </div>

                  </td>

                  {/* ACTIONS */}

                  <td>

                    <div className="event-actions">

                      <button
                        type="button"
                        className="event-action edit"
                        title="Edit Event"
                        onClick={() =>
                          navigate(
                            `/dashboard/ScheduleComponent/EventEdit/${event.id}`
                          )
                        }
                      >
                        <i className="las la-pen"></i>
                      </button>

                      <button
                        type="button"
                        className="event-action delete"
                        title="Delete Event"
                        onClick={() =>
                          deleteEvent(event.id)
                        }
                      >
                        <i className="las la-trash-alt"></i>
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* =====================================
          CUSTOM DELETE CONFIRMATION POPUP
      ====================================== */}

      {showDeletePopup && (
        <div
          className="event-delete-modal-overlay"
          onClick={closeDeletePopup}
        >
          <div
            className="event-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-delete-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`event-delete-modal-icon ${deleteMessageType}`}
            >
              <i
                className={
                  deleteMessageType === "success"
                    ? "las la-check-circle"
                    : deleteMessageType === "error"
                    ? "las la-exclamation-circle"
                    : "las la-calendar-times"
                }
              ></i>
            </div>

            <h3 id="event-delete-modal-title">
              {deleteMessageType === "confirm"
                ? "Confirm Event Deletion"
                : deleteMessageType === "success"
                ? "Deletion Successful"
                : "Unable to Delete"}
            </h3>

            <p>{deleteMessage}</p>

            <div className="event-delete-modal-actions">

              {deleteMessageType === "confirm" && (
                <button
                  type="button"
                  className="event-delete-cancel-btn"
                  onClick={closeDeletePopup}
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
              )}

              <button
                type="button"
                className={`event-delete-confirm-btn ${deleteMessageType}`}
                onClick={() => {
                  if (deleteMessageType === "confirm") {
                    confirmDeleteEvent();
                  } else {
                    closeDeletePopup();
                  }
                }}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <span className="event-delete-spinner"></span>
                    Deleting...
                  </>
                ) : deleteMessageType === "confirm" ? (
                  <>
                    <i className="las la-trash-alt"></i>
                    Confirm Delete
                  </>
                ) : deleteMessageType === "success" ? (
                  "Done"
                ) : (
                  "OK"
                )}
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
