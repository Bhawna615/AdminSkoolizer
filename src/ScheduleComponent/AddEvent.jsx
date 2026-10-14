
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddEvent.css";

const API =
  "http://localhost/kkblossom/api.php/Adminapi/ScheduleEvents";

export default function AddEvent() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    date: "",
  });

  const [showMessageBox, setShowMessageBox] = useState(false);
  const [messageType, setMessageType] = useState("success");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const response = await axios.post(API + "/insert", form);

      if (
        response.data?.status === false ||
        response.data?.success === false
      ) {
        setMessageType("error");
        setMessage(
          response.data?.message ||
            "Unable to add the event. Please try again."
        );
      } else {
        setMessageType("success");
        setMessage("Event added successfully!");
      }

      setShowMessageBox(true);
    } catch (error) {
      console.error("Add Event Error:", error);

      setMessageType("error");
      setMessage(
        error.response?.data?.message ||
          "Failed to add the event. Please try again."
      );
      setShowMessageBox(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeMessageBox = () => {
    setShowMessageBox(false);

    if (messageType === "success") {
      nav("/dashboard/ScheduleComponent/EventList");
    }
  };

  return (
    <div className="add-event-page">

      {/* TOP HEADER */}
      <div className="add-event-header">
        <div className="add-event-heading">
          <div className="add-event-icon">
            <i className="las la-calendar-plus"></i>
          </div>

          <div>
            <span className="add-event-overline">
              SCHOOL MANAGEMENT
            </span>

            <h1>Create New Event</h1>

            <p>
              Add and schedule a new event for your school
            </p>
          </div>
        </div>

        <button
          type="button"
          className="back-event-btn"
          onClick={() =>
            nav("/dashboard/ScheduleComponent/EventList")
          }
        >
          <i className="las la-arrow-left"></i>
          Back to Events
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="add-event-layout">

        {/* LEFT INFO PANEL */}
        <div className="event-info-panel">

          <div className="info-top-icon">
            <i className="las la-calendar-alt"></i>
          </div>

          <h2>Plan Your Event</h2>

          <p>
            Create a new school event by providing the basic
            details. Students and staff can view the event once
            it has been added.
          </p>

          <div className="info-list">

            <div className="info-item">
              <div className="info-item-icon">
                <i className="las la-heading"></i>
              </div>

              <div>
                <strong>Event Name</strong>
                <span>Give your event a clear title</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-item-icon">
                <i className="las la-align-left"></i>
              </div>

              <div>
                <strong>Description</strong>
                <span>Add useful event information</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-item-icon">
                <i className="las la-calendar-day"></i>
              </div>

              <div>
                <strong>Event Date</strong>
                <span>Select the scheduled date</span>
              </div>
            </div>

          </div>

        </div>

        {/* FORM CARD */}
        <div className="add-event-card">

          <div className="form-card-header">
            <div>
              <span>EVENT DETAILS</span>
              <h2>Event Information</h2>
            </div>

            <div className="form-header-icon">
              <i className="las la-edit"></i>
            </div>
          </div>

          <form onSubmit={submit}>

            {/* EVENT NAME */}
            <div className="event-form-group">

              <label htmlFor="event-name">
                Event Name
                <span>*</span>
              </label>

              <div className="event-input-wrapper">
                <i className="las la-calendar"></i>

                <input
                  id="event-name"
                  type="text"
                  name="name"
                  placeholder="Enter event name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            {/* DATE */}
            <div className="event-form-group">

              <label htmlFor="event-date">
                Event Date
                <span>*</span>
              </label>

              <div className="event-input-wrapper">
                <i className="las la-calendar-day"></i>

                <input
                  id="event-date"
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            {/* DESCRIPTION */}
            <div className="event-form-group">

              <label htmlFor="event-description">
                Description
              </label>

              <div className="event-textarea-wrapper">
                <i className="las la-align-left"></i>

                <textarea
                  id="event-description"
                  name="description"
                  rows="7"
                  placeholder="Write a short description about this event..."
                  value={form.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              <small>
                Add any additional information students or staff
                should know about this event.
              </small>

            </div>

            {/* BUTTONS */}
            <div className="event-form-actions">

              <button
                type="button"
                className="cancel-event-btn"
                onClick={() =>
                  nav("/dashboard/ScheduleComponent/EventList")
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-event-btn"
                disabled={isSubmitting}
              >
                <i className="las la-check"></i>
                {isSubmitting ? "Adding Event..." : "Add Event"}
              </button>

            </div>

          </form>

        </div>

      </div>

      {/* CUSTOM SUCCESS / ERROR MESSAGE BOX */}
      {showMessageBox && (
        <div
          className="add-event-modal-overlay"
          onClick={closeMessageBox}
        >
          <div
            className="add-event-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-event-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`add-event-modal-icon ${messageType}`}
            >
              <i
                className={
                  messageType === "success"
                    ? "las la-check-circle"
                    : "las la-exclamation-circle"
                }
              ></i>
            </div>

            <h3 id="add-event-modal-title">
              {messageType === "success"
                ? "Event Added Successfully"
                : "Unable to Add Event"}
            </h3>

            <p>{message}</p>

            <div className="add-event-modal-actions">
              <button
                type="button"
                className={`add-event-modal-ok-btn ${messageType}`}
                onClick={closeMessageBox}
              >
                {messageType === "success" ? "Continue" : "OK"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
