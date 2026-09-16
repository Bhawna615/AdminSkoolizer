import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./EventEdit.css";

const API =
  "http://localhost/kkblossom/api.php/Adminapi/ScheduleEvents";

export default function EventEdit() {
  const { id } = useParams();
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    date: "",
  });

  const [message, setMessage] = useState({
    error: "",
    success: "",
  });

  useEffect(() => {
    axios
      .get(API + "/show/" + id)
      .then((res) => {
        setForm(res.data);
      })
      .catch(() => {
        setMessage({
          error: "Unable to load event details.",
          success: "",
        });
      });
  }, [id]);

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const update = (e) => {
    e.preventDefault();

    axios
      .post(API + "/update/" + id, form)
      .then(() => {
        setMessage({
          success: "Event Updated Successfully!",
          error: "",
        });

        setTimeout(() => {
          nav("/dashboard/ScheduleComponent/EventList");
        }, 1200);
      })
      .catch(() => {
        setMessage({
          error: "Something went wrong!",
          success: "",
        });
      });
  };

  return (
    <div className="event-edit-page">

      {/* HEADER */}
      <div className="event-edit-header">

        <div className="event-edit-heading">
          <div className="event-edit-main-icon">
            <i className="las la-calendar-edit"></i>
          </div>

          <div>
            <span>EVENT MANAGEMENT</span>
            <h1>Edit Event</h1>
            <p>
              Update the details of your scheduled school event
            </p>
          </div>
        </div>

        <button
          type="button"
          className="event-edit-back"
          onClick={() =>
            nav("/dashboard/ScheduleComponent/EventList")
          }
        >
          <i className="las la-arrow-left"></i>
          Back to Events
        </button>

      </div>

      {/* ALERTS */}
      {message.error && (
        <div className="event-alert event-alert-error">
          <div className="event-alert-icon">
            <i className="las la-exclamation-triangle"></i>
          </div>

          <div>
            <strong>Update Failed</strong>
            <p>{message.error}</p>
          </div>
        </div>
      )}

      {message.success && (
        <div className="event-alert event-alert-success">
          <div className="event-alert-icon">
            <i className="las la-check"></i>
          </div>

          <div>
            <strong>Changes Saved</strong>
            <p>{message.success}</p>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div className="event-edit-container">

        {/* EVENT SUMMARY */}
        <div className="event-summary-card">

          <div className="summary-top">
            <div className="summary-calendar">
              <i className="las la-calendar-alt"></i>
            </div>

            <div>
              <span className="summary-label">
                CURRENT EVENT
              </span>

              <h2>
                {form.name || "Event Details"}
              </h2>
            </div>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-info">

            <div className="summary-item">
              <div className="summary-item-icon">
                <i className="las la-hashtag"></i>
              </div>

              <div>
                <span>Event ID</span>
                <strong>#{id}</strong>
              </div>
            </div>

            <div className="summary-item">
              <div className="summary-item-icon">
                <i className="las la-calendar-day"></i>
              </div>

              <div>
                <span>Scheduled Date</span>
                <strong>
                  {form.date || "Not selected"}
                </strong>
              </div>
            </div>

            <div className="summary-item">
              <div className="summary-item-icon">
                <i className="las la-info-circle"></i>
              </div>

              <div>
                <span>Status</span>
                <strong className="active-status">
                  Active
                </strong>
              </div>
            </div>

          </div>

          <div className="summary-note">
            <i className="las la-lightbulb"></i>

            <p>
              Make sure the event information is accurate before
              saving your changes.
            </p>
          </div>

        </div>

        {/* EDIT FORM */}
        <div className="event-edit-card">

          <div className="edit-card-header">
            <div>
              <span>UPDATE INFORMATION</span>
              <h2>Event Details</h2>
            </div>

            <div className="edit-card-badge">
              <i className="las la-pen"></i>
              Editing
            </div>
          </div>

          <form onSubmit={update}>

            {/* NAME */}
            <div className="edit-field">

              <label htmlFor="edit-event-name">
                Event Name
                <b>*</b>
              </label>

              <div className="edit-input">
                <div className="edit-input-icon">
                  <i className="las la-calendar"></i>
                </div>

                <input
                  id="edit-event-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={change}
                  placeholder="Enter event name"
                  required
                />
              </div>

            </div>

            {/* DATE */}
            <div className="edit-field">

              <label htmlFor="edit-event-date">
                Event Date
                <b>*</b>
              </label>

              <div className="edit-input">
                <div className="edit-input-icon">
                  <i className="las la-calendar-day"></i>
                </div>

                <input
                  id="edit-event-date"
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={change}
                  required
                />
              </div>

            </div>

            {/* DESCRIPTION */}
            <div className="edit-field">

              <label htmlFor="edit-event-description">
                Description
              </label>

              <div className="edit-textarea">
                <div className="edit-textarea-icon">
                  <i className="las la-align-left"></i>
                </div>

                <textarea
                  id="edit-event-description"
                  name="description"
                  rows="7"
                  value={form.description}
                  onChange={change}
                  placeholder="Enter event description..."
                ></textarea>
              </div>

              <div className="field-help">
                <i className="las la-info-circle"></i>
                Keep the description clear and informative.
              </div>

            </div>

            {/* ACTIONS */}
            <div className="edit-actions">

              <button
                type="button"
                className="edit-cancel-btn"
                onClick={() =>
                  nav("/dashboard/ScheduleComponent/EventList")
                }
              >
                <i className="las la-times"></i>
                Cancel
              </button>

              <button
                type="submit"
                className="edit-save-btn"
              >
                <i className="las la-save"></i>
                Save Changes
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}