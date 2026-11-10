import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./CreatePost.css";

const BASE_URL =
  "http://localhost/kkblossom/api.php/Adminapi/AdminPosts";

const CreatePost = () => {
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [group, setGroup] = useState("school");
  const [file, setFile] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // LOAD CLASSES
  useEffect(() => {
    axios
      .get(
        "http://localhost/kkblossom/api.php/Adminapi/AdminExam/getClasses"
      )
      .then((res) => {
        setClasses(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Error loading classes:", err);
      });
  }, []);

  // SELECT FILE
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  // REMOVE SELECTED FILE
  const removeFile = () => {
    setFile(null);

    const fileInput = document.getElementById("post-file-input");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // SUBMIT POST
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    if (!text.trim()) {
      setMessage("Please enter a message before creating the post.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("text", text);
      formData.append("recipient_group", group);

      if (file) {
        formData.append("file", file);
      }

      const res = await axios.post(`${BASE_URL}/create`, formData);

      if (res.data.status) {
        setMessage("Post created successfully!");
        setMessageType("success");

        setTimeout(() => {
          navigate("/dashboard/PostComponent/PostView");
        }, 1500);
      } else {
        setMessage("Post creation failed. Please try again.");
        setMessageType("error");
      }
    } catch (err) {
      console.error("Post upload error:", err);

      setMessage("Upload failed. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-cont">
      <div className="post-page-container">

        {/* PAGE HEADER */}
        <div className="post-page-header">
          <div className="post-header-left">
            <div className="post-header-icon">
              <i className="bi bi-megaphone-fill"></i>
            </div>

            <div>
              <h2>Create New Post</h2>
              <p>
                Share announcements, updates and important information
                with your school community.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="post-back-btn"
            onClick={() =>
              navigate("/dashboard/PostComponent/PostView")
            }
          >
            <i className="bi bi-arrow-left"></i>
            Back to Posts
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div className="post-create-layout">

          {/* FORM CARD */}
          <div className="post-crd">
            <div className="post-card-heading">
              <div>
                <h3>Post Details</h3>
                <p>Enter the details you want to share.</p>
              </div>

              <span className="post-required-label">
                * Required
              </span>
            </div>

            <form onSubmit={handleSubmit}>

              {/* MESSAGE */}
              <div className="post-form-group">
                <label htmlFor="post-message">
                  Message <span>*</span>
                </label>

                <textarea
                  id="post-message"
                  className="post-message-input"
                  placeholder="Write your announcement or post here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows="7"
                  maxLength={2000}
                />

                <div className="post-input-footer">
                  <span>
                    <i className="bi bi-info-circle"></i>
                    Keep your message clear and informative.
                  </span>

                  <span className="post-character-count">
                    {text.length}/2000
                  </span>
                </div>
              </div>

              {/* RECIPIENT GROUP */}
              <div className="post-form-group">
                <label htmlFor="post-recipient">
                  Recipient Group <span>*</span>
                </label>

                <div className="post-select-wrapper">
                  <i className="bi bi-people post-field-icon"></i>

                  <select
                    id="post-recipient"
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                  >
                    <option value="school">
                      Entire School
                    </option>

                    {classes.map((c, i) => (
                      <option key={i} value={c.Classname}>
                        {c.Classname}
                      </option>
                    ))}
                  </select>

                  <i className="bi bi-chevron-down post-select-arrow"></i>
                </div>

                <p className="post-field-hint">
                  <i className="bi bi-info-circle"></i>
                  Select the audience that should receive this post.
                </p>
              </div>

              {/* ATTACHMENT */}
              <div className="post-form-group">
                <label>
                  Attach File
                  <span className="post-optional-label">Optional</span>
                </label>

                <div className="post-upload-area">
                  <input
                    id="post-file-input"
                    type="file"
                    onChange={handleFileChange}
                  />

                  <label
                    htmlFor="post-file-input"
                    className="post-upload-label"
                  >
                    <div className="post-upload-icon">
                      <i className="bi bi-cloud-arrow-up"></i>
                    </div>

                    <div className="post-upload-content">
                      <strong>Click to upload a file</strong>
                      <span>
                        Attach a document, image or other file to your post.
                      </span>
                    </div>

                    <span className="post-browse-btn">
                      Browse Files
                    </span>
                  </label>
                </div>

                {/* FILE PREVIEW */}
                {file && (
                  <div className="post-file-preview">
                    <div className="post-file-icon">
                      <i className="bi bi-file-earmark-check"></i>
                    </div>

                    <div className="post-file-details">
                      <strong title={file.name}>{file.name}</strong>
                      <span>
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>

                    <button
                      type="button"
                      className="post-remove-file"
                      onClick={removeFile}
                      title="Remove file"
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                )}
              </div>

              {/* FORM ACTIONS */}
              <div className="post-form-actions">
                <button
                  type="button"
                  className="post-cancel-btn"
                  onClick={() =>
                    navigate("/dashboard/PostComponent/PostView")
                  }
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="post-submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="post-btn-spinner"></span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send-fill"></i>
                      Create Post
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* SIDE INFORMATION */}
          <div className="post-side-panel">
            <div className="post-side-card">
              <div className="post-side-icon">
                <i className="bi bi-megaphone"></i>
              </div>

              <h3>School Communication</h3>

              <p>
                Keep students, parents and staff informed with important
                announcements and updates.
              </p>

              <div className="post-side-divider"></div>

              <div className="post-side-tip">
                <i className="bi bi-check-circle-fill"></i>
                <span>Write a clear and meaningful message.</span>
              </div>

              <div className="post-side-tip">
                <i className="bi bi-check-circle-fill"></i>
                <span>Choose the correct recipient group.</span>
              </div>

              <div className="post-side-tip">
                <i className="bi bi-check-circle-fill"></i>
                <span>Attach supporting files when required.</span>
              </div>
            </div>

            <div className="post-side-note">
              <i className="bi bi-shield-check"></i>
              <div>
                <strong>Before publishing</strong>
                <p>
                  Review your message and selected audience before
                  creating the post.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MESSAGE OVERLAY */}
      {message && (
        <div className="post-message-overlay">
          <div className={`post-message-modal ${messageType}`}>
            <div className="post-message-icon">
              {messageType === "success" ? (
                <i className="bi bi-check-lg"></i>
              ) : (
                <i className="bi bi-exclamation-lg"></i>
              )}
            </div>

            <h3>
              {messageType === "success" ? "Success!" : "Attention"}
            </h3>

            <p className="post-message-text">{message}</p>

            {messageType === "error" && (
              <button
                type="button"
                className="post-message-ok"
                onClick={() => {
                  setMessage("");
                  setMessageType("");
                }}
              >
                Okay, Got it
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;