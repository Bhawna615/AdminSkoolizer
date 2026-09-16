import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddTransportStaff.css";

const AddTransportStaff = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    post: "",
    address: "",
    email: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setFormData({
      ...formData,
      image: file,
    });

    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("name", formData.name);
    data.append("contact", formData.contact);
    data.append("post", formData.post);
    data.append("address", formData.address);
    data.append("email", formData.email);

    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost/kkblossom/api.php/Adminapi/AdminTransport/addTransportStaff",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await res.json();

      if (result.status === "success") {
        navigate("/dashboard/TransportComponent/transport-staff", {
          state: { success: "Staff Added Successfully" },
        });
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error adding transport staff:", error);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transport-staff-page">

      {/* PAGE HEADER */}
      <div className="transport-staff-header">

        <div className="transport-staff-header-left">

          <div className="transport-staff-main-icon">
            <i className="las la-user-tie"></i>
          </div>

          <div>
            <span className="transport-staff-eyebrow">
              TRANSPORT MANAGEMENT
            </span>

            <h1>Add Transport Staff</h1>

            <p>
              Register a new member of your school transport team
            </p>
          </div>

        </div>

        <button
          type="button"
          className="transport-staff-back-btn"
          onClick={() =>
            navigate("/dashboard/TransportComponent/transport-staff")
          }
        >
          <i className="las la-arrow-left"></i>
          Back to Staff
        </button>

      </div>

      {/* MAIN CONTENT */}
      <div className="transport-staff-content">

        {/* LEFT INFORMATION CARD */}
        <div className="staff-information-card">

          <div className="staff-info-top">

            <div className="staff-info-icon">
              <i className="las la-users"></i>
            </div>

            <span className="staff-info-label">
              NEW TEAM MEMBER
            </span>

            <h2>
              Add Your
              <br />
              Transport Staff
            </h2>

            <p>
              Keep your school transportation team organized by
              registering drivers, attendants and other transport
              personnel.
            </p>

          </div>

          <div className="staff-info-divider"></div>

          {/* INFORMATION ITEMS */}
          <div className="staff-info-list">

            <div className="staff-info-item">

              <div className="staff-info-item-icon">
                <i className="las la-user"></i>
              </div>

              <div>
                <strong>Staff Identity</strong>
                <span>
                  Add the staff member's name and designation.
                </span>
              </div>

            </div>

            <div className="staff-info-item">

              <div className="staff-info-item-icon">
                <i className="las la-phone"></i>
              </div>

              <div>
                <strong>Contact Details</strong>
                <span>
                  Store phone number and email information.
                </span>
              </div>

            </div>

            <div className="staff-info-item">

              <div className="staff-info-item-icon">
                <i className="las la-map-marker"></i>
              </div>

              <div>
                <strong>Staff Address</strong>
                <span>
                  Keep the staff member's current address updated.
                </span>
              </div>

            </div>

          </div>

          {/* TIP */}
          <div className="staff-info-tip">

            <div className="staff-tip-icon">
              <i className="las la-lightbulb"></i>
            </div>

            <div>
              <strong>Quick Tip</strong>

              <p>
                Upload a clear profile photo so staff can be
                identified easily from the transport directory.
              </p>
            </div>

          </div>

        </div>

        {/* RIGHT FORM CARD */}
        <div className="transport-staff-form-card">

          {/* FORM HEADER */}
          <div className="staff-form-header">

            <div>

              <span>STAFF DETAILS</span>

              <h2>Staff Information</h2>

              <p>
                Enter the details below to register this staff member.
              </p>

            </div>

            <div className="staff-form-header-icon">
              <i className="las la-user-edit"></i>
            </div>

          </div>

          <form onSubmit={handleSubmit}>

            {/* NAME */}
            <div className="staff-form-group">

              <label htmlFor="staff-name">
                Full Name <b>*</b>
              </label>

              <div className="staff-input-wrapper">

                <div className="staff-input-icon">
                  <i className="las la-user"></i>
                </div>

                <input
                  id="staff-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter staff name"
                  required
                />

              </div>

            </div>

            {/* CONTACT + POST */}
            <div className="staff-form-row">

              <div className="staff-form-group">

                <label htmlFor="staff-contact">
                  Contact Number <b>*</b>
                </label>

                <div className="staff-input-wrapper">

                  <div className="staff-input-icon">
                    <i className="las la-phone"></i>
                  </div>

                  <input
                    id="staff-contact"
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="Enter contact number"
                    required
                  />

                </div>

              </div>

              <div className="staff-form-group">

                <label htmlFor="staff-post">
                  Post / Designation <b>*</b>
                </label>

                <div className="staff-input-wrapper">

                  <div className="staff-input-icon">
                    <i className="las la-id-badge"></i>
                  </div>

                  <input
                    id="staff-post"
                    type="text"
                    name="post"
                    value={formData.post}
                    onChange={handleChange}
                    placeholder="e.g. Driver"
                    required
                  />

                </div>

              </div>

            </div>

            {/* ADDRESS */}
            <div className="staff-form-group">

              <label htmlFor="staff-address">
                Address <b>*</b>
              </label>

              <div className="staff-input-wrapper staff-address-wrapper">

                <div className="staff-input-icon staff-address-icon">
                  <i className="las la-map-marker"></i>
                </div>

                <textarea
                  id="staff-address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter complete address"
                  rows="3"
                  required
                ></textarea>

              </div>

            </div>

            {/* EMAIL */}
            <div className="staff-form-group">

              <label htmlFor="staff-email">
                Email Address <b>*</b>
              </label>

              <div className="staff-input-wrapper">

                <div className="staff-input-icon">
                  <i className="las la-envelope"></i>
                </div>

                <input
                  id="staff-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                />

              </div>

            </div>

            {/* IMAGE SECTION */}
            <div className="staff-photo-section">

              <div className="staff-photo-header">

                <div>

                  <label>
                    Profile Photo
                  </label>

                  <small>
                    JPG, PNG or JPEG image
                  </small>

                </div>

                <div className="staff-photo-label-icon">
                  <i className="las la-camera"></i>
                </div>

              </div>

              <div className="staff-photo-upload-area">

                <div className="staff-photo-preview">

                  {preview ? (
                    <img
                      src={preview}
                      alt="Staff Preview"
                    />
                  ) : (
                    <i className="las la-user"></i>
                  )}

                </div>

                <div className="staff-upload-content">

                  <strong>
                    {preview
                      ? "Profile photo selected"
                      : "Upload staff photo"}
                  </strong>

                  <span>
                    Choose a clear image for the staff profile.
                  </span>

                  <label className="staff-upload-btn">

                    <i className="las la-cloud-upload-alt"></i>

                    Choose Image

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />

                  </label>

                </div>

              </div>

            </div>

            {/* LIVE PREVIEW */}
            <div className="staff-profile-preview">

              <div className="profile-preview-avatar">

                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                  />
                ) : (
                  <i className="las la-user-tie"></i>
                )}

              </div>

              <div className="profile-preview-content">

                <span>STAFF PREVIEW</span>

                <strong>
                  {formData.name.trim() || "Staff Member"}
                </strong>

                <p>
                  <span>
                    <i className="las la-id-badge"></i>
                    {formData.post || "Designation"}
                  </span>

                  <span>
                    <i className="las la-phone"></i>
                    {formData.contact || "Contact"}
                  </span>
                </p>

              </div>

            </div>

            {/* BUTTONS */}
            <div className="staff-form-actions">

              <button
                type="button"
                className="staff-cancel-btn"
                onClick={() =>
                  navigate(
                    "/dashboard/TransportComponent/transport-staff"
                  )
                }
              >
                <i className="las la-times"></i>
                Cancel
              </button>

              <button
                type="submit"
                className="staff-submit-btn"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <i className="las la-spinner staff-spinner"></i>
                    Adding Staff...
                  </>
                ) : (
                  <>
                    <i className="las la-user-plus"></i>
                    Add Staff
                  </>
                )}

              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default AddTransportStaff;